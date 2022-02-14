import { Links, LiveReload, Meta, NavLink, Outlet, Scripts, ScrollRestoration } from 'remix'
import type { MetaFunction } from 'remix'

import styles from './styles/app.css'
import { ThemeProvider } from 'react-tec'

export function links() {
	return [{ rel: 'stylesheet', href: styles }]
}

export const meta: MetaFunction = () => {
	return { title: 'SRALab Tools' }
}

const NavBarLinkArray = [
	{ to: '/adp-calculator', label: 'ADP Calculator' },
	{ to: '/pto-calculator', label: 'PTO Calculator' },
]

export default function App() {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width,initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body>
				{/* TODO: Separate this out into its own navbar component */}
				<nav className='bg-primary px-5 py-3 flex justify-between'>
					<NavLink to='/'>
						<h1 className='text-white text-3xl font-bold'>SRALab Tools</h1>
					</NavLink>
					<ul className='flex items-center'>
						{NavBarLinkArray.map((link) => (
							<li key={link.to} className='px-2 text-white'>
								<NavLink
									to={link.to}
									className={({ isActive }) =>
										`border-b-2 block text-lg ${
											isActive ? 'border-white' : 'border-transparent'
										} hover:border-white`
									}
								>
									{link.label}
								</NavLink>
							</li>
						))}
					</ul>
				</nav>
				{/* Would love to remove react-tec from this project in favor of using tailwindcss */}
				<ThemeProvider theme={{ primary: '#F26B21', secondary: '#EA1C2B' }}>
					<Outlet />
				</ThemeProvider>
				{/* <footer className='bg-primary px-5 py-3 flex justify-center'></footer> */}
				<ScrollRestoration />
				<Scripts />
				{process.env.NODE_ENV === 'development' && <LiveReload />}
			</body>
		</html>
	)
}
