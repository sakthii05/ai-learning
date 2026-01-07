// Types for Fitness Onboarding Form

export type Gender = 'male' | 'female';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type PrimaryGoal = 'fat_loss' | 'muscle_gain' | 'maintain' | 'recomposition' | 'strength' | 'beginner_fitness';
export type ActivityLevel = 'sedentary' | 'mixed' | 'active';
export type InjuryArea = 'knee' | 'back' | 'shoulder' | 'neck' | 'ankle' | 'wrist' | 'none';
export type InjurySeverity = 'mild' | 'moderate' | 'severe';
export type MedicalCondition = 'none' | 'bp' | 'diabetes' | 'thyroid' | 'heart_condition';
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';
export type DietType = 'vegetarian' | 'non_vegetarian';
export type Equipment = 'none' | 'home' | 'gym';
export type HeightUnit = 'cm' | 'ft';
export type WeightUnit = 'kg' | 'lbs';

export interface Injury {
  area: Exclude<InjuryArea, 'none'>;
  severity: InjurySeverity;
}

export interface FormData {
  name: string;
  dob: string; // ISO date string
  age: number | undefined;
  gender: Gender | '';
  heightValue: number | undefined;
  heightUnit: 'cm' | 'ft';
  weightValue: number | undefined;
  weightUnit: 'kg' | 'lbs';
  bmi: number | undefined;
  experienceLevel: ExperienceLevel | '';
  primaryGoal: PrimaryGoal | '';
  activityLevel: ActivityLevel | '';
  workoutTime: number | undefined;
  injuries: InjuryArea[];
  injurySeverities: Record<string, InjurySeverity>;
  medicalConditions: MedicalCondition[];
  country: string;
  countrySpecificDiet: boolean;
  preferencesDescription:string
  state: string;
  dietType: DietType | '';
  equipment: Equipment | '';
}

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height_cm: number;
  weight_kg: number;
  bmi: number;
  bmi_category: BMICategory;
  experience_level: ExperienceLevel;
  primary_goal: PrimaryGoal;
  activity_level: ActivityLevel;
  workout_time_min: number;
  injuries: Injury[];
  medical_conditions: MedicalCondition[];
  location: {
    country: string;
    state: string;
  };
}

export interface Constraints {
  max_calorie_deficit_percent: number;
  avoid_high_impact: boolean;
  diet_should_be_local: boolean;
}

export interface Preferences {
  diet_type: DietType;
  equipment_available: Equipment;
  user_preferance_description:string
}

export interface FinalOutput {
  user_profile: UserProfile;
  constraints: Constraints;
  preferences: Preferences;
}

export interface SelectOption {
  value: string;
  label: string;
}
