'use client';

import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import FitnessPlanPDF from './FitnessPlanPDF';
import {
    Accordion,
    AccordionItem,
    Chip,
    Button,
    addToast,
    ToastProvider,
    Textarea,
    Card,
    CardBody,
    CardFooter,
} from '@heroui/react';
import {
    IoFitnessOutline,
    IoFlameOutline,
    IoNutritionOutline,
    IoTimeOutline,
    IoCalendarOutline,
    IoWarningOutline,
    IoRestaurantOutline,
    IoBarbellOutline,
    IoHeartOutline,
    IoSpeedometerOutline,
    IoSunnyOutline,
    IoBedOutline,
    IoLeafOutline,
    IoTrendingUpOutline,
    IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { FitnessPlantype } from '@/lib/schemas';
import { HiOutlineDownload } from "react-icons/hi";
import { MdAdd } from "react-icons/md";


type UserReview = {
    diet_plan: {
        over_all_meal: string,
    },
    workout_plan: {
        over_all_exercise: string,
    }
}

interface ViewPlanProps {
    data: FitnessPlantype;
    userName: string;
    onGeneratePlan: (review: UserReview) => void
    loading: boolean
    reviews: UserReview
    hasAnyReview: boolean
    selectedReviewBox: string | null,
    onSelectReviewBox: (value: string | null) => void
    onReviewSubmit: (category: string, itemKey: string, text: string) => void
}

const ViewPlan = (props: ViewPlanProps) => {
    const { data, userName, onGeneratePlan, loading, reviews, hasAnyReview, selectedReviewBox, onSelectReviewBox, onReviewSubmit } = props;
    const [downloading, setDownloading] = useState(false);
    console.log(data)
    const FloatingReviewBox = ({ category, itemKey, onClose, initialValue, placeholder }: {
        category: string,
        itemKey: string,
        onClose: () => void,
        initialValue: string,
        placeholder: string
    }) => {
        const [text, setText] = useState(initialValue);
        const [error, setError] = useState("");

        const validate = () => {
            if (text.length > 0 && text.length < 10) {
                setError("Minimum 10 characters required");
                return false;
            }
            if (text.length > 350) {
                setError("Maximum 350 characters allowed");
                return false;
            }
            setError("");
            return true;
        };

        return (
            <Card className="absolute z-[100] w-72 shadow-2xl border border-emerald-500/20 -translate-y-[calc(100%+8px)] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0">
                <CardBody className="p-3">
                    <Textarea
                        label={"Add Comment"}
                        placeholder={placeholder}
                        value={text}
                        onValueChange={(val) => {
                            setText(val);
                            if (error) setError("");
                        }}
                        maxLength={350}
                        errorMessage={error}
                        isInvalid={!!error}
                        classNames={{
                            label: "text-xs font-semibold text-emerald-700",
                            input: "text-sm"
                        }}
                    />
                </CardBody>
                <CardFooter className="flex justify-end gap-2 p-2 pt-0">
                    <Button size="sm" variant="light" color="danger" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        color="primary"
                        className="bg-emerald-700 text-white hover:bg-emerald-800"
                        onPress={() => {
                            if (validate()) {
                                onReviewSubmit(category, itemKey, text);
                            }
                        }}
                    >
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        );
    };
    // const data1 = {
    //     "plan_metadata": {
    //         "plan_type": "initial_plan",
    //         "goal": "muscle_gain",
    //         "duration_weeks": 2,
    //         "advise": "Start with lighter weights and progress gradually, ensure proper warm-up and cool-down routines."
    //     },
    //     "calculations": {
    //         "bmr": 1984.6,
    //         "tdee": 2465.68,
    //         "target_calories": 2800,
    //         "strategy": "surplus"
    //     },
    //     "training_structure": {
    //         "days_per_week": 4,
    //         "rest_days": 2,
    //         "light_activity_days": 1,
    //         "reason": "To allow for muscle recovery and growth, considering the user's sedentary activity level and beginner experience."
    //     },
    //     "diet_plan": {
    //         "calories_per_day": 2800,
    //         "macros": {
    //             "protein_g": 170,
    //             "carbs_g": 250,
    //             "fat_g": 100
    //         },
    //         "meals": {
    //             "breakfast": {
    //                 "options": [
    //                     {
    //                         "label": "Option 1",
    //                         "quantity": [
    //                             {
    //                                 "item": "idlis",
    //                                 "amount": "4 pieces"
    //                             }
    //                         ],
    //                         "calories": 300,
    //                         "macros": {
    //                             "protein_g": 10,
    //                             "carbs_g": 60,
    //                             "fat_g": 5
    //                         },
    //                         "description": "Steamed idlis with coconut chutney"
    //                     },
    //                     {
    //                         "label": "Option 2",
    //                         "quantity": [
    //                             {
    //                                 "item": "oatmeal",
    //                                 "amount": "1 bowl"
    //                             }
    //                         ],
    //                         "calories": 350,
    //                         "macros": {
    //                             "protein_g": 15,
    //                             "carbs_g": 60,
    //                             "fat_g": 10
    //                         },
    //                         "description": "Oatmeal with milk, banana, and honey"
    //                     },
    //                     {
    //                         "label": "Option 3",
    //                         "quantity": [
    //                             {
    //                                 "item": "paratha",
    //                                 "amount": "2 pieces"
    //                             }
    //                         ],
    //                         "calories": 320,
    //                         "macros": {
    //                             "protein_g": 10,
    //                             "carbs_g": 50,
    //                             "fat_g": 10
    //                         },
    //                         "description": "Whole wheat paratha with scrambled eggs"
    //                     },
    //                     {
    //                         "label": "Option 4",
    //                         "quantity": [
    //                             {
    //                                 "item": "upma",
    //                                 "amount": "1 bowl"
    //                             }
    //                         ],
    //                         "calories": 300,
    //                         "macros": {
    //                             "protein_g": 10,
    //                             "carbs_g": 50,
    //                             "fat_g": 10
    //                         },
    //                         "description": "Vegetable upma with whole wheat rava"
    //                     },
    //                     {
    //                         "label": "Option 5",
    //                         "quantity": [
    //                             {
    //                                 "item": "dosa",
    //                                 "amount": "2 pieces"
    //                             }
    //                         ],
    //                         "calories": 250,
    //                         "macros": {
    //                             "protein_g": 10,
    //                             "carbs_g": 40,
    //                             "fat_g": 5
    //                         },
    //                         "description": "Rice and lentil dosa with sambar"
    //                     }
    //                 ]
    //             },
    //             "lunch": {
    //                 "options": [
    //                     {
    //                         "label": "Option 1",
    //                         "quantity": [
    //                             {
    //                                 "item": "chicken biryani",
    //                                 "amount": "1 plate"
    //                             }
    //                         ],
    //                         "calories": 500,
    //                         "macros": {
    //                             "protein_g": 40,
    //                             "carbs_g": 60,
    //                             "fat_g": 20
    //                         },
    //                         "description": "Chicken biryani with raita"
    //                     },
    //                     {
    //                         "label": "Option 2",
    //                         "quantity": [
    //                             {
    //                                 "item": "brown rice",
    //                                 "amount": "1 cup"
    //                             },
    //                             {
    //                                 "item": "mixed vegetables",
    //                                 "amount": "1 cup"
    //                             }
    //                         ],
    //                         "calories": 400,
    //                         "macros": {
    //                             "protein_g": 15,
    //                             "carbs_g": 60,
    //                             "fat_g": 10
    //                         },
    //                         "description": "Brown rice with mixed vegetables and a small bowl of dal"
    //                     },
    //                     {
    //                         "label": "Option 3",
    //                         "quantity": [
    //                             {
    //                                 "item": "whole wheat roti",
    //                                 "amount": "2 pieces"
    //                             },
    //                             {
    //                                 "item": "chicken curry",
    //                                 "amount": "1 cup"
    //                             }
    //                         ],
    //                         "calories": 450,
    //                         "macros": {
    //                             "protein_g": 35,
    //                             "carbs_g": 40,
    //                             "fat_g": 20
    //                         },
    //                         "description": "Whole wheat roti with chicken curry"
    //                     },
    //                     {
    //                         "label": "Option 4",
    //                         "quantity": [
    //                             {
    //                                 "item": "quinoa",
    //                                 "amount": "1 cup"
    //                             },
    //                             {
    //                                 "item": "mixed vegetables",
    //                                 "amount": "1 cup"
    //                             }
    //                         ],
    //                         "calories": 400,
    //                         "macros": {
    //                             "protein_g": 15,
    //                             "carbs_g": 60,
    //                             "fat_g": 10
    //                         },
    //                         "description": "Quinoa with mixed vegetables and a small bowl of dal"
    //                     },
    //                     {
    //                         "label": "Option 5",
    //                         "quantity": [
    //                             {
    //                                 "item": "fish fry",
    //                                 "amount": "1 piece"
    //                             },
    //                             {
    //                                 "item": "brown rice",
    //                                 "amount": "1 cup"
    //                             }
    //                         ],
    //                         "calories": 400,
    //                         "macros": {
    //                             "protein_g": 35,
    //                             "carbs_g": 40,
    //                             "fat_g": 20
    //                         },
    //                         "description": "Grilled fish with brown rice"
    //                     }
    //                 ]
    //             },
    //             "snack": {
    //                 "options": [
    //                     {
    //                         "label": "Option 1",
    //                         "quantity": [
    //                             {
    //                                 "item": "fruits",
    //                                 "amount": "1 plate"
    //                             }
    //                         ],
    //                         "calories": 100,
    //                         "macros": {
    //                             "protein_g": 2,
    //                             "carbs_g": 20,
    //                             "fat_g": 0
    //                         },
    //                         "description": "Fresh fruits"
    //                     },
    //                     {
    //                         "label": "Option 2",
    //                         "quantity": [
    //                             {
    //                                 "item": "nuts",
    //                                 "amount": "1 handful"
    //                             }
    //                         ],
    //                         "calories": 150,
    //                         "macros": {
    //                             "protein_g": 5,
    //                             "carbs_g": 10,
    //                             "fat_g": 10
    //                         },
    //                         "description": "Mixed nuts"
    //                     },
    //                     {
    //                         "label": "Option 3",
    //                         "quantity": [
    //                             {
    //                                 "item": "yogurt",
    //                                 "amount": "1 cup"
    //                             }
    //                         ],
    //                         "calories": 100,
    //                         "macros": {
    //                             "protein_g": 10,
    //                             "carbs_g": 10,
    //                             "fat_g": 0
    //                         },
    //                         "description": "Plain yogurt"
    //                     },
    //                     {
    //                         "label": "Option 4",
    //                         "quantity": [
    //                             {
    //                                 "item": "energy bar",
    //                                 "amount": "1 piece"
    //                             }
    //                         ],
    //                         "calories": 150,
    //                         "macros": {
    //                             "protein_g": 10,
    //                             "carbs_g": 20,
    //                             "fat_g": 5
    //                         },
    //                         "description": "Energy bar"
    //                     },
    //                     {
    //                         "label": "Option 5",
    //                         "quantity": [
    //                             {
    //                                 "item": "smoothie",
    //                                 "amount": "1 glass"
    //                             }
    //                         ],
    //                         "calories": 150,
    //                         "macros": {
    //                             "protein_g": 10,
    //                             "carbs_g": 20,
    //                             "fat_g": 5
    //                         },
    //                         "description": "Fruit smoothie"
    //                     }
    //                 ]
    //             },
    //             "dinner": {
    //                 "options": [
    //                     {
    //                         "label": "Option 1",
    //                         "quantity": [
    //                             {
    //                                 "item": "chicken curry",
    //                                 "amount": "1 cup"
    //                             },
    //                             {
    //                                 "item": "brown rice",
    //                                 "amount": "1 cup"
    //                             }
    //                         ],
    //                         "calories": 500,
    //                         "macros": {
    //                             "protein_g": 40,
    //                             "carbs_g": 60,
    //                             "fat_g": 20
    //                         },
    //                         "description": "Chicken curry with brown rice"
    //                     },
    //                     {
    //                         "label": "Option 2",
    //                         "quantity": [
    //                             {
    //                                 "item": "mixed vegetables",
    //                                 "amount": "1 cup"
    //                             },
    //                             {
    //                                 "item": "whole wheat roti",
    //                                 "amount": "2 pieces"
    //                             }
    //                         ],
    //                         "calories": 400,
    //                         "macros": {
    //                             "protein_g": 15,
    //                             "carbs_g": 40,
    //                             "fat_g": 10
    //                         },
    //                         "description": "Mixed vegetables with whole wheat roti"
    //                     },
    //                     {
    //                         "label": "Option 3",
    //                         "quantity": [
    //                             {
    //                                 "item": "fish fry",
    //                                 "amount": "1 piece"
    //                             },
    //                             {
    //                                 "item": "quinoa",
    //                                 "amount": "1 cup"
    //                             }
    //                         ],
    //                         "calories": 450,
    //                         "macros": {
    //                             "protein_g": 35,
    //                             "carbs_g": 40,
    //                             "fat_g": 20
    //                         },
    //                         "description": "Grilled fish with quinoa"
    //                     },
    //                     {
    //                         "label": "Option 4",
    //                         "quantity": [
    //                             {
    //                                 "item": "lentil soup",
    //                                 "amount": "1 bowl"
    //                             },
    //                             {
    //                                 "item": "whole wheat bread",
    //                                 "amount": "2 slices"
    //                             }
    //                         ],
    //                         "calories": 400,
    //                         "macros": {
    //                             "protein_g": 20,
    //                             "carbs_g": 60,
    //                             "fat_g": 10
    //                         },
    //                         "description": "Lentil soup with whole wheat bread"
    //                     },
    //                     {
    //                         "label": "Option 5",
    //                         "quantity": [
    //                             {
    //                                 "item": "grilled chicken",
    //                                 "amount": "1 piece"
    //                             },
    //                             {
    //                                 "item": "mixed vegetables",
    //                                 "amount": "1 cup"
    //                             }
    //                         ],
    //                         "calories": 350,
    //                         "macros": {
    //                             "protein_g": 35,
    //                             "carbs_g": 10,
    //                             "fat_g": 10
    //                         },
    //                         "description": "Grilled chicken with mixed vegetables"
    //                     }
    //                 ]
    //             }
    //         }
    //     },
    //     "workout_plan": {
    //         "weekly_schedule": [
    //             {
    //                 "day": "Monday",
    //                 "type": "strength",
    //                 "focus": "Chest and Triceps",
    //                 "duration_min": 45,
    //                 "exercises": [
    //                     {
    //                         "name": "Bench Press",
    //                         "sets": 3,
    //                         "reps": 8,
    //                         "alternatives": [
    //                             "Dumbbell Press",
    //                             "Incline Press"
    //                         ]
    //                     },
    //                     {
    //                         "name": "Tricep Pushdown",
    //                         "sets": 3,
    //                         "reps": 12,
    //                         "alternatives": [
    //                             "Overhead Dumbbell Extension",
    //                             "Skull Crusher"
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 "day": "Tuesday",
    //                 "type": "light",
    //                 "focus": "Yoga and Stretching",
    //                 "duration_min": 30,
    //                 "exercises": [
    //                     {
    //                         "name": "Downward-Facing Dog",
    //                         "sets": 3,
    //                         "reps": 10,
    //                         "alternatives": [
    //                             "Child's Pose",
    //                             "Cat-Cow Stretch"
    //                         ]
    //                     },
    //                     {
    //                         "name": "Warrior Pose",
    //                         "sets": 3,
    //                         "reps": 10,
    //                         "alternatives": [
    //                             "Triangle Pose",
    //                             "Seated Forward Fold"
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 "day": "Wednesday",
    //                 "type": "rest",
    //                 "focus": "Rest and Recovery",
    //                 "duration_min": 0,
    //                 "exercises": []
    //             },
    //             {
    //                 "day": "Thursday",
    //                 "type": "strength",
    //                 "focus": "Back and Biceps",
    //                 "duration_min": 45,
    //                 "exercises": [
    //                     {
    //                         "name": "Pull-ups",
    //                         "sets": 3,
    //                         "reps": 8,
    //                         "alternatives": [
    //                             "Lat Pulldowns",
    //                             "Rows"
    //                         ]
    //                     },
    //                     {
    //                         "name": "Dumbbell Bicep Curls",
    //                         "sets": 3,
    //                         "reps": 12,
    //                         "alternatives": [
    //                             "Hammer Curls",
    //                             "Preacher Curls"
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 "day": "Friday",
    //                 "type": "light",
    //                 "focus": "Cardio and Conditioning",
    //                 "duration_min": 30,
    //                 "exercises": [
    //                     {
    //                         "name": "Jogging",
    //                         "sets": 3,
    //                         "reps": 10,
    //                         "alternatives": [
    //                             "Cycling",
    //                             "Swimming"
    //                         ]
    //                     },
    //                     {
    //                         "name": "Burpees",
    //                         "sets": 3,
    //                         "reps": 10,
    //                         "alternatives": [
    //                             "Jumping Jacks",
    //                             "Mountain Climbers"
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 "day": "Saturday",
    //                 "type": "strength",
    //                 "focus": "Legs and Shoulders",
    //                 "duration_min": 45,
    //                 "exercises": [
    //                     {
    //                         "name": "Squats",
    //                         "sets": 3,
    //                         "reps": 8,
    //                         "alternatives": [
    //                             "Leg Press",
    //                             "Lunges"
    //                         ]
    //                     },
    //                     {
    //                         "name": "Standing Military Press",
    //                         "sets": 3,
    //                         "reps": 8,
    //                         "alternatives": [
    //                             "Seated Dumbbell Shoulder Press",
    //                             "Lateral Raises"
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 "day": "Sunday",
    //                 "type": "rest",
    //                 "focus": "Rest and Recovery",
    //                 "duration_min": 0,
    //                 "exercises": []
    //             }
    //         ],
    //         "injury_considerations": [],
    //         "allow_exercise_replacement": true
    //     },
    //     "safety_notes": {
    //         "medical_conditions_considered": [
    //             "none"
    //         ],
    //         "high_impact_exercises_removed": true
    //     },
    //     "explanations": {
    //         "diet": "The diet plan is designed to provide a caloric surplus to support muscle gain, with a balance of protein, carbohydrates, and healthy fats. The meal options are tailored to the user's preferences and location, with a focus on whole, unprocessed foods.",
    //         "workout": "The workout plan is designed to provide a balanced and progressive routine, with a focus on strength training and cardio. The exercises are chosen to work multiple muscle groups at once, and the sets and reps are tailored to the user's experience level and goals."
    //     }
    // }

    const {
        plan_metadata,
        calculations,
        training_structure,
        diet_plan,
        workout_plan,
        safety_notes,
        explanations,
    } = data;

    // Calculate macro percentages
    const totalMacros = diet_plan.macros.protein_g + diet_plan.macros.carbs_g + diet_plan.macros.fat_g;
    const proteinPercent = Math.round((diet_plan.macros.protein_g / totalMacros) * 100);
    const carbsPercent = Math.round((diet_plan.macros.carbs_g / totalMacros) * 100);
    const fatPercent = Math.round((diet_plan.macros.fat_g / totalMacros) * 100);

    // Strategy config
    const strategyConfig: Record<string, { color: string; bgColor: string; label: string }> = {
        deficit: { color: 'text-amber-600', bgColor: 'bg-amber-500/10', label: 'Calorie Deficit' },
        maintenance: { color: 'text-slate-600', bgColor: 'bg-slate-500/10', label: 'Maintenance' },
        surplus: { color: 'text-emerald-600', bgColor: 'bg-emerald-500/10', label: 'Calorie Surplus' },
    };

    // Workout type config
    const workoutTypeConfig: Record<string, { gradient: string; icon: React.ReactNode; bgIcon: string }> = {
        strength: {
            gradient: 'from-emerald-600/20 to-amber-500/10',
            icon: <IoBarbellOutline className="text-emerald-600" />,
            bgIcon: 'bg-emerald-600/10'
        },
        light: {
            gradient: 'from-teal-500/20 to-emerald-500/10',
            icon: <IoLeafOutline className="text-teal-600" />,
            bgIcon: 'bg-teal-500/10'
        },
        rest: {
            gradient: 'from-stone-400/20 to-slate-400/10',
            icon: <IoBedOutline className="text-stone-500" />,
            bgIcon: 'bg-stone-400/10'
        },
    };

    // Meal config
    const mealConfig: Record<string, { icon: React.ReactNode; gradient: string; time: string }> = {
        breakfast: {
            icon: <IoSunnyOutline className="text-amber-600" />,
            gradient: 'from-amber-500/20 to-yellow-500/10',
            time: '7:00 - 9:00 AM'
        },
        lunch: {
            icon: <IoRestaurantOutline className="text-emerald-600" />,
            gradient: 'from-emerald-500/20 to-teal-500/10',
            time: '12:00 - 2:00 PM'
        },
        snack: {
            icon: <IoLeafOutline className="text-teal-600" />,
            gradient: 'from-teal-500/20 to-emerald-500/10',
            time: '4:00 - 5:00 PM'
        },
        dinner: {
            icon: <IoNutritionOutline className="text-amber-700" />,
            gradient: 'from-amber-600/20 to-orange-500/10',
            time: '7:00 - 9:00 PM'
        },
    };

    return (
        <div className="w-full max-w-[1300px] mx-auto px-3 md:px-6 py-0 md:py-8">
            <ToastProvider placement={'bottom-right'} />
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-amber-600 p-5 md:p-8 mb-5 md:mb-8">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div className='flex items-center gap-2'>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <IoFitnessOutline className="text-white text-lg" />
                            </div>
                            <span className="text-white/80 text-sm font-medium  tracking-wider">Hi {userName}, Your Plan</span>
                        </div>
                        <Button
                            size="md"
                            variant="flat"
                            className="bg-white/20 text-white backdrop-blur-sm"
                            isLoading={downloading}
                            onPress={async () => {
                                setDownloading(true);
                                try {
                                    const blob = await pdf(<FitnessPlanPDF data={data} />).toBlob();
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'fitness-plan.pdf';
                                    a.click();
                                    URL.revokeObjectURL(url);
                                    addToast({
                                        title: 'Download Complete',
                                        description: 'Your fitness plan PDF has been downloaded successfully.',
                                        color: 'success',

                                    });
                                } catch (error) {
                                    console.error('Error generating PDF:', error);
                                    addToast({
                                        title: 'Download Failed',
                                        description: 'Failed to generate PDF. Please try again.',
                                        color: 'danger',
                                    });
                                } finally {
                                    setDownloading(false);
                                }
                            }}
                        >
                            <HiOutlineDownload className="text-lg flex-none" />
                        </Button>
                    </div>

                    <h1 className="text-xl md:text-3xl font-bold text-white mb-2">{plan_metadata.goal}</h1>

                    <div className="flex flex-wrap gap-2 mt-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                            <IoCalendarOutline className="text-white text-sm" />
                            <span className="text-white text-sm font-medium">{plan_metadata.duration_weeks} Weeks</span>
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm`}>
                            <IoTrendingUpOutline className="text-white text-sm" />
                            <span className="text-white text-sm font-medium">{strategyConfig[calculations.strategy]?.label}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advice Banner */}
            {plan_metadata.advise && (
                <div className="bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-950/20 dark:to-amber-950/20 rounded-xl md:rounded-2xl p-4 mb-5 md:mb-8 border border-emerald-100/70 dark:border-emerald-900/40">
                    <p className="text-sm md:text-sm text-default-700 leading-relaxed">{plan_metadata.advise}</p>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-8">
                {/* Target Calories */}
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-xl md:rounded-2xl p-4 border border-amber-200/50 dark:border-amber-900/30">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center mb-3">
                        <IoFlameOutline className="text-amber-600 text-lg" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-default-900">{calculations.target_calories}</p>
                    <p className="text-sm text-default-500 mt-0.5">Target Cal/day</p>
                </div>

                {/* TDEE */}
                <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/5 rounded-xl md:rounded-2xl p-4 border border-teal-200/50 dark:border-teal-900/30">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center mb-3">
                        <IoSpeedometerOutline className="text-teal-600 text-lg" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-default-900">{calculations.tdee}</p>
                    <p className="text-sm text-default-500 mt-0.5">Total daily energy expenditure</p>
                </div>

                {/* BMR */}
                <div className="bg-gradient-to-br from-slate-500/10 to-stone-500/5 rounded-xl md:rounded-2xl p-4 border border-slate-200/60 dark:border-slate-900/30">
                    <div className="w-9 h-9 rounded-xl bg-slate-500/15 flex items-center justify-center mb-3">
                        <IoHeartOutline className="text-slate-600 text-lg" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-default-900">{calculations.bmr}</p>
                    <p className="text-sm text-default-500 mt-0.5">Basal Metabolic Rate</p>
                </div>

                {/* Workout Days */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-amber-500/5 rounded-xl md:rounded-2xl p-4 border border-emerald-200/50 dark:border-emerald-900/30">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-3">
                        <IoBarbellOutline className="text-emerald-600 text-lg" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-default-900">{training_structure.days_per_week}</p>
                    <p className="text-sm text-default-500 mt-0.5">Workout Days</p>
                </div>
            </div>

            {/* Training Week Overview & Macros - Side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-5 md:mb-8">
                {/* Training Week Overview */}
                <div className="bg-white/80 dark:bg-default-100/5 rounded-xl md:rounded-2xl p-4 md:p-5 border border-slate-200/70">
                    <div className="flex items-center gap-2 mb-4">
                        <IoCalendarOutline className="text-emerald-600 text-lg" />
                        <h2 className="font-semibold">Weekly Schedule</h2>
                    </div>
                    <div className="flex justify-between items-center gap-1 md:gap-2">
                        {['Training', 'Light', 'Rest'].map((type, idx) => {
                            const values = [training_structure.strength_days, training_structure.light_activity_days, training_structure.rest_days];
                            const colors = ['text-emerald-600', 'text-teal-600', 'text-slate-500'];
                            const bgColors = ['bg-emerald-500/15', 'bg-teal-500/15', 'bg-slate-400/15'];
                            return (
                                <div key={type} className="flex-1 text-center">
                                    <div className={`${bgColors[idx]} rounded-xl py-3 md:py-4 mb-2`}>
                                        <span className={`text-xl md:text-2xl font-bold ${colors[idx]}`}>{values[idx]}</span>
                                    </div>
                                    <span className="text-sm ">{type}</span>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-sm text-default-500 mt-4 leading-relaxed">{training_structure.reason}</p>
                </div>

                {/* Macros Section */}
                <div className="bg-white/80 dark:bg-default-100/5 rounded-xl md:rounded-2xl p-4 md:p-5 border border-slate-200/70">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <IoNutritionOutline className="text-emerald-600 text-lg" />
                            <h2 className=" font-semibold">Daily Macros</h2>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-default-200/50 dark:bg-default-100/10">
                            <span className="text-sm font-medium">{diet_plan.calories_per_day} cal</span>
                        </div>
                    </div>

                    {/* Macro Circles */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
                        {[
                            { label: 'Protein', value: diet_plan.macros.protein_g, percent: proteinPercent, color: 'from-emerald-600 to-teal-500' },
                            { label: 'Carbs', value: diet_plan.macros.carbs_g, percent: carbsPercent, color: 'from-amber-500 to-orange-500' },
                            { label: 'Fat', value: diet_plan.macros.fat_g, percent: fatPercent, color: 'from-slate-500 to-stone-400' },
                        ].map((macro) => (
                            <div key={macro.label} className="text-center">
                                <div className={`relative w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 rounded-full bg-gradient-to-br ${macro.color} p-[3px]`}>
                                    <div className="w-full h-full rounded-full bg-default-50 dark:bg-default-100 flex flex-col items-center justify-center">
                                        <span className="text-sm md:text-base font-bold">{macro.value}g</span>
                                    </div>
                                </div>
                                <p className="text-sm text-default-500">{macro.label}</p>
                                <p className="text-sm text-default-400">{macro.percent}%</p>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="flex h-2.5 rounded-full overflow-hidden bg-default-200/50">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 transition-all" style={{ width: `${proteinPercent}%` }} />
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 transition-all" style={{ width: `${carbsPercent}%` }} />
                        <div className="bg-gradient-to-r from-slate-500 to-stone-400 transition-all" style={{ width: `${fatPercent}%` }} />
                    </div>
                </div>
            </div>

            {/* Meal Plan */}
            <div className="mb-5 md:mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
                        <IoRestaurantOutline className="text-amber-600" />
                    </div>
                    <h2 className="text-base md:text-lg font-semibold">Meal Plan</h2>
                    <div className="relative">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectReviewBox(selectedReviewBox === 'diet_plan.over_all_meal' ? null : 'diet_plan.over_all_meal');
                            }}
                            className='w-8 h-8 cursor-pointer rounded-full flex justify-center items-center text-xl bg-emerald-700 text-white hover:bg-emerald-800'
                        >
                            <MdAdd />
                        </div>
                        {selectedReviewBox === 'diet_plan.over_all_meal' && (
                            <FloatingReviewBox
                                category="diet_plan"
                                itemKey="over_all_meal"
                                initialValue={reviews.diet_plan.over_all_meal}
                                onClose={() => onSelectReviewBox(null)}
                                placeholder='Share your thoughts and AI will regenerate the meal plan'
                            />
                        )}
                    </div>
                </div>
                <p className="text-sm text-default-400 my-3  leading-relaxed px-4">{explanations.diet}</p>

                <Accordion variant="splitted" selectionMode='multiple' className="gap-3">
                    {Object.entries(diet_plan.meals).map(([mealName, meal]) => {
                        const config = mealConfig[mealName];
                        return (

                            <AccordionItem
                                key={mealName}
                                aria-label={mealName}
                                className="!rounded-xl md:!rounded-2xl !shadow-none border border-default-200 dark:border-default-100/10"
                                title={
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                                            {config.icon}
                                        </div>
                                        <div className="flex-1">
                                            <span className="capitalize font-medium text-sm">{mealName}</span>
                                            <p className="text-[12px] text-default-400">{config.time}</p>
                                        </div>
                                        {/* <div className="relative">
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedReviewBox(selectedReviewBox === `diet_plan.${mealName}` ? null : `diet_plan.${mealName}`);
                                                }}
                                                className='w-8 h-8 cursor-pointer rounded-full flex justify-center items-center text-xl bg-emerald-700 text-white hover:bg-emerald-800'
                                            >
                                                <MdAdd />
                                            </div>
                                            {selectedReviewBox === `diet_plan.${mealName}` && (
                                                <FloatingReviewBox
                                                    category="diet_plan"
                                                    itemKey={mealName}
                                                    initialValue={reviews.diet_plan[mealName as keyof typeof reviews.diet_plan]}
                                                    onClose={() => setSelectedReviewBox(null)}
                                                />
                                            )}
                                        </div> */}
                                        <Chip size="sm" variant="flat" className="h-6 text-[12px]">{meal.options.length} options</Chip>
                                    </div>
                                }
                            >
                                <div className="space-y-2.5">
                                    {meal.options.map((option, idx) => (
                                        <div key={idx} className="bg-default-100/50 dark:bg-default-100/5 rounded-xl p-2">
                                            <div className="flex justify-between items-start gap-2 mb-1.5">
                                                {/* <h4 className="font-medium text-sm md:text-sm leading-tight">{option.label}</h4> */}
                                                <span className="text-[12px] md:text-sm font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">{option.calories} cal</span>
                                            </div>
                                            <p className="text-base leading-relaxed mb-2">{option.label}</p>
                                            <p className="text-sm text-default-500 leading-relaxed mb-2">{option.description}</p>

                                            {/* Macros row */}
                                            <div className="flex gap-3 text-[12px] md:text-sm mb-3">
                                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">P: {option.macros.protein_g}g</span>
                                                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">C: {option.macros.carbs_g}g</span>
                                                <span className="px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-700 dark:text-slate-300">F: {option.macros.fat_g}g</span>
                                            </div>

                                            {/* Quantities */}
                                            {option.quantity.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {option.quantity.map((q, qIdx) => (
                                                        <span key={qIdx} className="text-[12px] md:text-sm px-2 py-0.5 rounded-full bg-default-200/50 dark:bg-default-100/10 text-default-600">
                                                            {q.item}: {q.amount}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </AccordionItem>

                        );
                    })}
                </Accordion>

            </div >

            {/* Workout Schedule */}
            < div className="mb-5 md:mb-8" >
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                        <IoBarbellOutline className="text-emerald-600" />
                    </div>
                    <h2 className="text-base md:text-lg font-semibold">Weekly Workouts</h2>
                    <div className="relative">
                        <div
                            onClick={(e) => {
                                onSelectReviewBox(selectedReviewBox === 'workout_plan.over_all_exercise' ? null : 'workout_plan.over_all_exercise');
                            }}
                            className='w-8 h-8 rounded-full cursor-pointer flex justify-center items-center text-xl bg-emerald-700 text-white hover:bg-emerald-800'
                        >
                            <MdAdd />
                        </div>
                        {selectedReviewBox === 'workout_plan.over_all_exercise' && (
                            <FloatingReviewBox
                                category="workout_plan"
                                itemKey="over_all_exercise"
                                initialValue={reviews.workout_plan.over_all_exercise}
                                onClose={() => onSelectReviewBox(null)}
                                placeholder='Share your thoughts and AI will regenerate the workout plan'
                            />
                        )}
                    </div>
                </div>
                <p className="text-sm text-default-400 my-3  leading-relaxed px-4">{explanations.workout}</p>
                {/* Mobile: Horizontal scroll */}
                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-x-auto pb-2 -mx-2 px-3 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none">
                    {workout_plan.weekly_schedule.map((day, idx) => {
                        const config = workoutTypeConfig[day.type];
                        return (
                            <div
                                key={idx}
                                className={`min-w-[260px] md:min-w-0 snap-start bg-gradient-to-br ${config.gradient} rounded-xl md:rounded-2xl p-4 border border-default-200/50 dark:border-default-100/10`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg ${config.bgIcon} flex items-center justify-center`}>
                                            {config.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">{day.day}</h4>
                                            <p className="text-[12px] text-default-500 capitalize">{day.type}</p>
                                        </div>

                                    </div>
                                    <div className="flex items-center gap-1 text-[12px] text-default-500">
                                        <IoTimeOutline />
                                        <span>{day.duration_min}m</span>
                                        {/* <div className="relative">
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const dayKey = day.day.toLowerCase();
                                                    setSelectedReviewBox(selectedReviewBox === `workout_plan.${dayKey}` ? null : `workout_plan.${dayKey}`);
                                                }}
                                                className='w-6 h-6 cursor-pointer rounded-full flex justify-center items-center text-lg bg-emerald-700 text-white hover:bg-emerald-800'
                                            >
                                                <MdAdd />
                                            </div>
                                            {selectedReviewBox === `workout_plan.${day.day.toLowerCase()}` && (
                                                <FloatingReviewBox
                                                    category="workout_plan"
                                                    itemKey={day.day.toLowerCase()}
                                                    initialValue={reviews.workout_plan[day.day.toLowerCase() as keyof typeof reviews.workout_plan]}
                                                    onClose={() => setSelectedReviewBox(null)}
                                                />
                                            )}
                                        </div> */}
                                    </div>
                                </div>

                                <p className="text-sm text-default-600 mb-3">{day.focus}</p>

                                {day.exercises.length > 0 && (
                                    <div className="space-y-1.5">
                                        {day.exercises.map((exercise, exIdx) => (
                                            <div key={exIdx} className="bg-white/50 dark:bg-default-100/10 rounded-lg px-2.5 py-2">
                                                <p className="font-medium text-sm">{exercise.name}</p>
                                                {(exercise.sets || exercise.reps) && (
                                                    <p className="text-[12px] text-default-500">
                                                        {exercise.sets && `${exercise.sets} sets`}
                                                        {exercise.sets && exercise.reps && ' × '}
                                                        {exercise.reps && `${exercise.reps} reps`}
                                                    </p>
                                                )}
                                                {exercise.alternatives.length > 0 && (
                                                    <p className="text-[12px] text-default-400 mt-0.5">
                                                        ↔ {exercise.alternatives.join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div >

            {/* Safety & Considerations */}
            < div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" >
                {/* Injury Considerations */}
                {
                    workout_plan.injury_considerations.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl md:rounded-2xl p-4 border border-amber-200/50 dark:border-amber-900/30">
                            <div className="flex items-center gap-2 mb-3">
                                <IoWarningOutline className="text-amber-500" />
                                <h3 className="font-semibold text-sm">Injury Notes</h3>
                            </div>
                            <ul className="space-y-1.5">
                                {workout_plan.injury_considerations.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-default-600">
                                        <span className="text-amber-500 mt-1 text-lg">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }

                {/* Safety Notes */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl md:rounded-2xl p-4 border border-emerald-200/50 dark:border-emerald-900/30">
                    <div className="flex items-center gap-2 mb-3">
                        <IoShieldCheckmarkOutline className="text-emerald-500" />
                        <h3 className="font-semibold text-sm">Safety</h3>
                    </div>

                    {safety_notes.medical_conditions_considered.length > 0 && (
                        <div className="mb-3">
                            <p className="text-[12px] text-default-500 mb-1.5">Conditions considered:</p>
                            <div className="flex flex-wrap gap-1">
                                {safety_notes.medical_conditions_considered.map((condition, idx) => (
                                    <span key={idx} className="text-[12px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                        {condition}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={`inline-flex items-center gap-1.5 text-sm ${safety_notes.high_impact_exercises_removed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${safety_notes.high_impact_exercises_removed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {safety_notes.high_impact_exercises_removed ? 'High-impact removed' : 'High-impact included'}
                    </div>
                </div>
            </div >

            {/* Generate Button */}
            {hasAnyReview && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <Button
                        color="primary"
                        size="lg"
                        className="shadow-xl px-8 font-bold text-lg rounded-full bg-emerald-700 hover:bg-emerald-800 text-white"
                        startContent={<IoTrendingUpOutline className="text-xl" />}
                        onPress={() => { onGeneratePlan(reviews) }}
                        isLoading={loading}
                    >
                        Generate Once Again
                    </Button>
                </div>
            )}
        </div >
    );
};

export default ViewPlan;
