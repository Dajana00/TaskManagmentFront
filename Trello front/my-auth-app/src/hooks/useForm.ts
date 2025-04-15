import { useState } from "react";

export const useForm = <T extends Record<string, any>>(
  initialState: T,
  validate?: (values: T) => Partial<T>
) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setValues({ ...values, [name]: value });

    // Set touched field to true when user starts typing
    setTouchedFields({ ...touchedFields, [name]: true });

    if (validate) {
      setErrors(validate({ ...values, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent, onSubmit: () => void) => {
    e.preventDefault();

    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        onSubmit();
      }
    } else {
      onSubmit();
    }
  };

  return { values, handleChange, handleSubmit, errors, touchedFields };
};
