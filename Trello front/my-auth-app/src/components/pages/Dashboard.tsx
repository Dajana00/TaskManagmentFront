import React, { useEffect, useState } from "react";
import { getLoggedIn, getUserProjects, createProject } from "../../services/UserService";
import { Project } from "../../types/Project";
import "./Dashboard.css";
import { useAuth } from "../../utils/AuthContext";
import Board from "./Board";
import Sidebar from "./Sidebar"; // Import Sidebar component
import Backlog from "./Backlog";
import SprintsPage from "./Sprints";

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectName, setNewProjectName] = useState("");
    const [creatingProject, setCreatingProject] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [viewMode, setViewMode] = useState<"board" | "backlog" | "sprints">("board"); // Dodajemo stanje za switch


    useEffect(() => {
        const fetchUserDataAndProjects = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const userData = await getLoggedIn();
                    setUser(userData);
                    
                    if (userData.id) {
                        const userProjects = await getUserProjects(userData.id);
                        setProjects(userProjects);
                    }
                    
                    const savedProject = localStorage.getItem("selectedProject");
                    if (savedProject) {
                        try {
                            const parsedProject = JSON.parse(savedProject);
                            setSelectedProject(parsedProject);
                        } catch (e) {
                            console.error("Invalid project in localStorage", e);
                        }
                    }
                    
                } catch (error) {
                    console.error("Error fetching user or projects:", error);
                }
            }
        };

        fetchUserDataAndProjects();
    }, [setUser]);

    const handleCreateProject = async () => {
        if (!user?.id || !newProjectName.trim()) return;

        try {
            const newProject = await createProject({ id: 0, name: newProjectName, ownerId: user.id });
            setProjects((prevProjects) => [...prevProjects, newProject]);
            setNewProjectName("");
            setCreatingProject(false);
            //openBoard(newProject.id); 
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };
const openBoard = (project: Project) => {
    setSelectedProject(project);
    localStorage.setItem("selectedProject", JSON.stringify(project));
    setViewMode("board");
};

const openBacklog = (project: Project) => {
    setSelectedProject(project);
    localStorage.setItem("selectedProject", JSON.stringify(project));
    setViewMode("backlog");
};
const openSprints = (project: Project) => {
    setSelectedProject(project);
    localStorage.setItem("selectedProject", JSON.stringify(project));
    setViewMode("sprints");
};
    return (
        <div className="dashboard-container">
            <Sidebar
                projects={projects}
                creatingProject={creatingProject}
                newProjectName={newProjectName}
                setNewProjectName={setNewProjectName}
                setCreatingProject={setCreatingProject}
                handleCreateProject={handleCreateProject}
                openBoard={openBoard}
                openBacklog={openBacklog}
                openSprints={openSprints}
            />

    <div className="main-content">
        {selectedProject ? (
            viewMode === "board" ? (
                <Board boardId={selectedProject.boardId} />
            ) : viewMode === "backlog" ? (
                <Backlog backlogId={selectedProject.backlogId} />
            ) : viewMode === "sprints" ? (
                <SprintsPage key={selectedProject.id} projectId={selectedProject.id} />
            ) : null
        ) : (
            <h2>Welcome to Dashboard</h2>
        )}
    </div>

        </div>
    );
};

export default Dashboard;
