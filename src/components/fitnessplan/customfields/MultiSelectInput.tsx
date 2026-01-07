'use client';

import React from 'react';
import { Checkbox, CheckboxGroup, Select, SelectItem } from '@heroui/react';
import { Control, Controller, FieldValues, Path, useWatch } from 'react-hook-form';
import { SelectOption } from '../types';
import { INJURY_SEVERITY_OPTIONS } from '../constants';

interface MultiSelectInputProps<T extends FieldValues> {
    name: Path<T>;
    severityName?: Path<T>;
    label: string;
    options: SelectOption[];
    disabled?: boolean;
    showSeverity?: boolean;
    control: Control<T>;
}

export function MultiSelectInput<T extends FieldValues>({
    name,
    severityName,
    label,
    options,
    disabled = false,
    showSeverity = false,
    control,
}: MultiSelectInputProps<T>) {
    const selectedValues = useWatch({ control, name }) as string[] | undefined;
    const hasNonNoneSelection = selectedValues?.some((v) => v !== 'none') ?? false;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="w-full space-y-3">
                    <CheckboxGroup
                        label={label}
                        value={field.value || []}
                        onValueChange={(values) => {
                            // If 'none' is selected, clear other selections
                            if (values.includes('none') && !field.value?.includes('none')) {
                                field.onChange(['none']);
                            } else if (values.includes('none') && values.length > 1) {
                                // If selecting something else when 'none' is selected, remove 'none'
                                field.onChange(values.filter((v) => v !== 'none'));
                            } else {
                                field.onChange(values);
                            }
                        }}
                        isDisabled={disabled}
                        isInvalid={!!error}
                        errorMessage={error?.message}
                        classNames={{
                            label: 'text-sm font-medium text-default-700',
                        }}
                    >
                        {options.map((option) => (
                            <div key={option.value} className="flex items-center gap-4">
                                <Checkbox value={option.value}>{option.label}</Checkbox>
                                {showSeverity &&
                                    option.value !== 'none' &&
                                    field.value?.includes(option.value) &&
                                    severityName && (
                                        <Controller
                                            name={`${severityName}.${option.value}` as Path<T>}
                                            control={control}
                                            render={({ field: severityField }) => (
                                                <Select
                                                    size="sm"
                                                    className="w-32"
                                                    placeholder="Severity"
                                                    selectedKeys={severityField.value ? [severityField.value] : []}
                                                    onSelectionChange={(keys) => {
                                                        const selected = Array.from(keys)[0];
                                                        severityField.onChange(selected?.toString() || 'mild');
                                                    }}
                                                    variant="bordered"
                                                >
                                                    {INJURY_SEVERITY_OPTIONS.map((sev) => (
                                                        <SelectItem key={sev.value} textValue={sev.label}>
                                                            {sev.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    )}
                            </div>
                        ))}
                    </CheckboxGroup>
                    {showSeverity && hasNonNoneSelection && (
                        <p className="text-xs text-default-500">
                            Select severity level for each injury
                        </p>
                    )}
                </div>
            )}
        />
    );
}

export default MultiSelectInput;
