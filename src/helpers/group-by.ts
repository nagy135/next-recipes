export function groupBy<T>(xs: T[], key: string): Array<T[]> {
  return Object.values(
    xs.reduce(function (rv, x) {
      // @ts-ignore
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {}),
  );
}
