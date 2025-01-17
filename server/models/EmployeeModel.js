const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    preferredName: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    cellPhone: {
      type: String,
      required: true,
    },
    workPhone: {
      type: String,
    },
    ssn: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  address: {
    building: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
  workAuthorization: {
    citizenshipStatus: {
      type: String,
      required: true,
    },
    visaTitle: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  reference: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    relationship: {
      type: String,
      required: true,
    },
  },
  emergencyContacts: [
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
      relationship: {
        type: String,
        required: true,
      },
    },
  ],
  files: [
    {
      type: { 
        type: String, 
        required: true 
      },
      fileUrl: { 
        type: String, 
        required: true 
      },
      status: {
        type: String,
        required: true,
      },
      feedback: { 
        type: String 
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      },
    },
  ],
});

module.exports = mongoose.model("Employee", registrationTokenSchema);