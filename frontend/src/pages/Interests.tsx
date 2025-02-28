
import { useState, useEffect } from "react";
import { CategoryService } from "@/services/api";
import { Category } from "@/types";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import CategoryCheckbox from "@/components/CategoryCheckbox";
import Pagination from "@/components/Pagination";

const Interests = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const itemsPerPage = 6;
  
  useEffect(() => {
    fetchCategories();
    fetchUserPreferences();
  }, [currentPage]);
  
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching categories for page ${currentPage}`);
      const response = await CategoryService.getCategories(currentPage, itemsPerPage);
      console.log("Fetched categories:", response);
      
      if (response.categories && Array.isArray(response.categories)) {
        setCategories(response.categories);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      } else {
        setError("Invalid category data received");
        toast({
          title: "Error",
          description: "Invalid data received from server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserPreferences = async () => {
    try {
      console.log("Fetching user preferences");
      const preferences = await CategoryService.getUserPreferences();
      console.log("User preferences:", preferences);
      if (Array.isArray(preferences)) {
        setSelectedCategories(preferences);
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      toast({
        title: "Note",
        description: "Could not load your saved preferences. You can still select new ones.",
        variant: "default",
      });
    }
  };
  
  const handleCategoryToggle = (id: string, checked: boolean) => {
    setSelectedCategories(prev => {
      if (checked && !prev.includes(id)) {
        return [...prev, id];
      } else if (!checked && prev.includes(id)) {
        return prev.filter(categoryId => categoryId !== id);
      }
      return prev;
    });
  };
  
  const savePreferences = async () => {
    setSaving(true);
    try {
      console.log("Saving preferences:", selectedCategories);
      await CategoryService.updateUserPreferences(selectedCategories);
      toast({
        title: "Success",
        description: "Your preferences have been saved",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex justify-center p-4 animate-fade-in">
        <div className="auth-card max-w-lg">
          <h1 className="text-2xl font-bold text-center mb-2">Please mark your interests!</h1>
          <p className="text-center text-gray-600 mb-8">We will keep you notified.</p>
          
          <h2 className="text-lg font-medium mb-4">My saved interests!</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
              <p>Error: {error}</p>
              <button 
                className="text-red-700 underline mt-1" 
                onClick={fetchCategories}
              >
                Try again
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center p-2">
                  <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1 mb-6">
              {categories.length === 0 && !loading && !error ? (
                <p className="text-gray-500 text-center py-4">
                  No categories available. Please add some categories to the database.
                </p>
              ) : (
                categories.map(category => (
                  <CategoryCheckbox
                    key={category.id}
                    id={category.id}
                    label={category.name}
                    checked={selectedCategories.includes(category.id)}
                    onChange={handleCategoryToggle}
                  />
                ))
              )}
            </div>
          )}
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          
          <div className="mt-6">
            <button
              onClick={savePreferences}
              className="auth-button"
              disabled={saving || loading}
            >
              {saving ? "SAVING..." : "SAVE PREFERENCES"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interests;
