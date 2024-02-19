import process from 'process';
import getopts from 'getopts-compat';
import { pathToFileURL } from "node:url"; 

var options = getopts(process.argv.slice(2), {
  alias: { import: 'i', loader: 'l', warnings: 'w' },
  stopEarly: true,
});

process.argv = options._;
// --loader 
if (process.env.NODE_OPTIONS) {
  import(process.argv.shift());
}
// --register
else if (options.import) {
  import('node:module').then(({register}) => {
    register("ts-swc-loaders", pathToFileURL("./"))
    import(process.argv.shift());
  })
} 
else {
  throw new Error('Loader options missing')
}
