export const validateLogin = (values: { username: string; password: string }) => {
  const errors: Partial<typeof values> = {};
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!values.username.trim()) errors.username = "Username is required";
  if (!values.password) errors.password = "Password is required";
  else if (!passwordRegex.test(values.password)) 
      errors.password = "Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character";
  return errors;
};
  
  export const validateRegister = (values: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    phoneNumber: string;
  }) => {
    const errors: Partial<typeof values> = {};
  
    if (!values.firstName.trim()) errors.firstName = "First name is required";
    if (!values.lastName.trim()) errors.lastName = "Last name is required";
    if (!values.email.includes("@")) errors.email = "Invalid email";
    if (!values.username.trim()) errors.username = "Username is required";
    if (!values.password) errors.password = "Password is required";
    else if (values.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!values.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
  
    return errors;
  };
  

export const validateUserStory = (values: { title: string; description: string }) => {
  const errors: Partial<typeof values> = {};

  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.description.trim()) errors.description = "Description is required";

  return errors;
};

export const validateTask = (values: { title: string; description: string; dueDate: string }) => {
  const errors: Partial<{ title: string; description: string; dueDate: string }> = {};
  
  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.description.trim()) errors.description = "Description is required";
  if (!values.dueDate) errors.dueDate = "Due date is required";

  return errors;
};
