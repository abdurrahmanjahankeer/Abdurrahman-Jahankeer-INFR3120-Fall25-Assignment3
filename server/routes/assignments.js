// This sets up Express so we can build a website
const express = require('express');

// This creates a router to organize assignment pages and actions
const router = express.Router();

// This lets me use my Assignment template/model
const Assignment = require('../model/assignment');


// Show all assignments in a big list
router.get('/', async (req, res) => {
  try {
    // I tell the database: find all assignments
    const assignments = await Assignment.find();
    // Now show the list page with all assignments and a title
    res.render('Assignments/list', { assignments, title: "Assignments" });
  } catch (err) {
    // If there’s an error, show the error page
    res.status(500).render('error', { message: err.message, error: err, title: "Error" });
  }
});

// Show the page with a form to add new assignment
router.get('/add', (req, res) => {
  // Just show the add assignment page and give it a title
  res.render('Assignments/add', { title: "Assignments" });
});

// This is what happens when you press "Add Assignment" (it saves your work)
router.post('/add', async (req, res) => {
  try {
    // Get all the details the user typed in the assignment form
    const { assignmentTitle, class: className, projectExplanation, projectMembers, yearOfCompletion } = req.body;
    // Save a new assignment in the database
    await Assignment.create({
      assignmentTitle,
      class: className,
      projectExplanation,
      projectMembers: projectMembers.split(',').map(m => m.trim()),
      yearOfCompletion
    });
    // Go back to the assignments list so the user can see their new assignment
    res.redirect('/assignments');
  } catch (err) {
    // If something goes wrong, show the error page
    res.status(400).render('error', { message: "Error adding assignment: " + err.message, error: err, title: "Error" });
  }
});

// Show the page to edit an assignment
router.get('/edit/:id', async (req, res) => {
  try {
    // Find the assignment in the database by its ID
    const assignment = await Assignment.findById(req.params.id).lean();
    // Show the edit page for that assignment
    res.render('Assignments/edit', { assignment, title: "Assignments" });
  } catch (err) {
    // If there’s a problem, show the error page
    res.status(404).render('error', { message: "Assignment not found", error: err, title: "Error" });
  }
});

// This happens after you edit an assignment and press save
router.post('/edit/:id', async (req, res) => {
  try {
    // Get the updated assignment information from the form
    const { assignmentTitle, class: className, projectExplanation, projectMembers, yearOfCompletion } = req.body;
    // Update the assignment in the database by its ID
    await Assignment.findByIdAndUpdate(req.params.id, {
      assignmentTitle,
      class: className,
      projectExplanation,
      projectMembers: projectMembers.split(',').map(m => m.trim()),
      yearOfCompletion
    });
    // Go back to the list of assignments
    res.redirect('/assignments');
  } catch (err) {
    // If there’s a problem, show the error page
    res.status(400).render('error', { message: "Error editing assignment: " + err.message, error: err, title: "Error" });
  }
});

// This deletes an assignment when you click "Delete"
router.get('/delete/:id', async (req, res) => {
  try {
    // Find the assignment by its ID and delete it from the database
    await Assignment.findByIdAndDelete(req.params.id);
    // Refresh the page so the user sees the updated list
    res.redirect('/assignments');
  } catch (err) {
    // If there’s a problem, show the error page
    res.status(400).render('error', { message: "Error deleting assignment: " + err.message, error: err, title: "Error" });
  }
});

// This lets my app use this router for assignment pages
module.exports = router;