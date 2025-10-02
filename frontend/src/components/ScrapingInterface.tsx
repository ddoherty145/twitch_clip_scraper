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
    <div className="bg-white rounded-lg shadow-sm border border-secondary p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-5 w-5 text-secondary" />
        <h2 className="text-xl font-semibold text-primary">Scraping Configuration</h2>
      </div>

      {/* Scraping Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-primary mb-3">
          Scraping Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setConfig({ ...config, type: 'top-clips' })}
            className={`p-3 md:p-4 rounded-lg border-2 transition-colors ${
              config.type === 'top-clips'
                ? 'border-secondary bg-secondary text-quaternary'
                : 'border-secondary hover:border-tertiary'
            }`}
          >
            <Gamepad2 className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2" />
            <div className="font-medium text-sm md:text-base">Top Clips</div>
            <div className="text-xs md:text-sm text-primary">Multi-game strategy</div>
          </button>
          <button
            onClick={() => setConfig({ ...config, type: 'channel-highlights' })}
            className={`p-3 md:p-4 rounded-lg border-2 transition-colors ${
              config.type === 'channel-highlights'
                ? 'border-secondary bg-secondary text-quaternary'
                : 'border-secondary hover:border-tertiary'
            }`}
          >
            <Users className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2" />
            <div className="font-medium text-sm md:text-base">Channel Highlights</div>
            <div className="text-xs md:text-sm text-primary">Specific channels</div>
          </button>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Days Back
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={config.daysBack}
              onChange={(e) => setConfig({ ...config, daysBack: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
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
              className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary text-sm md:text-base"
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
              className="h-4 w-4 text-secondary focus:ring-tertiary border-secondary rounded"
            />
            <label htmlFor="englishOnly" className="text-sm text-primary">
              English content only
            </label>
          </div>
        )}

        {config.type === 'channel-highlights' && (
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Channel Names (comma-separated)
            </label>
            <input
              type="text"
              placeholder="shroud, ninja, pokimane, xqcow"
              value={customChannels}
              onChange={(e) => setCustomChannels(e.target.value)}
              className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
            <p className="text-xs text-primary mt-1">
              Enter Twitch channel names separated by commas
            </p>
          </div>
        )}
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartScraping}
        disabled={isLoading || (config.type === 'channel-highlights' && !customChannels.trim())}
        className="w-full bg-secondary text-quaternary py-3 px-4 rounded-lg font-medium hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-quaternary"></div>
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
