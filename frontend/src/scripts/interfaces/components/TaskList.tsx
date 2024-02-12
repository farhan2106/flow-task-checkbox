import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useDebounce } from 'use-debounce';

export const TaskList = ({ isSearching, tasks, onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [debounchedSearchText] = useDebounce(searchText, 1000);

  // === Event Handlers
  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
  };

  // === Side Effects
  useEffect(() => {
    onSearch(debounchedSearchText)
  }, [debounchedSearchText])

  // === Static Vars
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Due Date',
      selector: row => row.dueDate,
      sortable: true,
    },
    {
      name: 'Create Date',
      selector: row => row.createDate,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
  ];

  if (isSearching) {
    return 'Searching...'
  }

  return (
    <div>
      {/* Search input */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={searchText}
          onChange={handleSearch}
          placeholder="Search by task name"
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={tasks}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
      />
    </div>
  );
};
