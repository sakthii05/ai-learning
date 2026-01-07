'use client';

import React from 'react';
import { Input } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface NumberInputProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    min?: number;
    max?: number;
    disabled?: boolean;
    readOnly?: boolean;
    control: Control<T>;
}

export function NumberInput<T extends FieldValues>({
    name,
    label,
    placeholder,
    min,
    max,
    disabled = false,
    readOnly = false,
    control,
}: NumberInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                    <Input
                        {...field}
                        type="number"
                        label={label}
                        placeholder={placeholder}
                        min={min}
                        max={max}
                        isDisabled={disabled}
                        isReadOnly={readOnly}
                        isInvalid={!!error}
                        errorMessage={error?.message}
                        variant="bordered"
                        labelPlacement="outside"
                        value={field.value?.toString() || ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? undefined : Number(val));
                        }}
                        classNames={{
                            label: 'text-sm font-medium text-default-700',
                            input: 'text-default-900',
                            inputWrapper: `border-default-300 hover:border-default-400 ${readOnly ? 'bg-default-100' : ''
                                }`,
                        }}
                    />
                </div>
            )}
        />
    );
}

export default NumberInput;
