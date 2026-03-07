import Link from "next/link";
import Image from "next/image";

interface BrandProps {
  href: string;
  className?: string;
  text?: string;
}

export const Brand = ({ href, className, text }: BrandProps) => {
  return (
    <Link
      href={href}
      title="Home"
      aria-label="Home"
      className={`flex space-x-[10px] items-center ${className}`}>
      <Image
        src="/img/logo.jpg"
        className="rounded-md"
        alt="Logo"
        width={35}
        height={35}
        layout="fixed"
      />
      <div className="font-semibold text-sm">{text}</div>
    </Link>
  );
};
