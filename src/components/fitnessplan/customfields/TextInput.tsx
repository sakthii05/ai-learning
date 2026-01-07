'use client';

import React from 'react';
import { Input } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface TextInputProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    control: Control<T>;
}

export function TextInput<T extends FieldValues>({
    name,
    label,
    placeholder,
    disabled = false,
    control,
}: TextInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                    <Input
                        {...field}
                        label={label}
                        placeholder={placeholder}
                        isDisabled={disabled}
                        isInvalid={!!error}
                        errorMessage={error?.message}
                        variant="bordered"
                        labelPlacement="outside"
                        classNames={{
                            label: 'text-sm font-medium text-default-700',
                            input: 'text-default-900',
                            inputWrapper: 'border-default-300 hover:border-default-400',
                        }}
                    />
                </div>
            )}
        />
    );
}

export default TextInput;
