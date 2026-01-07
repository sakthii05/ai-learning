"use client";

import React from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { SelectOption } from "../types";

interface UnitNumberInputProps<T extends FieldValues> {
  name: Path<T>;
  unitName: Path<T>;
  label: string;
  placeholder?: string;
  units: SelectOption[];
  disabled?: boolean;
  control: Control<T>;
}

export function UnitNumberInput<T extends FieldValues>({
  name,
  unitName,
  label,
  placeholder,
  units,
  disabled = false,
  control,
}: UnitNumberInputProps<T>) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-3 justify-between">
        <label className="text-sm font-medium text-default-700 block mb-2">
          {label}
        </label>
        <Controller
          name={unitName}
          control={control}
          render={({ field: unitField }) => (
            <Select
              className="w-24"
              selectedKeys={unitField.value ? [unitField.value] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                unitField.onChange(selected?.toString() || units[0].value);
              }}
              isDisabled={disabled}
              variant="bordered"
              aria-label={`${label} unit`}
            >
              {units.map((unit) => (
                <SelectItem key={unit.value} textValue={unit.label}>
                  {unit.label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="flex-1">
            <Input
              {...field}
              type="number"
              placeholder={placeholder}
              isDisabled={disabled}
              isInvalid={!!error}
              variant="bordered"
              value={field.value?.toString() || ""}
              onChange={(e) => {
                const val = e.target.value;
                field.onChange(val === "" ? undefined : Number(val));
              }}
              classNames={{
                input: "text-default-900",
                inputWrapper: "border-default-300 hover:border-default-400",
              }}
            />
            {error && (
              <p className="text-xs text-danger mt-1">{error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}

export default UnitNumberInput;
