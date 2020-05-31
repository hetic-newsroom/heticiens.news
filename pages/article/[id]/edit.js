import dynamic from 'next/dynamic';
import Page from '../../../components/page';
import getProps from '../../../lib/get-props';
import Button from '../../../components/button';
import ArticleEditor from '../../../components/article-editor';
import Router from 'next/router';

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
				title="Édition de contenu - H|N"
				description="Accès réservé aux contributeurs"
			>
				<div className="contribspace">
					<ArticleEditor
						article={{
							id: props.id,
							title: props.title,
							intro: props.intro,
							image: props.image,
							content: props.content,
							category: props.category,
							authors: props.authors
						}}
					/>
					<br/>

					<Button value="Retourner à l'article" onClick={() => Router.back()}/>
					<br/>
					<style jsx>{`
						.contribspace {
							width: 100%;
							// max-width: 660px;
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
	const {props, host} = await getProps(ctx, `/article/${encodeURIComponent(ctx.params.id)}`);

	if (props.error) {
		if (ctx.res) {
			ctx.res.writeHead(302, {
				Location: `${host}/404`,
				'Content-Type': 'text/html; charset=utf-8'
			});
			ctx.res.end();
			return;
		}

		Router.replace('/404');
		return;
	}

	return {
		props: {...props}
	};
}
