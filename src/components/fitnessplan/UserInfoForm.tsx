"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addToast, ToastProvider, Button, Card, CardBody, Divider } from "@heroui/react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { FitnessPlantype } from "@/lib/schemas";
import { RiGeminiFill } from "react-icons/ri";
import {
    TextInput,
    NumberInput,
    SelectInput,
    MultiSelectInput,
    UnitNumberInput,
    DateInput,
} from "./customfields";
import {
    FormData,
    FinalOutput,
    Injury,
    InjuryArea,
    InjurySeverity,
    MedicalCondition,
    SelectOption,
} from "./types";
import { CheckboxInput } from "../inputs/CheckboxInput";
import { TextboxInput } from "../inputs/TextboxInput";
import { validationSchema } from "./validationSchema";
import {
    GENDER_OPTIONS,
    EXPERIENCE_LEVEL_OPTIONS,
    ACTIVITY_LEVEL_OPTIONS,
    WORKOUT_TIME_OPTIONS,
    INJURY_AREA_OPTIONS,
    MEDICAL_CONDITION_OPTIONS,
    DIET_TYPE_OPTIONS,
    EQUIPMENT_OPTIONS,
    HEIGHT_UNIT_OPTIONS,
    WEIGHT_UNIT_OPTIONS,
    calculateBMI,
    convertHeightToCm,
    convertWeightToKg,
    getBMICategory,
    filterGoalsByBMIAndAge,
} from "./constants";
import ViewPlan from "./ViewPlan";

const defaultValues: FormData = {
    name: "",
    dob: "",
    age: undefined,
    gender: "",
    heightValue: undefined,
    heightUnit: "cm",
    weightValue: undefined,
    weightUnit: "kg",
    bmi: undefined,
    experienceLevel: "",
    primaryGoal: "",
    activityLevel: "",
    workoutTime: undefined,
    injuries: [],
    injurySeverities: {},
    medicalConditions: [],
    country: "",
    countrySpecificDiet: true,
    preferencesDescription: "",
    state: "",
    dietType: "",
    equipment: "",
};
const userReview = {
    diet_plan: {
        over_all_meal: "",
        // breakfast: "",
        // lunch: "",
        // dinner: "",
        // snack: ""
    },
    workout_plan: {
        over_all_exercise: "",
        // monday: "",
        // tuesday: "",
        // wednesday: "",
        // thursday: "",
        // friday: "",
        // saturday: "",
        // sunday: ""
    }
}

