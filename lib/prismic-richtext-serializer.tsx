import type { ReactNode } from 'react'
import type { HTMLSerializer } from 'prismic-reactjs'
import URL from 'url-parse'
import Link from 'next/link'
import Image from 'next/image'
import { Elements } from 'prismic-reactjs'
import Img, { toImage } from 'types/image'

const htmlSerializer: HTMLSerializer<ReactNode> = (type, element, _, children, key) => {

	switch(type) {
		case Elements.image: {
			const img: Img = toImage(element)
			return <aside style={{ position: 'relative' }} key={key}>
				<Image
					{ ...img }
					layout="responsive"
				/>
			</aside>
		}
		case Elements.hyperlink: {
			const { url } = element.data
			if (url.startsWith('https://heticiens.news') || url.startsWith('/')) {
				return <Link href={new URL(url).pathname} key={key}>
					<a>{ children }</a>
				</Link>
			} else {
				return <a href={url} target="_blank" rel="noopener">{ children }</a>
			}
		}
		default:
			return null
	}
}

export default htmlSerializer
