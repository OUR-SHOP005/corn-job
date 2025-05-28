"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ReminderLog {
  _id: string;
  clientId: string;
  email: string;
  reminderType: string;
  message: string;
  sentAt: string;
  status: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReminderLogs() {
      try {
        setLoading(true);
        const response = await fetch("/api/reminder-logs");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reminder logs");
        console.error("Error loading reminder logs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReminderLogs();
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-12">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center">
            <Image
              className="mr-3 dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={25}
              priority
            />
            <span className="text-xl font-semibold">Domain Expiry Reminder System</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            A Next.js 15 application that uses Inngest for cron jobs to check for expiring domains and 
            send reminder emails to clients, storing logs in MongoDB.
          </p>
        </div>
      </header>

      <main>
        <h2 className="text-2xl font-bold mb-6">Reminder Logs</h2>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-md">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <p className="text-sm text-red-600 dark:text-red-300 mt-2">
              Make sure your MongoDB connection is set up correctly in .env.local.
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 p-6 rounded-md">
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">No reminder logs yet</h3>
            <p className="mt-2 text-yellow-600 dark:text-yellow-300">
              The cron job will run daily at 9 AM UTC to check for domains expiring in the next 30 days.
              Once reminders are sent, they'll appear here.
            </p>
            <div className="mt-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Note: For testing, you can trigger the function manually through the Inngest dashboard.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reminder Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sent At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {log.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {log.reminderType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 max-w-xs truncate">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {new Date(log.sentAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${log.status === 'SENT' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && !error && logs.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {logs.length} reminder log(s)
          </div>
        )}
      </main>

      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Domain Expiry Reminder System</p>
          <div className="flex gap-4">
            <a 
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Next.js
            </a>
            <a 
              href="https://www.inngest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Inngest
            </a>
            <a 
              href="https://www.mongodb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              MongoDB
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
