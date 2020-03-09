// Load the module dependencies
const passport = require('passport');
const mongoose = require('mongoose');

// Define the Passport configuration method
module.exports = function() {
	// Load the 'Student' model
	const Student = mongoose.model('Student');
	
	// Use Passport's 'serializeUser' method to serialize the student number
	passport.serializeUser((student, done) => {
		done(null, student.studentNumber);
	});

	// Use Passport's 'deserializeUser' method to load the user document
	passport.deserializeUser((studentNumber, done) => {
		Student.findOne({
			studentNumber: studentNumber
			//do not show the password and salt
		}, '-password -salt', (err, student) => {
			done(err, student);
		});
	});

	// Load Passport's strategies configuration files
	require('./strategies/local.js')();
	require('./strategies/twitter.js')();
	require('./strategies/facebook.js')();
	require('./strategies/google.js')();
};