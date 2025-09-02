# Twitch Clips & Highlights Scraper

A comprehensive Python tool that fetches top Twitch clips and channel highlights, exporting them to beautifully formatted Excel spreadsheets with multiple scraping strategies and preset configurations.

## 🚀 Features

### **Dual Scraping Modes**
- **📊 Top Clips Scraper**: Multi-game strategy collecting top clips across 20+ game categories
- **📺 Channel Highlights Scraper**: Targeted scraping from specific channels with preset configurations

### **Advanced Features**
- **🌍 English-only filtering** for better content quality
- **📈 Up to 150 clips** per run (increased from 50)
- **🎯 Multiple preset configurations** for different use cases
- **📋 Interactive mode** for custom channel selection
- **📊 Separate Excel sheets** per channel/game category
- **🎨 Professional Excel formatting** with colors and styling
- **⚡ Smart rate limiting** and error handling

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

## Running the Applications

### 🎮 Top Clips Scraper (Multi-Game Strategy)

**macOS/Linux:**
```bash
# Activate virtual environment
source venv/bin/activate

# Run the clip scraper
python -m clip_scraper.main
```

**Windows (Command Prompt):**
```cmd
REM Activate virtual environment
venv\Scripts\activate

REM Run the clip scraper
python -m clip_scraper.main
```

**Windows (PowerShell):**
```powershell
# Activate virtual environment
venv\Scripts\Activate.ps1

# Run the clip scraper
python -m clip_scraper.main
```

**Alternative Windows Commands:**
```cmd
REM Direct file execution (alternative method)
venv\Scripts\activate
python clip_scraper\main.py
```

**Features:**
- Collects top clips from 20+ game categories
- Targets up to 150 clips (increased from 50)
- English-only filtering
- 2-3 minute processing time
- Comprehensive game category breakdown

### 📺 Channel Highlights Scraper

**macOS/Linux - Default Mode:**
```bash
source venv/bin/activate
python -m highlight_scraper.main
```

**Windows - Default Mode:**
```cmd
venv\Scripts\activate
python -m highlight_scraper.main
```

**macOS/Linux - Preset Modes:**
```bash
source venv/bin/activate
python -m highlight_scraper.main gaming        # Gaming channels preset
python -m highlight_scraper.main variety       # Variety streamers preset
python -m highlight_scraper.main esports       # Esports channels preset
python -m highlight_scraper.main weekly_report # Weekly report preset
```

**Windows - Preset Modes:**
```cmd
venv\Scripts\activate
python -m highlight_scraper.main gaming        # Gaming channels preset
python -m highlight_scraper.main variety       # Variety streamers preset
python -m highlight_scraper.main esports       # Esports channels preset
python -m highlight_scraper.main weekly_report # Weekly report preset
```

**Interactive Mode:**
```bash
# macOS/Linux
source venv/bin/activate
python -m highlight_scraper.main --interactive

# Windows
venv\Scripts\activate
python -m highlight_scraper.main --interactive
```

**List Available Presets:**
```bash
# macOS/Linux
source venv/bin/activate
python -m highlight_scraper.main --presets

# Windows
venv\Scripts\activate
python -m highlight_scraper.main --presets
```

**Alternative Windows Commands:**
```cmd
REM Direct file execution (alternative method)
venv\Scripts\activate
python highlight_scraper\main.py gaming
python highlight_scraper\main.py variety
python highlight_scraper\main.py --interactive
```

**Features:**
- 4 built-in presets (gaming, variety, esports, weekly_report)
- Custom channel selection
- Configurable time periods (1-7 days)
- Separate Excel sheets per channel
- Interactive mode for custom configurations

## Testing Your Setup

**macOS/Linux:**
```bash
source venv/bin/activate
python test_env.py
```

**Windows:**
```cmd
venv\Scripts\activate
python test_env.py
```

This will verify your `.env` file is set up correctly and check all dependencies.

## Output

### Top Clips Scraper
- **Location:** `clips_output/` directory
- **Format:** `top_twitch_clips_YYYYMMDD_HHMMSS.xlsx`
- **Content:** Up to 150 top clips across multiple game categories
- **Features:** Game breakdown, top clips preview, view counts

### Channel Highlights Scraper
- **Location:** `highlights_output/` directory
- **Format:** `channel_highlights_YYYYMMDD_HHMMSS.xlsx`
- **Content:** Highlights from specified channels
- **Features:** Separate sheets per channel, summary statistics, configurable time periods

## Preset Configurations

### Gaming Preset
- **Channels:** shroud, ninja, pokimane, xqcow, asmongold, summit1g, lirik, sodapoppin
- **Time Period:** 3 days
- **Clips per Channel:** 10

### Variety Preset
- **Channels:** pokimane, xqcow, hasanabi, mizkif, sodapoppin, amouranth
- **Time Period:** 7 days
- **Clips per Channel:** 20

