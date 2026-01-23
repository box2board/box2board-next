declare module "react" {
  export function useState<S>(
    initialState: S | (() => S)
  ): [S, (value: S | ((prev: S) => S)) => void];
}
