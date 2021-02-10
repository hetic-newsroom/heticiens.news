import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import query, { client, complexQuery } from 'lib/prismic'
import Category, { toCategory, prCategory, prCategoryAllFields } from 'types/category'
import Article, { toArticle, prArticle, prArticleMinFields } from 'types/article'
import { prAuthorMinFields } from 'types/author'
import Spacer from 'components/spacer'
import Columns from 'components/columns'
import InfiniteScroller from 'components/infinite-scroller'
import ArticleCard from 'components/article-card'

export const getStaticPaths: GetStaticPaths = async () => {
	let page = 1
	let totalPages = 1
	const categoriesUids: string[] = []
	while(page <= totalPages) {
		const { results, total_pages: newTotalPages } = (await query('document.type', prCategory, {
			fetch: `${prCategory}.name`, // only fetch a single field, saves time & bandwith
			pageSize: 100,
			page
		}))
		const uids: string[] = results.map(x => x.uid as string)
		categoriesUids.push(...uids)

		page++
		totalPages = Number(newTotalPages)
	}

	const paths = []
	for (const uid of categoriesUids) {
		paths.push({
			params: { uid }
		})
	}

	return {
		paths,
		fallback: 'blocking'
	}
}

export async function fetchCategoryFeed(catId: string, pageSize: number, page = 1): Promise<Article[]> {
	const articles: Article[] = (await complexQuery([
		['document.type', prArticle],
		[`my.${prArticle}.category`, catId]
	], {
		orderings: `[my.${prArticle}.date desc]`,
		fetch: prArticleMinFields,
		fetchLinks: [
			...prCategoryAllFields,
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

	let category: Category
	try {
		category = toCategory(await client().getByUID(prCategory, uid, {
			fetch: prCategoryAllFields
		}))
	} catch {
		return { notFound: true }
	}

	const articles: Article[] = await fetchCategoryFeed(category.id, 10)

	return {
		props: {
			category,
			articles
		},
		revalidate: 1800
	}
}

export default function CategoryPage({ category, articles }: InferGetStaticPropsType<typeof getStaticProps>) {
	return <Columns no="1" revealAnimation>
		<h1 style={{ textAlign: 'center' }}>{ category.name }</h1>
		<Spacer height="large"/>
		<Columns no="2" rowGap="medium" revealAnimation>
			<InfiniteScroller
				forwardRevealAnimation
				initial={articles.map((article: Article) => (
					<ArticleCard article={article} key={article.uid} size="small"/>
				))}
				getMore={async page => {
					const articles = await fetchCategoryFeed(category.id, 10, page)
					return articles.map(article => <ArticleCard article={article} key={article.uid} size="small"/>)
				}}
			/>
		</Columns>
	</Columns>
}
