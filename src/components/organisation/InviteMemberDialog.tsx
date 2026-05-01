"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, UserPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  getOrganisationMemberListQueryKey,
  useOrganisationMemberInvite,
} from "@/generated/api/endpoints";
import type { InviteMemberDto } from "@/generated/api/model/inviteMemberDto";
import { OrganisationRole } from "@/generated/api/model/organisationRole";
import { extractErrorMessage } from "@/helpers/api-error";

import { Button } from "@/components/ui/actions/Button";
import { InputField } from "@/components/ui/inputs/Input";
import { SelectInput } from "@/components/ui/inputs/Select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/messages/Alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/messages/Dialog";
import { useToast } from "@/hooks/useToast";

interface InviteMemberDialogProps {
  organisationId: string;
}

export function InviteMemberDialog({ organisationId }: InviteMemberDialogProps) {
  const t = useTranslations("modals.inviteMember");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync: inviteMember } = useOrganisationMemberInvite();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [role, setRole] = useState<OrganisationRole>(OrganisationRole.MEMBER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setName("");
      setSurname("");
      setRole(OrganisationRole.MEMBER);
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: InviteMemberDto = {
      email: email.trim().toLowerCase(),
      role,
    };
    if (name.trim()) payload.name = name.trim();
    if (surname.trim()) payload.surname = surname.trim();

    try {
      await inviteMember({ id: organisationId, data: payload });
      await queryClient.invalidateQueries({
        queryKey: getOrganisationMemberListQueryKey(organisationId),
      });
      toast({
        variant: "success",
        title: t("successTitle"),
        description: t("successDescription"),
      });
      setOpen(false);
    } catch (err) {
      setError(extractErrorMessage(err) ?? t("errorTitle"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 size-4" /> {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label={t("email")}
            type="email"
            name="email"
            id="invite-email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t("firstname")}
              type="text"
              name="name"
              id="invite-name"
              placeholder={t("firstnamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              label={t("surname")}
              type="text"
              name="surname"
              id="invite-surname"
              placeholder={t("surnamePlaceholder")}
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <SelectInput
            label={t("role")}
            name="role"
            id="invite-role"
            defaultValue={role}
            onChange={(e) => setRole(e.target.value as OrganisationRole)}
            options={[
              { label: t("roleMember"), value: OrganisationRole.MEMBER },
              { label: t("roleOwner"), value: OrganisationRole.OWNER },
            ]}
          />
          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t("errorTitle")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={isLoading || !email.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? t("submitting") : t("submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
