const mongoose = require('mongoose');
const url =process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    match: /^\d{2,3}-\d{8,12}$/,
    required: true
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
module.exports = mongoose.model('Person', personSchema)