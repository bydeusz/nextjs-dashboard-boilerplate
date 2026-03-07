import type { Metadata } from "next";

import { UpdatePassword } from "@/components/user/UpdatePassword";
import { DeleteUser } from "@/components/user/DeleteUser";

export const metadata: Metadata = {
  title: "Account - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function Page() {
  return (
    <div className="flex flex-col gap-6">
      <UpdatePassword />
      <DeleteUser />
    </div>
  );
}
