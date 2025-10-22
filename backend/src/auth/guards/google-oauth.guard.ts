import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const redirectUri = request.query.redirect_uri;

    const options: Record<string, any> = {
      prompt: 'select_account consent',
      accessType: 'offline',
      scope: ['profile', 'email'],
    };

    if (redirectUri) {
      const state = Buffer.from(JSON.stringify({ redirect_uri: redirectUri })).toString('base64');

      options.state = state;
    }

    return options;
  }
}
