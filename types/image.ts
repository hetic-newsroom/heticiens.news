import URL from 'url-parse'

export default interface Image {
	src: string
	width: number
	height: number
	alt: string
}

export function toImage(doc: Record<string, unknown>): Image {
	if (typeof doc.dimensions !== 'object' || !doc.url) throw new Error('type conversion failed: missing props')

	const { width, height } = doc.dimensions as { width: number; height: number }

	return {
		src: (url => {
			const u = new URL(url as string)
			return `https://${u.hostname}${u.pathname}`
		})(doc.url),
		width,
		height,
		alt: (doc.alt as string) || ''
	}
}
