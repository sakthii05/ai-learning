import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from '@react-pdf/renderer';
import { FitnessPlantype } from '@/lib/schemas';

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#7c3aed',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#7c3aed',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: '#f3e8ff',
    },
    badgeText: {
        fontSize: 10,
        color: '#7c3aed',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    statBox: {
        flex: 1,
        padding: 10,
        marginHorizontal: 3,
        backgroundColor: '#f9fafb',
        borderRadius: 6,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7c3aed',
    },
    statLabel: {
        fontSize: 9,
        color: '#6b7280',
        marginTop: 2,
    },
    adviceBox: {
        padding: 10,
        backgroundColor: '#eff6ff',
        borderRadius: 6,
        marginBottom: 15,
    },
    adviceText: {
        fontSize: 11,
        color: '#1e40af',
        lineHeight: 1.4,
    },
    table: {
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#7c3aed',
        padding: 6,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    tableHeaderText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        padding: 6,
        backgroundColor: '#fafafa',
    },
    tableRowAlt: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        padding: 6,
        backgroundColor: '#ffffff',
    },
    tableCell: {
        fontSize: 10,
        color: '#374151',
    },
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        paddingVertical: 8,
        backgroundColor: '#f9fafb',
        borderRadius: 6,
    },
    macroItem: {
        alignItems: 'center',
    },
    macroValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    macroLabel: {
        fontSize: 9,
        color: '#6b7280',
    },
    proteinColor: { color: '#3b82f6' },
    carbsColor: { color: '#f59e0b' },
    fatColor: { color: '#ef4444' },
    mealSection: {
        marginBottom: 8,
    },
    mealTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    mealOption: {
        paddingVertical: 4,
        paddingLeft: 8,
        borderLeftWidth: 2,
        borderLeftColor: '#e5e7eb',
        marginBottom: 4,
    },
    mealOptionText: {
        fontSize: 10,
        color: '#4b5563',
    },
    mealMacros: {
        fontSize: 9,
        color: '#6b7280',
        marginTop: 2,
    },
    notesBox: {
        padding: 8,
        backgroundColor: '#fef3c7',
        borderRadius: 4,
        marginTop: 5,
    },
    notesText: {
        fontSize: 10,
        color: '#92400e',
    },
    safetyBox: {
        padding: 8,
        backgroundColor: '#d1fae5',
        borderRadius: 4,
        marginTop: 5,
    },
    safetyText: {
        fontSize: 10,
        color: '#065f46',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 9,
        color: '#9ca3af',
    },
    explanationText: {
        fontSize: 10,
        color: '#6b7280',
        fontStyle: 'italic',
        marginTop: 5,
        lineHeight: 1.3,
    },
});

interface FitnessPlanPDFProps {
    data: FitnessPlantype;
}

