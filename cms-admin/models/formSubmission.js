// models/formSubmission.js
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    website_name: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
         
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
        
    },
});

const FormSubmission = mongoose.model('requestSubmission', formSchema);

module.exports = FormSubmission;
