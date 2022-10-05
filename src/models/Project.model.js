const mongoose = require('mongoose');
const ProjectMember = require('./ProjectMember.model').schema;

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A project title is required'],
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['PUBLIC', 'PRIVATE'],
    default: 'PUBLIC',
  },
  members: [ProjectMember],
}, { timestamps: true, toJSON: { virtuals: true } });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
