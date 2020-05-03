import * as React from 'react';
import Router from 'next/router';

export default class NeedAuth extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			progress: 'pending'
		};
	}

	async componentDidMount() {
		const token = window.localStorage.getItem('login_token');
		const response = await window.fetch(`/api/auth?token=${token}`);
		const parsed = await response.json();

		if (response.ok) {
			if (parsed.token !== token) {
				// Store updated token
				window.localStorage.setItem('login_token', parsed.token);
			}

			this.setState({
				progress: 'authenticated'
			});
		} else {
			Router.push('/403');
		}
	}

	render() {
		switch (this.state.progress) {
			case 'authenticated':
				return this.props.children;
			default:
				return null;
		}
	}
}
