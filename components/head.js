import Head from 'next/head';

export default props => (
	<Head>
		<title>{props.title || 'HETIC Newsroom'}</title>
		<meta charSet="utf-8"/>
		<meta
			name="description"
			content={
				props.description ||
			'HETIC Newsroom est le journal des héticiens: Retrouvez interviews, reportages, enquêtes, portraits et plus encore autour de la vie des étudiants de l’école HETIC.'
			}
		/>
	</Head>
);
