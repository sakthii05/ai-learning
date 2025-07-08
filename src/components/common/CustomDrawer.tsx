import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";
import React, { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

const CustomDrawer = (props: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
}) => {
  const { open, onClose, children, title, size } = props;
  return (
    <Drawer
      isOpen={open}
      hideCloseButton
      backdrop="transparent"
      onClose={() => {
        onClose();
      }}
      size={size || "lg"}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex justify-between gap-5 font-medium">
              <div>{title}</div>
              <div
                className="w-9 h-9 rounded-full hover:bg-default-200 cursor-pointer flex justify-center items-center"
                onClick={() => {
                  onClose();
                }}
              >
                <IoClose />
              </div>
            </DrawerHeader>
            <DrawerBody>{children}</DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CustomDrawer;
