// Load the module dependencies
const Student = require('mongoose').model('Student');

// Create a new error handling controller method
const getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Student number already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (const errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};

// Create a new controller method that renders the signin page
exports.renderSignin = function(req, res, next) {
	// If student is not connected render the signin page, otherwise redirect the student back to the main application page
	if (!req.student) {
		// Use the 'response' object to render the signin page
		res.render('signin', {
			// Set the page title variable
			title: 'Sign-in Form',
			// Set the flash message variable
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that renders the signup page
exports.renderSignup = function(req, res, next) {
	// If student is not connected render the signup page, otherwise redirect the student back to the main application page
	if (!req.student) {
		// Use the 'response' object to render the signup page
		res.render('signup', {
			// Set the page title variable
			title: 'Sign-up Form',
			// read the message from flash variable
			badmessage: req.flash('error') //passes the error stored in flash
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that creates new 'regular' students
exports.signup = function(req, res, next) {
	// If student is not connected, create and login a new student, otherwise redirect the student back to the main application page
	if (!req.student) {
		// Create a new 'Student' model instance
        const student = new Student(req.body);
        console.log(req.body)
		const message = null;

		// Set the student provider property
		student.provider = 'local';

		// Try saving the new student document
		student.save((err) => {
			// If an error occurs, use flash messages to report the error
			if (err) {
				// Use the error handling method to get the error message
				const message = getErrorMessage(err);
                console.log(err)
				// save the error in flash
				req.flash('error', message); //save the error into flash memory

				// Redirect the student back to the signup page
				return res.redirect('/signup');
			}

			// If the student was created successfully use the Passport 'login' method to login
			req.login(student, (err) => {
				// If a login error occurs move to the next middleware
				if (err) return next(err);

				// Redirect the student back to the main application page
				return res.redirect('/');
			});
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
	// Use the Passport 'logout' method to logout
	req.logout();

	// Redirect the student back to the main application page
	res.redirect('/');
};