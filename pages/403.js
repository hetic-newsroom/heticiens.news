import Link from 'next/link';

export default () => {
	return (
		<div className="root error">
			<h1>403 | Access denied</h1>
			<Link href="/">
				<a>Go home</a>
			</Link>
			<style jsx>{`
			`}
			</style>
		</div>
	);
};
