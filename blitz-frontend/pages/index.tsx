import { Tree } from "components/Tree/Tree";
import { FrameType } from "types";

const data: FrameType = {
  id: "page0",
  type: "page",
  title: "Page 1",
  children: [
    { id: "child0", type: "title", value: "Who are you" },
    {
      id: "child1",
      type: "input",
      label: "name:",
      variable: "name",
      inputType: "text",
    },
    { id: "child2", type: "ref", refId: "comp-fName" },
    { id: "child3", type: "ref", refId: "comp-address" },
    {
      type: "layout",
      id: "layout0",
      title: "Work and Education",
      displayType: "block",
      children: [
        {
          id: "child4",
          type: "selector",
          label: "your university:",
          options: [],
          variable: "university",
        },
        {
          id: "child5",
          type: "selector",
          label: "years of experience:",
          options: [],
          variable: "years-of-exp",
        },
        { id: "child3", type: "ref", refId: "comp-address" },
      ],
    },
  ],
};

const Home = (): JSX.Element => {
  return (
    <div className="container px-5 my-10">
      <Tree data={data} />
    </div>
  );
};

export default Home;
