const _ = require('lodash');
const config = require('../config.json');

module.exports = function(review, channel) {
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');

	return {
		text: `Review #${review.data.base.reviewNumber}: New comment by *${_.get(review, 'data.base.actor.userName', '')}*`,
		attachments: [
			{
				fallback: `Review #${review.data.base.reviewNumber}: New comment`,
				fields: [
					{
						title: 'Project',
						value: review.projectId,
						short: true
					},
					{
						title: 'Reviewer(s)',
						value: reviewers,
						short: true
					},
					{
						title: 'Comment',
						value: review.data.commentText
					},
					{
						title: 'link',
						value: '<' + config.upsourceUrl + '/' + review.projectId + '/review/' + review.data.base.reviewId + '>'
					}
				],
				color: '#3AA3E3'
			}
		]
	}
};
