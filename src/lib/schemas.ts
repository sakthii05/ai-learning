import { z } from "zod";

export const TextSummarizationSchema = z.object({
  title: z.string().describe("The title of the summary"),
  summary: z.string().describe("The summary of the text 2-3 sentences"),
  keyPoints: z.array(z.string()).describe("The key points of the text"),
});

//fitness schema
export const MacroSchema = z.object({
  protein_g: z.number().min(0),
  carbs_g: z.number().min(0),
  fat_g: z.number().min(0),
});

export const DietItemQuantitySchema = z.object({
  item: z
    .string()
    .describe("Name of the food item (e.g., oats, milk, almonds)"),

  amount: z
    .string()
    .describe(
      "Exact quantity with unit (e.g., 100g, 250ml, 5 pieces, 1 tbsp). Must be precise."
    ),
});

export const DietOptionSchema = z.object({
  label: z
    .string()
    .describe(
      "Title of the food option. Short, clear, no quantities. Example: 'Oatmeal with fruits and nuts'"
    ),
  quantity: z
    .array(DietItemQuantitySchema)
    .min(1)
    .describe(
      "Structured list of ingredients with exact quantities. This is the ONLY place where precise measurements should appear."
    ),

  calories: z.number(),
  macros: MacroSchema,
  //editable: z.literal(true),
 description: z
    .string()
    .describe(
      "A short, friendly explanation of the dish and simple preparation tips. "
      + "Do NOT provide full recipes or step-by-step cooking instructions. "
      + "Do NOT repeat exact quantities listed in the quantity field. "
      + "You MAY mention high-level quantity references (e.g., 'a cup of milk', 'a handful of nuts') "
      + "and tips like soaking, boiling, or mixing."
    ),
});

export const MealSchema = z.object({
  options: z.array(DietOptionSchema).min(4).max(5),
});

export const DietPlanSchema = z.object({
  calories_per_day: z.number(),
  macros: MacroSchema,
  meals: z.object({
    breakfast: MealSchema,
    lunch: MealSchema,
    snack: MealSchema,
    dinner: MealSchema,
  }),
});

export const ExerciseSchema = z.object({
  name: z.string(),
  sets: z.number().optional(),
  reps: z.number().optional(),
  alternatives: z.array(z.string()).min(1).max(2),
  //editable: z.boolean(),
});

export const WorkoutDaySchema = z.object({
  day: z.string(),
  type: z.enum(["strength", "light", "rest"]),
  focus: z.string(),
  duration_min: z.number(),
  exercises: z.array(ExerciseSchema),
});

export const FitnessPlanSchema = z.object({
  plan_metadata: z.object({
    plan_type: z.literal("initial_plan"),
    goal: z.string(),
    duration_weeks: z.literal(2),
    // user_editable_sections: z.array(z.string()),
    advise: z.string().describe('Advise to user, after reading user health info and fitness goals in 1-3 lines max')
  }),

  calculations: z.object({
    bmr: z.number(),
    tdee: z.number(),
    target_calories: z.number(),
    strategy: z.enum(["deficit", "maintenance", "surplus"]),
  }),

  training_structure: z.object({
    days_per_week: z.literal(7),
    rest_days: z.number().describe('weekly_schedule.length - strength_days - light_activity_days'),
    light_activity_days: z.number().describe('weekly_schedule.length - strength_days - rest_days'),
    strength_days: z.number().describe('weekly_schedule.length - rest_days - light_activity_days'),
    reason: z.string().describe('reason for training structure'),
  }),

  diet_plan: DietPlanSchema,

  workout_plan: z.object({
    weekly_schedule: z.array(WorkoutDaySchema).min(7).max(7),
    injury_considerations: z.array(z.string()),
    allow_exercise_replacement: z.literal(true),
  }),

  safety_notes: z.object({
    medical_conditions_considered: z.array(z.string()),
    high_impact_exercises_removed: z.boolean(),
  }),

  explanations: z.object({
    diet: z.string().describe('explanation for diet plan you have given and why'),
    workout: z.string().describe('explanation for workout plan you have given and why'),
  }),
});

export type FitnessPlantype = z.infer<typeof FitnessPlanSchema>;
