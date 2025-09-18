# Archery Tool (WIP)

![Deployment](https://img.shields.io/github/deployments/corey-richardson/archery-tool/production?label=Deployment%20Status)
![Website](https://img.shields.io/website?url=https%3A%2F%2Farchery-tool.vercel.app%2F&up_message=online&label=Vercel%20Site)
[![wakatime](https://wakatime.com/badge/user/55c30436-1509-4eb9-9f18-fa9b7c6060c4/project/f284d99e-acc6-43a2-a5d0-bb6bfdf0f5c6.svg)](https://wakatime.com/@coreyrichardson/projects/hrzfhtnwcv?start=2025-07-01&end=2025-09-30)
![GitHub License](https://img.shields.io/github/license/corey-richardson/archery-tool)

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Quick Start](#quick-start)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
   - [Prisma Common Commands](#prisma-common-commands)
   - [Models](#models)
   - [Enums](#enums)
6. [lib Utilities](#lib-utilities)
7. [Contributing](#contributing)
8. [License](#license)
9. [Support](#support)

## Overview

Archery Tool is an open-source platform designed to help clubs manage memberships, track scores, and organize achievements with ease. The system supports multiple user roles, allowing administrators to oversee club operations, records officers to maintain score histories, and members to view their progress and participate in events. With a focus on security and accessibility, Archery Tool offers a modern, user-friendly alternative to paid solutions, ensuring clubs of all sizes can benefit from streamlined management and transparent record keeping.

The tool is free to use and is covered by a [GNU General Public License v3.0](https://github.com/corey-richardson/archery-tool/blob/main/LICENSE). This means you are free to use, modify, and share the software, even for commercial purposes, as long as any distributed versions or derivatives remain open-source and are also licensed under the GPL v3.0. You must provide attribution and include the original license when redistributing or publishing changes. Proprietary use or relicensing is not permitted.

The target audience of this application is archery clubs and their administrators. The project was developed to support my role of Records Officer at [University of Plymouth Archery Club](https://www.upsu.com/sports/clubs/archery/) (2024-2026) and so caters to the student archery committee structure. Within this structure, the club 'Captain' acts similar to a Tournaments Officer and handles competition entries, therefore requiring specific information such as Emergency Contact details, and scores shot for Virtual or Postal League entries (namely UKSAA E-League). However the Captain does not require full access to all associated information for a user.

This links into the Role-Based Access permission levels, offering different access to user information for users with the following roles: **Member**, **Records Officer**, **Captain** and **Admin**. There is also a **Coach** role, however this role is given solely to mark club coaches seperately so they can be searched for and filtered on that attribute rather than granting any additional permissions in this version of the application.

## Tech Stack

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

- Frontend: Next.js 15, React 18, TypeScript, CSS3
- Backend: Next.js API Routes, Prisma ORM
- Database: PostgreSQL
- Authentication: NextAuth.js with OAuth (Google, Github) 
- API Documentation: Swagger UI with enforced JSDoc `@swagger`
- UI Components: Material-UI `DataGrid`
- Deployment: Vercel

## Quick Start

```sh
# Clone repository
git clone https://github.com/corey-richardson/archery-tool.git

# Install dependencies
pnpm install

# Setup environment variables

# Run database migrations
pnpm prisma migrate dev

# Seed database
pnpm prisma db seed

# Start development server
pnpm dev
```

```sh
# .env example

# Created by Vercel CLI
DATABASE_URL=""
POSTGRES_URL=""
PRISMA_DATABASE_URL=""
VERCEL_OIDC_TOKEN=""

NEXT_PUBLIC_SITE_URL="https://your-app.vercel.app"

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=""

SECRET=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

GITHUB_ID=""
GITHUB_SECRET=""

# Other OAuth providers
```

## API Endpoints

![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

All API endpoints are documented using Swagger (OpenAPI .0), meaning you can view, explore and test the API from your browser. This documentation is found on the [`/api-docs`](https://archery-tool.vercel.app/api-docs) path of the webpage.

Documentation is pre-generated during deployment from JSDoc comments in the source code. All endpoints must be properly documented with `@swagger` tags; endpoints without this documentation will trigger a ESLint errors and the deployment will be rejected.

```ts
/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Example endpoint
 *     tags: [Example]
 *     responses:
 *       200:
 *         description: Success response
 */
```

The API documentation system uses:
- `swagger-jsdoc` to parse JSDoc comments in API route source code
- `swagger-ui-react` for the interactive browser interface
- Build-time generation via `scripts/generate-swagger.js` to ensure Vercel compatibility (serverless and read-time limitations)

> On Vercel, API routes and server components are deployed as serverless functions. In this environment, dynamic file-system access at runtime is limited. By generating the OpenAPI JSON spec at build-time, the Swagger spec is pre-compiled into a static JSON file. This avoids the need for `swagger-jsdoc` to scan your API routes at runtime, which could fail due to Vercel's file structure and serverless execution model.

Ensure you are logged in when testing protected routes and that you have the permissions needed for any role-based-access endpoints.

## Database Schema

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

The application uses the Prisma ORM with a PostgreSQL database. See [here](https://www.prisma.io/docs/orm/overview/introduction) for an Introduction to Prisma ORM.

The database supports user authentication, club membership, role-based access control, emergency contact details and recorded scores.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("PRISMA_DATABASE_URL")
}
```

Prisma Client JS is generated for querying the database. PostgreSQL is used as the database provider. The connection string is loaded from the `PRISMA_DATABASE_URL` environment variable.

### Prisma Common Commands

```sh
npx prisma migrate dev # apply schema changes
npx prisma generate    # regenerate the Prisma client
npx prisma studio      # browse and edit the database via localhost GUI
npx prisma format      # format the schema, like linting
```

### Models

`User`
- Represents an individual member.
- Authentication attributes: `email`, `hashedPassword`, linked `Account` and `Session` records
- Personal Detail attributes: `archeryGBNumber`, `defaultBowstyle`, `sex`, `gender`, `yearOfBirth`
- Status and auditing attributes: `createdAt`, `updatedAt`, `archivedAt`
- Relationships:
    - Memberships via `memberOf` and `adminOf`
    - Emergency Contacts via `IceDetails`
    - Records summary and submitted scores
    - Invites Sent and Invites Received

`Invite`
- Represents an invitation to join a club
- Can be linked to an existing user through `userId` or an external invitee through `archeryGBNumber`. See [api/clubs/\[clubId\]/invites/route.ts](src\\app\\api\\clubs\\[clubId]\\invites\\route.ts).
- Tracks the inviter via `invitedBy` and club via `clubId`
- Status of type `enum InviteStatus` can be `PENDING`, `ACCEPTED`, `DECLINED` or `EXPIRED` (unused, no `expiresAt` attribute on `Invite`).
- Status is updated by a `POST` (accept) or `DELETE` (decline or rescind) request to `api\invites\[inviteId]\route.ts`

`Club`
- Represents an archery club
- `name` attribute must be unique
- Links to `memberships` and pending `invites`
- Supports multiple administrator users via the `ClubMembership` relationship

`ClubMembership`
- Link table joining a user to a club in a one-to-one relationship
- There can be multiple ClubMemberships linking the same user to the same club to allowing rejoining of a club after `endedAt` is set.
- The `role` attribute is an array of `MembershipRole` values
- Membership Lifecycle: `joinedAt` and `endedAt`

`Account`
- Used by NextAuth.js and OAuth to record login accounts (Google, GitHub)
- Uniquely identified by a combination of `provider` and `providerAccountId`
- Stores authentication tokens and metadata `access_token`, `refresh_token`, `expires_at`, etc.
- *OAuth providers do not give direct access to the user's external account. The application stores a short-lived or refreshable **token** issued during authentication. **The database does not track the external account's profile, only the identifiers and tokens necessary for login sessions are stored.**
- Flow: User logs in with OAuth provider -> provider issues tokens -> NextAuth stores the token in `Account` -> application uses the token for session validation.

`Session`
- Represents an active login session
- `sessionToken` is unique
- Linked to a `User`

`VerificationToken`
- Represents email verification and password reset tokens
- Uniquely identified by a combination of `identifier` and `token`

`IceDetails`
- Represents Emergency Contact information; formally referred to as 'In Case of Emergency' by the application
- Linked to a user via `userId`
- Includes `contactName`, `contactPhone`, `contactEmail` (optional) and `relationshipType` (optional, of type `enum RelationshipType`) of the contact.

`RecordsSummary`
- Stores a summary of information regarding classifications and handicaps achieved by a user. Also stores custom `notes` which can be set by a Records Officer to track other achievements, such as 252 or Progress awards, WA Star/Rose awards etc.
- `indoorClassification`, `outdoorClassification`
- `indoorBadgeGiven`, `outdoorBadgeGiven`
- `indoorHandicap`, `outdoorHandicap`

`Scores`
- Individual score records submitted by a user
- Round Details: `dateShot`, `roundName`, `roundType` (outdoor/indoor), `bowstyle`, `sex`, `ageCategory`, `competitionLevel`
- Score Details: `score`, `xs`, `tens`, `nines`, `hits`
- Status Details: `submittedAt`, `processedAt`
- Derived Details: `roundIndoorClassification?`, `roundOutdoorClassification?`, `roundHandicap?`
- `roundName` form field on `/submit-score` page uses an effect to fetch JSON data from `src\app\lib\IndoorRounds.json` and `src\app\lib\OutdoorRounds.json`. This data is then referenced using `useRef` to avoid unecessary re-fetches. See [src\app\(protected)\submit-score\form.tsx](src/app/(protected)/submit-score/form.tsx). The slightly more static `roundType`, `bowstyle` and `competitionLevel` fields are memoized to cache the options between re-renders avoiding unecessary calculations using the `EnumMappings` lib helper.

### Enums

`MembershipRole`
- `MEMBER`, `COACH`, `RECORD`, `CAPTAIN`, `ADMIN`

`Bowstyle`
- `BAREBOW`, `RECURVE`, `COMPOUND`, `LONGBOW`, `TRADITIONAL`

`Sex`
- `MALE`, `FEMALE`, `NOT_SET`

`AgeCategories`
- `UNDER_12`, `UNDER_14`, `UNDER_15`, `UNDER_16`, `UNDER_18`, `UNDER_21`, `SENIOR`, `OVER_FIFTY`

`RelationshipTypes`
- `PARENT`, `GUARDIAN`, `SPOUSE`, `SIBLING`, `FRIEND`, `OTHER`

`RoundType`
- `INDOOR`, `OUTDOOR`

`IndoorClassification`
- From `IA3` up to `IGMB`, plus `UNCLASSIFIED`

`OutdoorClassification`
- From `A3` up to `EMB`, plus `UNCLASSIFIED`

`CompetitionLevel`
- `PRACTICE`, `CLUB_EVENT`, `OPEN_COMPETITION`, `RECORDSTATUS_COMPETITION`

`InviteStatus`
- `PENDING`, `ACCEPTED`, `DECLINED`, `EXPIRED`

## `lib` Utilities

Here seems like a good time to mention some helper functions used in the application.

### `enumMappings.ts`

```ts
import { EnumMappings } from "@/app/lib/enumMappings";
```

`EnumMapping` is a dictionary that maps internal `enum` types into display-friendly values with the same label across the application. For example, `EnumMappings["COMPOUND"]` returns `Compound`. 

The use of this dictionary allows for a consistent naming scheme, as all references to an enum value are displayed with the same label across the application. Display names are defined in one place, so updating a label is immediately reflected everywhere it is used, such as if "Compound" suddenly required renaming to "Compound Bow". Having this conversion done on a case-by-case basis would likely result in missed updates, causing inconsistency.

### `calculateAgeCategory.ts`

```ts
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
```

This function determines the correct age category for a member based on their year of birth. Categories are aligned with the `AgeCategories` enum in the schema.

It takes an optional `displayFlag` parameter, which when set as true will display the display-friendly label using `EnumMapping` to map the enum type.

If the `year` parameter is `null`, it will default to returning *"Senior"*.

Age categories are calculated dynamically based on the current year, `new Date().getFullYear()`, so they remain valid without requiring manual yearly updates. 

---

## Contributing

Please see the [CONTRIBUTING](/CONTRIBUTING.md) guidelines to get started!

Or, another way too contribute...

[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/corey.richardson)

## License

This project is licensed under the [GNU General Public License v3.0 (GPL-3.0)](https://github.com/corey-richardson/archery-tool/blob/main/LICENSE).

All source code is publicly available, and contributions are encouraged from archers, developers, and clubs worldwide.

If you use this project, you must:
- Retain the original copyright notice.
- Clearly state if you have made modifications.
- Provide a link back to the original repository.

This is consistent with the requirements of the GPL-3.0 license.

## Support

To report a bug, please open a GitHub Issue or contact me directly; I have an archery-based Instagram where you can follow and reach me!

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/corey.richardson.archery/) 

[@corey.richardson.archery](https://www.instagram.com/corey.richardson.archery/)
