const _ = require('lodash');

module.exports = function(review) {
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');

	return {
		attachments: [
			{
				title: `Review #${review.data.base.reviewNumber}: Code review request from ${_.get(review, 'data.base.actor.userName', '')}`,
				fallback: `Review #${review.data.base.reviewNumber}: Code review request from ${_.get(review, 'data.base.actor.userName', '')}`,
				fields: [
					{
						title: 'Project',
						value: review.projectId,
						short: true
					},
					{
						title: 'Reviewers',
						value: reviewers,
						short: true
					}
				],
				color: '#F35A00'
			}
		]
	}
};
