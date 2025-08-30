@echo off
echo 👾 Twitch Clips Scraper - Windows Runner
echo =======================================

REM Check if venv exists
if not exist "venv" (
    echo 📦 Creating Virtual Environment...
    python -m venv venv
    is errorlevel 1 (
        echo ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies if needed
if not exist "venv\Scripts\pip.exe" (
    echo ❌ Virtual environment seems corrupted 
    pause
    exit /b 1
)

echo 📋 Installing/updating dependencies...
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo ❌ .env file not found
    echo please create a .env file in the root of the project
    echo TWITCH_CLIENT_ID=your_client_id_here
    echo TWITCH_CLIENT_SECRET=your_client_secret_here
    pause
    exit /b 1
)

echo 🚀 Running the application...
echo.
python main.py

echo.
echo ✅ Done!
pause