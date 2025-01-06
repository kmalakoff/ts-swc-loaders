export default function suppressWarnings() {
  const { emitWarning } = process;
  process.emitWarning = (warning, ...args) => {
    if (args[0] === 'ExperimentalWarning') return;
    if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') return;
    return emitWarning(warning, ...args);
  };
  return () => {
    process.emitWarning = emitWarning;
    return false;
  };
}
