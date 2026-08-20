import { LargeBrand } from "@/components/brand";
import { Layout } from "@/screenComponents/login/Layout";
import { Form } from "@/screenComponents/login/Form";
import { Support } from "@/screenComponents/login/Support";

export default function LoginScreen() {
  return (
    <Layout>
      <LargeBrand />
      <Form />
      <Support />
    </Layout>
  );
}
