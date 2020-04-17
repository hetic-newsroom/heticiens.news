import Head from 'next/head';

export default props => (
	<Head>
		{/* Google Analytics */}
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-159035556-2"/>
		<script dangerouslySetInnerHTML={{__html: "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-159035556-2');"}}/>

		<title>{props.title || 'HETIC Newsroom'}</title>
		<meta charSet="utf-8"/>
		<meta
			name="description"
			content={
				props.description ||
			'Collectif d’étudiants, qui regroupe l’ensemble des filières de l’école HETIC. Indépendant, HETIC Newsroom se propose de raconter ce qui fait l’expérience des héticiens.'
			}
		/>
	</Head>
);
