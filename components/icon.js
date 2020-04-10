import * as React from 'react';
import DOMPurify from 'dompurify';
import DefaultColorScheme from '../lib/colors-default';

export default class Icon extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			downloaded: null
		};
	}

	componentDidMount() {
		if (!window) {
			return;
		}

		let color = this.props.color || DefaultColorScheme.black;
		color = color.replace('#', '');

		window.fetch(`/api/icons/${this.props.name}?fill=${color}`).then(async res => {
			if (this.unmounted) {
				return false;
			}

			if (!res.ok) {
				throw new Error(`Network response: ${res.status} ${res.statusText}`);
			}

			const payload = await res.text();
			const clean = DOMPurify.sanitize(payload);

			this.setState({
				downloaded: clean
			});
		}).catch(error => {
			console.warn('could not load icon', this.props.name, error);
		});
	}

	componentWillUnmount() {
		this.unmounted = true;
	}

	render() {
		return (
			<>
				<div
					// Html is sanitized...
					/* eslint-disable-next-line react/no-danger */
					dangerouslySetInnerHTML={{
						__html: (this.state.downloaded) ? this.state.downloaded : this.props.name
					}}
				/>

				<style jsx>{`
					div {
						display: inline-block;
						width: ${this.props.width || '24px'};
						height: ${this.props.height || '24px'};
					}

					svg {
						width: 100%;
						height: 100%;
					}
				`}
				</style>
			</>
		);
	}
}
