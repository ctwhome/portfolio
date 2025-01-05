import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import daisyui from 'daisyui';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [typography, forms, containerQueries, daisyui],

	daisyui: {
		themes: [
			{
				ctw: {
					primary: '#ffb83d',
					'primary-focus': '#db8b00',
					'primary-content': 'black',
					secondary: '#5e9c91',
					'secondary-focus': '#3e655f',
					'secondary-content': '#FFFFFF',
					accent: '#37cdbe',
					'accent-focus': '#2aa79b',
					'accent-content': '#FFFFFF',
					neutral: '#3d4451',
					'neutral-focus': '#2a2e37',
					'neutral-content': '#ffffff',
					'base-100': '#171717',
					'base-200': '#333',
					'base-300': '#555',
					'base-content': '#E8E8E8',
					info: '#2094f3',
					success: '#009485',
					warning: '#FF9900',
					error: '#ff5724'
				}
			},
			"dark",
			"light",
			"night",
			"cupcake",
			"bumblebee",
			"emerald",
			"corporate",
			"synthwave",
			"retro",
			"cyberpunk",
			"valentine",
			"halloween",
			"garden",
			"forest",
			"aqua",
			"lofi",
			"pastel",
			"fantasy",
			"wireframe",
			"black",
			"luxury",
			"dracula",
			"cmyk",
			"autumn",
			"business",
			"acid",
			"lemonade",
			"coffee",
			"winter",
		]
	}

} satisfies Config;
