import Link from 'next/link';
import dynamic from 'next/dynamic';
import Page from '../../components/page';

const NeedAuth = dynamic(() => import('../../components/need-auth'), {
	ssr: false
});

const ArticleEditor = dynamic(() => import('../../components/article-editor'), {
	ssr: false
});

export default () => {
	return (
		<NeedAuth>
			<Page
				title="Rédaction de contenu - H|N"
				description="Accès réservé aux contributeurs"
			>
				<div className="contribspace">
					<ArticleEditor/>
					<Link href="/contributors">
						<a>Retourner à l’accueil contributeur</a>
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
