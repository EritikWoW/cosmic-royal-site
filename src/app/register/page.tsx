import AuthForm from "@/components/AuthForm";
export const metadata = { title: "Реєстрація" };
export default async function Register({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <div className="container page-top"><AuthForm mode="register" next={(await searchParams).next} /></div>;
}
