import { Layout } from "./_components/Layout";
import { Brand } from "./_components/Brand";
import { Form } from "./_components/Form";
import { Support } from "./_components/Support";

export default function LoginScreen() {
  return (
    <Layout>
      <Brand />
      <Form />
      <Support />
    </Layout>
  );
}
