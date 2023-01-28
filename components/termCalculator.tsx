import * as math from "mathjs";
import { MathNode } from "mathjs";
import React from "react";

type Equation = {
    id: number;
    termA: string;
    termB: string;
}

export default function Calculator() {
    const [termA, setTermA] = React.useState<MathNode>();
    const [termAInputValue, setTermAInputValue] = React.useState<string>();
    const [termB, setTermB] = React.useState<MathNode>();
    const [termBInputValue, setTermBInputValue] = React.useState<string>();

    const emptyEquationHistory: Equation[] = [{id: 0, termA: "Term A", termB: "Term B"}];
    const [equationHistory, setEquationHistory] = React.useState<Equation[]>(emptyEquationHistory);

    const resetEquationHistory = () => {
        const equation: Equation = {id: 1, termA: termA?.toString() || "", termB: termB?.toString() || ""};
        const newEquHis: Equation[] = emptyEquationHistory;
        newEquHis.push(equation)
        setEquationHistory(newEquHis);
    }

    const [operationInput, setOperationInput] = React.useState<string>();

    const updateEquationHistory = () => {
        const newEquHis: Equation[] = equationHistory;
        const newId = newEquHis[newEquHis.length - 1].id + 1;
        const equation: Equation = {id: newId, termA: termA?.toString() || "", termB: termB?.toString() || ""};
        newEquHis.push(equation);
        setEquationHistory(newEquHis);
    }

    const calcEquation = () => {
        if(!operationInput || !termA || !termB) return;
        console.log(operationInput)
        const value = math.parse(operationInput.slice(1, operationInput.length));
        switch (operationInput[0]) {
            case "+":
                setTermA(math.simplify(new math.OperatorNode('+', 'add', [termA, value])));
                setTermB(math.simplify(new math.OperatorNode('+', 'add', [termB, value])));
                break;
            case "-":
                setTermA(math.simplify(new math.OperatorNode("-", "subtract", [termA, value])));
                setTermB(math.simplify(new math.OperatorNode("-", "subtract", [termB, value])));
                break;
            case "/":
                setTermA(math.simplify(new math.OperatorNode("/", "divide", [termA, value])));
                setTermB(math.simplify(new math.OperatorNode("/", "divide", [termB, value])));
                break;
            case "*":
                setTermA(math.simplify(new math.OperatorNode("*","multiply", [termA, value])));
                setTermB(math.simplify(new math.OperatorNode("*","multiply", [termB, value])));
                break;
        }
        console.log(termA)
        updateEquationHistory();
    }

    return(
        <>
            <div>
                <span>Term A:</span>
                <input value={termAInputValue || ""} onChange={(e) => {setTermAInputValue(e.target.value)}} onBlur={(e) => {setTermA(math.simplify(e.target.value || ""))}} />
            </div>
            <div>
                <span>Term B:</span>
                <input value={termBInputValue || ""} onChange={(e) => {setTermBInputValue(e.target.value)}} onBlur={(e) => {setTermB(math.simplify(e.target.value || ""))}} />
            </div>
            <div>Beachte <a href="https://mathjs.org/docs/expressions/syntax.html" target={"_blank"} rel={"noreferrer"}>Syntax</a></div>
            <button onClick={resetEquationHistory}>Update</button>
            <h2>Gleichung lösen</h2>
            <div className="text-center">
                {equationHistory.map(e => {
                    if(e.termA !== "" && e.termB !== "") return (
                        <div key={e.id}>{e.termA + " = " + e.termB}</div>
                    );
                })}
            </div>
            <input value={operationInput || ""} onChange={(e) => {setOperationInput(e.target.value)}} placeholder="+,-,*,/ operation" />
            <button onClick={calcEquation}>Anwenden</button>
        </>
    )
}
