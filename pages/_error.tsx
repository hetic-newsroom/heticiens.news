import type { NextPageContext } from 'next'
import Error from 'components/error'

function ErrorPage({ statusCode }: { statusCode: number }) {
	return <Error code={statusCode}/>
}

ErrorPage.getInitialProps = async (context: NextPageContext) => {
	const statusCode = context.err?.statusCode || context.res?.statusCode

	// Prevent directly accessing the /_error URL
	if (!statusCode || statusCode === 200) {
		if (!context.res) throw "we're doomed"
		context.res.statusCode = 404

		return {
			statusCode: 404
		}
	}

	return { statusCode }
}

export default ErrorPage
