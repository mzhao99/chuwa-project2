const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true 
  },
  registration: {
    token: { 
      type: String,
      required: true 
    },
    status: { 
      type: String, 
      required: true
    },
    expiresAt: { 
      type: Date,
      required: true
    }
  }
});

module.exports = mongoose.model("User", userSchema);