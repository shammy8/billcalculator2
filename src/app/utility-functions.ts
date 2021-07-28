export function createObjectWithEveryone<T>(
  value: T,
  friends: string[]
): { [key: string]: T } {
  const object: { [key: string]: T } = {};
  friends.forEach((friend) => {
    if (typeof value === 'object' && value !== null) {
      object[friend] = { ...value };
    } else {
      object[friend] = value;
    }
  });
  return object;
}
