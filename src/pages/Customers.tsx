import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, ArrowUpDown, Download, Plus, Trash2, Edit, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Customer {
  _id: string;
  name: string;
  email: string;
  company: string;
  status: 'Active' | 'Inactive';
  spend: number;
  orders: number;
  lastPurchase: string;
  createdAt: string;
}

interface CustomerFormData {
  name: string;
  email: string;
  company: string;
  status: 'Active' | 'Inactive';
  spend: number;
  orders: number;
  lastPurchase: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    company: '',
    status: 'Active',
    spend: 0,
    orders: 0,
    lastPurchase: new Date().toISOString().split('T')[0],
  });

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers by search term and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let fieldA = a[sortField as keyof typeof a];
    let fieldB = b[sortField as keyof typeof b];
    
    if (typeof fieldA === 'string') {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB as string;
      fieldB = fieldB.toLowerCase();
    }
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelectCustomer = (id: string) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer._id));
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'spend' || name === 'orders' ? Number(value) : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCustomer 
        ? `/api/customers/${editingCustomer._id}`
        : '/api/customers';
      
      const method = editingCustomer ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save customer');

      await fetchCustomers();
      setShowModal(false);
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        company: '',
        status: 'Active',
        spend: 0,
        orders: 0,
        lastPurchase: new Date().toISOString().split('T')[0],
      });
      
      toast.success(editingCustomer ? 'Customer updated successfully' : 'Customer added successfully');
    } catch (error) {
      toast.error('Failed to save customer');
      console.error('Error saving customer:', error);
    }
  };

  // Handle customer deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete customer');

      await fetchCustomers();
      toast.success('Customer deleted successfully');
    } catch (error) {
      toast.error('Failed to delete customer');
      console.error('Error deleting customer:', error);
    }
  };

  // Open edit modal
  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      company: customer.company,
      status: customer.status,
      spend: customer.spend,
      orders: customer.orders,
      lastPurchase: customer.lastPurchase.split('T')[0],
    });
    setShowModal(true);
  };

  // Open add modal
  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      company: '',
      status: 'Active',
      spend: 0,
      orders: 0,
      lastPurchase: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-500">Manage and monitor your customer base</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg flex items-center shadow-sm hover:bg-gray-50 transition-colors">
            <Download size={18} className="mr-2" />
            Export
          </button>
          <button 
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading customers...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center">
                        Customer
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('spend')}>
                      <div className="flex items-center">
                        Total Spend
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('orders')}>
                      <div className="flex items-center">
                        Orders
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('lastPurchase')}>
                      <div className="flex items-center">
                        Last Purchase
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer._id)}
                          onChange={() => toggleSelectCustomer(customer._id)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 font-medium">{customer.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                            <div className="text-xs text-gray-400">{customer.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(customer.spend)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.lastPurchase)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(customer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(customer._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredCustomers.length}</span> customers
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-blue-50 text-blue-600">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">2</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">3</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Spend
                  </label>
                  <input
                    type="number"
                    name="spend"
                    value={formData.spend}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orders
                  </label>
                  <input
                    type="number"
                    name="orders"
                    value={formData.orders}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Purchase
                  </label>
                  <input
                    type="date"
                    name="lastPurchase"
                    value={formData.lastPurchase}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;