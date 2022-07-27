const path = require('path')
const { readdirSync, existsSync, statSync } = require('fs')
const { resolve, join } = require('path')
const { getWebpackConfig } = require('nuxt-edge')
const { VuetifyLoaderPlugin } = require('vuetify-loader')

const FILTERED_PLUGINS = [
    'WebpackBarPlugin',
    'VueSSRClientPlugin',
    'HotModuleReplacementPlugin',
    'FriendlyErrorsWebpackPlugin',
    'HtmlWebpackPlugin',
]

/** @type import("vue-styleguidist").Config */
module.exports = async () => {
    // get the webpack config directly from nuxt
    const nuxtWebpackConfig = await getWebpackConfig('client', {
        for: 'dev',
    })
    const skip = ['div', 'span', 'strong', 'p', 'th', 'tr', 'td', 'tbody', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    const webpackConfig = {
        devtool: 'source-map',
        module: {
            rules: [
                ...nuxtWebpackConfig.module.rules.filter(
                    // remove the eslint-loader
                    (a) => a.loader !== 'eslint-loader',
                ),
            ],
        },
        resolve: { ...nuxtWebpackConfig.resolve },
        plugins: [
            ...nuxtWebpackConfig.plugins.filter((p) => !FILTERED_PLUGINS.includes(p.constructor.name)),
            new VuetifyLoaderPlugin({
                match(originalTag, { camelTag, kebabTag }) {
                    if (kebabTag.startsWith('v-') || skip.includes(kebabTag)) return
                    const getDirectories = (srcPath) =>
                        readdirSync(srcPath).filter((file) => statSync(join(srcPath, file)).isDirectory())

                    const getFolders = function (basePath) {
                        const subFolders = getDirectories(resolve(__dirname, basePath))
                        subFolders.push('')
                        return subFolders
                    }

                    const scanFolders = function (basePath, subFolders, fromInside = false) {
                        let prefix = kebabTag.split('-')[0]
                        let name = `${camelTag}.vue`
                        if (prefix === 'lazy') {
                            name = name.substring(prefix?.length)
                            prefix = kebabTag.split('-')[1]
                        }
                        let found = false
                        for (let subFolder of subFolders) {
                            subFolder += subFolder ? '/' : ''
                            try {
                                if (`${prefix}/` === subFolder.toLowerCase())
                                    name = name.substring(prefix?.length)

                                const path = basePath + subFolder + name
                                if (existsSync(path)) {
                                    found = path
                                } else if (subFolder) {
                                    const folders = getFolders(basePath + subFolder)
                                    if (folders.length > 1)
                                        found = scanFolders(basePath + subFolder, folders, true)
                                }
                            } catch (e) {}
                            if (found) break
                        }
                        if (fromInside) return found
                        else return found || false
                    }

                    const moduleComponents = function () {
                        const basePath = 'client/components/'
                        const found = scanFolders(basePath, getFolders(basePath))
                        if (found) {
                            return [camelTag, `import ${camelTag} from '${found.replace('client/', '~/')}'`]
                        }
                    }

                    if (originalTag[0] === originalTag[0].toUpperCase()) return moduleComponents()
                },
            }),
        ],
    }

    return {
        locallyRegisterComponents: true,
        getComponentPathLine(componentPath) {
            const component = componentPath
                .replace(/client\\components\\/, '')
                .replace('client/components/', '')
                .replace('.vue', '')
            const name = component
                .split('/')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join('')

            return `import ${name} from '${componentPath.replace('client/', '~/')}';`
        },
        components: './client/components/**/*.vue',
        webpackConfig,
        assetsDir: './client/static',
        usageMode: 'expand',
        defaultExample: true,
        validExtends: (fullFilePath) => !/(?=node_modules)(?!node_modules\/vuetify)/.test(fullFilePath),
        renderRootJsx: resolve(__dirname, './styleguide.init.js'),
        jsxInComponents: false,
        require: [path.join(__dirname, './styleguide.css')],
        getExampleFilename(componentPath) {
            return componentPath
                .replace(/client\\components/, 'client\\docs\\components')
                .replace('client/components', 'client/docs/components')
                .replace(/\.vue$/, '.md')
        },
        // ignore: ['./client/components/**/ModalActions.vue'],
    }
}
