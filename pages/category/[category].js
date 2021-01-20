import Link from 'next/link';
import Router from 'next/router';
import Page from '../../components/page';
import ArticleCard from '../../components/article-card';
import Prismic from '@prismicio/client';
import {RichText} from 'prismic-reactjs';
import {Client} from '../../prismic-configuration';

const CategoryPage = props => {
	if (!props) {
		return (
			<Page>
				<h1>Chargement…</h1>
			</Page>
		);
	}

	const category = props.category;
	const cards = [];
	props.articles.forEach(article => {
		cards.push(
			<Link key={article.uid} href={`/article/${article.uid}`}>
				<a>
					<ArticleCard
						article={article.data}
					/>
				</a>
			</Link>
		);
	});

	const notFoundMessage = (cards.length === 0) ? <h3>Aucun article n&apos;a été trouvé.</h3> : null;

	return (
		<Page title={`${category} - H|N - HETIC Newsroom`}>
			<article>
				<h1>{category}</h1>

				<div className="articleList">
					{cards}
				</div>
				{notFoundMessage}
			</article>

			<style jsx>{`
				article {
					max-width: 660px;
					margin: 0 auto;
				}

				@media (min-width: 660px) {
					.articleList {
						display: grid;
						grid-template-columns: 1fr 1fr;
						grid-column-gap: 15px;
					}
				}

				h1 {
					margin-bottom: 15px;
				}
			`}
			</style>
		</Page>
	);
};

export async function getServerSideProps(ctx) {
	const client = Client();

	const category = await client.getByUID('categories', ctx.params.category);

	if (category === undefined) {
		if (ctx.res) {
			ctx.res.writeHead(302, {
				Location: '/404',
				'Content-Type': 'text/html; charset=utf-8'
			});
			ctx.res.end();
			return;
		}

		Router.replace('/404');
		return;
	}

	const articles = await client.query([
		Prismic.Predicates.at('document.type', 'articles'),
		Prismic.Predicates.at('my.articles.category', category.id)
	],
	{pageSize: 100, fetchLinks: ['categories.title', 'authors.name', 'authors.picture', 'authors.uid']}
	); // TODO: Order by published DESC?

	return {
		props: {
			category: RichText.asText(category.data.title),
			articles: articles.results
		}
	};
}

export default CategoryPage;
