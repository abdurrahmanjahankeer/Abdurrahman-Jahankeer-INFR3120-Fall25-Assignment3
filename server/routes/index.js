const passport = require('passport');
let userModel = require('../model/user');
let User = userModel.User;

// First, let's set up Express so we can build our website
let express = require('express');

// We need a router to organize the different pages on the site
let router = express.Router();

// This is for the homepage. When someone visits '/', they see the main page!
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    displayName: req.user ? req.user.displayName : ""
  });
});

// This makes an About page. If someone goes to '/about', they can learn more!
router.get('/about', function(req, res, next) {
  res.render('about', { 
    title: 'About',
    displayName: req.user ? req.user.displayName : ""
  });
});

// This is the Contact page, so people can get in touch with me
router.get('/contact', function(req, res, next) {
  res.render('contact', { 
    title: 'Contact',
    displayName: req.user ? req.user.displayName : ""
  });
});

// Get method for login
router.get('/login', function(req,res,next){
  if(!req.user)
  {
    res.render('auth/login',
      {
        title:'Login',
        message: req.flash('loginMessage')
      }
    )
  }
  else
  {
    return res.redirect("/")
  }
});

// Post method for login
router.post('/login', function(req,res,next){
  passport.authenticate('local',(err,user,info)=>{
    if(err)
    {
      return next(err);
    }
    if(!user)
    {
      req.flash('loginMessage','Authentication Error: Invalid username or password');
      return res.redirect('/login');
    }
    req.login(user,(err)=>{
      if(err)
      {
        return next(err);
      }
      return res.redirect("/assignments")
    })
  })(req,res,next)
});

// Get method for register
router.get('/register', function(req,res,next){
  if(!req.user)
  {
    res.render('auth/register',
      {
        title:'Register',
        message: req.flash('registerMessage')
      }
    )
  }
  else
  {
    return res.redirect("/")
  }
});

// Post method for register
router.post('/register', function(req,res,next){
  let newUser = new User({
    username: req.body.username,
    //password: req.body.password,
    email:req.body.email,
    displayName: req.body.displayName
  })
  User.register(newUser, req.body.password, (err)=>{
    if(err)
    {
      console.log("Error:Inserting the new user");
      if(err.name=="UserExistingError")
      {
        req.flash('registerMessage','Registration Error: User already exists');
      }
      return res.render('auth/register',
        {
          title:'Register',
          message:req.flash('registerMessage')
        }
      )
    }
    else{
      return passport.authenticate('local')(req,res,()=>{
        res.redirect("/assignments");
      })
    }
  })
});

router.get('/logout',function(req,res,next){
  req.logout(function(err)
  {
    if(err)
    {
      return next(err)
    }
  })
  res.redirect("/");
})

// This lets our app use these page routes for the website
module.exports = router;