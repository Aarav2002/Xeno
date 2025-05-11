// Mock customer data
export const mockCustomers = [
  {
    id: 'c001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    company: 'Acme Inc',
    status: 'Active',
    spend: 12500,
    orders: 17,
    lastPurchase: '2025-04-28',
    createdAt: '2024-09-15',
  },
  {
    id: 'c002',
    name: 'Sarah Johnson',
    email: 'sjohnson@example.com',
    company: 'Tech Solutions',
    status: 'Active',
    spend: 8750,
    orders: 9,
    lastPurchase: '2025-05-01',
    createdAt: '2024-10-22',
  },
  {
    id: 'c003',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    company: 'Global Systems',
    status: 'Inactive',
    spend: 4200,
    orders: 5,
    lastPurchase: '2025-02-14',
    createdAt: '2025-01-10',
  },
  {
    id: 'c004',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    company: 'Innovate LLC',
    status: 'Active',
    spend: 22100,
    orders: 28,
    lastPurchase: '2025-05-03',
    createdAt: '2024-08-05',
  },
  {
    id: 'c005',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    company: 'Wilson Enterprises',
    status: 'Active',
    spend: 16800,
    orders: 19,
    lastPurchase: '2025-04-22',
    createdAt: '2024-11-17',
  },
  {
    id: 'c006',
    name: 'Jessica Martinez',
    email: 'jessica.m@example.com',
    company: 'Design Masters',
    status: 'Active',
    spend: 7900,
    orders: 12,
    lastPurchase: '2025-05-01',
    createdAt: '2025-01-03',
  },
  {
    id: 'c007',
    name: 'Robert Taylor',
    email: 'robert.t@example.com',
    company: 'Taylor Group',
    status: 'Inactive',
    spend: 3500,
    orders: 4,
    lastPurchase: '2025-01-15',
    createdAt: '2024-12-05',
  },
  {
    id: 'c008',
    name: 'Amanda Lee',
    email: 'amanda.lee@example.com',
    company: 'Creative Solutions',
    status: 'Active',
    spend: 11200,
    orders: 15,
    lastPurchase: '2025-04-18',
    createdAt: '2024-10-10',
  },
];

// Mock segments data
export const mockSegments = [
  {
    id: 's001',
    name: 'High Value Customers',
    description: 'Customers with spend > $10,000',
    rules: 'spend > 10000',
    customerCount: 542,
    createdAt: '2025-03-15',
    lastUpdated: '2025-04-28',
  },
  {
    id: 's002',
    name: 'New Customers',
    description: 'Customers created in the last 30 days',
    rules: 'createdAt >= (today - 30 days)',
    customerCount: 87,
    createdAt: '2025-04-01',
    lastUpdated: '2025-04-01',
  },
  {
    id: 's003',
    name: 'Inactive Customers',
    description: 'No purchases in the last 90 days',
    rules: 'lastPurchase < (today - 90 days)',
    customerCount: 362,
    createdAt: '2025-02-22',
    lastUpdated: '2025-04-15',
  },
  {
    id: 's004',
    name: 'High Frequency Shoppers',
    description: 'Customers with more than 10 orders',
    rules: 'orders > 10',
    customerCount: 256,
    createdAt: '2025-03-10',
    lastUpdated: '2025-04-21',
  },
  {
    id: 's005',
    name: 'Enterprise Clients',
    description: 'Customers from enterprise companies',
    rules: 'company IN ["Acme Inc", "Tech Solutions", "Global Systems"]',
    customerCount: 45,
    createdAt: '2025-01-05',
    lastUpdated: '2025-04-02',
  },
];

