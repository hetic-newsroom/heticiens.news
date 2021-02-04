export default function shortenText(txt: string, target = 130): string {
	const sentences = txt.split('. ').map(x => x.replace(/\.$/g, ''))

	while ((sentences.reduce((x, str) => x+str.length, 0) > target) && sentences.length > 1) {
		sentences.pop()
	}

	return sentences.join('. ') + '.'
}
