# Domain Expiry Reminder System

A Next.js 15 application that uses Inngest for cron jobs to check for expiring domains and send reminder emails to clients, storing logs in MongoDB.

## Features

- Daily cron job that runs at 9 AM UTC
- Checks for domains expiring in the next 30 days
- Sends email reminders to clients
- Logs all reminders in MongoDB
- Avoids sending duplicate reminders (checks for recently sent reminders)

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Inngest** for serverless cron jobs
- **MongoDB** with Mongoose for data storage

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- MongoDB database (Atlas or local)
- Inngest account

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
INNGEST_EVENT_KEY=your-inngest-event-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting up Inngest

1. Create an account on [Inngest](https://www.inngest.com/)
2. Create a new function and get your event key
3. Add your event key to the `.env.local` file

## API Routes

- `GET /api/reminder-logs` - Get all reminder logs
- `POST /api/reminder-logs` - Create a new reminder log

## Deployment

This project can be easily deployed to [Railway](https://railway.app/).

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add the environment variables
4. Deploy!

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── inngest/
│   │   │   └── route.ts
│   │   └── reminder-logs/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── dbConnect.ts
├── models/
│   └── ReminderLog.ts
├── src/
│   └── inngest/
│       ├── client.ts
│       └── functions/
│           └── checkAndSendReminders.ts
├── .env.local
├── next.config.ts
└── package.json
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
