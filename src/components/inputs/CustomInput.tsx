import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
  FieldErrors,
} from "react-hook-form";
import { Input } from "@heroui/react";
import { ErrorMessage } from "@hookform/error-message";
import { ReactNode, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

interface CustomInputsProps {
  label: string;
  name: keyof FieldValues;
  errors: FieldErrors<FieldValues>;
  isrequired?: boolean;
  rules?: RegisterOptions<FieldValues>;
  control: Control<any>;
  disabled?: boolean;
  type?: "text" | "password" | "number";
  autoComplete?: string;
  afterChange?: (val: string) => void;
  startContent?: ReactNode;
  placeholder?: boolean;
  size?: "lg" | "sm" | "md";
}

const CustomInput = (props: CustomInputsProps) => {
  const {
    label,
    name,
    isrequired,
    rules,
    errors,
    control,
    disabled,
    type,
    autoComplete,
    startContent,
    afterChange,
    placeholder,
    size,
  } = props;

  const [currentInputType, setCurrentInputType] = useState(
    type ? type : "text"
  );

  return (
    <div className="relative">
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={""}
        render={({ field }) => (
          <>
            <Input
              {...field}
              key={name}
              onValueChange={(e) => {
                field.onChange(e);
                afterChange && afterChange(e);
              }}
              onBlur={(e) => {
                field.onChange(e.target.value.trim());
                field.onBlur();
              }}
              value={field.value}
              isDisabled={disabled}
              isInvalid={errors[name] ? true : false}
              size={size ? size : "md"}
              type={currentInputType}
              autoComplete={autoComplete}
              startContent={startContent}
              variant="bordered"
              label={!placeholder && `${label} ${isrequired ? "*" : ""}`}
              placeholder={placeholder ? `${label} ${isrequired ? "*" : ""}` : undefined}
              endContent={
                type === "password" ? (
                  currentInputType === "password" ? (
                    <IoEye
                      className=" cursor-pointer text-default-400 text-lg"
                      onClick={() => setCurrentInputType("text")}
                    />
                  ) : (
                    <IoEyeOff
                      className=" cursor-pointer text-default-400 text-lg"
                      onClick={() => setCurrentInputType("password")}
                    />
                  )
                ) : (
                  <></>
                )
              }
            />
            <ErrorMessage
              errors={errors}
              name={name}
              render={(field) => (
                <div className="text-danger  text-sm pt-1">{field.message}</div>
              )}
            />
          </>
        )}
      />
    </div>
  );
};
export default CustomInput;
