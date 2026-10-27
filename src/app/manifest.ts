import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ember Artesanal",
    short_name: "Ember",
    description: "Velas artesanais de cera de soja, feitas à mão em Belo Horizonte.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#d46d25",
    lang: "pt-BR",
  };
}
