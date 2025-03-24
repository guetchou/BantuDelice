
import LoginForm from "@/components/clients/LoginForm";
import AddClientForm from "@/components/clients/AddClientForm";
import ClientsList from "@/components/clients/ClientsList";

export default function ClientsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <LoginForm />
          <div className="mt-8">
            <AddClientForm />
          </div>
        </div>
        <div>
          <ClientsList />
        </div>
      </div>
    </div>
  );
}
