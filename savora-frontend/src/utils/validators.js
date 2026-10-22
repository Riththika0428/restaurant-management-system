const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s-]{7,15}$/;

export function validateCheckout(values) {
  const errors = {};
  const name = values.fullName.trim();

  if (!name) errors.fullName = 'Please enter your full name.';
  else if (name.length < 2) errors.fullName = 'Name must be at least 2 characters.';

  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.';

  if (!PHONE_PATTERN.test(values.phone.trim())) errors.phone = 'Enter a valid phone number (7 to 15 digits).';

  if (values.deliveryAddress.trim().length < 8) errors.deliveryAddress = 'Please enter a complete delivery address.';

  if (values.deliveryInstructions.length > 200) errors.deliveryInstructions = 'Keep instructions under 200 characters.';

  return errors;
}