import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import query, { client } from 'lib/prismic'
import Article, { toArticle, prArticle, prArticleAllFields } from 'types/article'
import { prCategoryMinFields } from 'types/category'
import { prAuthorMinFields } from 'types/author'
import ArticleFullView from 'components/article-full-view'

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
				...prAuthorMinFields
			]
		}))
	} catch {
		return { notFound: true }
	}

	return {
		props: {
			article
		},
		revalidate: 1800
	}
}

export default function ArticlePage({ article }: InferGetStaticPropsType<typeof getStaticProps>) {
	return <div>
		<ArticleFullView article={article}/>
	</div>
}
