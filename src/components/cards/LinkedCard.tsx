import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/Card";
import { Badge } from "@/components/ui/labels/Badge";

interface LinkedCardProps {
  title: string;
  description: string;
  badge: string;
  button: string;
  href: string;
}

export default function LinkedCard({
  title,
  description,
  badge,
  button,
  href,
}: LinkedCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md">
        <CardHeader>
          <CardTitle>
            <div>{title}</div>
            <Badge variant="gray">{badge}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>{description}</CardContent>
        <CardFooter>
          <div className="flex items-center space-x-1 font-semibold text-primary">
            <span>{button}</span>
            <ChevronRightIcon className="w-4 h-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
