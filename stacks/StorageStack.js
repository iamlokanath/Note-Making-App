import { Bucket, Table } from "@serverless-stack/resources";

export function StorageStack({ stack, app }) {
    // Create the DynamoDB table
    // Create an S3 bucket
    const bucket = new Bucket(stack, "Uploads");
    const table = new Table(stack, "note", {
        fields: {
            userId: "string",
            noteId: "string",
        },
        primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
    });

    return {
        table,
        bucket,
    };

}