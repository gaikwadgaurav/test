export const ValidationHandler = (event, state) => {
  const name = event.target.id;
  let value = event.target.value;
  let fieldValidationErrors = { email: "", password: "" };
  let emailValid = true;
  let passwordValid = true;
  let confirmPasswordValid = false;
  console.log('name', name)
  console.log('value', value)
  switch (name) {
    case "loginValue":
      emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      fieldValidationErrors.email = value
        ? emailValid
          ? ""
          : "Invalid E-mail"
        : "";
      break;
    case "email":
      emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      fieldValidationErrors.email = value
        ? emailValid
          ? ""
          : "Invalid E-mail"
        : "";
      break;
    case "password":
      console.log('value.length', value.length)
      passwordValid = (value.length >= 6);
      console.log('value.passwordValid', passwordValid)
      fieldValidationErrors.password = passwordValid ? "" : " is too short";
      break;
    case "confirmPassword":
      if (confirmPasswordValid !== passwordValid) {
        fieldValidationErrors.confirmPassword = 'password does not match';
      } else {
        fieldValidationErrors.confirmPassword = confirmPasswordValid;
        
      }
      break;
    default:
      break;
  }
  return {
    formErrors: fieldValidationErrors,
    emailValid: emailValid,
    passwordValid: passwordValid,
    confirmPasswordValid: confirmPasswordValid,
    name: value
  };
};
