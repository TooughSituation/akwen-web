import fs from "fs";
import path from "path";
import mammoth from "mammoth";

const DOCX_RELATIVE_PATH = path.join(
  "public",
  "data",
  "AKWEN - Opis na stronę internetową.docx"
);

const IMAGES_DIR = path.join("public", "images", "dotacje");

/**
 * Reads the official KPO project description (.docx) and converts it to HTML.
 * Embedded images are written to public/images/dotacje/ and referenced by URL.
 */
export async function getDotacjeHtml(): Promise<string> {
  const docxPath = path.join(process.cwd(), DOCX_RELATIVE_PATH);
  const imagesDir = path.join(process.cwd(), IMAGES_DIR);
  fs.mkdirSync(imagesDir, { recursive: true });

  let imgIndex = 0;

  const result = await mammoth.convertToHtml(
    { path: docxPath },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        imgIndex += 1;
        const imageBuffer = await image.read("base64");
        const ext =
          image.contentType === "image/png"
            ? "png"
            : image.contentType === "image/jpeg"
              ? "jpg"
              : image.contentType === "image/gif"
                ? "gif"
                : image.contentType === "image/webp"
                  ? "webp"
                  : "bin";

        const filename = `image-${String(imgIndex).padStart(2, "0")}.${ext}`;
        const filepath = path.join(imagesDir, filename);

        // Prefer pre-extracted assets (committed under public/images/dotacje).
        // Write only when missing and the filesystem is writable (local dev).
        if (!fs.existsSync(filepath)) {
          try {
            fs.writeFileSync(filepath, Buffer.from(imageBuffer, "base64"));
          } catch {
            // Read-only environments (e.g. serverless) — rely on committed files.
          }
        }

        return {
          src: `/images/dotacje/${filename}`,
          alt:
            imgIndex === 1
              ? "Logotypy: Krajowy Plan Odbudowy, Rzeczpospolita Polska, Unia Europejska – NextGenerationEU"
              : `Grafika z dokumentu – ${imgIndex}`,
        };
      }),
    }
  );

  return enhanceDotacjeHtml(result.value);
}

/** Light post-processing so key facts render as highlighted blocks. */
function enhanceDotacjeHtml(html: string): string {
  return html
    .replace(
      /<p><strong><em>(.*?)<\/em><\/strong><\/p>/g,
      '<p class="dotacje-project-title"><strong><em>$1</em></strong></p>'
    )
    .replace(
      /<p>(Cel inwestycji KPO:.*?)<\/p>/gi,
      '<p class="dotacje-highlight">$1</p>'
    )
    .replace(
      /<p>(Koszt przedsięwzięcia brutto:.*?)<\/p>/gi,
      '<p class="dotacje-stat">$1</p>'
    )
    .replace(
      /<p>(Wsparcie z UE w ramach KPO:.*?)<\/p>/gi,
      '<p class="dotacje-stat dotacje-stat-accent">$1</p>'
    )
    .replace(
      /<p>(Grupa docelowa:.*?)<\/p>/gi,
      '<p class="dotacje-highlight">$1</p>'
    );
}
