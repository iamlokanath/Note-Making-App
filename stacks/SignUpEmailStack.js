import { Function } from "@serverless-stack/resources";

export function SignUpEmailStack({ stack, app }) {
    const functionEmail = new Function(stack, "email", {
        handler: "../services/functions/signupemail.handler",
    });

    return { functionEmail }
}