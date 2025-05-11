import React, { useState, useEffect } from 'react';
import { BarChart3, Users, PieChart, Mail, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { mockCampaigns } from '../data/mockData';

const Dashboard: React.FC = () => {
  const [segmentCount, setSegmentCount] = useState(0);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await fetch('/api/segments');
        if (!response.ok) throw new Error('Failed to fetch segments');
        const segments = await response.json();
        setSegmentCount(segments.length);
      } catch (error) {
        console.error('Error fetching segments:', error);
      }
    };

    fetchSegments();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back to your CRM dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Total Customers</span>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold">1,842</h3>
              <p className="text-green-500 text-xs font-medium flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +8.2% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Active Segments</span>
            <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
              <PieChart size={20} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold">{segmentCount}</h3>
              <p className="text-gray-500 text-xs font-medium flex items-center">
                <Clock size={14} className="mr-1" />
                5 created this week
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Campaign Delivery</span>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Mail size={20} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold">12,764</h3>
              <p className="text-green-500 text-xs font-medium flex items-center">
                <TrendingUp size={14} className="mr-1" />
                92.4% success rate
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Avg. Order Value</span>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold">$86.42</h3>
              <p className="text-red-500 text-xs font-medium flex items-center">
                <TrendingUp size={14} className="mr-1 transform rotate-180" />
                -2.4% from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recent Campaigns</h2>
            <a href="/campaigns" className="text-blue-600 text-sm hover:underline">View all</a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockCampaigns.slice(0, 5).map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                      {campaign.segment}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          campaign.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                      {campaign.sent}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                      {campaign.successRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full">
                <Users size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-800">New customer signup from <span className="font-medium">Apple Inc.</span></p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-green-100 text-green-600 rounded-full">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-800">Campaign <span className="font-medium">Summer Sale</span> completed</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-amber-100 text-amber-600 rounded-full">
                <PieChart size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-800">New segment <span className="font-medium">High Value Customers</span> created</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-red-100 text-red-600 rounded-full">
                <AlertCircle size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-800">Delivery failure rate above threshold for campaign <span className="font-medium">Product Announcement</span></p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-purple-100 text-purple-600 rounded-full">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-800">Monthly report available for <span className="font-medium">May 2025</span></p>
                <p className="text-xs text-gray-500 mt-1">4 days ago</p>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;