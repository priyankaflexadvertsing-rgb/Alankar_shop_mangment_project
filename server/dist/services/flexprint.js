import { SheetType } from "../models/payment.model.js";
export const flexPrint = (items, rate) => {
    if (!items.length || !items[0]?.originalname) {
        throw new Error("Invalid printing item");
    }
    const defaultRates = {
        [SheetType.NORMAL]: rate.normal ?? rate.nromal ?? 10,
        [SheetType.PREMIUM]: rate.star ?? 20,
        [SheetType.MATTE]: rate.vinyle ?? rate.Vinyle ?? 30,
    };
    const item = items[0];
    const filename = item.originalname.replace(/\s+/g, "");
    const [sizeStr, sheetStrRaw] = filename.includes("=")
        ? filename.split("=")
        : filename.match(/^(\d+x\d+)(.*)$/)?.slice(1, 3) || [];
    if (!sizeStr || !sheetStrRaw) {
        throw new Error("Invalid filename format");
    }
    const [widthStr, heightStr] = sizeStr.split("x");
    const width = Number(widthStr);
    const height = Number(heightStr);
    if (width <= 0 || height <= 0) {
        throw new Error("Invalid dimensions");
    }
    const match = sheetStrRaw.match(/^(\d*)\s*([a-zA-Z]+).*$/);
    if (!match) {
        throw new Error("Invalid sheet format");
    }
    const [, qtyStr, sheetTypeRaw] = match;
    const quantity = qtyStr ? Number(qtyStr) : 1;
    // 🔒 ENUM NORMALIZATION
    let sheet;
    switch (sheetTypeRaw.toLowerCase()) {
        case "normal":
            sheet = SheetType.NORMAL;
            break;
        case "star":
        case "premium":
            sheet = SheetType.PREMIUM;
            break;
        case "vinyl":
        case "vinyle":
        case "matte":
            sheet = SheetType.MATTE;
            break;
        default:
            throw new Error(`Unsupported sheet type: ${sheetTypeRaw}`);
    }
    const squareFeet = width * height;
    const price = squareFeet * defaultRates[sheet] * quantity;
    return {
        success: true,
        items: {
            size: `${width}x${height}`,
            sheet,
            quantity,
            squareFeet,
            price,
            imageFormat: item.mimetype?.split("/")[1] || "jpg",
            timestamp: new Date(),
        },
    };
};
