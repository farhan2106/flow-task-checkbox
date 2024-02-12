import { useState, useEffect } from 'react';
import { TaskForm, TaskList } from "./interfaces";

export function App() {
  const [isSearching, setIsSearching] = useState(false);

  // === Side Effects

  // === Event Handlers
  const handleTaskSubmit = (taskData) => {
    // Send taskData to the backend API for processing
    console.log('Task created:', taskData);
  };

  const onSearch = (searchText) => {
    console.log('Search text:', searchText);
  }

  // === Static Vars
  const tasks = [
    { id: 1, name: 'Task 1', description: 'Description 1', dueDate: '2024-02-15', createDate: '2024-02-10', status: 'Not urgent' },
    { id: 2, name: 'Task 2', description: 'Description 2', dueDate: '2024-02-20', createDate: '2024-02-11', status: 'Due soon' },
    // Add more tasks as needed
  ];  

  return (
    <>
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark mb-3">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Task Manager</span>
        </div>
      </nav>

      {/* Main content */}
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <p className="fs-4">Task List</p>
                <TaskList isSearching={isSearching} tasks={tasks} onSearch={onSearch} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <p className="fs-4">Task Form</p>
            <TaskForm onCreateTask={handleTaskSubmit} />
          </div>
        </div>
      </div>
    </>
  );
}
