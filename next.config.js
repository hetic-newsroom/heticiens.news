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
		return config;
	}
};
