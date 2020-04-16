import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import getProps from '../../lib/get-props';
import Page from '../../components/page';
import ArticleCard from '../../components/article-card';
import Button from '../../components/button';

function share(title) {
	if (typeof navigator !== 'undefined' && navigator.share) {
		navigator.share({
			title,
			url: window.location
		}).catch(() => {
			// User aborted sharing, we don't care
		});
	}
}

function makeSocialLinks(social) {
	const links = [];
	Object.keys(social).forEach(network => {
		links.push(
			<a href={social[network]} target="_blank" rel="noopener noreferrer">
				<Button icon={network}/>
			</a>
		);
	});
	return links;
}

function titleToUrl(title) {
	return `/articles/${encodeURIComponent(title.replace(/ /g, '-'))}`;
}

function authorNameToURL(name) {
	return encodeURIComponent(name.normalize('NFKC').replace(/ /g, '-'));
}

export default props => {
	if (!props) {
		return (
			<Page>
				<h1>Chargement…</h1>
			</Page>
		);
	}

	const cards = [];
	props.articles.forEach(article => {
		cards.push(
			<Link href={titleToUrl(article.title)}>
				<a>
					<ArticleCard
						title={article.title}
						category={article.category}
						image={article.image}
						author={props.name}
					/>
				</a>
			</Link>
		);
	});

	return (
		<Page
			title={`${props.name} - H|N`}
			description={props.bio}
		>
			<Head>
				<meta property="og:title" content={`${props.name} - H|N`}/>
				<meta property="og:type" content="profile"/>
				<meta property="og:image" content={props.picture}/>
				<meta property="og:description" content={props.bio}/>
				<meta property="og:url" content={`https://heticiens.news/author/${authorNameToURL(props.name)}`}/>
				<meta property="og:locale" content="fr_FR"/>
				<meta property="og:site_name" content="HETIC Newsroom"/>
			</Head>
			<div className="articleContainer">
				<article>
					<header>
						<img src={(props.picture === 'no-picture') ? '/api/icons/person' : props.picture} alt={props.name}/>
						<span>Contributeur</span>
						<h1>{props.name}</h1>
					</header>
					<p className="biography">
						{props.bio}
					</p>
				</article>
				<aside>
					<div className="socialLinks">
						{makeSocialLinks(props.social)}
					</div>
					<Button
						primary
						icon="share"
						value="Partager"
						onClick={() => {
							share(`${props.name}, auteur sur HETIC Newsroom`);
						}}
					/>
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

				aside {
					grid-area: aside;
					width: 660px;
					max-width: 100%;
					margin: 0 auto;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-start;
				}

				@media (min-width: 660px) {
					aside {
						flex-direction: row;
						justify-content: space-between;
					}
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

				div.socialLinks {
					display: grid;
					grid-template-columns: repeat(${Object.keys(props.social).length}, auto);
					grid-template-rows: 1fr;
					grid-gap: 15px;
				}

				@media (max-width: 660px) {
					div.socialLinks {
						margin-bottom: 15px;
					}
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
	const {props, host} = await getProps(ctx, `/author/${ctx.params.name}`);

	if (props.error) {
		if (ctx.res) {
			ctx.res.writeHead(302, {
				Location: `${host}/404`,
				'Content-Type': 'text/html; charset=utf-8'
			});
			ctx.res.end();
			return;
		}

		Router.replace('/404');
		return;
	}

	const name = props.name.normalize('NFKC').replace(/ /g, '-');

	const {props: props2} = await getProps(ctx, `/articles/${encodeURIComponent(name)}`);

	return {
		props: {...props, articles: props2.articles}
	};
}
