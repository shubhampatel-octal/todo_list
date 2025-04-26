import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { IBusiness } from './type';

interface User {
  email: string;
  username?: string;
  _id?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  businessData: IBusiness[] | null;
  setBusinessData: React.Dispatch<React.SetStateAction<IBusiness[] | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState<IBusiness[] | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const responce = await fetch('http://localhost:3000/getuser', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'get',
      });

      if (responce.status !== 200) {
        setUser(null);
        return;
      }

      const result = await responce.json();
      setUser(result.user);
    };
    getUser().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const responce = await fetch('http://localhost:3000/business', {
          credentials: 'include',
          method: 'GET',
        });
        const data = await responce.json();

        if (responce.status !== 200) {
          setBusinessData(null);
          return;
        }

        if (!data.length) {
          setBusinessData(null);
        }

        setBusinessData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const value: AuthContextType = {
    user,
    setUser,
    isAuthenticated: !!user,
    businessData,
    setBusinessData,
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center text-2xl text-white">
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
