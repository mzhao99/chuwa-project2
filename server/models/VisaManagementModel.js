const mongoose = require("mongoose");
const { Schema } = mongoose;

const visaManagementSchema = new Schema({
  employeeId: { 
    type: Schema.Types.ObjectId, 
    ref: "Employee", 
    required: true 
  },
  currentStepStatus: { 
    type: String, 
    required: true 
  },
  currentStep: { 
    type: String,
    required: true 
  },
  steps: [
    {
      type: { 
        type: String, 
        required: true 
      },
      status: { 
        type: String, 
        required: true 
      },
      feedback: { 
        type: String 
      },
      documents: [
        {
          fileUrl: { 
            type: String, 
            required: true 
          },
          createdAt: { 
            type: Date, 
            default: Date.now 
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("VisaManagement", visaManagementSchema);