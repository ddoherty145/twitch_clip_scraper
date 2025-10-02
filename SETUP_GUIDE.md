# Twitch Clips Scraper - Full Stack Setup Guide

This guide will help you set up the complete Twitch Clips Scraper application with both the Python backend and React frontend.

## 🏗️ Project Architecture

```
twitch_clips_scraper/
├── api/                    # Flask API Backend
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── run_api.py        # API startup script
├── frontend/              # React Frontend
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   ├── package.json      # Node.js dependencies
│   └── README.md         # Frontend documentation
├── clip_scraper/         # Original Python modules
├── highlight_scraper/    # Original Python modules
├── shared/               # Shared Python utilities
└── requirements.txt      # Main Python dependencies
```

## 🚀 Quick Start

### **1. Backend Setup (Python API)**

```bash
# Navigate to project root
cd /path/to/twitch_clips_scraper

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install additional API dependencies
pip install flask flask-cors

# Start the API server
cd api
python run_api.py
```

The API will be available at `http://localhost:5000`

### **2. Frontend Setup (React)**

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will be available at `http://localhost:3000`

## 🔧 Detailed Setup Instructions

### **Prerequisites**

- **Python 3.7+** with virtual environment
- **Node.js 16+** and npm
- **Twitch Developer Account** with API credentials
- **Git** (optional, for version control)

### **Step 1: Environment Configuration**

1. **Create `.env` file in project root:**
   ```bash
   TWITCH_CLIENT_ID=your_client_id_here
   TWITCH_CLIENT_SECRET=your_client_secret_here
   ```

2. **Get Twitch API credentials:**
   - Go to [Twitch Developer Console](https://dev.twitch.tv/console)
   - Create a new application
   - Copy Client ID and Client Secret

### **Step 2: Backend Dependencies**

```bash
# Install Python dependencies
pip install -r requirements.txt

# Verify installation
python test_env.py
```

### **Step 3: Frontend Dependencies**

```bash
cd frontend
npm install
```

### **Step 4: Start Both Services**

**Terminal 1 - Backend:**
```bash
cd api
python run_api.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## 🌐 API Endpoints

The Flask API provides these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check and auth status |
| GET | `/api/presets` | Get available preset configurations |
| GET | `/api/presets/{name}` | Get specific preset config |
| POST | `/api/scrape/top-clips` | Start top clips scraping job |
| POST | `/api/scrape/channel-highlights` | Start channel highlights job |
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/{id}` | Get specific job status |
| GET | `/api/jobs/{id}/download` | Download Excel result |
| DELETE | `/api/jobs/{id}` | Delete job |

## 🎯 Usage Guide

### **Using the Web Interface**

1. **Open the frontend** at `http://localhost:3000`
2. **Choose scraping mode:**
   - **Top Clips**: Multi-game strategy
   - **Channel Highlights**: Specific channels
3. **Configure parameters** using the form
4. **Start scraping** and monitor progress
5. **Download results** when complete

### **Using the API Directly**

```bash
# Health check
curl http://localhost:5000/api/health

# Start top clips scraping
curl -X POST http://localhost:5000/api/scrape/top-clips \
  -H "Content-Type: application/json" \
  -d '{"days_back": 1, "limit": 150, "english_only": true}'

# Check job status
curl http://localhost:5000/api/jobs/1
```

## 🔍 Troubleshooting

### **Backend Issues**

**"Failed to get twitch token"**
- Check your `.env` file has valid credentials
- Ensure no extra spaces or quotes
- Verify Twitch app is active in Developer Console

**"Module not found" errors**
- Make sure you're in the correct directory
- Activate virtual environment
- Install dependencies with `pip install -r requirements.txt`

### **Frontend Issues**

**"Cannot connect to API"**
- Ensure backend is running on port 5000
- Check for CORS errors in browser console
- Verify API health endpoint: `http://localhost:5000/api/health`

**"npm install" fails**
- Update Node.js to version 16+
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall

### **Integration Issues**

**Jobs not updating**
- Check browser console for errors
- Verify API endpoints are responding
- Ensure both services are running

**Download not working**
- Check if job is completed
- Verify file exists on backend
- Check browser download permissions

## 🚀 Production Deployment

### **Backend Deployment**

1. **Install production dependencies:**
   ```bash
   pip install gunicorn
   ```

2. **Run with Gunicorn:**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

### **Frontend Deployment**

1. **Build for production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve static files** with nginx or similar

## 📊 Features Comparison

| Feature | Command Line | Web Interface |
|---------|-------------|---------------|
| Top Clips Scraping | ✅ | ✅ |
| Channel Highlights | ✅ | ✅ |
| Preset Configurations | ✅ | ✅ |
| Real-time Progress | ❌ | ✅ |
| Job History | ❌ | ✅ |
| File Downloads | ✅ | ✅ |
| Job Management | ❌ | ✅ |
| Modern UI | ❌ | ✅ |

## 🔄 Development Workflow

1. **Make changes to Python code** in `clip_scraper/` or `highlight_scraper/`
2. **Update API endpoints** in `api/app.py` if needed
3. **Modify frontend components** in `frontend/src/components/`
4. **Test integration** by running both services
5. **Build and deploy** when ready

## 📝 Next Steps

- **Add authentication** for multi-user support
- **Implement user accounts** and job persistence
- **Add more scraping strategies** and filters
- **Create mobile app** using React Native
- **Add real-time notifications** with WebSockets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both backend and frontend
5. Submit a pull request

## 📄 License

MIT License - Feel free to modify and distribute!
