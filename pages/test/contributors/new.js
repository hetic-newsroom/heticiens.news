import Link from 'next/link';
import Page from '../../../components/page';
import ArticleEditor from '../../../components/article-editor';

export default () => {
	return (
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
	);
};
