import { SmallBrand } from "@/components/brand";
import { Layout } from "@/screenComponents/first-access/Layout";
import { Header } from "@/screenComponents/first-access/Header";
import { Form } from "@/screenComponents/first-access/Form";

export default function FirstAccessScreen() {
  return (
    <Layout>
      <SmallBrand />
      <Header />
      <Form />
    </Layout>
  );
}
