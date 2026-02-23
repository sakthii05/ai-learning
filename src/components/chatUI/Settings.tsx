'use client';

import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import React from 'react'
import { IoSettings } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import SliderInput from '../inputs/SliderInput'
import TextboxInput from '../inputs/TextboxInput'

interface SettingsFormValues {
    temperature: number;
    systemPrompt: string;
}

const schema = yup.object().shape({
    temperature: yup.number().required().min(0).max(1),
    systemPrompt: yup.string().required('System prompt cannot be empty').trim(),
})

interface SettingsProps {
    initialValues?: SettingsFormValues;
    onSave: (values: SettingsFormValues) => void;
}

const Settings = ({
    initialValues = { temperature: 0.7, systemPrompt: "" },
    onSave
}: SettingsProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { control, handleSubmit, reset } = useForm<SettingsFormValues>({
        defaultValues: initialValues,
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: { temperature: number; systemPrompt: string }) => {
        onSave(data);
        setIsOpen(false);
    };

    const handleCancel = () => {
        reset(initialValues);
        setIsOpen(false);
    };

    return (
        <Popover
            isOpen={isOpen}
            onOpenChange={(open) => setIsOpen(open)}
            showArrow
            offset={10}
            placement="bottom-end"
        >
            <PopoverTrigger>
                <div className="w-6 h-6 flex justify-center items-center cursor-pointer">
                    <IoSettings className="text-xl text-default-500 hover:text-default-800 transition-colors" />
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="p-2 w-[300px]">
                    <h3 className="text-lg font-medium mb-4 text-default-800">Model settings</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <SliderInput
                            name="temperature"
                            label="Temperature"
                            control={control}
                            info="controlling output randomness (0 Deterministic - 1 Creativity)"
                            minValue={0}
                            maxValue={1}
                            step={0.1}
                        />
                        <TextboxInput
                            name="systemPrompt"
                            label="System Prompt"
                            control={control}
                            placeholder="Type system instructions here..."
                            minRows={3}
                            maxRows={8}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                size="sm"
                                variant="flat"
                                onPress={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                color="primary"
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default Settings