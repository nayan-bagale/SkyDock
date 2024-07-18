interface ValidationResult {
  valid: boolean;
  message: string;
}

export function emailValidation(email: string): ValidationResult {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (emailRegex.test(email)) {
    return {
      valid: true,
      message: "Email is valid",
    };
  }
  return {
    valid: false,
    message: "Email is invalid",
  };
}

export function passwordValidation(password: string): ValidationResult {
  //   const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  const passwordRegex = /^(?=.*[a-z]).{6,20}$/;
  if (passwordRegex.test(password)) {
    return {
      valid: true,
      message: "Password is valid",
    };
  }
  return {
    valid: false,
    message: "At least 6 characters",
  };
}
