const config   = require('./config.json');
const Adapters = require('./adapters');
const _        = require('lodash');
const request  = require('request');

module.exports = {
	talkToSlack: function(review, query) {

		const adapter = Adapters[review.dataType];

		if (_.isUndefined(adapter)) {
			console.log(`No adapter has been registered for the event ${review.dataType}`);
			return;
		}
		var adapted = adapter(review);
		if(!_.isUndefined(query.channel)) {

			// be compatible with parameters without a prefix. In which case we default to a general channel
			var   prefix         = '';
			const firstCharacter = query.channel.charAt(0);

			if(firstCharacter != '#' && firstCharacter != '@') {
				prefix = '#';
			}
			adapted.channel = prefix+query.channel;
		}

		request({
			url: config.slackWebhookUrl,
			method: "POST",
			json: true,
			headers: {
				"content-type": "application/json",
			},
			body: adapted
		}, function(err, res, body) {
			console.log(body);
		});
	}
};

