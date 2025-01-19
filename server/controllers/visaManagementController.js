const VisaManagement = require("../models/VisaManagementModel");
const Employee = require("../models/EmployeeModel");

const createVisa = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const newVisa = new VisaManagement({
      employeeId,
      currentStepStatus: "pending",
      currentStep: "OPT_RECEIPT",
      steps: [
        {
          type: "OPT_RECEIPT",
          status: "pending", 
          feedback: "", 
          documents: [], 
        },
        {
          type: "EAD",
          status: "not_started",
          feedback: "",
          documents: [],
        },
        {
          type: "I983",
          status: "not_started",
          feedback: "",
          documents: [],
        },
        {
          type: "I20",
          status: "not_started",
          feedback: "",
          documents: [],
        },
      ],
    });
    await newVisa.save();
    res.status(201).json({ message: "Visa record created successfully", visa: newVisa });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getVisaByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const visa = await VisaManagement.findOne({ employeeId }).populate("employeeId");
    if (!visa) {
      return res.status(404).json({ message: "Visa record not found for the given employee ID" });
    }
    res.status(200).json({ visa });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateVisa = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedVisa = await VisaManagement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedVisa) {
      return res.status(404).json({ message: "Visa record not found" });
    }
    res.status(200).json({ message: "Visa record updated successfully", visa: updatedVisa });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllVisas = async (req, res) => {
  try {
    const visas = await VisaManagement.find().populate("employeeId");
    if (visas.length === 0) {
      return res.status(404).json({ message: "No visa records found" });
    }
    res.status(200).json({ visas });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createVisa, getVisaByEmployeeId, updateVisa, getAllVisas };
