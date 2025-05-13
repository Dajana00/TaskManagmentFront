import React, { useState } from "react";
import { Status } from "../../types/Card";
import { createCard } from "../../services/CardService";
import './TaskForm.css';
import InputField from "../common/InputField";
import { useForm } from "../../hooks/useForm";
import { validateTask } from "../../utils/validation";

interface TaskFormProps {
  userStoryId: number;
    onClose: () => void; 

}

const TaskForm: React.FC<TaskFormProps> = ({ userStoryId, onClose }) => {
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
  <div className="wrapper-add-userStory">
      <button className="close-modal-inside" onClick={onClose}>×</button>   

    <h2>Add Task</h2>
    <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="form-backlog">
      
      <div className="input-box">
        <InputField
          label=""
          type="text"
          name="title"
          value={values.title}
          placeholder="Enter task title"
          onChange={handleChange}
          error={touchedFields.title && errors.title ? errors.title : undefined}
        />
      </div>

      <div className="input-box">
        <textarea
          name="description"
          placeholder="Description"
          value={values.description}
          onChange={handleChange}
          className="textarea-field"
        />
        {touchedFields.description && errors.description && (
          <div className="error-message">{errors.description}</div>
        )}
      </div>

      <div className="input-box">
        <InputField
          label=""
          type="date"
          name="dueDate"
          value={values.dueDate}
          placeholder="Enter due date"
          onChange={handleChange}
          error={touchedFields.dueDate && errors.dueDate ? errors.dueDate : undefined}
        />
      </div>

      <button
        type="submit"
        disabled={
          !values.title.trim() ||
          !values.description.trim() ||
          !values.dueDate ||
          Object.keys(errors).length > 0
        }
        className="wrapper-add-userStory-button"
      >
        {  "Add Task"}
      </button>
    </form>
  </div>
);

};


export default TaskForm;
