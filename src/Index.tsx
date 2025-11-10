import { useEffect, useState } from "react";
import { MET } from "./MET";

export function Index ( props ) {

  const { i,
          cursor,
          line,
          stack,
          output,
          onDo,
          style  } = props;

  const isSomethingOf = (domain) => (line) => (
    line.length > 0 && domain.indexOf(line[0]) != -1
  );

  const isInternalNode = isSomethingOf("+-*%");
  const isArc          = isSomethingOf("/\\");
  const isLeafNode     = isSomethingOf("0123456789");

  const hasCompleteSigns = (stack) => (
    stack.length > 2 && isInternalNode(stack[stack.length-3])
    && stack[stack.length-2] == "/" && stack[stack.length-1] == "\\"
  );

  const isEnding = (line, stack, output) => (
    line.length == 0 && stack.length == 0 && output.length > 0
  );

  const determineState = () => {
    if ( isEnding (line, stack, output) ) return MET.END_OF_PROCEDURE;
    else if ( line.length == 0 )          return MET.MET_NULL;
    else if ( isInternalNode(line[0]) )   return MET.MET_INTERNAL_NODE;
    else if ( isArc(line[0]) ) {
      if ( hasCompleteSigns(stack) )      return MET.MET_ARC_WITH_CX;
      else                                return MET.MET_ARC;
    }
    else if ( isLeafNode(line[0]) ) {
      if ( hasCompleteSigns(stack) )      return MET.MET_LEAF_NODE_WITH_CX;
      else                                return MET.MET_LEAF_NODE;
    }
  };

  const [met, setMet] = useState (determineState());

  const getDescription = (state) => {
    switch (state) {
      case MET.MET_NULL:              return "讀不到資料則將堆疊收尾到輸出。";
      break;
      case MET.MET_INTERNAL_NODE:     return `遇到符號 ${line[0]} 則堆疊 ${line[0]} 並往下移動一步。`;
      break;
      case MET.MET_ARC_WITH_CX:       return `遇到 ${line[0]} 且堆疊有 ${stack[stack.length-3]} ${stack[stack.length-2]} ${stack[stack.length-1]} 則輸出堆疊的 ${stack[stack.length-3]} 並往上移動二步。`;
      break;
      case MET.MET_ARC:               return `遇到 ${line[0]} 則堆疊 ${line[0]} 並往下移動一步。`;
      break;
      case MET.MET_LEAF_NODE_WITH_CX: return `遇到 ${line[0]} 且堆疊有 ${stack[stack.length-3]} ${stack[stack.length-2]} ${stack[stack.length-1]} 則輸出 ${line[0]}、輸出 ${stack[stack.length-3]} 並往上移動三步。`;
      break;
      case MET.MET_LEAF_NODE:         return `遇到 ${line[0]} 則輸出 ${line[0]} 並往上移動一步。`;
      break;
      case MET.END_OF_PROCEDURE:      return "演算完畢，接著求值。";
      break;
      default:
      break;
    }
  };

  return (
  i == cursor
  ? <div className="index" style={style}>
      <p>{getDescription(determineState())}</p>
      <button onClick={() => onDo(determineState())}>
        執行
      </button>
    </div>
  : <div className="index" style={style}>
      &nbsp;
    </div>
  );
}