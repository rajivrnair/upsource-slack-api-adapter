const _ = require('lodash');
const request = require('request');
const config = require('../config.json');

module.exports = function(review) {
	"use strict";
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');
	const reviewState  = {
		1: '_Author(?)_',
		2: '_Reviewer_',
		3: '_Watcher_'
	};

	return new Promise(function(resolve, reject) {
		request.post(config.upsourceUrl + "/~rpc/getReviewDetails", {
			auth: {
				"user": config.upsourceUser,
				"pass": config.upsourcePass,
				"sendImmediately": true
			},
			json: true,
			body: {
				"projectId": review.projectId,
				"reviewId": review.data.base.reviewId
			}
		}).on('error', function(err) {
			reject(err);
		})
		.on('data', function(body) {
			let title = JSON.parse(body).result.title;
			if(review.dataType === "RemovedParticipantFromReviewFeedEventBean") {
				const formerRole = review.data.formerRole;
				let participant = review.data.participant.userName;
				if(participant === undefined) {
					participant = review.data.participant.userId;
				}
				resolve({
					text: `Review *${title}* (${review.data.base.reviewId}): ${participant} is no longer a ${reviewState[formerRole]}`,
					attachments: [
						{
							fallback: `Review *${title}* (${review.data.base.reviewId}): Participants changed`,
							fields: [
								{
									title: 'Project',
									value: review.projectId,
									short: true
								},
								{
									title: 'Participant(s)',
									value: reviewers,
									short: true
								},
								{
									title: 'link',
									value: '<' + config.upsourceUrl + '/' + review.projectId + '/review/' + review.data.base.reviewId + '>'
								}
							],
							color: '#2AB27B'
						}
					]
				});
			} else if (review.dataType === "NewParticipantInReviewFeedEventBean") {
				const role = review.data.role;
				let participant = review.data.participant.userName;
				if(participant === undefined) {
					participant = review.data.participant.userId;
				}
				resolve({
					text: `Review *${title}* (${review.data.base.reviewId}): ${participant} is now a ${reviewState[role]}`,
					attachments: [
						{
							fallback: `Review *${title}* (${review.data.base.reviewId}): Participants changed`,
							fields: [
								{
									title: 'Project',
									value: review.projectId,
									short: true
								},
								{
									title: 'Participant(s)',
									value: reviewers,
									short: true
								},
								{
									title: 'link',
									value: '<' + config.upsourceUrl + '/' + review.projectId + '/review/' + review.data.base.reviewId + '>'
								}
							],
							color: '#2AB27B'
						}
					]
				});
			} else {
				resolve({
					text: `Review *${title}* (${review.data.base.reviewId}): Participants changed`,
					attachments: [
						{
							fallback: `Review *${title}* (${review.data.base.reviewId}): Participants changed`,
							fields: [
								{
									title: 'Project',
									value: review.projectId,
									short: true
								},
								{
									title: 'Participant(s)',
									value: reviewers,
									short: true
								},
								{
									title: 'link',
									value: '<' + config.upsourceUrl + '/' + review.projectId + '/review/' + review.data.base.reviewId + '>'
								}
							],
							color: '#2AB27B'
						}
					]
				});
			}
		});
    });
};
