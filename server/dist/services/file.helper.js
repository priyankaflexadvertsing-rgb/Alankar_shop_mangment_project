import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import { compressed_printing_files } from "../config/fileConfing.js";
/**
 * ✅ Helper: normalize filename
 * - remove spaces
 * - lowercase
 * - remove (number)
 */
export const normalizeFileName = (fileName) => {
    return fileName
        .replace(/\(\d+\)/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();
};
/**
 * ✅ Generate thumbnail with EXIF + timestamps preserved
 */
export const generateThumbnail = async (inputPath, outputPath) => {
    try {
        // 1️⃣ Ensure input file exists
        if (!fs.existsSync(inputPath)) {
            console.error(`⚠️ File not found: ${inputPath}`);
            return null;
        }
        // 2️⃣ Parse file name + create normalized output file name
        const parsed = path.parse(inputPath);
        const cleanName = normalizeFileName(parsed.name) + ".jpg";
        // 3️⃣ Final output path (flat directory, no nested structure)
        const outputPath = path.join(compressed_printing_files, cleanName);
        // Ensure output directory exists
        await fsPromises.mkdir(compressed_printing_files, { recursive: true });
        // If compressed already exists, skip
        if (fs.existsSync(outputPath)) {
            console.log(`⚡ Skipping existing thumbnail: ${outputPath}`);
            return outputPath;
        }
        // 4️⃣ Generate thumbnail / compressed image
        await sharp(inputPath)
            .resize({ width: 600, withoutEnlargement: true })
            .toColorspace("srgb")
            .withMetadata()
            .jpeg({ quality: 60, chromaSubsampling: "4:4:4" })
            .toFile(outputPath);
        // 5️⃣ Sync timestamps
        const srcStats = await fsPromises.stat(inputPath);
        await fsPromises.utimes(outputPath, srcStats.atime, srcStats.mtime);
        // 6️⃣ Copy EXIF date if exists
        try {
            const metadata = await exiftool.read(inputPath);
            if (metadata?.DateTimeOriginal) {
                await exiftool.write(outputPath, {
                    AllDates: metadata?.DateTimeOriginal,
                });
            }
        }
        catch (exifErr) {
            const err = exifErr;
            console.warn(`⚠️ Failed to copy EXIF date: ${err.message}`);
        }
        return outputPath;
    }
    catch (err) {
        console.error(`❌ Error generating thumbnail for: ${inputPath}`);
        console.error(err);
        return null;
    }
};
/**
 * ✅ Recursive directory reader & normalizer
 */
class ReadDirRecursive {
    static readDirectoryRecursive(dir) {
        const result = [];
        const walk = (currentPath) => {
            const entries = fs.readdirSync(currentPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                const parsed = path.parse(entry.name);
                // Normalize base name only
                const cleanBase = normalizeFileName(parsed.name);
                const normalizedName = cleanBase + parsed.ext.toLowerCase();
                const normalizedFullPath = path.join(currentPath, normalizedName);
                try {
                    // Rename only if necessary
                    if (fullPath !== normalizedFullPath &&
                        !fs.existsSync(normalizedFullPath)) {
                        fs.renameSync(fullPath, normalizedFullPath);
                    }
                }
                catch (renameErr) {
                    const err = renameErr;
                    console.warn(`⚠️ Rename failed for: ${fullPath}`);
                    console.warn(err.message);
                }
                const relative = path
                    .relative(dir, normalizedFullPath)
                    .replace(/\\/g, "/");
                if (entry.isDirectory()) {
                    walk(normalizedFullPath);
                }
                else {
                    result.push(relative);
                }
            }
        };
        walk(dir);
        return result;
    }
}
export default ReadDirRecursive;
