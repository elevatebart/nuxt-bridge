const { getWebpackConfig } = require('nuxt-edge')
const { defineConfig } = require('vue-styleguidist')

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

    const webpackConfig = {
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
            ...nuxtWebpackConfig.plugins.filter(
                // And some other plugins that could conflcit with ours
                (p) => !FILTERED_PLUGINS.includes(p.constructor.name),
            ),
        ],
    }

    return defineConfig({
        webpackConfig,
    })
}
