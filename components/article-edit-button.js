import * as React from 'react';
import Link from 'next/link';
import Button from './button';

export default class ArticleEditButton extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			isModerator: false
		};
	}

	async componentDidMount() {
		const token = window.localStorage.getItem('login_token');

		if (token === null) {
			return;
		}

		const userId = token.split('||')[0];

		const contributorRequest = await fetch(`/api/contributor/${userId}?token=${token}`);
		const contributor = await contributorRequest.json();
		this.setState({
			isModerator: contributor.moderator >= 1
		});
	}

	render() {
		return (
			<>
				{
					this.state.isModerator &&
						<Link href={`/article/${this.props.id}/edit`}>
							<a>
								<Button accent value="Modifier l'article"/>
							</a>
						</Link>
				}
				<br/>
			</>
		);
	}
}
