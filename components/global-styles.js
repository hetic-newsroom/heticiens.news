import Head from 'next/head';

export default () => (
	<>
		<Head>
			<meta key="viewport" name="viewport" content="initial-scale=1.0, width=device-width"/>
			<link key="fonts" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Work+Sans:wght@300;400;700&display=swap"/>
		</Head>
		<style jsx global>{`
			* {
				box-sizing: border-box;
			}

			:root {
				--color-white: #fff;
				--color-black: #000;
				--color-dark-grey: #333;
				--color-light-grey: #f6f6f6;
				--color-accent: #ff4545;
				--color-positive: #2deda8;
				--color-negative: #ff4545;

				--color-background: var(--color-white);
				--color-foreground: var(--color-black);

				--color-titles: var(--color-black);
				--color-p: var(--color-dark-grey);

				--color-form-placeholder: var(--color-dark-grey);
			}

			html, body {
				margin: 0;
				padding: 0;
				font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;

				background: var(--color-background);
				color: var(--color-foreground);
			}

			h1, h2, h3, h4, h5, h6, span {
				font-family: "Work Sans";
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
				font-size: ${22 / 16}rem;
				font-weight: 700;
				color: inherit;
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
			}
		`}
		</style>
	</>
);
