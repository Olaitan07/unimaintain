import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// increase default jest timeout for e2e-ish tests
jest.setTimeout(20000);
