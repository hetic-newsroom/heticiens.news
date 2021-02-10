import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import query, { client, complexQuery } from 'lib/prismic'
import Author, { toAuthor, prAuthor, prAuthorAllFields, prAuthorMinFields } from 'types/author'
import Article, { toArticle, prArticle, prArticleMinFields } from 'types/article'
import { prCategoryMinFields } from 'types/category'
import Columns from 'components/columns'
import Spacer from 'components/spacer'
import AuthorFullView from 'components/author-full-view'
import InfiniteScroller from 'components/infinite-scroller'
import ArticleCard from 'components/article-card'

export const getStaticPaths: GetStaticPaths = async () => {
	let page = 1
	let totalPages = 1
	const authorUids: string[] = []
	while(page <= totalPages) {
		const { results, total_pages: newTotalPages } = (await query('document.type', prAuthor, {
			fetch: `${prAuthor}.name`, // only fetch a single field, saves time & bandwith
			pageSize: 100,
			page
		}))
		const uids: string[] = results.map(x => x.uid as string)
		authorUids.push(...uids)

		page++
		totalPages = Number(newTotalPages)
	}

	const paths = []
	for (const uid of authorUids) {
		paths.push({
			params: { uid }
		})
	}

	return {
		paths,
		fallback: 'blocking'
	}
}

export async function fetchAuthorFeed(authId: string, pageSize: number, page = 1): Promise<Article[]> {
	const articles: Article[] = (await complexQuery([
		['document.type', prArticle],
		[`my.${prArticle}.authors.author`, authId]
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
	if (!params || typeof params.uid !== 'string') return { notFound: true }

	const { uid } = params

	let author: Author
	try {
		author = toAuthor(await client().getByUID(prAuthor, uid, {
			fetch: prAuthorAllFields
		}))
	} catch {
		return { notFound: true }
	}

	const articles: Article[] = await fetchAuthorFeed(author.id, 10)

	return {
		props: {
			author,
			articles
		},
		revalidate: 1800
	}
}

export default function AuthorPage({ author, articles }: InferGetStaticPropsType<typeof getStaticProps>) {
	return <Columns no="1">
		<Spacer height="large"/>
		<AuthorFullView author={author}/>
		<Spacer height="large"/>
		<h2>Articles récents</h2>
		<Spacer height="medium"/>
		<Columns no="2" rowGap="medium" revealAnimation>
			<InfiniteScroller
				forwardRevealAnimation
				initial={articles.map((article: Article) => (
					<ArticleCard article={article} key={article.uid} size="small"/>
				))}
				getMore={async page => {
					const articles = await fetchAuthorFeed(author.id, 10, page)
					return articles.map(article => <ArticleCard article={article} key={article.uid} size="small"/>)
				}}
			/>
		</Columns>
	</Columns>
}
