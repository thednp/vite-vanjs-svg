import van from "vanjs-core";
import VanJSIcon from "../src/vanjs.svg?van";
import "./app.css";

type ChangeEvent<T extends EventTarget & Element = HTMLInputElement> =
  & InputEvent
  & { target: T };

export const App = () => {
  const { div, h1, label, input } = van.tags;
  const width = van.state(128);

  return div(
    h1(
      "Hello VanJS!",
    ),
    div(
      {
        class: "card",
        style: "display: flex; flex-direction: column; justify-content: center",
      },
      label(
        { for: "width" },
        "Width",
        input({
          placeholder: "Set width",
          name: "width",
          id: "width",
          value: width,
          type: "number",
          style: "margin: 0 1rem",
          onchange: (e: ChangeEvent) => width.val = Number(e.target.value),
        }),
      ),
      VanJSIcon({ class: "logo vanjs", width: width, height: "auto" }),
    ),
  );
};

const root = document.getElementById("app") as Element;

van.add(root, App());
