import { serve } from 'inngest/next';
import inngest from '../../../src/inngest/client';
import { checkAndSendReminders } from '../../../src/inngest/functions/checkAndSendReminders';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [checkAndSendReminders],
}); 