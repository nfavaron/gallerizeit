import rollup      from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';

export default {
  entry: 'app/main-aot.js',
  dest: 'aot/gallerizeit.js', // output a single application bundle
  sourceMap: false,
  format: 'iife',
  useStrict: false,
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js']
    }),
    commonjs({
      include: [
        'node_modules/rxjs/**',
        'node_modules/angularfire2/**', // here we're calling angularfire2.
        'node_modules/firebase/**' // here we're calling firebase.
      ],
      namedExports: {
        'node_modules/firebase/firebase-browser.js': ['app', 'initializeApp', 'auth', 'database'],
        'node_modules/angularfire2/node_modules/firebase/firebase-browser.js': ['app', 'initializeApp', 'auth', 'database']
      }
    })
  ],
  context: 'this' // prevents errors "this has been replaced by undefined"
}
