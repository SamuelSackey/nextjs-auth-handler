import { createServerComponentAuth } from "@/lib/server-auth";
import Link from "next/link";

export default async function Home() {
  const {
    data: { session },
  } = await createServerComponentAuth().getSession();

  const user = session?.user;

  return (
    <div>
      <h1 className="text-xl mb-8">Hello {user?.username}</h1>

      <Link href={"/account"}>
        <button>Account Details</button>
      </Link>
    </div>
  );
}
