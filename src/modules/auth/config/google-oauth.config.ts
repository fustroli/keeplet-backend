import { registerAs } from '@nestjs/config';
import { socialConfig } from 'src/config';

export default registerAs('googleOAuth', () => ({
  clientId: socialConfig.GOOGLE_CLIENT_ID,
  clientSecret: socialConfig.GOOGLE_SECRET,
  callbackURL: socialConfig.GOOGLE_CALLBACK_URL,
}));
