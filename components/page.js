import Head from './head';
import GlobalStyles from './global-styles';

export default props => (
	<main id="pageRoot">
		<Head title={props.title} description={props.description}/>
		<div id="pageWidthContainer">
			{props.children}
		</div>
		<GlobalStyles/>
		<style jsx>{`
			main#pageRoot {
				width: 100%;
				display: flex;
				min-height: 100vh;
				overflow-x: hidden;
			}

			#pageWidthContainer {
				margin: 0 auto;
				width: 100%;
				max-width: 660px;
			}

			@media (max-width: 660px) {
				#pageWidthContainer {
					width: calc(100% - 30px);
				}
			}
		`}
		</style>
	</main>
);
