const aws = require("aws-sdk");

const ses = new aws.SES();

export const handler = (event, context, callback) => {
    console.log(event);

    if (event.request.userAttributes.email) {
        sendEmail(
            event.request.userAttributes.email,
            "Hii Bro, Happy Raksha Bandha To You All",
            function (status) {
                callback(null, event);
            }
        );
    } else {
        callback(null, event);
    }
};

function sendEmail(to, body, completedCallback) {
    const eParams = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Text: {
                    Data: body,
                },
            },
            Subject: {
                Data: "Happy Birthday To All",
            },
        },

        Source: "lokanathgcek@gmail.com",
    };

    ses.sendEmail(eParams, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("===EMAIL SENT===");
        }
        completedCallback("Email sent");
    });
    console.log("EMAIL CODE END");
}