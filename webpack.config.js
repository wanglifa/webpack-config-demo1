const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')
const cssLoaders = (loaders) => [
  'style-loader',
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
  mode: 'production',
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    })
  ],
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
    minimize: false
  }
}