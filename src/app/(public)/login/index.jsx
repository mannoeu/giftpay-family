import { LoginBrand } from "@/components/brand";
import { Layout } from "./_components/Layout";
import { Form } from "./_components/Form";
import { Support } from "./_components/Support";

export default function LoginScreen() {
  return (
    <Layout>
      <LoginBrand />
      <Form />
      <Support />
    </Layout>
  );
}
