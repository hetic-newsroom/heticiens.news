import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Page from '../../components/page';
import ArticleCard from '../../components/article-card';
import Button from '../../components/button';
import Share from '../../components/share-button';
import {RichText} from 'prismic-reactjs';
import Prismic from '@prismicio/client';
import {Client} from '../../prismic-configuration';

const AuthorPage = props => {
	if (!props) {
		return (
			<Page>
				<h1>Chargement…</h1>
			</Page>
		);
	}

	const socialLinks = [];
	Object.keys(props.social[0]).forEach(network => {
		if (!props.social[0][network].url) {
			return;
		}

		socialLinks.push(
			<div className="socialLink">
				<a key={network} href={props.social[0][network].url} target="_blank" rel="noopener noreferrer">
					<Button icon={network}/>
				</a>
				<style jsx>{`
					.socialLink {
						margin: 0 15px 15px 0;
					}
				`}
				</style>
			</div>
		);
	});

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

	return (
		<Page
			title={`${RichText.asText(props.name)} - H|N - HETIC Newsroom`}
			description={RichText.asText(props.bio)}
		>
			<Head>
				<meta property="og:title" content={`${RichText.asText(props.name)} - H|N`}/>
				<meta property="og:type" content="profile"/>
				<meta property="og:image" content={props.picture.url}/>
				<meta property="og:description" content={RichText.asText(props.bio)}/>
				<meta property="og:url" content={`https://heticiens.news/author/${props.uid}`}/>
				<meta property="og:locale" content="fr_FR"/>
				<meta property="og:site_name" content="HETIC Newsroom"/>
			</Head>
			<div className="articleContainer">
				<article>
					<header>
						<img src={props.picture.url} alt={RichText.asText(props.name)}/>
						<span>Contributeur</span>
						<h1>{RichText.asText(props.name)}</h1>
					</header>
					<p className="biography">
						{RichText.asText(props.bio)}
					</p>
				</article>
				<aside>
					<div className="socialLinks">
						{socialLinks}
					</div>
					<div className="shareButtonContainer">
						<Share
							type="author"
							link={`https://heticiens.news/author/${props.uid}`}
						/>
					</div>
				</aside>

				<h2>Articles publiés</h2>
				<div className="articleList">
					{cards}
				</div>
			</div>

			<style jsx>{`
				div.articleContainer {
					display: grid;
					grid-template: "article" auto
										"aside" auto / 100%;
					grid-gap: 15px;
					width: 660px;
					max-width: 100%;
					margin: 0 auto;
				}

				article {
					grid-area: article;
					width: 660px;
					max-width: 100%;
					margin: 0 auto;
				}

				header {
					align-self: flex-start;
					display: grid;
					grid-template: "pic title" auto
										"pic name" auto / 5.5rem auto;
					grid-column-gap: 15px;
					cursor: pointer;
					margin-bottom: 15px;
				}

				header img {
					grid-area: pic;
					width: 5.5rem;
					height: 5.5rem;
					border-radius: 100%;
					background: var(--color-light-grey);
					align-self: center;
				}

				header span {
					grid-area: title;
					line-height: 1;
					align-self: end;
					font-weight: 400;
				}

				header h1 {
					grid-area: name;
				}

				aside {
					grid-area: aside;
					width: 660px;
					max-width: 100%;
					margin: 0 auto;
					display: grid;
					grid-template-columns: auto 150px;
				}

				aside .socialLinks {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
				}

				aside .socialLinks > * {
					margin: 0 15px 15px 0;
				}

				aside .shareButtonContainer {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					padding-bottom: 15px;
				}

				.articleList {
					margin-bottom: 15px;
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
	const contributor = await client.getByUID('authors', ctx.params.id);

	if (contributor === undefined) {
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
		Prismic.Predicates.at('my.articles.authors.author', contributor.id)
	],
	{pageSize: 100, fetchLinks: ['categories.title', 'authors.name', 'authors.picture', 'authors.uid']}
	); // TODO: Order by published DESC?

	return {
		props: {
			uid: contributor.uid,
			...contributor.data,
			articles: articles.results
		}
	};
}

export default AuthorPage;
