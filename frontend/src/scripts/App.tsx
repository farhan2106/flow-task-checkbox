import { useState, useEffect } from 'react';
import useSWR from 'swr'
import { TaskForm, TaskList } from "./interfaces";
import TaskRepository from './domain/repositories/TaskRepo';

const taskRepo = new TaskRepository(`${process.env.FE_API_SERVER}/api/v1`)

export function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: taskListResult,
    error: _,
    isLoading: isSearching,
    mutate: mutateTaskListResult
  } = useSWR([pageNumber, searchString, sortBy], ([pageNumber, searchString, sortBy]) => taskRepo.list(pageNumber, 10, searchString, sortBy))

  // === Side Effects

  // === Event Handlers
  const onCreateTask = (taskData) => {
    setIsSaving(true)
    taskRepo.create(taskData)
      .then(() => {
        mutateTaskListResult({ ...taskListResult })
      })
      .finally(() => setIsSaving(false))
  };

  const onSearch = (searchText) => {
    !isSearching && setSearchString(searchText);
  }

  // === Static Vars

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
                <TaskList isSearching={isSearching} tasks={taskListResult?.tasks} onSearch={onSearch} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <p className="fs-4">Task Form</p>
            <TaskForm isSaving={isSaving} onCreateTask={onCreateTask} />
          </div>
        </div>
      </div>
    </>
  );
}
