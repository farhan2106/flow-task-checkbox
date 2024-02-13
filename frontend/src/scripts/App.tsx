import { useState, useEffect } from 'react';
import useSWR from 'swr'
import { TaskForm, TaskList } from "./interfaces";
import TaskRepository from './domain/repositories/TaskRepo';

const taskRepo = new TaskRepository(`${process.env.FE_API_SERVER}/api/v1`)

export function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTask, setSelectedTask] = useState();

  const {
    data: taskListResult,
    error: _,
    isLoading: isSearching,
    mutate: mutateTaskListResult
  } = useSWR([pageNumber, pageSize, searchString, sortBy, sortDir], ([pageNumber, pageSize, searchString, sortBy, sortDir]) => taskRepo.list(pageNumber, pageSize, searchString, sortBy, sortDir))

  // === Side Effects

  // === Event Handlers
  const onSaveTask = (taskData) => {
    setIsSaving(true)

    if (taskData.id) {
      taskRepo.update(taskData.id, taskData)
        .then(() => {
          mutateTaskListResult({ ...taskListResult })
        })
        .finally(() => setIsSaving(false))
    } else {
      taskRepo.create(taskData)
        .then(() => {
          mutateTaskListResult({ ...taskListResult })
        })
        .finally(() => setIsSaving(false))
    }
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
                <TaskList 
                  isSearching={isSearching}
                  tasks={taskListResult?.tasks}
                  totalCount={taskListResult?.totalCount}
                  onSearch={onSearch}
                  onPageChange={page => {
                    setPageNumber(page);
                  }}
                  onPerPageChange={pageSize => {
                    setPageSize(pageSize);
                  }} 
                  onSort={(sortField, sortDirection) => {
                    if (sortField === 'Due Date') {
                      setSortBy('due_date')
                    } else {
                      setSortBy('create_date')
                    }

                    setSortDir(sortDirection)
                  }}
                  onSelect={task => {
                    setSelectedTask(task)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <p className="fs-4">Task Form</p>
            <TaskForm isSaving={isSaving} onSaveTask={onSaveTask} task={selectedTask} />
          </div>
        </div>
      </div>
    </>
  );
}
