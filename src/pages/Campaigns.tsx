import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, ChevronRight, Mail, Calendar, Tag } from 'lucide-react';
import { mockCampaigns } from '../data/mockData';

const Campaigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filter campaigns by search term and status
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.segment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
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


  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Campaigns</h1>
          <p className="text-gray-500">Create and manage your marketing campaigns</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            to="#createCampaign"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Create Campaign
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns by name or segment"
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
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
              </select>
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {sortedCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-4
                    ${campaign.status === 'Active' ? 'bg-green-100 text-green-600' : 
                     campaign.status === 'Completed' ? 'bg-blue-100 text-blue-600' : 
                     'bg-amber-100 text-amber-600'}`}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{campaign.name}</h3>
                    <div className="flex items-center mt-1 text-gray-500 text-sm">
                      <Tag size={14} className="mr-1" />
                      <span>{campaign.segment}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center space-x-6">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Status</span>
                    <span className={`text-sm font-medium
                      ${campaign.status === 'Active' ? 'text-green-600' : 
                       campaign.status === 'Completed' ? 'text-blue-600' : 
                       'text-amber-600'}`}>
                      {campaign.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Success Rate</span>
                    <span className="text-sm font-medium text-gray-800">{campaign.successRate}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Sent</span>
                    <span className="text-sm font-medium text-gray-800">{campaign.sent}</span>
                  </div>
                  
                  <Link 
                    to={`/campaigns/${campaign.id}`}
                    className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    View Details
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-gray-600">{campaign.delivery.success}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-xs text-gray-600">{campaign.delivery.failed}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      <span className="text-xs text-gray-600">{campaign.delivery.pending}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;