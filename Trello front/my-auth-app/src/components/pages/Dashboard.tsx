import { useEffect, useState } from "react";
import { getLoggedIn } from "../../services/UserService";
import { Project } from "../../types/Project";
import "./Dashboard.css";
import { useAuth } from "../../utils/AuthContext";
import Board from "./Board";
import Sidebar from "./Sidebar"; 
import Backlog from "./Backlog";
import SprintsPage from "./Sprints";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchUserProjects, createNewProject } from "../../redux/ProjectSlice";
import { CardModalProvider } from "../../hooks/CardModalContext";
import ProjectMembers from "./ProjectMembers";


const Dashboard = () => {
    const { user, setUser } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const { projects } = useSelector((state: RootState) => state.project);
    const [newProjectName, setNewProjectName] = useState("");
    const [creatingProject, setCreatingProject] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [viewMode, setViewMode] = useState<"board" | "backlog" | "sprints" | "members">("board"); 

    useEffect(() => {
        const fetchUserDataAndProjects = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const userData = await getLoggedIn();
                    setUser(userData);
    
                    if (userData.id) {
                        // Učitavanje projekata samo ako nisu već učitani
                        await dispatch(fetchUserProjects(userData.id));
    
                        const savedProject = localStorage.getItem("selectedProject");
    
                        if (savedProject) {
                            try {
                                const parsedProject = JSON.parse(savedProject);
    
                                const currentUserProjects = projects;
                                const validProject = currentUserProjects.find(p => p.id === parsedProject.id);
    
                                if (validProject) {
                                    setSelectedProject(validProject);
                                } else {
                                    // Ako projekat nije validan, obriši ga iz localStorage
                                    localStorage.removeItem("selectedProject");
                                    setSelectedProject(null);
                                }
                            } catch (e) {
                                console.error("Invalid project in localStorage", e);
                                localStorage.removeItem("selectedProject");
                                setSelectedProject(null);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user or projects:", error);
                }
            }
        };
    
        fetchUserDataAndProjects();
    }, [dispatch, setUser, projects.length]); 
    
    const handleCreateProject = async () => {
        if (!user?.id || !newProjectName.trim()) return;
    
        try {
            await dispatch(
                createNewProject({ id: 0, name: newProjectName, ownerId: user.id })
            ).unwrap();
            await dispatch(fetchUserProjects(user.id));
            setNewProjectName("");
            setCreatingProject(false);
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
const openMembers = (project: Project) => {
    setSelectedProject(project);
    localStorage.setItem("selectedProject", JSON.stringify(project));
    setViewMode("members");
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
                openMembers={openMembers}
            />

    <div className="main-content">
        {selectedProject ? (
            viewMode === "board" ? (
                <CardModalProvider>
                <Board boardId={selectedProject.boardId} />
                </CardModalProvider>
            ) : viewMode === "backlog" ? (
                <Backlog backlogId={selectedProject.backlogId} />
            ) : viewMode === "sprints" ? (
                <SprintsPage key={selectedProject.id} projectId={selectedProject.id} />
            ) :  viewMode === "members" ? (
                <ProjectMembers key={selectedProject.id} projectId={selectedProject.id} />
            ) : null
        ) : (
            <h2>Welcome to Dashboard</h2>
        )}
    </div>

        </div>
    );
};

export default Dashboard;
