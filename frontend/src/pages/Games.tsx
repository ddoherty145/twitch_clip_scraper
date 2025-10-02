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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Game Categories</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a game category to discover the top clips from that game. 
            Perfect for finding trending moments and viral content from your favorite games.
          </p>
        </div>

        {/* Game Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose a Game Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {popularGames.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.name)}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedGame === game.name
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm">{game.name}</div>
              </button>
            ))}
          </div>

          {selectedGame && (
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-900">Selected Game:</h3>
                  <p className="text-purple-700">{selectedGame}</p>
                </div>
                <button
                  onClick={() => setSelectedGame('')}
                  className="text-purple-600 hover:text-purple-800"
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
              className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Scraping...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Get Top Clips</span>
                </>
              )}
            </button>
            
            <div className="text-sm text-gray-600">
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
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-3">
              <Gamepad2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">18+ Categories</h3>
            <p className="text-gray-600">Popular game categories available</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-3">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">100 Clips</h3>
            <p className="text-gray-600">Top clips per category</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">24 Hours</h3>
            <p className="text-gray-600">Fresh content from today</p>
          </div>
        </div>

        {/* Clips Display */}
        {currentJobId && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <ClipGallery jobId={currentJobId} />
          </div>
        )}

        {/* Instructions */}
        {!currentJobId && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Select Game</h3>
                <p className="text-gray-600 text-sm">Choose from popular game categories like League of Legends, Fortnite, or Just Chatting.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Scraping</h3>
                <p className="text-gray-600 text-sm">Click "Get Top Clips" to fetch the most popular clips from the last 24 hours.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">Watch & Stream</h3>
                <p className="text-gray-600 text-sm">Browse clips, use filters, and stream directly in your browser.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
