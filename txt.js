import fs from "fs";
import path from "path";

const OUTPUT = "project_dump.txt";

const EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "out"
];

const EXCLUDE_EXT = [
  ".png", ".jpg", ".jpeg", ".webp", ".ico", ".svg", ".lock"
];

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        walk(fullPath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (!EXCLUDE_EXT.includes(ext) && file !== "package-lock.json" && file !== "yarn.lock") {
        fileList.push(fullPath);
      }
    }
  });
  return fileList;
}

const files = walk(process.cwd());

let output = "### PROJECT FILE DUMP ###\n\n";

files.forEach(file => {
  output += "==============================\n";
  output += `FILE: ${file}\n`;
  output += "==============================\n";
  output += fs.readFileSync(file, "utf-8");
  output += "\n\n";
});

fs.writeFileSync(OUTPUT, output, "utf-8");

console.log("DONE -> project_dump.txt created");