import React, { useState } from "react";
import { Box, Button, Card, Container, Flex, Grid, Heading, Text, Section } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { DashboardIcon, PersonIcon, RocketIcon, BarChartIcon } from "@radix-ui/react-icons";

type Permission = "read" | "write" | "create" | "delete" | "admin";

const menuItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "form", label: "Form", path: "/test-form" },
  { id: "table", label: "Table", path: "/table" },
  { id: "test2", label: "Test 2", path: "/test2" },
  { id: "admin", label: "Admin", path: "/admin", permission: "admin" as Permission },
];

const user = {
  name: "Rohit Sharma",
  email: "rohit.sharma@example.com",
  permissions: ["read", "write", "admin"] as Permission[],
  avatar: "https://i.pravatar.cc/40?img=3",
};

export default function MyApp() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      {/* Hero Section */}
      <Section size="3" style={{ paddingTop: "80px", paddingBottom: "60px" }}>
        <Container size="4">
          <Flex direction="column" align="center" gap="6">
            <Heading size="9" style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
              Safar Wanderlust
            </Heading>
            <Text size="5" style={{ color: "rgba(255,255,255,0.9)", textAlign: "center", maxWidth: "600px" }}>
              Your all-in-one travel CRM solution. Manage leads, track conversions, and grow your business effortlessly.
            </Text>
            <Flex gap="4" mt="4">
              <Button size="4" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
                <DashboardIcon /> Go to Dashboard
              </Button>
              <Button size="4" variant="soft" style={{ cursor: "pointer" }}>
                Learn More
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Section>

      {/* Features Section */}
      <Section size="3" style={{ background: "white", paddingTop: "60px", paddingBottom: "60px" }}>
        <Container size="4">
          <Heading size="8" align="center" mb="6">
            Why Choose Safar Wanderlust?
          </Heading>
          <Grid columns={{ initial: "1", md: "3" }} gap="6">
            <Card style={{ padding: "24px", textAlign: "center" }}>
              <Flex direction="column" align="center" gap="3">
                <Box style={{ fontSize: "48px", color: "#667eea" }}>
                  <PersonIcon width="48" height="48" />
                </Box>
                <Heading size="5">Lead Management</Heading>
                <Text size="3" color="gray">
                  Track and manage all your travel leads in one centralized platform with ease.
                </Text>
              </Flex>
            </Card>

            <Card style={{ padding: "24px", textAlign: "center" }}>
              <Flex direction="column" align="center" gap="3">
                <Box style={{ fontSize: "48px", color: "#667eea" }}>
                  <BarChartIcon width="48" height="48" />
                </Box>
                <Heading size="5">Analytics & Insights</Heading>
                <Text size="3" color="gray">
                  Get real-time analytics and insights to make data-driven decisions for your business.
                </Text>
              </Flex>
            </Card>

            <Card style={{ padding: "24px", textAlign: "center" }}>
              <Flex direction="column" align="center" gap="3">
                <Box style={{ fontSize: "48px", color: "#667eea" }}>
                  <RocketIcon width="48" height="48" />
                </Box>
                <Heading size="5">Fast & Efficient</Heading>
                <Text size="3" color="gray">
                  Streamline your workflow and boost productivity with our intuitive interface.
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section size="3" style={{ background: "#f8f9fa", paddingTop: "60px", paddingBottom: "60px" }}>
        <Container size="3">
          <Card style={{ padding: "48px", textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <Flex direction="column" align="center" gap="4">
              <Heading size="7" style={{ color: "white" }}>
                Ready to Transform Your Travel Business?
              </Heading>
              <Text size="4" style={{ color: "rgba(255,255,255,0.9)" }}>
                Join thousands of travel professionals who trust Safar Wanderlust
              </Text>
              <Button size="4" variant="classic" style={{ cursor: "pointer", background: "white", color: "#667eea" }} onClick={() => navigate("/dashboard")}>
                Get Started Now
              </Button>
            </Flex>
          </Card>
        </Container>
      </Section>

      {/* Footer */}
      <Box style={{ background: "#1a1a2e", padding: "32px 0", color: "white" }}>
        <Container size="4">
          <Flex justify="between" align="center">
            <Text size="2">© 2025 Safar Wanderlust. All rights reserved.</Text>
            <Flex gap="4">
              <Text size="2" style={{ cursor: "pointer" }}>Privacy Policy</Text>
              <Text size="2" style={{ cursor: "pointer" }}>Terms of Service</Text>
              <Text size="2" style={{ cursor: "pointer" }}>Contact</Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}