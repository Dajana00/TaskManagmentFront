import React, { useEffect, useState } from "react";
import { getLoggedIn, getUserProjects, createProject } from "../../services/UserService";
import { Project } from "../../types/Project";
import "./Dashboard.css";
import { useAuth } from "../../utils/AuthContext";
import Board from "./Board";
import Sidebar from "./Sidebar"; // Import Sidebar component
import Backlog from "./Backlog";

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectName, setNewProjectName] = useState("");
    const [creatingProject, setCreatingProject] = useState(false);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<"board" | "backlog">("board"); // Dodajemo stanje za switch


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
                        setSelectedProject(Number(savedProject));
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
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    const openBoard = (projectId: number) => {
        setSelectedProject(projectId);
        localStorage.setItem("selectedProject", projectId.toString());
        setViewMode("board"); // Postavi da prikazuje Backlog

    };
    const openBacklog = (projectId: number) => {
        setSelectedProject(projectId);
        localStorage.setItem("selectedProject", projectId.toString());
        setViewMode("backlog"); // Postavi da prikazuje Backlog

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
            />

                <div className="main-content">
                {selectedProject ? (
                    viewMode === "board" ? (
                        <Board boardId={selectedProject} />
                    ) : (
                        <Backlog backlogId={selectedProject} /> // Prikazivanje Backlog-a
                    )
                ) : (
                    <h2>Welcome to Dashboard</h2>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
