import NextLink from "next/link";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  className?: string;
  activeClass?: string;
  children: React.ReactNode;
}

export function Link(props: Props) {
  const pathname = usePathname();

  return (
    <NextLink
      className={twMerge(
        props.className,
        pathname === props.href && props.activeClass
      )}
      href={props.href}
    >
      {props.children}
    </NextLink>
  );
}
