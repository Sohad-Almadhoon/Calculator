import React, { useReducer } from "react";
import "./App.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELETE_DIGIT: "delete-digit",
  CLEAR: "clear",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currOperand === "0") return state;
      if (payload.digit === '.' && !state.currOperand)
        return {
          ...state,
          currOperand: '0.',
        };
      if (payload.digit === "." && state.currOperand.includes("."))
        return state;
      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currOperand == null && state.prevOperand == null) return state;
      if (state.prevOperand == null) {
        return {
          ...state,
          prevOperand: state.currOperand,
          operation: payload.operation,
          currOperand: null,
        };
      }
      if (state.currOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.operation == null &&
        state.prevOperand == null &&
        state.currOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        prevOperand: null,
        operation: null,
        overwrite: true,
        currOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currOperand: null,
          overwrite: false,
        };
      }
      if (state.currOperand == null) return state;
      if (state.currOperand.length === 1) return {};
      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1),
      };
      
    default:
      return state;
  }
}
function evaluate(state) {
  const curr = parseFloat(state.currOperand);
  const prev = parseFloat(state.prevOperand);
  const operation = state.operation;
  if (isNaN(prev) || isNaN(curr)) return "";
  let result = "";
  switch (operation) {
    case "+":
      result = curr + prev;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "÷":
      result = prev / curr;
      break;
    default:
      break;
  }
  return result.toString();
}
const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperator(operand) {
  if (operand == null) return;
  const [digit, decimal] = operand.split(".");
  if (decimal == null) {
    return INTEGER_FORMATER.format(digit);
  }
  return `${INTEGER_FORMATER.format(digit)}.${decimal}`;
}
function App() {
  const [{ currOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div>
      <h1 className="header">My Calculator</h1>
      <div className="result">
        <div className="prev-operation">
          {formatOperator(prevOperand)}
          {operation}
        </div>
        <div className="curr-operation">{formatOperator(currOperand)}</div>
      </div>
      <div className="buttons">
        <button
          className="span clear"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button
          style={{ backgroundColor: "#2F86A6", color: "#fff" }}
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
        >
          DEL
        </button>
        <OperationButton className="black" operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton className="black" operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton className="black" operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton className="black" operation="-" dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <button
          className="span red"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >=</button>
      </div>
    </div>
  );
}

export default App;
