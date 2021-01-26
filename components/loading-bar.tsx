import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import styles from './loading-bar.module.scss'

const cx = classNames.bind(styles)

export default function AutoLoadingBar() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const handleRouteChange = () => {
			setLoading(true)
		}

		const handleRouteChangeStop = () => {
			setLoading(false)
		}

		router.events.on('routeChangeStart', handleRouteChange)
		router.events.on('routeChangeComplete', handleRouteChangeStop),
		router.events.on('routeChangeError', handleRouteChangeStop)

		return () => {
			router.events.off('routeChangeStart', handleRouteChange)
			router.events.off('routeChangeComplete', handleRouteChangeStop),
			router.events.off('routeChangeError', handleRouteChangeStop)
		}
	})

	return <div
		className={cx({
			loadingBar: true,
			loading
		})}
	></div>
}
