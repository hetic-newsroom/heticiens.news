import * as React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.handleChange = this.handleChange.bind(this);
	}

	handleEditorReady(editor) {
		console.log('editor ready!', editor);
	}

	handleChange(event, editor) {
		console.log('change:', event, editor.getData());
		this.props.onChange(event, editor);
	}

	render() {
		return (
			<div className="editor">
				<CKEditor
					editor={ClassicEditor}
					disabled={this.props.disabled ? this.props.disabled : false}
					data={this.props.data ? this.props.data : '<p>Hello from CKEditor 5!</p>'}
					onInit={this.handleEditorReady}
					onChange={this.handleChange}
				/>
				<style jsx>{`
				`}
				</style>
			</div>
		);
	}
}
