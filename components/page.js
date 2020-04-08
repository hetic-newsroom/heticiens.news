import Head from './head';
import GlobalStyles from './global-styles';

export default props => (
	<main id="pageRoot">
		<Head title={props.title} description={props.description}/>
		{props.children}
		<GlobalStyles/>
		<style jsx>{`
			main#pageRoot {
				width: 100vw;
				min-height: 100vh;
				overflow-x: hidden;
			}
		`}
		</style>
	</main>
);
