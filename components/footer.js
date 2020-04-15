import Icon from './icon';
import DefaultColorScheme from '../lib/colors-default';

export default () => (
	<footer>
		<div className="widthContainer">
			<h2>HETIC Newsroom</h2>
			<div className="description">
				<h4>
					Un collectif indépendant de l’école <strong>HETIC</strong>, la Newsroom vous propose de raconter ensemble la vie des héticiens.<br/>Nous sommes joignables à <strong><a href="mailto:info@heticiens.news">info@heticiens.news</a></strong>.
				</h4>
			</div>
			<div className="links">
				<h3>Suivez-nous:</h3>
				<ul>
					<li>
						<a target="_blank" href="https://twitter.com/hetic_newsroom" rel="noopener noreferrer">
							<Icon name="twitter" width="2.5rem" height="2.5rem" color={DefaultColorScheme.white}/>
						</a>
					</li>
					<li>
						<a target="_blank" href="https://www.facebook.com/HETIC-Newsroom-114058820257237/" rel="noopener noreferrer">
							<Icon name="facebook" width="2.5rem" height="2.5rem" color={DefaultColorScheme.white}/>
						</a>
					</li>
					<li>
						<a target="_blank" href="https://www.linkedin.com/company/hetic-newsroom" rel="noopener noreferrer">
							<Icon name="linkedin" width="2.5rem" height="2.5rem" color={DefaultColorScheme.white}/>
						</a>
					</li>
					<li>
						<a target="_blank" href="https://www.instagram.com/hetic_newsroom/?hl=fr" rel="noopener noreferrer">
							<Icon name="instagram" width="2rem" height="2rem" color={DefaultColorScheme.white}/>
						</a>
					</li>
				</ul>
			</div>
		</div>
		<h6><i>© 2020 HETIC Newsroom, tous droits réservés.</i><br/>Notre code est <strong><a href="https://github.com/hetic-newsroom" target="_blank" rel="noopener noreferrer">open-source</a></strong>.</h6>

		<style jsx>{`
			footer {
				background: var(--color-black);
				color: var(--color-white);
				padding-top: 15px;
			}

			.widthContainer {
				display: grid;
				grid-template: "title title" auto
									"description links" auto / 50%;
				width: 100%;
				max-width: 1100px;
				margin: 0 auto;
			}

			.widthContainer > div {
				padding: 0 15px;
			}

			.widthContainer > h2:first-child {
				grid-area: title;
				max-width: 50%;
				padding: 0 15px 5vmin;
				margin-bottom: 0;
			}

			.description {
				grid-area: description;
				margin-top: 15px;
			}

			div.links {
				grid-area: links;
				text-align: center;
			}

			h2, h3, h4, h6 {
				color: var(--color-white);
			}

			h2 {
				margin-bottom: 15px;
			}

			h6 {
				grid-area: copyright;
				text-align: center;
				padding-top: 5vmin;
				padding-bottom: 15px;
			}

			h3 {
				font-weight: 500;
			}

			ul {
				margin: 0 auto;
				padding: 0;
				display: grid;
				grid-template-columns: 1fr 1fr;
				grid-template-rows: 1fr 1fr;
				justify-items: center;
				margin-top: 1rem;
				max-width: 10rem;
			}

			@media (min-width: 660px) {
				ul {
					grid-template-columns: repeat(4, 1fr);
					grid-template-rows: 1fr;
					grid-gap: 15px;
				}
			}

			ul li {
				display: block;
				cursor: pointer;
			}
		`}
		</style>
	</footer>
);
