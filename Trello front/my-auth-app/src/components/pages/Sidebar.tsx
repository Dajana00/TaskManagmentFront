import React, { useState } from "react";
import { Project } from "../../types/Project";
import "./Sidebar.css"; 

interface SidebarProps {
    projects: Project[];
    creatingProject: boolean;
    newProjectName: string;
    setNewProjectName: (name: string) => void;
    setCreatingProject: (creating: boolean) => void;
    handleCreateProject: () => void;
    openBoard: (projectId: number) => void;
    openBacklog: (projectId: number) => void;

}

const Sidebar: React.FC<SidebarProps> = ({
    projects,
    creatingProject,
    newProjectName,
    setNewProjectName,
    setCreatingProject,
    handleCreateProject,
    openBoard,
    openBacklog
}) => {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const toggleDropdown = (projectId: number) => {
        setOpenDropdown(openDropdown === projectId ? null : projectId);
    };

    return (
        <div className="sidebar">
            <h3>Your Projects</h3>
            {/* Create Project Button */}
            {!creatingProject ? (
                <button onClick={() => setCreatingProject(true)} className="create-project-btn">
                    + Create New Project
                </button>
            ) : (
                <div className="create-project-container">
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Enter project name"
                        className="create-project-input"
                    />
                    <div className="button-group">
                        <button onClick={handleCreateProject} className="confirm-btn">Create</button>
                        <button onClick={() => setCreatingProject(false)} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            )}

            {/* Projects List */}
            <ul>
                {projects.map((project) => (
                    <li key={project.id} className="project-item">
                        <div className="project-header">
                            {project.name}
                            <button onClick={() => toggleDropdown(project.id)} className="dropdown-btn">
                                ▼
                            </button>
                        </div>

                        {openDropdown === project.id && (
                            <><div className="dropdown-menu">
                                <button onClick={() => openBoard(project.boardId)}>Board</button>
                            </div><div className="dropdown-menu">
                            
                                    <button onClick={() => openBacklog(project.backlogId)}>Backlog</button>
                                </div></>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
