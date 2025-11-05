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
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";
import DaywiseActivities from '../../modules/Itinerary/DaywiseActivities'
import HotelDetails from '../../modules/Itinerary/HotelDetails'
import PackageDetails from '../../modules/Itinerary/PackageDetails'
import BatchManagement from '../../modules/Itinerary/BatchManagement'

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "textarea" | "checkbox" | "radio" | "select" | "switch" | "richtext" | "file" | "number" | "multiselect" | "daywise" | "hotels" | "packages" | "batches" | "custom";
  placeholder?: string;
  options?: string[] | { value: string; label: string }[];
  fullWidth?: boolean;
  customRender?: (value: any, onChange: (value: any) => void) => React.ReactNode;
};

type DynamicFormProps = {
  fields: Field[];
  buttonText?: string;
  onSubmit?: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  buttonText = "Submit",
  onSubmit,
  initialValues = {},
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formValues);
  };

  const renderField = (field: Field) => {
    if (field.customRender) {
      return field.customRender(
        formValues[field.name],
        (value) => handleChange(field.name, value)
      );
    }

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

      case "number":
        return (
          <TextField.Root
            type="number"
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

      case "richtext":
        return (
          <RichTextEditor
            value={formValues[field.name] || ""}
            onChange={(value) => handleChange(field.name, value)}
            placeholder={field.placeholder}
            label={field.label}
          />
        );

      case "file":
        return (
          <ImageUpload
            images={formValues[field.name] || [""]}
            onChange={(images) => handleChange(field.name, images)}
            label={field.label}
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
              value={formValues[field.name] || undefined}
              onValueChange={(value) => handleChange(field.name, value)}
            >
              <Select.Trigger placeholder={field.placeholder} />
              <Select.Content>
                {field.options
                  ?.filter((option) => {
                    const optValue = typeof option === "string" ? option : option.value;
                    return optValue !== "";
                  })
                  .map((option) => {
                    const optValue = typeof option === "string" ? option : option.value;
                    const optLabel: string = typeof option === "string" ? option : (option.label ?? option.value ?? ""); // Fixed to always be string
                    return (
                      <Select.Item key={optValue} value={optValue}>
                        {optLabel}
                      </Select.Item>
                    );
                  })}
              </Select.Content>
            </Select.Root>
          );

      case "multiselect":
        // Simple multi-select implementation
        return (
          <Select.Root
            value={Array.isArray(formValues[field.name]) && formValues[field.name].length > 0
              ? formValues[field.name][0]
              : undefined}
            onValueChange={(value) => {
              const current = formValues[field.name] || [];
              const newValue = Array.isArray(current)
                ? current.includes(value)
                  ? current.filter((v) => v !== value)
                  : [...current, value]
                : [value];
              handleChange(field.name, newValue);
            }}
          >
            <Select.Trigger placeholder={field.placeholder} />
            <Select.Content>
              {field.options
                ?.filter((option) => {
                  const optValue = typeof option === "string" ? option : option.value;
                  return optValue !== "";
                })
                .map((option) => {
                  const optValue = typeof option === "string" ? option : option.value;
                  const optLabel: string = typeof option === "string" ? option : (option.label ?? option.value ?? ""); // Fixed to always be string
                  return (
                    <Select.Item key={optValue} value={optValue}>
                      {optLabel}
                    </Select.Item>
                  );
                })}
            </Select.Content>
          </Select.Root>
        );

        case "radio":
          return (
            <RadioGroup.Root
              value={formValues[field.name] || undefined}
              onValueChange={(value) => handleChange(field.name, value)}
            >
              <Flex direction="column" gap="2">
                {field.options
                  ?.filter((option) => {
                    const optValue = typeof option === "string" ? option : option.value;
                    return optValue !== "";
                  })
                  .map((option) => {
                    const optValue = typeof option === "string" ? option : option.value;
                    const optLabel: string = typeof option === "string" ? option : (option.label ?? option.value ?? ""); // Fixed to always be string
                    return (
                      <Flex key={optValue} align="center" gap="2">
                        <RadioGroup.Item value={optValue} id={`${field.name}-${optValue}`} />
                        <Text as="label" size="2" htmlFor={`${field.name}-${optValue}`}>
                          {optLabel}
                        </Text>
                      </Flex>
                    );
                  })}
              </Flex>
            </RadioGroup.Root>
          );
        case "daywise":
        return (
          <DaywiseActivities
            activities={formValues[field.name] || []}
            onChange={(activities) => handleChange(field.name, activities)}
            label={field.label}
            error={undefined}
          />
        );

      case "hotels":
        return (
          <HotelDetails
            hotels={formValues[field.name] || []}
            onChange={(hotels) => handleChange(field.name, hotels)}
            label={field.label}
            error={undefined}
          />
        );

      case "packages":
        return (
          <PackageDetails
            packages={formValues[field.name] || {
              base_packages: [],
              pickup_point: [],
              drop_point: [],
            }}
            onChange={(packages) => handleChange(field.name, packages)}
            label={field.label}
            error={undefined}
          />
        );

      case "batches":
        return (
          <BatchManagement
            batches={formValues[field.name] || []}
            onChange={(batches) => handleChange(field.name, batches)}
            label={field.label}
            error={undefined}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <form onSubmit={handleSubmit}>
        <Grid 
          columns={{ initial: "1", sm: "2" }} 
          gap="4" 
          gapY="5"
          style={{ alignItems: "start" }}
        >
          {fields.map((field) => {
            const shouldSpanFullWidth = field.fullWidth || 
            field.type === "textarea" || 
            field.type === "richtext" || 
            field.type === "file" || 
            field.type === "radio" || 
            field.type === "daywise" || 
            field.type === "hotels" || 
            field.type === "packages" || 
            field.type === "batches";
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
                {!["checkbox", "switch", "richtext", "file", "daywise", "hotels", "packages", "batches", "custom"].includes(field.type) && (
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