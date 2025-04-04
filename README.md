# Golf App with React, TypeScript and Clerk Authentication

This project is a simple golf application built with React, TypeScript, Vite, and Material-UI. Users can sign in using Clerk authentication and create a personal golf with a photo and bio.

## Features

- User authentication with Clerk
- Profile creation with profile picture upload
- Responsive layout with Material-UI
- TypeScript for type safety
- Local storage for profile data persistence

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the root directory and add your Clerk publishable key:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
4. Update the `main.tsx` file with your Clerk publishable key

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
golf-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Loading.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── NotFound.tsx
│   │   ├── Profile.tsx
│   │   └── SignInPage.tsx
│   ├── services/
│   │   └── profileService.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── styles/
│   ├── components/
│   │   ├── button.ts       - Button styles
│   │   ├── card.ts         - Card and panel styles
│   │   ├── chips.ts        - Chip and badge styles
│   │   ├── divider.ts      - Divider styles
│   │   ├── feedback.ts     - Feedback, dialogs, empty states
│   │   ├── headers.ts      - Page and section headers
│   │   ├── icon.ts         - Icon styling
│   │   ├── infoItems.ts    - Information items with icons
│   │   ├── layout.ts       - Layout containers and structures
│   │   ├── tabs.ts         - Tab styling
│   │   ├── text.ts         - Typography styles
│   │   └── index.ts        - Exports all component styles
│   ├── foundations/
│   │   ├── mixins.ts       - Reusable style mixins
│   │   └── animations.ts   - Animation patterns
│   ├── patterns/
│   │   └── layouts.ts      - Common layout patterns
│   ├── tokens/
│   │   ├── spacing.ts      - Spacing values
│   │   └── colors.ts       - Color definitions
│   └── index.ts            - Main style exports
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Building for Production

```bash
npm run build
# or
yarn build
```

## Setting up Clerk

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. Configure your application settings and authentication methods
4. Copy your publishable key and add it to your environment variables

## License

MIT
