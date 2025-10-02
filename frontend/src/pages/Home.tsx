import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Gamepad2, Users, BarChart3, ArrowRight } from 'lucide-react';
import ScrapingInterface from '../components/ScrapingInterface';
import JobHistory from '../components/JobHistory';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover the Best Twitch Clips
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Scrape, browse, and stream the most popular Twitch clips from top games and channels. 
            Find viral moments, trending content, and discover new streamers.
          </p>
          
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              to="/games"
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow group"
            >
              <div className="bg-purple-100 p-3 rounded-lg w-fit mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Gamepad2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse by Game</h3>
              <p className="text-gray-600 text-sm mb-4">
                Explore top clips from popular game categories like League of Legends, Fortnite, and more.
              </p>
              <div className="flex items-center text-purple-600 group-hover:text-purple-700">
                <span className="text-sm font-medium">Explore Games</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </Link>

            <Link
              to="/highlights"
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow group"
            >
              <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Channel Highlights</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the best moments from your favorite streamers like shroud, ninja, and pokimane.
              </p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                <span className="text-sm font-medium">View Highlights</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </Link>

            <Link
              to="/about"
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow group"
            >
              <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Learn More</h3>
              <p className="text-gray-600 text-sm mb-4">
                Discover how our Twitch clips scraper works and explore the technology behind it.
              </p>
              <div className="flex items-center text-green-600 group-hover:text-green-700">
                <span className="text-sm font-medium">About Us</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Scraping Interface */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Play className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Quick Scrape</h2>
              </div>
              <ScrapingInterface />
            </div>
          </div>

          {/* Job History */}
          <div className="xl:col-span-2">
            <JobHistory />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-4">
                <Play className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stream Directly</h3>
              <p className="text-gray-600 text-sm">Watch clips with embedded Twitch players - no downloads needed.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Data</h3>
              <p className="text-gray-600 text-sm">Get the latest clips with live progress tracking and updates.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                <Gamepad2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Game Support</h3>
              <p className="text-gray-600 text-sm">Browse clips from 20+ popular game categories.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Channel Focused</h3>
              <p className="text-gray-600 text-sm">Target specific streamers and discover their best moments.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
