from auth import get_twitch_token
from clips_getter import get_top_clips
from excel_generator import create_clips_excel
import sys

def main():
    try:
        print("👾 Starting Twitch Scraper...")
        print("🔑 Getting OAuth Token...")
        token = get_twitch_token()
        print("✅ OAuth Token acquired.")

        # Get Clips
        print("📥 Fetching top clips from the last 24 hours...")
        clips = get_top_clips(token, days_back=1, limit=50)
        print(f"✅ Fetched {len(clips)} clips.")

        if not clips:
            print("⚠️ No clips found for the specified period.")
            return
        
        # Generate Excel
        print("📊 Generating Excel file...")
        excel_file = create_clips_excel(clips)
        print(f"✅ Excel file created: {excel_file}")

        #Display summary
        print("\n📄 Summary of Top Clips:")
        print(f"Total Clips: {len(clips)}")
        if clips:
            print(f"Top Clip views: {clips[0].get('view_count', 0)}")
        print(f"Excel File: {excel_file}")

    except Exception as e:
        print(f"❌ An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
