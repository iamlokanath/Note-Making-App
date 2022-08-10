const config = {
  SENTRY_DSN: "https://your-dsn-id-here@sentry.io/123456",
  MAX_ATTACHMENT_SIZE: 5000000,
  // Backend config
  s3: {
    REGION: "us-east-1",
    BUCKET: "lokanath-notes-storagestack-uploadsbucketc4b27cc7-upsorg6l48cc",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://255hrqlyc9.execute-api.us-east-1.amazonaws.com",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_FdSGMBeJM",
    APP_CLIENT_ID: "6n95b66ed3ersupq320sj1u4g8",
    IDENTITY_POOL_ID: "6n95b66ed3ersupq320sj1u4g8",
  },
};

export default config;