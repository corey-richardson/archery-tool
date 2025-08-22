User
- id
- name String
- email String @unique
- image String
- password String (hashed)
- accounts Account[] (OAuth)
- sessions Session[]
- defaultBowstyle Enum?
- sex Enum?
- gender String?
- yearOfBirth int?
- archived boolean
- createdAt DateTime
- updatedAt DateTime

Club
- id
- name String @unique

ClubMembership
- id
- userId String
- clubId String
- role MembershipRole (Enum)
- joinedAt DateTime
- endedAt DateTime?


---

Account
- id
- userID
- type String
- provider String
- providerAccountId String
- refresh_token String?
- access_token String?
- expires_at Int?
- token_type String?
- scope String?
- id_token String?
- session_state String?

Session
- id String @id @default(cuid())
- sessionToken String @unique
- userId String
- expires DateTime

VerificationToken
- identifier String
- token String @unique
- expires DateTime

---

ICE Details
- id
- userId String
- contactName String
- contactPhone String?
- contactEmail String?
- relationship Enum

---

Records Overview
- id
- userId String
- indoorClassification Enum?
- outdoorClassification Enum?
- indoorBadgeGiven Enum?
- outdoorBadgeGiven Enum?
- indoorHandicap int?
- outdoorHandicap int?

Scores
- id
- userId String
- dateShot Date
- scoreSubmittedWhen DateTime
- finalisedByRecordsOfficer boolean
- roundType String
- bowstyle
- score int
- xs int?
- tens int?
- nines int?
- hits int?
- roundClassification? Enum
- roundHandicap int?
- competitionLevel Enum
- notes String?