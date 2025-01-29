# PCOS Assistant - AI-Powered PCOS Risk Analysis and Support System

## Overview
PCOS Assistant is an intelligent healthcare application that helps users understand their PCOS (Polycystic Ovary Syndrome) risk factors through AI-powered analysis and provides personalized recommendations. The system combines machine learning with a conversational interface to deliver comprehensive PCOS support.

## Features
- 🤖 AI-powered chatbot for PCOS information
- 📊 Risk analysis based on personal health data
- 💡 Personalized recommendations
- 📈 BMI calculation and interpretation
- 🔍 Symptom tracking and analysis
- 📱 Responsive design for all devices

## Tech Stack

### Frontend
- React 18.2.0
- Chakra UI for component design
- Emotion for styling
- Framer Motion for animations
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB for data persistence
- Winston for logging
- Natural for NLP
- Joi for validation

### ML Service
- Python 3.9+
- Flask
- scikit-learn
- NumPy
- Pandas
- Joblib

## Prerequisites
- Node.js (v16+)
- Python 3.9+
- MongoDB
- npm or yarn
- pip

## Project Structure
```
mm/
├── client/              # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/  # React components
│       └── services/    # API services
├── server/             # Backend Node.js application
│   ├── models/        # MongoDB models
│   ├── services/      # Business logic
│   └── data/         # Chatbot intents
└── ml/               # Machine Learning service
    ├── models/       # Trained models
    └── scripts/      # Training scripts
```

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mm
```

### 2. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000
REACT_APP_ML_URL=http://localhost:5001" > .env
```

### 3. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/pcos
ALLOWED_ORIGINS=http://localhost:3000
ML_SERVICE_URL=http://localhost:5001" > .env
```

### 4. ML Service Setup
```bash
cd ml

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 5. MongoDB Setup
- Install MongoDB Community Edition
- Start MongoDB service
```bash
sudo systemctl start mongod  # On Linux
```

## Running the Application

1. Start MongoDB (if not running):
```bash
sudo systemctl start mongod
```

2. Start the ML Service:
```bash
cd ml
source venv/bin/activate
python app.py
```

3. Start the Backend Server:
```bash
cd server
npm run dev
```

4. Start the Frontend:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML Service: http://localhost:5001

## API Documentation

### Chat Endpoint
POST /chat
```json
{
  "message": "string"
}
```

### Analysis Endpoint
POST /analyze
```json
{
  "age": "number",
  "weight": "number",
  "height": "number",
  "cycle": "number",
  "hairGrowth": "boolean",
  "skinDarkening": "boolean",
  "hairLoss": "boolean",
  "pimples": "boolean"
}
```

## Testing

### Running Tests
1. Frontend Tests:
```bash
cd client
npm test
```

2. Backend Tests:
```bash
cd server
npm test
```

3. ML Service Tests:
```bash
cd ml
python -m pytest
```

## Deployment

### Using Docker
```bash
# Build and run all services
docker-compose up --build
```

### Manual Deployment
1. Set up MongoDB
2. Configure environment variables
3. Build frontend
4. Start all services

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## Troubleshooting

Common Issues:
1. CORS Errors:
   - Verify ALLOWED_ORIGINS in backend .env
   - Check frontend API URL configuration

2. MongoDB Connection:
   - Ensure MongoDB is running
   - Verify connection string

3. ML Service:
   - Check Python version compatibility
   - Verify model files exist

## Security Considerations
- Input validation on all endpoints
- CORS configuration
- Rate limiting
- Data encryption
- Secure headers

## Performance Optimization
- Frontend bundle optimization
- API response caching
- Database indexing
- ML model optimization

## Future Enhancements
- User authentication
- History tracking
- Advanced analytics
- Mobile app
- Email notifications

## License
MIT License

## Acknowledgments
- Medical information sources
- Open source libraries
- Contributors

