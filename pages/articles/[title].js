import fetch from 'isomorphic-unfetch';
import Page from '../../components/page';

export default props => (
	<Page>
		<p>{JSON.stringify(props)}</p>
	</Page>
);

export async function getServerSideProps(ctx) {
	const {title} = ctx.params;
	const s = (ctx.req.headers.host.includes('localhost')) ? '' : 's';

	let host;
	if (ctx.req.headers.host.includes('amazonaws')) {
		host = (ctx.req.headers.host.includes('staging')) ? 'staging.heticiens.news' : 'heticiens.news';
	} else {
		host = ctx.req.headers.host;
	}

	const res = await fetch(`http${s}://${host}/api/article/${title}`);

	if (!res.ok) {
		return {
			props: {
				headers: ctx.req.headers,
				error: res.statusText
			}
		};
	}

	const data = await res.json();

	return {
		props: data
	};
}
