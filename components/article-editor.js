import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {Email} from '../lib/data-validator';
import Button from './button';

const Editor = dynamic(
	() => import('./editor'),
	{
		loading: () => <h3>Chargement en cours...</h3>,
		ssr: false
	}
);

export default class ArticleEditor extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			error: null,
			previewId: null,
			token: null,
			contributorId: null,
			loading: false,
			intro: '',
			title: '',
			content: '',
			category: 'Interviews',
			image: null,
			authors: ''
		};

		this.setTitleValue = this.setTitleValue.bind(this);
		this.setIntroValue = this.setIntroValue.bind(this);
		this.setFileValue = this.setFileValue.bind(this);
		this.setContentValue = this.setContentValue.bind(this);
		this.setCategoryValue = this.setCategoryValue.bind(this);
		this.setAuthorsValue = this.setAuthorsValue.bind(this);
		this.submit = this.submit.bind(this);
		this.onEditorReady = this.onEditorReady.bind(this);
	}

	componentDidMount() {
		const token = window.localStorage.getItem('login_token');
		const userId = token.split('||')[0];
		this.setState({
			token,
			contributorId: userId
		});
	}

	onEditorReady() {
		const saved = JSON.parse(window.localStorage.getItem('_editorCache'));

		if (saved !== null) {
			this.setState({
				intro: saved.intro,
				title: saved.title,
				content: saved.content,
				authors: saved.authors,
				category: saved.category
			});

			window.localStorage.removeItem('_editorCache');
		}
	}

	setTitleValue(event) {
		this.setState({
			title: event.target.value
		});
	}

	setIntroValue(event) {
		this.setState({
			intro: event.target.value
		});
	}

	setFileValue(event) {
		// Convert image file to base64
		const reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.addEventListener('load', () => {
			this.setState({
				image: reader.result
			});
		});
	}

	setContentValue(event, editor) {
		this.setState({
			content: editor.getData()
		});
	}

	setAuthorsValue(event) {
		this.setState({
			authors: event.target.value
		});
	}

	setCategoryValue(event) {
		this.setState({
			category: event.target.value
		});
	}

	validateEmails() {
		let valid = true;

		if (this.state.authors.length === 0) {
			return valid;
		}

		this.state.authors.split(', ').forEach(email => {
			if (!this.state.authors || !Email.test(email)) {
				valid = false;

				this.setState({
					error: 'La liste d’e-mails est incorrecte.'
				});
			}
		});

		return valid;
	}

	async submit() {
		if (this.validateEmails() === false || this.state.loading === true) {
			return;
		}

		if (this.state.content === null) {
			this.setState({
				error: 'Un contenu est nécessaire pour continuer.'
			});
			return;
		}

		if (this.state.image === null) {
			this.setState({
				error: 'Une image est nécessaire pour continuer.'
			});
			return;
		}

		this.setState({
			error: null,
			loading: true
		});

		window.localStorage.setItem('_editorCache', JSON.stringify({
			intro: this.state.intro,
			title: this.state.title,
			content: this.state.content,
			authors: this.state.authors,
			category: this.state.category
		}));

		console.log({
			token: this.state.token,
			draft: {
				authors: this.state.authors.length > 0 ? [this.state.contributorId, ...this.state.authors.split(', ')] : [this.state.contributorId],
				title: this.state.title,
				category: this.state.category,
				intro: this.state.intro,
				content: this.state.content,
				image: this.state.image
			}
		});
		try {
			const request = await fetch(`/api/contributor/${this.state.contributorId}/drafts/new`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token: this.state.token,
					draft: {
						authors: this.state.authors.length > 0 ? [this.state.contributorId, ...this.state.authors.split(', ')] : [this.state.contributorId],
						title: this.state.title,
						category: this.state.category,
						intro: this.state.intro,
						content: this.state.content,
						image: this.state.image
					}
				})
			});

			const response = await request.json();

			switch (request.status) {
				case 201:
					localStorage.removeItem('_editorCache');
					this.setState({
						loading: false,
						previewId: response.draft
					});
					break;
				case 400:
					console.log(response);
					this.setState({
						loading: false,
						error: response.error
					});
					break;
				case 404:
					this.setState({
						loading: false,
						error: 'Le contributeur n’a pas été trouvé.'
					});
					break;
				case 403:
					this.setState({
						loading: false,
						error: 'Vous n’avez pas l’autorisation de publier un article pour ce contributeur. Essayez de vous connecter à nouveau.'
					});
					break;
				default:
					this.setState({
						loading: false,
						error: 'Une erreur inconnue est survenue. Veuillez réessayer plus tard.'
					});
			}
		} catch (err) {
			console.log(err);
			this.setState({
				loading: false,
				error: 'Une erreur inconnue est survenue. Veuillez réessayer plus tard.'
			});
		}
	}

	render() {
		return (
			<div className="articleForm">
				<input
					type="text"
					value={this.state.title}
					disabled={this.state.loading}
					placeholder="Un titre percutant"
					onChange={this.setTitleValue}
				/>
				<input
					type="file"
					value={this.state.file}
					disabled={this.state.loading}
					accept=".jpg,.jpeg,.png,.gif,.svg"
					onChange={this.setFileValue}
				/>
				<textarea
					value={this.state.intro}
					disabled={this.state.loading}
					placeholder="Dans un monde où le changement s’accélère, les écoles doivent s’adapter en permanence aux besoins des entreprises. Directeur général de HETIC, Frédéric Sitterlé veut associer les étudiants à cette évolution, via un conseil de perfectionnement pédagogique."
					onChange={this.setIntroValue}
				/>
				<Editor
					data={this.state.content}
					disabled={this.state.loading}
					token={this.state.token}
					onChange={this.setContentValue}
					onInit={this.onEditorReady}
				/><br/>
				<select value={this.state.category} onChange={this.setCategoryValue}>
					<option value="Interviews">Interviews</option>
					<option value="Reportages">Reportages</option>
					<option value="Enquêtes">Enquêtes</option>
					<option value="Opinions">Opinions</option>
					<option value="Portraits">Portraits</option>
				</select>
				<input
					type="text"
					value={this.state.authors}
					disabled={this.state.loading}
					placeholder="E-mails des co-auteurs, séparés par ’, ’"
					onChange={this.setAuthorsValue}
				/>

				{
					this.state.error !== null &&
						<h4 className="error">{this.state.error}</h4>
				}
				<div className="horizontal">
					<div>&nbsp;</div>
					{
						this.state.previewId === null ?
							<Button
								primary={this.state.loading === false}
								icon="chevronRight"
								value={this.state.loading === true ? 'Ajout de l’article en cours…' : 'Mettre en brouillon'}
								onClick={this.submit}
							/> :
							<Link href={`/article/${this.state.previewId}`}>
								<a>
									<Button
										positive
										icon="chevronRight"
										value="Prévisualiser l’article"
									/>
								</a>
							</Link>
					}
				</div>

				<style jsx>{`
					.articleForm{
						display: flex;
						flex-direction: column;
					}
					.articleForm > *{
						margin-bottom: 20px;
					}
					.articleForm .horizontal{
						display: flex;
					}
					.articleForm .horizontal > *{
						flex: 1;
					}

					h4.error{
						padding-left: 15px;
						color: var(--color-negative);
						font-weight: 500;
					}

					input[type="text"], textarea {
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
					}

					textarea {
						font-size: 1.125rem;
						resize: vertical;
						min-height: 150px;
					}
				`}
				</style>
			</div>
		);
	}
}
