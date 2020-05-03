import * as React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import ArticleCard from '../components/article-card';
import DraftCard from '../components/draft-card';
import {Router} from 'next/router';

export default class ModerationDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
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

		if (contributor.moderator === 0) {
			Router.push('/403');
			return;
		}

		const articlesRequest = await fetch('/api/article/latest');
		const articles = await articlesRequest.json();

		const draftsRequest = await fetch(`/api/article/drafts?token=${token}`);
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
				<DraftCard
					key={article.id}
					id={article.id}
					title={article.title}
					category={article.category}
					authors={article.authors}
					image={article.image}
					contributor={contributor}
					token={token}
				/>
			);
		});

		this.setState({
			articles: articlesCards,
			drafts: draftsCards
		});
	}

	render() {
		return (
			<>
				<h2>Brouillons à réviser</h2>
				<div className="draftList">
					{this.state.drafts}
					{
						this.state.drafts.length === 0 &&
							<h4>Il n’y a aucun brouillon à réviser pour le moment.</h4>
					}
				</div>

				<h2>Derniers articles publiés</h2>
				<div className="articleList">
					{this.state.articles}
				</div>

				<style jsx>{`
					@media (min-width: 660px) {
						.articleList, .draftList {
							display: grid;
							grid-template-columns: 1fr;
							grid-column-gap: 15px;
						}
					}
					.draftList{
						grid-template-columns: 1fr;
					}
					h2{
						margin-top: 40px;
					}
				`}
				</style>
			</>
		);
	}
}
