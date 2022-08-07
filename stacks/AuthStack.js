import * as iam from "aws-cdk-lib/aws-iam";
import { Auth, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";
import { ApiStack } from "./ApiStack";
import * as cognito from "aws-cdk-lib/aws-cognito"

export function AuthStack({ stack, app }) {
  const { bucket } = use(StorageStack);
  const { api } = use(ApiStack);

  // Create a Cognito User Pool and Identity Pool
  const auth = new Auth(stack, "Auth", {
    login: ["email"],
    identityPoolFederation: {
      google: {
        clientId: "167775773265-ctbjhgj5i73aru1jab7vttmtd7fdq0au.apps.googleusercontent.com",
      }
    },
    cdk: {
      userPoolClient: {
        supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.GOOGLE,
        cognito.UserPoolClientIdentityProvider.FACEBOOK],
        oAuth: {
          callbackUrls: ["http://localhost:3000"],
          logoutUrls: ["http://localhost:3000"],
        },
      },
    }
  });

  const GoogleProvider = new cognito.UserPoolIdentityProviderGoogle(stack, "Google", {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    userPool: auth.cdk.userPool,
    scopes: ["profile", "email", "openid"],
    attributeMapping: {
      email: cognito.ProviderAttribute.GOOGLE_EMAIL,
      givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
      familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
      profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
    },
  });

  const FacebookProvider = new cognito.UserPoolIdentityProviderFacebook(
    stack,
    "Facebook",
    {
      clientId: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      userPool: auth.cdk.userPool,
      attributeMapping: {
        email: cognito.ProviderAttribute.FACEBOOK_EMAIL,
        givenName: cognito.ProviderAttribute.FACEBOOK_NAME,
      },
    }
  );
  

  // attach the created provider to our userpool
  auth.cdk.userPoolClient.node.addDependency(GoogleProvider,FacebookProvider);

  auth.attachPermissionsForAuthUsers(stack, [
    // Allow access to the API
    api,
    // Policy granting access to a specific folder in the bucket
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);


  // Show the auth resources in the output
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });

  // Return the auth resource
  return {
    auth,
  };
}