import { SmallBrand } from "@/components/brand";
import { Layout } from "./_components/Layout";
import { Header } from "./_components/Header";
import { Form } from "./_components/Form";

export default function FirstAccessScreen() {
  return (
    <Layout>
      <SmallBrand />
      <Header />
      <Form />
    </Layout>
  );
}
