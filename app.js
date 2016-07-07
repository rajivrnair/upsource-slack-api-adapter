const config = require('./config.json');
const axios = require('axios');
const Adapters = require('./adapters');

module.exports = {
	talkToSlack: function(review) {
		console.log(review.dataType);
		axios.post(config.slackUrl, Adapters[review.dataType](review));
	}
};

