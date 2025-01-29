require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const winston = require('winston');
const fetch = require('node-fetch');
const { validateAnalysis } = require('./validators');
const PCOSAnalysis = require('./models/PCOSAnalysis');
const chatbot = require('./services/chatbot');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pcos')
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatbot.processMessage('anonymous', message);
    logger.info('Chat processed', { message, response });
    res.json(response);
  } catch (error) {
    logger.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Analysis endpoint
app.post('/analyze', async (req, res) => {
  try {
    logger.info('Received analysis request:', req.body);

    // Validate request
    const { error } = validateAnalysis(req.body);
    if (error) {
      logger.error('Validation error:', error.details);
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Calculate BMI
    const heightInMeters = req.body.height / 100;
    const bmi = req.body.weight / (heightInMeters * heightInMeters);

    // Call ML service
    const mlResponse = await fetch(`${process.env.ML_SERVICE_URL || 'http://localhost:5001'}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...req.body,
        bmi: parseFloat(bmi.toFixed(2))
      })
    });

    if (!mlResponse.ok) {
      throw new Error('ML service error');
    }

    const mlResult = await mlResponse.json();
    logger.info('ML service response:', mlResult);

    // Create analysis record
    const analysis = new PCOSAnalysis({
      userId: req.body.userId || 'anonymous',
      age: req.body.age,
      weight: req.body.weight,
      height: req.body.height,
      cycle: req.body.cycle,
      bmi: parseFloat(bmi.toFixed(2)),
      symptoms: {
        hairGrowth: req.body.hairGrowth || false,
        skinDarkening: req.body.skinDarkening || false,
        hairLoss: req.body.hairLoss || false,
        pimples: req.body.pimples || false
      },
      riskLevel: Math.round(mlResult.probability * 100)
    });

    await analysis.save();
    logger.info('Analysis saved', { id: analysis._id });

    // Send response
    const response = {
      risk: Math.round(mlResult.probability * 100),
      bmi: parseFloat(bmi.toFixed(2)),
      riskLevel: getRiskLevel(mlResult.probability),
      recommendations: getRiskRecommendations(mlResult.probability)
    };

    res.json(response);

  } catch (error) {
    logger.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

// Helper Functions
function getRiskLevel(probability) {
  const risk = probability * 100;
  if (risk > 70) return 'High';
  if (risk > 40) return 'Medium';
  return 'Low';
}

function getRiskRecommendations(probability) {
  const risk = probability * 100;
  
  if (risk > 70) {
    return {
      message: "High risk detected. Please consult a healthcare provider.",
      steps: [
        "Schedule an appointment with a gynecologist immediately",
        "Keep a detailed record of your symptoms",
        "Consider comprehensive hormonal testing",
        "Begin monitoring your diet and exercise routine",
        "Track your menstrual cycle carefully"
      ],
      urgency: "high"
    };
  } else if (risk > 40) {
    return {
      message: "Moderate risk detected. Monitor your symptoms.",
      steps: [
        "Track your menstrual cycle regularly",
        "Maintain a balanced, healthy diet",
        "Exercise for at least 30 minutes daily",
        "Consult a healthcare provider if symptoms worsen",
        "Consider lifestyle modifications"
      ],
      urgency: "medium"
    };
  } else {
    return {
      message: "Low risk detected. Maintain healthy habits.",
      steps: [
        "Continue maintaining a healthy lifestyle",
        "Schedule regular check-ups",
        "Monitor any changes in your cycle",
        "Stay active and maintain a balanced diet"
      ],
      urgency: "low"
    };
  }
}

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});
