import { FiUser } from "react-icons/fi";

interface GenderCheckboxProps {
  onCheckboxChange: (gender: string) => void;
  selectedGender: string;
}

const GenderCheckbox = ({ onCheckboxChange, selectedGender }: GenderCheckboxProps) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Gender <span className="text-base-content/50 font-normal">(optional)</span></span>
      </label>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onCheckboxChange("male")}
          className={`flex-1 btn btn-outline h-12 gap-2 ${
            selectedGender === "male"
              ? "btn-primary bg-primary/10"
              : "btn-ghost border-base-content/20"
          }`}
        >
          <FiUser className="w-4 h-4" />
          Male
        </button>
        <button
          type="button"
          onClick={() => onCheckboxChange("female")}
          className={`flex-1 btn btn-outline h-12 gap-2 ${
            selectedGender === "female"
              ? "btn-secondary bg-secondary/10"
              : "btn-ghost border-base-content/20"
          }`}
        >
          <FiUser className="w-4 h-4" />
          Female
        </button>
      </div>
    </div>
  );
};

export default GenderCheckbox;
