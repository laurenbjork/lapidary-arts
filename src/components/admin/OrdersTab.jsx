import React from 'react';

const OrdersTab = () => {
  const orders = [
    { id: '#1024', customer: 'Sarah Johnson', date: 'Oct 24, 2023', total: '$1,250.00', status: 'Processing' },
    { id: '#1023', customer: 'Michael Smith', date: 'Oct 23, 2023', total: '$450.00', status: 'Shipped' },
    { id: '#1022', customer: 'Emma Davis', date: 'Oct 23, 2023', total: '$2,100.00', status: 'Delivered' },
    { id: '#1021', customer: 'James Wilson', date: 'Oct 22, 2023', total: '$85.00', status: 'Cancelled' },
    { id: '#1020', customer: 'Olivia Brown', date: 'Oct 21, 2023', total: '$3,400.00', status: 'Processing' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-serif mb-6">Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Order ID</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Customer</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Date</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Total</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Status</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{order.id}</td>
                <td className="py-3 px-4">{order.customer}</td>
                <td className="py-3 px-4 text-gray-500 text-sm">{order.date}</td>
                <td className="py-3 px-4 font-medium">{order.total}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wide ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-burgundy hover:underline text-xs uppercase tracking-widest">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTab;
