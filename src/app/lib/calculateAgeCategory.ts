import { EnumMappings } from "@/app/lib/enumMappings";

const CURRENT_YEAR = new Date().getFullYear();
const AGE_CAT_U12_YEAR = CURRENT_YEAR - 12;
const AGE_CAT_U14_YEAR = CURRENT_YEAR - 14;
const AGE_CAT_U15_YEAR = CURRENT_YEAR - 15;
const AGE_CAT_U16_YEAR = CURRENT_YEAR - 16;
const AGE_CAT_U18_YEAR = CURRENT_YEAR - 18;
const AGE_CAT_U21_YEAR = CURRENT_YEAR - 21;
const AGE_CAT_O50_YEAR = CURRENT_YEAR - 50;

export default function calculateAgeCategory(year: number, displayFlag?: boolean) {
    if (year === null) return displayFlag ? EnumMappings["SENIOR"] : "SENIOR";
    if (year > AGE_CAT_U12_YEAR) return displayFlag ? EnumMappings["UNDER_12"] : "UNDER_12";
    if (year > AGE_CAT_U14_YEAR) return displayFlag ? EnumMappings["UNDER_14"] : "UNDER_14";
    if (year > AGE_CAT_U15_YEAR) return displayFlag ? EnumMappings["UNDER_15"] : "UNDER_15";
    if (year > AGE_CAT_U16_YEAR) return displayFlag ? EnumMappings["UNDER_16"] : "UNDER_16";
    if (year > AGE_CAT_U18_YEAR) return displayFlag ? EnumMappings["UNDER_18"] : "UNDER_18";
    if (year > AGE_CAT_U21_YEAR) return displayFlag ? EnumMappings["UNDER_21"] : "UNDER_21";
    if (year <= AGE_CAT_O50_YEAR) return displayFlag ? EnumMappings["OVER_FIFTY"] : "OVER_FIFTY";
    return displayFlag ? EnumMappings["SENIOR"] : "SENIOR";
}
