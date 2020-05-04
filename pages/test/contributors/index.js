import Link from 'next/link';
import dynamic from 'next/dynamic';
import Page from '../../../components/page';
import Button from '../../../components/button';

const NeedAuth = dynamic(() => import('../../../components/need-auth'), {
	ssr: false
});

const ContributorDashboard = dynamic(() => import('../../../components/contributor-dashboard'), {
	ssr: false
});

export default () => {
	return (
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

				<NeedAuth>
					<h2>Authentifié</h2>
				</NeedAuth>

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
	);
};
