"""
Flask API backend for Twitch Clips Scraper
Exposes Python functionality as REST API endpoints
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
import json
from datetime import datetime
import threading
import time

# Add parent directory to path to import modules
sys.path.append('..')

from shared.auth import get_twitch_token, validate_environment
from clip_scraper.clips_getter import get_top_clips
from clip_scraper.excel_generator import create_clips_excel
from highlight_scraper.highlights_getter import get_top_highlights_by_channel
from highlight_scraper.excel_generator import create_highlights_excel
from highlight_scraper.channel_config import get_preset, list_presets, DEFAULT_CONFIG

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global state for tracking scraping jobs
scraping_jobs = {}
job_counter = 0

class ScrapingJob:
    def __init__(self, job_type, config):
        global job_counter
        job_counter += 1
        self.id = job_counter
        self.job_type = job_type  # 'top_clips' or 'channel_highlights'
        self.config = config
        self.status = 'pending'  # pending, running, completed, failed
        self.progress = 0
        self.result = None
        self.error = None
        self.created_at = datetime.now()
        self.completed_at = None
        self.output_file = None

    def to_dict(self):
        return {
            'id': self.id,
            'job_type': self.job_type,
            'config': self.config,
            'status': self.status,
            'progress': self.progress,
            'result': self.result,
            'error': self.error,
            'created_at': self.created_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'output_file': self.output_file
        }

def run_top_clips_job(job):
    """Run top clips scraping job in background thread"""
    try:
        job.status = 'running'
        job.progress = 10
        
        # Get authentication token
        token = get_twitch_token()
        job.progress = 20
        
        # Extract config
        days_back = job.config.get('days_back', 1)
        limit = job.config.get('limit', 150)
        english_only = job.config.get('english_only', True)
        game_filter = job.config.get('game_filter', None)
        
        job.progress = 30
        
        # Get clips
        clips = get_top_clips(
            token=token,
            days_back=days_back,
            limit=limit,
            strategy='mixed',
            english_only=english_only,
            game_filter=game_filter
        )
        
        job.progress = 80
        
        if not clips:
            job.status = 'failed'
            job.error = 'No clips found for the specified period'
            return
        
        # Update job with results (no Excel generation)
        job.status = 'completed'
        job.progress = 100
        job.result = {
            'total_clips': len(clips),
            'clips': clips,  # Return all clips data
            'top_clip': clips[0] if clips else None,
            'game_breakdown': {}
        }
        
        # Calculate game breakdown
        game_counts = {}
        for clip in clips:
            game = clip.get('game_name', 'Unknown')
            game_counts[game] = game_counts.get(game, 0) + 1
        
        job.result['game_breakdown'] = dict(sorted(game_counts.items(), key=lambda x: x[1], reverse=True))
        job.completed_at = datetime.now()
        
    except Exception as e:
        job.status = 'failed'
        job.error = str(e)
        job.completed_at = datetime.now()

def run_channel_highlights_job(job):
    """Run channel highlights scraping job in background thread"""
    try:
        job.status = 'running'
        job.progress = 10
        
        # Get authentication token
        token = get_twitch_token()
        job.progress = 20
        
        # Extract config
        channels = job.config.get('channels', [])
        days_back = job.config.get('days_back', 7)
        clips_per_channel = job.config.get('clips_per_channel', 10)
        
        job.progress = 30
        
        # Get highlights
        highlights_data = get_top_highlights_by_channel(
            token,
            channels,
            days_back=days_back,
            clips_per_channel=clips_per_channel
        )
        
        job.progress = 80
        
        total_clips = sum(len(clips) for clips in highlights_data.values())
        if total_clips == 0:
            job.status = 'failed'
            job.error = 'No highlights found for any channels'
            return
        
        # Update job with results (no Excel generation)
        job.status = 'completed'
        job.progress = 100
        
        # Flatten all clips into a single list for display
        all_clips = []
        for channel, clips in highlights_data.items():
            for clip in clips:
                clip['channel_name'] = channel
                all_clips.append(clip)
        
        # Sort by view count
        all_clips.sort(key=lambda x: x.get('view_count', 0), reverse=True)
        
        job.result = {
            'total_clips': total_clips,
            'clips': all_clips,  # Return all clips data
            'channels': {channel: len(clips) for channel, clips in highlights_data.items()},
            'highlights_data': highlights_data
        }
        job.completed_at = datetime.now()
        
    except Exception as e:
        job.status = 'failed'
        job.error = str(e)
        job.completed_at = datetime.now()

# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Validate environment
        env_valid = validate_environment()
        if not env_valid:
            return jsonify({'status': 'error', 'message': 'Environment not configured'}), 500
        
        # Test authentication
        token = get_twitch_token()
        return jsonify({
            'status': 'healthy',
            'message': 'API is running',
            'auth_status': 'valid' if token else 'invalid'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/presets', methods=['GET'])
def get_presets():
    """Get available preset configurations"""
    try:
        presets = list_presets()
        return jsonify({'presets': presets})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/presets/<preset_name>', methods=['GET'])
def get_preset_config(preset_name):
    """Get specific preset configuration"""
    try:
        config = get_preset(preset_name)
        return jsonify({'preset': preset_name, 'config': config})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/scrape/top-clips', methods=['POST'])
def start_top_clips_scrape():
    """Start top clips scraping job"""
    try:
        config = request.json or {}
        
        # Validate config
        days_back = config.get('days_back', 1)
        limit = config.get('limit', 150)
        english_only = config.get('english_only', True)
        
        if not isinstance(days_back, int) or days_back < 1 or days_back > 30:
            return jsonify({'error': 'days_back must be between 1 and 30'}), 400
        
        if not isinstance(limit, int) or limit < 1 or limit > 500:
            return jsonify({'error': 'limit must be between 1 and 500'}), 400
        
        # Create job
        job = ScrapingJob('top_clips', config)
        scraping_jobs[job.id] = job
        
        # Start background thread
        thread = threading.Thread(target=run_top_clips_job, args=(job,))
        thread.daemon = True
        thread.start()
        
        return jsonify({'job_id': job.id, 'status': 'started'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/scrape/channel-highlights', methods=['POST'])
def start_channel_highlights_scrape():
    """Start channel highlights scraping job"""
    try:
        config = request.json or {}
        
        # Validate config
        channels = config.get('channels', [])
        if not channels or not isinstance(channels, list):
            return jsonify({'error': 'channels must be a non-empty list'}), 400
        
        days_back = config.get('days_back', 7)
        clips_per_channel = config.get('clips_per_channel', 10)
        
        if not isinstance(days_back, int) or days_back < 1 or days_back > 30:
            return jsonify({'error': 'days_back must be between 1 and 30'}), 400
        
        if not isinstance(clips_per_channel, int) or clips_per_channel < 1 or clips_per_channel > 100:
            return jsonify({'error': 'clips_per_channel must be between 1 and 100'}), 400
        
        # Create job
        job = ScrapingJob('channel_highlights', config)
        scraping_jobs[job.id] = job
        
        # Start background thread
        thread = threading.Thread(target=run_channel_highlights_job, args=(job,))
        thread.daemon = True
        thread.start()
        
        return jsonify({'job_id': job.id, 'status': 'started'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/<int:job_id>', methods=['GET'])
def get_job_status(job_id):
    """Get job status and progress"""
    if job_id not in scraping_jobs:
        return jsonify({'error': 'Job not found'}), 404
    
    job = scraping_jobs[job_id]
    return jsonify(job.to_dict())

@app.route('/api/jobs', methods=['GET'])
def list_jobs():
    """List all jobs"""
    jobs = [job.to_dict() for job in scraping_jobs.values()]
    return jsonify({'jobs': jobs})

@app.route('/api/jobs/<int:job_id>/clips', methods=['GET'])
def get_job_clips(job_id):
    """Get clips data from a completed job"""
    if job_id not in scraping_jobs:
        return jsonify({'error': 'Job not found'}), 404
    
    job = scraping_jobs[job_id]
    if job.status != 'completed' or not job.result:
        return jsonify({'error': 'Job not completed or no results available'}), 400
    
    return jsonify({
        'job_id': job_id,
        'clips': job.result.get('clips', []),
        'total_clips': job.result.get('total_clips', 0),
        'game_breakdown': job.result.get('game_breakdown', {}),
        'channels': job.result.get('channels', {})
    })

@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    """Delete a job"""
    if job_id not in scraping_jobs:
        return jsonify({'error': 'Job not found'}), 404
    
    del scraping_jobs[job_id]
    return jsonify({'message': 'Job deleted'})

if __name__ == '__main__':
    # Validate environment before starting
    if not validate_environment():
        print("❌ Environment validation failed. Please check your .env file.")
        sys.exit(1)
    
    print("🚀 Starting Twitch Clips Scraper API...")
    print("📡 API will be available at: http://localhost:5000")
    print("🔗 Health check: http://localhost:5000/api/health")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
