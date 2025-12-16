import path from "path";
import fs from "fs";
import {  compressed_printing_files } from "../config/fileConfing.js";
import { generateThumbnail, normalizeFileName } from "./file.helper.js";

class FilesService {
  static async compressImagesFiles(inputFilePath: string): Promise<string> {
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

      const outputPath = path.join(
        compressed_printing_files,
        cleanName
      );

      // ✅ Prevent duplicate compression
      if (fs.existsSync(outputPath)) {
        console.log(`⚡ Compression skipped (exists): ${outputPath}`);
        return outputPath;
      }

      await generateThumbnail(inputFilePath, outputPath);

      return outputPath;
    } catch (error) {
      console.error("❌ Compression failed:", error);
      throw error;
    }
  }
}

export default FilesService;
