'use client';

import React from 'react';
import { Slider, Tooltip } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface SliderInputProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    control: Control<T>;
    minValue?: number;
    maxValue?: number;
    step?: number;
    marks?: { value: number; label: string }[];
    info?: string;
}

export function SliderInput<T extends FieldValues>({
    name,
    label,
    control,
    minValue = 0,
    maxValue = 1,
    step = 0.1,
    marks,
    info,
}: SliderInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="w-full space-y-2">
                    <div className="flex items-center gap-1">
                        <label className="text-sm font-medium text-default-700">{label} {field.value}</label>
                        {info && (
                            <Tooltip content={info} delay={0} closeDelay={0} placement="top">
                                <span className=" text-default-400">
                                    <IoInformationCircleOutline size={16} />
                                </span>
                            </Tooltip>
                        )}
                    </div>
                    <Slider
                        step={step}
                        maxValue={maxValue}
                        minValue={minValue}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        marks={marks}
                        className="max-w-md"
                        size="sm"
                        color="foreground"
                    />
                </div>
            )}
        />
    );
}

export default SliderInput;
