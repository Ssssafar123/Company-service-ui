import React, { useState, useEffect } from "react";
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
import SEOFields from '../../modules/Itinerary/SEOFields'
type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "textarea" | "checkbox" | "radio" | "select" | "switch" | "richtext" | "file" | "number" | "multiselect" | "daywise" | "hotels" | "packages" | "batches" | "custom" | "seo" | "date";
  placeholder?: string;
  options?: string[] | { value: string; label: string }[];
  fullWidth?: boolean;
  singleImage?: boolean;
  required?: boolean; 
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

  // Update form values when initialValues prop changes
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

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
            images={Array.isArray(formValues[field.name]) 
              ? formValues[field.name] 
              : (formValues[field.name] ? [formValues[field.name]] : [""])}
            onChange={(images) => handleChange(field.name, images)}
            label={field.label}
            singleImage={field.singleImage}
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
        // Multi-select implementation with checkboxes
        const selectedValues = Array.isArray(formValues[field.name]) ? formValues[field.name] : (formValues[field.name] ? [formValues[field.name]] : []);
        const selectedLabels = field.options
          ?.filter((option) => {
            const optValue = typeof option === "string" ? option : option.value;
            return selectedValues.includes(optValue);
          })
          .map((option) => {
            const optLabel: string = typeof option === "string" ? option : (option.label ?? option.value ?? "");
            return optLabel;
          })
          .join(", ") || "";
        
        return (
          <Box>
            <Select.Root
              value={selectedValues.length > 0 ? selectedValues[0] : undefined}
              onValueChange={(value) => {
                const current = Array.isArray(formValues[field.name]) ? formValues[field.name] : (formValues[field.name] ? [formValues[field.name]] : []);
                const newValue = current.includes(value)
                ? current.filter((v: string) => v !== value)
               : [...current, value];
                handleChange(field.name, newValue);
              }}
            >
              <Select.Trigger placeholder={field.placeholder}>
                {selectedLabels || field.placeholder}
              </Select.Trigger>
              <Select.Content>
                {field.options
                  ?.filter((option) => {
                    const optValue = typeof option === "string" ? option : option.value;
                    return optValue !== "";
                  })
                  .map((option) => {
                    const optValue = typeof option === "string" ? option : option.value;
                    const optLabel: string = typeof option === "string" ? option : (option.label ?? option.value ?? "");
                    const isSelected = selectedValues.includes(optValue);
                    return (
                      <Select.Item key={optValue} value={optValue}>
                        <Flex align="center" gap="2">
                         <Checkbox checked={isSelected} disabled />
                          <Text>{optLabel}</Text>
                        </Flex>
                      </Select.Item>
                    );
                  })}
              </Select.Content>
            </Select.Root>
            {selectedLabels && (
              <Text size="1" style={{ color: 'var(--accent-11)', marginTop: '4px' }}>
                Selected: {selectedLabels}
              </Text>
            )}
          </Box>
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

        case "seo":
          return (
            <SEOFields
              seoData={formValues[field.name] || null}
              onChange={(seoData) => handleChange(field.name, seoData)}
              label={field.label}
              error={undefined}
            />
          );

          case "date":
            return (
              <Box style={{ position: 'relative' }}>
                <TextField.Root
                  name={field.name}
                  type="date"
                  value={formValues[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    paddingRight: '40px',
                  }}
                />
            <Box
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--accent-11)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1V3M11 1V3M2 5H14M3 3H13C13.5523 3 14 3.44772 14 4V14C14 14.5523 13.5523 15 13 15H3C2.44772 15 2 14.5523 2 14V4C2 3.44772 2.44772 3 3 3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          </Box>
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
            field.type === "seo";
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
                {!["checkbox", "switch", "richtext", "file", "daywise", "hotels", "packages", "batches", "custom", "seo"].includes(field.type) && (
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