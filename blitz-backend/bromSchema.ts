import { BormSchema, DataField, LinkField } from "@blitznocode/blitz-orm";
import { v4 as uuidv4 } from "uuid";

export const title: DataField = {
  shared: true,
  path: 'title',
  cardinality: 'ONE',
  contentType: 'TEXT',
};

export const label: DataField = {
  shared: true,
  path: 'label',
  cardinality: 'ONE',
  contentType: 'TEXT',
};

export const variable: DataField = {
  shared: true,
  path: 'variable',
  cardinality: 'ONE',
  contentType: 'TEXT',
};

export const typeOf: DataField = {
  shared: true,
  path: 'typeOf',
  cardinality: 'ONE',
  contentType: 'TEXT',
};

export const id: DataField = {
  shared: true,
  path: 'id',
  cardinality: 'ONE',
  default: { type: 'function', value: () => uuidv4() },
  validations: { required: true, unique: true },
  contentType: "ID"
};

export const childInChildrenRelation: LinkField = {
  path: "children",
  cardinality: "MANY",
  relation: "children",
  plays: "child",
  target: "role"
}

export const childInReferencedInstanceRelation: LinkField = {
  path: "children",
  cardinality: "MANY",
  relation: "referenced-instance",
  plays: "child",
  target: "role"
}

export const schema: BormSchema = {
  entities: {
    frame: {
      idFields: ["id"],
      defaultDBConnector: { id: 'default', path: 'frame' },
      dataFields: [
        { ...id },
        { ...title },
        { ...typeOf },
      ],
      linkFields: [
        {
          path: "frame",
          cardinality: "ONE",
          relation: "children",
          plays: "parent",
          target: "role"
        },
        {...childInChildrenRelation},
        {
          path: "frame",
          cardinality: "ONE",
          relation: "referenced-instance",
          plays: "parent",
          target: "role"
        },
      ]
    },
    layouts: {
      idFields: ["id"],
      defaultDBConnector: { id: 'default', path: 'layout' },
      dataFields: [
        { ...id },
        { ...title },
        { ...typeOf },
        {
          shared: true,
          path: 'displayType',
          cardinality: 'ONE',
          contentType: 'TEXT',
        }
      ],
      linkFields: [
        {
          path: "layout",
          cardinality: "ONE",
          relation: "children",
          plays: "parent",
          target: "role"
        },
        {...childInChildrenRelation},
        {
          path: "layout",
          cardinality: "ONE",
          relation: "referenced-instance",
          plays: "parent",
          target: "role"
        },
      ]
    },
    component: {
      idFields: ["id"],
      defaultDBConnector: { id: 'default', path: 'component' },
      dataFields: [
        { ...id },
        { ...title },
        { ...typeOf },
      ],
      linkFields: [
        {...childInChildrenRelation},
        {...childInReferencedInstanceRelation}
      ]
    },
    element: {
      idFields: ["id"],
      defaultDBConnector: { id: 'default', path: 'element' },
      dataFields: [
        { ...id },
        { ...typeOf },
      ],
      linkFields: [
        {...childInChildrenRelation},
        {...childInReferencedInstanceRelation}
      ]
    },
    titleElement: {
      extends: "element",
      idFields: ["id"],
      defaultDBConnector: { id: 'default', path: 'titleElement' },
      dataFields: [
        { ...title },
      ]
    },
    refElement: {
      extends: "element",
      idFields: ["id"],
      defaultDBConnector: { id: 'default', path: 'refElement' },
      dataFields: [
        {
          shared: true,
          path: 'refId',
          cardinality: 'ONE',
          default: { type: 'function', value: () => uuidv4() },
          validations: { required: true, unique: true },
          contentType: "ID"
        },
      ]
    },
    inputElement: {
      extends: "element",
      idFields: ["id"],
      defaultDBConnector: { id: 'default', path: 'inputElement' },
      dataFields: [
        {
          shared: true,
          path: 'inputType',
          cardinality: 'ONE',
          contentType: 'TEXT',
        },
        {...label},
        {...variable},
      ]
    },
    selectorElement: {
      extends: "element",
      idFields: ["id"],
      defaultDBConnector: { id: 'default', path: 'selectorElement' },
      dataFields: [
        {
          shared: true,
          path: 'options',
          cardinality: 'ONE',
          contentType: 'JSON',
        },
        {...label},
        {...variable},
      ]
    },
  },
  relations: {
    children: {
      idFields: ["id"],
      defaultDBConnector: { id: 'default', path: 'children' },
      dataFields: [{...id}],
      roles: {
        parent: {
          cardinality: "ONE",
        },
        child: {
          cardinality: "MANY",
        }
      }
    },
    'referenced-instance': {
      idFields: ["id"],
      defaultDBConnector: { id: 'default', path: 'children' },
      dataFields: [{...id}],
      roles: {
        parent: {
          cardinality: "ONE",
        },
        child: {
          cardinality: "MANY",
        }
      }
    },
  }
};