import React, { useEffect, useState } from "react";
import { Card } from "../../types/Card";
import { getByUserStoryId } from "../../services/CardService";
import "./TaskList.css"; 
import { addToBoard, fetchAllCards } from "../../redux/CardSlice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";

interface TaskListProps {
  userStoryId: number;
}
const statusPriority: Record<string, number> = {
  Backlog: 0,
  ToDo: 1,
  InProgress: 2,
  QA: 3,
  Done: 4,
};


const TaskList: React.FC<TaskListProps> = ({ userStoryId }) => {
  const [tasks, setTasks] = useState<Card[]>([]);
  const dispatch = useDispatch<AppDispatch>(); 


  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getByUserStoryId(userStoryId);
      const sorted = data.sort(
        (a: Card, b: Card) => statusPriority[a.status] - statusPriority[b.status]
      );
      
      setTasks(sorted);
    };
    fetchTasks();
  }, [userStoryId]);

  const handleAddToSprint = async (cardId: number) => {
    try {
      await dispatch(addToBoard(cardId)).unwrap();
      const updatedTasks = await getByUserStoryId(userStoryId);
      setTasks(updatedTasks); 
      console.log("Adding task to sprint:", cardId);
    } catch (error) {
      console.error("Error adding task to sprint", error);
    }
  };
  
  return (
    <div className="task-list-container">
      {Array.isArray(tasks) && tasks.length > 0 ? (
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3 className="task-title">{task.title}</h3>
              <p className="task-desc">{task.description}</p>
              <p className="task-status">{task.status}</p>

              {task.status === "Backlog" && (
              <button
                className="add-to-sprint-button"
                onClick={() => handleAddToSprint(task.id)}
              >
                Add to Active Sprint
              </button>
            )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-tasks">No tasks yet.</p>
      )}
    </div>
  );
};

export default TaskList;

