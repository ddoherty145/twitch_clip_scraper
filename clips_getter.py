import requests
import os
from datetime import datetime, timedelta
import time

def get_game_id_by_name(token, game_name):
    """Get game ID by game name"""
    client_id = os.getenv('TWITCH_CLIENT_ID')
    
    url = 'https://api.twitch.tv/helix/games'
    headers = {
        'Client-ID': client_id,
        'Authorization': f'Bearer {token}'
    }
    params = {'name': game_name}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            games = response.json().get('data', [])
            return games[0]['id'] if games else None
        else:
            print(f"⚠️ Couldn't find game '{game_name}': {response.status_code}")
            return None
    except Exception as e:
        print(f"⚠️ Error looking up game '{game_name}': {e}")
        return None

def get_clips_by_game(token, game_name, days_back=1, limit=15):
    """Get clips from a specific game"""
    print(f"🎮 Fetching clips for: {game_name}")
    
    # Get game ID first
    game_id = get_game_id_by_name(token, game_name)
    if not game_id:
        print(f"❌ Skipping '{game_name}' - game not found")
        return []
    
    client_id = os.getenv('TWITCH_CLIENT_ID')
    
    # Calculate date range
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=days_back)
    
    started_at = start_time.strftime('%Y-%m-%dT%H:%M:%SZ')
    ended_at = end_time.strftime('%Y-%m-%dT%H:%M:%SZ')

    url = 'https://api.twitch.tv/helix/clips'
    headers = {
        'Client-ID': client_id,
        'Authorization': f'Bearer {token}'
    }
    params = {
        'game_id': game_id,
        'started_at': started_at,
        'ended_at': ended_at,
        'first': limit  # Get more clips per game for better selection
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            clips = data.get('data', [])
            
            # Add game name to each clip for easier identification
            for clip in clips:
                clip['game_name'] = game_name
            
            print(f"✅ {game_name}: Found {len(clips)} clips")
            return clips
        elif response.status_code == 429:
            print(f"⏱️ Rate limited, waiting 60 seconds...")
            time.sleep(60)
            return get_clips_by_game(token, game_name, days_back, limit)  # Retry
        else:
            print(f"⚠️ Error fetching clips for {game_name}: {response.status_code}")
            return []
    except Exception as e:
        print(f"⚠️ Exception fetching clips for {game_name}: {e}")
        return []

def get_top_clips(token, days_back=1, limit=50, strategy='mixed'):
    """
    Get top clips from multiple popular games
    
    This strategy fetches clips from various popular game categories
    to ensure a diverse mix of the day's best content
    """
    
    # Comprehensive list of popular Twitch categories
    # Mix of games and non-gaming content for maximum variety
    popular_games = [
        # Always popular
        'Just Chatting',           # Largest category on Twitch
        'League of Legends',       # Massive esports scene
        'Grand Theft Auto V',      # RP content very popular
        'Fortnite',               # Battle royale king
        'Valorant',               # Competitive FPS
        
        # Consistently high viewership
        'World of Warcraft',       # MMO classic
        'Minecraft',              # Creative content goldmine  
        'Counter-Strike',       # FPS esports
        'Apex Legends',           # Battle royale alternative
        'Deadlock',  # Popular shooter
        
        # Variety content
        'Music',                  # Music streams
        'Art',                    # Creative content
        'Slots',                  # Gambling content (often viral)
        'IRL',                    # In Real Life streams
        'Teamfight Tactics',      # Auto-battler
        
        # Trending games (adjust based on current meta)
        'Peak',                 # MOBA alternative
        'Hollow Knight',            # Hero shooter
        'Waterpark Simulator',          # Esports favorite
        'Minecraft',       # Horror multiplayer
        'Marvel Rivals'               # Party game
    ]
    
    print(f"🎯 Using Multiple Games Strategy")
    print(f"📊 Targeting {len(popular_games)} game categories")
    print(f"⏰ Looking for clips from the last {days_back} day(s)")
    
    all_clips = []
    successful_games = 0
    clips_per_game = max(8, limit // len(popular_games))  # Dynamic clips per game
    
    print(f"🔢 Aiming for ~{clips_per_game} clips per game")
    print("-" * 50)
    
    for i, game_name in enumerate(popular_games, 1):
        print(f"[{i}/{len(popular_games)}] ", end="")
        
        try:
            clips = get_clips_by_game(token, game_name, days_back, clips_per_game)
            if clips:
                all_clips.extend(clips)
                successful_games += 1
                
                # Show preview of best clip from this game
                best_clip = max(clips, key=lambda x: x.get('view_count', 0))
                views = best_clip.get('view_count', 0)
                title = best_clip.get('title', 'No Title')[:40]
                print(f"   🏆 Best: '{title}...' ({views:,} views)")
            
            # Small delay to be respectful to the API
            time.sleep(0.5)
            
        except Exception as e:
            print(f"⚠️ Failed to process {game_name}: {e}")
    
    print("-" * 50)
    print(f"✅ Successfully gathered clips from {successful_games}/{len(popular_games)} games")
    print(f"📈 Total clips collected: {len(all_clips)}")
    
    if not all_clips:
        raise Exception("No clips found from any games. Check your date range or try different games.")
    
    # Sort all clips by view count to get the true "top" clips
    sorted_clips = sorted(all_clips, key=lambda x: x.get('view_count', 0), reverse=True)
    
    # Limit to requested number
    final_clips = sorted_clips[:limit]
    
    print(f"🎖️ Returning top {len(final_clips)} clips overall")
    
    if final_clips:
        top_clip = final_clips[0]
        print(f"🥇 #1 Clip: '{top_clip.get('title', 'No Title')[:50]}...'")
        print(f"   👀 {top_clip.get('view_count', 0):,} views")
        print(f"   🎮 Game: {top_clip.get('game_name', 'Unknown')}")
        print(f"   👤 Creator: {top_clip.get('creator_name', 'Unknown')}")
    
    return final_clips