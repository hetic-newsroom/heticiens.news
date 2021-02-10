import type { Document } from '@prismicio/client/types/documents'
import Image, { toImage } from './image'

export const prAuthor = 'authors'

export type SocialWebsite = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'website'

export default interface Author {
	id: string
	uid: string
	name: string
	picture: Image
	bio?: string
	social?: Partial<Record<SocialWebsite, string>>
}

export const prAuthorMinFields: string[] = [
	'name',
	'picture'
].map(x => `${prAuthor}.${x}`)

export const prAuthorAllFields: string[] = [
	...prAuthorMinFields,
	...[
		'bio',
		'social'
	].map(x => `${prAuthor}.${x}`)
]

export function toAuthor(doc: Document): Author {
	if (doc.type !== prAuthor) throw new Error('type conversion failed: wrong initial type name')
	if (!doc.uid) throw new Error('type conversion failed: missing UID')

	const append: Partial<Author> = {}

	if (doc.data.bio) {
		append.bio = doc.data.bio[0].text
	}

	if (doc.data.social) {
		const social: Author['social'] = {}
		for (const site of ['facebook', 'instagram', 'twitter', 'linkedin', 'website', 'flickr']) {
			const linkObj = doc.data.social[0][site]
			if (linkObj.url) {
				if (site === 'flickr' && social['website']) throw new Error('converting legacy format for author social links: "flickr" would override "website", aborting')
				if (site === 'flickr') {
					social['website'] = linkObj.url
				} else {
					social[site as SocialWebsite] = linkObj.url
				}
			}
		}

		append.social = social
	}

	return {
		id: doc.id,
		uid: doc.uid,
		name: doc.data.name[0].text,
		picture: toImage(doc.data.picture),
		...append
	}
}
