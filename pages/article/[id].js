import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import {Client} from '../../prismic-configuration';
import {Date, RichText} from 'prismic-reactjs';
import Page from '../../components/page';
import ArticleCard from '../../components/article-card';
import Share from '../../components/share-button';
import FlashMessage from '../../components/flash-message';

function formatReadingTime(ms) {
	return `${Math.round(ms / 1000 / 60)} min`;
}

const ArticlePage = props => {
	if (!props) {
		return (
			<Page>
				<h1>Chargement…</h1>
			</Page>
		);
	}

	let content;
	if (props.content) {
		content = props.content;
	} else {
		content = 'Chargement en cours…';
	}

	const authors = [];
	props.authors.forEach((_author, index) => {
		const author = _author.author;
		let title = 'Avec';

		if (index === 0) {
			title = 'Écrit par';
		}

		authors.push(
			<Link key={author.uid} href={`/author/${author.uid}`}>
				<a>
					<div className="author">
						<img src={author.data.picture.url} alt={RichText.asText(author.data.name)}/>
						<h3>{title}</h3>
						<h2>{RichText.asText(author.data.name)}</h2>
						<style jsx>{`
							div.author {
								display: grid;
								grid-template: "pic desc" auto
													"pic name" auto / 4rem auto;
								grid-column-gap: 15px;
								cursor: pointer;
								margin: 0 15px 15px 0;
							}

							div.author img {
								grid-area: pic;
								width: 4rem;
								height: 4rem;
								border-radius: 100%;
								background: var(--color-light-grey);
								align-self: center;
							}

							div.author h3 {
								grid-area: desc;
								line-height: 1;
								align-self: end;
							}

							div.author h2 {
								grid-area: name;
								font-size: ${24 / 16}rem;
							}
						`}
						</style>
					</div>
				</a>
			</Link>
		);
	});

	const cards = [];
	props.next.forEach(article => {
		if (RichText.asText(article.data.title) === RichText.asText(props.title)) {
			// Do not recommend current article
			return;
		}

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

	return (
		<Page
			title={`${RichText.asText(props.title)} - HETIC Newsroom`}
			description={`${RichText.asText(props.intro)} À lire sur HETIC Newsroom !`}
		>
			<Head>
				<meta property="og:title" content={`${RichText.asText(props.title)} - HETIC Newsroom`}/>
				<meta property="og:type" content="article"/>
				<meta property="og:image" content={props.image.url}/>
				<meta property="og:description" content={RichText.asText(props.intro)}/>
				<meta property="og:url" content={`https://heticiens.news/article/${props.uid}`}/>
				<meta property="og:locale" content="fr_FR"/>
				<meta property="og:site_name" content="HETIC Newsroom"/>
			</Head>
			<div className="articleContainer">
				<article>
					{
						// TODO: Fix this for Prismic
						props.status === 'draft' &&
							<FlashMessage accent>
								Vous êtes actuellement en train de prévisualiser un brouillon.
							</FlashMessage>
					}
					<span>{RichText.asText(props.category.data.title)}</span>
					<h1>{RichText.asText(props.title)}</h1>
					<h3>
						Publié le <strong>{Date(props.first_publication_date)}</strong><br/>par {props.authors.reduce((accumulator, author, index) => {
							if (index === 0) {
								return <strong key={author.uid}>{`${RichText.asText(author.author.data.name)}`}</strong>;
							}

							return [accumulator, ' et ', <strong key={author.uid}>{`${RichText.asText(author.author.data.name)}`}</strong>];
						}, RichText.asText(props.authors[0].author.data.name))}
					</h3>
					<h5>Temps de lecture: {formatReadingTime(props.readTime || 20000)}</h5>
					<p className="intro">
						{RichText.asText(props.intro)}
					</p>
					<div className="articleHtmlContainer">
						{RichText.render(content)}
					</div>
				</article>
				<aside>
					<div className="authorsContainer">
						{authors}
					</div>
					<div className="shareButtonContainer">
						<Share
							type="article"
							link={`https://heticiens.news/article/${props.uid}`}
						/>
					</div>
				</aside>

				<h2>Voir aussi</h2>
				<div className="articleList">
					{cards}
				</div>
			</div>

			<style jsx>{`
				span {
					font-weight: 400;
				}

				h1 {
					margin-bottom: 0.5rem;
				}

				h5 {
					opacity: 0.4;
					margin-top: 0.5rem;
				}

				p.intro {
					font-weight: 700;
				}

				div.articleContainer {
					display: grid;
					grid-template: "article" auto
										"aside" auto / 100%;
					grid-gap: 15px;
					max-width: 660px;
					margin: 0 auto;
				}

				article {
					grid-area: article;
					width: 660px;
					max-width: 100%;
					margin: 0 auto;
				}

				aside {
					grid-area: aside;
					width: 660px;
					max-width: 100%;
					margin: 0 auto;
					display: grid;
					grid-template-columns: auto 150px;
				}

				aside .authorsContainer {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
				}

				aside .shareButtonContainer {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					padding-bottom: 15px;
				}

				aside + h2 {
					margin-top: 30px;
				}

				@media (min-width: 660px) {
					.articleList {
						display: grid;
						grid-template-columns: 1fr 1fr;
						grid-column-gap: 15px;
					}
				}
			`}
			</style>
		</Page>
	);
};

export async function getServerSideProps(ctx) {
	const client = Client();
	const article = await client.getByUID('articles', ctx.params.id, {fetchLinks: ['categories.title', 'authors.name', 'authors.picture', 'authors.uid']});

	if (article === undefined) {
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

	const next = await client.query(
		Prismic.Predicates.at('document.type', 'articles'),
		{pageSize: 4, fetchLinks: ['categories.title', 'authors.name', 'authors.picture', 'authors.uid']}
	); // TODO: Order by published DESC?

	return {
		props: {
			firstRelease: article.first_publication_date,
			uid: article.uid,
			...article.data,
			next: next.results
		}
	};
}

export default ArticlePage;
