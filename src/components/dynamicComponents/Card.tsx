import React from "react";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";

const DynamicAlertDialog = ({
  triggerText,
  title,
  description,
  cancelText = "Cancel",
  actionText = "Confirm",
  onAction,
  color = "red",
}: {
  triggerText: string;
     title: string;
  description: string;
  cancelText?: string;
  actionText?: string;
  onAction?: () => void;
  color?: "red" | "blue" | "green" | "gray";
}) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger>
      <Button style={{width : "200px"}} color={color}>{triggerText}</Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content maxWidth="450px">
      <AlertDialog.Title>{title}</AlertDialog.Title>
      <AlertDialog.Description size="2">{description}</AlertDialog.Description>
      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Cancel>
          <Button variant="soft" color="gray">
            {cancelText}
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button variant="solid" color={color} onClick={onAction}>
            {actionText}
          </Button>
        </AlertDialog.Action>
      </Flex>
    </AlertDialog.Content>
  </AlertDialog.Root>
);

export default DynamicAlertDialog;