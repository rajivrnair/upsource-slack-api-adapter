const _ = require('lodash');

module.exports = function(review) {
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');

	return {
		text: `Review #${review.data.base.reviewNumber}: New comment`,
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
					}
				],
				color: '#3AA3E3'
			}
		]
	}
};
