import React, {createContext, useContext, useEffect, useState, ReactNode} from "react";
  import { getLoggedIn } from "../services/UserService"; 
  import { User } from "../redux/User"; 
  
  // Tip za context
  interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    setAuthenticated: (auth: boolean) => void;
    loading: boolean;
  }
  
  // Provider props
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  // Kreiramo context
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  // Ovo će omogućiti da spolja pozoveš setAuthenticated
  let _setAuthenticated: ((val: boolean) => void) | null = null;
  
  // Provider komponenta
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUserData = async () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            const userData = await getLoggedIn();
            setUser(userData);
            setAuthenticated(true);
          } catch (error) {
            console.error("Greška pri dohvatanju korisnika:", error);
            setAuthenticated(false);
          }
        } else {
          setAuthenticated(false);
        }
        setLoading(false);
      };
  
      fetchUserData();
    }, []);
  
    _setAuthenticated = setAuthenticated; 
  
    return (
      <AuthContext.Provider
        value={{ user, setUser, isAuthenticated, setAuthenticated, loading }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  
  