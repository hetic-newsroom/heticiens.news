import Page from '../components/page';
import LoginForm from '../components/login-form';

export default () => (
	<Page
		title="Contributeurs - H|N"
		description="Accès réservé aux contributeurs"
	>
		<div className="login">
			<LoginForm/>
		</div>

		<style jsx>{`
			.login {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 80vh;
			}
		`}
		</style>
	</Page>
);
