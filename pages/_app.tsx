import type { AppProps, AppContext } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { defaultSeoProps } from 'components/seo-tags'
import { AnimateSharedLayout } from 'framer-motion'
import LoadingBar from 'components/loading-bar'
import Header from 'components/header'
import 'stylelib/defaults.scss'

function HeticNewsroom({ Component, pageProps }: AppProps) {
	return <>
		<Head>
			<meta charSet="utf-8"/>
			<meta name="viewport" content="initial-scale=1.0, width=device-width"/>

			<link rel="icon" href="/favicon.png"/>

			<link rel="dns-prefetch" href="https://fonts.googleapis.com"/>
			<link rel="preconnect" href="https://images.prismic.io"/>
			<link rel="dns-prefetch" href="https://images.prismic.io"/>
		</Head>
		<DefaultSeo {...defaultSeoProps}/>
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
