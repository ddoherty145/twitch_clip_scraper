import React, { useState } from 'react';
import { Gamepad2, Play, Eye, Calendar } from 'lucide-react';
import { scrapeTopClips } from '../services/api';
import ClipGallery from '../components/ClipGallery';

const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [isLoading, setLoading] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Popular Twitch game categories
  const popularGames = [
    { id: 'Just Chatting', name: 'Just Chatting', box_art_url: '' },
    { id: 'League of Legends', name: 'League of Legends', box_art_url: '' },
    { id: 'Grand Theft Auto V', name: 'Grand Theft Auto V', box_art_url: '' },
    { id: 'Fortnite', name: 'Fortnite', box_art_url: '' },
    { id: 'Valorant', name: 'Valorant', box_art_url: '' },
    { id: 'World of Warcraft', name: 'World of Warcraft', box_art_url: '' },
    { id: 'Minecraft', name: 'Minecraft', box_art_url: '' },
    { id: 'Counter-Strike', name: 'Counter-Strike', box_art_url: '' },
    { id: 'Apex Legends', name: 'Apex Legends', box_art_url: '' },
    { id: 'Deadlock', name: 'Deadlock', box_art_url: '' },
    { id: 'Music', name: 'Music', box_art_url: '' },
    { id: 'Art', name: 'Art', box_art_url: '' },
    { id: 'IRL', name: 'IRL', box_art_url: '' },
    { id: 'Teamfight Tactics', name: 'Teamfight Tactics', box_art_url: '' },
    { id: 'Peak', name: 'Peak', box_art_url: '' },
    { id: 'Hollow Knight', name: 'Hollow Knight', box_art_url: '' },
    { id: 'Marvel Rivals', name: 'Marvel Rivals', box_art_url: '' },
    { id: 'Animals, Aquariums, and Zoos', name: 'Animals, Aquariums, and Zoos', box_art_url: '' },
  ];

  const handleScrapeGame = async () => {
    if (!selectedGame) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await scrapeTopClips({
        days_back: 1,
        limit: 100,
        english_only: true,
        game_filter: selectedGame
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
              <Gamepad2 className="h-6 w-6 md:h-8 md:w-8 text-quaternary" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Game Categories</h1>
          <p className="text-sm md:text-base text-primary max-w-2xl mx-auto px-4">
            Select a game category to discover the top clips from that game. 
            Perfect for finding trending moments and viral content from your favorite games.
          </p>
        </div>

        {/* Game Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary p-6 mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Choose a Game Category</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            {popularGames.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.name)}
                className={`p-3 md:p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedGame === game.name
                    ? 'border-secondary bg-secondary text-quaternary'
                    : 'border-secondary hover:border-tertiary hover:bg-tertiary'
                }`}
              >
                <div className="font-medium text-sm md:text-base">{game.name}</div>
              </button>
            ))}
          </div>

          {selectedGame && (
            <div className="bg-tertiary p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-primary">Selected Game:</h3>
                  <p className="text-primary">{selectedGame}</p>
                </div>
                <button
                  onClick={() => setSelectedGame('')}
                  className="text-secondary hover:text-primary"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button
              onClick={handleScrapeGame}
              disabled={!selectedGame || isLoading}
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
                  <span>Get Top Clips</span>
                </>
              )}
            </button>
            
            <div className="text-sm text-primary">
              <p>Will fetch up to 100 top clips from the last 24 hours</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Game Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary text-center">
            <div className="bg-tertiary p-3 rounded-full w-fit mx-auto mb-3">
              <Gamepad2 className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-1">18+ Categories</h3>
            <p className="text-primary">Popular game categories available</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary text-center">
            <div className="bg-tertiary p-3 rounded-full w-fit mx-auto mb-3">
              <Eye className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-1">100 Clips</h3>
            <p className="text-primary">Top clips per category</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary text-center">
            <div className="bg-tertiary p-3 rounded-full w-fit mx-auto mb-3">
              <Calendar className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-1">24 Hours</h3>
            <p className="text-primary">Fresh content from today</p>
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
                <h3 className="font-semibold text-primary mb-2">Select Game</h3>
                <p className="text-primary text-sm">Choose from popular game categories like League of Legends, Fortnite, or Just Chatting.</p>
              </div>
              <div className="text-center">
                <div className="bg-secondary text-quaternary w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">2</div>
                <h3 className="font-semibold text-primary mb-2">Start Scraping</h3>
                <p className="text-primary text-sm">Click "Get Top Clips" to fetch the most popular clips from the last 24 hours.</p>
              </div>
              <div className="text-center">
                <div className="bg-secondary text-quaternary w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">3</div>
                <h3 className="font-semibold text-primary mb-2">Watch & Stream</h3>
                <p className="text-primary text-sm">Browse clips, use filters, and stream directly in your browser.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
