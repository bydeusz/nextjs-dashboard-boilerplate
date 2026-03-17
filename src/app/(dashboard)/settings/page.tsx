import type { Metadata } from "next";

import { UpdateUser } from "@/components/user/UpdateUser";
import { UpdateAvatar } from "@/components/user/UpdateAvatar";
import { UpdatePassword } from "@/components/user/UpdatePassword";
import { DeleteUser } from "@/components/user/DeleteUser";

export const metadata: Metadata = {
  title: "Settings - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function Page() {
  return (
    <div className="flex flex-col gap-6">
      <UpdateUser />
      <UpdateAvatar />
      <UpdatePassword />
      <DeleteUser />
    </div>
  );
}
