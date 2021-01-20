import * as React from 'react';
import {RichText} from 'prismic-reactjs';

const ArticleCard = props => (
	<div className="articleCard">
		<div className="imgContainer"/>
		<h3>{RichText.asText(props.article.category.data.title)}</h3>
		<h2>{RichText.asText(props.article.title)}</h2>
		<h4>
			par {props.article.authors.reduce((accumulator, author, index) => {
				return (index === 0) ? `${RichText.asText(author.author.data.name)}` : `${accumulator} et ${RichText.asText(author.author.data.name)}`;
			}, RichText.asText(props.article.authors[0].author.data.name))}
		</h4>

		<style jsx>{`
			div.articleCard {
				max-width: 100%;
				display: grid;
				grid-template: ${(RichText.asText(props.article.title).length > 25) ? `
										"img" 14rem
										"category" auto
										"title" auto
										"author" auto / auto
									` : `
										"img category" auto
										"img title" auto
										"img author" auto / 50% auto
									`};
				grid-column-gap: 15px;
				grid-${(RichText.asText(props.article.title).length > 25) ? 'column' : 'row'}-gap: 0;
				transform: scale(1);
				transition: transform .2s ease-out;
				padding: 15px 0;
			}

			div.articleCard:hover, div.articleCard:active {
				transform: scale(1.05);
			}

			.imgContainer {
				grid-area: img;
				height: 100%;
				width: 100%;
				background: center/cover url("${props.article.image.url}") no-repeat;
			}

			h3 {
				grid-area: category;
				font-weight: 400;
				${(RichText.asText(props.article.title).length > 25) ? 'margin-top: 15px;' : ''}
				text-transform: capitalize;
			}

			h2 {
				grid-area: title;
				font-size: ${25 / 16}rem;
				line-height: 1.1;
			}

			h4 {
				grid-area: author;
				font-weight: 300;
			}
		`}
		</style>
	</div>
);

export default ArticleCard;
