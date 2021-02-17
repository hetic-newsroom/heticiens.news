import { Twitter, Youtube, Linkedin, Instagram } from 'react-feather'
import Columns from './columns'
import Spacer from './spacer'
import styles from './footer.module.scss'

export default function Footer() {
	return <footer className={styles.footer}>
		<Columns no="1">
			<h1>H<em>|</em>N</h1>
			<Spacer height="small"/>
			<div className={styles.columns}>
				<div>
					<p>
						Collectif d’étudiants, qui regroupe l’ensemble des filières de l’école HETIC. Indépendant, HETIC Newsroom se propose de raconter ce qui fait l’expérience des héticiens.
					</p>
				</div>
				<div>
					<p className={styles.smallPrint}>
						© {new Date().getFullYear()} Tout droits réservés<br/>
						HETIC Newsroom · 27 Bis Rue Du Progres · MONTREUIL 93100 · France<br/>
						Nous contacter: <a href="mailto:info@heticiens.news">info@heticiens.news</a>
					</p>
				</div>
				<div className={styles.socialLinksContainer}>
					<ul>
						<li>
							<a href="https://twitter.com/hetic_newsroom" target="_blank" rel="noopener">
								<Twitter size="24px"/>
							</a>
						</li>
						<li>
							<a href="https://www.youtube.com/channel/UCUdr_JzbdkV6bVvOTSpseEA" target="_blank" rel="noopener">
								<Youtube size="24px"/>
							</a>
						</li>
						<li>
							<a href="https://www.linkedin.com/company/hetic-newsroom" target="_blank" rel="noopener">
								<Linkedin size="24px"/>
							</a>
						</li>
						<li>
							<a href="https://www.linkedin.com/company/hetic-newsroom" target="_blank" rel="noopener">
								<Instagram size="24px"/>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</Columns>
	</footer>
}