const FitnessPlanPDF: React.FC<FitnessPlanPDFProps> = ({ data }) => {
    const {
        plan_metadata,
        calculations,
        training_structure,
        diet_plan,
        workout_plan,
        safety_notes,
        explanations,
    } = data;

    return (
        <Document>
            {/* Page 1: Overview, Stats, Diet Plan */}
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Your Fitness Plan</Text>
                    <Text style={styles.subtitle}>{plan_metadata.goal}</Text>
                    <View style={styles.badgeRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{plan_metadata.duration_weeks} Weeks</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{calculations.strategy.toUpperCase()}</Text>
                        </View>
                    </View>
                </View>

                {/* Advice */}
                {plan_metadata.advise && (
                    <View style={styles.adviceBox}>
                        <Text style={styles.adviceText}>{plan_metadata.advise}</Text>
                    </View>
                )}

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{calculations.target_calories}</Text>
                        <Text style={styles.statLabel}>Target Cal/day</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{calculations.tdee}</Text>
                        <Text style={styles.statLabel}>TDEE</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{calculations.bmr}</Text>
                        <Text style={styles.statLabel}>BMR</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{training_structure.days_per_week}</Text>
                        <Text style={styles.statLabel}>Workout Days</Text>
                    </View>
                </View>

                {/* Training Structure */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Training Structure</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={[styles.statValue, { color: '#7c3aed' }]}>{training_structure.days_per_week}</Text>
                            <Text style={styles.statLabel}>Training Days</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={[styles.statValue, { color: '#10b981' }]}>{training_structure.light_activity_days}</Text>
                            <Text style={styles.statLabel}>Light Activity</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={[styles.statValue, { color: '#6b7280' }]}>{training_structure.rest_days}</Text>
                            <Text style={styles.statLabel}>Rest Days</Text>
                        </View>
                    </View>
                    <Text style={styles.explanationText}>{training_structure.reason}</Text>
                </View>

                {/* Macros */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Daily Macros ({diet_plan.calories_per_day} cal)</Text>
                    <View style={styles.macroRow}>
                        <View style={styles.macroItem}>
                            <Text style={[styles.macroValue, styles.proteinColor]}>{diet_plan.macros.protein_g}g</Text>
                            <Text style={styles.macroLabel}>Protein</Text>
                        </View>
                        <View style={styles.macroItem}>
                            <Text style={[styles.macroValue, styles.carbsColor]}>{diet_plan.macros.carbs_g}g</Text>
                            <Text style={styles.macroLabel}>Carbs</Text>
                        </View>
                        <View style={styles.macroItem}>
                            <Text style={[styles.macroValue, styles.fatColor]}>{diet_plan.macros.fat_g}g</Text>
                            <Text style={styles.macroLabel}>Fat</Text>
                        </View>
                    </View>
                </View>

                {/* Diet Plan Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Meal Plan</Text>
                    <Text style={styles.explanationText}>{explanations.diet}</Text>

                    {Object.entries(diet_plan.meals).map(([mealName, meal]) => (
                        <View key={mealName} style={styles.mealSection} wrap={false}>
                            <Text style={styles.mealTitle}>{mealName}</Text>
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, { flex: 3 }]}>Option</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Cal</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 2, textAlign: 'center' }]}>P / C / F</Text>
                                </View>
                                {meal.options.map((option, idx) => (
                                    <View key={idx} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                        <Text style={[styles.tableCell, { flex: 3 }]}>
                                            {option.quantity.map(q => `${q.item} (${q.amount})`).join(', ')}
                                        </Text>
                                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{option.calories}</Text>
                                        <Text style={[styles.tableCell, { flex: 2, textAlign: 'center' }]}>
                                            {option.macros.protein_g} / {option.macros.carbs_g} / {option.macros.fat_g}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Workout Schedule */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Weekly Workout Schedule</Text>
                    <Text style={styles.explanationText}>{explanations.workout}</Text>

                    <View style={[styles.table, { marginTop: 10 }]}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Day</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Type</Text>
                            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Focus</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Duration</Text>
                        </View>
                        {workout_plan.weekly_schedule.map((day, idx) => (
                            <View key={idx} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>{day.day}</Text>
                                <Text style={[styles.tableCell, { flex: 1, textTransform: 'capitalize' }]}>{day.type}</Text>
                                <Text style={[styles.tableCell, { flex: 2 }]}>{day.focus}</Text>
                                <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{day.duration_min} min</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Exercises Detail */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Exercise Details</Text>
                    {workout_plan.weekly_schedule.filter(d => d.exercises.length > 0).map((day, dayIdx) => (
                        <View key={dayIdx} style={{ marginBottom: 8 }} wrap={false}>
                            <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 4, color: '#7c3aed' }}>{day.day} - {day.focus}</Text>
                            <View style={styles.table}>
                                <View style={[styles.tableHeader, { backgroundColor: '#6366f1' }]}>
                                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Exercise</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Sets × Reps</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Alternatives</Text>
                                </View>
                                {day.exercises.map((ex, exIdx) => (
                                    <View key={exIdx} style={exIdx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                        <Text style={[styles.tableCell, { flex: 2 }]}>{ex.name}</Text>
                                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>
                                            {ex.sets && ex.reps ? `${ex.sets} × ${ex.reps}` : ex.sets ? `${ex.sets} sets` : ex.reps ? `${ex.reps} reps` : '-'}
                                        </Text>
                                        <Text style={[styles.tableCell, { flex: 2 }]}>{ex.alternatives.join(', ') || '-'}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Injury Considerations */}
                {workout_plan.injury_considerations.length > 0 && (
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>Injury Considerations</Text>
                        <View style={styles.notesBox}>
                            {workout_plan.injury_considerations.map((item, idx) => (
                                <Text key={idx} style={styles.notesText}>• {item}</Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* Safety Notes */}
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Safety Notes</Text>
                    <View style={styles.safetyBox}>
                        {safety_notes.medical_conditions_considered.length > 0 && (
                            <Text style={styles.safetyText}>
                                Conditions considered: {safety_notes.medical_conditions_considered.join(', ')}
                            </Text>
                        )}
                        <Text style={styles.safetyText}>
                            {safety_notes.high_impact_exercises_removed
                                ? 'High-impact exercises have been removed for your safety.'
                                : 'High-impact exercises are included in this plan.'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `Generated on ${new Date().toLocaleDateString()} | Page ${pageNumber} of ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};

export default FitnessPlanPDF;
