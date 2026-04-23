/**
 * Validates if a value is purely numeric and has exact length
 */
const isValidNumeric = (val, length) => {
  if (!val) return false;
  const str = String(val).replace(/\s/g, ''); // Remove spaces if any
  return /^\d+$/.test(str) && str.length === length;
};

/**
 * Validates if a user's profile is complete based on their HKCA role
 * and whether they are verified by the admin.
 */
export const validateProfileCompletion = (user) => {
  if (!user) return { isComplete: false, isVerified: false, missingFields: ['Login required'] };

  const missingFields = [];
  const role = user.role?.toLowerCase() || 'viewer';

  // 1. Basic Personal Info
  if (role !== 'club') {
    if (!user.personalInfo?.firstName) missingFields.push('First Name');
    if (!user.personalInfo?.lastName) missingFields.push('Last Name');
    if (!user.personalInfo?.gender) missingFields.push('Gender');
    if (!user.personalInfo?.birthDate) missingFields.push('Date of Birth');
    
    // Aadhaar check (Required for athletes/coaches)
    if (['athlete', 'coach'].includes(role)) {
      if (!isValidNumeric(user.personalInfo?.aadhaarNumber, 12)) {
        missingFields.push('Valid 12-digit Aadhaar Number');
      }
    }
  }

  // 2. Role-specific checks
  if (role === 'athlete') {
    if (!user.personalInfo?.bloodGroup) missingFields.push('Blood Group');
    if (!user.guardianInfo?.fatherName && !user.guardianInfo?.guardianName) missingFields.push('Parent/Guardian Name');
    if (!user.documents?.photograph) missingFields.push('Photograph');
    if (!user.documents?.aadhaarFront) missingFields.push('Aadhaar Card (Front)');
    if (!user.documents?.aadhaarBack) missingFields.push('Aadhaar Card (Back)');
    if (!user.documents?.dobProof) missingFields.push('DOB Proof / DMC');
  } else if (role === 'coach') {
    if (!user.documents?.photograph) missingFields.push('Photograph');
    if (!user.documents?.aadhaarFront) missingFields.push('Aadhaar Card (Front)');
    if (!user.documents?.aadhaarBack) missingFields.push('Aadhaar Card (Back)');
  } else if (role === 'club') {
    if (!user.clubInfo?.clubName) missingFields.push('Club Name');
    if (!user.clubInfo?.contactPerson) missingFields.push('Contact Person');
    if (!user.documents?.photograph) missingFields.push('Club Logo/Photo');
  }

  // 3. Contact Info
  const phone = user.contactInfo?.phone || user.personalInfo?.phone;
  if (!isValidNumeric(phone, 10)) {
    missingFields.push('Valid 10-digit Phone Number');
  }

  if (['athlete', 'coach', 'club'].includes(role)) {
    if (!user.contactInfo?.address?.city) missingFields.push('City');
    if (!user.contactInfo?.address?.state) missingFields.push('State');
    if (!isValidNumeric(user.contactInfo?.address?.pinCode, 6)) {
      missingFields.push('Valid 6-digit PIN Code');
    }
  }

  return {
    isComplete: missingFields.length === 0,
    isVerified: user.isVerified || false,
    verificationStatus: user.verificationStatus || 'pending',
    missingFields
  };
};
