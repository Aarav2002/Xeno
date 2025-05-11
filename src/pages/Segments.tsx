import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, ChevronRight, Trash2, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Rule {
  field: string;
  operator: string;
  value: string | number;
}

interface Segment {
  _id: string;
  name: string;
  description: string;
  rules: Rule[];
  customerCount: number;
  createdAt: string;
  lastUpdated: string;
}

const Segments: React.FC = () => {
  const navigate = useNavigate();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch segments
  const fetchSegments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/segments');
      if (!response.ok) throw new Error('Failed to fetch segments');
      const data = await response.json();
      setSegments(data);
    } catch (error) {
      toast.error('Failed to load segments');
      console.error('Error fetching segments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  // Filter segments by search term
  const filteredSegments = segments.filter(segment => 
    segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort segments
  const sortedSegments = [...filteredSegments].sort((a, b) => {
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

  // Handle segment deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this segment?')) return;
    
    try {
      const response = await fetch(`/api/segments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete segment');

      await fetchSegments();
      toast.success('Segment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete segment');
      console.error('Error deleting segment:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Segments</h1>
          <p className="text-gray-500">Create and manage customer segments</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            to="/segments/builder"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Create Segment
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search segments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading segments...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {sortedSegments.map((segment) => (
            <div key={segment._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{segment.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{segment.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => navigate(`/segments/builder?edit=${segment._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(segment._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center mt-4 space-x-1 text-gray-500 text-sm">
                  <Users size={16} />
                  <span>{segment.customerCount} customers</span>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  Rules: {segment.rules.map((rule, index) => (
                    <span key={index} className="font-mono bg-gray-100 px-2 py-1 rounded mr-1">
                      {rule.field} {rule.operator} {rule.value}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <div>Created: {formatDate(segment.createdAt)}</div>
                    <div>Last updated: {formatDate(segment.lastUpdated)}</div>
                  </div>
                  <Link 
                    to={`/segments/builder?edit=${segment._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    Edit rules
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Segments;