import datepicker from 'react-datepicker/dist/react-datepicker.css'
import { Links, LiveReload, Meta, NavLink, Outlet, Scripts, ScrollRestoration } from 'remix'
import type { MetaFunction } from 'remix'

import styles from './styles/app.css'
import datepickerOverrides from './styles/react-datepicker-overrides.css'

export function links() {
	return [
		{ rel: 'stylesheet', href: datepicker },
		{ rel: 'stylesheet', href: datepickerOverrides },
		{ rel: 'stylesheet', href: styles },
		// Google Analytics
		{ rel: 'script', href: 'https://www.googletagmanager.com/gtag/js?id=G-QF8YDWB3DB' },
	]
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
				{/* Google Analytics */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());

							gtag('config', 'G-QF8YDWB3DB');
						`,
					}}
				/>
			</head>
			<body>
				{/* TODO: Separate this out into its own navbar component */}
				<nav className='bg-brand-orange-500 px-5 py-3 flex justify-between'>
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
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				{process.env.NODE_ENV === 'development' && <LiveReload />}
			</body>
		</html>
	)
}
