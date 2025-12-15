// utils/growthAnalyzer.js

/**
 * Analyzes how well a user is progressing on their plan
 * Returns: completion rate, whether they're on track, strengths, weaknesses, recommendations
 */

export const analyzeGrowth = (plan, completedTaskIds) => {
  if (!plan || !plan.tasks) {
    return {
      completionRate: 0,
      isOnTrack: false,
      strengths: [],
      weaknesses: [],
      recommendations: ['No plan found. Create one to get started!'],
      tasksCompleted: 0,
      totalTasks: 0
    };
  }

  const totalTasks = plan.tasks.length;
  const tasksCompleted = completedTaskIds ? completedTaskIds.length : 0;
  const completionRate = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

  // Determine if they're on track
  // After 1 week, should have at least 15% done
  // After 2 weeks, should have at least 30% done
  // After 4 weeks, should have at least 70% done
  const createdDate = plan.createdAt ? new Date(plan.createdAt) : new Date();
  const now = new Date();
  const daysElapsed = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

  let expectedProgress = 0;
  let isOnTrack = true;

  if (daysElapsed <= 7) {
    expectedProgress = 15;
  } else if (daysElapsed <= 14) {
    expectedProgress = 30;
  } else if (daysElapsed <= 28) {
    expectedProgress = 70;
  } else {
    expectedProgress = 90;
  }

  isOnTrack = completionRate >= expectedProgress * 0.9; // 90% of expected is okay

  const analysis = {
    completionRate: Math.round(completionRate),
    isOnTrack,
    tasksCompleted,
    totalTasks,
    daysElapsed,
    expectedProgress: Math.round(expectedProgress),
    strengths: [],
    weaknesses: [],
    recommendations: [],
    motivationLevel: 'neutral'
  };

  // === STRENGTHS ===
  if (completionRate >= 80) {
    analysis.strengths.push('🎯 Excellent progress! You\'re doing amazing!');
    analysis.motivationLevel = 'high';
  } else if (completionRate >= 60) {
    analysis.strengths.push('💪 Good momentum! Keep it up!');
    analysis.motivationLevel = 'good';
  } else if (completionRate >= 30) {
    analysis.strengths.push('👍 You\'re making progress!');
    analysis.motivationLevel = 'decent';
  }

  if (isOnTrack) {
    analysis.strengths.push('📈 You\'re right on schedule!');
  }

  if (completionRate === 0 && daysElapsed < 2) {
    analysis.strengths.push('🚀 Great! You just started. Let\'s get going!');
  }

  // === WEAKNESSES ===
  if (completionRate === 0 && daysElapsed >= 7) {
    analysis.weaknesses.push('⚠️ No tasks completed yet after ' + daysElapsed + ' days');
  }

  if (completionRate < 50 && daysElapsed >= 14) {
    analysis.weaknesses.push('📉 Progress is slower than expected');
  }

  if (!isOnTrack && completionRate > 0) {
    analysis.weaknesses.push(
      `🎯 You\'re at ${completionRate}% but should be at ~${analysis.expectedProgress}%`
    );
  }

  // === RECOMMENDATIONS ===
  if (completionRate === 0 && daysElapsed >= 3) {
    analysis.recommendations.push('Start with just 1 task today. Don\'t overthink it!');
    analysis.recommendations.push('Break larger tasks into smaller steps');
  } else if (completionRate < 30 && daysElapsed >= 7) {
    analysis.recommendations.push('Pick 1-2 tasks to focus on this week');
    analysis.recommendations.push('Check off tasks daily to build momentum');
    analysis.recommendations.push('Consider if the tasks are too difficult - adjust them');
  } else if (completionRate >= 30 && completionRate < 70) {
    analysis.recommendations.push('You\'re doing well! Maintain this pace');
    analysis.recommendations.push('Pick one weakness from your plan and address it');
    analysis.recommendations.push('Reward yourself for completed tasks!');
  } else if (completionRate >= 70) {
    analysis.recommendations.push('Fantastic progress! 🎉 You\'re almost there!');
    analysis.recommendations.push('Keep pushing to reach 100%');
    analysis.recommendations.push('After you complete this plan, consider a new goal!');
  }

  if (!isOnTrack && completionRate > 0) {
    analysis.recommendations.push('💡 Consider creating a new plan with better-scoped tasks');
  }

  // Add default if no recommendations
  if (analysis.recommendations.length === 0) {
    analysis.recommendations.push('Keep going! Small steps lead to big results.');
  }

  return analysis;
};

/**
 * Analyzes multiple plans and gives overall progress
 */
export const analyzeOverallGrowth = (plans) => {
  if (!plans || plans.length === 0) {
    return {
      totalPlans: 0,
      activePlans: 0,
      completedPlans: 0,
      overallCompletionRate: 0,
      allAnalysis: [],
      overallStatus: 'No plans yet'
    };
  }

  const allAnalysis = plans.map(plan => ({
    ...plan,
    analysis: analyzeGrowth(plan, plan.completedTasks || [])
  }));

  const activePlans = allAnalysis.filter(p => p.analysis.completionRate < 100).length;
  const completedPlans = allAnalysis.filter(p => p.analysis.completionRate === 100).length;
  
  const totalTasksCompleted = allAnalysis.reduce(
    (sum, p) => sum + p.analysis.tasksCompleted,
    0
  );
  const totalTasks = allAnalysis.reduce(
    (sum, p) => sum + p.analysis.totalTasks,
    0
  );

  const overallCompletionRate = totalTasks > 0 
    ? Math.round((totalTasksCompleted / totalTasks) * 100)
    : 0;

  let overallStatus = 'Getting started';
  if (overallCompletionRate >= 80) {
    overallStatus = 'Excellent progress!';
  } else if (overallCompletionRate >= 50) {
    overallStatus = 'Good momentum!';
  } else if (overallCompletionRate >= 20) {
    overallStatus = 'On your way!';
  }

  return {
    totalPlans: plans.length,
    activePlans,
    completedPlans,
    overallCompletionRate,
    totalTasksCompleted,
    totalTasks,
    allAnalysis,
    overallStatus
  };
};