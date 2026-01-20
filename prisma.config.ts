import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // For "db push", we MUST use the Direct Connection (Port 5432)
    // The connection pooler (Port 6543) does not allow schema changes.
    url: process.env.DIRECT_URL, 
  }
});