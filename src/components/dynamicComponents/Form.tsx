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
  Grid,
  Box,
} from "@radix-ui/themes";

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "textarea" | "checkbox" | "radio" | "select" | "switch";
  placeholder?: string;
  options?: string[];
  fullWidth?: boolean; // If true, field will span both columns
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
            type={field.type}
            placeholder={field.placeholder}
            value={formValues[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );

      case "textarea":
        return (
          <TextArea
            placeholder={field.placeholder}
            value={formValues[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            style={{ minHeight: "80px" }}
          />
        );

      case "checkbox":
        return (
          <Flex align="center" gap="2">
            <Checkbox
              checked={formValues[field.name] || false}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
            />
            <Text size="2">{field.label}</Text>
          </Flex>
        );

      case "switch":
        return (
          <Flex align="center" gap="2">
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
    <Card style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>
      <form onSubmit={handleSubmit}>
        <Grid 
          columns={{ initial: "1", sm: "2" }} 
          gap="4" 
          gapY="5"
          style={{ alignItems: "start" }}
        >
          {fields.map((field) => {
            const shouldSpanFullWidth = field.fullWidth || field.type === "textarea" || field.type === "radio";
            const gridColumn = shouldSpanFullWidth ? "1 / -1" : "auto";
            
            return (
              <Box 
                key={field.name} 
                style={{ 
                  gridColumn,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px"
                }}
              >
                {/* Only show label for fields that don't have inline labels */}
                {!["checkbox", "switch"].includes(field.type) && (
                  <Text as="label" size="2" weight="medium" style={{ color: "var(--accent-12)" }}>
                    {field.label}
                  </Text>
                )}
                
                {renderField(field)}
              </Box>
            );
          })}
        </Grid>
        
        {/* Submit Button - Always full width */}
        <Box style={{ gridColumn: "1 / -1", marginTop: "24px" }}>
          <Button type="submit" size="3" style={{ width: "100%" }}>
            {buttonText}
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default DynamicForm;