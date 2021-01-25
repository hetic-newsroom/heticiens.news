import query, { client } from 'lib/prismic'
import { ResolvedArticle, toArticle, prismicTypeName as prArticle } from 'types/article'
import { toCategory, prismicTypeName as prCategory } from 'types/category'
import { toAuthor, prismicTypeName as prAuthor } from 'types/author'

export async function getStaticProps() {
	const articles: ResolvedArticle[] = await Promise.all((await query('document.type', prArticle, {
		orderings: `[my.${prArticle}.date desc]`,
		pageSize: 20
	})).results.map(x => toArticle(x)).map(async (article): Promise<ResolvedArticle> => {
		return {
			...article,
			category: toCategory(await client().getByUID(prCategory, article.category, {})),
			authors: await Promise.all(article.authors.map(async uid => toAuthor(await client().getByUID(prAuthor, uid, {}))))
		}
	}))

	return {
		props: {
			items: articles
		}
	}
}

export interface HomeFeedProps {
	items: ResolvedArticle[]
}

export default function HomeFeed({ items }: HomeFeedProps) {
	console.log(items.map(x => {
		x.date = new Date(x.date)
		return x
	}))

	return <>
		<h1>hetic newzrom</h1>
	</>
}
