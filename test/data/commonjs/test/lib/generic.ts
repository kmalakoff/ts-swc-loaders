// Test TypeScript generics - this was the original bug
// resolveOnce<number>() was being parsed as JavaScript: resolveOnce < number > ()
export function identity<T>(value: T): T {
  return value;
}

export default identity<number>(42);
