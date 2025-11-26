let userModel = require('../model/user');
let User = userModel.User;

// This sets up Express so we can build a website
let express = require('express');

// This creates a router to organize assignment pages and actions
let router = express.Router();

// This lets me use my Assignment template/model
let Assignment = require('../model/assignment');

let mongoose = require('mongoose');

function requireAuth(req,res,next)
{
    if(!req.isAuthenticated())
    {
        return res.redirect('/login')
    }
    next();
}

// Show all assignments in a big list
router.get('/', async (req, res, next) => {
  try {
    // I tell the database: find all assignments
    let assignments = await Assignment.find();
    // Now show the list page with all assignments and a title
    res.render('Assignments/list', { 
      assignments, 
      title: "Assignments",
      displayName: req.user ? req.user.displayName : ""
    });
  } catch (err) {
    // If there’s an error, show the error page
    console.log(err);
    res.render('Assignments/list', {
      error: 'Error on the Server',
      title: 'Error',
      assignments: [],
      displayName: req.user ? req.user.displayName : ""
    });
  }
});

// Show the page with a form to add new assignment
router.get('/add', requireAuth, async (req, res, next) => {
  try {
    // Just show the add assignment page and give it a title
    res.render('Assignments/add', { 
      title: "Assignments",
      displayName: req.user ? req.user.displayName : ""
    });
  } catch (err) {
    console.log(err);
    res.render('Assignments/list', {
      error: 'Error on the Server',
      title: 'Error',
      assignments: [],
      displayName: req.user ? req.user.displayName : ""
    });
  }
});

// This is what happens when you press "Add Assignment" (it saves your work)
router.post('/add', requireAuth, async (req, res, next) => {
  try {
    // Get all the details the user typed in the assignment form
    let { assignmentTitle, class: className, projectExplanation, projectMembers, yearOfCompletion, username } = req.body;

    // This checks if the username exists in the User collection
    let existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.render('Assignments/add', {
        title: "Assignments",
        displayName: req.user ? req.user.displayName : "",
        error: 'Error: Username does not exist. Please enter a registered username.'
      });
    }

    // Save a new assignment in the database
    let newAssignment = Assignment({
      assignmentTitle: assignmentTitle,
      class: className,
      projectExplanation: projectExplanation,
      projectMembers: projectMembers.split(',').map(m => m.trim()),
      yearOfCompletion: yearOfCompletion,
      username: username
    });
    await Assignment.create(newAssignment);

    // Go back to the assignments list so the user can see their new assignment
    res.redirect('/assignments');
  } catch (err) {
    // If something goes wrong, show the error page
    console.log(err);
    res.render('Assignments/add', {
      error: 'Error on the Server',
      title: 'Error',
      displayName: req.user ? req.user.displayName : ""
    });
  }
});

// Show the page to edit an assignment
router.get('/edit/:id', requireAuth, async (req, res, next) => {
  try {
    // Find the assignment in the database by its ID
    let id = req.params.id;
    let assignment = await Assignment.findById(id);
    // Show the edit page for that assignment
    res.render('Assignments/edit', { 
      assignment, 
      title: "Assignments",
      displayName: req.user ? req.user.displayName : ""
    });
  } catch (err) {
    // If there’s a problem, show the error page
    console.log(err);
    next(err);
  }
});

// This happens after you edit an assignment and press save
router.post('/edit/:id', requireAuth, async (req, res, next) => {
  try {
    // Get the updated assignment information from the form
    let { assignmentTitle, class: className, projectExplanation, projectMembers, yearOfCompletion, username } = req.body;

    // Validate that the username exists in User collection
    let existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      // If not found, re-render edit page with error
      let assignment = await Assignment.findById(req.params.id);
      return res.render("Assignments/edit", {
        title: 'Assignments',
        assignment: assignment,
        displayName: req.user ? req.user.displayName : "",
        error: 'Error: Username does not exist. Please enter a registered username.'
      });
    }

    let id = req.params.id;
    let updateAssignment = Assignment({
      _id: id,
      assignmentTitle: assignmentTitle,
      class: className,
      projectExplanation: projectExplanation,
      projectMembers: projectMembers.split(',').map(m => m.trim()),
      yearOfCompletion: yearOfCompletion,
      username: username
    });

    await Assignment.findByIdAndUpdate(id, updateAssignment);
    // Go back to the list of assignments
    res.redirect("/assignments");
  } catch (err) {
    // If there’s a problem, show the error page
    console.log(err);
    next(err);
  }
});

// This deletes an assignment when you click "Delete"
router.get('/delete/:id', requireAuth, async (req, res, next) => {
  try {
    // Find the assignment by its ID and delete it from the database
    let id = req.params.id;
    Assignment.deleteOne({ _id: id }).then(() => {
      // Refresh the page so the user sees the updated list
      res.redirect("/assignments");
    });
  } catch (err) {
    // If there’s a problem, show the error page
    console.log(err);
    next(err);
  }
});

// This lets my app use this router for assignment pages
module.exports = router;