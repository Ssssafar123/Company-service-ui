import React, { useState } from "react";
import {
  Card,
  Flex,
  Text,
  Button,
  TextField,
  Checkbox,
  Select,
  RadioGroup,
  Switch,
  TextArea,
} from "@radix-ui/themes";

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "textarea" | "checkbox" | "radio" | "select" | "switch";
  placeholder?: string;
  options?: string[];
};

type DynamicFormProps = {
  fields: Field[];
  buttonText?: string;
  onSubmit?: (values: Record<string, any>) => void;
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  buttonText = "Submit",
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formValues);
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <TextField.Root
            key={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formValues[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );

      case "textarea":
        return (
          <TextArea
            key={field.name}
            placeholder={field.placeholder}
            value={formValues[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );

      case "checkbox":
        return (
          <Flex key={field.name} align="center" gap="2">
            <Checkbox
              checked={formValues[field.name] || false}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
            />
            <Text size="2">{field.label}</Text>
          </Flex>
        );

      case "switch":
        return (
          <Flex key={field.name} align="center" gap="2">
            <Switch
              checked={formValues[field.name] || false}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
            />
            <Text size="2">{field.label}</Text>
          </Flex>
        );

      case "select":
        return (
          <Select.Root
            key={field.name}
            value={formValues[field.name] || ""}
            onValueChange={(value) => handleChange(field.name, value)}
          >
            <Select.Trigger placeholder={field.placeholder} />
            <Select.Content>
              {field.options?.map((option) => (
                <Select.Item key={option} value={option}>
                  {option}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        );

      case "radio":
        return (
          <RadioGroup.Root
            key={field.name}
            value={formValues[field.name] || ""}
            onValueChange={(value) => handleChange(field.name, value)}
          >
            <Flex direction="column" gap="2">
              {field.options?.map((option) => (
                <Flex key={option} align="center" gap="2">
                  <RadioGroup.Item value={option} id={`${field.name}-${option}`} />
                  <Text as="label" size="2" htmlFor={`${field.name}-${option}`}>
                    {option}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </RadioGroup.Root>
        );

      default:
        return null;
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="3">
          {fields.map((field) => (
            <div key={field.name}>
              {/* Only show label for fields that don't have inline labels */}
              {!["checkbox", "switch", "radio"].includes(field.type) && (
                <Text as="label" size="2" weight="bold">
                  {field.label}
                </Text>
              )}
              {renderField(field)}
            </div>
          ))}
          
          <Button type="submit" style={{ marginTop: "16px" }}>
            {buttonText}
          </Button>
        </Flex>
      </form>
    </Card>
  );
};

export default DynamicForm;