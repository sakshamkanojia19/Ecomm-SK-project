
const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


interestSchema.index({ user: 1 }, { unique: true });

const Interest = mongoose.model('Interest', interestSchema);

module.exports = Interest;
