import * as React from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';

export default class NeedAuth extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			progress: 'pending'
		};
	}

	async componentDidMount() {
		if (!window) {
			console.log('no window'); // Doesn't make sense
			return;
		}

		const token = window.localStorage.getItem('login_token');
		const response = await fetch(`/api/auth?token=${token}`);
		const parsed = await response.json();

		if (response.ok) {
			console.log('auth ok');
			if (parsed.token !== token) {
				console.log('auth ok and new token');
				// Store updated token
				window.localStorage.setItem('login_token', parsed.token);
			}

			this.setState({
				progress: 'authenticated'
			});
		} else {
			console.log('auth not ok');
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
