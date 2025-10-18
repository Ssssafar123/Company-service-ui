import React from "react";
import DynamicForm from "../components/dynamicComponents/Form";
import SimpleTabs from "../components/dynamicComponents/Tabs";
import { Text } from "@radix-ui/themes";
const tabs = [
  { value: "home", label: "Home", path: "/" },
  { value: "form", label: "form", path: "/test-form" },
  { value: "settings", label: "Settings", path: "/settings" },
  { value: "multi", label: "multi", path: "/test2" },
];


const profileFields = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text" as const,
    placeholder: "Enter your full name"
  },
  {
    name: "contact",
    label: "Contact Number",
    type: "text" as const,
    placeholder: "Enter your phone number"
  },
  {
    name: "address",
    label: "Address",
    type: "textarea" as const,
    placeholder: "Your address"
  },
  {
    name: "country",
    label: "Country",
    type: "select" as const,
    options: ["India", "USA", "UK", "Canada", "Australia"],
    placeholder: "Select country"
  },
  {
    name: "newsletter",
    label: "Receive Updates",
    type: "checkbox" as const
  },
  {
    name: "accountType",
    label: "Account Type",
    type: "radio" as const,
    options: ["Personal", "Business", "Other"]
  },
  {
    name: "darkMode",
    label: "Enable Dark Mode",
    type: "switch" as const
  },
];

export default function ProfileForm() {
  return (
    <>
    <SimpleTabs tabs={tabs} />
    <DynamicForm
      fields={profileFields}
      buttonText="Save Profile"
      onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      />
      </>
    
  );
}