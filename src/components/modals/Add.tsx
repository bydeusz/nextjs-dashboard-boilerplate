"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/actions/Button";
import { InputField } from "@/components/ui/inputs/Input";
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

interface AddUserProps {
  isAdmin: boolean;
}

export const AddUser = ({ isAdmin }: AddUserProps) => {
  const t = useTranslations("modals.add");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [inputValue, setInputValue] = useState({
    firstname: "",
    surname: "",
    email: "",
  });

  useEffect(() => {
    setIsFormValid(
      inputValue.firstname.trim() !== "" &&
        inputValue.surname.trim() !== "" &&
        inputValue.email.trim() !== "",
    );
  }, [inputValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputValue.email,
          firstname: inputValue.firstname,
          surname: inputValue.surname,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to invite user");
      }

      // Reset form and close dialog on success
      setInputValue({ firstname: "", surname: "", email: "" });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={isAdmin ? "default" : "outline"}
            disabled={!isAdmin}
            className="disabled:opacity-50 disabled:cursor-not-allowed">
            {t("button")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("desc")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label={t("firstname")}
              type="text"
              name="firstname"
              id="firstname"
              placeholder={t("firstnamePlaceholder")}
              value={inputValue.firstname}
              onChange={handleChange}
            />

            <InputField
              label={t("surname")}
              type="text"
              name="surname"
              id="surname"
              placeholder={t("surnamePlaceholder")}
              value={inputValue.surname}
              onChange={handleChange}
            />

            <InputField
              label={t("email")}
              type="email"
              name="email"
              id="email"
              placeholder={t("emailPlaceholder")}
              value={inputValue.email}
              onChange={handleChange}
            />

            {error && (
              <Alert variant="destructive">
                <AlertTitle>{t("errorTitle")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button disabled={isLoading || !isFormValid}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2" />}
              {t("button")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
