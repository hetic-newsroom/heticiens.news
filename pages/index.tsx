import Link from 'next/link'
import { motion } from 'framer-motion'
import query from 'lib/prismic'
import Article, { toArticle, prArticle, prArticleMinFields } from 'types/article'
import { prCategoryMinFields } from 'types/category'
import { prAuthorMinFields } from 'types/author'

export async function getStaticProps(): Promise<{ props: { items: Article[] } }> {
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

export default function HomeFeed({ items }: { items: Article[] }) {
	return <ul>
		{items.map((article: Article) => (
			<li key={article.uid}>
				<motion.p layoutId={`articleTitle-${article.uid}`}>
					<Link href={`/article/${article.uid}`}>
						<a>{article.title}</a>
					</Link>
				</motion.p>
			</li>
		))}
	</ul>
}
