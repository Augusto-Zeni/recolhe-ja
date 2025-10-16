import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const redirectUri = request.query.redirect_uri;

    console.log('🔐 Google OAuth Guard - Starting authentication');
    console.log('  Redirect URI from query:', redirectUri);

    const options: Record<string, any> = {
      prompt: 'select_account',
      accessType: 'offline',
      scope: ['profile', 'email'],
    };

    if (redirectUri) {
      const state = Buffer.from(JSON.stringify({ redirect_uri: redirectUri })).toString('base64');
      console.log('  State parameter created:', state.substring(0, 30) + '...');

      options.state = state;
    }

    console.log('  No redirect_uri provided, using default');
    return options;
  }
}
