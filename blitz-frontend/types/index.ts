export interface TitleElementInterface {
  id: string;
  type: "title";
  value: string;
}

export interface RefElementInterface {
  id: string;
  type: "ref";
  refId: string;
}

export interface InputElementInterface {
  id: string;
  type: "input";
  inputType: string;
  label: string;
  variable: string;
}

export interface SelectorElementInterface {
  id: string;
  type: "selector";
  label: string;
  variable: string;
  options: string[];
}

export type ElementType =
  | TitleElementInterface
  | RefElementInterface
  | InputElementInterface
  | SelectorElementInterface;

export type ChildType = LayoutType | FrameType | ElementType;

// export type Child = Element;

export interface LayoutType {
  id: string;
  type: "layout";
  title: string;
  displayType: "block" | "grid";
  children: ChildType[];
}

export interface FrameType {
  id: string;
  title: string;
  type: "page";
  children: ChildType[];
}
