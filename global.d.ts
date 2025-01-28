declare module "*.svg?van" {
  import type {
    PropsWithKnownKeys,
    PropValueOrDerived,
    TagFunc,
  } from "vanjs-core";

  type SVGProps = PropsWithKnownKeys<SVGSVGElement> & {
    class: PropValueOrDerived;
  };
  const SVGTag: (
    props?: Partial<SVGProps>,
  ) => ReturnType<TagFunc<SVGSVGElement>>;
  export default SVGTag;
}
