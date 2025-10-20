const mongoose = require('mongoose');

// Supermarket schema for caminando-online database
const supermarketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  logo: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  categoriesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  productsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastScraped: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'supermarkets'
});

// Indexes for better performance
supermarketSchema.index({ name: 1 });
supermarketSchema.index({ isActive: 1 });
supermarketSchema.index({ createdAt: -1 });

// Pre-save middleware to update updatedAt
supermarketSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static methods
supermarketSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

supermarketSchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i'), isActive: true });
};

// Instance methods
supermarketSchema.methods.getStats = function() {
  return {
    id: this._id,
    name: this.name,
    categoriesCount: this.categoriesCount,
    productsCount: this.productsCount,
    lastScraped: this.lastScraped
  };
};

supermarketSchema.methods.markAsScraped = function() {
  this.lastScraped = new Date();
  return this.save();
};

// Virtual for URL-friendly name
supermarketSchema.virtual('slug').get(function() {
  return this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
});

// Ensure virtual fields are serialized
supermarketSchema.set('toJSON', { virtuals: true });
supermarketSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Supermarket', supermarketSchema);