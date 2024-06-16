import { UserButton } from "@clerk/nextjs";
export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/sign-in" />
      <h1>This is a protected route.</h1>
    </div>
  );
}
