import * as React from 'react';
import Router from 'next/router';

import {Email, UnhashedPassword} from '../lib/data-validator';

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			token: 'no token yet'
		};

		this.submit = this.submit.bind(this);
	}

	async submit() {
		// TODO: Retrieve form elements
		const payload = {
			email: 'test@heticiens.news',
			password: 'rosebud'
		};

		if (!payload.email || !Email.test(payload.email)) {
			this.setState({
				error: 'invalid-email'
			});
		}

		if (!payload.password || !UnhashedPassword.test(payload.password)) {
			this.setState({
				error: 'invalid-password'
			});
		}

		const response = await window.fetch('/api/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const parsed = await response.json();

		this.setState({
			error: null,
			token: parsed.token
		});

		window.localStorage.setItem('login_token', parsed.token);
		setTimeout(() => {
			Router.push('/contributors');
		}, 500);
	}

	render() {
		return (
			<div className="loginForm">
				<button type="button" onClick={this.submit}>
					Login
				</button>
				<p>{this.state.token}</p>
				<p>{this.state.error}</p>
				<style jsx>{`
					.loginForm {
						width: 150px;
						height: 200px;
						background: #eee;
					}
				`}
				</style>
			</div>
		);
	}
}
