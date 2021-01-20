const path = require('path');

module.exports = {
	target: 'serverless',
	env: {
		stage: (process.env.NODE_ENV === 'production') ? 'prod' : 'staging'
	},
	images: {
		domains: ['bucket.heticiens.news', 'images.prismic.io']
	},
	webpack: config => {
		// Used to fix build errors with jsdom
		/* eslint-disable-next-line dot-notation */
		config.resolve.alias['canvas$'] = path.resolve(__dirname, 'lib/fakecanvas.js');
		return config;
	}
};
