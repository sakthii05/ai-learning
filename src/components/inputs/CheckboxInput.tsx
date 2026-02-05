'use client';

import React from 'react';
import { Checkbox } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface CheckboxInputProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    description?: string;
    disabled?: boolean;
    control: Control<T>;
}

export function CheckboxInput<T extends FieldValues>({
    name,
    label,
    description,
    disabled = false,
    control,
}: CheckboxInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                    <Checkbox
                        isSelected={field.value}
                        onValueChange={(checked) => field.onChange(checked)}
                        isDisabled={disabled}
                        isInvalid={!!error}
                        classNames={{
                            label: 'text-sm font-medium text-default-700 text-wrap',
                            wrapper: 'group-data-[selected=true]:border-primary',
                        }}
                    >
                       {label}
                    </Checkbox>
                    {description && (
                        <p className="text-xs text-default-500 ml-7 mt-1">{description}</p>
                    )}
                    {error && (
                        <p className="text-xs text-danger ml-7 mt-1">{error.message}</p>
                    )}
                </div>
            )}
        />
    );
}

export default CheckboxInput;
