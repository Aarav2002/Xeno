import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, Trash2, PlusCircle, Lightbulb, Loader2, Users } from 'lucide-react';
import { ruleTypes, operators } from '../data/mockData';
import toast from 'react-hot-toast';
import { GoogleGenAI } from "@google/genai";

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string | number;
}

interface GroupOperator {
  id: string;
  type: 'AND' | 'OR';
}

interface Segment {
  _id: string;
  name: string;
  description: string;
  rules: {
    field: string;
    operator: string;
    value: string | number;
  }[];
  customerCount: number;
  createdAt: string;
  lastUpdated: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const SegmentBuilder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('edit');

  const [segmentName, setSegmentName] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [rules, setRules] = useState<Rule[]>([
    { id: generateId(), field: 'spend', operator: 'gt', value: 0 },
  ]);
  const [groupOperators, setGroupOperators] = useState<GroupOperator[]>([]);
  const [isAiInputVisible, setIsAiInputVisible] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [audienceCount, setAudienceCount] = useState(0);
  const [isCalculatingAudience, setIsCalculatingAudience] = useState(false);
  const [loading, setLoading] = useState(false);

  

  // Fetch segment if editing
  useEffect(() => {
    const fetchSegment = async () => {
      if (!editId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/segments/${editId}`);
        if (!response.ok) throw new Error('Failed to fetch segment');
        
        const segment: Segment = await response.json();
        setSegmentName(segment.name);
        setSegmentDescription(segment.description);
        
        const builderRules = segment.rules.map(rule => ({
          id: generateId(),
          field: rule.field,
          operator: rule.operator,
          value: rule.value
        }));
        
        setRules(builderRules);
        
        const newGroupOperators = builderRules.length > 1 
          ? builderRules.slice(0, -1).map(() => ({ id: generateId(), type: 'AND' as const }))
          : [];
        
        setGroupOperators(newGroupOperators);
        setAudienceCount(segment.customerCount);
      } catch (error) {
        toast.error('Failed to load segment');
        console.error('Error fetching segment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSegment();
  }, [editId]);

  const addRule = () => {
    const newRule = { id: generateId(), field: 'spend', operator: 'gt', value: 0 };
    setRules([...rules, newRule]);
    
    if (rules.length > 0) {
      const newGroupOperator = { id: generateId(), type: 'AND' as const };
      setGroupOperators([...groupOperators, newGroupOperator]);
    }
    
    calculateAudience([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    const ruleIndex = rules.findIndex(rule => rule.id === id);
    
    if (rules.length <= 1) return;
    
    const newRules = rules.filter(rule => rule.id !== id);
    setRules(newRules);
    
    if (ruleIndex < groupOperators.length) {
      const newGroupOperators = [...groupOperators];
      newGroupOperators.splice(ruleIndex, 1);
      setGroupOperators(newGroupOperators);
    }
    
    calculateAudience(newRules);
  };

  const updateRule = (id: string, field: string, value: any) => {
    const newRules = rules.map(rule => {
      if (rule.id === id) {
        const updatedRule = { ...rule, [field]: value };
        
        if (field === 'field') {
          const selectedRuleType = ruleTypes.find(type => type.id === value);
          if (selectedRuleType?.type === 'number') {
            updatedRule.value = 0;
          } else if (selectedRuleType?.type === 'date') {
            updatedRule.value = new Date().toISOString().split('T')[0];
          } else if (selectedRuleType?.type === 'text') {
            updatedRule.value = '';
          } else if (selectedRuleType?.type === 'select') {
            updatedRule.value = selectedRuleType.options?.[0] || '';
          }
          
          updatedRule.operator = operators[selectedRuleType?.type as keyof typeof operators]?.[0]?.id || 'gt';
        }
        
        return updatedRule;
      }
      return rule;
    });
    
    setRules(newRules);
    calculateAudience(newRules);
  };

  const updateGroupOperator = (id: string, type: 'AND' | 'OR') => {
    const newGroupOperators = groupOperators.map(operator => 
      operator.id === id ? { ...operator, type } : operator
    );
    setGroupOperators(newGroupOperators);
    calculateAudience(rules);
  };

  const calculateAudience = (currentRules: Rule[]) => {
    if (currentRules.length === 0) return;
    
    setIsCalculatingAudience(true);
    
    setTimeout(() => {
      setAudienceCount(Math.floor(Math.random() * 1000));
      setIsCalculatingAudience(false);
    }, 500);
  };

  const handleAiSuggestion = async () => {
    if (!aiInput.trim()) {
      toast.error('Please enter a description to generate rules');
      return;
    }
    
    setIsProcessingAi(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not found');
      }

      const ai = new GoogleGenAI({ apiKey });
      const availableFields = ruleTypes.map(type => ({
        id: type.id,
        label: type.label,
        type: type.type,
        options: type.options || []
      }));
      
      const availableOperators = Object.entries(operators).reduce((acc, [type, ops]) => {
        acc[type] = ops.map(op => op.id);
        return acc;
      }, {} as Record<string, string[]>);

      // Create the prompt
      const prompt = `Create customer segmentation rules based on: "${aiInput}"

Available fields: ${JSON.stringify(availableFields)}
Available operators: ${JSON.stringify(availableOperators)}

Return ONLY a JSON array of rules in this format:
[{
  "field": "field_id",
  "operator": "operator_id", 
  "value": "appropriate_value"
}]
`;

      // Call Gemini API
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });

      // Process response
      const responseText = response.text;
      if (!responseText) {
        throw new Error('No response from AI');
      }
      const jsonStart = responseText.indexOf('[');
      const jsonEnd = responseText.lastIndexOf(']') + 1;
      const jsonString = responseText.slice(jsonStart, jsonEnd);
      
      const generatedRules = JSON.parse(jsonString);

      // Convert to our rule format
      const newRules = generatedRules.map((rule: any) => ({
        id: generateId(),
        field: rule.field || 'spend',
        operator: rule.operator || 'gt',
        value: rule.value || 0
      }));

      // Create group operators
      const newGroupOperators = newRules.length > 1 
        ? newRules.slice(0, -1).map(() => ({ id: generateId(), type: 'AND' as const }))
        : [];

      setRules(newRules);
      setGroupOperators(newGroupOperators);
      calculateAudience(newRules);
      setIsAiInputVisible(false);
      setAiInput('');
      toast.success('AI-generated rules applied!');
    } catch (error) {
      console.error('AI generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate rules';
      toast.error(errorMessage);
      
      // Fallback rules
      const fallbackRules = [
        { id: generateId(), field: 'spend', operator: 'gt', value: 1000 },
        { id: generateId(), field: 'orders', operator: 'gt', value: 5 }
      ];
      
      const fallbackGroupOperators = [{ id: generateId(), type: 'AND' as const }];
      
      setRules(fallbackRules);
      setGroupOperators(fallbackGroupOperators);
      calculateAudience(fallbackRules);
    } finally {
      setIsProcessingAi(false);
    }
  };

  const handleSave = async () => {
    if (!segmentName.trim()) {
      toast.error('Please enter a segment name');
      return;
    }

    if (!segmentDescription.trim()) {
      toast.error('Please enter a segment description');
      return;
    }
    
    try {
      setLoading(true);
      
      const apiRules = rules.map(rule => ({
        field: rule.field,
        operator: rule.operator,
        value: rule.value
      }));

      const url = editId ? `/api/segments/${editId}` : '/api/segments';
      const method = editId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: segmentName,
          description: segmentDescription,
          rules: apiRules,
          customerCount: audienceCount
        }),
      });

      if (!response.ok) throw new Error('Failed to save segment');

      toast.success(editId ? 'Segment updated!' : 'Segment created!');
      navigate('/segments');
    } catch (error) {
      toast.error('Failed to save segment');
      console.error('Error saving segment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && editId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {editId ? 'Edit Segment' : 'Create Segment'}
          </h1>
          <p className="text-gray-500">Define rules to create a customer segment</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button 
            onClick={() => setIsAiInputVisible(!isAiInputVisible)}
            className="px-4 py-2 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg flex items-center shadow-sm hover:bg-amber-200 transition-colors"
          >
            <Lightbulb size={18} className="mr-2" />
            AI Assist
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Segment
              </>
            )}
          </button>
        </div>
      </div>

      {isAiInputVisible && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-start">
            <Lightbulb className="text-amber-500 mr-2 mt-1" size={20} />
            <div className="flex-grow">
              <h3 className="font-medium text-amber-800 mb-2">AI Assistance</h3>
              <p className="text-amber-700 text-sm mb-3">
                Describe the customers you want to target in plain English.
              </p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="e.g., 'High spending customers who haven't purchased recently'"
                  className="flex-grow px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button 
                  onClick={handleAiSuggestion}
                  disabled={isProcessingAi}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg flex items-center shadow-sm hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {isProcessingAi ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Processing
                    </>
                  ) : 'Generate Rules'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segment Name
            </label>
            <input
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="E.g., High Value Customers"
              className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={segmentDescription}
              onChange={(e) => setSegmentDescription(e.target.value)}
              placeholder="E.g., Customers with spend > $10,000"
              className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Define Rules
          </label>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div key={rule.id}>
                {index > 0 && (
                  <div className="flex items-center mb-2 pl-2">
                    <select
                      value={groupOperators[index - 1]?.type}
                      onChange={(e) => updateGroupOperator(groupOperators[index - 1].id, e.target.value as 'AND' | 'OR')}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  </div>
                )}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
                  <select
                    value={rule.field}
                    onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ruleTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                  
                  <select
                    value={rule.operator}
                    onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {(() => {
                      const selectedRuleType = ruleTypes.find(type => type.id === rule.field);
                      const operatorType = selectedRuleType?.type || 'number';
                      return operators[operatorType as keyof typeof operators].map((op) => (
                        <option key={op.id} value={op.id}>{op.label}</option>
                      ));
                    })()}
                  </select>
                  
                  {(() => {
                    const selectedRuleType = ruleTypes.find(type => type.id === rule.field);
                    
                    if (selectedRuleType?.type === 'select') {
                      return (
                        <select
                          value={rule.value as string}
                          onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {selectedRuleType.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      );
                    } else if (selectedRuleType?.type === 'date') {
                      return (
                        <input
                          type="date"
                          value={rule.value as string}
                          onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      );
                    } else if (selectedRuleType?.type === 'number') {
                      return (
                        <input
                          type="number"
                          value={rule.value as number}
                          onChange={(e) => updateRule(rule.id, 'value', parseFloat(e.target.value) || 0)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      );
                    } else {
                      return (
                        <input
                          type="text"
                          value={rule.value as string}
                          onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      );
                    }
                  })()}
                  
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Remove rule"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={addRule}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <PlusCircle size={16} className="mr-1" />
            Add rule
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg mr-4">
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-medium text-blue-800">Audience Size</h3>
            <p className="text-blue-600">
              {isCalculatingAudience ? (
                <span className="flex items-center">
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Calculating...
                </span>
              ) : audienceCount > 0 ? (
                <span className="text-2xl font-bold">{audienceCount} customers</span>
              ) : (
                <span className="text-sm italic">No matching customers</span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              Save Segment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SegmentBuilder;