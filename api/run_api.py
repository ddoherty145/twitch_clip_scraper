#!/usr/bin/env python3
"""
Startup script for Twitch Clips Scraper API
"""

import os
import sys

# Add parent directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Change to the API directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Import and run the Flask app
from app import app

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
