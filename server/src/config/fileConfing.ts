import {fileURLToPath} from "url"
import path from "path";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Join your custom folder (correct way)
export const oringinal_printing_files = path.join(__dirname, "../../oringinal_printing_files");
export const compressed_printing_files = path.join(__dirname, "../../compressed_printing_files");
export const baseUseDataDir = path.join(__dirname, "../../all_Customer_Data");
export const baseDir = path.join(__dirname, "../../all_Customer_Data");
export const notifficationBaseDir = path.join(__dirname, "../../notifficationData");
// console.log(oringinal_printing_files, compressed_printing_files, baseUseDataDir);


// export const baseDir = "D:\\cdr\\0000Customer\\000saumil\\projects\\0000000\\shop_server\\all_Customer_Data";
// export const oringinal_printing_files = "D:\\cdr\\0000Customer\\000saumil\\projects\\0000000\\shop_server\\oringinal_printing_files";
// export const compressed_printing_files = "D:\\cdr\\0000Customer\\000saumil\\projects\\0000000\\shop_server\\compressed_printing_files";
// export const baseUseDataDir = "D:\\cdr\\0000Customer\\000saumil\\projects\\0000000\\shop_server\\all_Customer_Data";