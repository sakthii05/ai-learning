import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain alphabets'),
  
  dob: yup
    .string()
    .required('Date of birth is required')
    .test('age', 'Age must be between 16 and 65', (value) => {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 16 && age <= 65;
    }),
  
  age: yup.number().nullable(),
  
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'prefer_not_to_say'], 'Please select a valid gender'),
  
  heightValue: yup
    .number()
    .typeError('Height is required')
    .required('Height is required')
    .when('heightUnit', {
      is: 'cm',
      then: (schema) => schema.min(120, 'Minimum height is 120 cm').max(220, 'Maximum height is 220 cm'),
      otherwise: (schema) => schema.min(3.9, 'Minimum height is 3.9 ft').max(7.2, 'Maximum height is 7.2 ft'),
    }),
  
  heightUnit: yup.string().required().oneOf(['cm', 'ft']),
  
  weightValue: yup
    .number()
    .typeError('Weight is required')
    .required('Weight is required')
    .when('weightUnit', {
      is: 'kg',
      then: (schema) => schema.min(30, 'Minimum weight is 30 kg').max(200, 'Maximum weight is 200 kg'),
      otherwise: (schema) => schema.min(66, 'Minimum weight is 66 lbs').max(440, 'Maximum weight is 440 lbs'),
    }),
  
  weightUnit: yup.string().required().oneOf(['kg', 'lbs']),
  
  bmi: yup.number().nullable(),
  
  experienceLevel: yup
    .string()
    .required('Experience level is required')
    .oneOf(['beginner', 'intermediate', 'advanced'], 'Please select a valid experience level'),
  
  primaryGoal: yup
    .string()
    .required('Primary goal is required')
    .oneOf(
      ['fat_loss', 'muscle_gain', 'maintain', 'recomposition', 'strength', 'beginner_fitness'],
      'Please select a valid goal'
    ),
  
  activityLevel: yup
    .string()
    .required('Activity level is required')
    .oneOf(['sedentary', 'mixed', 'active'], 'Please select a valid activity level'),
  
  workoutTime: yup
    .number()
    .typeError('Workout time is required')
    .required('Workout time is required'),
  
  injuries: yup.array().of(yup.string()),
  
  injurySeverities: yup.object(),
  
  medicalConditions: yup.array().of(yup.string()),
  
  country: yup.string().required('Country is required'),
  
  state: yup.string().required('State is required'),
  
  dietType: yup
    .string()
    .required('Diet type is required')
    .oneOf(['vegetarian', 'non_vegetarian'], 'Please select a valid diet type'),
  
  equipment: yup
    .string()
    .required('Equipment availability is required')
    .oneOf(['none', 'home', 'gym'], 'Please select a valid option'),
});

export type ValidationSchema = yup.InferType<typeof validationSchema>;
