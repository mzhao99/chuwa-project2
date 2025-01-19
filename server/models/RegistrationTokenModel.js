const mongoose = require("mongoose");
const { Schema } = mongoose;

const registrationTokenSchema = new Schema({
  token: { 
    type: String, 
    required: true 
  },
  email: { 
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
  },
});

module.exports = mongoose.model("RegistrationToken", registrationTokenSchema);
