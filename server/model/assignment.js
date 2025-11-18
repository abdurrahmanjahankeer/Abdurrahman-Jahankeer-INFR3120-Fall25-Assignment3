const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  assignmentTitle: { type: String, required: true },
  class: { type: String, required: true },
  projectExplanation: { type: String, required: true },
  projectMembers: [{ type: String }],     // Array of strings
  yearOfCompletion: { type: Number, required: true }
});

module.exports = mongoose.model('Assignment', assignmentSchema);