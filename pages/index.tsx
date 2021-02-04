import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import query from 'lib/prismic'
import Article, { toArticle, prArticle, prArticleMinFields } from 'types/article'
import { prCategoryMinFields } from 'types/category'
import { prAuthorMinFields } from 'types/author'
import Columns from 'components/columns'
import ArticleCard from 'components/article-card'

export async function fetchHomeFeed(pageSize: number, page = 1): Promise<Article[]> {
	const articles: Article[] = (await query('document.type', prArticle, {
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

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {
			items: await fetchHomeFeed(13)
		},
		revalidate: 60
	}
}

export default function HomeFeed({ items }: InferGetStaticPropsType<typeof getStaticProps>) {
	return <Columns no="1" revealAnimation>
		<ArticleCard
			size="large"
			article={items[0]}
		/>
		<Columns no="3" revealAnimation>
			{items.slice(1).map((article: Article) => (
				<ArticleCard article={article} key={article.uid}/>
			))}
		</Columns>
	</Columns>
}
