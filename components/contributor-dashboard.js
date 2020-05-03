import * as React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Button from '../components/button';
import ArticleCard from '../components/article-card';
import DraftCard from '../components/draft-card';

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

		const articlesRequest = await fetch(`/api/contributor/${userId}/articles`);
		const articles = await articlesRequest.json();

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

	render() {
		return (
			<>
				{
					this.state.contributor.moderator > 0 &&
						<Link href="/contributors/moderation">
							<a>
								<Button accent icon="chevronRight" value="Espace de modération"/>
							</a>
						</Link>
				}

				<h2>Mes brouillons</h2>
				<div className="draftList">
					{this.state.drafts}
				</div>

				<h2>Mes articles publiés</h2>
				<div className="articleList">
					{this.state.articles}
				</div>

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
				`}
				</style>
			</>
		);
	}
}
