import dynamic from 'next/dynamic';
import Page from '../../../components/page';
import Button from '../../../components/button';
import Router from 'next/router';
import AccountEditor from '../../../components/account-editor';

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
				title="Édition de profil - H|N"
				description="Accès réservé aux contributeurs"
			>
				<div className="contribspace">
					<AccountEditor id={props.id}/>
					<br/>

					<Button value="Retourner au profil" onClick={() => Router.back()}/>
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

export async function getServerSideProps(ctx) {
	return {
		props: {
			id: ctx.params.id
		}
	};
}
