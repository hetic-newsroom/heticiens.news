import Prismic from '@prismicio/client'

export const apiEndpoint = process.env.PRISMIC_API_ENDPOINT
export const accessToken = process.env.PRISMIC_KEY

// Client method to query documents from the Prismic repo
export const Client = (req = null) => (
	Prismic.client(apiEndpoint, createClientOptions(req, accessToken))
)

const createClientOptions = (req = null, prismicAccessToken = null) => {
	const reqOption = req ? { req } : {}
	const accessTokenOption = prismicAccessToken ? { accessToken: prismicAccessToken } : {}
	return {
		...reqOption,
		...accessTokenOption
	}
}
