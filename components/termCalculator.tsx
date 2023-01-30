import * as math from "mathjs";
import { MathNode } from "mathjs";
import React from "react";

type Equation = {
    id: number;
    termA: string;
    termB: string;
    operation?: string;
}

export default function Calculator() {
    const [termA, setTermA] = React.useState<MathNode>();
    const [termAInputValue, setTermAInputValue] = React.useState<string>();
    const [termB, setTermB] = React.useState<MathNode>();
    const [termBInputValue, setTermBInputValue] = React.useState<string>();

    const emptyEquationHistory: Equation[] = [{id: 0, termA: "Term A", termB: "Term B"}];
    const [equationHistory, setEquationHistory] = React.useState<Equation[]>(emptyEquationHistory);

    const resetEquationHistory = () => {
        setEquationHistory(emptyEquationHistory)
        setOperationInput(undefined);
    }

    const [operationInput, setOperationInput] = React.useState<string>();

    React.useMemo(() => {
        if(equationHistory.length > 1 && operationInput) equationHistory[equationHistory.length - 1].operation = `| ${operationInput}`;
        if(termA?.toString() !== "undefined" && termB?.toString() !== "undefined") equationHistory.push({id: equationHistory.length, termA: termA?.toString() || "", termB: termB?.toString() || ""});
    }, [termA, termB])

    const calcEquation = () => {
        if(!operationInput || !termA || !termB) return;
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
    }

    return(
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2 items-center w-full">
                    <div>Term A:</div>
                    <input value={termAInputValue || ""} onChange={(e) => {setTermAInputValue(e.target.value)}} type="text" className="grow" />
                </div>
                <div className="flex gap-2 items-center w-full">
                    <div>Term B:</div>
                    <input value={termBInputValue || ""} onChange={(e) => {setTermBInputValue(e.target.value)}} type="text" className="grow" />
                </div>
                <i>Beachte <a href="https://mathjs.org/docs/expressions/syntax.html" target={"_blank"} rel={"noreferrer"}>Syntax</a></i>
                <button onClick={() => {resetEquationHistory(); setTermA(math.simplify(termAInputValue || "")); setTermB(math.simplify(termBInputValue || ""))}} type="button" className="btn w-full">Gleichung erzeugen</button>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="text-center">Gleichung lösen</h2>
                <table className="table-auto m-auto">
                    {equationHistory.map(e => {
                        if(e.termA !== "" && e.termB !== "") return (
                            <tr key={e.id}>
                                <td className="text-right">{e.termA}</td>
                                <td className="text-center">=</td>
                                <td>{e.termB}</td>
                                {e.operation && <td>{e.operation}</td>}
                            </tr>
                        );
                    })}
                </table>
            </div>
            <div className="flex gap-2">
                <input value={operationInput || ""} onChange={(e) => {setOperationInput(e.target.value)}} type="text" placeholder="+,-,*,/ operation" />
                <button onClick={calcEquation} type="button" className="btn">Anwenden</button>
            </div>
        </div>
    )
}
