'use client';

import React from 'react';
import { Textarea } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface TextboxInputProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    maxLength?: number;
    minRows?: number;
    maxRows?: number;
    control: Control<T>;
}

export function TextboxInput<T extends FieldValues>({
    name,
    label,
    placeholder = '',
    description,
    disabled = false,
    maxLength,
    minRows = 3,
    maxRows = 6,
    control,
}: TextboxInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                    <Textarea
                        label={label}
                        placeholder={placeholder}
                        value={field.value || ''}
                        onValueChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        isDisabled={disabled}
                        isInvalid={!!error}
                        errorMessage={error?.message}
                        maxLength={maxLength}
                        minRows={minRows}
                        maxRows={maxRows}
                        variant="bordered"
                        labelPlacement="outside"
                        description={description}
                        classNames={{
                            label: 'text-sm font-medium text-default-700',
                            input: 'text-default-900',
                            inputWrapper: 'border-default-300 hover:border-default-400',
                            description: 'text-xs text-default-500',
                        }}
                    />
                    {maxLength && (
                        <p className="text-xs text-default-400 text-right mt-1">
                            {(field.value?.length || 0)}/{maxLength}
                        </p>
                    )}
                </div>
            )}
        />
    );
}

export default TextboxInput;
