import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchCardsByUserStoryId, addToBoard, deleteCard } from "../../redux/CardSlice";
import { Card } from "../../types/Card";
import "./TaskList.css";
import { Pencil, Trash2 } from "lucide-react";
import TaskForm from "./TaskForm";
import CardDetails from "./CardDetails";

interface TaskListProps {
  userStoryId: number;
  projectId: number;
}

const statusPriority: Record<string, number> = {
  Backlog: 0,
  ToDo: 1,
  InProgress: 2,
  QA: 3,
  Done: 4,
};

const TaskList: React.FC<TaskListProps> = ({ userStoryId, projectId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Card | null>(null);
  const [selectedTask, setSelectedTask] = useState<Card | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { cards, status, error } = useSelector((state: RootState) => state.card);

  useEffect(() => {
    dispatch(fetchCardsByUserStoryId(userStoryId));
  }, [dispatch, userStoryId]);

  const sortedTasks = [...cards].sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status]
  );

  const handleDelete = async (cardId: number) => {
    try {
      await dispatch(deleteCard(cardId)).unwrap();
    } catch (err) {
      console.error("Error deleting card:", err);
    }
  };

  const handleAddToSprint = async (cardId: number) => {
    try {
      await dispatch(addToBoard(cardId)).unwrap();
      await dispatch(fetchCardsByUserStoryId(userStoryId));
    } catch (error) {
      console.error("Error adding task to sprint", error);
    }
  };

  const handleEdit = (card: Card) => {
    setEditTask(card);
    setShowModal(true);
  };

  const handleOpenDetails = (card: Card) => {
    setSelectedTask(card);
    setShowDetailsModal(true);
  };

  return (
    <div className="task-list-container">
      {status === "loading" && <p>Loading tasks...</p>}
      {status === "failed" && <p>Error: {error}</p>}

      <div className="task-grid">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className="task-card"
            onClick={() => handleOpenDetails(task)}
            style={{ cursor: "pointer" }}
          >
            <h3 className="task-title">{task.title}</h3>
            <p className="task-desc">{task.description}</p>
            <p className="task-status">{task.status}</p>

            <div className="task-actions" onClick={(e) => e.stopPropagation()}>
              {task.status === "Backlog" && (
                <button
                  className="add-to-sprint-button"
                  onClick={() => handleAddToSprint(task.id)}
                >
                  Add to Active Sprint
                </button>
              )}

              <div className="icon-buttons">
                <button className="icon-button" onClick={() => handleEdit(task)}>
                  <Pencil size={16} />
                </button>
                <button className="icon-button" onClick={() => handleDelete(task.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <TaskForm
            userStoryId={userStoryId}
            onClose={() => {
              setShowModal(false);
              setEditTask(null);
            }}
            isEditMode={!!editTask}
            initialValues={
              editTask
                ? {
                    id: editTask.id,
                    title: editTask.title,
                    description: editTask.description,
                    dueDate: editTask.dueDate.toString().split("T")[0],
                    status: editTask.status,
                  }
                : undefined
            }
          />
        </div>
      )}

      {showDetailsModal && selectedTask && (
        <CardDetails
          card={selectedTask}
          onClose={() => {
            setSelectedTask(null);
            setShowDetailsModal(false);
          }}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default TaskList;
