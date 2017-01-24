const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  entry: {
    bundle: [path.resolve(__dirname, './src/js/core.js')]
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js'],
    alias: {
      'ie': 'component-ie',
      react: path.resolve('./node_modules/react')
    }
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot-loader',
          'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0&plugins[]=transform-decorators-legacy,plugins[]=syntax-async-functions,plugins[]=transform-runtime'
        ]
      },
      { test: /\.(sass|scss)$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
      { test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000&name=fonts/[name].[ext]' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"development"'
      }
    }),
    new HtmlWebpackPlugin({
      hash: false,
      template: 'src/index.html'
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      cn: 'classnames',
      _: 'lodash',
      ReactDOM: 'react-dom',
      axios: 'axios'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        sassLoader: {
          indentedSyntax: true
        }
      }
    })
  ],
  performance: {
    hints: false
  },
  devServer: {
    historyApiFallback: true,
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      warnings: false,
      publicPath: false
    }
  }
}
