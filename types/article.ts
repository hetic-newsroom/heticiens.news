import type { Document } from '@prismicio/client/types/documents'
import type { RichTextBlock } from 'prismic-reactjs'
import type Category from './category'
import type Author from './author'
import Image, { toImage } from './image'

export const prismicTypeName = 'articles'

type UID = string
export default interface Article {
	id: string
	uid: string
	title: string
	date: Date | string
	category: Category | UID
	authors: Author[] | UID[]
	poster: Image
	intro: string
	content: RichTextBlock[]
}

export interface ResolvedArticle extends Article {
	category: Category
	authors: Author[]
}

interface ConvertedArticle extends Article {
	category: UID
	authors: UID[]
	date: string
}

export function toArticle(doc: Document): ConvertedArticle {
	if (doc.type !== prismicTypeName) throw new Error('type conversion failed: wrong initial type name')
	if (!doc.uid) throw new Error('type conversion failed: missing UID')

	return {
		id: doc.id,
		uid: doc.uid,
		title: doc.data.title[0].text,
		date: doc.data.date,
		category: doc.data.category.uid,
		authors: doc.data.authors.map((doc: { author: { uid: string } }) => doc.author.uid),
		poster: toImage(doc.data.image),
		intro: doc.data.intro[0].text,
		content: doc.data.content
	}
}
