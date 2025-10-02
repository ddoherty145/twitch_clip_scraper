import React, { useState, useEffect } from 'react';
import { Play, Eye, Calendar, User, Gamepad2, ExternalLink, Filter, Search } from 'lucide-react';
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

  useEffect(() => {
    fetchClips();
  }, [jobId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchClips}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
          <h2 className="text-2xl font-bold text-gray-900">Clip Gallery</h2>
          <p className="text-gray-600">{clips.length} clips found</p>
        </div>
        {selectedClip && (
          <button
            onClick={() => setSelectedClip(null)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close Player
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="views">Sort by Views</option>
            <option value="date">Sort by Date</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
      </div>

      {/* Selected Clip Player */}
      {selectedClip && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">{selectedClip.title}</h3>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={selectedClip.embed_url}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
              title={`Twitch clip: ${selectedClip.title}`}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>{formatViews(selectedClip.view_count)} views</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{selectedClip.broadcaster_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-4 w-4" />
              <span>{selectedClip.game_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(selectedClip.created_at)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Clips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClips.map((clip) => (
          <div key={clip.id} className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={clip.thumbnail_url}
                alt={clip.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => setSelectedClip(clip)}
                  className="opacity-0 hover:opacity-100 transition-opacity duration-200 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700"
                >
                  <Play className="h-6 w-6" />
                </button>
              </div>
              <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                {formatDuration(clip.duration)}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {clip.title}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
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
                  onClick={() => setSelectedClip(clip)}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Play</span>
                </button>
                <a
                  href={clip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClips.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No clips found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ClipGallery;
