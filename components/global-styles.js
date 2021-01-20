import Head from 'next/head';
import DefaultColorScheme from '../lib/colors-default';

const GlobalStyles = () => (
	<>
		<Head>
			<meta key="viewport" name="viewport" content="initial-scale=1.0, width=device-width"/>
			<link key="fonts" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Work+Sans:wght@300;400;500;700&display=swap"/>
		</Head>
		<style jsx global>{`
			* {
				box-sizing: border-box;
			}

			:root {
				--color-white: ${DefaultColorScheme.white};
				--color-black: ${DefaultColorScheme.black};
				--color-dark-grey: ${DefaultColorScheme.darkGrey};
				--color-light-grey: ${DefaultColorScheme.lightGrey};
				--color-accent: ${DefaultColorScheme.accent};
				--color-positive: ${DefaultColorScheme.positive};
				--color-negative: ${DefaultColorScheme.negative};

				--color-background: var(--color-white);
				--color-foreground: var(--color-black);

				--color-titles: var(--color-black);
				--color-p: var(--color-dark-grey);

				--color-form-placeholder: var(--color-dark-grey);
			}

			::-moz-focus-inner {
				border: none;
				padding: none;
			}

			::selection {
				color: var(--color-background);
				background-color: var(--color-accent);
			}

			html, body {
				margin: 0;
				padding: 0;
				font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;

				background: var(--color-background);
				color: var(--color-foreground);
			}

			h1, h2, h3, h4, h5, h6, span, input {
				font-family: "Work Sans", sans-serif;
				margin: 0;
				font-weight: 400;
				color: var(--color-titles);
			}

			h1 {
				font-size: ${36 / 16}rem;
				font-weight: 700;
			}

			h2 {
				font-size: ${30 / 16}rem;
				font-weight: 700;
			}

			h3 {
				font-size: ${18 / 16}rem;
				font-weight: 300;
			}
			h3 strong {
				font-weight: 400;
			}
			h3 a {
				font-weight: 400;
				text-decoration: underline;
			}

			span {
				font-size: ${20 / 16}rem;
				font-weight: 700;
				color: inherit;
				line-height: 1;
			}

			input {
				font-size: ${19 / 16}rem;
				font-weight: 500;
			}

			a {
				text-decoration: none;
				color: inherit;
			}

			strong {
				font-weight: 700;
			}

			i {
				font-style: italic;
			}

			p {
				font-family: Lora, serif;
				font-weight: 400;
				font-size: ${18 / 16}rem;
				line-height: 1.56;
				color: var(--color-p);
				max-width: 660px;
			}

			div.articleHtmlContainer h2 {
				margin: 30px 0 15px;
				font-size: ${27 / 16}rem;
			}

			div.articleHtmlContainer figure {
				margin: 0;
			}

			div.articleHtmlContainer img, div.articleHtmlContainer figure.image img {
				width: calc(100% + 30px);
				position: relative;
				left: -15px;
			}

			div.articleHtmlContainer img + i, div.articleHtmlContainer figure.image figcaption {
				display: block;
				font-family: Lora, serif;
				font-style: italic;
				text-align: center;
				font-size: ${18 / 16}rem;
				color: var(--color-p);
			}

			div.articleHtmlContainer ul li, div.articleHtmlContainer ol li{
				font-family: Lora,serif;
				font-weight: 400;
				font-size: 1.125rem;
				line-height: 1.56;
				color: var(--color-p);
				max-width: 660px;
			}
		`}
		</style>
	</>
);

export default GlobalStyles;
