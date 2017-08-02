const _ = require('lodash');
const request = require('request');
const config = require('../config.json');

module.exports = function(review) {
	"use strict";
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');
	const reviewState  = {
		0: '_Unread_',
		1: '_Read_',
		2: '_Accepted_',
		3: '_Rejected_'
	};

	const color = (function() {
		if (review.data.newState === 3) return '#F35A00';

		return '#2AB27B'
	});

	let participant = review.data.participant.userName;
	if(participant === undefined) {
		participant = review.data.participant.userId;
	}

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
			resolve({
				text: `Review *${title}* (${review.data.base.reviewId}): ${participant} changed state from ${reviewState[review.data.oldState]} to ${reviewState[review.data.newState]}`,
				attachments: [
					{
						fallback: `Review *${title}* (${review.data.base.reviewId}): ${participant} changed state from ${reviewState[review.data.oldState]} to ${reviewState[review.data.newState]}`,
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
		});
	});
};
