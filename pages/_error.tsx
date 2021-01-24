import type { NextPageContext } from 'next'
import Error from 'components/error'

function ErrorPage({ statusCode }: { statusCode: number }) {
	return <Error code={statusCode}/>
}

ErrorPage.getInitialProps = async (context: NextPageContext) => {
	const statusCode = context.res?.statusCode || 500

	// Prevent directly accessing the /_error URL
	if (statusCode === 200) {
		return {
			props: {
				statusCode: 404
			},
			notFound: true
		}
	}

	return {
		props: {
			statusCode
		}
	}
}

export default ErrorPage
