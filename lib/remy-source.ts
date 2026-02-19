import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

const REMY_HTML_PATH = path.join(process.cwd(), "wireframe-remy.html");
const REMY_CSS_PATH = path.join(process.cwd(), "wireframe-remy.css");
const REMY_JS_PATH = path.join(process.cwd(), "wireframe-remy.js");
const WITHREMY_CSS_PATH = path.join(
  process.cwd(),
  "design-system",
  "withremy",
  "withremy.css"
);

const readUtf8 = cache(async (filePath: string) => fs.readFile(filePath, "utf8"));

export const getRemyBodyHtml = cache(async () => {
  const html = await readUtf8(REMY_HTML_PATH);
  const match = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);

  if (!match) {
    throw new Error("Unable to extract <body> content from wireframe-remy.html");
  }

  return match[1].trim();
});

export const getRemyCss = () => readUtf8(REMY_CSS_PATH);
export const getRemyRuntimeJs = () => readUtf8(REMY_JS_PATH);
export const getWithRemyCss = () => readUtf8(WITHREMY_CSS_PATH);

