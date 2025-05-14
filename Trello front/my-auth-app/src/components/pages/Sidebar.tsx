import React, { useState } from "react";
import { Project } from "../../types/Project";
import "./Sidebar.css"; 
import { FaUserCircle } from "react-icons/fa";

interface SidebarProps {
    projects: Project[];
    creatingProject: boolean;
    newProjectName: string;
    setNewProjectName: (name: string) => void;
    setCreatingProject: (creating: boolean) => void;
    handleCreateProject: () => void;
    openBoard: (project: Project) => void;
    openBacklog: (project: Project) => void;
    openSprints: (project: Project) => void;
    openMembers: (project: Project) => void;
    openProfile: () => void;

}

const Sidebar: React.FC<SidebarProps> = ({
    projects,
    creatingProject,
    newProjectName,
    setNewProjectName,
    setCreatingProject,
    handleCreateProject,
    openBoard,
    openBacklog,
    openSprints,
    openMembers,
    openProfile
}) => {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const toggleDropdown = (projectId: number) => {
        setOpenDropdown(openDropdown === projectId ? null : projectId);
    };

    return (
        <div className="sidebar">

            <div className="sidebar-profile" onClick={openProfile}>
            <FaUserCircle className="profile-icon" />
            <span >Profile</span>
            </div>

            <h3>Workspace</h3>
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
                                <button onClick={() => openBoard(project)}>Board</button>
                            </div>
                            <div className="dropdown-menu">
                             <button onClick={() => openBacklog(project)}>Backlog</button>
                            </div>
                            <div className="dropdown-menu">
                             <button onClick={() => openSprints(project)}>Sprints</button>
                            </div>
                            <div className="dropdown-menu">
                             <button onClick={() => openMembers(project)}>Members</button>
                            </div></>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
