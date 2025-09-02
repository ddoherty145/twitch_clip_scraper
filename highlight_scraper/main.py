import sys
sys.path.append('..')
from shared.auth import get_twitch_token
from .highlights_getter import get_top_highlights_by_channel, get_channel_clips
from .excel_generator import create_highlights_excel
from .channel_config import get_preset, list_presets, DEFAULT_CONFIG

def main(preset_name=None):
    try:
        print("🎯 Starting Channel Highlights Scraper...")
        
        # Load configuration
        if preset_name:
            config = get_preset(preset_name)
            print(f"📋 Using preset: {preset_name}")
        else:
            config = DEFAULT_CONFIG
            print("📋 Using default configuration")
        
        CHANNELS_TO_SCRAPE = config["channels"]
        DAYS_BACK = config["days_back"]
        CLIPS_PER_CHANNEL = config["clips_per_channel"]
        SEPARATE_SHEETS = config["separate_sheets"]
        
        print(f"📺 Channels to scrape: {', '.join(CHANNELS_TO_SCRAPE)}")
        print(f"📅 Looking back: {DAYS_BACK} days")
        print(f"🎬 Clips per channel: {CLIPS_PER_CHANNEL}")
        
        # Step 1: Get authentication token
        print("\n🔑 Getting Twitch API token...")
        token = get_twitch_token()
        print("✅ Token acquired successfully!")
        
        # Step 2: Get highlights for each channel
        print(f"\n🔍 Fetching highlights from {len(CHANNELS_TO_SCRAPE)} channels...")
        highlights_data = get_top_highlights_by_channel(
            token, 
            CHANNELS_TO_SCRAPE, 
            days_back=DAYS_BACK,
            clips_per_channel=CLIPS_PER_CHANNEL
        )
        
        # Count total clips found
        total_clips = sum(len(clips) for clips in highlights_data.values())
        print(f"\n✅ Found {total_clips} total highlights!")
        
        if total_clips == 0:
            print("❌ No highlights found for any channels.")
            return
        
        # Step 3: Generate Excel file
        print("\n📊 Creating Excel spreadsheet...")
        excel_file = create_highlights_excel(
            highlights_data, 
            CHANNELS_TO_SCRAPE, 
            separate_sheets=SEPARATE_SHEETS
        )
        print(f"✅ Excel file created: {excel_file}")
        
        # Display summary
        print("\n" + "="*50)
        print("📄 HIGHLIGHTS SUMMARY")
        print("="*50)
        
        for channel in CHANNELS_TO_SCRAPE:
            clips = highlights_data.get(channel, [])
            if clips:
                top_views = max(clip.get('view_count', 0) for clip in clips)
                print(f"📺 {channel}: {len(clips)} highlights (top: {top_views:,} views)")
            else:
                print(f"📺 {channel}: No highlights found")
        
        print(f"\n🎯 Total highlights: {total_clips}")
        print(f"📁 Output file: {excel_file}")
        print(f"📂 Output folder: highlights_output/")
        
    except Exception as e:
        print(f"❌ An error occurred: {e}")
        sys.exit(1)

def interactive_mode():
    """Interactive mode to let user choose channels"""
    print("🎯 Channel Highlights Scraper - Interactive Mode")
    print("=" * 50)
    
    # Get channels from user
    print("Enter channel names (one per line, press Enter twice when done):")
    channels = []
    while True:
        channel = input("Channel name: ").strip()
        if not channel:
            break
        channels.append(channel.lower())
    
    if not channels:
        print("❌ No channels specified!")
        return
    
    # Get parameters
    try:
        days_back = int(input("Days to look back (default 7): ") or "7")
        clips_per_channel = int(input("Max clips per channel (default 20): ") or "20")
    except ValueError:
        print("❌ Invalid input, using defaults")
        days_back = 7
        clips_per_channel = 20
    
    separate_sheets = input("Separate sheets per channel? (y/n, default y): ").lower() != 'n'
    
    # Update globals and run
    global CHANNELS_TO_SCRAPE, DAYS_BACK, CLIPS_PER_CHANNEL, SEPARATE_SHEETS
    CHANNELS_TO_SCRAPE = channels
    DAYS_BACK = days_back
    CLIPS_PER_CHANNEL = clips_per_channel
    SEPARATE_SHEETS = separate_sheets
    
    main()

if __name__ == "__main__":
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--interactive":
            interactive_mode()
        elif sys.argv[1] == "--presets":
            list_presets()
        elif sys.argv[1] in ["gaming", "variety", "esports", "weekly_report"]:
            main(sys.argv[1])
        else:
            print("Usage:")
            print("  python highlights_main.py                    # Default config")
            print("  python highlights_main.py --interactive      # Interactive mode")
            print("  python highlights_main.py --presets         # List presets")
            print("  python highlights_main.py gaming            # Gaming preset")
            print("  python highlights_main.py variety           # Variety preset")
            print("  python highlights_main.py esports           # Esports preset")
            print("  python highlights_main.py weekly_report     # Weekly report preset")
    else:
        main()