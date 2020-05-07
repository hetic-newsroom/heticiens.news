const path = require('path');

module.exports = {
	target: 'serverless',
	env: {
		stage: (process.env.NODE_ENV === 'production') ? 'prod' : 'staging'
	},
	webpack: config => {
		// Used to fix build errors with jsdom
		config.externals = [
			'canvas',
			// This is used by next.js
			'@ampproject/toolbox-optimizer'
		];

		/* eslint-disable-next-line dot-notation */
		config.resolve.alias['canvas$'] = path.resolve(__dirname, 'lib/fakecanvas.js');
		return config;
	}
};
