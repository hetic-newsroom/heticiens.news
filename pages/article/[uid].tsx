import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import query, { client, predicates } from 'lib/prismic'
import Article, { toArticle, prArticle, prArticleAllFields, prArticleMinFields } from 'types/article'
import { prCategoryMinFields } from 'types/category'
import { prAuthorAllFields, prAuthorMinFields } from 'types/author'
import SeoTags from 'components/seo-tags'
import ArticleFullView from 'components/article-full-view'
import Spacer from 'components/spacer'
import Columns from 'components/columns'
import ArticleCard from 'components/article-card'
import NewsletterSignupCard from 'components/newsletter-signup'

export const getStaticPaths: GetStaticPaths = async () => {
	let page = 1
	let totalPages = 1
	const articleUids: string[] = []
	while(page <= totalPages) {
		const { results, total_pages: newTotalPages } = (await query('document.type', prArticle, {
			fetch: `${prArticle}.title`, // only fetch a single field, saves time & bandwith
			pageSize: 100,
			page
		}))
		const uids: string[] = results.map(x => x.uid as string)
		articleUids.push(...uids)

		page++
		totalPages = Number(newTotalPages)
	}

	const paths = []
	for (const uid of articleUids) {
		paths.push({
			params: { uid }
		})
	}

	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	if (!params || typeof params.uid !== 'string') return { notFound: true }

	const { uid } = params

	let article: Article
	try {
		article = toArticle(await client().getByUID(prArticle, uid, {
			fetch: prArticleAllFields,
			fetchLinks: [
				...prCategoryMinFields,
				...prAuthorAllFields // We need all fields here to properly tag social handles in seo metadata
			]
		}))
	} catch {
		return { notFound: true }
	}

	const similar: Article[] = (await client().query([
		predicates.at('document.type', prArticle),
		predicates.similar(article.id, 10)
	], {
		fetch: prArticleMinFields,
		fetchLinks: [
			...prCategoryMinFields,
			...prAuthorMinFields
		],
		pageSize: 3
	})).results.map(x => toArticle(x))

	return {
		props: {
			article,
			similar
		},
		revalidate: 1800
	}
}

export default function ArticlePage({ article, similar }: InferGetStaticPropsType<typeof getStaticProps>) {
	return <div>
		<SeoTags article={article}/>
		<ArticleFullView article={article} key={article.id}/>
		<Spacer height="large"/>
		<Columns no="1">
			<NewsletterSignupCard/>
			<Spacer height="large"/>
			<h2>À lire aussi</h2>
			<Spacer height="medium"/>
			<Columns no="3" rowGap="medium">
				{similar.map((x: Article) =>
					<ArticleCard article={x} key={x.uid}/>
				)}
			</Columns>
		</Columns>
	</div>
}
