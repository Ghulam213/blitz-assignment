import { useContext, useEffect, useState } from "react";
import {
  ChildType,
  ElementType,
  FrameType,
  InputElementInterface,
  LayoutType,
  RefElementInterface,
  SelectorElementInterface,
  TitleElementInterface,
} from "types";

import {
  AiOutlineArrowDown,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
} from "react-icons/ai";

import { TiDeleteOutline } from "react-icons/ti";

import { MdDelete, MdOutlineAddCircleOutline } from "react-icons/md";
import { TreeContext, TreeContextProvider } from "./TreeContext";
import { composedComponentConfigs } from "components/composed-components/composedComponentConfigs";

interface TreeProps {
  data: FrameType;
}

interface TreeNodeProps {
  node: FrameType | LayoutType;
  isSubTree?: boolean;
  id: string;
}

interface TreeChildrenProps {
  children: ChildType[];
  id: string;
}

const checkIfFrameOrLayout = (node: ChildType) =>
  ["page", "layout"].includes(node.type);

export const Tree = ({ data }: TreeProps): JSX.Element => {
  return (
    <TreeContextProvider initialState={data as FrameType}>
      <TreeContext.Consumer>
        {(ctx) => <TreeNode node={ctx.state} id={ctx.state.id} />}
      </TreeContext.Consumer>
    </TreeContextProvider>
  );
};

export const TreeNode = ({ node, id }: TreeNodeProps) => {
  const layoutClasses =
    node.type === "layout" ? `bg-gray-100 display-${node.displayType}` : "";

  return (
    <div>
      <h1 className="mb-4 block uppercase tracking-wide text-gray-700 text-md font-bold">
        {node.title}
      </h1>
      <div
        className={`p-4 border-solid border-2 rounded border-gray-200 ml-8 ${layoutClasses} `}
      >
        <TreeChildren id={id}>{node.children || []}</TreeChildren>
      </div>
    </div>
  );
};

// Partials

const TreeChildren = ({ children, id }: TreeChildrenProps): JSX.Element => {
  const content = children.map((c, i) => {
    if (checkIfFrameOrLayout(c)) {
      return (
        <div key={`${id}_${c.id}`} className="p-4">
          <Controls
            id={`${id}_${c.id}`}
            hasChildren={!!(c as FrameType | LayoutType).children.length}
          >
            <TreeNode node={c as FrameType | LayoutType} id={`${id}_${c.id}`} />
          </Controls>
        </div>
      );
    }
    return (
      <div key={`${id}_${c.id}`} className="p-4">
        <Controls id={`${id}_${c.id}`}>
          <RenderElement element={c as ElementType} id={`${id}_${c.id}`} />
        </Controls>
      </div>
    );
  });

  return <div>{content}</div>;
};

const RenderElement = ({
  element,
  id,
}: {
  element: ElementType;
  id: string;
}) => {
  switch (element.type) {
    case "title":
      return <TitleElement element={element} />;
    case "input":
      return <InputElement element={element} />;
    case "selector":
      return <SelectorElement element={element} />;
    case "ref":
      return <RefElement element={element} id={id} />;
    default:
      return null;
  }
};

const TitleElement = ({ element }: { element: TitleElementInterface }) => {
  return (
    <h1 className="block uppercase tracking-wide text-gray-700 text-md font-bold">
      {element.value}
    </h1>
  );
};
const InputElement = ({ element }: { element: InputElementInterface }) => {
  return (
    <div>
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        {element.label}
      </label>
      <input
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id={element.label}
        type={element.inputType}
      />
    </div>
  );
};

const RefElement = ({
  element,
  id,
}: {
  element: RefElementInterface;
  id: string;
}) => {
  const { copyRefElement } = useContext(TreeContext);
  useEffect(() => {
    // fetch composed component config
    const config = composedComponentConfigs[element.refId];
    // copy it over to the state
    copyRefElement(id, config);
  }, []);

  return <></>;
};

const SelectorElement = ({
  element,
}: {
  element: SelectorElementInterface;
}) => {
  return (
    <div>
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        {element.label}
      </label>
      <div className="relative">
        <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          {element.options.map((o, i) => (
            <option key={i}>{o}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const Controls = ({
  children,
  id,
  hasChildren,
}: {
  children: React.ReactNode;
  id: string;
  hasChildren?: boolean;
}) => {
  const [display, setDisplay] = useState("hidden");
  const {
    onMoveUp,
    onMoveDown,
    onMoveRight,
    onMoveLeft,
    onDelete,
    onDeleteChildren,
    onAddChildren,
  } = useContext(TreeContext);
  return (
    <div
      className="relative cursor-pointer"
      onMouseLeave={() => setDisplay("hidden")}
    >
      <div
        className={`p-2 bg-white rounded absolute top-18 right-8 h-8 w-55 shadow-lg z-56 ${display} flex-row items-center gap-2`}
      >
        <AiOutlineArrowUp onClick={() => onMoveUp(id)} />
        <AiOutlineArrowDown onClick={() => onMoveDown(id)} />
        <AiOutlineArrowLeft onClick={() => onMoveLeft(id)} />
        <AiOutlineArrowRight onClick={() => onMoveRight(id)} />
        <MdDelete onClick={() => onDelete(id)} />
        {hasChildren && (
          <TiDeleteOutline onClick={() => onDeleteChildren(id)} />
        )}
        {hasChildren && (
          <MdOutlineAddCircleOutline onClick={() => onAddChildren(id)} />
        )}
      </div>
      <div onMouseEnter={() => setDisplay("flex")}>{children}</div>
    </div>
  );
};
