import * as React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Button from '../components/button';
import ArticleCard from '../components/article-card';
import DraftCard from '../components/draft-card';
import Router from 'next/router';

export default class ContributorDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			contributor: {},
			articles: [],
			drafts: []
		};
	}

	async componentDidMount() {
		if (!window) {
			return;
		}

		const token = window.localStorage.getItem('login_token');
		const userId = token.split('||')[0];

		const contributorRequest = await fetch(`/api/contributor/${userId}?token=${token}`);
		const contributor = await contributorRequest.json();

		const articlesRequest = await fetch(`/api/contributor/${userId}/articles?count=3`);
		const articles = await articlesRequest.json();
		console.log(articles);

		const draftsRequest = await fetch(`/api/contributor/${userId}/drafts?token=${token}`);
		const drafts = await draftsRequest.json();

		const articlesCards = [];
		const draftsCards = [];

		articles.articles.forEach(article => {
			articlesCards.push(
				<Link key={article.id} href={`/article/${article.id}`}>
					<a target="_blank" rel="noreferrer nofollow">
						<ArticleCard
							title={article.title}
							category={article.category}
							authors={article.authors}
							image={article.image}
						/>
					</a>
				</Link>
			);
		});

		drafts.drafts.forEach(article => {
			draftsCards.push(
				<Link key={article.id} href={`/article/${article.id}`}>
					<a target="_blank" rel="noreferrer nofollow">
						<DraftCard
							key={article.id}
							title={article.title}
							category={article.category}
							authors={article.authors}
							image={article.image}
						/>
					</a>
				</Link>
			);
		});

		this.setState({
			contributor,
			articles: articlesCards,
			drafts: draftsCards
		});
	}

	onDisconnect() {
		window.localStorage.removeItem('login_token');
		Router.push('/');
	}

	render() {
		return (
			<>
				<div className="actionsButtonContainer">
					<Link href="/contributors/new">
						<a>
							<Button primary icon="chevronRight" value="Rédiger un article"/>
						</a>
					</Link>
					{
						this.state.contributor.moderator > 0 &&
							<Link href="/contributors/moderation">
								<a>
									<Button primary icon="chevronRight" value="Espace de modération"/>
								</a>
							</Link>
					}
				</div>

				<h2>Mes brouillons</h2>
				<div className="draftList">
					{this.state.drafts}
					{
						this.state.drafts.length === 0 &&
							<h4>Il n’y a aucun brouillon pour le moment.</h4>
					}
				</div>

				<h2>Mes articles publiés</h2>
				<div className="articleList">
					{this.state.articles}
					{
						this.state.articles.length === 0 &&
							<h4>Il n’y a aucun article publié à votre nom pour le moment.</h4>
					}
				</div><br/>
				<Button value="Déconnexion et retour au site" onClick={this.onDisconnect}/>
				<br/>

				<style jsx>{`
					@media (min-width: 660px) {
						.articleList, .draftList {
							display: grid;
							grid-template-columns: 1fr 1fr;
							grid-column-gap: 15px;
						}
					}
					.draftList{
						grid-template-columns: 1fr;
					}
					h2{
						margin-top: 40px;
					}
					.actionsButtonContainer{
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;
					}
				`}
				</style>
			</>
		);
	}
}
