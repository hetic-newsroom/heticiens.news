import Link from 'next/link';
import Icon from './icon';
import DefaultColorScheme from '../lib/colors-default';

export default () => (
	<footer>
		<div className="widthContainer">
			<div className="description">
				<h2>HETIC Newsroom</h2>
				<h4>
					Un collectif indépendant de l’école <strong>HETIC</strong>, la Newsroom vous propose de raconter ensemble la vie des héticiens.
				</h4>
			</div>
			<div className="links">
				<h2>Suivez-nous:</h2>
				{/* TODO: add social links */}
				<ul>
					<li>
						<Link href="#" prefetch="false">
							<Icon name="twitter" width="2.5rem" height="2.5rem" color={DefaultColorScheme.white}/>
						</Link>
					</li>
					<li>
						<Link href="#" prefetch="false">
							<Icon name="facebook" width="2.5rem" height="2.5rem" color={DefaultColorScheme.white}/>
						</Link>
					</li>
					<li>
						<Link href="#" prefetch="false">
							<Icon name="linkedin" width="2.5rem" height="2.5rem" color={DefaultColorScheme.white}/>
						</Link>
					</li>
				</ul>
			</div>
		</div>
		<h6>© 2020 HETIC Newsroom, tous droits réservés</h6>

		<style jsx>{`
			footer {
				background: var(--color-black);
				color: var(--color-white);
				padding-top: 5vmin;
			}

			.widthContainer {
				display: grid;
				grid-template: "column column2" auto / 50%;
				width: 100%;
				max-width: 1100px;
				margin: 0 auto;
			}

			.widthContainer > div {
				padding: 0 15px;
			}

			.description {
				grid-area: column;
			}

			.links {
				grid-area: column2;
				text-align: center;
			}

			h2, h4, h6 {
				color: var(--color-white);
			}

			h2 {
				margin-bottom: 15px;
			}

			h4 {
				max-width: 300px;
			}

			h6 {
				grid-area: copyright;
				text-align: center;
				padding-top: 5vmin;
			}

			ul {
				margin: 0;
				padding: 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
			}

			ul li {
				display: block;
				margin-right: 15px;
				cursor: pointer;
			}
		`}
		</style>
	</footer>
);
