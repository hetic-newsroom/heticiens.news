import {useRouter} from 'next/router';
import ErrorPage from '../components/error-page';

// Note: this is straight-from-nextjs code so some linting is disabled to not break stuff

/* eslint-disable-next-line react/function-component-definition */
function Error({statusCode}) {
	const router = useRouter();

	if (typeof window !== 'undefined' && statusCode === 200) {
		router.push('/');
	}

	return (
		<ErrorPage code={statusCode || '000'}/>
	);
}

Error.getInitialProps = ({res, err}) => {
	/* eslint-disable-next-line unicorn/no-nested-ternary */
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return {statusCode};
};

export default Error;
