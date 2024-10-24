"use server";
import { JSDOM } from "jsdom";
import axios from "axios";

export async function getLinkPreview(url: string) {
  try {
    const response = await axios.get(url);
    const origin = new URL(url).origin;
    const dom = new JSDOM(response.data, { url });
    const document = dom.window.document;
    const imageUrl = getImageUrl(url, document);
    const title = getTitle(document);
    const description = getDescription(document);

    return { imageUrl, title, description };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

function getImageUrl(url: string, document: Document) {
  let imageUrl =
    (
      (document.querySelector('meta[property="og:image"]') ||
        document.querySelector('meta[property="og:image:secure_url"]') ||
        document.querySelector('meta[name="twitter:image"]') ||
        document.querySelector('meta[name="twitter:image:src"]') ||
        document.querySelector('link[rel="image_src"]') ||
        document.querySelector('link[rel="apple-touch-icon"]') ||
        document.querySelector('link[rel="icon"]')) as HTMLMetaElement
    )?.content ||
    (document.querySelector('link[rel="icon"]') as HTMLLinkElement)?.href;

  // Fallback to the first <img> tag on the page if no meta image is found
  if (!imageUrl) {
    const firstImage = document.querySelector("img[src]") as HTMLImageElement;
    // Check for image file type and valid src
    if (
      firstImage &&
      firstImage.src &&
      /\.(png|jpe?g|gif|bmp|ico|tiff|webp|svg)$/i.test(firstImage.src)
    ) {
      imageUrl = firstImage.src;
    }
  }

  // Handle relative URLs by converting them to absolute URLs
  if (imageUrl && !imageUrl.startsWith("http")) {
    const baseUrl = new URL(url).origin;
    imageUrl = new URL(imageUrl, baseUrl).href;
  }

  return imageUrl;
}

function getTitle(document: Document): string {
  // Try to get title from og:title or fallback to <title>
  const title =
    (document.querySelector('meta[property="og:title"]') as HTMLMetaElement)
      ?.content || document.title;

  return title || "No title found";
}

function getDescription(document: Document): string {
  // Try to get description from og:description or fallback to <meta name="description">
  const description =
    (
      document.querySelector(
        'meta[property="og:description"]'
      ) as HTMLMetaElement
    )?.content ||
    (document.querySelector('meta[name="description"]') as HTMLMetaElement)
      ?.content ||
    "No description available";

  return description;
}
