import { LargeBrand } from "@/components/brand";
import { Layout } from "./_components/Layout";
import { Form } from "./_components/Form";
import { Support } from "./_components/Support";

export default function LoginScreen() {
  return (
    <Layout>
      <LargeBrand />
      <Form />
      <Support />
    </Layout>
  );
}
