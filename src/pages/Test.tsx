import { Flex } from "@radix-ui/themes";
import DynamicAlertDialog from "../components/dynamicComponents/Card";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../components/dynamicComponents/Form";
import SimpleTabs from "../components/dynamicComponents/Tabs";

const tabs = [
{ value: "home", label: "Home", path: "/" },
  { value: "form", label: "form", path: "/test-form" },
{ value: "settings", label: "Settings", path: "/settings" },
{ value: "multi", label: "multi", path: "/test2" },
];
export default function MyApp() {

  const navigate = useNavigate()
  return (
    <Flex direction="column" gap="4">
      <SimpleTabs tabs={tabs} />
      
      <DynamicAlertDialog
        triggerText="Go to next page"
        title="Go to next page"
        description="Are you sure you want to go to next page? This action can be undone."
        cancelText="Cancel"
        actionText="Yes"
        onAction={() => navigate('/test2')}
        color="red"
      />
      <DynamicAlertDialog
        triggerText="Test Dynamic Table"
        title="Dynamic Table test"
        description="Do you want to Test Table dynamic component ?"
        cancelText="Stay"
        actionText="Yes"
        onAction={() => navigate("/table")}
        color="blue"
      />
      <DynamicAlertDialog
        triggerText="Upgrade Plan"
        title="Upgrade Plan"
        description="Upgrade to premium to unlock advanced features and priority support."
        cancelText="Not Now"
        actionText="Upgrade"
        onAction={() => alert("Plan upgraded!")}
        color="green"
      />
      <DynamicAlertDialog
        triggerText="Reset Password"
        title="Reset Password"
        description="Are you sure you want to reset your password? You will receive a reset link via email."
        cancelText="Cancel"
        actionText="Reset"
        onAction={() => alert("Password reset link sent!")}
        color="gray"
      />
      <DynamicAlertDialog
        triggerText="Archive Project"
        title="Archive Project"
        description="Archiving will remove the project from your active list. You can restore it later."
        cancelText="Cancel"
        actionText="Archive"
        onAction={() => alert("Project archived!")}
        color="blue"
      />
     
    </Flex>
    
  );
}