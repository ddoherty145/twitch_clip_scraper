import requests
import os
from datetime import datetime, timedelta
import time
import re

# Cache for game info to avoid repeated API calls
GAME_CACHE = {}

def get_game_info_by_name(token, game_name):
    """Get game ID and info by game name with caching"""
    if game_name in GAME_CACHE:
        return GAME_CACHE[game_name]
    
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
            if games:
                game_info = {
                    'id': games[0]['id'],
                    'name': games[0]['name'],
                    'box_art_url': games[0].get('box_art_url', '')
                }
                GAME_CACHE[game_name] = game_info
                return game_info
        else:
            print(f"⚠️ Couldn't find game '{game_name}': {response.status_code}")
            return None
    except Exception as e:
        print(f"⚠️ Error looking up game '{game_name}': {e}")
        return None

def get_games_by_ids(token, game_ids):
    """Get game names for multiple game IDs at once"""
    if not game_ids:
        return {}
    
    client_id = os.getenv('TWITCH_CLIENT_ID')
    
    url = 'https://api.twitch.tv/helix/games'
    headers = {
        'Client-ID': client_id,
        'Authorization': f'Bearer {token}'
    }
    
    # Twitch API allows up to 100 IDs per request
    game_info = {}
    
    # Process in chunks of 100
    for i in range(0, len(game_ids), 100):
        chunk = game_ids[i:i+100]
        params = {'id': chunk}
        
        try:
            response = requests.get(url, headers=headers, params=params)
            if response.status_code == 200:
                games = response.json().get('data', [])
                for game in games:
                    game_info[game['id']] = {
                        'name': game['name'],
                        'box_art_url': game.get('box_art_url', '')
                    }
            else:
                print(f"⚠️ Error fetching game info: {response.status_code}")
        except Exception as e:
            print(f"⚠️ Exception fetching game info: {e}")
        
        time.sleep(0.1)  # Small delay between requests
    
    return game_info

def get_broadcaster_info(token, user_ids):
    """Get broadcaster language and info for multiple users"""
    if not user_ids:
        return {}
    
    client_id = os.getenv('TWITCH_CLIENT_ID')
    
    url = 'https://api.twitch.tv/helix/users'
    headers = {
        'Client-ID': client_id,
        'Authorization': f'Bearer {token}'
    }
    
    broadcaster_info = {}
    
    # Process in chunks of 100 (API limit)
    for i in range(0, len(user_ids), 100):
        chunk = user_ids[i:i+100]
        params = {'id': chunk}
        
        try:
            response = requests.get(url, headers=headers, params=params)
            if response.status_code == 200:
                users = response.json().get('data', [])
                for user in users:
                    broadcaster_info[user['id']] = {
                        'display_name': user.get('display_name', user.get('login', 'Unknown')),
                        'description': user.get('description', ''),
                        'broadcaster_type': user.get('broadcaster_type', ''),
                        'profile_image_url': user.get('profile_image_url', '')
                    }
            else:
                print(f"⚠️ Error fetching broadcaster info: {response.status_code}")
        except Exception as e:
            print(f"⚠️ Exception fetching broadcaster info: {e}")
        
        time.sleep(0.1)  # Small delay between requests
    
    return broadcaster_info

def is_likely_english_content(clip, broadcaster_info=None):
    """
    Determine if clip is likely English content based on:
    - Clip title language detection
    - Creator name patterns
    - Known English-speaking streamers
    """
    
    # Get clip info
    title = clip.get('title', '').lower()
    creator_name = clip.get('creator_name', '').lower()
    creator_id = clip.get('creator_id', '')
    
    # Check broadcaster info if available
    if broadcaster_info and creator_id in broadcaster_info:
        description = broadcaster_info[creator_id].get('description', '').lower()
        # If description contains common English indicators
        english_indicators = ['english', 'usa', 'america', 'canada', 'uk', 'australia']
        if any(indicator in description for indicator in english_indicators):
            return True
    
    # Language patterns in titles (simple heuristics)
    # Common non-English patterns to filter out
    non_english_patterns = [
        # Japanese/Korean characters
        r'[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\uac00-\ud7af]',
        # Russian/Cyrillic
        r'[\u0400-\u04ff]',
        # Arabic
        r'[\u0600-\u06ff]',
        # Thai
        r'[\u0e00-\u0e7f]',
        # Common non-English words that often appear in titles
        r'\b(que|como|para|con|una|les|des|der|die|das|und|кто|что|как|где)\b'
    ]
    
    # Check if title contains non-English patterns
    for pattern in non_english_patterns:
        if re.search(pattern, title):
            return False
    
    # Common English words/phrases in clip titles
    english_indicators = [
        'the', 'and', 'with', 'when', 'what', 'how', 'why', 'this', 'that',
        'funny', 'epic', 'insane', 'crazy', 'best', 'worst', 'first', 'last',
        'reaction', 'moment', 'highlight', 'fail', 'win', 'clutch', 'play',
        'game', 'stream', 'chat', 'viewer', 'donate', 'sub', 'follow'
    ]
    
    # Count English indicators
    english_count = sum(1 for word in english_indicators if word in title)
    
    # If title has multiple English words, likely English content
    if english_count >= 2:
        return True
    
    # Check for common English streamer name patterns
    english_name_patterns = [
        r'^[a-zA-Z0-9_]+$',  # Standard Latin characters only
    ]
    
    # Additional checks for creator names
    if re.match(r'^[a-zA-Z0-9_]+$', creator_name):
        # If name is Latin characters and title has some English, probably English
        if english_count >= 1:
            return True
    
    # Default: if we can't determine, include it (better to have false positives)
    return True

