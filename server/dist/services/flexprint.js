import { SheetType } from "../models/payment.model.js";
const INCH_TO_FEET = 1 / 12;
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
    const filename = item.originalname.replace(/\s+/g, "").toLowerCase();
    const regex = /^(\d+(?:\.\d+)?)(feet|inch)?x(\d+(?:\.\d+)?)(feet|inch)?=(\d+)(normal|star|vinyl|blackback)\.jpg$/i;
    const match = filename.match(regex);
    if (!match) {
        throw new Error("Invalid filename format");
    }
    const [_, widthVal, widthUnitRaw, heightVal, heightUnitRaw, qtyStr, sheetRaw,] = match;
    let width = Number(widthVal);
    let height = Number(heightVal);
    // ✅ UNIT NORMALIZATION LOGIC
    let widthUnit = widthUnitRaw;
    let heightUnit = heightUnitRaw;
    // Case 1: both missing → feet
    if (!widthUnit && !heightUnit) {
        widthUnit = heightUnit = "feet";
    }
    // Case 2: one missing → inherit the other
    if (!widthUnit && heightUnit)
        widthUnit = heightUnit;
    if (!heightUnit && widthUnit)
        heightUnit = widthUnit;
    // Case 3: mixed units → convert inches to feet
    if (widthUnit === "inch")
        width *= INCH_TO_FEET;
    if (heightUnit === "inch")
        height *= INCH_TO_FEET;
    if (width <= 0 || height <= 0) {
        throw new Error("Invalid dimensions");
    }
    const quantity = Number(qtyStr);
    // 🔒 ENUM NORMALIZATION
    let sheet;
    switch (sheetRaw) {
        case "normal":
            sheet = SheetType.NORMAL;
            break;
        case "star":
            sheet = SheetType.PREMIUM;
            break;
        case "vinyl":
        case "blackback":
            sheet = SheetType.MATTE;
            break;
        default:
            throw new Error(`Unsupported sheet type: ${sheetRaw}`);
    }
    const squareFeet = Number((width * height).toFixed(2));
    const price = squareFeet * defaultRates[sheet] * quantity;
    return {
        success: true,
        items: {
            size: `${width}x${height}`,
            sheet,
            quantity,
            squareFeet,
            price,
            imageFormat: "jpg",
            timestamp: new Date(),
        },
    };
};
