import { ReactNode, useEffect, useState } from "react";
import { AuthService } from "../../services/auth-service";
import { User } from "../../types/api";
import { AuthContext } from "./AuthContext";

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | undefined>(undefined);
  
    useEffect(() => {
      const getMe = async() => {
        try {
  
          const data = await AuthService.getCurrentUser()
          if (data.status === true) {
            setUser(data.user);
          } 
        } catch (e) {
          console.log("not logged in :", e)
        }
      }
      getMe()
    }, []);
  
    const login = (userData: User) => {
      setUser(userData);
    };
  
    const logout = () => {
      setUser(undefined);
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  