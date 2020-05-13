import * as React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Button from '../components/button';
import DraftCard from '../components/draft-card';
import Router from 'next/router';

export default class ContributorDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			contributor: {},
			drafts: [],
			userId: null
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

		const draftsRequest = await fetch(`/api/contributor/${userId}/drafts?token=${token}`);
		const drafts = await draftsRequest.json();

		const draftsCards = [];

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
			drafts: draftsCards,
			userId
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
				<br/>
				<Link href={`/author/${this.state.userId}/edit`}>
					<a>
						<Button primary icon="chevronRight" value="Modifier mon profil"/>
					</a>
				</Link>

				<h2>Mes brouillons</h2>
				<div className="draftList">
					{this.state.drafts}
					{
						this.state.drafts.length === 0 &&
							<h4>Il n’y a aucun brouillon pour le moment.</h4>
					}
				</div>

				<br/>
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
