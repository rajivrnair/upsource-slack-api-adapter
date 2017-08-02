const _ = require('lodash');

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

	return {
		text: `Review #${review.data.base.reviewNumber}: ${participant} changed state from ${reviewState[review.data.oldState]} to ${reviewState[review.data.newState]}`,
		attachments: [
			{
				fallback: `Review #${review.data.base.reviewNumber}: ${participant} changed state from ${reviewState[review.data.oldState]} to ${reviewState[review.data.newState]}`,
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
				color: '#2AB27B'
			}
		]
	}
};
