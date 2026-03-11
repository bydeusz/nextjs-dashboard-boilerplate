"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { User } from "@/types/User";
import { useAuth } from "@/providers/AuthProvider";
import {
  getUserGetListQueryKey,
  useUserDelete,
} from "@/generated/api/endpoints";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/actions/Button";
import { InputField } from "@/components/ui/inputs/Input";
import { Loader2 } from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/messages/Alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/messages/Dialog";
import { Trash2 } from "lucide-react";

interface DeleteUserProps {
  user: User;
  disabled?: boolean;
  buttonText?: string;
}

export function DeleteUser({ user, disabled, buttonText }: DeleteUserProps) {
  const t = useTranslations("modals.delete");
  const queryClient = useQueryClient();
  const { user: currentUser, logout } = useAuth();
  const { mutateAsync: deleteUserMutation } = useUserDelete();
  const [inputValue, setInputValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const fullName = `${user.firstname || ""} ${user.surname || ""}`.trim();

  useEffect(() => {
    const validateInput = () => {
      setIsButtonDisabled(inputValue !== fullName);
    };
    validateInput();
  }, [inputValue, fullName]);

  const deleteUser = async (id: string) => {
    setIsLoading(true);
    setError("");

    try {
      await deleteUserMutation({ id });

      setOpen(false);

      // Check if the deleted user is the current user
      if (currentUser?.id === id) {
        await logout();
      } else {
        await queryClient.invalidateQueries({
          queryKey: getUserGetListQueryKey({}),
        });
      }
    } catch (err) {
      const maybeMessage =
        err &&
        typeof err === "object" &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : null;

      setError(
        maybeMessage ?? (err instanceof Error ? err.message : "Failed to delete user"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size={buttonText ? "default" : "icon"}
          disabled={disabled}>
          <Trash2 className="size-5" /> {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("desc")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            name="name"
            id="name"
            type="text"
            label={`${t("label")} "${fullName}"`}
            placeholder={t("placeholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t("error.title")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="button"
            variant="destructive"
            disabled={isButtonDisabled}
            onClick={() => {
              if (user?.id) {
                deleteUser(user.id);
              } else {
                setError("User ID is undefined");
              }
            }}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2" />}
            {t("button")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
