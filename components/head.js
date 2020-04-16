import Head from 'next/head';

export default props => (
	<Head>
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
