
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface CategoryCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
}

const CategoryCheckbox = ({ id, label, checked, onChange }: CategoryCheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(id, newValue);
  };

  return (
    <label className="checkbox-container" onClick={handleToggle}>
      <div className={`checkbox-custom ${isChecked ? 'checked' : ''}`}>
        {isChecked && <Check size={16} className="text-white" />}
      </div>
      <span>{label}</span>
    </label>
  );
};

export default CategoryCheckbox;
