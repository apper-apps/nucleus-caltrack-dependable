const EXERCISE_ENTRIES_KEY = 'caltrack_exercise_entries'

export const exerciseService = {
  async logExercise(exerciseEntry) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const entries = this.getStoredEntries()
    const newEntry = {
      ...exerciseEntry,
      Id: this.getNextId(entries),
      date: new Date().toISOString()
    }
    
    entries.push(newEntry)
    localStorage.setItem(EXERCISE_ENTRIES_KEY, JSON.stringify(entries))
    return newEntry
  },
  
  async getExerciseEntriesByDate(date) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const entries = this.getStoredEntries()
    return entries.filter(entry => entry.date.startsWith(date))
  },
  
  async deleteEntry(entryId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const entries = this.getStoredEntries()
    const filtered = entries.filter(entry => entry.Id !== entryId)
    localStorage.setItem(EXERCISE_ENTRIES_KEY, JSON.stringify(filtered))
    return true
  },
  
  getStoredEntries() {
    const stored = localStorage.getItem(EXERCISE_ENTRIES_KEY)
    return stored ? JSON.parse(stored) : []
  },
  
  getNextId(entries) {
    const maxId = entries.reduce((max, entry) => Math.max(max, entry.Id || 0), 0)
    return maxId + 1
  }
}