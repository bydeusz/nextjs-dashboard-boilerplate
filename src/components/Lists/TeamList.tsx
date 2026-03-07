"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { User } from "@/types/User";

import { AddUser } from "@/components/modals/Add";
import { SearchInput } from "@/components/ui/inputs/Search";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/layout/Table";
import { Skeleton } from "@/components/ui/layout/Skeleton";
import Admin from "@/components/modals/Admin";
import { DeleteUser } from "@/components/modals/Delete";
import { Badge } from "@/components/ui/labels/Badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/labels/Avatar";

interface TeamListProps {
  currentUser: string;
}

export function TeamList({ currentUser }: TeamListProps) {
  const t = useTranslations("navigation.navbar");
  const teamT = useTranslations("tables.team");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/get");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
        const foundUser = data.find((user: User) => user.id === currentUser);
        setCurrentUserData(foundUser || null);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${user.firstname || ""} ${user.surname || ""}`.trim();
    return (
      fullName.toLowerCase().includes(searchLower) ||
      (user.email || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="flex justify-between items-center space-x-4 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput
            name="search"
            id="search"
            placeholder={t("search")}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <AddUser isAdmin={currentUserData?.isAdmin || false} />
      </div>

      {isLoading ? (
        <div className="rounded-md bg-white border p-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-white border-b border-gray-100">
                <TableHead className="bg-white border-b-0 ">
                  {teamT("name")}
                </TableHead>
                <TableHead className="bg-white border-b-0 ">
                  {teamT("email")}
                </TableHead>
                <TableHead className="bg-white border-b-0 ">
                  {teamT("role")}
                </TableHead>
                <TableHead className="bg-white border-b-0">
                  {teamT("status")}
                </TableHead>
                <TableHead className="bg-white border-b-0 text-right">
                  {teamT("settings")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow
                  key={index}
                  className="bg-white border-b border-gray-100">
                  <TableCell className="border-0 bg-white py-3 ">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3 ">
                    <Skeleton className="h-3 w-[120px]" />
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3 ">
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3">
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md bg-white p-4 border">
          <Table>
            <TableHeader>
              <TableRow className="bg-white border-b border-gray-100">
                <TableHead className="bg-white border-b-0 ">
                  {teamT("name")}
                </TableHead>
                <TableHead className="bg-white border-b-0 ">
                  {teamT("email")}
                </TableHead>
                <TableHead className="bg-white border-b-0">
                  {teamT("role")}
                </TableHead>
                <TableHead className="bg-white border-b-0">
                  {teamT("status")}
                </TableHead>
                <TableHead className="bg-white border-b-0 text-right">
                  {teamT("settings")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="bg-white border-b border-gray-100">
                  <TableCell className="border-0 bg-white py-3 ">
                    <div className="flex items-center space-x-4">
                      <Avatar className="size-10">
                        <AvatarImage src={user.avatar || ""} />
                        <AvatarFallback>
                          {user.firstname?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{`${user.firstname || ""} ${user.surname || ""}`}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3 ">
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3 ">
                    {user.role || "-"}
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.isAdmin && (
                        <Badge variant="green">{teamT("admin")}</Badge>
                      )}
                      {!user.emailVerified && (
                        <Badge variant="yellow">{teamT("pending")}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <Admin
                        user={user}
                        disabled={
                          !currentUserData?.isAdmin ||
                          currentUserData?.id === user.id ||
                          !user.emailVerified
                        }
                      />
                      <DeleteUser
                        user={user}
                        disabled={
                          !currentUserData?.isAdmin ||
                          currentUserData?.id === user.id
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
