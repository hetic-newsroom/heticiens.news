import { useRouter } from 'next/router'
// import ErrorPage from '../components/error-page'

function Error({ statusCode }: { statusCode: number }) {
	const router = useRouter()

	if (typeof window !== 'undefined' && statusCode === 200) {
		router.push('/')
	}

	return (
		// <ErrorPage code={statusCode || 404}/>
		<p>pls make error page { statusCode }</p>
	)
}

// Error.getInitialProps = ({ res, err }: { res: string, err: string }) => {
//    const statusCode = res?.statusCode || err?.statusCode
//    return { statusCode }
// }

export default Error
