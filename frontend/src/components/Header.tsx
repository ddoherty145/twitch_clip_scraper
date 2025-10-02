import React from 'react';
import { Zap, Download } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Twitch Clips Scraper
              </h1>
              <p className="text-gray-600">
                Scrape top clips and channel highlights from Twitch
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Download className="h-4 w-4" />
            <span>Export to Excel</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
