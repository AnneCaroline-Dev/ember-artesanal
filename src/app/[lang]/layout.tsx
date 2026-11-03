import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { dicionario } from "@/lib/idioma/dicionarios";
import { IDIOMA_DO_HTML, IDIOMAS } from "@/lib/idioma/idiomas";
import { idiomaDaRota } from "@/lib/idioma/rota";
import { EncaminharConvite } from "../_componentes/encaminhar-convite";
import { Splash } from "../_componentes/splash";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// G2: cada idioma tem o seu endereço (/pt e /en), gerado já no build.
export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps<"/[lang]">, "params">): Promise<Metadata> {
  const t = dicionario(idiomaDaRota((await params).lang));
  return {
    title: { default: t.marca, template: `%s · ${t.marca}` },
    description: t.descricao,
  };
}

export const viewport: Viewport = {
  themeColor: "#d46d25",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const idioma = idiomaDaRota((await params).lang);
  return (
    <html
      lang={IDIOMA_DO_HTML[idioma]}
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Splash />
        <EncaminharConvite idioma={idioma} />
        {children}
      </body>
    </html>
  );
}
