# Twitch Top Clips Scraper

A Python tool that fetches the top Twitch clips from the last 24 hours and exports them to an Excel spreadsheet.

## Prerequisites

- Python 3.7 or higher
- Twitch Developer Account
- Git (optional, for cloning)

## Setup Instructions

### For macOS/Linux:

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd twitch_clips_scraper
```

2. **Create virtual environment:**
```bash
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

### For Windows:

1. **Clone the repository:**
```cmd
git clone <your-repo-url>
cd twitch_clips_scraper
```

2. **Create virtual environment:**
```cmd
python -m venv venv
venv\Scripts\activate
```

3. **Install dependencies:**
```cmd
pip install -r requirements.txt
```

### Alternative Windows Setup (PowerShell):

```powershell
# If you get execution policy errors, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then create and activate virtual environment:
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Twitch API Setup

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Create a new application:
   - **Name:** "Top Clips Scraper" (or any name)
   - **OAuth Redirect URLs:** `http://localhost`
   - **Category:** "Application Integration"
3. Copy your **Client ID** and **Client Secret**

## Configuration

1. **Create `.env` file in project root:**
```
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
```

⚠️ **Important:** Never commit your `.env` file to version control!

## Running the Application

### macOS/Linux:
```bash
source venv/bin/activate  # Activate virtual environment
python main.py
```

### Windows (Command Prompt):
```cmd
venv\Scripts\activate
python main.py
```

### Windows (PowerShell):
```powershell
venv\Scripts\Activate.ps1
python main.py
```

## Testing Your Setup

Run the environment test first:
```bash
python test_env.py
```

This will verify your `.env` file is set up correctly.

## Output

- Excel files are saved to `clips_output/` directory
- Files are named with timestamp: `top_twitch_clips_YYYYMMDD_HHMMSS.xlsx`

## Troubleshooting

### "Failed to get twitch token"
- Verify your Client ID and Secret in `.env` file
- Make sure there are no extra spaces or quotes
- Check that your Twitch app is active in the Developer Console

### Permission Errors on Windows
- Run Command Prompt or PowerShell as Administrator
- Or use `python -m pip install --user -r requirements.txt`

### Virtual Environment Issues
- Windows: Make sure you're using `venv\Scripts\activate` not `venv/bin/activate`
- PowerShell: You may need to change execution policy (see setup instructions above)

### Python Command Not Found
- Make sure Python is installed and added to PATH
- Try `python3` instead of `python` on some systems
- Windows: Install Python from Microsoft Store or python.org

## Project Structure

```
twitch_clips_scraper/
├── auth.py              # Twitch API authentication
├── clips_getter.py      # Fetch clips from API
├── excel_generator.py   # Create Excel files
├── main.py             # Main application
├── test_env.py         # Environment testing utility
├── requirements.txt    # Python dependencies
├── .env               # API credentials (create this)
├── .gitignore         # Git ignore file
└── clips_output/      # Output directory (auto-created)
```

## License

MIT License - Feel free to modify and distribute!
