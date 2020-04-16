import * as React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default class Editor extends React.Component {
	handleEditorReady(editor) {
		console.log('editor ready!', editor);
	}

	handleChange(event, editor) {
		console.log('change:', event, editor.getData());
	}

	render() {
		return (
			<div className="editor">
				<CKEditor
					editor={ClassicEditor}
					data="<p>Hello from CKEditor 5!</p>"
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
