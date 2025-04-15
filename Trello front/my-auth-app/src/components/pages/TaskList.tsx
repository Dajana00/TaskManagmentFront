import React, { useEffect, useState } from "react";
import { Card } from "../../types/Card";
import { getByUserStoryId } from "../../services/CardService";
import "./TaskList.css"; // 👈 dodaj ovaj import

interface TaskListProps {
  userStoryId: number;
}

const TaskList: React.FC<TaskListProps> = ({ userStoryId }) => {
  const [tasks, setTasks] = useState<Card[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getByUserStoryId(userStoryId);
      setTasks(data);
    };
    fetchTasks();
  }, [userStoryId]);

  return (
    <div className="task-list-container">
      {Array.isArray(tasks) && tasks.length > 0 ? (
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3 className="task-title">{task.title}</h3>
              <p className="task-desc">{task.description}</p>
              <p className="task-status">{task.status}</p>
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
