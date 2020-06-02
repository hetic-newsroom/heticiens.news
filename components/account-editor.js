import * as React from 'react';
import Router from 'next/router';
import {Email, UnhashedPassword} from '../lib/data-validator';
import Input from './input';
import Button from './button';

export default class AccountEditor extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			email: '',
			password: '',
			picture: null,
			bio: '',
			loading: false,
			social: {}
		};

		this.submit				= this.submit.bind(this);
		this.setEmailValue		= this.setEmailValue.bind(this);
		this.setPasswordValue	= this.setPasswordValue.bind(this);
		this.setBioValue		= this.setBioValue.bind(this);
		this.setFileValue		= this.setFileValue.bind(this);
		this.setSocialValue		= this.setSocialValue.bind(this);
	}

	async componentDidMount() {
		const token = window.localStorage.getItem('login_token');
		const userId = token.split('||')[0];

		// Get auth user moderator level
		const contributorRequest = await fetch(`/api/contributor/${userId}?token=${token}`);
		let contributor;
		try {
			contributor = await contributorRequest.json();
		} catch (_) {
			Router.push('/403');
			return;
		}

		if (this.props.id === userId) {
			// Access allowed to super-moderators and auth user own profile
			this.setState({
				token,
				email: contributor.email,
				picture: contributor.picture,
				bio: contributor.bio,
				social: {
					twitter: contributor.social.twitter || '',
					facebook: contributor.social.facebook || '',
					instagram: contributor.social.instagram || '',
					flickr: contributor.social.flickr || '',
					linkedin: contributor.social.linkedin || '',
					website: contributor.social.website || ''
				}
			});
		} else if (contributor.moderator > 1) {
			const profileRequest = await fetch(`/api/contributor/${this.props.id}?token=${token}`);
			let profile;
			try {
				profile = await profileRequest.json();
			} catch (_) {
				Router.push('/403');
				return;
			}

			this.setState({
				token,
				email: profile.email,
				picture: profile.picture,
				bio: profile.bio,
				social: {
					twitter: profile.social.twitter || '',
					facebook: profile.social.facebook || '',
					instagram: profile.social.instagram || '',
					flickr: profile.social.flickr || '',
					linkedin: profile.social.linkedin || '',
					website: profile.social.website || ''
				}
			});
		} else {
			Router.push('/403');
		}
	}

	setEmailValue(event) {
		this.setState({
			email: event.target.value
		});
	}

	setPasswordValue(event) {
		this.setState({
			password: event.target.value
		});
	}

	setBioValue(event) {
		this.setState({
			bio: event.target.value
		});
	}

	setFileValue(event) {
		// Convert image file to base64
		const reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.addEventListener('load', () => {
			this.setState({
				picture: reader.result
			});
		});
	}

	setSocialValue(network, event) {
		const previous = this.state.social;
		this.setState({
			social: {
				...previous,
				[network]: event.target.value
			}
		});
	}

	async submit(event) {
		event.preventDefault();

		if (this.state.email && !Email.test(this.state.email)) {
			this.setState({
				error: 'Le champ e-mail est incorrect.'
			});
			return;
		}

		if (this.state.password && !UnhashedPassword.test(this.state.password)) {
			this.setState({
				error: 'Le champ mot de passe est incorrect (6 caractères minimum).'
			});
			return;
		}

		if (!this.state.bio || this.state.bio.length < 140 || this.state.bio.length > 2000) {
			this.setState({
				error: 'La biographie ne correspond pas au standard : celle-ci doit faire au minimum 140 caractères et au maximum 2000 caractères.'
			});
			return;
		}

		this.setState({
			loading: true
		});

		const response = await window.fetch(`/api/contributor/${this.props.id}/edit`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: this.state.token,
				new: {
					email: this.state.email,
					picture: this.state.picture,
					bio: this.state.bio,
					password: this.state.password,
					social: this.state.social
				}
			})
		});

		let parsed;
		try {
			parsed = await response.json();
		} catch (_) {
			parsed = {};
		}

		switch (response.status) {
			case 200:
				Router.push(`/author/${this.props.id}`);
				break;
			case 400:
			case 404:
				this.setState({
					error: parsed.error,
					loading: false
				});
				break;
			case 403:
				this.setState({
					error: 'Accès refusé.',
					loading: false
				});
				break;
			default:
				this.setState({
					error: 'Une erreur inconnue est survenue, veuillez réessayer plus tard.',
					loading: false
				});
		}
	}

	render() {
		return (
			<div className="loginForm">
				<h2>Modifier le profil</h2>
				<h4>Laissez comme tel si vous ne souhaitez pas modifier un champ.</h4>

				<br/>
				<form className="inputsContainer" onSubmit={this.submit}>
					<h2>Changer les identifiants de connexion</h2>
					<Input
						value={this.state.email}
						disabled={this.state.loading}
						className="stretch"
						type="email"
						placeholder="email@example.com"
						onChange={this.setEmailValue}
					/>

					<Input
						value={this.state.password}
						disabled={this.state.loading}
						className="stretch"
						type="password"
						placeholder="•••••••••••"
						onChange={this.setPasswordValue}
					/>

					<h2>Changer le profil public</h2>
					<input
						type="file"
						value={this.state.file}
						disabled={this.state.loading}
						accept=".jpg,.jpeg,.png,.gif,.svg"
						onChange={this.setFileValue}
					/>
					<textarea
						value={this.state.bio}
						disabled={this.state.loading}
						placeholder="Cursus Héticien (Promo 2011) • Intéressé par <?>. Encore plus d'informations sur moi"
						onChange={this.setBioValue}
					/>

					<Input
						value={this.state.social.twitter}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="twitter"
						placeholder="https://twitter.com/"
						onChange={event => this.setSocialValue('twitter', event)}
					/>

					<Input
						value={this.state.social.linkedin}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="linkedin"
						placeholder="https://linkedin.com/in/"
						onChange={event => this.setSocialValue('linkedin', event)}
					/>

					<Input
						value={this.state.social.facebook}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="facebook"
						placeholder="https://facebook.com/"
						onChange={event => this.setSocialValue('facebook', event)}
					/>

					<Input
						value={this.state.social.instagram}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="instagram"
						placeholder="https://instagram.com/"
						onChange={event => this.setSocialValue('instagram', event)}
					/>

					<Input
						value={this.state.social.flickr}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="flickr"
						placeholder="https://flickr.com/"
						onChange={event => this.setSocialValue('flickr', event)}
					/>

					<Input
						value={this.state.social.website}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="website"
						placeholder="https://heticiens.news/"
						onChange={event => this.setSocialValue('website', event)}
					/>

					{
						this.state.error &&
							<h4 className="error">{this.state.error}</h4>
					}

					<div className="buttonContainer">
						<Button primary value="Enregistrer les modifications" type="submit"/>
					</div>
				</form>

				<style jsx>{`
					h2 {
						margin-bottom: 3px;
					}
					
					h3 {
						margin-bottom: 20px;
					}
					h4.error{
						padding-left: 15px;
						color: var(--color-negative);
						font-weight: 500;
					}
					
					.inputsContainer {
						display: grid;
						grid-template-rows: repeat(2, auto);
						grid-template-columns: 1fr;
						grid-row-gap: 15px;
						margin-bottom: 20px;
					}

					textarea {
						--bg: var(--color-light-grey);
						--fg: var(--color-black);

						-webkit-appearance: none;
						outline: none;
						// max-width: 100%;
						padding: 10px 15px;

						background: var(--bg);
						color: var(--fg);
						border: 4px solid var(--bg);
						border-radius: 15px;
						box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);

						font-size: 1.125rem;
						resize: vertical;
						min-height: 150px;
					}

					.buttonContainer {
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: flex-end;
					}
				`}
				</style>
			</div>
		);
	}
}
