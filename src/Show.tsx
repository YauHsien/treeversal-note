import { useState } from "react";
import { Index } from "./Index";
import { MET } from "./MET";

export function Show ( props ) {

  const { tree } = props;
  
  const buildTree = (tree) =>
    tree.split('\n').map((x)=>x.match(/[^ ]+/g));

  const tree_o = buildTree(tree);

  const [file, setFile] = useState( tree_o );
  const [stack, setStack] = useState( [] );
  const [output, setOutput] = useState( [] );
  const [cursor, setCursor] = useState(0);
  const [result, setResult] = useState(null);

  const eval_result = () => {
    let stack = [];
    let output_d = [... output];
    const isOp = (a) => ( "+-*%".indexOf(a) != -1 );
    const op = (operator, a, b) => {
      switch (operator) {
      case "+":  return ( a + b );
      break;
      case "-":  return ( a - b );
      break;
      case "*":  return ( a * b );
      break;
      case "%":  return ( a / b );
      break;
      default:   return null;
      break;
      }
    };
    while (output_d.length > 0) {
      console.log(output_d);
      let a = output_d.shift();
      if ( isOp (a) ) {
        let b = stack.pop();
        stack.push( op(a, parseFloat(stack.pop()), parseFloat(b)) );
      }
      else
        stack.push( a );
      console.log(stack);
    }
    setResult( stack[0] );
  };

  const doAction = (cursor, line, stack, output) => (met) => {
    switch (met) {
      case MET.MET_NULL:              // 讀不到資料則將堆疊收尾到輸出。
        while (stack.length > 0) {
          stack.pop(), stack.pop();
          output.push( stack.pop() );
        }
        setCursor(0);
      break;
      case MET.MET_INTERNAL_NODE:     // 遇到符號 + 或 - 或 * 或 % 則堆疊 ${line[0]} 並往下移動一步。
        stack.push( line.shift() );
        setCursor(1 + cursor);
      break;
      case MET.MET_ARC_WITH_CX:       // 遇到 / 或 \ 且堆疊有 ${stack[L-3]} ${stack[L-2]} ${stack[L-1]} 則輸出堆疊的 ${stack[2]} 並往上移動二步。
        stack.pop(), stack.pop();
        output.push( stack.pop() );
        setCursor(cursor - 2);
      break;
      case MET.MET_ARC:               // 遇到 / 或 \ 則堆疊 ${line[0]} 並往下移動一步。
        stack.push( line.shift() );
        setCursor(1 + cursor);
      break;
      case MET.MET_LEAF_NODE_WITH_CX: // 遇到 ${line[0]} 且堆疊有 ${stack[L-3]} ${stack[L-2]} ${stack[L-1]} 則輸出 ${line[0]}、輸出 ${stack[2]} 並往上移動三步。
        output.push( line.shift() );
        stack.pop(), stack.pop();
        output.push( stack.pop() );
        setCursor(cursor - 3);
      break;
      case MET.MET_LEAF_NODE:         // 遇到 ${line[0]} 則輸出 ${line[0]} 並往上移動一步。
        output.push( line.shift() );
        setCursor(cursor - 1);
      break;
      case MET.END_OF_PROCEDURE:      // 演算完畢，接著求值。
        setCursor(-1);
        eval_result ();
      break;
      default:
      break;
    }
  };

  return (
  <div style={{display: "flex"}}>
    <div>
    { tree_o.map((line, i) => <div key={`s${i}`}>{
        " " + line.join(" ") + " "
      }</div>) }
    </div>
    <div className="rows">
    { file.map((line, i) =>
          <div key={`r${i}`} className="endpoint-row">
            <Index key={`x${i}`} i={i} cursor={cursor}
                   line={line} stack={stack} output={output}
                   onDo={doAction(cursor, line, stack, output)}
                   style={{width: "50%"}} />
            <div className="line" style={{float: "left", width: "50%"}}>
              <ul className="endpoint-row">
                 { line.map((term, i) => <li key={`l${i}`} style={{listStyle: "none"}}>{term}</li>) }
              </ul>
            </div>
          </div>
      )
    }
      <div className="endpoint-row">
        <span style={{textWrap: "nowrap"}}>
          堆疊
        </span>
        <div className="endpoint-row">
                { stack.map((term, i) => <li style={{listStyle: "none"}}>{term}</li>) }
        </div>
      </div>
      <div className="endpoint-row">
        <span style={{textWrap: "nowrap"}}>
          輸出
        </span>
        <div className="endpoint-row">
                { output.map((term, i) => <li style={{listStyle: "none"}}>{term}</li>) }
        </div>
      </div>
      <div className="endpoint-row">
        <span style={{textWrap: "nowrap"}}>
          求值
        </span>
        <div className="endpoint-row">
                { result }
        </div>
      </div>
    </div>
  </div>
  );
}