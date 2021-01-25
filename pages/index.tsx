import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import query from 'lib/prismic'
import Article, { toArticle, prArticle, prArticleMinFields } from 'types/article'
import { prCategoryMinFields } from 'types/category'
import { prAuthorMinFields } from 'types/author'

export const getStaticProps: GetStaticProps = async () => {
	const articles: Article[] = (await query('document.type', prArticle, {
		orderings: `[my.${prArticle}.date desc]`,
		fetch: prArticleMinFields,
		fetchLinks: [
			...prCategoryMinFields,
			...prAuthorMinFields
		],
		pageSize: 20
	})).results.map(x => toArticle(x))

	return {
		props: {
			items: articles
		}
	}
}

export default function HomeFeed({ items }: InferGetStaticPropsType<typeof getStaticProps>) {
	return <ul>
		{items.map((article: Article) => (
			<li key={article.uid}>
				<p>
					<Link href={`/article/${article.uid}`}>
						<a>{article.title}</a>
					</Link>
				</p>
			</li>
		))}
	</ul>
}
