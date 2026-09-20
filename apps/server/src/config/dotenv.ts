import path from 'path';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV;
if (!env) {
  throw new Error('NODE_ENV is not defined');
}

const rootEnvPath = path.resolve(__dirname, '../../../../.env');
const modeEnvPath = path.resolve(__dirname, `../../../../.env.${env}`);

dotenv.config({ path: rootEnvPath });
dotenv.config({ path: modeEnvPath, override: true });

export default dotenv;
