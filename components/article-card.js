import * as React from 'react';

export default props => (
	<div className="articleCard">
		<div className="imgContainer"/>
		<h3>{props.category.slice(0, -1)}</h3>
		<h2>{props.title}</h2>
		<h4>
			par {props.authors.reduce((accumulator, author, index) => {
				return (index === 0) ? `${author.name}` : `${accumulator} et ${author.name}`;
			}, props.authors[0].name)}
		</h4>

		<style jsx>{`
			div.articleCard {
				max-width: 100%;
				display: grid;
				grid-template: ${(props.title.length > 25) ? `
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
				grid-${(props.title.length > 25) ? 'column' : 'row'}-gap: 0;
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
				background: center/cover url("${props.image}") no-repeat;
			}

			h3 {
				grid-area: category;
				font-weight: 400;
				${(props.title.length > 25) ? 'margin-top: 15px;' : ''}
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
