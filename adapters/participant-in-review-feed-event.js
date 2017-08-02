const _ = require('lodash');
const config = require('../config.json');

module.exports = function(review) {
	"use strict";
	const reviewers = _.chain(review).get('data.base.userIds', []).map('userName').value().join(', ');
	const reviewState  = {
		1: '_Author(?)_',
		2: '_Reviewer_',
		3: '_Watcher_'
	};

	if(review.dataType === "RemovedParticipantFromReviewFeedEventBean") {
		const formerRole = review.data.formerRole;
		let participant = review.data.participant.userName;
		return {
			text: `Review #${review.data.base.reviewNumber}: ${participant} is no longer a ${reviewState[formerRole]}`,
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
							title: 'Participant(s)',
							value: reviewers,
							short: true
						},
						{
							title: 'link',
							value: '<' + config.upsourceUrl + '/' + review.projectId + '/review/' + review.data.base.reviewId + '>'
						}
					],
					color: '#2AB27B'
				}
			]
		}
	} else if (review.dataType === "NewParticipantInReviewFeedEventBean") {
		const role = review.data.role;
		let participant = review.data.participant.userName;
		return {
			text: `Review #${review.data.base.reviewNumber}: ${participant} is now a ${reviewState[role]}`,
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
							title: 'Participant(s)',
							value: reviewers,
							short: true
						},
						{
							title: 'link',
							value: '<' + config.upsourceUrl + '/' + review.projectId + '/review/' + review.data.base.reviewId + '>'
						}
					],
					color: '#2AB27B'
				}
			]
		}
	} else {
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
							title: 'Participant(s)',
							value: reviewers,
							short: true
						},
						{
							title: 'link',
							value: '<' + config.upsourceUrl + '/' + review.projectId + '/review/' + review.data.base.reviewId + '>'
						}
					],
					color: '#2AB27B'
				}
			]
		}
	}

};
