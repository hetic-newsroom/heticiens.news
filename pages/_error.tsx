import type { GetServerSideProps } from 'next'
import Error from 'components/error'

export default function ErrorPage({ statusCode }: { statusCode: number }) {
	return <Error code={statusCode}/>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const statusCode = context.res.statusCode
	
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
