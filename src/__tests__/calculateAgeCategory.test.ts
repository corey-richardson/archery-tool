import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import calculateAgeCategory from "@/app/lib/calculateAgeCategory";
import { EnumMappings } from "@/app/lib/enumMappings";

describe("calculateAgeCategory", () => {
    const CURRENT_YEAR = new Date().getFullYear();

    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(`${CURRENT_YEAR}-01-01T00:00:00Z`));
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    describe("null or invalid input", () => {
        it("returns SENIOR when birth year is null", () => {
            expect(calculateAgeCategory(null as unknown as number)).toBe("SENIOR");
            expect(calculateAgeCategory(null as unknown as number, true)).toBe(EnumMappings["SENIOR"]);
        });

        it("returns SENIOR when birth year is undefined", () => {
            expect(calculateAgeCategory(undefined as unknown as number)).toBe("SENIOR");
        });

        it("returns SENIOR when birth year is NaN", () => {
            expect(calculateAgeCategory(NaN)).toBe("SENIOR");
        });

        it("treats zero as OVER_FIFTY", () => {
            expect(calculateAgeCategory(0)).toBe("OVER_FIFTY");
        });

        it("treats negative birth years as OVER_FIFTY", () => {
            expect(calculateAgeCategory(-1)).toBe("OVER_FIFTY");
        });
    });

    describe("youth categories (based on year of birth)", () => {
        it("returns UNDER_12 when born within the last 11 years", () => {
            const year = CURRENT_YEAR - 10;
            expect(calculateAgeCategory(year)).toBe("UNDER_12");
        });

        it("does not return UNDER_12 when born exactly 12 years ago", () => {
            const year = CURRENT_YEAR - 12;
            expect(calculateAgeCategory(year)).not.toBe("UNDER_12");
        });

        it("returns UNDER_14 when born 13 years ago", () => {
            const year = CURRENT_YEAR - 13;
            expect(calculateAgeCategory(year)).toBe("UNDER_14");
        });

        it("returns UNDER_15 when born 14 years ago", () => {
            const year = CURRENT_YEAR - 14;
            expect(calculateAgeCategory(year)).toBe("UNDER_15");
        });

        it("returns UNDER_16 when born 15 years ago", () => {
            const year = CURRENT_YEAR - 15;
            expect(calculateAgeCategory(year)).toBe("UNDER_16");
        });

        it("returns UNDER_18 when born 17 years ago", () => {
            const year = CURRENT_YEAR - 17;
            expect(calculateAgeCategory(year)).toBe("UNDER_18");
        });

        it("returns UNDER_21 when born 20 years ago", () => {
            const year = CURRENT_YEAR - 20;
            expect(calculateAgeCategory(year)).toBe("UNDER_21");
        });

        it("returns SENIOR when born exactly 21 years ago", () => {
            const year = CURRENT_YEAR - 21;
            expect(calculateAgeCategory(year)).toBe("SENIOR");
        });
    });

    describe("adult categories (based on year of birth)", () => {
        it("returns SENIOR when born between 22 and 49 years ago", () => {
            const year_lowerbound = CURRENT_YEAR - 22;
            const year_upperbound = CURRENT_YEAR - 49;
            expect(calculateAgeCategory(year_lowerbound)).toBe("SENIOR");
            expect(calculateAgeCategory(year_upperbound)).toBe("SENIOR");
        });

        it("returns OVER_FIFTY when born exactly 50 years ago", () => {
            const year = CURRENT_YEAR - 50;
            expect(calculateAgeCategory(year)).toBe("OVER_FIFTY");
        });

        it("returns OVER_FIFTY when born 50 or more years ago", () => {
            const year = CURRENT_YEAR - 51;
            expect(calculateAgeCategory(year)).toBe("OVER_FIFTY");
        });

        it("returns OVER_FIFTY for very early birth years (e.g. 1 or 1900)", () => {
            expect(calculateAgeCategory(1)).toBe("OVER_FIFTY"); // understatement of the aeon
            expect(calculateAgeCategory(1900)).toBe("OVER_FIFTY");
        });
    });

    describe("future birth years", () => {
        it("treats future years as UNDER_12", () => {
            const year = CURRENT_YEAR + 5;
            expect(calculateAgeCategory(year)).toBe("UNDER_12");
        });
    });

    describe("display flag output", () => {
        it("maps category codes to EnumMappings when displayFlag is true", () => {
            const year = CURRENT_YEAR - 20; // Should be UNDER_21
            expect(calculateAgeCategory(year, true)).toBe(EnumMappings["UNDER_21"]);
        });
    });
});
