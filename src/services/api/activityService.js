import { foodService } from "./foodService";
import { exerciseService } from "./exerciseService";

export const activityService = {
  async getRecentActivities(limit = 10) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    try {
      const activities = []
      
      // Get recent food entries
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      const todayFood = await foodService.getFoodEntriesByDate(today)
      const yesterdayFood = await foodService.getFoodEntriesByDate(yesterday)
      const todayExercise = await exerciseService.getExerciseEntriesByDate(today)
      const yesterdayExercise = await exerciseService.getExerciseEntriesByDate(yesterday)
      
// Add food activities
      const allFoodEntries = [...todayFood, ...yesterdayFood];
      allFoodEntries.forEach(entry => {
        activities.push({
          Id: `food_${entry.Id}`,
          type: 'food',
          description: `Logged ${entry.foodName} (${entry.meal})`,
          date: entry.date,
          calories: entry.calories
        })
      })
      
// Add exercise activities
      const allExerciseEntries = [...todayExercise, ...yesterdayExercise];
      allExerciseEntries.forEach(entry => {
        activities.push({
          Id: `exercise_${entry.Id}`,
          type: 'exercise',
          description: `${entry.activity.replace('_', ' ')} for ${entry.duration} minutes`,
          date: entry.date,
          calories: entry.caloriesBurned
        })
      })
      
      // Sort by date (newest first) and limit
      const sorted = activities
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit)
      
      return sorted
    } catch (error) {
      console.error('Activity service error:', error)
      // Return mock data if there's an error
      return [
        {
          Id: 1,
          type: 'food',
          description: 'Logged Chicken Breast (lunch)',
          date: new Date().toISOString(),
          calories: 250
        },
        {
          Id: 2,
          type: 'exercise',
          description: 'Running for 30 minutes',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          calories: 300
        }
      ]
    }
  }
}