import { useState } from 'react';

export const TaskForm = ({ isSaving, onCreateTask }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateTask({ name, description, dueDate });
    // Reset form fields after submitting
    setName('');
    setDescription('');
    setDueDate('');
  };

  if (isSaving) {
    return 'Saving...'
  }

  return (
    <form onSubmit={handleSubmit} autoComplete='off'>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input 
          type="text" 
          className="form-control" 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea 
          className="form-control" 
          id="description" 
          rows={3}
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="dueDate" className="form-label">Due Date</label>
        <input 
          type="date" 
          className="form-control" 
          id="dueDate" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className="btn btn-primary">Create Task</button>
    </form>
  );
};

