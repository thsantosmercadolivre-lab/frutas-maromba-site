import { defineConfig } from "vite";

// base relativa: funciona no GitHub Pages (subpasta), no Lovable e em qualquer hospedagem
export default defineConfig({
  base: "./",
  server: { host: "::", port: 8080 },
});
