import React from "react";
import { ACTIONS } from "./App";

function OperationButton({ operation, className, dispatch }) {
  return (
    <button
      className={className}
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: {operation} })
      }
    >
      {operation}
    </button>
  );
}

export default OperationButton;
