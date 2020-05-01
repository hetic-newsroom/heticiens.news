/* This is a legacy route we keep for backwards compatibility. */
import Router from 'next/router';
import getProps from '../../lib/get-props';

export default () => (
	<h1>Redirection...</h1>
);

export async function getServerSideProps(ctx) {
	const {props, host} = await getProps(ctx, `/legacy-articles/${encodeURIComponent(ctx.params.title)}`);

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

	if (ctx.res) {
		ctx.res.writeHead(301, {
			Location: `${host}/article/${props.id}`,
			'Content-Type': 'text/html; charset=utf-8'
		});
		ctx.res.end();
		return;
	}

	Router.replace(`/article/${props.id}`);
}
