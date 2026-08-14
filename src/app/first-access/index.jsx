import { Layout } from "./_components/Layout";
import { Brand } from "./_components/Brand";
import { Header } from "./_components/Header";
import { Form } from "./_components/Form";

export default function FirstAccessScreen() {
  return (
    <Layout>
      <Brand />
      <Header />
      <Form />
    </Layout>
  );
}
