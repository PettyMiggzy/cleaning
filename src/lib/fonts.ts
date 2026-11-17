import { Great_Vibes, Montserrat, Playfair_Display } from "next/font/google";

const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap" });
const vibes = Great_Vibes({ variable: "--font-vibes", subsets: ["latin"], weight: "400", display: "swap" });

export const fontVariables = `${montserrat.variable} ${playfair.variable} ${vibes.variable}`;
