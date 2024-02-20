import process from 'node:process';
import getopts from 'getopts-compat';
import { pathToFileURL, fileURLToPath } from "node:url"; 

const __filename = fileURLToPath(import.meta.url);
const index = process.argv.indexOf(__filename.substring(0, __filename.lastIndexOf('.')));
if (index>0) process.argv = process.argv.slice(index+1);

var options = getopts(process.argv, {
  alias: { import: 'i', loader: 'l', warnings: 'w' },
  boolean: ['experimental-modules'],
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
