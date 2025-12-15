import React, { useState } from 'react';
import { SortableTable, SortableTableHead } from './sortable-table';
import { Table } from './table';

// Simple test component to verify sorting works
const SortableTableTest = () => {
  const [data] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, department: 'Marketing' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, department: 'Sales' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, department: 'Engineering' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 32, department: 'HR' },
  ]);

  const [sortedData, setSortedData] = useState(data);

  const handleSort = (sortConfig) => {
    console.log('🔄 Test sorting:', sortConfig);
    
    if (!sortConfig.key) {
      setSortedData(data);
      return;
    }

    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setSortedData(sorted);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Sortable Table Test</h2>
      <p className="text-gray-600">
        This is a test to verify sorting works. Click any column header!
      </p>
      
      <SortableTable
        data={sortedData}
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
            {sortedData.map((row) => (
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
      
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">Test Results:</h3>
        <p className="text-green-800">
          If you can see the data sorting when you click column headers, then the SortableTable component is working correctly!
        </p>
      </div>
    </div>
  );
};

export default SortableTableTest;
