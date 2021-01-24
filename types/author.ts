import type { Document } from '@prismicio/client/types/documents'
import Image, { toImage } from './image'

export const prismicTypeName = 'authors'

export default interface Author {
	id: string
	uid: string
	name: string
	picture: Image
	bio: string
	social: {
		facebook?: string
		instagram?: string
		twitter?: string
		linkedin?: string
		website?: string
	}
}

export function toAuthor(doc: Document): Author {
	if (doc.type !== prismicTypeName) throw new Error('type conversion failed: wrong initial type name')
	if (!doc.uid) throw new Error('type conversion failed: missing UID')

	const social: Author['social'] = {}
	for (const site of ['facebook', 'instagram', 'twitter', 'linkedin', 'website', 'flickr']) {
		const linkObj = doc.data.social[0][site]
		if (linkObj.url) {
			if (site === 'flickr' && social['website']) throw new Error('converting legacy format for author social links: "flickr" would override "website", aborting')
			if (site === 'flickr') {
				social['website'] = linkObj.url
			} else {
				social[site as keyof Author['social']] = linkObj.url
			}
		}
	}

	return {
		id: doc.id,
		uid: doc.uid,
		name: doc.data.name[0].text,
		picture: toImage(doc.data.picture),
		bio: doc.data.bio[0].text,
		social
	}
}
