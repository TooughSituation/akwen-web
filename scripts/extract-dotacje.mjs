import mammoth from "mammoth";
import fs from "fs";
import path from "path";

const docxPath = path.join(
  "public",
  "data",
  "AKWEN - Opis na stronę internetową.docx"
);
const outDir = path.join("public", "images", "dotacje");
fs.mkdirSync(outDir, { recursive: true });

let imgIndex = 0;

const options = {
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
    const filepath = path.join(outDir, filename);
    fs.writeFileSync(filepath, Buffer.from(imageBuffer, "base64"));
    console.log("saved", filename, image.contentType, fs.statSync(filepath).size);
    return {
      src: `/images/dotacje/${filename}`,
      alt: `Grafika z dokumentu – ${imgIndex}`,
    };
  }),
};

const result = await mammoth.convertToHtml({ path: docxPath }, options);
fs.writeFileSync("tmp-dotacje-content.html", result.value, "utf8");
console.log("images:", imgIndex);
console.log("html length:", result.value.length);
console.log("messages:", result.messages);

const headings = [...result.value.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi)].map(
  (m) => m[1].replace(/<[^>]+>/g, "").slice(0, 100)
);
console.log("headings:", headings);

const imgs = [...result.value.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
console.log("img srcs:", imgs);

// also extract plain text for overview
const textResult = await mammoth.extractRawText({ path: docxPath });
fs.writeFileSync("tmp-dotacje-text.txt", textResult.value, "utf8");
console.log("--- TEXT PREVIEW ---");
console.log(textResult.value.slice(0, 4000));
