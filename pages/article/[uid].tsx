import type { GetStaticPaths, GetStaticProps } from 'next'
import { client } from 'lib/prismic'
import Article, { toArticle, prArticle, prArticleAllFields } from 'types/article'
import { prCategoryMinFields } from 'types/category'
import { prAuthorMinFields } from 'types/author'
import ArticleFullView from 'components/article-full-view'

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [
			{ params: { uid: 'one' } }
		],
		fallback: 'blocking'
	}
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	if (!params || typeof params.uid !== 'string') return { notFound: true }

	const { uid } = params

	const article: Article = toArticle(await client().getByUID(prArticle, uid, {
		fetch: prArticleAllFields,
		fetchLinks: [
			...prCategoryMinFields,
			...prAuthorMinFields
		]
	}))

	return {
		props: {
			article
		},
		revalidate: 1800
	}
}

export default function ArticlePage({ article }: { article: Article }) {
	return <div>
		<ArticleFullView article={article}/>
	</div>
}
