export default function Index() {
	return (
		<div className='max-w-prose mx-auto mt-12 text-center'>
			<h1 className='text-3xl text-primary font-semibold mb-4'>Welcome to SRALab Tools</h1>
			<p className='leading-relaxed text-lg mb-4'>
				I hope these tools save you some time. 😊
			</p>
			<p className='leading-tight text-sm'>
				Code for this website is public and can be viewed{' '}
				<a
					className='underline'
					href='https://github.com/SCasarotto/sralab.tools'
					target='_blank'
					rel='noreferrer noopener'
				>
					here
				</a>
				.
			</p>
			<p className='leading-tight text-sm'>
				For any bugs or feature requests provide them{' '}
				<a
					className='underline'
					href='https://github.com/SCasarotto/sralab.tools/issues'
					target='_blank'
					rel='noreferrer noopener'
				>
					here
				</a>
				.
			</p>
		</div>
	)
}
