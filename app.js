const config = require('./config.json');
const axios = require('axios');
const Adapters = require('./adapters');

module.exports = {
	talkToSlack: function(review) {
		const adapter = Adapters[review.dataType];

		if (_.isEmpty(adapter)) {
			console.log(`No adapter has been registered for the event ${review.dataType}`);
			return;
		}

		axios.post(config.slackUrl, adapter(review));
	}
};

