const mongoose = require('mongoose');

const pcosAnalysisSchema = new mongoose.Schema({
  userId: String,
  // Basic Information
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  weight: {
    type: Number,
    required: true,
    min: 20,
    max: 300
  },
  height: {
    type: Number,
    required: true,
    min: 100,
    max: 250
  },
  cycle: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  // Symptoms
  symptoms: {
    hairGrowth: {
      type: Boolean,
      default: false
    },
    skinDarkening: {
      type: Boolean,
      default: false
    },
    hairLoss: {
      type: Boolean,
      default: false
    },
    pimples: {
      type: Boolean,
      default: false
    }
  },
  // Analysis Results
  bmi: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Calculate BMI before saving
pcosAnalysisSchema.pre('save', function(next) {
  if (this.height && this.weight) {
    // BMI = weight(kg) / height(m)²
    this.bmi = this.weight / Math.pow(this.height / 100, 2);
  }
  next();
});

module.exports = mongoose.model('PCOSAnalysis', pcosAnalysisSchema);
