import Router from 'next/router';
import Link from 'next/link';
import getProps from '../../lib/get-props';
import Page from '../../components/page';
import Button from '../../components/button';

function formatDate(timestamp) {
	const d = new Date(timestamp * 1000);
	return `${d.getDay()}/${d.getMonth()}/${d.getFullYear()}`;
}

function formatReadingTime(ms) {
	return `${Math.round(ms / 1000 / 60)}min`;
}

function authorNameToURL(name) {
	const printable = name.normalize('NFKC').replace(/ /g, '-');
	return printable[0].toUpperCase() + printable.slice(1).toLowerCase();
}

function share(title) {
	if (typeof navigator !== 'undefined' && navigator.share) {
		navigator.share({
			title,
			url: window.location
		}).catch(() => {
			// User aborted sharing, we don't care
		});
	} else {
		// TODO: Leverage a modal component to display clickable icons?
	}
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

	return (
		<Page
			title={`${props.title} - H|N`}
			description={`${props.intro} À lire sur HETIC Newsroom !`}
		>
			<div className="articleContainer">
				<article>
					<span>{props.category[0].toUpperCase() + props.category.slice(1)}</span>
					<h1>{props.title}</h1>
					<h3>
						Publié le <strong>{formatDate(props.date)}</strong><br/>par <strong>{props.author.name}</strong>
					</h3>
					<h5>Temps de lecture: {formatReadingTime(props.readTime)}</h5>
					<p className="intro">
						<i>{props.intro}</i>
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
					<Link href={`/author/${authorNameToURL(props.author.name)}`}>
						<div className="author">
							<img src={(props.author.picture === 'no-picture') ? '/api/icons/person' : props.picture} alt={props.author.name}/>
							<h3>Écrit par</h3>
							<h2>{props.author.name}</h2>
						</div>
					</Link>
					<Button
						primary
						icon="share"
						value="Partager"
						onClick={() => {
							share(props.title);
						}}
					/>
				</aside>
			</div>

			{/* TODO: Next articles component */}

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

				div.articleContainer {
					display: grid;
					grid-template: "article" auto
										"aside" auto / 100%;
					grid-gap: 15px;
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

				div.author {
					align-self: flex-start;
					display: grid;
					grid-template: "pic desc" auto
										"pic name" auto / 4rem auto;
					grid-column-gap: 15px;
					cursor: pointer;
					margin-bottom: 15px;
				}

				div.author img {
					grid-area: pic;
					border-radius: 100%;
					background: var(--color-light-grey);
					align-self: center;
				}

				div.author h3 {
					line-height: 1;
					align-self: end;
				}

				div.author h2 {
					font-size: ${24 / 16}rem;
				}
			`}
			</style>
		</Page>
	);
};

export async function getServerSideProps(ctx) {
	const {props, host} = await getProps(ctx, `/article/${ctx.params.title}`);

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

	return {props};
}
