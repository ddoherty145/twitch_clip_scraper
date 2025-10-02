import React from 'react';
import { Zap, Github, ExternalLink, Users, Gamepad2, BarChart3 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-600 p-4 rounded-2xl">
              <Zap className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Twitch Clips Scraper
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A powerful web application that scrapes, displays, and streams the best Twitch clips 
            from top games and channels. Discover viral moments, trending content, and popular 
            streamers all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
              <Gamepad2 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Game Strategy</h3>
            <p className="text-gray-600">
              Scrape top clips across 20+ popular game categories including League of Legends, 
              Fortnite, Valorant, and more.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Channel Highlights</h3>
            <p className="text-gray-600">
              Target specific channels and discover their best moments with customizable 
              time periods and clip limits.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">
              Track view counts, engagement metrics, and trending content with live 
              progress monitoring and statistics.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure</h3>
              <p className="text-gray-600">Choose your scraping mode, set parameters like time range and clip limits, and select target games or channels.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scrape</h3>
              <p className="text-gray-600">Our system connects to the Twitch API and collects the top clips based on your configuration with real-time progress tracking.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stream</h3>
              <p className="text-gray-600">Browse, search, and stream clips directly in your browser with embedded Twitch players and advanced filtering.</p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-3">
                <span className="text-2xl font-bold text-blue-600">⚛️</span>
              </div>
              <h3 className="font-semibold text-gray-900">React</h3>
              <p className="text-sm text-gray-600">Frontend Framework</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-3">
                <span className="text-2xl font-bold text-green-600">🐍</span>
              </div>
              <h3 className="font-semibold text-gray-900">Python</h3>
              <p className="text-sm text-gray-600">Backend API</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-3">
                <span className="text-2xl font-bold text-purple-600">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900">Flask</h3>
              <p className="text-sm text-gray-600">Web Framework</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-100 p-4 rounded-lg mb-3">
                <span className="text-2xl font-bold text-cyan-600">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900">Tailwind</h3>
              <p className="text-sm text-gray-600">CSS Framework</p>
            </div>
          </div>
        </div>

        {/* API Information */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Twitch API Integration</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 mb-6 text-center">
              This application uses the official Twitch API to fetch clips and metadata. 
              All data is retrieved in real-time and respects Twitch's rate limits and terms of service.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">API Endpoints Used:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <code className="bg-gray-200 px-2 py-1 rounded">/helix/clips</code> - Fetch clips data</li>
                <li>• <code className="bg-gray-200 px-2 py-1 rounded">/helix/games</code> - Get game information</li>
                <li>• <code className="bg-gray-200 px-2 py-1 rounded">/helix/users</code> - Retrieve user data</li>
                <li>• <code className="bg-gray-200 px-2 py-1 rounded">/oauth2/token</code> - Authentication</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500">
          <p className="mb-2">
            Built with ❤️ for the Twitch community
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-500 hover:text-purple-600 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://dev.twitch.tv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-500 hover:text-purple-600 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Twitch API</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
