import Router from 'next/router';
import fetch from 'isomorphic-unfetch';

export default async (ctx, url) => {
	const s = (ctx.req.headers.host.includes('localhost')) ? '' : 's';

	let host;
	if (ctx.req.headers.host.includes('amazonaws')) {
		host = (ctx.req.headers.host.includes('staging')) ? 'staging.heticiens.news' : 'heticiens.news';
	} else {
		host = ctx.req.headers.host;
	}

	const res = await fetch(`http${s}://${host}/api${url}`);
	console.warn(res);

	if (!res.ok) {
		if (ctx.res) {
			ctx.res.writeHead(302, {
				Location: `http${s}://${host}/404`,
				'Content-Type': 'text/html; charset=utf-8'
			});
			ctx.res.end();
			return;
		}

		Router.replace('/404');
		return;
	}

	const data = await res.json();

	return {
		props: data
	};
};
