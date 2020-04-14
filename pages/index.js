import Link from 'next/link';
import getProps from '../lib/get-props';
import Page from '../components/page';
import ArticleCard from '../components/article-card';

function titleToUrl(title) {
	return `/articles/${title.replace(/ /g, '-')}`;
}

export default props => {
	const cards = [];
	let bannerArticle;
	props.articles.forEach(article => {
		if (!bannerArticle) {
			bannerArticle = (
				<Link href={titleToUrl(article.title)}>
					<a>
						<div className="bannerArticle">
							<h3>{article.category}</h3>
							<h2>{article.title}</h2>
							<h4>par {article.author.name}</h4>
							<p>{article.intro}</p>

							<style jsx>{`
								.bannerArticle {
									width: 100%;
									padding: 15vmax calc((100% - 660px) / 2) 15px;
									background: center/cover url("${article.image}") no-repeat;
									margin-bottom: 30px;
								}

								@media (max-width: 659px) {
									.bannerArticle {
										width: calc(100% + 30px);
										position: relative;
										left: -15px;
										padding: 10vmax 15px 15px;
										margin-bottom: 0;
									}
								}

								h3, h2, h4, p {
									color: #fff;
								}

								h2 {
									text-shadow: 1px 1px 10px rgba(0,0,0,0.15);
								}

								h3, h4, p {
									text-shadow: 1px 1px 7px rgba(0,0,0,0.6);
								}

								h3 {
									font-weight: 500;
									text-transform: capitalize;
								}

								h2 {
									font-size: ${27 / 16}rem;
									line-height: 1.1;
								}

								p {
									font-size: ${15 / 16}rem;
									font-family: "Work Sans", sans-serif;
									font-weight: 500;
									line-height: 1.2;
									margin-bottom: 0;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 3;
									-webkit-box-orient: vertical;
									overflow: hidden;
								}
							`}
							</style>
						</div>
					</a>
				</Link>
			);
			return;
		}

		cards.push(
			<Link href={titleToUrl(article.title)}>
				<a>
					<ArticleCard
						title={article.title}
						category={article.category}
						author={article.author.name}
						image={article.image}
					/>
				</a>
			</Link>
		);
	});

	return (
		<Page>
			{bannerArticle}
			<div className="widthContainer">
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
			`}
			</style>
		</Page>
	);
};

export async function getServerSideProps(ctx) {
	const {props} = await getProps(ctx, '/latest');
	return {props};
}
