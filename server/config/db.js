// We need Mongoose so we can talk to the database
const mongoose = require('mongoose');

// This function connects our website to the database using a secret link (from .env)
module.exports = () => {
  // Tell Mongoose to connect using our special link and make it extra safe and modern
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  // If it works, let us know in the console!
  .then(() => console.log('MongoDB Connected!'))
  // If something goes wrong, show the error so we can fix it
  .catch((err) => console.log('MongoDB ERROR: ', err));
};