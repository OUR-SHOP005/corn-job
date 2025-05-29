import inngest from '../client';

// Client interface matching the API response
interface Client {
  id: string;
  email: string;
  domain: string;
  expiryDate: string;
}

// Message interface for AI-generated content
interface MessageResponse {
  message: string;
}

// Define the cron job function
export const checkAndSendReminders = inngest.createFunction(
  { id: 'daily-domain-expiry-check' },
  { cron: '10 23 * * *', corn: '0 23 * * *' }, // Run daily at 9 AM UTC
  async ({ step }) => {
    // Step 1: Fetch clients with domains expiring in 30 days
    const clientsWithExpiringDomains = await step.run('fetch-expiring-domains', async () => {
      console.log('Fetching clients with domains expiring in the next 30 days...');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/expiring-soon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch expiring domains: ${response.statusText}`);
      }

      const expiringClients: Client[] = await response.json();
      console.log(`Found ${expiringClients.length} clients with domains expiring within 30 days.`);

      return expiringClients;
    });

    // Step 2: Generate personalized messages for each client
    const messagesGenerated = await step.run('generate-reminder-messages', async () => {
      const messageResults = [];

      for (const client of clientsWithExpiringDomains) {
        try {
          console.log(`Generating reminder message for ${client.email} (domain: ${client.domain})`);

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/generate-message`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clientId: client.id,
              domain: client.domain,
              expiryDate: client.expiryDate,
              reminderType: 'DOMAIN_EXPIRY'
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to generate message: ${response.statusText}`);
          }

          const { message }: MessageResponse = await response.json();

          messageResults.push({
            client,
            message,
          });
        } catch (error) {
          console.error(`Error generating message for ${client.email}:`, error);
        }
      }

      return messageResults;
    });

    // Step 3: Send reminder emails
    const remindersSent = await step.run('send-email-reminders', async () => {
      const sendResults = [];

      for (const { client, message } of messagesGenerated) {
        try {
          console.log(`Sending domain expiry reminder to ${client.email} for domain ${client.domain}`);

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reminder/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clientId: client.id,
              email: client.email,
              domain: client.domain,
              expiryDate: client.expiryDate,
              message: message,
              reminderType: 'DOMAIN_EXPIRY'
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to send reminder: ${response.statusText}`);
          }

          const result = await response.json();
          console.log(`Reminder sent successfully to ${client.email}`);
          sendResults.push({ ...result, success: true });
        } catch (error) {
          console.error(`Error sending reminder to ${client.email}:`, error);
          sendResults.push({
            clientId: client.id,
            email: client.email,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return sendResults;
    });

    return {
      clientsChecked: clientsWithExpiringDomains.length,
      messagesGenerated: messagesGenerated.length,
      remindersSent: remindersSent.filter(result => result.success).length,
      remindersFailed: remindersSent.filter(result => !result.success).length
    };
  }
); 