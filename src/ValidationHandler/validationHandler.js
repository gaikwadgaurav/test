export const ValidationHandler = (event, state) => {
  const name = event.target.id;
  let value = event.target.value;
  let fieldValidationErrors = { email: "", password: "" };
  let emailValid = true;
  let passwordValid = true;
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
      passwordValid = value.length >= 6;
      fieldValidationErrors.password = passwordValid ? "" : " is too short";
      break;
    default:
      break;
  }
  return {
    formErrors: fieldValidationErrors,
    emailValid: emailValid,
    passwordValid: passwordValid,
    name: value
  };
};
