import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import query from 'lib/prismic'
import Article, { toArticle, prArticle, prArticleMinFields } from 'types/article'
import { prCategoryMinFields } from 'types/category'
import { prAuthorMinFields } from 'types/author'
import Spacer from 'components/spacer'
import Columns from 'components/columns'
import InfiniteScroller from 'components/infinite-scroller'
import ArticleCard from 'components/article-card'
import NewsletterSignupCard from 'components/newsletter-signup'

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
		<Spacer height="medium"/>
		<Columns no="3" columnGap="small" revealAnimation>
			{items.slice(1, 4).map((article: Article) => (
				<ArticleCard article={article} key={article.uid} size="medium"/>
			))}
		</Columns>
		<Spacer height="medium"/>
		<NewsletterSignupCard/>
		<Spacer height="medium"/>
		<Columns no="2" rowGap="medium" revealAnimation>
			<InfiniteScroller
				forwardRevealAnimation
				initial={items.slice(4).map((article: Article) => (
					<ArticleCard article={article} key={article.uid} size="small"/>
				))}
				getMore={async page => {
					const articles = await fetchHomeFeed(13, page)
					return articles.map(article => <ArticleCard article={article} key={article.uid} size="small"/>)
				}}
			/>
		</Columns>
	</Columns>
}
