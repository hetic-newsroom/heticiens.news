import Link from 'next/link';
import dynamic from 'next/dynamic';
import Page from '../../components/page';
import Button from '../../components/button';

const NeedAuth = dynamic(() => import('../../components/need-auth'), {
	ssr: false
});

const ModerationDashboard = dynamic(() => import('../../components/moderation-dashboard'), {
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

					<ModerationDashboard/><br/>

					<Link href="/contributors">
						<a>
							<Button value="Retourner à l'espace contributeur"/>
						</a>
					</Link><br/>
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