### Esports Preset
- **Channels:** shroud, s1mple, tarik, stewie2k, scream, tenz, sinatraa, aceu
- **Time Period:** 7 days
- **Clips per Channel:** 15

### Weekly Report Preset
- **Channels:** Top 10 gaming channels
- **Time Period:** 7 days
- **Clips per Channel:** 25

## Troubleshooting

### "Failed to get twitch token"
- Verify your Client ID and Secret in `.env` file
- Make sure there are no extra spaces or quotes
- Check that your Twitch app is active in the Developer Console

### "User not found" errors
- Some channels may not exist or have changed names
- The scraper will continue with available channels
- Check channel names in the preset configurations

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

### Import Errors
- Make sure you're running from the project root directory
- Use `python -m module_name.main` instead of `python module_name/main.py`
- Ensure virtual environment is activated

### Windows-Specific Issues

#### PowerShell Execution Policy
If you get execution policy errors in PowerShell:
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user (recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run PowerShell as Administrator and set for all users
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

#### Command Prompt vs PowerShell
- **Command Prompt**: Use `venv\Scripts\activate`
- **PowerShell**: Use `venv\Scripts\Activate.ps1`
- **Git Bash**: Use `source venv/Scripts/activate`

#### Path Issues on Windows
If you get "python is not recognized":
```cmd
REM Check if Python is in PATH
where python

REM If not found, add Python to PATH or use full path
C:\Python39\python.exe -m clip_scraper.main
```

#### Windows Batch Files
You can also use the provided batch files:
```cmd
REM For clip scraper
clip_scraper\run_windows.bat

REM For highlight scraper
highlight_scraper\run_highlights_windows.bat
```

#### Common Windows Commands Summary
```cmd
REM 1. Navigate to project directory
cd C:\path\to\twitch_clips_scraper

REM 2. Activate virtual environment
venv\Scripts\activate

REM 3. Test environment
python test_env.py

REM 4. Run clip scraper
python -m clip_scraper.main

REM 5. Run highlight scraper with preset
python -m highlight_scraper.main gaming
```

## Project Structure

```
twitch_clips_scraper/
├── clip_scraper/              # Top clips scraper module
│   ├── auth.py               # Twitch API authentication
│   ├── clips_getter.py       # Fetch clips from API
│   ├── excel_generator.py    # Create Excel files
│   ├── main.py              # Main application
│   ├── run_windows.bat      # Windows batch file
│   └── clips_output/        # Output directory
├── highlight_scraper/         # Channel highlights scraper module
│   ├── auth.py              # Twitch API authentication
│   ├── highlights_getter.py # Fetch highlights from channels
│   ├── excel_generator.py   # Create Excel files
│   ├── channel_config.py    # Preset configurations
│   ├── main.py             # Main application
│   ├── run_highlights_windows.bat # Windows batch file
│   └── highlight_output/    # Output directory
├── test_env.py              # Environment testing utility
├── requirements.txt         # Python dependencies
├── .env                    # API credentials (create this)
├── .gitignore             # Git ignore file
└── README.md              # This file
```

## Recent Updates

### v2.0 Features
- ✅ **Dual scraping modes** - Top clips and channel highlights
- ✅ **Increased clip limit** from 50 to 150 clips
- ✅ **Preset configurations** for different use cases
- ✅ **Interactive mode** for custom channel selection
- ✅ **Enhanced Excel formatting** with professional styling
- ✅ **Improved error handling** and user feedback
- ✅ **Modular architecture** with separate scraper modules
- ✅ **English-only filtering** for better content quality

## Quick Reference Commands

### Windows Users - Copy & Paste Ready Commands

```cmd
REM Setup (run once)
cd C:\path\to\twitch_clips_scraper
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

REM Test setup
python test_env.py

REM Run clip scraper
python -m clip_scraper.main

REM Run highlight scraper
python -m highlight_scraper.main gaming
python -m highlight_scraper.main variety
python -m highlight_scraper.main esports
python -m highlight_scraper.main weekly_report

REM Interactive mode
python -m highlight_scraper.main --interactive

REM List presets
python -m highlight_scraper.main --presets
```

### macOS/Linux Users - Copy & Paste Ready Commands

```bash
# Setup (run once)
cd /path/to/twitch_clips_scraper
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Test setup
python test_env.py

# Run clip scraper
python -m clip_scraper.main

# Run highlight scraper
python -m highlight_scraper.main gaming
python -m highlight_scraper.main variety
python -m highlight_scraper.main esports
python -m highlight_scraper.main weekly_report

# Interactive mode
python -m highlight_scraper.main --interactive

# List presets
python -m highlight_scraper.main --presets
```

## License

MIT License - Feel free to modify and distribute!

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the scraper!