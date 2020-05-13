import * as React from 'react';
import Link from 'next/link';
import Button from './button';

export default class AccountEditButton extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showButton: false
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
			showButton: contributor.moderator > 1 || userId === this.props.id
		});
	}

	render() {
		return (
			<>
				{
					this.state.showButton &&
						<Link href={`/author/${this.props.id}/edit`}>
							<a>
								<Button accent value="Modifier le profil"/>
							</a>
						</Link>
				}
				<br/>
			</>
		);
	}
}
