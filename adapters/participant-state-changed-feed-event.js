const _ = require('lodash');

module.exports = function(review) {
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');
	const reviewState  = {
		0: '_Open_',
		1: '_Closed_'
	};

	const color = (function() {
		if (review.data.newState === 0) return '#F35A00';

		return '#2AB27B'
	});

	return {
		text: `Review #${review.data.base.reviewNumber}: Participant state changed from ${reviewState[review.data.oldState]} to ${reviewState[review.data.newState]}`,
		attachments: [
			{
				fallback: `Review #${review.data.base.reviewNumber}: Participant state changed from ${reviewState[review.data.oldState]} to ${reviewState[review.data.newState]}`,
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
