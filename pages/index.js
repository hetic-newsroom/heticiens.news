import Link from 'next/link';
import Head from 'next/head';
import getProps from '../lib/get-props';
import Page from '../components/page';
import ArticleCard from '../components/article-card';
import BannerArticle from '../components/banner-article';

export default props => {
	const cards = [];
	let bannerArticle;
	props.articles.forEach(article => {
		if (!bannerArticle) {
			bannerArticle = (
				<Link href={`/article/${article.id}`}>
					<a>
						<BannerArticle article={article}/>
					</a>
				</Link>
			);
			return;
		}

		cards.push(
			<Link key={article.id} href={`/article/${article.id}`}>
				<a>
					<ArticleCard
						title={article.title}
						category={article.category}
						authors={article.authors}
						image={article.image}
					/>
				</a>
			</Link>
		);
	});

	return (
		<Page>
			<Head>
				<meta property="og:title" content="HETIC Newsroom"/>
				<meta property="og:type" content="website"/>
				<meta property="og:image" content="https://heticiens.news/favicon.png"/>
				<meta property="og:description" content="Collectif d’étudiants, qui regroupe l’ensemble des filières de l’école HETIC. Indépendant, HETIC Newsroom se propose de raconter ce qui fait l’expérience des héticiens."/>
				<meta property="og:url" content="https://heticiens.news"/>
				<meta property="og:locale" content="fr_FR"/>
				<meta property="og:site_name" content="HETIC Newsroom"/>
			</Head>
			{bannerArticle}
			<div className="widthContainer">
				<div className="intro">
					<h2>👋 Bienvenue!</h2>
					<p>
						Bienvenue sur le site HETIC Newsroom!<br/><br/>Plongez dans l’expérience HETIC, racontée par les étudiants eux-mêmes.<br/>Nous sommes un collectif, qui représente l’ensemble des filières de l’école.<br/>Tous les héticiens sont les bienvenus. Une aide ponctuelle, une critique (constructive), une suggestion d’article ou un engagement à plus long terme ?<br/> N’hésitez pas à nous contacter: <strong><a href="mailto:info@heticiens.news">info@heticiens.news</a></strong>.<br/><br/>Bonne consultation!
					</p>
				</div>
				<h2>À la une</h2>
				<div className="articleList">
					{cards}
				</div>
				<h2>Retrouvez aussi</h2>
				<div className="categories">
					<Link href="/category/interviews">
						<a>
							<span>Interviews</span>
						</a>
					</Link>
					<Link href="/category/reportages">
						<a>
							<span>Reportages</span>
						</a>
					</Link>
					<Link href="/category/enquêtes">
						<a>
							<span>Enquêtes</span>
						</a>
					</Link>
					<Link href="/category/opinions">
						<a>
							<span>Opinions</span>
						</a>
					</Link>
					<Link href="/category/portraits">
						<a>
							<span>Portraits</span>
						</a>
					</Link>
					<Link href="/about">
						<a>
							<span>À propos</span>
						</a>
					</Link>
				</div>
			</div>

			<style jsx>{`
				.widthContainer {
					width: 100%;
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

				h2 {
					margin-top: 15px;
				}

				.categories {
					margin: 15px 0;
					margin-bottom: 30px;
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					grid-template-rows: repeat(3, auto);
					align-items: center;
					justify-items: center;
				}

				.categories span {
					display: block;
					padding: 7.5px;
					font-size: ${23 / 16}rem;
					transition: color .2s ease-out;
				}

				.categories span:hover, .categories span:active {
					color: var(--color-accent);
				}

				.intro {
					// background: var(--color-light-grey);
					// padding: 15px;
					border-radius: 20px;
					margin-bottom: 30px;
					display: none;
				}
			`}
			</style>
		</Page>
	);
};

export async function getServerSideProps(ctx) {
	const {props} = await getProps(ctx, '/article/latest');
	return {props};
}
