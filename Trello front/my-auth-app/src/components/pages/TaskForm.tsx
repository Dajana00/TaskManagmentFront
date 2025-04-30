import React, { useState } from "react";
import { Status } from "../../types/Card";
import { createCard } from "../../services/CardService";
import './TaskForm.css';
import InputField from "../common/InputField";
import { useForm } from "../../hooks/useForm";
import { validateTask } from "../../utils/validation";

interface TaskFormProps {
  userStoryId: number;
}

const TaskForm: React.FC<TaskFormProps> = ({ userStoryId }) => {
  const { values, handleChange, handleSubmit, errors, touchedFields } = useForm(
    {
      title: "",
      description: "",
      dueDate: "",
    },
    validateTask
  );

  const onSubmit = async () => {
    await createCard({
      title: values.title,
      description: values.description,
      dueDate: new Date(values.dueDate),
      status: Status.Backlog,
      userStoryId,
    });

    values.title = "";
    values.description = "";
    values.dueDate = "";
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="task-form">
      <InputField
        label=""
        type="text"
        name="title"
        value={values.title}
        placeholder="Enter task title"
        onChange={handleChange}
        error={touchedFields.title && errors.title ? errors.title : undefined}
      />
      
      <div className="input-box">
        <textarea
          name="description"
          placeholder="Description"
          value={values.description}
          onChange={handleChange}
          className="textarea-field"
        />
        {touchedFields.description && errors.description && (
          <div className="error-text">{errors.description}</div>
        )}
      </div>

      <InputField
        label="Due Date"
        type="date"
        name="dueDate"
        value={values.dueDate}
        placeholder="Enter due date"
        onChange={handleChange}
        error={touchedFields.dueDate && errors.dueDate ? errors.dueDate : undefined}
      />

      <button type="submit">Add Task</button>
    </form>
  );
};


export default TaskForm;
