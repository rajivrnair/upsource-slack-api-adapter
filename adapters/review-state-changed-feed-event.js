const _ = require('lodash');
const request = require('request');
const config = require('../config.json');

module.exports = function(review) {
	"use strict";
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');
	const reviewState  = {
		0: '_Open_',
		1: '_Closed_'
	};

	const color = (function() {
		if (review.data.newState === 0) return '#F35A00';

		return '#2AB27B'
	});

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
				text: `Review *${title}* (${review.data.base.reviewId}): Review state changed from ${reviewState[review.data.oldState]} to ${reviewState[review.data.newState]}`,
				attachments: [
					{
						fallback: `Review *${title}* (${review.data.base.reviewId}): Review state changed from ${reviewState[review.data.oldState]} to ${reviewState[review.data.newState]}`,
						fields: [
							{
								title: 'Project',
								value: review.projectId,
								short: true
							},
							{
								title: 'Changed by',
								value: review.data.base.actor.userName,
								short: true
							},
							{
								title: 'link',
								value: '<' + config.upsourceUrl + '/' + review.projectId + '/review/' + review.data.base.reviewId + '>'
							}
						],
						color: color()
					}
				]
			});
		});
	});
};
