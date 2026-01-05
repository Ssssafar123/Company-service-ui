import React, { useState, useEffect, useRef } from "react";
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
  isSubmitting?: boolean;
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  buttonText = "Submit",
  onSubmit,
  initialValues = {},
  isSubmitting = false,
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const prevInitialValuesRef = useRef<string>('');

  // Update form values when initialValues prop changes (only on mount or when key changes)
  useEffect(() => {
    // Create a string representation of initialValues to detect actual changes
    const currentInitialValuesStr = JSON.stringify(initialValues);
    
    // Only update if this is the first render or if initialValues actually changed
    if (prevInitialValuesRef.current === '' || prevInitialValuesRef.current !== currentInitialValuesStr) {
      if (Object.keys(initialValues).length > 0) {
        setFormValues(initialValues);
        prevInitialValuesRef.current = currentInitialValuesStr;
      }
    }
  }, [initialValues]);

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validation function
  const validateField = (field: Field, value: any): string | null => {
    if (!field.required) return null;

    // Check if field is empty
    if (value === null || value === undefined || value === '') {
      return `${field.label} is required`;
    }

    // Special validation for arrays
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `${field.label} is required`;
      }
      // For file arrays, check if there's at least one non-empty value
      if (field.type === 'file') {
        const hasFile = value.some((item: any) => {
          if (item instanceof File) return true;
          if (typeof item === 'string' && item.trim() !== '') return true;
          return false;
        });
        if (!hasFile) {
          return `${field.label} is required`;
        }
      }
    }

    // Special validation for objects (package_details)
    if (field.type === 'packages' && typeof value === 'object') {
      const hasBasePackages = value.base_packages && Array.isArray(value.base_packages) && value.base_packages.length > 0;
      if (!hasBasePackages) {
        return `${field.label} must have at least one base package`;
      }
    }

    // Special validation for batches
    if (field.type === 'batches' && Array.isArray(value)) {
      if (value.length === 0) {
        return `${field.label} must have at least one batch`;
      }
    }

    // Special validation for richtext (strip HTML tags)
    if (field.type === 'richtext' && typeof value === 'string') {
      const textContent = value.replace(/<[^>]*>/g, '').trim();
      if (textContent === '') {
        return `${field.label} is required`;
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      if (field.type === 'custom' || field.name.startsWith('_')) {
        return; // Skip custom render fields and separators
      }

      const value = formValues[field.name];
      const error = validateField(field, value);

      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if already submitting
    if (isSubmitting) {
      return;
    }
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    fields.forEach((field) => {
      if (field.type !== 'custom' && !field.name.startsWith('_')) {
        allTouched[field.name] = true;
      }
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    onSubmit?.(formValues);
  };

  const renderField = (field: Field) => {
    if (field.customRender) {
      return field.customRender(
        formValues[field.name],
        (value) => handleChange(field.name, value)
      );
    }

    const fieldError = errors[field.name];
    const isTouched = touched[field.name];

    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <Box>
            <TextField.Root
              type={field.type}
              placeholder={field.placeholder}
              value={formValues[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              color={fieldError && isTouched ? "red" : undefined}
            />
            {fieldError && isTouched && (
              <Text size="1" style={{ color: 'var(--red-9)', marginTop: '4px', display: 'block' }}>
                {fieldError}
              </Text>
            )}
          </Box>
        );

      case "number":
        return (
          <Box>
            <TextField.Root
              type="number"
              placeholder={field.placeholder}
              value={formValues[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              color={fieldError && isTouched ? "red" : undefined}
            />
            {fieldError && isTouched && (
              <Text size="1" style={{ color: 'var(--red-9)', marginTop: '4px', display: 'block' }}>
                {fieldError}
              </Text>
            )}
          </Box>
        );

      case "textarea":
        return (
          <Box>
            <TextArea
              placeholder={field.placeholder}
              value={formValues[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              style={{ minHeight: "80px" }}
            />
            {fieldError && isTouched && (
              <Text size="1" style={{ color: 'var(--red-9)', marginTop: '4px', display: 'block' }}>
                {fieldError}
              </Text>
            )}
          </Box>
        );

      case "richtext":
        return (
          <Box>
            <RichTextEditor
              value={formValues[field.name] || ""}
              onChange={(value) => handleChange(field.name, value)}
              placeholder={field.placeholder}
              label={field.label}
            />
            {fieldError && isTouched && (
              <Text size="1" style={{ color: 'var(--red-9)', marginTop: '4px', display: 'block' }}>
                {fieldError}
              </Text>
            )}
          </Box>
        );

      case "file":
        return (
          <Box>
            <ImageUpload
              images={Array.isArray(formValues[field.name]) 
                ? formValues[field.name] 
                : (formValues[field.name] ? [formValues[field.name]] : [""])}
              onChange={(images) => handleChange(field.name, images)}
              label={field.label}
              singleImage={field.singleImage}
              error={fieldError && isTouched ? fieldError : undefined}
            />
          </Box>
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
          <Box>
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
                    const optLabel: string = typeof option === "string" ? option : (option.label ?? option.value ?? "");
                    return (
                      <Select.Item key={optValue} value={optValue}>
                        {optLabel}
                      </Select.Item>
                    );
                  })}
              </Select.Content>
            </Select.Root>
            {fieldError && isTouched && (
              <Text size="1" style={{ color: 'var(--red-9)', marginTop: '4px', display: 'block' }}>
                {fieldError}
              </Text>
            )}
          </Box>
        );

      case "multiselect":
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
            {fieldError && isTouched && (
              <Text size="1" style={{ color: 'var(--red-9)', marginTop: '4px', display: 'block' }}>
                {fieldError}
              </Text>
            )}
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
                  const optLabel: string = typeof option === "string" ? option : (option.label ?? option.value ?? "");
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
            error={fieldError && isTouched ? fieldError : undefined}
          />
        );

      case "hotels":
        return (
          <HotelDetails
            hotels={formValues[field.name] || []}
            onChange={(hotels) => handleChange(field.name, hotels)}
            label={field.label}
            error={fieldError && isTouched ? fieldError : undefined}
          />
        );

      case "packages":
        return (
          <Box>
            <PackageDetails
              packages={formValues[field.name] || {
                base_packages: [],
                pickup_point: [],
                drop_point: [],
              }}
              onChange={(packages) => handleChange(field.name, packages)}
              label={field.label}
              error={fieldError && isTouched ? fieldError : undefined}
            />
          </Box>
        );

      case "batches":
        return (
          <Box>
            <BatchManagement
              batches={formValues[field.name] || []}
              onChange={(batches) => handleChange(field.name, batches)}
              label={field.label}
              error={fieldError && isTouched ? fieldError : undefined}
            />
          </Box>
        );

      case "seo":
        return (
          <SEOFields
            seoData={formValues[field.name] || null}
            onChange={(seoData) => handleChange(field.name, seoData)}
            label={field.label}
            error={fieldError && isTouched ? fieldError : undefined}
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
              color={fieldError && isTouched ? "red" : undefined}
              style={{
                width: '100%',
                paddingRight: '40px',
              }}
            />
            {fieldError && isTouched && (
              <Text size="1" style={{ color: 'var(--red-9)', marginTop: '4px', display: 'block' }}>
                {fieldError}
              </Text>
            )}
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
            field.type === "batches" ||
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
                    {field.required && <Text style={{ color: 'var(--red-9)' }}> *</Text>}
                  </Text>
                )}
                
                {renderField(field)}
              </Box>
            );
          })}
        </Grid>
        
        {/* Submit Button - Always full width */}
        <Box style={{ gridColumn: "1 / -1", marginTop: "24px" }}>
          <Button 
            type="submit" 
            size="3" 
            style={{ width: "100%" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : buttonText}
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default DynamicForm;