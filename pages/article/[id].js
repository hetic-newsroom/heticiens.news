import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import getProps from '../../lib/get-props';
import Page from '../../components/page';
import ArticleCard from '../../components/article-card';
import Share from '../../components/share-button';

function formatDate(timestamp) {
	const d = new Date(timestamp * 1000);
	return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function formatReadingTime(ms) {
	return `${Math.round(ms / 1000 / 60)} min`;
}

export default props => {
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
	props.authors.forEach((author, index) => {
		let title = 'Avec';

		if (index === 0) {
			title = 'Écrit par';
		}

		authors.push(
			<Link key={author.id} href={`/author/${author.id}`}>
				<a>
					<div className="author">
						<img src={(author.picture === 'no-picture') ? '/api/icons/person' : author.picture} alt={author.name}/>
						<h3>{title}</h3>
						<h2>{author.name}</h2>
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
		if (article.title === props.title) {
			// Do not recommend current article
			return;
		}

		cards.push(
			<Link key={article.id} href={`/article/${article.id}`}>
				<a>
					<ArticleCard
						title={article.title}
						category={article.category}
						image={article.image}
						authors={article.authors}
					/>
				</a>
			</Link>
		);
	});

	return (
		<Page
			title={`${props.title} - H|N`}
			description={`${props.intro} À lire sur HETIC Newsroom !`}
		>
			<Head>
				<meta property="og:title" content={`${props.title} - H|N`}/>
				<meta property="og:type" content="article"/>
				<meta property="og:image" content={props.image}/>
				<meta property="og:description" content={props.intro}/>
				<meta property="og:url" content={`https://heticiens.news/article/${props.id}`}/>
				<meta property="og:locale" content="fr_FR"/>
				<meta property="og:site_name" content="HETIC Newsroom"/>
			</Head>
			<div className="articleContainer">
				<article>
					<span>{props.category[0].toUpperCase() + props.category.slice(1).slice(0, -1)}</span>
					<h1>{props.title}</h1>
					<h3>
						Publié le <strong>{formatDate(props.date)}</strong><br/>par {props.authors.reduce((accumulator, author, index) => {
							if (index === 0) {
								return <strong key={author.id}>{`${author.name}`}</strong>;
							}

							return [accumulator, ' et ', <strong key={author.id}>{`${author.name}`}</strong>];
						}, props.authors[0].name)}
					</h3>
					<h5>Temps de lecture: {formatReadingTime(props.readTime)}</h5>
					<p className="intro">
						{props.intro}
					</p>
					<div
						className="articleHtmlContainer"
						// Html is sanitized...
						/* eslint-disable-next-line react/no-danger */
						dangerouslySetInnerHTML={{
							__html: content
						}}
					/>
				</article>
				<aside>
					<div className="authorsContainer">
						{authors}
					</div>
					<div className="shareButtonContainer">
						<Share
							type="article"
							link={`https://heticiens.news/article/${props.id}`}
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
	const {props, host} = await getProps(ctx, `/article/${encodeURIComponent(ctx.params.id)}`);

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

	const {props: next} = await getProps(ctx, '/latest?count=4');

	return {
		props: {...props, next: next.articles}
	};
}
