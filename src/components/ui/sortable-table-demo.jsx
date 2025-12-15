import React, { useState } from 'react';
import { SortableTable, SortableTableHead } from './sortable-table';
import { Table } from './table';

// Demo component showing how easy it is to implement sorting
const SortableTableDemo = () => {
  const [data] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, department: 'Marketing' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, department: 'Sales' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, department: 'Engineering' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 32, department: 'HR' },
  ]);

  // This is all you need to handle sorting!
  const handleSort = (sortConfig) => {
    console.log('Sorting by:', sortConfig.key, 'Direction:', sortConfig.direction);
    // You can implement your own sorting logic here
    // Or send to API, or use the built-in sortData utility
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Sortable Table Demo</h2>
      <p className="text-gray-600">
        Click any column header to sort! It's that simple.
      </p>
      
      <SortableTable
        data={data}
        onSort={handleSort}
        defaultSortKey="name"
        defaultSortDirection="asc"
      >
        <Table>
          <Table.Header>
            <Table.Row>
              <SortableTableHead sortKey="id">ID</SortableTableHead>
              <SortableTableHead sortKey="name">Name</SortableTableHead>
              <SortableTableHead sortKey="email">Email</SortableTableHead>
              <SortableTableHead sortKey="age">Age</SortableTableHead>
              <SortableTableHead sortKey="department">Department</SortableTableHead>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.id}</Table.Cell>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.email}</Table.Cell>
                <Table.Cell>{row.age}</Table.Cell>
                <Table.Cell>{row.department}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </SortableTable>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use:</h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>Import: <code>import { '{SortableTable, SortableTableHead}' } from './sortable-table'</code></li>
          <li>Wrap your table: <code>&lt;SortableTable data={data} onSort={handleSort}&gt;</code></li>
          <li>Replace headers: <code>&lt;SortableTableHead sortKey="fieldname"&gt;Label&lt;/SortableTableHead&gt;</code></li>
          <li>Handle sorting: <code>const handleSort = (sortConfig) =&gt; { /* your logic */ }</code></li>
        </ol>
      </div>
    </div>
  );
};

export default SortableTableDemo;
