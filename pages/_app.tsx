import type { AppProps, AppContext } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import { AnimateSharedLayout } from 'framer-motion'
import LoadingBar from 'components/loading-bar'
import Header from 'components/header'
import 'stylelib/defaults.scss'

function HeticNewsroom({ Component, pageProps }: AppProps) {
	return <>
		<Head>
			<title>HETIC Newsroom</title>
			<meta charSet="utf-8"/>
			<meta name="viewport" content="initial-scale=1.0, width=device-width"/>

			<meta name="description" content="Collectif d’étudiants, qui regroupe l’ensemble des filières de l’école HETIC. Indépendant, HETIC Newsroom se propose de raconter ce qui fait l’expérience des héticiens."/>
			<meta property="og:title" content="HETIC Newsroom"/>
			<meta property="og:type" content="website"/>
			<meta property="og:image" content="https://heticiens.news/favicon.png"/>
			<meta property="og:description" content="Collectif d’étudiants, qui regroupe l’ensemble des filières de l’école HETIC. Indépendant, HETIC Newsroom se propose de raconter ce qui fait l’expérience des héticiens."/>
			<meta property="og:url" content="https://heticiens.news"/>
			<meta property="og:locale" content="fr_FR"/>
			<meta property="og:site_name" content="HETIC Newsroom"/>

			<link rel="icon" href="/favicon.png"/>

			<link rel="dns-prefetch" href="https://fonts.googleapis.com"/>
			<link rel="preconnect" href="https://images.prismic.io"/>
			<link rel="dns-prefetch" href="https://images.prismic.io"/>
		</Head>
		<LoadingBar/>
		<Header categories={pageProps.categories}/>
		<AnimateSharedLayout>
			<Component {...pageProps}/>
		</AnimateSharedLayout>
	</>
}

HeticNewsroom.getInitialProps = async (appContext: AppContext): Promise<Pick<AppProps, 'pageProps'> | void> => {
	if (typeof window === 'undefined') {
		const { pageProps } = await App.getInitialProps(appContext)

		const { default: query } = await import('lib/prismic')
		const { toCategory, prCategory } = await import('types/category')

		const categories = (await query('document.type', prCategory)).results.map(x => toCategory(x))

		return {
			pageProps: {
				categories,
				...pageProps
			}
		}
	}
}

export default HeticNewsroom
