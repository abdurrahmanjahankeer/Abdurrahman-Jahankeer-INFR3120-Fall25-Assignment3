const express = require('express');
const router = express.Router();
const Assignment = require('../model/assignment');

// --- FIXED: Always pass title to views ---

// Show all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    // FIXED: passing title
    res.render('Assignments/list', { assignments, title: "Assignments" });
  } catch (err) {
    // FIXED: pass title to error view
    res.status(500).render('error', { message: err.message, error: err, title: "Error" });
  }
});

// Show form to add new assignment
router.get('/add', (req, res) => {
  // FIXED: passing title
  res.render('Assignments/add', { title: "Assignments" });
});

// Handle add form submission
router.post('/add', async (req, res) => {
  try {
    const { assignmentTitle, class: className, projectExplanation, projectMembers, yearOfCompletion } = req.body;
    await Assignment.create({
      assignmentTitle,
      class: className,
      projectExplanation,
      projectMembers: projectMembers.split(',').map(m => m.trim()),
      yearOfCompletion
    });
    res.redirect('/assignments');
  } catch (err) {
    // FIXED: pass title to error view
    res.status(400).render('error', { message: "Error adding assignment: " + err.message, error: err, title: "Error" });
  }
});

// Show form to edit assignment
router.get('/edit/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();
    // FIXED: pass title to edit view
    res.render('Assignments/edit', { assignment, title: "Assignments" });
  } catch (err) {
    // FIXED: pass title to error view
    res.status(404).render('error', { message: "Assignment not found", error: err, title: "Error" });
  }
});

// Handle edit form submission
router.post('/edit/:id', async (req, res) => {
  try {
    const { assignmentTitle, class: className, projectExplanation, projectMembers, yearOfCompletion } = req.body;
    await Assignment.findByIdAndUpdate(req.params.id, {
      assignmentTitle,
      class: className,
      projectExplanation,
      projectMembers: projectMembers.split(',').map(m => m.trim()),
      yearOfCompletion
    });
    res.redirect('/assignments');
  } catch (err) {
    // FIXED: pass title to error view
    res.status(400).render('error', { message: "Error editing assignment: " + err.message, error: err, title: "Error" });
  }
});

// Delete assignment
router.get('/delete/:id', async (req, res) => {
  try {
    await Assignment.findByIdAndRemove(req.params.id);
    res.redirect('/assignments');
  } catch (err) {
    // FIXED: pass title to error view
    res.status(400).render('error', { message: "Error deleting assignment: " + err.message, error: err, title: "Error" });
  }
});

module.exports = router;
