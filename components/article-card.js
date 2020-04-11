import * as React from 'react';

export default props => (
	<div className="articleCard">
		<div className="imgContainer"/>
		<h3>{props.category}</h3>
		<h2>{props.title}</h2>
		<h4>par {props.author}</h4>

		<style jsx>{`
			div.articleCard {
				max-width: 100%;
				display: grid;
				grid-template: ${(props.title.length > 25) ? `
										"img" 7rem
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
