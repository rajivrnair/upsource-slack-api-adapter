const config   = require('./config.json');
const axios    = require('axios');
const Adapters = require('./adapters');
const _        = require('lodash');
const Maybe    = require('maybe');

module.exports = {
	talkToSlack: function(review, query) {

		const adapter = Adapters[review.dataType];
		var channel   = Maybe(query.channel);

		if (_.isUndefined(adapter)) {
			console.log(`No adapter has been registered for the event ${review.dataType}`);
			return;
		}
		var adapted = adapter(review);
		if(channel.isJust()) {
			adapted.channel = "#"+channel.value()
		}
		axios.post(config.slackWebhookUrl, adapted);
	}
};

