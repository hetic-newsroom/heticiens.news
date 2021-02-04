import query from 'lib/prismic'
import Article, { toArticle, prArticle, prArticleMinFields } from 'types/article'
import { prCategoryMinFields } from 'types/category'
import { prAuthorMinFields } from 'types/author'
import Columns from 'components/columns'
import ArticleCard from 'components/article-card'

export async function getStaticProps(): Promise<{ props: { items: Article[] }; revalidate: number }> {
	const articles: Article[] = (await query('document.type', prArticle, {
		orderings: `[my.${prArticle}.date desc]`,
		fetch: prArticleMinFields,
		fetchLinks: [
			...prCategoryMinFields,
			...prAuthorMinFields
		],
		pageSize: 13
	})).results.map(x => toArticle(x))

	return {
		props: {
			items: articles
		},
		revalidate: 60
	}
}

export default function HomeFeed({ items }: { items: Article[] }) {
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
