"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/useToast";

import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/Card";
import { InputField } from "@/components/ui/inputs/Input";
import { TextArea } from "@/components/ui/inputs/TextArea";
import { Button } from "@/components/ui/actions/Button";

export default function ContactForm() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const t = useTranslations("forms.support");
  const { toast } = useToast();

  // Fetch user data from database when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/user/get");
          if (!response.ok) throw new Error("Failed to fetch user data");

          const data = await response.json();
          const fullName =
            `${data.user.firstname || ""} ${data.user.surname || ""}`.trim();
          setName(fullName);
          setEmail(data.user.email || "");
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            variant: "destructive",
            title: t("errorTitle"),
            description: "Failed to load user data",
          });
        }
      }
    };

    fetchUserData();
  }, [session, t, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAttachment(null);
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("fileTypeError"),
      });
      e.target.value = "";
      return;
    }

    // Validate file size (3MB = 3 * 1024 * 1024 bytes)
    if (file.size > 3 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("fileSizeError"),
      });
      e.target.value = "";
      return;
    }

    setAttachment(file);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("message", message);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await fetch("/api/mailer/contact", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      // Reset form except for user data
      setSubject("");
      setMessage("");
      setAttachment(null);
      // Reset file input
      const fileInput = document.getElementById(
        "attachment",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      toast({
        variant: "success",
        title: t("successTitle"),
        description: t("success"),
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label={t("name")}
            required={true}
            type="text"
            name="name"
            id="name"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!!session?.user?.id}
          />
          <InputField
            label={t("email")}
            required={true}
            type="email"
            name="email"
            id="email"
            placeholder="john@doe.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!session?.user?.id}
          />
          <InputField
            label={t("subject")}
            required={true}
            type="text"
            name="subject"
            id="subject"
            placeholder={t("subjectPlaceholder")}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextArea
            label={t("message")}
            name="message"
            id="message"
            required={true}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="space-y-2">
            <label
              htmlFor="attachment"
              className="block text-xs font-semibold text-gray-700">
              {t("attachment")}
            </label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={handleFileChange}
              className="block w-full text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm
              file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-700
              file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-gray-500">{t("attachmentHelp")}</p>
          </div>
          <div className="pt-2">
            <Button variant="default" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4" />}
              {t("submit")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
