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

interface ViewPlanProps {
    data: FitnessPlantype;
}

const ViewPlan: React.FC<ViewPlanProps> = ({ data }) => {
    const [downloading, setDownloading] = useState(false);

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
        deficit: { color: 'text-rose-500', bgColor: 'bg-rose-500/10', label: 'Calorie Deficit' },
        maintenance: { color: 'text-amber-500', bgColor: 'bg-amber-500/10', label: 'Maintenance' },
        surplus: { color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', label: 'Calorie Surplus' },
    };

    // Workout type config
    const workoutTypeConfig: Record<string, { gradient: string; icon: React.ReactNode; bgIcon: string }> = {
        strength: {
            gradient: 'from-violet-500/20 to-purple-500/10',
            icon: <IoBarbellOutline className="text-violet-500" />,
            bgIcon: 'bg-violet-500/10'
        },
        light: {
            gradient: 'from-emerald-500/20 to-teal-500/10',
            icon: <IoLeafOutline className="text-emerald-500" />,
            bgIcon: 'bg-emerald-500/10'
        },
        rest: {
            gradient: 'from-slate-400/20 to-gray-400/10',
            icon: <IoBedOutline className="text-slate-400" />,
            bgIcon: 'bg-slate-400/10'
        },
    };

    // Meal config
    const mealConfig: Record<string, { icon: React.ReactNode; gradient: string; time: string }> = {
        breakfast: {
            icon: <IoSunnyOutline className="text-amber-500" />,
            gradient: 'from-amber-500/20 to-orange-500/10',
            time: '7:00 - 9:00 AM'
        },
        lunch: {
            icon: <IoRestaurantOutline className="text-blue-500" />,
            gradient: 'from-blue-500/20 to-cyan-500/10',
            time: '12:00 - 2:00 PM'
        },
        snack: {
            icon: <IoLeafOutline className="text-green-500" />,
            gradient: 'from-green-500/20 to-emerald-500/10',
            time: '4:00 - 5:00 PM'
        },
        dinner: {
            icon: <IoNutritionOutline className="text-purple-500" />,
            gradient: 'from-purple-500/20 to-pink-500/10',
            time: '7:00 - 9:00 PM'
        },
    };

    return (
        <div className="w-full max-w-[1300px] mx-auto px-3 md:px-6 py-4 md:py-8">

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-5 md:p-8 mb-5 md:mb-8">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div className='flex items-center gap-2'>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <IoFitnessOutline className="text-white text-lg" />
                            </div>
                            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Your Plan</span>
                        </div>
                        <Button
                            size="md"
                            variant="flat"
                            className="bg-white/20 text-white backdrop-blur-sm"
                            startContent={<HiOutlineDownload  className="text-lg" />}
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
                            Download Plan
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl md:rounded-2xl p-4 mb-5 md:mb-8 border border-blue-100 dark:border-blue-900/50">
                    <p className="text-sm md:text-sm text-default-700 leading-relaxed">{plan_metadata.advise}</p>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-8">
                {/* Target Calories */}
                <div className="bg-gradient-to-br from-rose-500/10 to-orange-500/5 rounded-xl md:rounded-2xl p-4 border border-rose-200/50 dark:border-rose-900/30">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center mb-3">
                        <IoFlameOutline className="text-rose-500 text-lg" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-default-900">{calculations.target_calories}</p>
                    <p className="text-sm text-default-500 mt-0.5">Target Cal/day</p>
                </div>

                {/* TDEE */}
                <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-xl md:rounded-2xl p-4 border border-amber-200/50 dark:border-amber-900/30">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center mb-3">
                        <IoSpeedometerOutline className="text-amber-500 text-lg" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-default-900">{calculations.tdee}</p>
                    <p className="text-sm text-default-500 mt-0.5">Total daily energy expenditure</p>
                </div>

                {/* BMR */}
                <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 rounded-xl md:rounded-2xl p-4 border border-pink-200/50 dark:border-pink-900/30">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/15 flex items-center justify-center mb-3">
                        <IoHeartOutline className="text-pink-500 text-lg" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-default-900">{calculations.bmr}</p>
                    <p className="text-sm text-default-500 mt-0.5">BMR</p>
                </div>

                {/* Workout Days */}
                <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 rounded-xl md:rounded-2xl p-4 border border-violet-200/50 dark:border-violet-900/30">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center mb-3">
                        <IoBarbellOutline className="text-violet-500 text-lg" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-default-900">{training_structure.days_per_week}</p>
                    <p className="text-sm text-default-500 mt-0.5">Workout Days</p>
                </div>
            </div>

            {/* Training Week Overview & Macros - Side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-5 md:mb-8">
                {/* Training Week Overview */}
                <div className="bg-default-50 dark:bg-default-100/5 rounded-xl md:rounded-2xl p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <IoCalendarOutline className="text-primary text-lg" />
                        <h2 className="font-semibold">Weekly Schedule</h2>
                    </div>
                    <div className="flex justify-between items-center gap-1 md:gap-2">
                        {['Training', 'Light', 'Rest'].map((type, idx) => {
                            const values = [training_structure.days_per_week, training_structure.light_activity_days, training_structure.rest_days];
                            const colors = ['text-violet-500', 'text-emerald-500', 'text-slate-400'];
                            const bgColors = ['bg-violet-500/15', 'bg-emerald-500/15', 'bg-slate-400/15'];
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
                <div className="bg-default-50 dark:bg-default-100/5 rounded-xl md:rounded-2xl p-4 md:p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <IoNutritionOutline className="text-emerald-500 text-lg" />
                            <h2 className=" font-semibold">Daily Macros</h2>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-default-200/50 dark:bg-default-100/10">
                            <span className="text-sm font-medium">{diet_plan.calories_per_day} cal</span>
                        </div>
                    </div>

                    {/* Macro Circles */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
                        {[
                            { label: 'Protein', value: diet_plan.macros.protein_g, percent: proteinPercent, color: 'from-blue-500 to-cyan-500' },
                            { label: 'Carbs', value: diet_plan.macros.carbs_g, percent: carbsPercent, color: 'from-amber-500 to-orange-500' },
                            { label: 'Fat', value: diet_plan.macros.fat_g, percent: fatPercent, color: 'from-rose-500 to-pink-500' },
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
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 transition-all" style={{ width: `${proteinPercent}%` }} />
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 transition-all" style={{ width: `${carbsPercent}%` }} />
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 transition-all" style={{ width: `${fatPercent}%` }} />
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
                </div>
                <p className="text-sm text-default-400 my-3  leading-relaxed px-4">{explanations.diet}</p>

                <Accordion variant="splitted" selectionMode="multiple" className="gap-3">
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
                                            <p className="text-sm md:text-base leading-relaxed mb-2">{option.description}</p>

                                            {/* Macros row */}
                                            <div className="flex gap-3 text-[12px] md:text-sm mb-3">
                                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">P: {option.macros.protein_g}g</span>
                                                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">C: {option.macros.carbs_g}g</span>
                                                <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">F: {option.macros.fat_g}g</span>
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
                    <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
                        <IoBarbellOutline className="text-violet-500" />
                    </div>
                    <h2 className="text-base md:text-lg font-semibold">Weekly Workouts</h2>
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
        </div >
    );
};

export default ViewPlan;