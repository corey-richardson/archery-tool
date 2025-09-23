import { describe, it, expect } from "vitest";

import { EnumMappings } from "@/app/lib/enumMappings";

describe("EnumMappings", () => {

    describe("Membership Role mappings", () => {
        it("should map MEMBER correctly", () => {
            expect(EnumMappings.MEMBER).toBe("Member");
        });

        it("should handle undefined values", () => {
            expect(EnumMappings.UndefinedValue).toBeUndefined();
        });

        it("should map COACH correctly", () => {
            expect(EnumMappings.COACH).toBe("Coach");
        });

        it("should map RECORDS correctly", () => {
            expect(EnumMappings.RECORDS).toBe("Records");
        });

        it("should map CAPTAIN correctly", () => {
            expect(EnumMappings.CAPTAIN).toBe("Captain");
        });

        it("should map ADMIN correctly", () => {
            expect(EnumMappings.ADMIN).toBe("Admin");
        });
    });

    describe("Bowstyle mappings", () => {
        it("should map BAREBOW correctly", () => {
            expect(EnumMappings.BAREBOW).toBe("Barebow");
        });

        it("should map RECURVE correctly", () => {
            expect(EnumMappings.RECURVE).toBe("Recurve");
        });

        it("should map COMPOUND correctly", () => {
            expect(EnumMappings.COMPOUND).toBe("Compound");
        });

        it("should map LONGBOW correctly", () => {
            expect(EnumMappings.LONGBOW).toBe("Longbow");
        });

        it("should map TRADITIONAL correctly", () => {
            expect(EnumMappings.TRADITIONAL).toBe("Traditional");
        });
    });

    describe("Sex mappings", () => {
        it("should map MALE correctly", () => {
            expect(EnumMappings.MALE).toBe("Male");
        });

        it("should map FEMALE correctly", () => {
            expect(EnumMappings.FEMALE).toBe("Female");
        });

        it("should map NOT_SET correctly", () => {
            expect(EnumMappings.NOT_SET).toBe("Not Set");
        });
    });

    describe("Age Category mappings", () => {
        it("should map UNDER_12 correctly", () => {
            expect(EnumMappings.UNDER_12).toBe("Under 12");
        });

        it("should map UNDER_14 correctly", () => {
            expect(EnumMappings.UNDER_14).toBe("Under 14");
        });

        it("should map UNDER_15 correctly", () => {
            expect(EnumMappings.UNDER_15).toBe("Under 15");
        });

        it("should map UNDER_16 correctly", () => {
            expect(EnumMappings.UNDER_16).toBe("Under 16");
        });

        it("should map UNDER_18 correctly", () => {
            expect(EnumMappings.UNDER_18).toBe("Under 18");
        });

        it("should map UNDER_21 correctly", () => {
            expect(EnumMappings.UNDER_21).toBe("Under 21");
        });

        it("should map SENIOR correctly", () => {
            expect(EnumMappings.SENIOR).toBe("Senior");
        });

        it("should map OVER_FIFTY correctly", () => {
            expect(EnumMappings.OVER_FIFTY).toBe("50+");
        });
    });

    describe("Relationship Type mappings", () => {
        it("should map PARENT correctly", () => {
            expect(EnumMappings.PARENT).toBe("Parent");
        });

        it("should map GUARDIAN correctly", () => {
            expect(EnumMappings.GRANDPARENT).toBe("Grandparent");
        });

        it("should map GUARDIAN correctly", () => {
            expect(EnumMappings.GUARDIAN).toBe("Guardian");
        });

        it("should map SPOUSE correctly", () => {
            expect(EnumMappings.SPOUSE).toBe("Spouse");
        });

        it("should map SIBLING correctly", () => {
            expect(EnumMappings.SIBLING).toBe("Sibling");
        });

        it("should map FRIEND correctly", () => {
            expect(EnumMappings.FRIEND).toBe("Friend");
        });

        it("should map OTHER correctly", () => {
            expect(EnumMappings.OTHER).toBe("Other");
        });
    });

    describe("Round Type mappings", () => {
        it("should map INDOOR correctly", () => {
            expect(EnumMappings.INDOOR).toBe("Indoor");
        });

        it("should map OUTDOOR correctly", () => {
            expect(EnumMappings.OUTDOOR).toBe("Outdoor");
        });
    });

    describe("Indoor Classification mappings", () => {
        it("should map indoor classifications correctly", () => {
            expect(EnumMappings.IA3).toBe("Indoor Archer 3rd Class");
            expect(EnumMappings.IA2).toBe("Indoor Archer 2nd Class");
            expect(EnumMappings.IA1).toBe("Indoor Archer 1st Class");
            expect(EnumMappings.IB3).toBe("Indoor Bowman 3rd Class");
            expect(EnumMappings.IB2).toBe("Indoor Bowman 2nd Class");
            expect(EnumMappings.IB1).toBe("Indoor Bowman 1st Class");
            expect(EnumMappings.IMB).toBe("Indoor Master Bowman");
            expect(EnumMappings.IGMB).toBe("Indoor Grand Master Bowman");
        });
    });

    describe("Outdoor Classification mappings", () => {
        it("should map outdoor classifications correctly", () => {
            expect(EnumMappings.A3).toBe("Archer 3rd Class");
            expect(EnumMappings.A2).toBe("Archer 2nd Class");
            expect(EnumMappings.A1).toBe("Archer 1st Class");
            expect(EnumMappings.B3).toBe("Bowman 3rd Class");
            expect(EnumMappings.B2).toBe("Bowman 2nd Class");
            expect(EnumMappings.B1).toBe("Bowman 1st Class");
            expect(EnumMappings.MB).toBe("Master Bowman");
            expect(EnumMappings.GMB).toBe("Grand Master Bowman ");
            expect(EnumMappings.EMB).toBe("Elite Master Bowman ");
        });
    });

    describe("General Classification mappings", () => {
        it("should map UNCLASSIFIED correctly", () => {
            expect(EnumMappings.UNCLASSIFIED).toBe("Unclassified");
        });
    });

    describe("Competition Level mappings", () => {
        it("should map competition levels correctly", () => {
            expect(EnumMappings.PRACTICE).toBe("Club Practice");
            expect(EnumMappings.CLUB_EVENT).toBe("Club Event");
            expect(EnumMappings.OPEN_COMPETITION).toBe("Open Competition");
            expect(EnumMappings.RECORDSTATUS_COMPETITION).toBe("Record Status Competition");
        });
    });

    describe("Edge cases", () => {
        it("should return undefined for non-existent keys", () => {
            expect(EnumMappings["NON_EXISTENT"]).toBeUndefined();
        });

        it("should be case sensitive", () => {
            expect(EnumMappings["member"]).toBeUndefined();
            expect(EnumMappings["Member"]).toBeUndefined();
        });

        it("should have all expected keys as strings", () => {
            Object.keys(EnumMappings).forEach(key => {
                expect(typeof key).toBe("string");
                expect(typeof EnumMappings[key]).toBe("string");
            });
        });

        it("should contain be the expected number of mappings", () => {
            const expectedMinimumMappings = 52;
            expect(Object.keys(EnumMappings).length).toBe(expectedMinimumMappings);
        });
    });
});
