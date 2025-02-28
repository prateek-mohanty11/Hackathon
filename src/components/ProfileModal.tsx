import React, { useState } from 'react';
import FormInput from './FormInput';
import Button from './Button';

interface ProfileModalProps {
  profile: {
    name: string;
    age: string;
    gender: string;
    place: string;
    bloodGroup: string;
  };
  onClose: () => void;
  onSave: (profile: any) => void;
}

const ProfileModal = ({ profile, onClose, onSave }: ProfileModalProps) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Gender"
            type="select"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={['Male', 'Female', 'Other']}
            required
          />
          <FormInput
            label="Place"
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Blood Group"
            type="select"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
            required
          />
          <div className="flex gap-4 mt-6">
            <Button type="submit" fullWidth>Save Changes</Button>
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;