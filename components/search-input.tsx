import type { DetailedHTMLProps, InputHTMLAttributes, ChangeEvent } from 'react'
import { useState, useEffect } from 'react'
import { useTimeoutFn } from 'react-use'
import { Search } from 'react-feather'
import styles from './search-input.module.scss'

export interface SearchInputProps {
	initialValue?: string
	onThrottledChange?: (arg0: string) => void
}

export default function SearchInput(props: SearchInputProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
	const {
		initialValue,
		onThrottledChange,
		...htmlProps
	} = props

	const [value, setValue] = useState('')
	useEffect(() => {
		if (typeof initialValue === 'string') setValue(initialValue)
	}, [initialValue])

	const [triggerThrottleChange, , resetThrottleChange] = useTimeoutFn(() => {
		if (typeof onThrottledChange === 'function') onThrottledChange(value)
	}, 600)

	function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
		setValue(e.target.value)
		resetThrottleChange()
		triggerThrottleChange()
	}

	return <div
		className={styles.container}
	>
		<Search />
		<input
			className={styles.input}
			type="search"
			value={value}
			onChange={handleInputChange}
			spellCheck={false}
			placeholder="Parcourez HN"
			{ ...htmlProps }
		/>
	</div>
}
