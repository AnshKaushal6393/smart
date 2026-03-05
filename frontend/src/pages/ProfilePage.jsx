import ProfileForm from "../components/ProfileForm";

export default function ProfilePage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">User Profile</h2>
      <p className="text-slate-400">Enter your income, expenses, debt, and goals to generate personalized AI advice.</p>
      <ProfileForm />
    </section>
  );
}
