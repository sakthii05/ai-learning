import { SelectOption } from './types';

export const GENDER_OPTIONS: SelectOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  // { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export const PRIMARY_GOAL_OPTIONS: SelectOption[] = [
  { value: 'fat_loss', label: 'Fat Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'maintain', label: 'Maintain Current Weight' },
  { value: 'recomposition', label: 'Body Recomposition' },
  { value: 'strength', label: 'Build Strength' },
  { value: 'beginner_fitness', label: 'Beginner Fitness' },
];

export const EXPERIENCE_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'advanced', label: 'Advanced (3+ years)' },
];

export const ACTIVITY_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'sedentary', label: 'Sedentary (Desk job, minimal movement)' },
  { value: 'mixed', label: 'Mixed (Some walking, occasional activity)' },
  { value: 'active', label: 'Active (Physical job, regular movement)' },
];

export const WORKOUT_TIME_OPTIONS: SelectOption[] = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
  { value: '90', label: '90 minutes' },
  { value: '120', label: '120 minutes' },
];

export const INJURY_AREA_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'No Injuries' },
  { value: 'knee', label: 'Knee' },
  { value: 'back', label: 'Back' },
  { value: 'shoulder', label: 'Shoulder' },
  { value: 'neck', label: 'Neck' },
  { value: 'ankle', label: 'Ankle' },
  { value: 'wrist', label: 'Wrist' },
];

export const INJURY_SEVERITY_OPTIONS: SelectOption[] = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
];

export const MEDICAL_CONDITION_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'No Medical Conditions' },
  { value: 'bp', label: 'Blood Pressure (Hypertension)' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'thyroid', label: 'Thyroid Disorder' },
  { value: 'heart_condition', label: 'Heart Condition' }, 
  { value: 'asthma', label: 'Asthma / Breathing Issues' },
  { value: 'arthritis', label: 'Arthritis / Joint Issues' },
  { value: 'back_pain', label: 'Chronic Back Pain' },
  { value: 'digestive_issues', label: 'Digestive Issues (Acidity, IBS, etc.)' }
];

export const DIET_TYPE_OPTIONS: SelectOption[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'non_vegetarian', label: 'Non-Vegetarian' },
];

export const EQUIPMENT_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'No Equipment' },
  { value: 'home', label: 'Home Equipment (Dumbbells, Bands, etc.)' },
  { value: 'gym', label: 'Full Gym Access' },
];

export const HEIGHT_UNIT_OPTIONS: SelectOption[] = [
  { value: 'cm', label: 'cm' },
  { value: 'ft', label: 'ft' },
];

export const WEIGHT_UNIT_OPTIONS: SelectOption[] = [
  { value: 'kg', label: 'kg' },
  { value: 'lbs', label: 'lbs' },
];

// Utility functions
export const convertHeightToCm = (value: number, unit: string): number => {
  if (unit === 'ft') {
    return Math.round(value * 30.48);
  }
  return value;
};

export const convertWeightToKg = (value: number, unit: string): number => {
  if (unit === 'lbs') {
    return Math.round(value * 0.453592 * 10) / 10;
  }
  return value;
};

export const calculateBMI = (heightCm: number, weightKg: number): number => {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
};

export const getBMICategory = (bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' => {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

export const filterGoalsByBMIAndAge = (bmi: number, age: number): SelectOption[] => {
  let filteredGoals = [...PRIMARY_GOAL_OPTIONS];
  
  // If BMI < 18.5, remove fat_loss
  if (bmi < 18.5) {
    filteredGoals = filteredGoals.filter(g => g.value !== 'fat_loss');
  }
  
  // If age > 45, hide bodybuilding (we don't have bodybuilding, but we can hide advanced options)
  // Since there's no bodybuilding option, we'll interpret this as hiding muscle_gain for safety
  // Actually, looking at the requirements again, it says hide "bodybuilding" which isn't in our list
  // So we'll skip this rule or apply it to recomposition for older adults
  
  // If BMI > 30 (obese), prioritize fat_loss and remove maintain option
  if (bmi > 30) {
    // Remove maintain option - not recommended for obese users
    filteredGoals = filteredGoals.filter(g => g.value !== 'maintain');
    
    // Prioritize fat_loss (move it to top)
    const fatLoss = filteredGoals.find(g => g.value === 'fat_loss');
    if (fatLoss) {
      filteredGoals = filteredGoals.filter(g => g.value !== 'fat_loss');
      filteredGoals.unshift(fatLoss);
    }
  }
  
  return filteredGoals;
};
