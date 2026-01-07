'use client';

import React from 'react';
import { Select, SelectItem } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { SelectOption } from '../types';

interface SelectInputProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    options: SelectOption[];
    disabled?: boolean;
    control: Control<T>;
}

export function SelectInput<T extends FieldValues>({
    name,
    label,
    placeholder = 'Select an option',
    options,
    disabled = false,
    control,
}: SelectInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                    <Select
                        label={label}
                        placeholder={placeholder}
                        selectedKeys={field.value ? [field.value.toString()] : []}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            field.onChange(selected?.toString() || '');
                        }}
                        isDisabled={disabled}
                        isInvalid={!!error}
                        errorMessage={error?.message}
                        variant="bordered"
                        labelPlacement="outside"
                        classNames={{
                            label: 'text-sm font-medium text-default-700',
                            trigger: 'border-default-300 hover:border-default-400',
                            value: 'text-default-900',
                        }}
                    >
                        {options.map((option) => (
                            <SelectItem key={option.value} textValue={option.label}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            )}
        />
    );
}

export default SelectInput;
