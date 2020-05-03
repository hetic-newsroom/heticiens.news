import * as React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.config = {
			simpleUpload: {
				uploadUrl: `/api/upload?token=${props.token}`
			},
			heading: {
				options: [
					{model: 'paragraph', title: 'Paragraphe', class: 'ck-heading_paragraph'},
					{model: 'heading2', view: 'h2', title: 'Titre', class: 'ck-heading_heading2'},
					{model: 'heading3', view: 'h3', title: 'Sous-titre', class: 'ck-heading_heading3'}
				]
			},
			language: 'fr'
		};
	}

	render() {
		return (
			<div className="editor">
				<CKEditor
					ref={this.editor}
					config={this.config}
					editor={ClassicEditor}
					disabled={this.props.disabled ? this.props.disabled : false}
					data={this.props.data ? this.props.data : '<p>Montaigne et Darth Vader : les héticiens sont à la fois humanistes et technologues. Il faut que cela se révèle aux yeux du monde !</p>'}
					onChange={this.props.onChange}
				/>
				<style jsx>{`
				`}
				</style>
			</div>
		);
	}
}
