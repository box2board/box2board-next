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

  interface JSXElementConstructor<P> {
    (props: P): ReactElement | null;
  }
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
