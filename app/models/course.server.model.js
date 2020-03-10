// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new CommentSchema
const CourseSchema = new Schema({
    courseCode: String,
    courseName: String,
    section: String,
    semester: String,
    students: [{ type : Schema.Types.ObjectId, ref : 'Student' }]
});

mongoose.model('Course', CourseSchema);