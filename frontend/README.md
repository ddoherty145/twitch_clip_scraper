# Twitch Clips Scraper - React Frontend

A modern, beautiful React TypeScript frontend for the Twitch Clips Scraper application.

## 🚀 Features

### **Modern UI Components**
- **📊 Scraping Interface**: Intuitive configuration forms for both scraping modes
- **📈 Real-time Progress**: Live job monitoring with progress bars and status updates
- **📋 Job History**: Complete job management with download and delete functionality
- **🎨 Beautiful Design**: Modern UI with Tailwind CSS and Lucide React icons

### **Scraping Modes**
- **🎮 Top Clips Mode**: Multi-game strategy with English filtering
- **👥 Channel Highlights Mode**: Targeted scraping from specific channels
- **⚙️ Advanced Configuration**: Customizable parameters for both modes

### **Real-time Features**
- **🔄 Live Updates**: Automatic job status polling every 2 seconds
- **📊 Progress Tracking**: Real-time progress bars and status indicators
- **📁 File Downloads**: Direct Excel file downloads when jobs complete
- **🗑️ Job Management**: Delete completed or failed jobs

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **Create React App** for tooling

## 📦 Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### **API Connection**
The frontend connects to the Flask API backend running on `http://localhost:5000`. Make sure the backend is running before using the frontend.

### **Environment Variables**
No environment variables are required for the frontend. All configuration is handled through the UI.

## 🎯 Usage

### **Starting a Scraping Job**

1. **Choose Scraping Mode:**
   - **Top Clips**: Scrapes top clips across multiple game categories
   - **Channel Highlights**: Scrapes highlights from specific channels

2. **Configure Parameters:**
   - **Days Back**: How many days to look back (1-30)
   - **Max Clips**: Maximum number of clips to collect
   - **English Only**: Filter for English content (Top Clips mode only)
   - **Channels**: Comma-separated list of channel names (Channel Highlights mode)

3. **Start Scraping:**
   - Click "Start Scraping" button
   - Monitor progress in the Job History panel
   - Download Excel file when complete

### **Managing Jobs**

- **View Status**: All jobs are displayed in the Job History panel
- **Monitor Progress**: Real-time progress bars and status updates
- **Download Results**: Click download icon to get Excel file
- **Delete Jobs**: Remove completed or failed jobs

## 🎨 UI Components

### **Header**
- Application branding and title
- Export functionality indicator

### **Scraping Interface**
- Mode selection (Top Clips vs Channel Highlights)
- Configuration forms with validation
- Start/stop scraping controls

### **Job History**
- List of all scraping jobs
- Real-time status updates
- Progress indicators
- Download and delete actions

## 🔌 API Integration

The frontend communicates with the Flask backend through these endpoints:

- `GET /api/health` - Health check
- `GET /api/presets` - Get available presets
- `POST /api/scrape/top-clips` - Start top clips scraping
- `POST /api/scrape/channel-highlights` - Start channel highlights scraping
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/{id}` - Get specific job status
- `GET /api/jobs/{id}/download` - Download job result
- `DELETE /api/jobs/{id}` - Delete job

## 🚀 Development

### **Available Scripts**

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### **Project Structure**

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ScrapingInterface.tsx
│   │   └── JobHistory.tsx
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## 🎨 Styling

The application uses **Tailwind CSS** for styling with a custom purple color scheme:

- **Primary**: Purple-600 (#9333ea)
- **Background**: Gray-50 (#f9fafb)
- **Cards**: White with subtle shadows
- **Text**: Gray-900 for headings, Gray-600 for body text

## 🔄 Real-time Updates

The application automatically polls the backend every 2 seconds to:
- Update job statuses
- Refresh progress bars
- Enable download buttons when jobs complete
- Show error messages for failed jobs

## 📱 Responsive Design

The interface is fully responsive with:
- **Mobile**: Single column layout
- **Tablet**: Optimized spacing and sizing
- **Desktop**: Two-column layout with side-by-side panels

## 🚀 Production Build

To build for production:

```bash
npm run build
```

This creates an optimized build in the `build/` directory.

## 🤝 Contributing

1. Make changes to components in `src/components/`
2. Update API calls in `src/services/api.ts`
3. Test with the running backend
4. Build and test production version

## 📄 License

MIT License - Feel free to modify and distribute!