# upsource-slack-api-adapter
Transforms Upsource webhooks to Slack compatible requests

## Upsource events currently supported
* ReviewCreatedFeedEventBean
* ReviewStateChangedFeedEventBean
* ParticipantStateChangedFeedEventBean
* NewParticipantInReviewFeedEventBean
* DiscussionFeedEventBean

## Requirements
Tested to run on NodeJS 6. Other versions may be supported.

## Running the adapter
Install npm dependencies by running `npm install`   
Start the application by executing `npm start`
