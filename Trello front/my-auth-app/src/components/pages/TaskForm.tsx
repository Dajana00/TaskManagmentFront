import React, { useState } from "react";
import { Status } from "../../types/Card";
import { createCard } from "../../services/CardService";
import './TaskForm.css'

interface TaskFormProps {
  userStoryId: number;
}

const TaskForm: React.FC<TaskFormProps> = ({ userStoryId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCard({
      title,
      description,
      dueDate: new Date(dueDate),
      status: Status.Backlog,
      userStoryId
    });
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit}  className="task-form">
      <input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
