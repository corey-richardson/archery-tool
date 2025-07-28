export type ClubType = {
    id: string;
    name: string;
    createdAt: string;
    membershipDetails: {
        roles: string[];
        joinedAt: string;
        membershipId: string;
    };
}
