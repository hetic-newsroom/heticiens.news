import dynamic from 'next/dynamic';
import Page from '../../components/page';

const NeedAuth = dynamic(() => import('../../components/need-auth'), {
	ssr: false
});

export default () => {
	return (
		<Page
			title="Espace contributeur - H|N"
			description="Accès réservé aux contributeurs"
		>
			<NeedAuth>
				<div className="contribspace">
					<h1>Espace contributeur (authentifié)</h1>

					<style jsx>{`
						.contribspace {
							width: 100%;
							max-width: 660px;
							margin: 0 auto;
						}
					`}
					</style>
				</div>
			</NeedAuth>
		</Page>
	);
};
