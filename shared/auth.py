"""
Shared authentication module for Twitch API
Used by both clips scraper and highlights scraper
"""

import requests
import os
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TwitchAuth:
    def __init__(self):
        self.client_id = os.getenv("TWITCH_CLIENT_ID")
        self.client_secret = os.getenv("TWITCH_CLIENT_SECRET")
        self.access_token = None
        self.token_expires_at = None
        
        # Validate credentials on initialization
        if not self.client_id or not self.client_secret:
            raise ValueError("Missing Twitch credentials in .env file")
    
    def get_token(self, force_refresh=False):
        """Get valid access token, refreshing if necessary"""
        
        # Check if we have a valid token
        if not force_refresh and self._is_token_valid():
            return self.access_token
        
        # Get new token
        return self._request_new_token()
    
    def _is_token_valid(self):
        """Check if current token is still valid"""
        if not self.access_token or not self.token_expires_at:
            return False
        
        # Add 5 minute buffer before expiration
        buffer = timedelta(minutes=5)
        return datetime.now() < (self.token_expires_at - buffer)
    
    def _request_new_token(self):
        """Request new access token from Twitch"""
        
        url = "https://id.twitch.tv/oauth2/token"
        params = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "client_credentials"
        }
        
        try:
            response = requests.post(url, params=params, timeout=10)
            
            if response.status_code == 200:
                token_data = response.json()
                self.access_token = token_data.get("access_token")
                
                # Calculate expiration time
                expires_in = token_data.get("expires_in", 3600)  # Default 1 hour
                self.token_expires_at = datetime.now() + timedelta(seconds=expires_in)
                
                return self.access_token
            
            else:
                self._handle_token_error(response)
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error when requesting token: {e}")
    
    def _handle_token_error(self, response):
        """Handle token request errors with detailed messages"""
        
        error_messages = {
            400: "Invalid client_id or client_secret. Check your .env file.",
            401: "Unauthorized. Your credentials may be incorrect.",
            403: "Forbidden. Your Twitch application may be suspended.",
            429: "Rate limited. Too many requests. Wait before retrying.",
            500: "Twitch server error. Try again later."
        }
        
        error_msg = error_messages.get(
            response.status_code, 
            f"Unknown error: {response.status_code}"
        )
        
        raise Exception(f"Failed to get token: {error_msg} - {response.text}")
    
    def validate_token(self, token=None):
        """Validate token against Twitch API"""
        
        token_to_validate = token or self.access_token
        if not token_to_validate:
            return False
        
        url = "https://id.twitch.tv/oauth2/validate"
        headers = {
            "Authorization": f"OAuth {token_to_validate}"
        }
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            return response.status_code == 200
        except:
            return False
    
    def get_headers(self):
        """Get standard headers for Twitch API requests"""
        token = self.get_token()
        return {
            'Client-ID': self.client_id,
            'Authorization': f'Bearer {token}'
        }
    
    def revoke_token(self):
        """Revoke the current access token"""
        if not self.access_token:
            return
        
        url = "https://id.twitch.tv/oauth2/revoke"
        params = {
            "client_id": self.client_id,
            "token": self.access_token
        }
        
        try:
            requests.post(url, params=params, timeout=10)
        except:
            pass  # Ignore errors when revoking
        
        # Clear token data
        self.access_token = None
        self.token_expires_at = None


# Global instance for easy access
_twitch_auth = None

def get_twitch_auth():
    """Get shared TwitchAuth instance"""
    global _twitch_auth
    if _twitch_auth is None:
        _twitch_auth = TwitchAuth()
    return _twitch_auth

def get_twitch_token():
    """Simple function to get token (backwards compatibility)"""
    auth = get_twitch_auth()
    return auth.get_token()

def get_twitch_headers():
    """Get headers for Twitch API requests"""
    auth = get_twitch_auth()
    return auth.get_headers()

def debug_auth_status():
    """Debug function to check authentication status"""
    try:
        auth = get_twitch_auth()
        
        print("🔍 Twitch Authentication Debug")
        print("=" * 40)
        print(f"Client ID present: {'Yes' if auth.client_id else 'No'}")
        print(f"Client ID length: {len(auth.client_id) if auth.client_id else 0}")
        print(f"Client Secret present: {'Yes' if auth.client_secret else 'No'}")
        print(f"Client Secret length: {len(auth.client_secret) if auth.client_secret else 0}")
        
        if auth.access_token:
            print(f"Current token present: Yes")
            print(f"Token expires at: {auth.token_expires_at}")
            print(f"Token is valid: {'Yes' if auth._is_token_valid() else 'No'}")
        else:
            print("Current token present: No")
        
        # Test token request
        print("\n🧪 Testing token request...")
        token = auth.get_token()
        print("✅ Token request successful!")
        print(f"Token starts with: {token[:10]}...")
        
        # Test token validation
        print("\n✅ Testing token validation...")
        is_valid = auth.validate_token()
        print(f"Token validation: {'Passed' if is_valid else 'Failed'}")
        
    except Exception as e:
        print(f"❌ Authentication error: {e}")

def rate_limit_handler(func):
    """Decorator to handle rate limiting"""
    def wrapper(*args, **kwargs):
        max_retries = 3
        retry_delay = 1
        
        for attempt in range(max_retries):
            try:
                return func(*args, **kwargs)
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 429:  # Rate limited
                    if attempt < max_retries - 1:
                        print(f"⏳ Rate limited, waiting {retry_delay} seconds...")
                        time.sleep(retry_delay)
                        retry_delay *= 2  # Exponential backoff
                        continue
                raise
            except Exception as e:
                if attempt < max_retries - 1:
                    print(f"🔄 Request failed, retrying... ({attempt + 1}/{max_retries})")
                    time.sleep(1)
                    continue
                raise
        
    return wrapper

# Utility functions for common API patterns
def make_twitch_request(url, params=None, timeout=10):
    """Make authenticated request to Twitch API"""
    headers = get_twitch_headers()
    
    response = requests.get(url, headers=headers, params=params, timeout=timeout)
    
    if response.status_code == 401:
        # Token might be expired, try refreshing
        auth = get_twitch_auth()
        headers = auth.get_headers()  # This will refresh token if needed
        response = requests.get(url, headers=headers, params=params, timeout=timeout)
    
    response.raise_for_status()
    return response.json()

# Configuration validation
def validate_environment():
    """Validate that all required environment variables are present"""
    required_vars = ["TWITCH_CLIENT_ID", "TWITCH_CLIENT_SECRET"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease add these to your .env file:")
        for var in missing_vars:
            print(f"   {var}=your_value_here")
        return False
    
    return True

if __name__ == "__main__":
    # Run debug when called directly
    if validate_environment():
        debug_auth_status()
    else:
        print("❌ Environment validation failed")
        