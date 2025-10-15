import { Button, Card, Flex, Text } from "@radix-ui/themes";

function ThemeTest() {
  return (
    <Flex direction="column" gap="4" p="4">
      <Card>
        <Text size="4" weight="bold">Theme Test</Text>
        <br />
        <br />
        <Text size="2" color="gray">Try toggling the theme above!</Text>
        <br />
        <br />
        <Button variant="solid" color="mint">Mint Button</Button>
        <br />
        <br />
        <Button variant="soft" color="red">Red Button</Button>
      </Card>
     <Card>
      <Text size="4" color="tomato" >Hey kaise ho ? </Text>
     </Card>
    </Flex>
  );
}

export default ThemeTest;