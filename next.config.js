const path = require('path')

module.exports = {
	target: 'serverless',
	env: {
		stage: (process.env.NODE_ENV === 'production') ? 'prod' : 'staging'
	},
	images: {
		domains: ['bucket.heticiens.news', 'images.prismic.io']
	}
}
