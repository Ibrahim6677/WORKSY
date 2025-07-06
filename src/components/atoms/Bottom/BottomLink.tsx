import React from "react";
import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";

interface ButtonLinkProps extends LinkProps {
  scrolled?: boolean;
  variant?: "filled" | "outline"; // نحدد نوع الزر (Filled زي Get Started أو Outline زي Sign in)
  children: React.ReactNode;
}

export function BottomLink({
  scrolled = false,
  variant = "filled",
  children,
  className = "",
  ...props
}: ButtonLinkProps) {
  const baseClasses = `cursor-pointer text-amiko text-center rounded-xl sm:rounded-2xl px-4 xl:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-normal transition duration-300 hover:scale-105`;

  let variantClasses = "";

  if (variant === "filled") {
    variantClasses = scrolled
      ? "bg-white text-[#6629DE]"
      : "bg-[#6629DE] text-white";
  } else if (variant === "outline") {
    variantClasses = scrolled
      ? "bg-transparent text-white border border-white hover:bg-white hover:text-[#6629DE]"
      : "bg-transparent text-[#6629DE] hover:bg-[#6629DE] hover:text-white";
  }

  return (
    <Link {...props} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </Link>
  );
}

export function BottomMenuLink({
  scrolled = false,
  variant = "filled",
  children,
  className = "",
  ...props
}: ButtonLinkProps) {
  const baseClasses = `block w-full text-center py-3 cursor-pointer text-amiko text-center rounded-xl sm:rounded-2xl px-4 xl:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-normal transition duration-300 hover:scale-105`;

  let variantClasses = "";

  if (variant === "filled") {
    variantClasses = scrolled
      ? "bg-white text-[#6629DE]"
      : "bg-[#6629DE] text-white";
  } else if (variant === "outline") {
    variantClasses = scrolled
      ? "bg-transparent text-white border border-white hover:bg-white hover:text-[#6629DE]"
      : "bg-transparent text-[#6629DE] hover:bg-[#6629DE] hover:text-white";
  }

  return (
    <Link {...props} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </Link>
  );
}