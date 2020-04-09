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
	const res = await fetch(`http${s}://${ctx.req.headers.host}/api/article/${title}`);

	if (!res.ok) {
		return {
			props: {
				error: res.statusText
			}
		};
	}

	const data = await res.json();

	return {
		props: data
	};
}
