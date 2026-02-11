import localFont from "next/font/local";

export const tasaExplorer = localFont({
  src: "../../public/fonts/TASAExplorer-latin.woff2",
  variable: "--font-heading",
  display: "swap",
  weight: "400 900",
});

export const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Variable.woff2",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-body",
  display: "swap",
});
