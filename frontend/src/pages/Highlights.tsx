import React, { useState } from 'react';
import { Users, Play, Eye, Calendar, Plus, X } from 'lucide-react';
import { scrapeChannelHighlights } from '../services/api';
import ClipGallery from '../components/ClipGallery';

const Highlights: React.FC = () => {
  const [channels, setChannels] = useState<string[]>([]);
  const [newChannel, setNewChannel] = useState('');
  const [daysBack, setDaysBack] = useState(7);
  const [clipsPerChannel, setClipsPerChannel] = useState(20);
  const [isLoading, setLoading] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Popular Twitch channels
  const popularChannels = [
    'shroud', 'ninja', 'pokimane', 'xqcow', 'asmongold', 'summit1g',
    'lirik', 'sodapoppin', 'hasanabi', 'mizkif', 'amouranth', 's1mple',
    'tarik', 'stewie2k', 'scream', 'tenz', 'sinatraa', 'aceu'
  ];

  const addChannel = () => {
    const channel = newChannel.trim().toLowerCase();
    if (channel && !channels.includes(channel)) {
      setChannels([...channels, channel]);
      setNewChannel('');
    }
  };

  const removeChannel = (channelToRemove: string) => {
    setChannels(channels.filter(channel => channel !== channelToRemove));
  };

  const addPopularChannel = (channel: string) => {
    if (!channels.includes(channel)) {
      setChannels([...channels, channel]);
    }
  };

  const handleScrapeHighlights = async () => {
    if (channels.length === 0) {
      setError('Please add at least one channel');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await scrapeChannelHighlights({
        channels,
        days_back: daysBack,
        clips_per_channel: clipsPerChannel
      });
      
      setCurrentJobId(response.job_id);
    } catch (err) {
      setError('Failed to start scraping job');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-quaternary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary p-3 rounded-lg">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-quaternary" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Channel Highlights</h1>
          <p className="text-sm md:text-base text-primary max-w-2xl mx-auto px-4">
            Discover the best moments from your favorite Twitch streamers. 
            Add channels and get their top highlights from recent streams.
          </p>
        </div>

        {/* Channel Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary p-6 mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Configure Channels</h2>
          
          {/* Add Channel Input */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
            <input
              type="text"
              placeholder="Enter channel name (e.g., shroud)"
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addChannel()}
              className="flex-1 px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary text-sm md:text-base"
            />
            <button
              onClick={addChannel}
              className="bg-secondary text-quaternary px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Selected Channels */}
          {channels.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-primary mb-2">Selected Channels ({channels.length})</h3>
              <div className="flex flex-wrap gap-2">
                {channels.map((channel) => (
                  <div
                    key={channel}
                    className="bg-tertiary text-primary px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{channel}</span>
                    <button
                      onClick={() => removeChannel(channel)}
                      className="text-secondary hover:text-primary"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Channels */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-primary mb-2">Popular Channels</h3>
            <div className="flex flex-wrap gap-2">
              {popularChannels.map((channel) => (
                <button
                  key={channel}
                  onClick={() => addPopularChannel(channel)}
                  disabled={channels.includes(channel)}
                  className={`px-3 py-1 rounded-full text-xs md:text-sm transition-colors ${
                    channels.includes(channel)
                      ? 'bg-tertiary text-primary cursor-not-allowed'
                      : 'bg-tertiary text-primary hover:bg-secondary hover:text-quaternary'
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Days Back
              </label>
              <select
                value={daysBack}
                onChange={(e) => setDaysBack(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary text-sm md:text-base"
              >
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Clips per Channel
              </label>
              <select
                value={clipsPerChannel}
                onChange={(e) => setClipsPerChannel(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary text-sm md:text-base"
              >
                <option value={5}>5 clips</option>
                <option value={10}>10 clips</option>
                <option value={20}>20 clips</option>
                <option value={50}>50 clips</option>
                <option value={100}>100 clips</option>
              </select>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleScrapeHighlights}
              disabled={channels.length === 0 || isLoading}
              className="bg-secondary text-quaternary py-3 px-6 rounded-lg font-medium hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-quaternary"></div>
                  <span>Scraping...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Get Highlights</span>
                </>
              )}
            </button>
            
            <div className="text-sm text-primary">
              <p>Will fetch highlights from {channels.length} channel{channels.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary text-center">
            <div className="bg-tertiary p-3 rounded-full w-fit mx-auto mb-3">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-1">{channels.length} Channels</h3>
            <p className="text-primary">Selected for highlights</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary text-center">
            <div className="bg-tertiary p-3 rounded-full w-fit mx-auto mb-3">
              <Eye className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-1">{clipsPerChannel * channels.length} Clips</h3>
            <p className="text-primary">Total clips to fetch</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary text-center">
            <div className="bg-tertiary p-3 rounded-full w-fit mx-auto mb-3">
              <Calendar className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-1">{daysBack} Days</h3>
            <p className="text-primary">Looking back in time</p>
          </div>
        </div>

        {/* Clips Display */}
        {currentJobId && (
          <div className="bg-white rounded-lg shadow-sm border border-secondary p-6">
            <ClipGallery jobId={currentJobId} />
          </div>
        )}

        {/* Instructions */}
        {!currentJobId && (
          <div className="bg-white rounded-lg shadow-sm border border-secondary p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-secondary text-quaternary w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">1</div>
                <h3 className="font-semibold text-primary mb-2">Add Channels</h3>
                <p className="text-primary text-sm">Type channel names or click popular channels to add them to your list.</p>
              </div>
              <div className="text-center">
                <div className="bg-secondary text-quaternary w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">2</div>
                <h3 className="font-semibold text-primary mb-2">Configure Settings</h3>
                <p className="text-primary text-sm">Set how many days back to look and how many clips per channel to fetch.</p>
              </div>
              <div className="text-center">
                <div className="bg-secondary text-quaternary w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">3</div>
                <h3 className="font-semibold text-primary mb-2">Get Highlights</h3>
                <p className="text-primary text-sm">Click "Get Highlights" to fetch and stream the best moments from your channels.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Highlights;
