import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { client, predicates } from 'lib/prismic'
import Article, { toArticle, prArticle, prArticleMinFields } from 'types/article'
import { prCategoryMinFields } from 'types/category'
import { prAuthorMinFields } from 'types/author'
import Spacer from 'components/spacer'
import Columns from 'components/columns'
import SearchInput from 'components/search-input'
import InfiniteScroller from 'components/infinite-scroller'
import ArticleCard from 'components/article-card'

function encodeUrl(insane: string): string {
	return encodeURIComponent(insane).replace(/%20/g, '+')
}

function decodeUrl(sane: string): string {
	return decodeURIComponent(sane.replace(/\+/g, '%20'))
}

export async function fetchSearchResults(search: string, pageSize: number, page = 1): Promise<Article[]> {
	const articles: Article[] = (await client().query([
		predicates.at('document.type', prArticle),
		predicates.fulltext('document', search)
	], {
		orderings: `[my.${prArticle}.date desc]`,
		fetch: prArticleMinFields,
		fetchLinks: [
			...prCategoryMinFields,
			...prAuthorMinFields
		],
		pageSize,
		page
	})).results.map(x => toArticle(x))
	return articles
}

export default function SearchPage() {
	const router = useRouter()
	const { q } = router.query

	const [query, setQuery] = useState('')
	const [items, setItems] = useState<Article[]>([])

	useEffect(() => {
		if (typeof q === 'string' && q.length > 2) {
			setQuery(decodeUrl(q))
		}
	}, [q])

	function search(q: string) {
		fetchSearchResults(q, 10).then(articles => {
			setQuery(q)
			setItems(articles)
			window.history.replaceState({ search: q }, '', (
				new URL(window.location.href).search = `?q=${encodeUrl(q)}`
			))
		})
	}

	return <Columns no="1" revealAnimation>
		<h1 style={{ textAlign: 'center' }}>Recherche</h1>
		<Spacer height="medium"/>
		<div style={{ width: 'min(100%, 65ch)', margin: '0 auto' }}>
			<SearchInput
				initialValue={query}
				onThrottledChange={search}
			/>
		</div>
		<Spacer height="large"/>
		{query.length > 0 && items.length === 0 &&
			<p style={{ textAlign: 'center', opacity: 0.8, margin: '0 auto' }}>Désolé, nous n'avons rien trouvé...</p>
		}
		<Columns no="2" rowGap="medium" revealAnimation>
			{query && items.length > 0 &&
				<InfiniteScroller
					forwardRevealAnimation
					initial={items.map(article => (
						<ArticleCard article={article} key={article.uid} size="small"/>
					))}
					getMore={async page => {
						return (await fetchSearchResults(query, 10, page)).map(article => (
							<ArticleCard article={article} key={article.uid} size="small"/>
						))
					}}
				/>
			}

		</Columns>
	</Columns>
}
