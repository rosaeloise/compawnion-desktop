const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
	packagerConfig: {
		asar: true,
		icon: './src/assets/icon',
		appBundleId: 'com.compawnion',
		appCategoryType: 'public.app-category.developer-tools',
		protocols: [
			{
				name: 'compawnion',
				schemes: ['compawnion']
			}
		]
	},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'compawnion',
				setupIcon: './src/assets/icon.ico',
				setupExe: 'compawnion.exe',
				setupMsi: 'compawnion.msi'
			}
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin']
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				options: {
					name: 'compawnion',
					productDescription: 'A desktop application for managing shelter adoption process',
					productName: 'Compawnion',
					arch: 'amd64',
					icon: './src/assets/icon.png',
					maintainer: 'Barkcode Development team'
				}
			}
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {
				options: {
					name: 'compawnion',
					productDescription: 'A desktop application for managing shelter adoption process',
					productName: 'Compawnion',
					arch: 'x86_64',
					icon: './src/assets/icon.png',
					maintainer: 'Barkcode Development team'
				}
			}
		}
	],
	plugins: [
		{
			name: '@electron-forge/plugin-auto-unpack-natives',
			config: {}
		},
		{
			name: '@electron-forge/plugin-webpack',
			config: {
				port: 3001,
				devContentSecurityPolicy: `img-src https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';`,
				mainConfig: './webpack.main.config.js',
				renderer: {
					config: './webpack.renderer.config.js',
					entryPoints: [
						{
							html: './src/index.html',
							js: './src/renderer.js',
							name: 'main_window',
							preload: {
								js: './src/preload.js'
							}
						}
					]
				}
			}
		},
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: true
		})
	]
};
