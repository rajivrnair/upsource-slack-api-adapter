const _ = require('lodash');
const request = require('request');
const config = require('../config.json');

module.exports = function(review, channel) {
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
			let url = config.upsourceUrl + '/' + review.projectId;
			if(review.data.base.reviewId != undefined){
				url = url + '/review/' + review.data.base.reviewId;
			}
			resolve({
				text: `New comment in your project(*${_.get(review, 'projectId', '')}*) by *${_.get(review, 'data.base.actor.userName', '')}*`,
				attachments: [
					{
						fallback: `New comment in project`,
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
								title: 'Comment',
								value: review.data.commentText
							},
							{
								title: 'link',
								value: '<' + url + '>'
							}
						],
						color: '#3AA3E3'
					}
				]
			});
		});
	});
};
