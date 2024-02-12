import { TaskForm } from "./interfaces";

export function App() {
  const handleTaskSubmit = (taskData) => {
    // Send taskData to the backend API for processing
    console.log('Task created:', taskData);
  };

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
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Left Column</h5>
                <p className="card-text">This is the content for the left column.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <p className="fs-4">Task Form</p>
            <TaskForm onCreateTask={handleTaskSubmit} />
          </div>
        </div>
      </div>
    </>
  );
}
