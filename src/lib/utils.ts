import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const navigate = (href: string, newTab: boolean) => {
  var a = document.createElement("a");
  a.href = href;
  if (newTab) {
    a.setAttribute("target", "_blank");
  }
  a.click();
};
