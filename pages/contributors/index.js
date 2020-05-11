import NeedAuth from '../../components/need-auth';
import Page from '../../components/page';
import ContributorDashboard from '../../components/contributor-dashboard';

export default () => {
	return (
		<NeedAuth>
			<Page
				title="Espace contributeur - H|N"
				description="Accès réservé aux contributeurs"
			>
				<div className="contribspace">
					<h1>Espace contributeur</h1>

					<ContributorDashboard/>

					<style jsx>{`
						.contribspace {
							width: 100%;
							max-width: 660px;
							margin: 0 auto;
						}
					`}
					</style>
				</div>
			</Page>
		</NeedAuth>
	);
};
