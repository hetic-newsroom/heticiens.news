import type { Client } from '@prismicio/client/types/client'
import Prismic from '@prismicio/client'

const apiEndpoint = process.env.PRISMIC_API_ENDPOINT
const accessToken = process.env.PRISMIC_KEY

if (!apiEndpoint || !accessToken) throw new Error('missing Prismic env variables')

export const client = () => Prismic.client(apiEndpoint, { accessToken })

export const predicates = Prismic.Predicates

export default async function query(path: Parameters<typeof Prismic.Predicates.at>[0], type: Parameters<typeof Prismic.Predicates.at>[1], options?: Parameters<Client['query']>[1]): Promise<ReturnType<Client['query']>> {
	const predicate = Prismic.Predicates.at(path, type)
	const res = await client().query(predicate, options)
	if (!res) throw new Error('fetching data did not return anything')
	return res
}
