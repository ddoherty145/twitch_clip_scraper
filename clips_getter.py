import requests
import os
from datetime import datetime, timedelta

def get_top_clips(token, days_back=1, limit=50):
    """Fetch top Twitch clips from the past specified days."""

    client_id = os.getenv('TWITCH_CLIENT_ID')

    #Calculate date range
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=days_back)

    #Format dates for the API
    atarted_at = start_time.strftime('%Y-%m-%dT%H:%M:%SZ')
    ended_at = end_time.strftime('%Y-%m-%dT%H:%M:%SZ')

    url = 'https://api.twitch.tv/helix/clips'
    headers = {
        'Client-ID': client_id,
        'Authorization': f'Bearer {token}'
    }
    params = {
        'started_at': atarted_at,
        'ended_at': ended_at,
        'first': limit
    }

    all_clips = []

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        clips = data.get('data', [])

        #Sort clips by view count
        sorted_clips = sorted(clips, key=lambda x: x['view_count'], reverse=True)

        return sorted_clips
    else:
        raise Exception(f"Error fetching clips: {response.status_code} - {response.text}")
    
