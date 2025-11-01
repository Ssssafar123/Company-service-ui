import React from "react";
import DynamicForm from "../components/dynamicComponents/Form"

const App = () => {
  const formFields = [
    // Row 1
    { 
      name: "firstName", 
      label: "First Name", 
      type: "text" as const, 
      placeholder: "Enter your first name" 
    },
    { 
      name: "lastName", 
      label: "Last Name", 
      type: "text" as const, 
      placeholder: "Enter your last name" 
    },
    
    { 
      name: "firstName", 
      label: "First Name", 
      type: "text" as const, 
      placeholder: "Enter your hululu name" 
    },
    { 
      name: "lastName", 
      label: "Last Name", 
      type: "text" as const, 
      placeholder: "Enter your asdasd name" 
    },
    
    { 
      name: "firstName", 
      label: "First Name", 
      type: "text" as const, 
      placeholder: "Enter your first name" 
    },
    { 
      name: "lastName", 
      label: "Last Name", 
      type: "text" as const, 
      placeholder: "Enter your last name" 
    },
    
    // Row 2
    { 
      name: "email", 
      label: "Email Address", 
      type: "email" as const, 
      placeholder: "your@email.com" 
    },
    { 
      name: "phone", 
      label: "Phone Number", 
      type: "text" as const, 
      placeholder: "+1 (555) 123-4567" 
    },
    
    // Row 3
    { 
      name: "company", 
      label: "Company", 
      type: "text" as const, 
      placeholder: "Your company name" 
    },
    { 
      name: "position", 
      label: "Position", 
      type: "text" as const, 
      placeholder: "Your job title" 
    },
    
    // Full width fields
    { 
      name: "bio", 
      label: "Bio", 
      type: "textarea" as const, 
      placeholder: "Tell us about yourself...",
      fullWidth: true 
    },
    
    // Row 4
    { 
      name: "country", 
      label: "Country", 
      type: "select" as const, 
      options: ["USA", "Canada", "UK", "Australia", "Germany", "France"] 
    },
    { 
      name: "language", 
      label: "Preferred Language", 
      type: "select" as const, 
      options: ["English", "Spanish", "French", "German", "Chinese"] 
    },
    
    // Row 5 - Checkboxes and Switches
    { 
      name: "newsletter", 
      label: "Subscribe to newsletter", 
      type: "checkbox" as const 
    },
    { 
      name: "notifications", 
      label: "Enable notifications", 
      type: "switch" as const 
    },
    
    // Full width radio group
    { 
      name: "experience", 
      label: "Experience Level", 
      type: "radio" as const, 
      options: ["Beginner", "Intermediate", "Advanced", "Expert"] 
    },
  ];

  const handleSubmit = (values: Record<string, any>) => {
    console.log("Form submitted:", values);
    alert("Check console for form data!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Registration</h1>
      <DynamicForm 
        fields={formFields}
        buttonText="Create Account"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default App;