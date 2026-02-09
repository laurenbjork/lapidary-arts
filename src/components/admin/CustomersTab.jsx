import React from 'react';

const CustomersTab = () => {
  const customers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', orders: 5, spent: '$3,250.00' },
    { id: 2, name: 'Michael Smith', email: 'mike.smith@example.com', orders: 2, spent: '$450.00' },
    { id: 3, name: 'Emma Davis', email: 'emma.d@example.com', orders: 8, spent: '$12,100.00' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-serif mb-6">Customers</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Name</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Email</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Orders</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{customer.name}</td>
                <td className="py-3 px-4 text-gray-500">{customer.email}</td>
                <td className="py-3 px-4">{customer.orders}</td>
                <td className="py-3 px-4 font-medium">{customer.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersTab;
