import * as React from 'react';
// Disabled: import Router from 'next/router';
// Disabled: import {Email, UnhashedPassword} from '../lib/data-validator';
import Input from './input';
import Button from './button';

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		// Disabled:
		// this.state = {
		//    error: null,
		//    token: 'no token yet'
		// };

		this.submit = this.submit.bind(this);
	}

	async submit() {
		// Code disabled as the contributor CMS is currently on hold
		// // TODO: Retrieve form elements
		// const payload = {
		//    email: 'test@heticiens.news',
		//    password: 'rosebud'
		// };
		//
		// if (!payload.email || !Email.test(payload.email)) {
		//    this.setState({
		//       error: 'invalid-email'
		//    });
		// }
		//
		// if (!payload.password || !UnhashedPassword.test(payload.password)) {
		//    this.setState({
		//       error: 'invalid-password'
		//    });
		// }
		//
		// const response = await window.fetch('/api/auth', {
		//    method: 'POST',
		//    headers: {
		//       'Content-Type': 'application/json'
		//    },
		//    body: JSON.stringify(payload)
		// });
		//
		// const parsed = await response.json();
		//
		// this.setState({
		//    error: null,
		//    token: parsed.token
		// });
		//
		// window.localStorage.setItem('login_token', parsed.token);
		// setTimeout(() => {
		//    Router.push('/contributors');
		// }, 500);
	}

	render() {
		return (
			<div className="loginForm">
				<h2>Espace<br/>Contributeurs</h2>
				<h3>Connectez-vous pour gérer et éditer vos publications.</h3>

				<div className="inputsContainer">
					<Input stretch type="email" placeholder="email@example.com"/>
					<Input stretch type="password" placeholder="•••••••••••"/>
				</div>

				<div className="buttonContainer">
					<Button icon="questionMark"/>
					<Button primary icon="chevronRight" value="Connexion" onClick={this.submit}/>
				</div>

				<style jsx>{`
					h2 {
						margin-bottom: 3px;
					}

					h3 {
						margin-bottom: 20px;
					}

					.inputsContainer {
						display: grid;
						grid-template-rows: repeat(2, auto);
						grid-template-columns: 1fr;
						grid-row-gap: 15px;
						margin-bottom: 20px;
					}

					.buttonContainer {
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
					}
				`}
				</style>
			</div>
		);
	}
}
