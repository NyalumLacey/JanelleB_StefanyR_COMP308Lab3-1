// Load the module dependencies
const Student = require('mongoose').model('Student');
const Course = require('mongoose').model('Course');

exports.create = function(req, res, next) {
    // Create a new instance of the 'Course' Mongoose model
    const course = new Course(req.body);
    
    // Use the 'Student' instance's 'save' method to save a new student document
    course.save((err) => {
        if (err) {
            // Call the next middleware with an error message
            return next(err);
        } else {
            // Use the 'response' object to send a JSON response
            res.redirect('/courseList');
        }
    });
};

