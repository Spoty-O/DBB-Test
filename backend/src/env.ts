import { cleanEnv, num, str } from 'envalid';

export default function checkEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: num(),
    DB_URL: str(),
    OWN_URL: str(),
  });
}
