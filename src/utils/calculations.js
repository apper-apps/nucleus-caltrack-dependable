// BMR calculation using Mifflin-St Jeor equation
export const calculateBMR = (weight, height, age, gender) => {
  const isMale = gender === 'male'
  
  if (isMale) {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

// TDEE calculation with activity level
export const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  }
  
  return bmr * (activityMultipliers[activityLevel] || 1.2)
}

// BMI calculation
export const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100
  return weight / (heightInMeters * heightInMeters)
}

// Calorie goal based on target
export const calculateCalorieGoal = (tdee, goal) => {
  switch (goal) {
    case 'weight_loss':
      return tdee - 500 // 500 calorie deficit
    case 'weight_gain':
      return tdee + 500 // 500 calorie surplus
    case 'weight_maintenance':
    default:
      return tdee
  }
}

// Exercise calories burned using MET values
export const calculateExerciseCalories = (activity, intensity, duration, weight) => {
  const metValues = {
    running: { light: 6, moderate: 8, vigorous: 11 },
    walking: { light: 3, moderate: 4, vigorous: 5 },
    cycling: { light: 4, moderate: 6, vigorous: 8 },
    swimming: { light: 4, moderate: 6, vigorous: 8 },
    weight_training: { light: 3, moderate: 4, vigorous: 6 },
    yoga: { light: 2, moderate: 3, vigorous: 4 },
    dancing: { light: 3, moderate: 4, vigorous: 5 },
    basketball: { light: 4, moderate: 6, vigorous: 8 },
    tennis: { light: 4, moderate: 5, vigorous: 7 },
    soccer: { light: 5, moderate: 7, vigorous: 9 }
  }
  
  const met = metValues[activity]?.[intensity] || 4
  const durationHours = duration / 60
  const calories = met * weight * durationHours
  
  return Math.round(calories)
}

// Format numbers for display
export const formatNumber = (num, decimals = 0) => {
  return Number(num).toFixed(decimals)
}

// Get BMI category
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

// Calculate macronutrient percentages
export const calculateMacroPercentages = (protein, carbs, fat) => {
  const totalCalories = (protein * 4) + (carbs * 4) + (fat * 9)
  
  if (totalCalories === 0) return { protein: 0, carbs: 0, fat: 0 }
  
  return {
    protein: Math.round((protein * 4 / totalCalories) * 100),
    carbs: Math.round((carbs * 4 / totalCalories) * 100),
    fat: Math.round((fat * 9 / totalCalories) * 100)
  }
}