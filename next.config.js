const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
	reactStrictMode: true,
	images: {
		domains: ['bucket.heticiens.news', 'images.prismic.io']
	},
	async rewrites() {
		return [
			{ source: '/rss', destination: '/api/rss' }
		]
	},
	eslint: {
		ignoreDuringBuilds: true
	}
})
