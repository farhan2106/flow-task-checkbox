import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useDebounce } from 'use-debounce';

export const TaskList = ({ isSearching, tasks, totalCount, onSelect, onSearch, onPageChange, onPerPageChange, onSort }) => {
  const [searchText, setSearchText] = useState('');
  const [debounchedSearchText] = useDebounce(searchText, 1000);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(totalCount);
  const [page, setPage] = useState(1);

  // === Event Handlers
  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
  };

  const handlePageChange = (page, totalRows) => {
    setPage(page);
    setTotalRows(totalRows);
    onPageChange(page);
  };

  const handlePerPageChange = (newPageSize, page) => {
    setPage(page);
    setPageSize(newPageSize);
    onPerPageChange(newPageSize)
  };

  const handleSort = (column, sortDirection) => {
    onSort(column.name, sortDirection)
  };

  const handleEdit = (row) => {
    onSelect(row)
  };

  // === Side Effects
  useEffect(() => {
    onSearch(debounchedSearchText)
  }, [debounchedSearchText])

  useEffect(() => {
    setTotalRows(totalCount)
  }, [totalCount])

  // === Static Vars
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
    },
    {
      name: 'Description',
      selector: row => row.description,
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
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button className="btn btn-primary btn-sm mr-2" onClick={() => handleEdit(row)}>Edit</button>
        </div>
      ),
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
        paginationServer
        paginationTotalRows={totalRows}
        paginationDefaultPage={page}
        paginationPerPage={pageSize}
        paginationRowsPerPageOptions={[10, 20, 30]}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerPageChange}
        onSort={handleSort}
      />
    </div>
  );
};
