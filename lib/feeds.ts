import type { ResolvedArticle } from 'types/article'
import { Feed } from 'feed'

export default function makeFeed(items: ResolvedArticle[]): Feed {
	const feed = new Feed({
		id: 'https://heticiens.news',
		title: 'HETIC Newsroom',
		language: 'fr',
		link: 'https://heticiens.news',
		favicon: 'https://heticiens.news/favicon.png',
		description: 'Collectif d’étudiants, qui regroupe l’ensemble des filières de l’école HETIC. Indépendant, HETIC Newsroom se propose de raconter ce qui fait l’expérience des héticiens.',
		copyright: `Tout droits réservés ${new Date().getFullYear()}`,
		generator: 'hn-api'
	})

	for (const i of items) {
		feed.addItem({
			title: i.title,
			link: `https://heticiens.news/article/${i.uid}`,
			date: new Date(i.date),
			category: [{
				name: i.category.name
			}],
			image: i.poster.src,
			description: i.intro,
			author: i.authors.map(a => {
				return {
					name: a.name,
					email: 'info@heticiens.news',
					link: `https://heticiens.news/author/${a.uid}`
				}
			})
		})
	}

	return feed
}
