import dynamic from 'next/dynamic';
import Link from 'next/link';

const NeedAuth = dynamic(() => import('../../components/need-auth'), {
	ssr: false
});

export default () => {
	return (
		<NeedAuth>
			<div className="contribspace">
				<h1>Authenticated</h1>
				<Link href="/">
					<a>Go home</a>
				</Link>
				<style jsx>{`
					`}
				</style>
			</div>
		</NeedAuth>
	);
};
