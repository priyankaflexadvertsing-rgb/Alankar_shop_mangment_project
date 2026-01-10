import path from "path";
import fs from "fs";
import { compressed_printing_files } from "../config/fileConfing.js";
import { generateThumbnail, normalizeFileName } from "./file.helper.js";
import ErrorHandler from "../shared/middlewares/ErrorHandler.js";
class FilesService {
    static async compressImagesFiles(inputFilePath, next) {
        try {
            if (!fs.existsSync(inputFilePath)) {
                return next(new ErrorHandler(`File does not exist: ${inputFilePath}`, 500));
            }
            const ext = path.extname(inputFilePath).toLowerCase();
            if (![".jpg", ".jpeg", ".png", ".tif", ".tiff"].includes(ext)) {
                return next(new ErrorHandler("Unsupported file type for compression", 500));
            }
            const parsed = path.parse(inputFilePath);
            const cleanName = normalizeFileName(parsed.name) + ".jpg";
            const outputPath = path.join(compressed_printing_files, cleanName);
            // ✅ Prevent duplicate compression
            if (fs.existsSync(outputPath)) {
                console.log(`⚡ Compression skipped (exists): ${outputPath}`);
                return outputPath;
            }
            await generateThumbnail(inputFilePath, outputPath);
            return outputPath;
        }
        catch (error) {
            return next(new ErrorHandler(`Image compression failed: ${error}`, 500));
        }
    }
}
export default FilesService;
