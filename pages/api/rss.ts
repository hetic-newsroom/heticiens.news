import type { NextApiRequest, NextApiResponse } from 'next'
import makeFeed from 'lib/feeds'
import { getStaticProps as getHomeFeed } from 'pages/index'

export default async (_: NextApiRequest, res: NextApiResponse) => {
	const feed = makeFeed((await getHomeFeed()).props.items).rss2()
	res.status(200)
	res.setHeader('Cache-Control', 'max-age=0, s-maxage=300, stale-while-revalidate')
	res.end(feed)
}
