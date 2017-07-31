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
		var channel;
		if(!_.isUndefined(query.channel)) {
			// be compatible with parameters without a prefix. In which case we default to a general channel
			var   prefix         = '';
			const firstCharacter = query.channel.charAt(0);

			if(firstCharacter != '#' && firstCharacter != '@') {
				prefix = '#';
			}
			channel = prefix+query.channel;
		}

		Promise.resolve(adapted).then(function(value) {
			if(!_.isUndefined(channel)) {
				value.channel = channel;
			}
			request.post(config.slackWebhookUrl, {
				json: true,
				body: value
			}, function(err, res, body) {
				console.log(body);
			});
		})
		.catch(function(err) {
			console.log(`Adapter resolved with error: ${err}`);
		})
	}
};
