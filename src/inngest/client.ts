import { Inngest } from 'inngest';

// Initialize the Inngest client with your event key
const inngest = new Inngest({ 
  id: 'domain-expiry-reminder', 
  eventKey: process.env.INNGEST_EVENT_KEY 
});

export default inngest; 