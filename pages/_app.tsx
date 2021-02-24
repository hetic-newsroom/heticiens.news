import type { AppProps, AppContext } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { defaultSeoProps } from 'components/seo-tags'
import { AnimateSharedLayout } from 'framer-motion'
import LoadingBar from 'components/loading-bar'
import Header from 'components/header'
import Footer from 'components/footer'
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

			{/* Google Analytics */}
			<script async src="https://www.googletagmanager.com/gtag/js?id=UA-159035556-2"/>
			<script dangerouslySetInnerHTML={{ __html: "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-159035556-2');" }}/>
		</Head>
		<DefaultSeo {...defaultSeoProps}/>
		<LoadingBar/>
		<Header categories={pageProps.categories}/>
		<AnimateSharedLayout>
			<div style={{ minHeight: '75vh', height: 'min-content' }}>
				<Component {...pageProps}/>
			</div>
		</AnimateSharedLayout>
		<Footer/>
	</>
}

HeticNewsroom.getInitialProps = async (appContext: AppContext): Promise<Pick<AppProps, 'pageProps'> | void> => {
	const { pageProps } = await App.getInitialProps(appContext)

	if (typeof window === 'undefined') {
		const { default: query } = await import('lib/prismic')
		const { toCategory, prCategory } = await import('types/category')

		const categories = (await query('document.type', prCategory)).results
			.map(x => (x.uid !== 'hnyou' && x.uid !== 'videos') ? toCategory(x) : null)
			.filter(x => (x !== null))

		return {
			pageProps: {
				categories,
				...pageProps
			}
		}
	} else {
		return {
			pageProps: {
				categories: [],
				...pageProps
			}
		}
	}
}

export default HeticNewsroom
