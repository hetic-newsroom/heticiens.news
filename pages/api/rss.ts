import type { NextApiRequest, NextApiResponse } from 'next'
import makeFeed from 'lib/feeds'
import { fetchHomeFeed } from 'pages/index'

export default async (_: NextApiRequest, res: NextApiResponse) => {
	const feed = makeFeed(await fetchHomeFeed(25)).rss2()
	res.status(200)
	res.setHeader('Cache-Control', 'max-age=0, s-maxage=300, stale-while-revalidate')
	res.end(feed)
}
