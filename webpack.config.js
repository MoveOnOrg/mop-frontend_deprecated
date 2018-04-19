/* eslint-disable */
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src');
var APP_ENTRY = process.env.APP_ENTRY || "main";

var THEME = process.env.THEME || "legacy";
var THEME_DIR = path.resolve(__dirname, 'src/components/theme-' + THEME);
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var envVars = {
  'NODE_ENV': (process.env.PROD) ? 'production' : 'development',
  'API_URI': process.env.API_URI ||(process.env.PROD ? '/api/v1' : '/local/api/v1'),
  'WORDPRESS_API_URI': process.env.WORDPRESS_API_URI || (process.env.PROD ? '' : '/local/api'),
  'API_WRITABLE': process.env.API_WRITABLE || process.env.PROD,
  'API_SIGN_PETITION': process.env.API_SIGN_PETITION || '',
  'BASE_APP_PATH': process.env.BASE_APP_PATH || '/',
  'BASE_URL': process.env.BASE_URL || (process.env.PROD ? 'https://petitions.moveon.org' : ''),
  'ONLY_PROD_ROUTES': process.env.ONLY_PROD_ROUTES || '',
  'SESSION_COOKIE_NAME': process.env.SESSION_COOKIE_NAME || 'SO_SESSION',
  'STATIC_ROOT': process.env.STATIC_ROOT || '/local/',
  'TRACK_SHARE_URL': process.env.TRACK_SHARE_URL || '',
  'USE_HASH_BROWSING': process.env.USE_HASH_BROWSING || false,
  'PROD': process.env.PROD
}

// Stringify all envVars so strings get quoted (i.e. not included as code)
Object.keys(envVars).forEach(function(key) {
  var value = envVars[key]
  envVars[key] = JSON.stringify(value)
})

// Plugins for all environments
var webpackPlugins = [
  new webpack.DefinePlugin({
    'process.env': envVars
  })
]

// Plugins for production
if (process.env.PROD) {
  webpackPlugins = webpackPlugins.concat([
    new webpack.optimize.UglifyJsPlugin({sourceMap: true})
  ])
}

// Plugins for development
if (!process.env.PROD) {
  webpackPlugins = webpackPlugins.concat([
    new HtmlWebpackPlugin({
      template: 'local/index.html',
      chunksSortMode: 'none',
      inject: false,
      filename: 'index.html',
      staticPath: (process.env.STATIC_ROOT || ''),
      theme: THEME,
      cssPath: (process.env.NODE_ENV == 'production'
                ? 'https://s3.amazonaws.com/mop-static/css/moui.css'
                : '/css/moui.css'),
      giraffeCssPath: process.env.LOCAL_CSS ||
                        'https://mop-static-stage.s3-us-west-1.amazonaws.com/giraffe/styles/main.css',
      reactJs: (process.env.LOCAL_REACT
                ? process.env.LOCAL_REACT + 'react.js'
                : 'https://unpkg.com/react@15.4.1/dist/react.js'),
      reactDomJs: (process.env.LOCAL_REACT
                  ? process.env.LOCAL_REACT + 'react-dom.js'
                  : 'https://unpkg.com/react-dom@15.4.1/dist/react-dom.js')
    }),
    new webpack.HotModuleReplacementPlugin(),
  ])
}

// Set this env var to view a visualization of the chunks webpack creates
if (process.env.ANALYZE) webpackPlugins.push(new BundleAnalyzerPlugin())

var config = {
  entry: {
    polyfills: APP_DIR + '/apps/polyfills.js',
    [APP_ENTRY]: APP_DIR + '/apps/' + APP_ENTRY + '.js'
  },
  devServer: {
    host: "0.0.0.0",
    historyApiFallback: {
      disableDotRule: true
    },
    proxy: {
      "/api": "http://localhost:8000"
    }
  },
  devtool: 'sourcemap',
  output: {
    path: BUILD_DIR,
    publicPath: process.env.PUBLIC_ROOT || "/",
    //NOTE: when process.env.PROD is true this will be the minified file
    //TODO: maybe we should hash this and figure out a way to pass the hashed version to it
    filename: '[name].' + THEME + '.js',
    chunkFilename: 'chunk-[id]' + '.' + THEME + '.js?v=[chunkhash]'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        include : APP_DIR,
        loader : 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.svg$/,
        loader: "svg-react-loader"
      }
    ]
  },
  resolve: {
    alias: {
      Theme: THEME_DIR,
      LegacyTheme: path.resolve(__dirname, "src/components/theme-legacy/"),
      GiraffeUI: path.resolve(__dirname, "src/giraffe-ui")
    }
  },
  plugins: webpackPlugins
};

module.exports = config;