// Mock campaigns data
export const mockCampaigns = [
  {
    id: 'camp001',
    name: 'Spring Promotion',
    segment: 'High Value Customers',
    status: 'Completed',
    sent: 542,
    successRate: '93.2%',
    startDate: '2025-03-20',
    endDate: '2025-03-27',
    delivery: {
      success: 505,
      failed: 37,
      pending: 0,
    },
    message: 'Get 20% off on all spring collection items. Use code SPRING25 at checkout!',
  },
  {
    id: 'camp002',
    name: 'New Product Announcement',
    segment: 'All Customers',
    status: 'Active',
    sent: 1583,
    successRate: '91.5%',
    startDate: '2025-05-01',
    endDate: '2025-05-08',
    delivery: {
      success: 1448,
      failed: 98,
      pending: 37,
    },
    message: 'Introducing our newest product line! Check it out now and get early access benefits.',
  },
  {
    id: 'camp003',
    name: 'Customer Feedback Survey',
    segment: 'High Frequency Shoppers',
    status: 'Scheduled',
    sent: 0,
    successRate: '0%',
    startDate: '2025-05-15',
    endDate: '2025-05-22',
    delivery: {
      success: 0,
      failed: 0,
      pending: 256,
    },
    message: 'We value your feedback! Take our short survey and get a $10 gift card.',
  },
  {
    id: 'camp004',
    name: 'Reactivation Campaign',
    segment: 'Inactive Customers',
    status: 'Completed',
    sent: 362,
    successRate: '89.5%',
    startDate: '2025-04-10',
    endDate: '2025-04-17',
    delivery: {
      success: 324,
      failed: 38,
      pending: 0,
    },
    message: 'We miss you! Come back and enjoy 30% off your next purchase with code WELCOME30.',
  },
  {
    id: 'camp005',
    name: 'Summer Sale',
    segment: 'All Customers',
    status: 'Active',
    sent: 1842,
    successRate: '94.8%',
    startDate: '2025-05-01',
    endDate: '2025-05-15',
    delivery: {
      success: 1746,
      failed: 96,
      pending: 0,
    },
    message: 'Summer is here! Enjoy up to 40% off on all summer essentials.',
  },
  {
    id: 'camp006',
    name: 'VIP Customer Appreciation',
    segment: 'High Value Customers',
    status: 'Completed',
    sent: 542,
    successRate: '97.2%',
    startDate: '2025-04-01',
    endDate: '2025-04-07',
    delivery: {
      success: 527,
      failed: 15,
      pending: 0,
    },
    message: 'As a valued VIP customer, enjoy exclusive early access to our new premium collection.',
  },
  {
    id: 'camp007',
    name: 'Enterprise Solution Demo',
    segment: 'Enterprise Clients',
    status: 'Scheduled',
    sent: 0,
    successRate: '0%',
    startDate: '2025-05-20',
    endDate: '2025-05-27',
    delivery: {
      success: 0,
      failed: 0,
      pending: 45,
    },
    message: 'Join our exclusive webinar to see our new enterprise solution in action. Register now!',
  },
];

// Mock rule types for segment builder
export const ruleTypes = [
  { id: 'spend', label: 'Total Spend', type: 'number' },
  { id: 'orders', label: 'Number of Orders', type: 'number' },
  { id: 'lastPurchase', label: 'Last Purchase Date', type: 'date' },
  { id: 'createdAt', label: 'Created Date', type: 'date' },
  { id: 'status', label: 'Customer Status', type: 'select', options: ['Active', 'Inactive'] },
  { id: 'company', label: 'Company', type: 'text' },
];

// Mock operators for segment builder
export const operators = {
  number: [
    { id: 'eq', label: '=' },
    { id: 'gt', label: '>' },
    { id: 'lt', label: '<' },
    { id: 'gte', label: '>=' },
    { id: 'lte', label: '<=' },
  ],
  date: [
    { id: 'before', label: 'Before' },
    { id: 'after', label: 'After' },
    { id: 'between', label: 'Between' },
  ],
  text: [
    { id: 'eq', label: 'Equals' },
    { id: 'contains', label: 'Contains' },
    { id: 'startsWith', label: 'Starts with' },
    { id: 'endsWith', label: 'Ends with' },
  ],
  select: [
    { id: 'eq', label: 'Is' },
    { id: 'neq', label: 'Is not' },
  ],
};

// Mock customer audience count for a given set of rules
export const getAudienceCount = (rules: any[]): number => {
  // Simulate counting logic - in a real app this would query the backend
  if (rules.length === 0) return 0;
  
  // Return a somewhat realistic number based on the rules
  // This is just a simple simulation
  const baseCount = Math.floor(Math.random() * 1000) + 100;
  return Math.floor(baseCount / rules.length);
};

// Mock AI suggestion for segment rule
export const getAiSuggestion = (input: string): any[] => {
  // Simple mapping for demo purposes
  const suggestions: Record<string, any[]> = {
    "high spenders": [
      { field: "spend", operator: "gt", value: 10000 }
    ],
    "inactive customers": [
      { field: "lastPurchase", operator: "before", value: "2025-02-01" }
    ],
    "new customers": [
      { field: "createdAt", operator: "after", value: "2025-04-01" }
    ],
    "frequent buyers": [
      { field: "orders", operator: "gt", value: 10 }
    ],
    "enterprise companies": [
      { field: "company", operator: "contains", value: "Inc" }
    ]
  };
  
  // Find a matching suggestion or return a default
  for (const [key, rules] of Object.entries(suggestions)) {
    if (input.toLowerCase().includes(key)) {
      return rules;
    }
  }
  
  // Default suggestion
  return [
    { field: "spend", operator: "gt", value: 5000 }
  ];
};