import { z } from "zod";
const VEnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "staging"]).default("development"),
    APP_NAME: z.string(),
    API_VERSION: z.string(),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
    PORT: z.coerce.number().min(1024).max(65535).default(3000),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number().min(1024).max(65535).default(5432),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    HOST_NAME: z.string(),
    //for AWS private S3
    AWS_S3_BUCKET: z.string().nonempty("AWS_S3_BUCKET is required"),
    AWS_S3_ACCESS_KEY_ID: z.string().nonempty("AWS_S3_ACCESS_KEY_ID is required"),
    AWS_S3_SECRET_ACCESS_KEY: z.string().nonempty("AWS_S3_SECRET_ACCESS_KEY is required"),
    AWS_S3_BUCKET_REGION: z.string().nonempty("AWS_S3_BUCKET_REGION is required"),
    //for aws public s3
    AWS_S3_PUBLIC_BUCKET: z.string().nonempty("AWS_S3_PUBLIC_BUCKET is required"),
    AWS_S3_PUBLIC_ACCESS_KEY_ID: z.string().nonempty("AWS_S3_PUBLIC_ACCESS_KEY_ID is required"),
    AWS_S3_PUBLIC_SECRET_ACCESS_KEY: z.string().nonempty("AWS_S3_PUBLIC_SECRET_ACCESS_KEY is required"),
    AWS_S3_PUBLIC_BUCKET_REGION: z.string().nonempty("AWS_S3_PUBLIC_BUCKET_REGION is required"),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    // EMAIL_USER:z.string(),
    // EMAIL_PASSWORD:z.string(),
});
// eslint-disable-next-line import/no-mutable-exports
let envData;
try {
    // eslint-disable-next-line node/no-process-env
    envData = VEnvSchema.parse(process.env);
}
catch (e) {
    const error = e;
    console.error("❌ Invalid Env");
    console.error(error.flatten());
    process.exit(1);
}
export default envData;
