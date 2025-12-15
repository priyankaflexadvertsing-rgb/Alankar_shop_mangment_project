import path from "path";
import fs from "fs";
import { exiftool } from "exiftool-vendored";
import { baseDir, compressed_printing_files } from "../config/fileConfing.js";
import { generateThumbnail, normalizeFileName } from "./file.helper.js";
export const file_Path = (name) => path.join(baseDir, `${name}.json`);
class FilesService {
    static async compressImagesFiles(inputFilePath) {
        try {
            if (!fs.existsSync(inputFilePath)) {
                throw new Error(`File does not exist: ${inputFilePath}`);
            }
            const ext = path.extname(inputFilePath).toLowerCase();
            if (![".jpg", ".jpeg", ".png", ".tif", ".tiff"].includes(ext)) {
                throw new Error("Unsupported file type for compression");
            }
            const parsed = path.parse(inputFilePath);
            const cleanName = normalizeFileName(parsed.name) + ".jpg";
            const outputPath = path.join(compressed_printing_files, cleanName);
            if (fs.existsSync(outputPath)) {
                console.log(`⚡ Skipping compression (already exists): ${outputPath}`);
                return outputPath;
            }
            await generateThumbnail(inputFilePath, outputPath);
            await exiftool.end();
            return outputPath;
        }
        catch (err) {
            console.error("❌ Compression failed:", err);
            throw err;
        }
    }
}
export default FilesService;
