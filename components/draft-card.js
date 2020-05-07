import * as React from 'react';
import Link from 'next/link';
import Button from './button';

export default class DraftCard extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			approved: false,
			error: false
		};

		this.approveDraft = this.approveDraft.bind(this);
	}

	async approveDraft() {
		if (this.state.approved === true) {
			return;
		}

		const request = await fetch(`/api/article/${this.props.id}/approve?token=${this.props.token}`);
		await request.json();

		if (request.status === 200 || request.status === 201) {
			console.log('response ok');
			this.setState({
				approved: true
			});
		} else {
			console.log('response no');
			this.setState({
				error: true
			});
		}
	}

	render() {
		console.log(this.state);
		return (
			<div className="draftCard">
				<div className="article">
					<div className="imgContainer"/>
					<div>
						<h3>{this.props.category.slice(0, -1)}</h3>
						<h2>{this.props.title}</h2>
						<h4>
							par {this.props.authors.reduce((accumulator, author, index) => {
								return (index === 0) ? `${author.name}` : `${accumulator} et ${author.name}`;
							}, this.props.authors[0].name)}
						</h4>
					</div>
				</div>
				{
					this.props.contributor && this.props.contributor.moderator > 0 &&
						<div className="moderation">
							<Link href={`/article/${this.props.id}`}>
								<a target="_blank" rel="noreferrer nofollow">
									<Button primary icon="preview" size="32px"/>
								</a>
							</Link>

							<Button primary={!this.state.accepted} positive={this.state.accepted} negative={this.state.error} icon="check" size="32px" onClick={this.approveDraft}/>
						</div>
				}

				<style jsx>{`
					div.draftCard{
						display: grid;
						grid-template-columns: 3fr 1fr;
						transition: transform .2s ease-out;
						transform: scale(1);
						padding: 15px 0;
					}
					div.draftCard .article {
						display: grid;
						grid-column-gap: 15px;
						grid-template-columns: 1fr 1fr;
					}
					
					div.draftCard:hover, div.draftCard:active {
						transform: scale(1.05);
					}
					
					div.draftCard .moderation{
						display: flex;
						justify-content: space-evenly;
						align-items: center;
					}
					
					.draftCard .imgContainer {
						height: 100%;
						width: 100%;
						background: center/cover url("${this.props.image}") no-repeat;
					}
					
					h3 {
						grid-area: category;
						font-weight: 400;
						${(this.props.title.length > 25) ? 'margin-top: 15px;' : ''}
						text-transform: capitalize;
					}
					
					h2 {
						grid-area: title;
						font-size: ${25 / 16}rem;
						line-height: 1.1;
					}
					
					h4 {
						grid-area: author;
						font-weight: 300;
					}
				`}
				</style>
			</div>
		);
	}
}
