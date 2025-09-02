@echo off
echo 🎯 Channel Highlights Scraper - Windows Runner
echo =============================================

REM Check if virtual environment exists
if not exist "venv" (
    echo ❌ Virtual environment not found!
    echo Please run setup_windows.bat first
    pause
    exit /b 1
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if .env exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo Please create .env file with your Twitch API credentials
    pause
    exit /b 1
)

REM Show menu
echo.
echo Choose an option:
echo 1. Default highlights (gaming channels, 7 days)
echo 2. Gaming preset (8 channels, 3 days)
echo 3. Variety preset (6 channels, 7 days)
echo 4. Esports preset (all esports channels)
echo 5. Weekly report (10 channels, 7 days, 25 clips each)
echo 6. Interactive mode (choose your own channels)
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo 🚀 Running default configuration...
    python highlights_main.py
) else if "%choice%"=="2" (
    echo 🎮 Running gaming preset...
    python highlights_main.py gaming
) else if "%choice%"=="3" (
    echo 🎭 Running variety preset...
    python highlights_main.py variety
) else if "%choice%"=="4" (
    echo 🏆 Running esports preset...
    python highlights_main.py esports
) else if "%choice%"=="5" (
    echo 📊 Running weekly report preset...
    python highlights_main.py weekly_report
) else if "%choice%"=="6" (
    echo 💬 Running interactive mode...
    python highlights_main.py --interactive
) else (
    echo ❌ Invalid choice
    pause
    exit /b 1
)

echo.
echo ✅ Process completed!
echo 📂 Check the highlights_output/ folder for your Excel file
pause