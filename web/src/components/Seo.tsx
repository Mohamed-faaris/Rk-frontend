import { useEffect } from "react";

const SITE_URL = "https://rkch.tech";
const DEFAULT_TITLE = "RajKayal Creative Hub | Design & Development Studio";
const DEFAULT_DESCRIPTION = "RajKayal Creative Hub delivers branding, web design, UI/UX, animation, and custom software services for businesses that need polished digital experiences.";
const DEFAULT_IMAGE_PATH = "/rajkayal-large.png";
const DEFAULT_IMAGE_WIDTH = "256";
const DEFAULT_IMAGE_HEIGHT = "256";

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

type SeoProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: string;
  imagePath?: string;
  imageWidth?: string;
  imageHeight?: string;
  keywords?: string;
  jsonLd?: JsonLdValue;
};

const getAbsoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

const upsertMeta = (attribute: "name" | "property", value: string, content: string) => {
  let meta = document.head.querySelector(`meta[${attribute}="${value}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  let link = document.head.querySelector(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

const upsertJsonLd = (jsonLd: JsonLdValue) => {
  let script = document.head.querySelector('script[data-seo-json-ld="true"]') as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoJsonLd = "true";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(jsonLd);
};

const clearJsonLd = () => {
  const script = document.head.querySelector('script[data-seo-json-ld="true"]');
  if (script) {
    script.remove();
  }
};

const applyDefaults = () => {
  const canonicalUrl = getAbsoluteUrl("/");
  const defaultImage = getAbsoluteUrl(DEFAULT_IMAGE_PATH);

  document.title = DEFAULT_TITLE;
  upsertMeta("name", "description", DEFAULT_DESCRIPTION);
  upsertMeta("property", "og:title", DEFAULT_TITLE);
  upsertMeta("property", "og:description", DEFAULT_DESCRIPTION);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:url", canonicalUrl);
  upsertMeta("property", "og:image", defaultImage);
  upsertMeta("property", "og:image:width", DEFAULT_IMAGE_WIDTH);
  upsertMeta("property", "og:image:height", DEFAULT_IMAGE_HEIGHT);
  upsertMeta("name", "twitter:title", DEFAULT_TITLE);
  upsertMeta("name", "twitter:description", DEFAULT_DESCRIPTION);
  upsertMeta("name", "twitter:image", defaultImage);
  upsertMeta("name", "robots", "index, follow");
  upsertLink("canonical", canonicalUrl);
  clearJsonLd();
};

const Seo = ({
  title,
  description,
  canonicalPath = "/",
  ogType = "website",
  imagePath = DEFAULT_IMAGE_PATH,
  imageWidth = DEFAULT_IMAGE_WIDTH,
  imageHeight = DEFAULT_IMAGE_HEIGHT,
  keywords,
  jsonLd,
}: SeoProps) => {
  useEffect(() => {
    const canonicalUrl = getAbsoluteUrl(canonicalPath);
    const imageUrl = getAbsoluteUrl(imagePath);

    document.title = title;
    upsertMeta("name", "description", description);
    if (keywords) {
      upsertMeta("name", "keywords", keywords);
    }
    upsertMeta("name", "robots", "index, follow");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:image:width", imageWidth);
    upsertMeta("property", "og:image:height", imageHeight);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", imageUrl);
    upsertLink("canonical", canonicalUrl);

    if (jsonLd) {
      upsertJsonLd(jsonLd);
    } else {
      clearJsonLd();
    }

    return () => {
      applyDefaults();
    };
  }, [canonicalPath, description, imageHeight, imagePath, imageWidth, jsonLd, keywords, ogType, title]);

  return null;
};

export default Seo;