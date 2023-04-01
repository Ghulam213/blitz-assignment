import { ChildType } from "types";

export const composedComponentConfigs: Record<string, ChildType> = {
  "comp-fName": {
    id: "comp-fName",
    type: "input",
    label: "your family name:",
    variable: "fName",
    inputType: "text",
  },
  "comp-address": {
    type: "layout",
    title: "Address",
    displayType: "grid",
    id: "comp-address",
    children: [
      {
        id: "child0",
        type: "input",
        label: "Street Name:",
        variable: "street_name",
        inputType: "text",
      },
      {
        id: "child1",
        type: "input",
        label: "Street Number:",
        variable: "street_number",
        inputType: "number",
      },
      {
        id: "child2",
        type: "input",
        label: "Postal Code:",
        variable: "postal_code",
        inputType: "number",
      },
      {
        id: "child3",
        type: "selector",
        label: "city:",
        variable: "{city}",
        options: ["USA", "UK", "France", "England", "Canada", "Australia"],
      },
    ],
  },
};
