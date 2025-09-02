import requests
import os
from datetime import datetime, timedelta
import sys
sys.path.append('..')
from shared.auth import get_twitch_headers, make_twitch_request

def get_user_id(token, username):
    """Get Twitch user ID from username"""
    url = 'https://api.twitch.tv/helix/users'
    params = {
        'login': username
    }
    
    try:
        data = make_twitch_request(url, params)
        users = data.get('data', [])
        if users:
            return users[0]['id']
        else:
            raise Exception(f"User '{username}' not found")
    except Exception as e:
        raise Exception(f"Error getting user ID: {e}")

def get_channel_clips(token, channel_names, days_back=1, limit=150):
    """Fetch clips from specific channels"""
    
    # Calculate date range
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=days_back)
    
    # Format dates for API
    started_at = start_time.strftime('%Y-%m-%dT%H:%M:%SZ')
    ended_at = end_time.strftime('%Y-%m-%dT%H:%M:%SZ')
    
    all_clips = []
    
    # Process each channel
    for channel_name in channel_names:
        print(f"🔍 Fetching clips from {channel_name}...")
        
        try:
            # Get user ID for the channel
            broadcaster_id = get_user_id(token, channel_name)
            
            url = 'https://api.twitch.tv/helix/clips'
            params = {
                'broadcaster_id': broadcaster_id,
                'started_at': started_at,
                'ended_at': ended_at,
                'first': min(limit, 100)  # API max is 100 per request
            }
            
            data = make_twitch_request(url, params)
            clips = data.get('data', [])
            
            # Add channel name to each clip for easier identification
            for clip in clips:
                clip['channel_name'] = channel_name
            
            all_clips.extend(clips)
            print(f"✅ Found {len(clips)} clips from {channel_name}")
                
        except Exception as e:
            print(f"❌ Error processing {channel_name}: {e}")
            continue
    
    # Sort all clips by view count
    sorted_clips = sorted(all_clips, key=lambda x: x.get('view_count', 0), reverse=True)
    
    return sorted_clips

def get_top_highlights_by_channel(token, channel_names, days_back=7, clips_per_channel=10):
    """Get top highlights from each channel separately"""
    
    highlights_by_channel = {}
    
    for channel_name in channel_names:
        print(f"🔍 Fetching highlights from {channel_name}...")
        
        try:
            # Get clips for this specific channel
            channel_clips = get_channel_clips(token, [channel_name], days_back, clips_per_channel)
            
            if channel_clips:
                highlights_by_channel[channel_name] = channel_clips
                print(f"✅ Found {len(channel_clips)} highlights from {channel_name}")
            else:
                print(f"⚠️ No highlights found for {channel_name}")
                highlights_by_channel[channel_name] = []
                
        except Exception as e:
            print(f"❌ Error getting highlights from {channel_name}: {e}")
            highlights_by_channel[channel_name] = []
    
    return highlights_by_channel