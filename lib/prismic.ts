import type { Client } from '@prismicio/client/types/client'
import Prismic from '@prismicio/client'

const apiEndpoint = process.env.NEXT_PUBLIC_PRISMIC_API_ENDPOINT

if (!apiEndpoint) throw new Error('missing Prismic API endpoint')

export const client = () => Prismic.client(apiEndpoint)

export const predicates = Prismic.Predicates

export default async function query(path: Parameters<typeof Prismic.Predicates.at>[0], type: Parameters<typeof Prismic.Predicates.at>[1], options?: Parameters<Client['query']>[1]): Promise<ReturnType<Client['query']>> {
	const predicate = Prismic.Predicates.at(path, type)
	const res = await client().query(predicate, options)
	if (!res) throw new Error('fetching data did not return anything')
	return res
}

export async function complexQuery(predicates: [Parameters<typeof Prismic.Predicates.at>[0], Parameters<typeof Prismic.Predicates.at>[1]][], options?: Parameters<Client['query']>[1]): Promise<ReturnType<Client['query']>> {
	const res = await client().query(predicates.map(([path, type]) => {
		return Prismic.Predicates.at(path, type)
	}), options)
	if (!res) throw new Error('fetching data did not return anything')
	return res
}
