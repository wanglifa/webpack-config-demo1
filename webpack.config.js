const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const mode = 'production'
const HtmlWebpackPlugin = require('html-webpack-plugin')

const cssLoaders = (loaders) => [
  mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
  {
    loader: 'css-loader',
    options: {
      modules: {
        compileType: 'icss',
      },
    },
  },
  ...loaders,
]
module.exports = {
  mode,
  entry: {
    main: './src/index.js',
    admin: './src/admin.js',
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    mode === 'production' && new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      chunks: ['admin'],
    }),
  ].filter(Boolean),
  output: {
    filename: '[name].[contenthash].js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/')
    }
  },
  module: {
    rules: [
      {
        test: /\.styl(us)?$/i,
        use: cssLoaders([
          {
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                import: [path.resolve(__dirname, 'src/stylus-vars.styl')]
              }
            },
          }
        ]),
      },
      {
        test: /\.less$/i,
        use: cssLoaders([
          {
            loader: 'less-loader',
            options: {
              additionalData: `
                @import "~@/less-vars.less";
              `,
            },
          }
        ]),
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react', {runtime: 'classic'}],
              ['@babel/preset-typescript']
            ]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: cssLoaders([
          {
            loader: 'sass-loader',
            options: {
              additionalData: `
                @import "src/scss-vars.scss";
              `,
              sassOptions: {
                includePaths: [__dirname]
              },
            },
          },
        ]),
      },
    ]
  },
  optimization: {
    moduleIds: 'deterministic',
    minimize: false,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          priority: 10,
          minSize: 0, /* ???????????? 0????????? React ???????????????????????????????????? */
          test: /[\\/]node_modules[\\/]/, // ???????????? /node_modules/ ??? \node_modules\
          name: 'vendors', // ?????????
          chunks: 'all',  // all ????????????????????????????????????async ?????????????????????initial ??????????????????
          // ???????????????????????????????????????????????????????????? node_modules ???????????????????????? vendors.xxx.js
          // ?????? vendors ?????????????????????
        },
        common: {
          priority: 5,
          minSize: 0,
          minChunks: 2,
          chunks: "all",
          name: 'common',
        }
      },
    },
  }
}