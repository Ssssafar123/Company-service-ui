import { Flex } from "@radix-ui/themes";
import DynamicAlertDialog from "../components/dynamicComponents/Card";
import { useNavigate } from "react-router-dom";
export default function MyApp() {
  const navigate = useNavigate()
  return (
    <Flex direction="column" gap="4">
      
      <DynamicAlertDialog
        triggerText="Go to next page"
        title="Delete Account"
        description="Are you sure you want to go to next page? This action can be undone."
        cancelText="Cancel"
        actionText="Yes"
        onAction={() => navigate('/test2')}
        color="red"
      />
      <DynamicAlertDialog
        triggerText="Sign Out"
        title="Sign Out"
        description="Do you want to sign out from your current session?"
        cancelText="Stay"
        actionText="Sign Out"
        onAction={() => alert("Signed out!")}
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