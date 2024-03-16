import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type FiltersProps = {
  keywords: string[];
  setKeywords: Dispatch<SetStateAction<string[]>>;
};

export default function Filters({ keywords, setKeywords }: FiltersProps) {
  const [animationParent] = useAutoAnimate({ easing: "ease-in", duration: 100, disrespectUserMotionPreference: true });
  const [input, setInput] = useState<string>("");
  return <div className="container w-1/2">
    <p>Filters:</p>
    <ul ref={animationParent} className="flex flex-col my-2 items-start cursor-crosshair">
      {keywords.map((e, i) => <li
        className={"hover:bg-red-500 hover:text-white"}
        onClick={() => setKeywords((prev: string[]) => prev.filter(inner => inner !== e))}
        key={`filter-${i}`}>{e}</li>)}
    </ul>
    <Input type="text" value={input} onChange={(e) => { setInput(e.target.value) }} />
    <Button
      className="my-2"
      variant="outline"
      onClick={() => {
        setKeywords((prev: string[]) => [...prev, input]);
        setInput("");
      }}
    >Add filter</Button>
  </div>;
}
