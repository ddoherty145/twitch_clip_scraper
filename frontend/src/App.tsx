import React from 'react';
import './App.css';
import Header from './components/Header';
import ScrapingInterface from './components/ScrapingInterface';
import JobHistory from './components/JobHistory';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <ScrapingInterface />
          </div>
          <div className="lg:col-span-1">
            <JobHistory />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;