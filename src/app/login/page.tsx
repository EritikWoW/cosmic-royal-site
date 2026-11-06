import AuthForm from "@/components/AuthForm";
export const metadata = { title: "Вхід" };
export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <div className="container page-top"><AuthForm mode="login" next={(await searchParams).next} /></div>;
}
