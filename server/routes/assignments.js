const express = require('express');
const router = express.Router();
const Assignment = require('../model/assignment');

// Show all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.render('Assignments/list', { assignments });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Show form to add new assignment
router.get('/add', (req, res) => {
  res.render('Assignments/add');
});

// Handle add form submission
router.post('/add', async (req, res) => {
  try {
    const { assignmentTitle, class: className, projectExplanation, projectMembers, yearOfCompletion } = req.body;
    await Assignment.create({
      assignmentTitle,
      class: className,
      projectExplanation,
      projectMembers: projectMembers.split(',').map(m => m.trim()), // splits on commas for form field
      yearOfCompletion
    });
    res.redirect('/assignments');
  } catch (err) {
    res.status(400).send('Error adding assignment: ' + err);
  }
});

// Show form to edit assignment
router.get('/edit/:id', async (req, res) => {
  const assignment = await Assignment.findById(req.params.id).lean();
  res.render('Assignments/edit', { assignment });
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
    res.status(400).send('Error editing assignment: ' + err);
  }
});

// Delete assignment
router.get('/delete/:id', async (req, res) => {
  await Assignment.findByIdAndRemove(req.params.id);
  res.redirect('/assignments');
});

module.exports = router;