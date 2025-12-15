// mockPlanGenerator.js - Creates realistic plans without API key
// Perfect backup when Gemini API isn't available

export const generateMockPlan = (swotData, goal, category) => {
  console.log('🎯 Generating plan from SWOT analysis (local generation)...');
  
  // Extract key insights from SWOT
  const strengths = swotData.strengths.split(',').filter(s => s.trim());
  const weaknesses = swotData.weaknesses.split(',').filter(w => w.trim());
  const opportunities = swotData.opportunities.split(',').filter(o => o.trim());
  const threats = swotData.threats.split(',').filter(t => t.trim());

  // Generate personalized tasks based on category and SWOT
  const taskTemplates = {
    'Health': [
      { title: 'Daily Exercise', description: 'Start with 30 minutes of physical activity', frequency: 'daily', estimatedDays: 30 },
      { title: 'Nutrition Planning', description: 'Plan healthy meals for the week', frequency: 'weekly', estimatedDays: 60 },
      { title: 'Sleep Schedule', description: 'Maintain consistent sleep pattern', frequency: 'daily', estimatedDays: 30 },
      { title: 'Health Tracking', description: 'Monitor progress with health metrics', frequency: 'daily', estimatedDays: 60 }
    ],
    'Career': [
      { title: 'Skill Development', description: 'Learn new professional skills', frequency: 'weekly', estimatedDays: 90 },
      { title: 'Networking', description: 'Build professional relationships', frequency: 'weekly', estimatedDays: 60 },
      { title: 'Resume Update', description: 'Maintain updated resume and portfolio', frequency: 'monthly', estimatedDays: 30 },
      { title: 'Goal Setting', description: 'Define career milestones', frequency: 'monthly', estimatedDays: 60 }
    ],
    'Finance': [
      { title: 'Budget Planning', description: 'Create and monitor monthly budget', frequency: 'monthly', estimatedDays: 30 },
      { title: 'Savings Plan', description: 'Set up automatic savings transfers', frequency: 'monthly', estimatedDays: 30 },
      { title: 'Investment Learning', description: 'Learn investment fundamentals', frequency: 'weekly', estimatedDays: 90 },
      { title: 'Expense Tracking', description: 'Track daily spending', frequency: 'daily', estimatedDays: 60 }
    ],
    'Hobby': [
      { title: 'Practice Time', description: 'Dedicate time to your hobby', frequency: 'daily', estimatedDays: 30 },
      { title: 'Learn New Techniques', description: 'Explore advanced techniques', frequency: 'weekly', estimatedDays: 60 },
      { title: 'Join Community', description: 'Connect with enthusiasts', frequency: 'weekly', estimatedDays: 60 },
      { title: 'Document Progress', description: 'Keep a hobby journal', frequency: 'weekly', estimatedDays: 90 }
    ]
  };

  // Get tasks for the category or use general ones
  const categoryTasks = taskTemplates[category] || taskTemplates['Health'];
  const tasks = categoryTasks.map((task, idx) => ({
    id: idx + 1,
    title: task.title,
    description: task.description,
    frequency: task.frequency,
    estimatedDays: task.estimatedDays
  }));

  // Generate KPIs based on strengths and weaknesses
  const kpis = [
    { 
      metric: 'Goal Achievement', 
      target: strengths.length > 0 ? `Leverage: ${strengths[0]?.trim()}` : 'Complete main objective'
    },
    { 
      metric: 'Challenge Management', 
      target: weaknesses.length > 0 ? `Address: ${weaknesses[0]?.trim()}` : 'Overcome obstacles'
    },
    { 
      metric: 'Opportunity Utilization', 
      target: opportunities.length > 0 ? `Maximize: ${opportunities[0]?.trim()}` : 'Seize advantages'
    }
  ];

  // Generate tips based on threats and SWOT
  const tips = [
    threats.length > 0 ? `Mitigate risk of: ${threats[0]?.trim() || 'obstacles'}` : 'Stay focused and committed',
    strengths.length > 0 ? `Build on your strength: ${strengths[0]?.trim() || 'positive qualities'}` : 'Stay consistent',
    `Break ${goal} into weekly milestones for better tracking`,
    opportunities.length > 0 ? `Take advantage of: ${opportunities[0]?.trim() || 'available resources'}` : 'Use available support',
    'Review progress weekly and adjust as needed'
  ].slice(0, 4); // Take first 4 tips

  const plan = {
    tasks,
    kpis,
    tips
  };

  console.log('✨ Mock plan generated successfully:', plan);
  return plan;
};