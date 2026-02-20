import fs from "node:fs/promises";
import path from "node:path";

const tokenFiles = [
  path.resolve(process.cwd(), "design-system/withremy/withremy.css"),
  path.resolve(process.cwd(), "wireframe-remy.css")
];

const allowedRuntimeOnlyTokens = new Set([
  "--reveal-delay"
]);

function collectDeclaredTokens(css) {
  const declared = new Set();
  const regex = /(--[A-Za-z0-9_-]+)\s*:/g;

  for (const match of css.matchAll(regex)) {
    declared.add(match[1]);
  }

  return declared;
}

function collectUsedTokens(css) {
  const used = new Set();
  const regex = /var\(\s*(--[A-Za-z0-9_-]+)/g;

  for (const match of css.matchAll(regex)) {
    used.add(match[1]);
  }

  return used;
}

async function run() {
  const fileContents = await Promise.all(tokenFiles.map((filePath) => fs.readFile(filePath, "utf8")));

  const declared = new Set();
  const used = new Set();

  for (const css of fileContents) {
    collectDeclaredTokens(css).forEach((token) => declared.add(token));
    collectUsedTokens(css).forEach((token) => used.add(token));
  }

  const undefinedTokens = [...used]
    .filter((token) => !declared.has(token) && !allowedRuntimeOnlyTokens.has(token))
    .sort();

  if (!undefinedTokens.length) {
    console.log(`Token integrity check passed. Declared=${declared.size} Used=${used.size}`);
    return;
  }

  console.error("Undefined CSS variable references found:");
  undefinedTokens.forEach((token) => {
    console.error(`- ${token}`);
  });
  process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