export function UserInfoForm() {
    const [submittedData, setSubmittedData] = useState<FitnessPlantype | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<FinalOutput | null>(null)
    const [reviews, setReviews] = useState(userReview);
    const [selectedReviewBox, setSelectedReviewBox] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        formState: { isValid, errors },
    } = useForm<FormData>({
        resolver: yupResolver(validationSchema) as any,
        defaultValues,
        mode: "onChange",
    });

    // Watch fields for conditional logic
    const heightValue = useWatch({ control, name: "heightValue" });
    const heightUnit = useWatch({ control, name: "heightUnit" });
    const weightValue = useWatch({ control, name: "weightValue" });
    const weightUnit = useWatch({ control, name: "weightUnit" });
    const dob = useWatch({ control, name: "dob" });
    const age = useWatch({ control, name: "age" });
    const bmi = useWatch({ control, name: "bmi" });
    const country = useWatch({ control, name: "country" });
    const injuries = useWatch({ control, name: "injuries" });
    const medicalConditions = useWatch({ control, name: "medicalConditions" });

    // Auto-calculate Age from DOB
    useEffect(() => {
        if (dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            setValue("age", calculatedAge);
        } else {
            setValue("age", undefined);
        }
    }, [dob, setValue]);

    // Auto-calculate BMI
    useEffect(() => {
        if (
            heightValue !== undefined &&
            weightValue !== undefined &&
            typeof heightValue === "number" &&
            typeof weightValue === "number"
        ) {
            const heightCm = convertHeightToCm(heightValue, heightUnit);
            const weightKg = convertWeightToKg(weightValue, weightUnit);

            if (
                heightCm >= 120 &&
                heightCm <= 220 &&
                weightKg >= 30 &&
                weightKg <= 200
            ) {
                const calculatedBMI = calculateBMI(heightCm, weightKg);
                setValue("bmi", calculatedBMI);
            } else {
                setValue("bmi", undefined);
            }
        } else {
            setValue("bmi", undefined);
        }
    }, [heightValue, heightUnit, weightValue, weightUnit, setValue]);

    // Filtered goal options based on BMI and age
    const goalOptions: SelectOption[] = useMemo(() => {
        if (typeof bmi === "number" && typeof age === "number") {
            return filterGoalsByBMIAndAge(bmi, age);
        }
        return [];
    }, [bmi, age]);

    // Check if injury has non-none selections
    const hasInjuries = useMemo(() => {
        return injuries?.some((i) => i !== "none") ?? false;
    }, [injuries]);

    // Check if heart condition is selected
    const hasHeartCondition = useMemo(() => {
        return medicalConditions?.includes("heart_condition") ?? false;
    }, [medicalConditions]);

    // Form submission
    const onSubmit = async (data: FormData) => {
        setLoading(true);
        // Convert to metric
        const heightVal =
            typeof data.heightValue === "number" ? data.heightValue : 0;
        const weightVal =
            typeof data.weightValue === "number" ? data.weightValue : 0;
        const heightCm = convertHeightToCm(heightVal, data.heightUnit);
        const weightKg = convertWeightToKg(weightVal, data.weightUnit);
        const calculatedBMI = calculateBMI(heightCm, weightKg);
        const bmiCategory = getBMICategory(calculatedBMI);

        // Build injuries array
        const injuriesArray: Injury[] = [];
        if (data.injuries && data.injuries.length > 0) {
            data.injuries.forEach((injury) => {
                if (injury !== "none") {
                    const severity = data.injurySeverities?.[injury] || "mild";
                    injuriesArray.push({
                        area: injury as Exclude<InjuryArea, "none">,
                        severity: severity as InjurySeverity,
                    });
                }
            });
        }

        // Build medical conditions array
        const medicalConditionsArray: MedicalCondition[] =
            data.medicalConditions && data.medicalConditions.length > 0
                ? (data.medicalConditions as MedicalCondition[])
                : (["none"] as MedicalCondition[]);

        // Check for high impact avoidance
        const avoidHighImpact =
            injuriesArray.some((i) => ["knee", "ankle", "back"].includes(i.area)) ||
            medicalConditionsArray.includes("heart_condition");

        // Build final output
        const userInfo: FinalOutput = {
            user_profile: {
                name: data.name,
                age: Number(data.age),
                gender: data.gender as "male" | "female",
                height_cm: heightCm,
                weight_kg: weightKg,
                bmi: calculatedBMI,
                bmi_category: bmiCategory,
                experience_level: data.experienceLevel as
                    | "beginner"
                    | "intermediate"
                    | "advanced",
                primary_goal: data.primaryGoal as
                    | "fat_loss"
                    | "muscle_gain"
                    | "maintain"
                    | "recomposition"
                    | "strength"
                    | "beginner_fitness",
                activity_level: data.activityLevel as "sedentary" | "mixed" | "active",
                workout_time_min: Number(data.workoutTime),
                injuries: injuriesArray,
                medical_conditions: medicalConditionsArray,
                location: {
                    country: data.country,
                    state: data.state,
                },
            },
            constraints: {
                max_calorie_deficit_percent: 20,
                avoid_high_impact: avoidHighImpact,
                diet_should_be_local: data.countrySpecificDiet,
            },
            preferences: {
                diet_type: data.dietType as "vegetarian" | "non_vegetarian",
                equipment_available: data.equipment as "none" | "home" | "gym",
                user_preferance_description: data.preferencesDescription,
            },
        };

        try {
            const res = await fetch("/api/generate-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: { type: "generate", userInfo } }),
            });

            if (!res.ok) throw new Error("Failed to generate plan");

            const resData = await res.json();
            const parsedData = JSON.parse(
                resData.plan.kwargs.content
                    .replace(/```json/gi, "")
                    .replace(/```/g, "")
                    .trim()
            );
            setLoading(false);
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
            setUserInfo(userInfo)
            setSubmittedData(parsedData);
            // addToast({
            //     title: 'Generated Fitness plan',
            //     description: 'Your fitness plan has been Generated successfully.',
            //     color: 'success',
            //     timeout: 2000,
            // });
        } catch (error: any) {
            setLoading(false);
            console.error("Error generating plan:", error);
            addToast({
                title: 'Generation Failed',
                description: error.message || 'Something went wrong while generating your plan.',
                color: 'danger',
                timeout: 2000,
            });
        }
    };


    const handleReviewSubmit = (category: string, key: string, text: string) => {
        setReviews(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: text
            }
        }));
        setSelectedReviewBox(null);
    };

    const hasAnyReview = Object.values(reviews).some(cat =>
        Object.values(cat).some(val => val.trim().length > 0)
    );



    const regeneratePlan = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/generate-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: { type: "regenerate", userInfo: { userHealthInfo: userInfo, generatedOutput: submittedData, userReview: reviews } } }),
            });

            if (!res.ok) throw new Error("Failed to generate plan");

            const resData = await res.json();
            const parsedData = JSON.parse(
                resData.plan.kwargs.content
                    .replace(/```json/gi, "")
                    .replace(/```/g, "")
                    .trim()
            );
            setLoading(false);
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
            setUserInfo(userInfo)
            setSubmittedData(parsedData);
            setSelectedReviewBox(null);
            setReviews(userReview)
        } catch (error: any) {
            setLoading(false);
            console.error("Error generating plan:", error);
            addToast({
                title: 'Generation Failed',
                description: error.message || 'Something went wrong while generating your plan.',
                color: 'danger',
                timeout: 2000,
            });
        }
    }
    return (
        <>
            <ToastProvider placement={'bottom-right'} />
            {submittedData ? (
                <ViewPlan data={submittedData}
                    userName={userInfo?.user_profile.name || "User"}
                    onGeneratePlan={() => {
                        regeneratePlan()
                    }}
                    loading={loading}
                    reviews={reviews}
                    hasAnyReview={hasAnyReview}
                    selectedReviewBox={selectedReviewBox}
                    onReviewSubmit={handleReviewSubmit}
                    onSelectReviewBox={setSelectedReviewBox}
                />
            ) : (
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-0 md:py-10">
                    <div className="relative overflow-hidden rounded-3xl border border-emerald-100/60 bg-[radial-gradient(800px_400px_at_8%_-10%,_rgba(16,185,129,0.18),_transparent_55%),radial-gradient(700px_350px_at_92%_0%,_rgba(234,179,8,0.16),_transparent_55%)] p-6 md:p-8 mb-6 md:mb-10 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.6)]">
                        <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-emerald-400/10 blur-2xl" />
                        <div className="absolute bottom-0 left-0 h-20 w-20 translate-y-1/2 -translate-x-1/2 rounded-full bg-amber-400/10 blur-2xl" />
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                                Fitness Intake
                            </div>
                            <h1 className="text-2xl md:text-4xl font-semibold text-slate-900 mt-3">
                                Build Your Precision Plan
                            </h1>
                            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
                                Share your essentials and we will craft a high-performance fitness and nutrition plan calibrated to you.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Section 1: Basic Identity */}
                        <Card className="border border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-[0_16px_40px_-32px_rgba(15,23,42,0.65)]">
                            <CardBody className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-slate-900">Basic Identity</h2>
                                    <Divider />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TextInput
                                        name="name"
                                        label="Full Name"
                                        placeholder="Enter your name"
                                        control={control as any}
                                    />
                                    <DateInput
                                        name="dob"
                                        label="Date of Birth"
                                        control={control as any}
                                    />
                                </div>
                                <div className="max-w-xs">
                                    <NumberInput
                                        name="age"
                                        label="Age (Auto-calculated)"
                                        readOnly
                                        disabled
                                        control={control as any}
                                    />
                                </div>
                                <SelectInput
                                    name="gender"
                                    label="Gender"
                                    options={GENDER_OPTIONS}
                                    control={control as any}
                                />
                            </CardBody>
                        </Card>

                        {/* Section 2: Body Metrics */}
                        <Card className="border border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-[0_16px_40px_-32px_rgba(15,23,42,0.65)]">
                            <CardBody className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-slate-900">Body Metrics</h2>
                                    <Divider />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <UnitNumberInput
                                        name="heightValue"
                                        unitName="heightUnit"
                                        label="Height"
                                        placeholder="Enter height"
                                        units={HEIGHT_UNIT_OPTIONS}
                                        control={control as any}
                                    />
                                    <UnitNumberInput
                                        name="weightValue"
                                        unitName="weightUnit"
                                        label="Weight"
                                        placeholder="Enter weight"
                                        units={WEIGHT_UNIT_OPTIONS}
                                        control={control as any}
                                    />
                                </div>
                                <div className="max-w-xs">
                                    <NumberInput
                                        name="bmi"
                                        label="BMI (Auto-calculated)"
                                        readOnly
                                        disabled
                                        control={control as any}
                                    />
                                    {typeof bmi === "number" && (
                                        <p className="text-sm text-default-500 mt-1">
                                            Category:{" "}
                                            <span className="font-medium capitalize">
                                                {getBMICategory(bmi)}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Section 3: Fitness Goal */}
                        <Card className="border border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-[0_16px_40px_-32px_rgba(15,23,42,0.65)]">
                            <CardBody className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-slate-900">Fitness Goal</h2>
                                    <Divider />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectInput
                                        name="primaryGoal"
                                        label="Primary Goal"
                                        placeholder={
                                            typeof bmi !== "number"
                                                ? "Calculate BMI first"
                                                : "Select your goal"
                                        }
                                        options={goalOptions}
                                        disabled={typeof bmi !== "number"}
                                        control={control as any}
                                    />
                                    <SelectInput
                                        name="experienceLevel"
                                        label="Experience Level"
                                        options={EXPERIENCE_LEVEL_OPTIONS}
                                        control={control as any}
                                    />
                                </div>
                                {typeof bmi !== "number" && (
                                    <p className="text-sm text-warning">
                                        Please enter valid height and weight to calculate BMI before
                                        selecting a goal.
                                    </p>
                                )}
                            </CardBody>
                        </Card>

                        {/* Section 4: Lifestyle */}
                        <Card className="border border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-[0_16px_40px_-32px_rgba(15,23,42,0.65)]">
                            <CardBody className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-slate-900">Lifestyle</h2>
                                    <Divider />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectInput
                                        name="activityLevel"
                                        label="Activity Level / Profession"
                                        options={ACTIVITY_LEVEL_OPTIONS}
                                        control={control as any}
                                    />
                                    <SelectInput
                                        name="workoutTime"
                                        label="Workout Time Availability"
                                        options={WORKOUT_TIME_OPTIONS}
                                        control={control as any}
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Section 5: Health & Safety */}
                        <Card className="border border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-[0_16px_40px_-32px_rgba(15,23,42,0.65)]">
                            <CardBody className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-slate-900">Health & Safety</h2>
                                    <Divider />
                                </div>
                                <MultiSelectInput
                                    name="injuries"
                                    severityName="injurySeverities"
                                    label="Any Injuries?"
                                    options={INJURY_AREA_OPTIONS}
                                    showSeverity={hasInjuries}
                                    control={control as any}
                                />
                                <Divider />
                                <MultiSelectInput
                                    name="medicalConditions"
                                    label="Medical Conditions"
                                    options={MEDICAL_CONDITION_OPTIONS}
                                    control={control as any}
                                />
                                {hasHeartCondition && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                                        <p className="text-amber-800 text-sm font-medium">
                                            Heart condition detected. Please consult your doctor before starting any fitness program. We will prioritize low-impact recommendations.
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* Section 6: Location */}
                        <Card className="border border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-[0_16px_40px_-32px_rgba(15,23,42,0.65)]">
                            <CardBody className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-slate-900">Location</h2>
                                    <Divider />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="w-full">
                                        <label className="text-sm font-medium text-default-700 block mb-2">
                                            Country
                                        </label>
                                        <Controller
                                            name="country"
                                            control={control}
                                            render={({ field }) => (
                                                <CountryDropdown
                                                    value={field.value as string}
                                                    onChange={(val) => {
                                                        field.onChange(val);
                                                        setValue("state", ""); // Reset state when country changes
                                                    }}
                                                    className="w-full h-10 px-3 rounded-xl border-2 border-default-200 hover:border-default-400 focus:border-emerald-500 bg-transparent text-sm transition-all outline-none"
                                                    defaultOptionLabel="Select Country"
                                                />
                                            )}
                                        />
                                        {errors.country && (
                                            <p className="text-xs text-danger mt-1">
                                                {errors.country?.message as string}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-full">
                                        <label className="text-sm font-medium text-default-700 block mb-2">
                                            State
                                        </label>
                                        <Controller
                                            name="state"
                                            control={control}
                                            render={({ field }) => (
                                                <RegionDropdown
                                                    country={country as string}
                                                    value={field.value as string}
                                                    onChange={(val) => field.onChange(val)}
                                                    className="w-full h-10 px-3 rounded-xl border-2 border-default-200 hover:border-default-400 focus:border-emerald-500 bg-transparent text-sm transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                                    defaultOptionLabel="Select State"
                                                    blankOptionLabel="Select country first"
                                                />
                                            )}
                                        />
                                        {errors.state && (
                                            <p className="text-xs text-danger mt-1">
                                                {errors.state?.message as string}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Divider />
                                <CheckboxInput
                                    name="countrySpecificDiet"
                                    label="Use Country-Specific Food Recommendations"
                                    description="When enabled, diet recommendations will include local foods based on your country."
                                    control={control as any}
                                />
                            </CardBody>
                        </Card>

                        {/* Section 7: Preferences */}
                        <Card className="border border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-[0_16px_40px_-32px_rgba(15,23,42,0.65)]">
                            <CardBody className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-slate-900">Preferences</h2>
                                    <Divider />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectInput
                                        name="dietType"
                                        label="Diet Type"
                                        options={DIET_TYPE_OPTIONS}
                                        control={control as any}
                                    />
                                    <SelectInput
                                        name="equipment"
                                        label="Equipment Available"
                                        options={EQUIPMENT_OPTIONS}
                                        control={control as any}
                                    />
                                </div>
                                <TextboxInput
                                    name="preferencesDescription"
                                    label="Preferences Description (optional)"
                                    placeholder="Describe any specific dietary requirements/ workouts / food preferences / food dislikes"
                                    maxLength={200}
                                    minRows={3}
                                    maxRows={4}
                                    control={control as any}
                                />
                            </CardBody>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                color="primary"
                                size="lg"
                                className="min-w-52 bg-emerald-700 hover:bg-emerald-800 text-white shadow-[0_18px_40px_-24px_rgba(6,78,59,0.75)]"
                                // isDisabled={!isValid}
                                isLoading={loading}
                            >
                                <RiGeminiFill className="text-lg" /> Generate Plan
                            </Button>
                        </div>
                        {!isValid && Object.keys(errors).length > 0 && (
                            <p className="text-center text-sm text-danger">
                                Please fill in all required fields correctly before submitting.
                            </p>
                        )}
                    </form>
                </div>
            )}
        </>
    );
}

export default UserInfoForm;
