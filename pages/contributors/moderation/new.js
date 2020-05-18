import dynamic from 'next/dynamic';
import Page from '../../../components/page';
import Button from '../../../components/button';
import Router from 'next/router';
import AccountCreator from '../../../components/account-creator';

const NeedAuth = dynamic(() => import('../../../components/need-auth'), {
	ssr: false
});

export default props => {
	if (!props) {
		return (
			<Page>
				<h1>Chargement…</h1>
			</Page>
		);
	}

	return (
		<NeedAuth>
			<Page
				title="Création de contributeur - H|N"
				description="Accès réservé aux contributeurs"
			>
				<div className="contribspace">
					<AccountCreator/>
					<br/>

					<Button value="Retourner à l'espace contributeur" onClick={() => Router.back()}/>
					<br/>
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
