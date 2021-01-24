import type { Document } from '@prismicio/client/types/documents'
import type { RichTextBlock } from 'prismic-reactjs'
import Category, { toCategory } from './category'
import Image, { toImage } from './image'

export const prismicTypeName = 'articles'

export default interface Article {
	id: string
	uid: string
	title: string
	category: Category
	poster: Image
	date: Date
	intro: string
	content: RichTextBlock[]
}

export function toArticle(doc: Document): Article {
	if (doc.type !== prismicTypeName) throw new Error('type conversion failed: wrong initial type name')
	if (!doc.uid) throw new Error('type conversion failed: missing UID')

	return {
		id: doc.id,
		uid: doc.uid,
		title: doc.data.title[0].text,
		category: toCategory(doc.data.category),
		poster: toImage(doc.data.image),
		date: new Date(doc.data.date),
		intro: doc.data.intro[0].text,
		content: doc.data.content
	}
}
