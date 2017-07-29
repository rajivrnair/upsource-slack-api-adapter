const _ = require('lodash');

module.exports = function(review) {
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');

	return {
		text: `Review #${review.data.base.reviewNumber}: Raised by *${_.get(review, 'data.base.actor.userName', '')}*`,
		attachments: [
			{
				fallback: `Review #${review.data.base.reviewNumber}: Raised by *${_.get(review, 'data.base.actor.userName', '')}*`,
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
					}
				],
				color: '#F35A00'
			}
		]
	}
};
