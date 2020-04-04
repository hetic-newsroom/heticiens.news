import Link from 'next/link';

export default () => {
	return (
		<div className="root">
			<h1>Welcome to staging.heticiens.news!</h1>
			<Link href="/login">
				<a>Are you a contributor? Login here!</a>
			</Link>
			<style jsx global>{`
				html, body {
					margin: 0;
				}
			`}
			</style>
			<style jsx>{`
				.root {
					font-family: sans-serif;
					height: 100vh;
					width: 100vw;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}
			`}
			</style>
		</div>
	);
};
