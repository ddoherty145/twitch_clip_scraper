import sys
sys.path.append('..')
from shared.auth import get_twitch_token
from clip_scraper.clips_getter import get_top_clips
from clip_scraper.excel_generator import create_clips_excel

def main():
    try:
        print("🚀 Twitch Top Clips Scraper - Multi-Game Strategy")
        print("=" * 60)
        
        print("🔑 Authenticating with Twitch API...")
        token = get_twitch_token()
        print("✅ Authentication successful!")
        print()
        
        print("📥 Starting multi-game clip collection...")
        print("🎯 This will search across 20+ popular game categories")
        print("📊 Targeting top 150 clips overall")
        print("⏳ This may take 2-3 minutes due to API rate limits...")
        print()
        
        # Strategy 3: Multiple games approach with English filtering
        clips = get_top_clips(
            token=token, 
            days_back=1,         # Last 24 hours
            limit=150,           # Top 150 clips overall
            strategy='mixed',    # Multi-game strategy
            english_only=True    # NEW: Filter for English content only
        )
        
        print()
        print("=" * 60)
        print(f"🎉 Collection complete! Found {len(clips)} top clips")

        if not clips:
            print("⚠️ No clips found for the specified period.")
            print("💡 Try increasing days_back or check if there are any popular streams today")
            return
        
        print("\n📊 Generating Excel spreadsheet...")
        excel_file = create_clips_excel(clips)
        print(f"✅ Excel file created: {excel_file}")

        # Enhanced summary with game breakdown
        print("\n" + "=" * 60)
        print("📈 CLIP COLLECTION SUMMARY")
        print("=" * 60)
        
        print(f"📊 Total Clips: {len(clips)} (targeting top 150)")
        print(f"⏰ Time Period: Last 24 hours")
        print(f"📁 Output File: {excel_file}")
        
        if clips:
            top_clip = clips[0]
            print(f"\n🥇 #1 MOST POPULAR CLIP:")
            print(f"   📺 Title: {top_clip.get('title', 'No Title')}")
            print(f"   👀 Views: {top_clip.get('view_count', 0):,}")
            print(f"   👤 Creator: {top_clip.get('creator_name', 'Unknown')}")
            print(f"   🎮 Game: {top_clip.get('game_name', 'Unknown')}")
            print(f"   🔗 URL: {top_clip.get('url', 'No URL')}")
        
        # Game category breakdown
        print(f"\n🎮 CLIPS BY GAME CATEGORY:")
        game_counts = {}
        for clip in clips:
            game = clip.get('game_name', 'Unknown')
            game_counts[game] = game_counts.get(game, 0) + 1
        
        # Sort games by clip count
        sorted_games = sorted(game_counts.items(), key=lambda x: x[1], reverse=True)
        for game, count in sorted_games[:10]:  # Show top 10 games
            print(f"   🎯 {game}: {count} clips")
        
        if len(sorted_games) > 10:
            remaining = sum(count for game, count in sorted_games[10:])
            print(f"   📋 Other games: {remaining} clips")
        
        # Top 5 clips preview
        print(f"\n🏆 TOP 5 CLIPS PREVIEW:")
        for i, clip in enumerate(clips[:5], 1):
            views = clip.get('view_count', 0)
            title = clip.get('title', 'No Title')
            if len(title) > 45:
                title = title[:45] + "..."
            creator = clip.get('creator_name', 'Unknown')
            game = clip.get('game_name', 'Unknown')
            print(f"   {i}. {title}")
            print(f"      👤 {creator} | 🎮 {game} | 👀 {views:,} views")
        
        print("\n" + "=" * 60)
        print("🎊 SUCCESS! Your top Twitch clips spreadsheet is ready!")
        print("📂 Check the 'clips_output' folder for your Excel file")
        print("=" * 60)

    except KeyboardInterrupt:
        print("\n⚠️ Process interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
        print("\n💡 Troubleshooting tips:")
        print("   • Check your .env file has valid Twitch credentials")
        print("   • Ensure you have internet connection")
        print("   • Try running again (API might be temporarily busy)")
        sys.exit(1)

if __name__ == "__main__":
    main()