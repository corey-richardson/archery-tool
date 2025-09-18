import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "src/app/api",
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Archery Tool API",
                version: "1.0",
                description: "API for Archery Club and Records Management Tool",
            },
            components: {
                securitySchemes: {
                    SessionAuth: {
                        type: "apiKey",
                        in: "cookie",
                        name: "next-auth.session-token",
                        description: "NextAuth.js session cookie authentication",
                    },
                },
                schemas: {
                    User: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            email: { type: "string" },
                            archeryGBNumber: { type: "string", nullable: true },
                            sex: { type: "string", nullable: true },
                            gender: { type: "string", nullable: true },
                            yearOfBirth: { type: "integer", nullable: true },
                            defaultBowstyle: { type: "string", nullable: true },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                    },
                    Club: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            region: { type: "string", nullable: true },
                            county: { type: "string", nullable: true },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                    },
                    ClubMembership: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            userId: { type: "string" },
                            clubId: { type: "string" },
                            roles: { type: "array", items: { type: "string" } },
                            joinedAt: { type: "string", format: "date-time" },
                            endedAt: { type: "string", format: "date-time", nullable: true },
                        },
                    },
                    EmergencyContact: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            userId: { type: "string" },
                            contactName: { type: "string" },
                            contactPhone: { type: "string" },
                            contactEmail: { type: "string", nullable: true },
                            relationshipType: { type: "string", nullable: true },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                        required: [ "id", "userId", "contactName", "contactPhone", "createdAt", "updatedAt" ],
                    },
                    Invite: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            clubId: { type: "string" },
                            userId: { type: "string", nullable: true },
                            archeryGBNumber: { type: "string" },
                            invitedBy: { type: "string" },
                            status: { type: "string", enum: [ "PENDING", "ACCEPTED", "DECLINED" ] },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                            user: { $ref: "#/components/schemas/User" },
                            club: { $ref: "#/components/schemas/Club" },
                        },
                    },
                    RecordsSummary: {
                        type: "object",
                        properties: {
                            userId: { type: "string" },
                            totalScores: { type: "integer", nullable: true },
                            averageScore: { type: "number", format: "float", nullable: true },
                            highestScore: { type: "integer", nullable: true },
                            lowestScore: { type: "integer", nullable: true },
                            handicap: { type: "number", format: "float", nullable: true },
                            totalCompetitions: { type: "integer", nullable: true },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                        required: [ "userId", "createdAt", "updatedAt" ]
                    },

                    Round: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            codename: { type: "string" },
                            body: { type: "string" },
                        },
                        required: [ "name", "codename", "body" ],
                    },
                    Score: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            ageCategory: { type: "string", nullable: true },
                            roundIndoorClassification: { type: "string", nullable: true },
                            roundOutdoorClassification: { type: "string", nullable: true },
                            roundHandicap: { type: "number", nullable: true },
                            notes: { type: "string", nullable: true },
                            sex: { type: "string", nullable: true },
                            dateShot: { type: "string", format: "date", nullable: true },
                            roundName: { type: "string", nullable: true },
                            roundType: { type: "string", nullable: true },
                            bowstyle: { type: "string", nullable: true },
                            score: { type: "integer", nullable: true },
                            xs: { type: "integer", nullable: true },
                            tens: { type: "integer", nullable: true },
                            nines: { type: "integer", nullable: true },
                            hits: { type: "integer", nullable: true },
                            competitionLevel: { type: "string", nullable: true },
                            processedAt: { type: "string", format: "date-time", nullable: true },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                        required: [ "id", "createdAt", "updatedAt" ]
                    },
                    Error: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                            message: { type: "string" },
                        },
                    },
                },
            },
            security: [
                {
                    SessionAuth: [],
                },
            ],
            servers: [
                {
                    url: "http://localhost:3000",
                    description: "Local development server",
                },
                {
                    url: "https://archery-tool.vercel.app",
                    description: "Production server",
                },
            ],

        },
    });

    return spec;
};
