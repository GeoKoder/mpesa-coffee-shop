export const validatePhoneNumber = (phone: string): boolean => {
  // Accept formats: 07XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX
  const kenyanPhoneRegex = /^(?:(?:\+|)254|0)7[0-9]{8}$/;
  return kenyanPhoneRegex.test(phone);
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  let digits = phone.replace(/\D/g, "");
  
  // Handle the case where number starts with 0
  if (digits.startsWith("0")) {
    digits = "254" + digits.substring(1);
  }
  
  // Handle the case where number doesn't have country code
  if (digits.length === 9 && digits.startsWith("7")) {
    digits = "254" + digits;
  }
  
  return digits;
}; 