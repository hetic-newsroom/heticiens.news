import type { Document } from '@prismicio/client/types/documents'

export const prCategory = 'categories'

export default interface Category {
	id: string
	uid: string
	name: string
}

export const prCategoryMinFields: string[] = [
	'title'
].map(x => `${prCategory}.${x}`)

export const prCategoryAllFields = prCategoryMinFields

export function toCategory(doc: Document): Category {
	if (doc.type !== prCategory) throw new Error('type conversion failed: wrong initial type name')
	if (!doc.uid) throw new Error('type conversion failed: missing UID')

	return {
		id: doc.id,
		uid: doc.uid,
		name: doc.data.title[0].text
	}
}
