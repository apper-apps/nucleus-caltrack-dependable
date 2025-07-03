const NOTIFICATION_KEY = 'caltrack_notifications'

export const notificationService = {
  async getNotificationPreferences() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const stored = localStorage.getItem(NOTIFICATION_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Return default notification preferences
    return {
      goalReminders: true,
      progressUpdates: false,
      dailyReminders: true,
      weeklyReports: true,
      achievementNotifications: true,
      mealReminders: false
    }
  },
  
  async updateNotificationPreferences(preferences) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(preferences))
    return preferences
  }
}