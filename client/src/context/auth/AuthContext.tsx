
import { User } from "../../types/api";
import { createContext } from "react";


interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

