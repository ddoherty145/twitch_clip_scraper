#!/usr/bin/env python3
"""
Environment testing utility for Twitch Top Clips Scraper
Tests if the .env file is properly configured and accessible
"""

import os
from dotenv import load_dotenv

def test_environment():
    """Test if the environment is properly configured"""
    print("🧪 Testing Environment Configuration")
    print("=" * 50)
    
    # Test 1: Check if .env file exists
    print("📁 Checking .env file...")
    if os.path.exists('.env'):
        print("✅ .env file found")
    else:
        print("❌ .env file not found")
        print("   Please create a .env file with your Twitch credentials")
        return False
    
    # Test 2: Load environment variables
    print("\n🔑 Loading environment variables...")
    try:
        load_dotenv()
        print("✅ Environment variables loaded successfully")
    except Exception as e:
        print(f"❌ Failed to load environment variables: {e}")
        return False
    
    # Test 3: Check required variables
    print("\n🔍 Checking required environment variables...")
    required_vars = ['TWITCH_CLIENT_ID', 'TWITCH_CLIENT_SECRET']
    missing_vars = []
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            # Mask the secret for security
            if 'SECRET' in var:
                masked_value = value[:4] + '*' * (len(value) - 8) + value[-4:] if len(value) > 8 else '****'
                print(f"✅ {var}: {masked_value}")
            else:
                print(f"✅ {var}: {value}")
        else:
            print(f"❌ {var}: Not set")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n❌ Missing required variables: {', '.join(missing_vars)}")
        print("   Please add these to your .env file")
        return False
    
    # Test 4: Validate variable formats
    print("\n🔐 Validating variable formats...")
    client_id = os.getenv('TWITCH_CLIENT_ID')
    client_secret = os.getenv('TWITCH_CLIENT_SECRET')
    
    # Basic format validation
    if len(client_id) < 10:
        print("⚠️  TWITCH_CLIENT_ID seems too short (should be ~30 characters)")
    else:
        print("✅ TWITCH_CLIENT_ID format looks valid")
    
    if len(client_secret) < 20:
        print("⚠️  TWITCH_CLIENT_SECRET seems too short (should be ~30+ characters)")
    else:
        print("✅ TWITCH_CLIENT_SECRET format looks valid")
    
    # Test 5: Check Python packages
    print("\n📦 Checking required Python packages...")
    required_packages = ['requests', 'openpyxl', 'dotenv']
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'dotenv':
                import dotenv
            elif package == 'openpyxl':
                import openpyxl
            elif package == 'requests':
                import requests
            print(f"✅ {package}: Available")
        except ImportError:
            print(f"❌ {package}: Not available")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("   Run: pip install -r requirements.txt")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 Environment test completed successfully!")
    print("✅ Your setup appears to be ready to run")
    print("\n💡 Next steps:")
    print("   • Run: python main.py")
    print("   • Or use: run_windows.bat (Windows)")
    print("   • Check clips_output/ folder for results")
    
    return True

if __name__ == "__main__":
    success = test_environment()
    if not success:
        print("\n❌ Environment test failed")
        print("   Please fix the issues above before running the main application")
        exit(1)
