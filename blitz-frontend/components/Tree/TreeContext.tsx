import { createContext, useReducer } from "react";
import { ChildType, FrameType, TitleElementInterface } from "types";
import deepClone from "deep-clone";

interface TreeContextInterface {
  state: FrameType;
  copyRefElement: (id: string, elementConfig: ChildType) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onMoveRight: (id: string) => void;
  onMoveLeft: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteChildren: (id: string) => void;
  onAddChildren: (id: string) => void;
}

export const TreeContext = createContext<TreeContextInterface>(null);

interface TreeContextProviderProps {
  initialState: FrameType;
  children: React.ReactNode;
}

const reducer = (
  state: FrameType,
  action: { type: string; id: string; elementConfig?: ChildType }
) => {
  switch (action.type) {
    default:
      return state;
    case "MOVE_UP":
      return moveUp(action.id, state);
    case "MOVE_DOWN":
      return moveDown(action.id, state);
    case "MOVE_RIGHT":
      return moveRight(action.id, state);
    case "MOVE_LEFT":
      return moveLeft(action.id, state);
    case "DELETE":
      return deleteElement(action.id, state);
    case "DELETE_CHILDREN":
      return deleteChildren(action.id, state);
    case "ADD_CHILDREN":
      return addChildren(action.id, state);
    case "COPY_REF_ELEMENT":
      return copyRefElement(action.id, action.elementConfig, state);
  }
};

export const TreeContextProvider = (
  props: TreeContextProviderProps
): React.ReactElement => {
  const [state, dispatch] = useReducer(reducer, props.initialState);

  const copyRefElement = (id: string, elementConfig: ChildType) =>
    dispatch({ type: "COPY_REF_ELEMENT", id, elementConfig });
  const onMoveUp = (id: string) => dispatch({ type: "MOVE_UP", id });
  const onMoveDown = (id: string) => dispatch({ type: "MOVE_DOWN", id });
  const onMoveRight = (id: string) => dispatch({ type: "MOVE_RIGHT", id });
  const onMoveLeft = (id: string) => dispatch({ type: "MOVE_LEFT", id });
  const onDelete = (id: string) => dispatch({ type: "DELETE", id });
  const onDeleteChildren = (id: string) =>
    dispatch({ type: "DELETE_CHILDREN", id });
  const onAddChildren = (id: string) => dispatch({ type: "ADD_CHILDREN", id });

  return (
    <TreeContext.Provider
      value={{
        state,
        copyRefElement,
        onMoveUp,
        onMoveDown,
        onMoveRight,
        onMoveLeft,
        onDelete,
        onDeleteChildren,
        onAddChildren,
      }}
    >
      {props.children}
    </TreeContext.Provider>
  );
};

const copyRefElement = (
  id: string,
  elementConfig: ChildType,
  state: FrameType
) => {
  const { parentIds, itemId } = getParentAndItemIds(id);
  const newState = deepClone(state);

  const parent = findParent(newState, parentIds);

  const index = parent.children.findIndex((c) => c.id === itemId);
  parent.children[index] = elementConfig;

  return newState;
};

const moveUp = (id: string, state: FrameType) => {
  const { parentIds, itemId } = getParentAndItemIds(id);
  const newState = deepClone(state);

  const parent = findParent(newState, parentIds);
  const index = parent.children.findIndex((c) => c.id === itemId);
  parent.children = moveElement(
    parent.children,
    index,
    index === 0 ? 0 : index - 1
  );

  return newState;
};

const moveDown = (id: string, state: FrameType) => {
  const { parentIds, itemId } = getParentAndItemIds(id);
  const newState = deepClone(state);

  const parent = findParent(newState, parentIds);
  const index = parent.children.findIndex((c) => c.id === itemId);
  parent.children = moveElement(
    parent.children,
    index,
    index === parent.children.length ? parent.children.length : index + 1
  );

  return newState;
};

const moveRight = (id: string, state: FrameType) => {
  const { parentIds, itemId } = getParentAndItemIds(id);
  const newState = deepClone(state);

  const parent = findParent(newState, parentIds);
  const itemIndex = parent.children.findIndex((c) => c.id === itemId);
  const nodeBeforeItem = parent.children[itemIndex - 1];

  if (nodeBeforeItem.children) {
    const item = parent.children.find((c) => c.id === itemId);
    parent.children = parent.children.filter((c) => c.id !== itemId);
    nodeBeforeItem.children = [...nodeBeforeItem.children, item];
  }

  return newState;
};

const moveLeft = (id: string, state: FrameType) => {
  const { parentIds, itemId } = getParentAndItemIds(id);
  const newState = deepClone(state);

  const parent = findParent(newState, parentIds);
  const getGrandParent = findParent(newState, parentIds.slice(0, -1));

  const item = parent.children.find((c) => c.id === itemId);
  parent.children = parent.children.filter((c) => c.id !== itemId);
  getGrandParent.children = [...getGrandParent.children, item];

  return newState;
};

const deleteElement = (id: string, state: FrameType) => {
  const { parentIds, itemId } = getParentAndItemIds(id);
  const newState = deepClone(state);

  const parent = findParent(newState, parentIds);
  parent.children = parent.children.filter((c) => c.id !== itemId);

  return newState;
};

const deleteChildren = (id: string, state: FrameType) => {
  const { parentIds, itemId } = getParentAndItemIds(id);
  const newState = deepClone(state);

  const parent = findParent(newState, parentIds);
  const item = parent.children.find((c) => c.id === itemId);

  // items wiill always have children because this btn is only available on such elements which have childrens.
  item.children = [];

  return newState;
};

const addChildren = (id: string, state: FrameType) => {
  const { parentIds, itemId } = getParentAndItemIds(id);
  const newState = deepClone(state);

  const parent = findParent(newState, parentIds);
  const item = parent.children.find((c) => c.id === itemId);

  // example new element
  const newChildTitle: TitleElementInterface = {
    type: "title",
    id: `child${item.children.length + 1}`,
    value: "New Child",
  };
  item.children = [...item.children, newChildTitle];

  return newState;
};

const getParentAndItemIds = (id: string) => {
  const parentIds = id.split("_").slice(0, -1);
  const itemId = id.split("_").at(-1);

  return {
    parentIds,
    itemId,
  };
};

const findParent = (data: FrameType, parentIds: string[]) => {
  let parent: any = data;

  for (const id of parentIds) {
    if (
      (parent.type === "page" || parent.type === "layoute") &&
      parent.id === id
    ) {
      continue;
    } else {
      parent = parent.children.find((c) => c.id === id);
      continue;
    }
  }
  return parent;
};

const moveElement = (arr: any[], fromIndex: number, toIndex: number) => {
  const element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
  return arr;
};
