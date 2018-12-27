const path = require('path')

const main = path.resolve(__dirname, './index.ts')

const sourcePaths = [main]

module.exports = (env, argv) => {
  return {
    entry: sourcePaths,

    mode: argv.mode,

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: argv.mode === 'development' ? 'example.js' : 'example.min.js',
      libraryTarget: 'umd',
      library: 'HadokenExample',
    },

    externals: {
      phaser: {
        umd: 'phaser',
        commonjs2: 'phaser',
        commonjs: 'phaser',
        amd: 'phaser',
        // indicates global variable should be used
        root: 'Phaser'
      },
      hadoken: {
        umd: 'hadoken',
        commonjs2: 'hadoken',
        commonjs: 'hadoken',
        amd: 'hadoken',
        // indicates global variable should be used
        root: 'Hadoken'
      },
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: [
            /node_modules/,
          ],
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: argv.mode === 'development',
            },
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [
            /node_modules/,
          ],
        },
      ],
    },
  }
}