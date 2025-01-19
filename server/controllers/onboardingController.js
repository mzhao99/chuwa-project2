const Onboarding = require('../models/OnboardingModel'); 

const createOnboarding = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const newOnboarding = new Onboarding({
      employeeId,
      status: 'started', 
      submissionDate: null,
      reviewDate: null,
      feedback: '',
      applicationData: {
        personalInfo: {
          firstName: '',
          lastName: '',
          middleName: '',
          preferredName: '',
          profilePicture: '',
          cellPhone: '',
          workPhone: '',
          ssn: '',
          dob: null,
          gender: '',
        },
        address: {
          building: '',
          street: '',
          city: '',
          state: '',
          zip: '',
        },
        workAuthorization: {
          workAuthorization: {
            citizenshipStatus: '',
            visaTitle: '',
            startDate: null,
            endDate: null,
          },
        },
        reference: {
          firstName: '',
          lastName: '',
          middleName: '',
          phone: '',
          email: '',
          relationship: '',
        },
        emergencyContacts: [],
        uploadedFiles: [],
      },
    });
    const savedOnboarding = await newOnboarding.save();
    return res.status(201).json(savedOnboarding);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getOnboardingByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const onboarding = await Onboarding.findOne({ employeeId });
    
    if (!onboarding) {
      return res.status(404).json({ message: 'Onboarding form not found for this employee' });
    }
    return res.status(200).json(onboarding);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateOnboardingById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedOnboarding = await Onboarding.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedOnboarding) {
      return res.status(404).json({ message: 'Onboarding form not found' });
    }
    return res.status(200).json(updatedOnboarding);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createOnboarding, getOnboardingByEmployeeId, updateOnboardingById };
