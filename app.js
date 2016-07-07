const config = require('./config.json');
const axios = require('axios');
const Adapters = require('./adapters');
const _ = require('lodash');

module.exports = {
	talkToSlack: function(review) {
		const adapter = Adapters[review.dataType];

		if (_.isUndefined(adapter)) {
			console.log(`No adapter has been registered for the event ${review.dataType}`);
			return;
		}

		axios.post(config.slackUrl, adapter(review));
	}
};

