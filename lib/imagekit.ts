const PLACEHOLDER_PATTERN = /(your_imagekit_id|<IMAGEKIT_ID>)/i;

const isProd = process.env.NODE_ENV === "production";

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const toAssetPath = (assetPath: string) => {
  if (!assetPath) {
    throw new Error("ImageKit asset path is required.");
  }

  return assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
};

const toLocalAssetPath = (assetPath: string) => {
  const normalized = toAssetPath(assetPath);
  if (normalized.startsWith("/remy/")) {
    return normalized.replace(/^\/remy\//, "/assets/remy/");
  }

  return normalized;
};

const getRawEndpoint = () => process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.trim() ?? "";

const assertValidEndpoint = (endpoint: string) => {
  if (!endpoint) {
    throw new Error(
      "Missing NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT. Set it to your ImageKit URL endpoint, for example https://ik.imagekit.io/<IMAGEKIT_ID>."
    );
  }

  if (PLACEHOLDER_PATTERN.test(endpoint)) {
    throw new Error(
      "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is using a placeholder value. Replace it with your real ImageKit endpoint before deploying."
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(endpoint);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT must be a valid absolute URL, for example https://ik.imagekit.io/<IMAGEKIT_ID>."
    );
  }

  if (!["https:", "http:"].includes(parsed.protocol)) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT must use http or https protocol.");
  }
};

export const resolveImageKitUrlEndpoint = () => {
  const endpoint = stripTrailingSlash(getRawEndpoint());

  if (!endpoint) {
    if (isProd) {
      assertValidEndpoint(endpoint);
    }

    return null;
  }

  assertValidEndpoint(endpoint);
  return endpoint;
};

export const resolveImageAssetUrl = (assetPath: string) => {
  const endpoint = resolveImageKitUrlEndpoint();

  if (endpoint) {
    return `${endpoint}${toAssetPath(assetPath)}`;
  }

  const fallbackMode = process.env.IMAGEKIT_DEV_FALLBACK;
  if (fallbackMode === "local-assets") {
    return toLocalAssetPath(assetPath);
  }

  if (isProd) {
    // resolveImageKitUrlEndpoint already throws in production.
    throw new Error("ImageKit endpoint validation failed in production.");
  }

  throw new Error(
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is missing. For local fallback, set IMAGEKIT_DEV_FALLBACK=local-assets."
  );
};
