// I need Mongoose so I can use a database for my assignments
const mongoose = require('mongoose');

// Here I'm making a Schema, which is like a blueprint for how my assignments look
const Schema = mongoose.Schema;

// This creates the assignment Schema—it's kind of like a template for each assignment I save
const assignmentSchema = new Schema({
  // Every assignment must have a title (like "Math Homework"). It must be a text value!
  assignmentTitle: { type: String, required: true },

  // Every assignment must have a class name (like "Math", "Science"). This is also text!
  class: { type: String, required: true },

  // Every assignment must have an explanation (where you can tell more about the project). Also text!
  projectExplanation: { type: String, required: true },

  // This is a list of people who worked on the assignment. Every name is text and must be included!
  projectMembers: [{ type: String, required: true }],

  // The year the assignment was completed, like 2025. This must be a number!
  yearOfCompletion: { type: Number, required: true }
});

// This part lets my app actually use the blueprint, so I can save and load assignments in the database
module.exports = mongoose.model('Assignment', assignmentSchema);