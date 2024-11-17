import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init(),
        ThirdParty.init({
          // We have provided you with development keys which you can use for testing.
          // IMPORTANT: Please replace them with your own OAuth keys for production use.
          signInAndUpFeature: {
            providers: [
              {
                config: {
                  thirdPartyId: 'google',
                  clients: [
                    {
                      clientId: 'XXX',
                      clientSecret: 'XXX',
                    },
                  ],
                },
              },
              {
                config: {
                  thirdPartyId: 'github',
                  clients: [
                    {
                      clientId: 'XXX',
                      clientSecret: 'XXX',
                    },
                  ],
                },
              },
              {
                config: {
                  thirdPartyId: 'apple',
                  clients: [
                    {
                      clientId: 'XXX',
                      additionalConfig: {
                        keyId: 'XXX',
                        privateKey: 'XXX',
                        teamId: 'XXX',
                      },
                    },
                  ],
                },
              },
            ],
          },
        }),
        Session.init(),
      ],
    });
  }
}
