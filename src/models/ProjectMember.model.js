const mongoose = require('mongoose');

const projectMemberSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['ADMIN', 'EDIT', 'VIEW'],
    default: 'VIEW',
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'A userId is required'],
  },
}, { timestamps: true });

const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);

module.exports = ProjectMember;
