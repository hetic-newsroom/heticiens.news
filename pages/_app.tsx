import type { AppProps, AppContext } from 'next/app'
import App from 'next/app'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { AnimatePresence, motion } from 'framer-motion'
import Header from 'components/header'
import 'stylelib/defaults.scss'

function HeticNewsroom({ Component, pageProps }: AppProps) {
	const router = useRouter()

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
		<Header route={router.route} categories={pageProps.categories}/>
		<AnimatePresence exitBeforeEnter>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				key={router.route} // Force motion wrapper to re-render on route change, triggering mount/unmount animations
			>
				<Component {...pageProps}/>
			</motion.div>
		</AnimatePresence>
	</>
}

HeticNewsroom.getInitialProps = async (appContext: AppContext): Promise<Pick<AppProps, 'pageProps'> | void> => {
	if (typeof window === 'undefined') {
		const { pageProps } = await App.getInitialProps(appContext)

		const { default: query } = await import('lib/prismic')

		const categories = (await query('document.type', 'categories')).results.map(cat => {
			return [cat.data.title[0].text, cat.uid]
		})

		return {
			pageProps: {
				categories,
				...pageProps
			}
		}
	}
}

export default HeticNewsroom
