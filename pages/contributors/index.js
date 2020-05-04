import Link from 'next/link';
// Disabled: import dynamic from 'next/dynamic';
import Page from '../../components/page';
import Button from '../../components/button';
import ContributorDashboard from '../../components/contributor-dashboard';

import NeedAuth from '../../components/need-auth';

// Disabled: const NeedAuth = dynamic(() => import('../../components/need-auth'), {
//    ssr: false
// });

export default () => {
	return (
		<NeedAuth>
			<Page
				title="Espace contributeur - H|N"
				description="Accès réservé aux contributeurs"
			>
				<div className="contribspace">
					<h1>Espace contributeur</h1>
					<Link href="/contributors/new">
						<a>
							<Button primary icon="chevronRight" value="Rédiger un article"/>
						</a>
					</Link>

					<ContributorDashboard/>

					<Link href="/">
						<a>Retourner sur le site</a>
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
