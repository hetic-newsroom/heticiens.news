import Link from 'next/link';
import getProps from '../../lib/get-props';
import Page from '../../components/page';
import ArticleCard from '../../components/article-card';

function titleToUrl(title) {
	return `/articles/${title.replace(/ /g, '-')}`;
}

export default props => {
	if (!props) {
		return (
			<Page>
				<h1>Chargement…</h1>
			</Page>
		);
	}

	const category = props.category[0].toUpperCase() + props.category.slice(1);
	const cards = [];
	props.articles.forEach(article => {
		cards.push(
			<Link href={titleToUrl(article.title)}>
				<ArticleCard
					title={article.title}
					category={article.category}
					author={article.author.name}
					image={article.image}
				/>
			</Link>
		);
	});

	const notFoundMessage = (cards.length === 0) ? <h3>Aucun article n&apos;a été trouvé.</h3> : null;

	return (
		<Page title={`${category} - H|N`}>
			<h1>{category}</h1>

			{cards}
			{notFoundMessage}
			<style jsx>{`
				h1 {
					margin-bottom: 15px;
				}
			`}
			</style>
		</Page>
	);
};

export async function getServerSideProps(ctx) {
	const {props} = await getProps(ctx, `/latest/${ctx.params.category}`);
	return {props};
}
