const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("User", UserSchema);
