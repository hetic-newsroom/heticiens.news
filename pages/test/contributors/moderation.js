import Link from 'next/link';
import dynamic from 'next/dynamic';
import Page from '../../../components/page';

const ModerationDashboard = dynamic(() => import('../../../components/moderation-dashboard'), {
	ssr: false
});


export default () => {
	return (
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
	);
};
