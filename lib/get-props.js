import fetch from 'isomorphic-unfetch';

export default async (ctx, url) => {
	const s = (ctx.req.headers.host.includes('localhost')) ? '' : 's';

	let host;
	if (ctx.req.headers.host.includes('amazonaws')) {
		host = (ctx.req.headers.host.includes('staging')) ? 'staging.heticiens.news' : 'heticiens.news';
	} else {
		host = ctx.req.headers.host;
	}

	host = `http${s}://${host}`;

	const res = await fetch(`${host}/api${url}`);

	if (!res.ok) {
		return {
			props: {
				error: res.status
			},
			host
		};
	}

	const data = await res.json();

	return {
		props: data,
		host
	};
};