def get_clips_by_game(token, game_name, days_back=1, limit=15, english_only=True):
    """Get clips from a specific game with optional English filtering"""
    print(f"🎮 Fetching clips for: {game_name}")
    
    # Get game ID first
    game_info = get_game_info_by_name(token, game_name)
    if not game_info:
        print(f"❌ Skipping '{game_name}' - game not found")
        return []
    
    game_id = game_info['id']
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
        'first': limit * 2 if english_only else limit  # Get more clips if filtering
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            clips = data.get('data', [])
            
            # Add proper game name to each clip
            for clip in clips:
                clip['game_name'] = game_info['name']  # Use actual game name from API
                clip['game_id'] = game_id
            
            # Filter for English content if requested
            if english_only and clips:
                # Get broadcaster info for language detection
                user_ids = list(set(clip.get('creator_id') for clip in clips if clip.get('creator_id')))
                broadcaster_info = get_broadcaster_info(token, user_ids)
                
                # Filter clips
                english_clips = []
                for clip in clips:
                    if is_likely_english_content(clip, broadcaster_info):
                        english_clips.append(clip)
                
                clips = english_clips[:limit]  # Limit after filtering
                
                print(f"✅ {game_name}: Found {len(clips)} English clips")
            else:
                print(f"✅ {game_name}: Found {len(clips)} clips")
                
            return clips
        elif response.status_code == 429:
            print(f"⏱️ Rate limited, waiting 60 seconds...")
            time.sleep(60)
            return get_clips_by_game(token, game_name, days_back, limit, english_only)  # Retry
        else:
            print(f"⚠️ Error fetching clips for {game_name}: {response.status_code}")
            return []
    except Exception as e:
        print(f"⚠️ Exception fetching clips for {game_name}: {e}")
        return []

def get_top_clips(token, days_back=1, limit=50, strategy='mixed', english_only=True):
    """
    Get top clips from multiple popular games
    
    NEW FEATURES:
    - Resolves game IDs to actual game names
    - Filters for English-speaking content
    - Enhanced language detection
    """
    
    # Comprehensive list of popular Twitch categories
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
        'Marvel Rivals',          # Esports favorite
        'Minecraft',       # Horror multiplayer
        'Animals, Aquariums, and Zoos'               # Party game
    ]
    
    print(f"🎯 Using Multiple Games Strategy")
    print(f"🌍 Language Filter: {'English Only' if english_only else 'All Languages'}")
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
            clips = get_clips_by_game(token, game_name, days_back, clips_per_game, english_only)
            if clips:
                all_clips.extend(clips)
                successful_games += 1
                
                # Show preview of best clip from this game
                best_clip = max(clips, key=lambda x: x.get('view_count', 0))
                views = best_clip.get('view_count', 0)
                title = best_clip.get('title', 'No Title')[:40]
                creator = best_clip.get('creator_name', 'Unknown')
                print(f"   🏆 Best: '{title}...' by {creator} ({views:,} views)")
            
            # Small delay to be respectful to the API
            time.sleep(0.5)
            
        except Exception as e:
            print(f"⚠️ Failed to process {game_name}: {e}")
    
    print("-" * 50)
    print(f"✅ Successfully gathered clips from {successful_games}/{len(popular_games)} games")
    print(f"📈 Total clips collected: {len(all_clips)}")
    
    if not all_clips:
        error_msg = "No clips found from any games."
        if english_only:
            error_msg += " Try setting english_only=False or check if there are English streamers active today."
        raise Exception(error_msg)
    
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