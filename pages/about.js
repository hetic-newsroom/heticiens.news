import Page from '../components/page';

export default () => (
	<Page
		title="À propos - H|N"
		description="Découvrez le manifeste derrière HETIC Newsroom, ses valeurs, ses ambitions, ses objectifs."
	>
		<h1>À propos</h1>
		<h3>Le manifeste</h3>

		<p>
			<strong>HETIC Newsroom</strong> est un collectif d’étudiants, qui représente l’ensemble des filières et promotions de HETIC. Il se donne pour ambition de raconter l’ «Expérience HETIC», par la production de contenus éditoriaux, tous supports et formats confondus.
		</p>

		<p>
			<strong>HETIC Newsroom</strong> est hébergé et accompagné par HETIC. Mais le collectif définit sa propreligne éditoriale. Elle est indépendante de la pédagogie et de la communication institutionnelle. La direction générale de l’école se porte garante de cette indépendance.
		</p>

		<p>
			<strong>HETIC Newsroom</strong> élabore sa charte éditoriale et graphique. Il opère des choix, notammentortho-typographiques. Le collectif repère, acquiert et adapte les meilleures pratiques dans le traitement de l’information et la communication digitale. Il cherche à (ré)investir les savoir-faire, outils et méthodes qui sont le cœur des enseignements de HETIC.
		</p>

		<p>
			<strong>HETIC Newsroom</strong> est un groupe souple et ouvert. La participation se fait sur base du volontariat. Sans limitation de nombre, les membres partagent la volonté d’apprendre ensemble, de mettre à l’épreuve leurs connaissances, leurs sensibilités et pratiques. Le collectif fonctionne comme une “chorale démocratique”; chaque voix a une valeur égale.
		</p>
		<h3 className="closing"><i>- Stéphane De Torquat, fondateur</i></h3>

		<style jsx>{`
			h3.closing {
				margin-bottom: 3rem;
			}
		`}
		</style>
	</Page>
);
