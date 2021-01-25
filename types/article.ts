import type { Document } from '@prismicio/client/types/documents'
import type { RichTextBlock } from 'prismic-reactjs'
import Image, { toImage } from './image'
import Category, { toCategory } from './category'
import Author, { toAuthor } from './author'

export const prArticle = 'articles'

export default interface Article {
	id: string
	uid: string
	title: string
	date: Date | string
	category: Category
	authors: Author[]
	poster: Image
	intro: string
	content?: RichTextBlock[]
}

export const prArticleMinFields: string[] = [
	'title',
	'date',
	'category',
	'authors',
	'image',
	'intro'
].map(x => `${prArticle}.${x}`)

export const prArticleAllFields: string[] = [
	...prArticleMinFields,
	...[
		'content'
	].map(x => `${prArticle}.${x}`)
]

export function toArticle(doc: Document): Article {
	if (doc.type !== prArticle) throw new Error('type conversion failed: wrong initial type name')
	if (!doc.uid) throw new Error('type conversion failed: missing UID')

	const append: Partial<Article> = {}

	if (doc.data.content) {
		append.content = doc.data.content
	}

	return {
		id: doc.id,
		uid: doc.uid,
		title: doc.data.title[0].text,
		date: doc.data.date,
		category: toCategory(doc.data.category),
		authors: doc.data.authors.map(({ author }: { author: Document }) => toAuthor(author)),
		poster: toImage(doc.data.image),
		intro: doc.data.intro[0].text,
		...append
	}
}
