'use client';

import React from 'react';
import { DatePicker } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { parseDate, CalendarDate } from '@internationalized/date';

interface DateInputProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    control: Control<T>;
}

export function DateInput<T extends FieldValues>({
    name,
    label,
    placeholder,
    disabled = false,
    control,
}: DateInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                // Parse the date string (YYYY-MM-DD format) to CalendarDate
                let dateValue: CalendarDate | null = null;
                if (field.value && typeof field.value === 'string' && field.value !== '') {
                    try {
                        // Handle both ISO string and YYYY-MM-DD format
                        const dateStr = field.value.includes('T')
                            ? field.value.split('T')[0]
                            : field.value;
                        dateValue = parseDate(dateStr);
                    } catch {
                        dateValue = null;
                    }
                }

                return (
                    <div className="w-full">
                        <DatePicker
                            label={label}
                            isDisabled={disabled}
                            isInvalid={!!error}
                            errorMessage={error?.message}
                            variant="bordered"
                            labelPlacement="outside"
                            granularity="day"
                            value={dateValue}
                            onChange={(date: CalendarDate | null) => {
                                // Store as YYYY-MM-DD format
                                if (date) {
                                    const year = date.year;
                                    const month = String(date.month).padStart(2, '0');
                                    const day = String(date.day).padStart(2, '0');
                                    field.onChange(`${year}-${month}-${day}`);
                                } else {
                                    field.onChange('');
                                }
                            }}
                            showMonthAndYearPickers
                            classNames={{
                                label: 'text-sm font-medium text-default-700',
                                inputWrapper: 'border-default-300 hover:border-default-400',
                            }}
                        />
                    </div>
                );
            }}
        />
    );
}

export default DateInput;

