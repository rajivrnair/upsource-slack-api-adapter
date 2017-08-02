const _ = require('lodash');
const request = require('request');
const config = require('../config.json');

module.exports = function(review) {
	"use strict";
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');

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
				text: `Review *${title}* (${review.data.base.reviewId}): Raised by *${_.get(review, 'data.base.actor.userName', '')}*`,
				attachments: [
					{
						fallback: `Review *${title}* (${review.data.base.reviewId}): Raised by *${_.get(review, 'data.base.actor.userName', '')}*`,
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
						color: '#F35A00'
					}
				]
			});
		});
	});
};
