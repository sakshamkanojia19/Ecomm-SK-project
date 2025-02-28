
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
   
    if (isAuthenticated) {
      navigate("/interests");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to ECOMM-SK</h1>
          <p className="text-xl text-gray-600 mb-8">Redirecting you to the right place...</p>
          <div className="animate-pulse">Loading...</div>
        </div>
      </main>
    </div>
  );
};

export default Index;
