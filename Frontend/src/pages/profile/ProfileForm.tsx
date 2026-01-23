import { useState, FormEvent } from "react";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import type { User, UpdateProfileInputs } from "../../types";

interface ProfileFormProps {
  profile: User;
  onUpdate: (user: User) => void;
  onCancel: () => void;
}

const ProfileForm = ({ profile, onUpdate, onCancel }: ProfileFormProps) => {
  const { loading, updateProfile } = useUpdateProfile();
  const [formData, setFormData] = useState<UpdateProfileInputs>({
    fullName: profile.fullName,
    email: profile.email || "",
    bio: profile.bio || "",
    gender: profile.gender,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updated = await updateProfile(formData);
    if (updated) {
      onUpdate(updated);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Email (optional)</span>
        </label>
        <input
          type="email"
          className="input input-bordered w-full"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Bio</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself..."
          maxLength={150}
          rows={3}
        />
        <label className="label">
          <span className="label-text-alt">{formData.bio?.length || 0}/150</span>
        </label>
      </div>

      <div>
        <label className="label">
          <span className="label-text">Gender</span>
        </label>
        <div className="flex gap-4">
          <label className="label cursor-pointer gap-2">
            <input
              type="radio"
              name="gender"
              className="radio radio-primary"
              checked={formData.gender === "male"}
              onChange={() => setFormData({ ...formData, gender: "male" })}
            />
            <span className="label-text">Male</span>
          </label>
          <label className="label cursor-pointer gap-2">
            <input
              type="radio"
              name="gender"
              className="radio radio-primary"
              checked={formData.gender === "female"}
              onChange={() => setFormData({ ...formData, gender: "female" })}
            />
            <span className="label-text">Female</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Save Changes"
          )}
        </button>
        <button
          type="button"
          className="btn btn-ghost flex-1"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
