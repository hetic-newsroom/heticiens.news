import Link from 'next/link';
import dynamic from 'next/dynamic';
import Page from '../../components/page';
import ModerationDashboard from '../../components/moderation-dashboard';

const NeedAuth = dynamic(() => import('../../components/need-auth'), {
	ssr: false
});

export default () => {
	return (
		<NeedAuth>
			<Page
				title="Espace modérateur - H|N"
				description="Accès réservé aux contributeurs"
			>
				<div className="contribspace">
					<h1>Espace modérateur</h1>

					<ModerationDashboard/>

					<Link href="/contributors">
						<a>Retourner à l’espace contributeur</a>
					</Link>
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
