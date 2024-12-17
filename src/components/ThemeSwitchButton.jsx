import { useEffect, useState } from "react"

export default function ThemeSwitchButton() {
	const [theme, setTheme] = useState('dark')

	useEffect(()=> {
		changeTheme(localStorage.getItem('theme') || 'dark')
	}, [])

	const isThemeLight = () => theme == 'light'

	function changeTheme(theme) {
		setTheme(theme)
		localStorage.setItem('theme', theme)
		document.documentElement.setAttribute('data-theme', theme)
	}
	
	function switchTheme() {
		const new_theme = isThemeLight() ? 'dark' : 'light'
		changeTheme(new_theme)
	}

	return (
		<button className='symbol' onClick={switchTheme}>
			{isThemeLight() ? 'wb_sunny' : 'dark_mode'}
		</button>
	);
}
