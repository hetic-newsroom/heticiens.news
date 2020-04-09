module.exports = {
	target: 'serverless',
	env: {
		stage: (process.env.NODE_ENV === 'production') ? 'prod' : 'staging'
	}
};
