import Link from 'next/link';

import LoginForm from '../components/login-form';

export default () => {
	return (
		<div className="login">
			<h1>Login page</h1>
			<LoginForm/>
			<Link href="/">
				<a>Go home</a>
			</Link>
			<style jsx global>{`
				html, body {
					margin: 0;
				}
			`}
			</style>
			<style jsx>{`
				.login {
					font-family: sans-serif;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 100vw;
					height: 100vh;
				}
			`}
			</style>
		</div>
	);
};
