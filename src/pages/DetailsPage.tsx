import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const DetailsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    place: '',
    bloodGroup: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(formData));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Tell Us About Yourself
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg">
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
          
          <Button type="submit" fullWidth>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DetailsPage;