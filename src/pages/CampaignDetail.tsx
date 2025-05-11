import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, Calendar, Users, MailCheck, ChevronLeft, 
   Download, Share2, Zap, Copy, MessageSquare 
} from 'lucide-react';
import { mockCampaigns } from '../data/mockData';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const campaign = mockCampaigns.find(c => c.id === id);
  
  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-500 mb-4">Campaign not found</div>
        <Link to="/campaigns" className="text-blue-600 hover:underline">
          Back to Campaigns
        </Link>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };
  
  // Prepare data for delivery chart
  const deliveryData = [
    { name: 'Success', value: campaign.delivery.success },
    { name: 'Failed', value: campaign.delivery.failed },
    { name: 'Pending', value: campaign.delivery.pending },
  ];
  
  const COLORS = ['#10B981', '#EF4444', '#9CA3AF'];
  
  // Prepare data for daily performance chart
  const dailyPerformanceData = [
    { day: 'Day 1', delivered: 340, opened: 240, clicked: 120 },
    { day: 'Day 2', delivered: 280, opened: 190, clicked: 95 },
    { day: 'Day 3', delivered: 200, opened: 130, clicked: 60 },
    { day: 'Day 4', delivered: 190, opened: 120, clicked: 50 },
    { day: 'Day 5', delivered: 180, opened: 110, clicked: 55 },
    { day: 'Day 6', delivered: 150, opened: 90, clicked: 40 },
    { day: 'Day 7', delivered: 120, opened: 70, clicked: 30 },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <Link to="/campaigns" className="text-blue-600 hover:text-blue-800 text-sm flex items-center mb-2">
          <ChevronLeft size={16} className="mr-1" />
          Back to Campaigns
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{campaign.name}</h1>
            <div className="flex items-center mt-1 text-gray-500">
              <Calendar size={16} className="mr-1" />
              <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center shadow-sm hover:bg-gray-50 transition-colors text-sm">
              <Download size={16} className="mr-1.5" />
              Export
            </button>
            <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center shadow-sm hover:bg-gray-50 transition-colors text-sm">
              <Share2 size={16} className="mr-1.5" />
              Share
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-colors text-sm">
              <Zap size={16} className="mr-1.5" />
              Optimize
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-medium">Status</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 
              campaign.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {campaign.status}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Time remaining</div>
              <div className="font-bold">
                {campaign.status === 'Completed' ? 'Completed' : 
                 campaign.status === 'Scheduled' ? 'Not started' : '3 days'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-medium">Audience</h3>
            <div className="text-sm text-gray-500">Segment</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <Users size={20} />
            </div>
            <div>
              <div className="text-sm text-gray-500">{campaign.segment}</div>
              <div className="font-bold">{campaign.sent + campaign.delivery.pending} recipients</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-medium">Delivery</h3>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <MailCheck size={20} />
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                {campaign.delivery.success} delivered
              </div>
              <div className="font-bold">{campaign.successRate} success rate</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-800 font-bold mb-4">Daily Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyPerformanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="delivered" fill="#3B82F6" name="Delivered" />
                <Bar dataKey="opened" fill="#10B981" name="Opened" />
                <Bar dataKey="clicked" fill="#8B5CF6" name="Clicked" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-800 font-bold mb-4">Delivery Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
              <Pie
  data={deliveryData}
  cx="50%"
  cy="50%"
  innerRadius={60}
  outerRadius={80}
  paddingAngle={4}
  dataKey="value"
  labelLine={false}
  label={({ name, percent }) =>
    percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
  }
>
  {deliveryData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  ))}
</Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <div className="text-sm text-gray-500">Success</div>
              <div className="font-bold text-gray-800">{campaign.delivery.success}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Failed</div>
              <div className="font-bold text-gray-800">{campaign.delivery.failed}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="font-bold text-gray-800">{campaign.delivery.pending}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-800 font-bold mb-4">AI Insights</h3>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4 mb-4">
            <p className="text-blue-800 text-sm">
              This campaign is performing <strong>15% better</strong> than average for the <strong>{campaign.segment}</strong> segment.
            </p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 rounded p-4 mb-4">
            <p className="text-green-800 text-sm">
              The open rate is above average, suggesting your subject line was effective.
            </p>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded p-4">
            <p className="text-amber-800 text-sm">
              Consider A/B testing different CTAs to improve the click-through rate.
            </p>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-800 font-bold mb-4">Campaign Message</h3>
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-gray-700">Message Content</div>
              <button className="text-gray-400 hover:text-gray-600">
                <Copy size={16} />
              </button>
            </div>
            <p className="text-gray-600">{campaign.message}</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="font-medium text-gray-700 mb-2">Delivery Details</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Delivery Method</span>
                <span className="text-gray-700 text-sm">Email</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Sender Name</span>
                <span className="text-gray-700 text-sm">CRM Platform</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Reply To</span>
                <span className="text-gray-700 text-sm">support@crmplatform.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Subject Line</span>
                <span className="text-gray-700 text-sm">{campaign.name}</span>
              </div>
              
            </div>
            <button
  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
  onClick={() => alert('Message sent!')} // Replace with actual logic
>
  <MessageSquare className="mr-2" size={16} />
  Send Message
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;