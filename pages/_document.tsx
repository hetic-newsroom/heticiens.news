import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'

export default class HeticiensNews extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	render() {
		return (
			<Html lang="fr">
				<Head/>
				<body>
					<Main/>
					<NextScript/>
				</body>
			</Html>
		)
	}
}
