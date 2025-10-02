import React from 'react';
import ScrapingInterface from '../components/ScrapingInterface';
import JobHistory from '../components/JobHistory';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-quaternary">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Scraping Interface */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-4">
              <div className="bg-white rounded-lg shadow-sm border border-secondary p-4 md:p-6">
                <ScrapingInterface />
              </div>
            </div>
          </div>

          {/* Job History */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <JobHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
