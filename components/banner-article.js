import * as React from 'react';

export default props => (
	<div className={['bannerArticle', props.className].join(' ')}>
		<h3>{props.article.category.slice(0, -1)}</h3>
		<h2>{props.article.title}</h2>
		{ !props.preview &&
			<h4>
				par {props.article.authors.reduce((accumulator, author, index) => {
					return (index === 0) ? `${author.name}` : `${accumulator} et ${author.name}`;
				}, props.article.authors[0].name)}
			</h4>}
		<p>{props.article.intro}</p>

		<style jsx>{`
				.bannerArticle {
					width: 100%;
					padding: 15vmax calc((100% - 660px) / 2) 15px;
					background: center/cover url("${props.article.image}") no-repeat;
					margin-bottom: 30px;
				}

				@media (max-width: 659px) {
					.bannerArticle {
						width: calc(100% + 30px);
						position: relative;
						left: -15px;
						padding: 15vmax 15px 15px;
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
);
