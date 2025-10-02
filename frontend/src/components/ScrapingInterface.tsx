import React, { useState } from 'react';
import { Play, Settings, Users, Gamepad2 } from 'lucide-react';
import { scrapeTopClips, scrapeChannelHighlights } from '../services/api';

interface ScrapingConfig {
  type: 'top-clips' | 'channel-highlights';
  daysBack: number;
  limit: number;
  englishOnly: boolean;
  channels: string[];
  clipsPerChannel: number;
}

const ScrapingInterface: React.FC = () => {
  const [config, setConfig] = useState<ScrapingConfig>({
    type: 'top-clips',
    daysBack: 1,
    limit: 150,
    englishOnly: true,
    channels: [],
    clipsPerChannel: 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const [customChannels, setCustomChannels] = useState('');

  const handleStartScraping = async () => {
    setIsLoading(true);
    try {
      if (config.type === 'top-clips') {
        await scrapeTopClips({
          days_back: config.daysBack,
          limit: config.limit,
          english_only: config.englishOnly
        });
      } else {
        const channels = customChannels.split(',').map(c => c.trim()).filter(c => c);
        await scrapeChannelHighlights({
          channels,
          days_back: config.daysBack,
          clips_per_channel: config.clipsPerChannel
        });
      }
    } catch (error) {
      console.error('Scraping failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-5 w-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">Scraping Configuration</h2>
      </div>

      {/* Scraping Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Scraping Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setConfig({ ...config, type: 'top-clips' })}
            className={`p-4 rounded-lg border-2 transition-colors ${
              config.type === 'top-clips'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Gamepad2 className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Top Clips</div>
            <div className="text-sm text-gray-600">Multi-game strategy</div>
          </button>
          <button
            onClick={() => setConfig({ ...config, type: 'channel-highlights' })}
            className={`p-4 rounded-lg border-2 transition-colors ${
              config.type === 'channel-highlights'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Users className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Channel Highlights</div>
            <div className="text-sm text-gray-600">Specific channels</div>
          </button>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days Back
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={config.daysBack}
              onChange={(e) => setConfig({ ...config, daysBack: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.type === 'top-clips' ? 'Max Clips' : 'Clips per Channel'}
            </label>
            <input
              type="number"
              min="1"
              max={config.type === 'top-clips' ? '500' : '100'}
              value={config.type === 'top-clips' ? config.limit : config.clipsPerChannel}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (config.type === 'top-clips') {
                  setConfig({ ...config, limit: value });
                } else {
                  setConfig({ ...config, clipsPerChannel: value });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {config.type === 'top-clips' && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="englishOnly"
              checked={config.englishOnly}
              onChange={(e) => setConfig({ ...config, englishOnly: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="englishOnly" className="text-sm text-gray-700">
              English content only
            </label>
          </div>
        )}

        {config.type === 'channel-highlights' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel Names (comma-separated)
            </label>
            <input
              type="text"
              placeholder="shroud, ninja, pokimane, xqcow"
              value={customChannels}
              onChange={(e) => setCustomChannels(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter Twitch channel names separated by commas
            </p>
          </div>
        )}
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartScraping}
        disabled={isLoading || (config.type === 'channel-highlights' && !customChannels.trim())}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Scraping...</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span>Start Scraping</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ScrapingInterface;
