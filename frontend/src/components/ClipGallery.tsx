import React, { useState, useEffect } from 'react';
import { Play, Eye, Calendar, User, Gamepad2, ExternalLink, Filter, Search, X } from 'lucide-react';
import { getJobClips } from '../services/api';

interface Clip {
  id: string;
  url: string;
  embed_url: string;
  title: string;
  creator_name: string;
  broadcaster_name: string;
  channel_name?: string;
  game_name: string;
  view_count: number;
  created_at: string;
  duration: number;
  thumbnail_url: string;
}

interface ClipGalleryProps {
  jobId: number;
}

const ClipGallery: React.FC<ClipGalleryProps> = ({ jobId }) => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [sortBy, setSortBy] = useState<'views' | 'date' | 'duration'>('views');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [iframeTimeout, setIframeTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchClips();
  }, [jobId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (iframeTimeout) {
        clearTimeout(iframeTimeout);
      }
    };
  }, [iframeTimeout]);

  const fetchClips = async () => {
    try {
      setLoading(true);
      const data = await getJobClips(jobId);
      setClips(data.clips || []);
    } catch (err) {
      setError('Failed to load clips');
      console.error('Error fetching clips:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClips = clips
    .filter(clip => {
      const matchesSearch = clip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           clip.creator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           clip.broadcaster_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGame = !gameFilter || clip.game_name === gameFilter;
      return matchesSearch && matchesGame;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.view_count - a.view_count;
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

  const uniqueGames = Array.from(new Set(clips.map(clip => clip.game_name))).sort();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleClipSelection = (clip: Clip) => {
    setSelectedClip(clip);
    setIframeError(false);
    setIframeLoading(true);
    
    // Clear any existing timeout
    if (iframeTimeout) {
      clearTimeout(iframeTimeout);
    }
    
    // Set a timeout to show error if iframe doesn't load within 10 seconds
    const timeout = setTimeout(() => {
      console.log('Iframe loading timeout - showing fallback');
      setIframeError(true);
      setIframeLoading(false);
    }, 10000);
    
    setIframeTimeout(timeout);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchClips}
          className="mt-2 px-4 py-2 bg-secondary text-quaternary rounded-lg hover:bg-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Clip Gallery</h2>
          <p className="text-primary">{clips.length} clips found</p>
        </div>
        {selectedClip && (
          <button
            onClick={() => setSelectedClip(null)}
            className="px-4 py-2 bg-secondary text-quaternary rounded-lg hover:bg-primary"
          >
            Close Player
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-secondary space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
            <input
              type="text"
              placeholder="Search clips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary"
            >
              <option value="">All Games</option>
              {uniqueGames.map(game => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'views' | 'date' | 'duration')}
            className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary"
          >
            <option value="views">Sort by Views</option>
            <option value="date">Sort by Date</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
      </div>

      {/* Selected Clip Player Modal */}
      {selectedClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
            onClick={() => setSelectedClip(null)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-primary truncate pr-4">
                  {selectedClip.title}
                </h3>
                <div className="mt-2 flex items-center space-x-4 text-sm text-primary">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{selectedClip.broadcaster_name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Gamepad2 className="h-4 w-4" />
                    <span>{selectedClip.game_name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatViews(selectedClip.view_count)} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(selectedClip.created_at)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedClip(null)}
                className="ml-4 p-2 text-primary hover:text-secondary hover:bg-tertiary rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Video Player */}
            <div className="relative bg-black">
              <div className="aspect-video">
                {iframeLoading && !iframeError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quaternary mx-auto mb-4"></div>
                      <p>Loading clip...</p>
                    </div>
                  </div>
                )}
                {!iframeError ? (
                  <iframe
                    src={selectedClip.embed_url}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="w-full h-full"
                    title={`Twitch clip: ${selectedClip.title}`}
                    onError={() => {
                      console.log('Iframe failed to load:', selectedClip.embed_url);
                      setIframeError(true);
                      setIframeLoading(false);
                      if (iframeTimeout) {
                        clearTimeout(iframeTimeout);
                      }
                    }}
                    onLoad={() => {
                      console.log('Iframe loaded successfully:', selectedClip.embed_url);
                      setIframeLoading(false);
                      if (iframeTimeout) {
                        clearTimeout(iframeTimeout);
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white p-8">
                    <div className="text-center">
                      <Play className="h-16 w-16 mx-auto mb-4 text-quaternary" />
                      <h3 className="text-xl font-semibold mb-2">Clip Preview Unavailable</h3>
                      <p className="text-gray-300 mb-6 max-w-md">
                        Twitch embeds are blocked in this environment. This is common due to browser security policies. 
                        You can still watch the clip by clicking the button below.
                      </p>
                      <div className="space-y-3">
                        <a
                          href={selectedClip.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-secondary text-quaternary rounded-lg hover:bg-primary transition-colors"
                        >
                          <ExternalLink className="h-5 w-5 mr-2" />
                          Watch on Twitch
                        </a>
                        <div className="text-sm text-gray-400">
                          <p>Or copy this link:</p>
                          <code className="bg-black bg-opacity-50 px-2 py-1 rounded text-xs break-all">
                            {selectedClip.url}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-secondary bg-tertiary">
              <div className="flex items-center justify-between">
                <div className="text-sm text-primary">
                  Duration: {formatDuration(selectedClip.duration)}
                </div>
                <a
                  href={selectedClip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-secondary text-quaternary rounded-lg hover:bg-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Twitch
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClips.map((clip) => (
          <div 
            key={clip.id} 
            className="bg-white rounded-lg border border-secondary overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleClipSelection(clip)}
          >
            <div className="relative">
              <img
                src={clip.thumbnail_url}
                alt={clip.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <div className="bg-secondary text-quaternary p-4 rounded-full hover:bg-primary transition-colors shadow-lg">
                  <Play className="h-8 w-8" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                {formatDuration(clip.duration)}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-primary mb-2 line-clamp-2">
                {clip.title}
              </h3>
              
              <div className="space-y-2 text-sm text-primary">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{clip.broadcaster_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gamepad2 className="h-4 w-4" />
                  <span>{clip.game_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>{formatViews(clip.view_count)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(clip.created_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClipSelection(clip);
                  }}
                  className="flex-1 bg-secondary text-quaternary py-2 px-4 rounded-lg hover:bg-primary transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Play</span>
                </button>
                <a
                  href={clip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 border border-secondary rounded-lg hover:bg-tertiary transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClips.length === 0 && (
        <div className="text-center py-8 text-primary">
          <p>No clips found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ClipGallery;
