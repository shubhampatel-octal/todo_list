import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  email: string;
  username?: string;
  _id?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const responce = await fetch("http://localhost:3000/getuser", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "get",
      });

      if (responce.status !== 200) {
        setUser(null);
        return;
      }

      const result = await responce.json();
      setUser(result.user);
      console.log(responce);
      console.log(result);
    };
    getUser().finally(() => setLoading(false));
  }, []);

  const value: AuthContextType = {
    user,
    setUser,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-2xl text-white">
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
