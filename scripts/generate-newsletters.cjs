const fs = require("fs");
const path = require("path");

const inputDir = path.join(
  __dirname,
  "..",
  "public",
  "assets",
  "newsletter-pdf",
  "clean"
);
const outputFile = path.join(__dirname, "..", "src", "data", "newsletters.js");

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".html"));

const newsletters = files.map((f, i) => {
  const id = f.replace(/\D/g, "");
  return {
    id: parseInt(id),
    title: `Newsletter n°${id}`,
    htmlPath: `/newsletter/${id}`,
    pdfPath: `/assets/newsletter-pdf/pdf/newsletter${id}.pdf`,
  };
});

const jsContent = `export const newsletters = ${JSON.stringify(
  newsletters,
  null,
  2
)};`;

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, jsContent, "utf8");

console.log(
  `✅ ${newsletters.length} newsletters détectées et générées dans src/data/newsletters.js`
);
