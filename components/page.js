import Head from './head';
import Header from './header';
import GlobalStyles from './global-styles';
import Footer from './footer';

export default props => (
	<main id="pageRoot">
		<Head title={props.title} description={props.description}/>
		<div id="pageWidthContainer">
			<Header/>
			{props.children}
		</div>
		<Footer/>
		<GlobalStyles/>
		<style jsx>{`
			main#pageRoot {
				width: 100%;
				min-height: 100vh;
				overflow-x: hidden;
			}

			#pageWidthContainer {
				width: 100%;
				max-width: 1130px;
				min-height: 95vh;
				margin: 0 auto;
				padding: 0 15px;
				padding-top: calc(${30 / 16}rem + ${6.25 + 12.5 + 15}px);
			}

			@media (min-width: 660px) {
				#pageWidthContainer {
					padding-top: calc(${54 + 15}px + 5vmin);
				}
			}
		`}
		</style>
	</main>
);
