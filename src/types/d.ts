export {};

declare global {
  interface Window {
    Clerk?: {
      user: Promise<{
        id: string;
        firstName: string;
        lastName: string;
        primaryEmailAddress?: { emailAddress: string };
        imageUrl?: string;
      }>;
    };
  }
}
