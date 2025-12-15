// geminiHelper.js - Google Gemini API with Mock Fallback
import { generateMockPlan } from './mockPlanGenerator';

const GEMINI_API_KEY = 'AIzaSyANPDdc6RjlInoRuoW4kFj9AHEE7ElFYHc';
const USE_MOCK_FALLBACK = true; // Set to false to only use Gemini

export const generatePlan = async (swotData, goal, category) => {
  try {
    console.log('🤖 Attempting to generate plan with Gemini API...');
    
    // Create the prompt using FIRESTORE DATA
    const prompt = `Create a personalized action plan based on this user data:

GOAL: ${goal}
CATEGORY: ${category}

SWOT ANALYSIS (from Firestore):
- STRENGTHS: ${swotData.strengths}
- WEAKNESSES: ${swotData.weaknesses}
- OPPORTUNITIES: ${swotData.opportunities}
- THREATS: ${swotData.threats}

Generate a JSON action plan:
{
  "tasks": [
    {"id": 1, "title": "Task 1", "description": "Do this", "frequency": "daily", "estimatedDays": 30},
    {"id": 2, "title": "Task 2", "description": "Do this", "frequency": "weekly", "estimatedDays": 60},
    {"id": 3, "title": "Task 3", "description": "Do this", "frequency": "weekly", "estimatedDays": 60}
  ],
  "kpis": [
    {"metric": "Metric 1", "target": "Target 1"},
    {"metric": "Metric 2", "target": "Target 2"}
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Return ONLY the JSON, nothing else.`;

    console.log('📤 Sending to Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
        })
      }
    );

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Gemini API Error:', errorData);
      throw new Error(`Gemini Error: ${errorData.error?.message || 'API call failed'}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini');
    }

    const content = data.candidates[0].content.parts[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Could not parse Gemini response');
    }

    const planData = JSON.parse(jsonMatch[0]);

    // Validate response
    if (!planData.tasks || !planData.kpis || !planData.tips) {
      throw new Error('Response missing required fields');
    }

    const finalPlan = {
      tasks: (planData.tasks || []).map((task, idx) => ({
        id: task.id || idx + 1,
        title: task.title || `Task ${idx + 1}`,
        description: task.description || 'Complete this task',
        frequency: task.frequency || 'daily',
        estimatedDays: task.estimatedDays || 30
      })),
      kpis: (planData.kpis || []).map(kpi => ({
        metric: kpi.metric || 'Progress',
        target: kpi.target || 'Achieve goal'
      })),
      tips: (planData.tips || []).map(tip => typeof tip === 'string' ? tip : 'Stay consistent')
    };

    console.log('✨ Plan generated with Gemini API');
    return finalPlan;

  } catch (error) {
    console.error('💥 Gemini API failed:', error.message);

    // Fallback to mock generator if enabled
    if (USE_MOCK_FALLBACK) {
      console.log('🎯 Falling back to local plan generator...');
      try {
        const mockPlan = generateMockPlan(swotData, goal, category);
        console.log('✅ Using locally generated plan');
        return mockPlan;
      } catch (mockError) {
        console.error('😞 Mock generator also failed:', mockError);
        throw new Error('Failed to generate plan: ' + error.message);
      }
    }

    throw new Error('Failed to generate plan: ' + error.message);
  }
};