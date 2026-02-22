import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react';
import React from 'react'
import { CiImageOn } from 'react-icons/ci';
import { FaGoogle } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';
interface AddMenuProps {
    models: { key: string, name: string, icon: React.ReactNode,description:string }[]
    selectedModel: string
    setSelectedModel: (model: string) => void
    onAddFiles: () => void
}

const AddMenu = (props: AddMenuProps) => {
    const { models, selectedModel, setSelectedModel, onAddFiles } = props


    return (
        <Dropdown>
            <DropdownTrigger>
                <div
                    className="w-6 h-6 rounded-full bg-default-400 flex justify-center items-center text-white cursor-pointer hover:bg-default-500 transition-colors"
                    title="Add files"
                >
                    <IoMdAdd size={18} />
                </div>
            </DropdownTrigger>
            <DropdownMenu selectionMode='single' selectedKeys={new Set([selectedModel])} aria-label="chat add menu" variant="faded" onSelectionChange={(key) => {
                if (key.currentKey === 'image') {
                    onAddFiles()
                } else if (key.currentKey) {
                    setSelectedModel(key.currentKey)
                }
            }}>

                <DropdownSection title="Menu">
                    <DropdownItem
                        key="image"



                        startContent={<CiImageOn size={18} />}
                    >
                        Add Image
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Models">
                    {
                        models.map((model) => (
                            <DropdownItem key={model.key} startContent={model.icon} description={model.description}>
                                {model.name}
                            </DropdownItem>
                        ))
                    }
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>

    );
}

export default AddMenu