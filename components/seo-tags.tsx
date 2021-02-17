import type { ReactElement } from 'react'
import type Category from 'types/category'
import type Author from 'types/author'
import type Article from 'types/article'
import merge from 'deepmerge'
import { NextSeo, NextSeoProps, LogoJsonLd, SocialProfileJsonLd, ArticleJsonLd } from 'next-seo'
import shortenText from 'lib/text-shortener'

interface BaseSeoTagsProps {
	category?: Category
	author?: Author
	article?: Article
}

interface CategorySeoTagsProps extends BaseSeoTagsProps {
	category: Category
}
interface AuthorSeoTagsProps extends BaseSeoTagsProps {
	author: Author
}
interface ArticleSeoTagsProps extends BaseSeoTagsProps {
	article: Article
}

export type SeoTagsProps = CategorySeoTagsProps | AuthorSeoTagsProps | ArticleSeoTagsProps

export const defaultSeoProps: NextSeoProps = {
	title: 'HETIC Newsroom',
	description: 'Collectif d’étudiants, qui regroupe l’ensemble des filières de l’école HETIC. Indépendant, HETIC Newsroom se propose de raconter ce qui fait l’expérience des héticiens.',
	twitter: {
		cardType: 'summary_large_image',
		site: '@hetic_newsroom',
		handle: '@hetic_newsroom'
	},
	openGraph: {
		type: 'website',
		locale: 'fr_FR',
		/* eslint-disable-next-line @typescript-eslint/naming-convention */
		site_name: 'HETIC Newsroom',
		url: 'https://heticiens.news',
		title: 'HETIC Newsroom',
		description: 'Collectif d’étudiants, qui regroupe l’ensemble des filières de l’école HETIC. Indépendant, HETIC Newsroom se propose de raconter ce qui fait l’expérience des héticiens.',
		images: [
			{
				url: 'https://heticiens.news/opengraph.png',
				width: 800,
				height: 600,
				alt: 'HETIC Newsroom opengraph card'
			}
		]
	}
}

export default function SeoTags({ category, author, article }: SeoTagsProps) {
	let seo: NextSeoProps = {}
	const jsonLdTags: ReactElement[] = []

	if (category) {
		seo = {
			title: `HETIC Newsroom - ${category.name}`,
			noindex: true,
			openGraph: {
				title: `HETIC Newsroom - ${category.name}`,
				url: `https://heticiens.news/category/${category.uid}`
			}
		}
	}

	if (author) {
		seo = {
			title: `${author.name} sur HETIC Newsroom`,
			description: `${author.name} est un.e contributeur.rice sur HETIC Newsroom`,
			twitter: {
				handle: `@${author.social?.twitter?.split('/').pop() ?? 'hetic_newsroom'}`
			},
			openGraph: {
				type: 'profile',
				title: `${author.name} sur HETIC Newsroom`,
				description: `${author.name} est un.e contributeur.rice sur HETIC Newsroom`,
				url: `https://heticiens.news/author/${author.uid}`,
				profile: {
					username: author.uid,
					firstName: author.name.split(' ').shift(),
					lastName: author.name.split(' ').slice(1).join(' ')
				},
				images: [
					{
						url: author.picture.src,
						width: author.picture.width,
						height: author.picture.height,
						alt: author.name
					}
				]
			}
		}
		jsonLdTags.push(
			<SocialProfileJsonLd
				type="Person"
				name={author.name}
				url={`https://heticiens.news/author/${author.uid}`}
				sameAs={(author.social) ? Object.values(author.social) as string[] : []}
				key="social-jsonld"
			/>
		)
	}

	if (article) {
		seo = {
			title: `${article.title} - HETIC Newsroom`,
			description: `${shortenText(article.intro)} Un article de ${article.authors.map(x => x.name).join(' et ')} à découvrir sur HETIC Newsroom.`,
			twitter: {
				handle: `@${article.authors[0].social?.twitter?.split('/').pop() ?? 'hetic_newsroom'}`
			},
			openGraph: {
				type: 'article',
				title: `${article.title} - HETIC Newsroom`,
				description: `${shortenText(article.intro)} Un article de ${article.authors.map(x => x.name).join(' et ')} à découvrir sur HETIC Newsroom.`,
				url: `https://heticiens.news/article/${article.uid}`,
				article: {
					publishedTime: new Date(article.date).toString(),
					section: article.category.name,
					authors: article.authors.map(x => `https://heticiens.news/author/${x.uid}`)
				},
				images: [
					{
						url: article.poster.src,
						width: article.poster.width,
						height: article.poster.height,
						alt: article.poster.alt
					}
				]
			}
		}
		jsonLdTags.push(
			<ArticleJsonLd
				title={article.title}
				url={`https://heticiens.news/article/${article.uid}`}
				datePublished={new Date(article.date).toString()}
				description={`${shortenText(article.intro)} Un article de ${article.authors.map(x => x.name).join(' et ')} à découvrir sur HETIC Newsroom.`}
				images={[article.poster.src]}
				authorName={article.authors.map(x => x.name)}
				publisherName="HETIC Newsroom"
				publisherLogo="https://heticiens.news/favicon.png"
				key="article-jsonld"
			/>
		)
	}

	return <>
		<NextSeo {...merge(defaultSeoProps, seo)} />
		<LogoJsonLd logo="https://heticiens.news/favicon.png" url="https://heticiens.news"/>
		{jsonLdTags}
	</>
}
