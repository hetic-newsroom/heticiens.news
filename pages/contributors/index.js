import Link from 'next/link';
import dynamic from 'next/dynamic';

const NeedAuth = dynamic(() => import('../../components/need-auth'), {
	ssr: false
});

const Editor = dynamic(() => import('../../components/editor'), {
	ssr: false
});

export default () => {
	return (
		<NeedAuth>
			<div className="contribspace">
				<Editor/>
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
