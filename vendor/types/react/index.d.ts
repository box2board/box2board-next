declare namespace React {
  type ReactNode = string | number | boolean | null | undefined | ReactElement;

  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: string | number | null;
  }

  interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode }): ReactElement | null;
  }

  type FC<P = {}> = FunctionComponent<P>;

  type Dispatch<A> = (value: A) => void;
  type SetStateAction<S> = S | ((prevState: S) => S);

  interface JSXElementConstructor<P> {
    (props: P): ReactElement | null;
  }

  function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export = React;
export as namespace React;
