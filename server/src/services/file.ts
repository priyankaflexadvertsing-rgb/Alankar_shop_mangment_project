import path from "path";
import fs from "fs";
import { exiftool } from "exiftool-vendored";
import { baseDir, compressed_printing_files } from "../config/fileConfing.js";
import { generateThumbnail, normalizeFileName } from "./file.helper.js";




export const file_Path = (name: string): string => path.join(baseDir, `${name}.json`);

class FilesService {

  static async compressImagesFiles(inputFilePath: string): Promise<string> {
    try {
      if (!fs.existsSync(inputFilePath)) {throw new Error(`File does not exist: ${inputFilePath}`)}

      const ext = path.extname(inputFilePath).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".tif", ".tiff"].includes(ext)) {
        throw new Error("Unsupported file type for compression");
      }

      const parsed = path.parse(inputFilePath);
      const cleanName = normalizeFileName(parsed.name) + ".jpg";
      const outputPath:string = path.join(compressed_printing_files, cleanName);

      if (fs.existsSync(outputPath)) {
        console.log(`⚡ Skipping compression (already exists): ${outputPath}`);
        return outputPath;
      }

      await generateThumbnail(inputFilePath, outputPath);
      await exiftool.end();

      return outputPath;
    } catch (err: any) {
      console.error("❌ Compression failed:", err);
      throw err;
    }
  }






  // static async deletePrintingInUserFile(payload: { id: string }, pid: { printingId: string }): Promise<{ success: boolean; message: string; user: UserFile | string }> {
  //   const { id } = payload;
  //   const { printingId } = pid;

  //   const userFile = await this.getUserFileById({ userId: id });
  //   if (!userFile) throw new Error("User not found");

  //   if (!Array.isArray(userFile.printing)) userFile.printing = [];

  //   const fileIndex = userFile.printing.findIndex(p => p._id === printingId);
  //   if (fileIndex === -1) throw new Error("File not found");

  //   const fileToDelete = userFile.printing[fileIndex];

  //   try {
  //     if (fileToDelete.originalfilePath && fs.existsSync(fileToDelete.originalfilePath)) fs.unlinkSync(fileToDelete.originalfilePath);
  //     if (fileToDelete.compressedfilePath && fs.existsSync(fileToDelete.compressedfilePath)) fs.unlinkSync(fileToDelete.compressedfilePath);
  //   } catch (err) {
  //     console.error("⚠ Error deleting files:", err);
  //   }

  //   userFile.printing.splice(fileIndex, 1);
  //   const updatedUser = await this.updateUserFile(userFile);

  //   return {
  //     success: true,
  //     message: "File deleted successfully",
  //     user: updatedUser,
  //   };
  // }

  // static async editPrintingInUserFile(payload: { id: string }, pid: { printingId: string }, updatedFields: Record<string, any>): Promise<{ success: boolean; message: string; user: UserFile | string }> {
  //   const { id } = payload;
  //   const { printingId } = pid;

  //   const userFile = await this.getUserFileById({ userId: id });
  //   if (!userFile) throw new Error("User not found");

  //   if (!Array.isArray(userFile.printing)) userFile.printing = [];

  //   const index = userFile.printing.findIndex(p => p._id === printingId);
  //   if (index === -1) throw new Error("File not found");

  //   Object.keys(updatedFields).forEach(key => {
  //     if (userFile.printing[index].payment_details.items) {
  //       userFile.printing[index].payment_details.items[key] = updatedFields[key];
  //     }
  //   });

  //   const updatedUser = await this.updateUserFile(userFile);

  //   return {
  //     success: true,
  //     message: "File updated successfully",
  //     user: updatedUser,
  //   };
  // }

  // static async updateUserRate(payload: { id: string }, rates: { rate: Record<string, any> }): Promise<{ success: boolean; message: string; user?: UserFile | string; error?: string }> {
  //   const { id } = payload;
  //   const { rate } = rates;

  //   try {
  //     const userFile = await this.getUserFileById({ userId: id });
  //     if (!userFile) return { success: false, message: "User not found" };

  //     if (!userFile.rate || typeof userFile.rate !== "object") userFile.rate = {};
  //     Object.keys(rate).forEach(key => {
  //       userFile.rate[key] = rate[key];
  //     });

  //     const updatedUser = await this.updateUserFile(userFile);

  //     return {
  //       success: true,
  //       message: "User updated successfully",
  //       user: updatedUser,
  //     };
  //   } catch (err: any) {
  //     console.error("Error updating user file:", err);
  //     return { success: false, message: "Server error", error: err.message };
  //   }
  // }
}

export default FilesService;
