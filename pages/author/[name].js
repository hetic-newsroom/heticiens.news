import Router from 'next/router';
import getProps from '../../lib/get-props';
import Page from '../../components/page';
import Button from '../../components/button';

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

export default props => {
	if (!props) {
		return (
			<Page>
				<h1>Chargement…</h1>
			</Page>
		);
	}

	return (
		<Page
			title={`${props.name} - H|N`}
			description={props.bio}
		>
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
			</div>

			{/* TODO: Articles component */}

			<style jsx>{`
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

	return {props};
}