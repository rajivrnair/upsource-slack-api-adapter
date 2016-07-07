const _ = require('lodash');

module.exports = function(review) {
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');

	return {
		text: `Review #${review.data.base.reviewNumber}: Participants changed`,
		attachments: [
			{
				fallback: `Review #${review.data.base.reviewNumber}: Participants changed`,
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
					}
				],
				color: '#2AB27B'
			}
		]
	}
};
