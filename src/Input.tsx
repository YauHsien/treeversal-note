import { useState, useRef, type FormEvent } from "react";
import { Show } from "./Show";

export function Input() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);

  const tree = `+
/ \\
- *
/ \\ / \\
% + - *
/ \\ / \\ / \\ / \\
1 2 3 4 5 6 7 8`;
  const isValid = (tree) => {
    const facts = tree.split('\n').map((x)=> {
      let sp = x.match(/[^ ]+/g);
      return [sp.length,
              sp.length - sp.filter((x)=>"0123456789".indexOf(x)!=-1).length];
    });
    for (let i = 0; i < facts.length; i++)
      if (( i % 2 == 1 && facts[i][1] != facts[i+1][0] )
          || ( i % 2 == 0 && i != facts.length - 1
               && facts[i][1] * 2 != facts[i+1][0] )) {
        console.error (`${i}-1: ${facts[i][1]}  ${i+1}-0: ${facts[i+1][0]}`);
        return false;
      }
    return true;
  };

  const [input, setInput] = useState(tree);
  const [inputIsValid, setInputIsValid] = useState(true);
  const [toShow, setToShow] = useState(false);

  const endpoint = async (e: FormEvent <HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData (e.currentTarget);
    const input = formData.get("input") as string;
  };

  const handleInput = (e) => {
    setInputIsValid(null);
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    if (inputIsValid) setToShow(true);
    else              setInputIsValid(isValid(input));
  }

  return (toShow?
    (<Show tree={input} />)
  :(
    <div className="api-tester">
      <form className="endpoint-row">
        <span style={{whiteSpace: "nowrap"}}>檢核</span>
        <textarea   ref={responseInputRef}   readOnly
         value={(inputIsValid == null)? "" : inputIsValid!? "輸入合格": "輸入不合格"}
         placeholder="呈現輸入檢核結果..." className="response-area" />
      </form>
      <form onSubmit={endpoint} className="endpoint">
      <textarea   name="input"
       rows="12"  value={input}   onChange={handleInput}
       placeholder="輸入二元樹..." className="response-area" />
      <button type="submit"   onClick={handleSubmit}
       className="send-button">
       {(inputIsValid!)? "展示演算法" : "輸入"}
      </button>
      </form>
    </div>
  ));
}
