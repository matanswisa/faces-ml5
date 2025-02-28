const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const RecognziedPeople = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    descriptors:{
        type: Array,
        required: true
    },
    imagePath: {
        type: ObjectId,
        required: true
    },
}, { timestamps: true });


exports.RecognizedPeople = mongoose.model('RecognziedPeople', RecognziedPeople);
