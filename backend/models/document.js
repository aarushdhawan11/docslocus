const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const docSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  versions: [versionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Document', docSchema);
