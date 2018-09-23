import React from 'react';
import './stylesheet.css';

// TODO:
// - Bug: Adding decimal point to negative value doesn't work in formula screen: e.g. (-123).45 
// - Enforce max length of inputs (flash warning to user, ignore further input):
//     const maxIndividualValueLength = 10 (for example)
//     const maxFormulaLength = 50 (for example)
// - Reduce font size as input length grows, so that screen must not resize
// - Implement a "C" clear button to clear current value, not just "AC",
//     which clears all

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: '0',  // Save as string, not number, so can easily append digits
            currentFormula: ''
        }
        this.handleClear = this.handleClear.bind(this);
        this.handleNumbers = this.handleNumbers.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handleOperators = this.handleOperators.bind(this);
        this.handleEquals = this.handleEquals.bind(this);
    }

    handleClear(e) {
        this.setState({
            currentValue: '0',
            currentFormula: ''
        });
    }

    handleNumbers(e) {
        // Concatenate new digits on end of current value and formula
        this.setState({
            currentValue:
                this.state.currentValue === '0' ?
                    e.target.value : this.state.currentValue + e.target.value,
            currentFormula:
                this.state.currentValue === '0' && e.target.value === '0' ?
                    this.state.currentFormula : this.state.currentFormula + e.target.value
        });
    }

    handleDecimal(e) {
        this.setState({
            // If current value already includes a decimal point, ignore input.
            // Otherwise, concatenate it on the end.
            currentValue:
                /\./g.test(this.state.currentValue) ?
                    this.state.currentValue : this.state.currentValue + ".",
            currentFormula:
                this.state.currentValue === '0' ?
                    this.state.currentFormula + '0.' :
                    /\./g.test(this.state.currentValue) ?
                        this.state.currentFormula : this.state.currentFormula + "."
        });
    }

    handleOperators(e) {
        let currentValue, currentFormula;
        // If calculation result currently shown, clear old formula and start
        // calculating again with previous result value.
        if (/=/g.test(this.state.currentFormula)) {
            currentValue = String(this.state.currentValue);
            currentFormula = String(this.state.currentValue);
        } else {
            currentValue = this.state.currentValue;
            currentFormula = this.state.currentFormula;
        }
        if (e.target.value === '±') {
            // Only negate non-zero values
            if (currentValue !== '0') {
                // Find current number in formula and split formula into start and
                // end sections for later processing
                let regexpResult = /\(?-?[0-9.]+\)?$/.exec(currentFormula);
                let formulaStart = currentFormula.substr(0, regexpResult.index);
                let formulaEnd = regexpResult[0];
                this.setState({
                    // Negate current numeric value
                    currentValue:
                        eval(currentValue * -1),
                    currentFormula:
                        formulaEnd.substr(0, 2) === '(-' && formulaEnd.slice(-1) === ')' ?
                            formulaStart + formulaEnd.substring(2, formulaEnd.length - 1) :
                            formulaStart + '(-' + formulaEnd + ')'
                });
            }
        } else if (e.target.value === '%') {
            // ...
        } else {
            this.setState({
                currentFormula:
                    currentFormula + e.target.value,
                currentValue:
                    '0'
            });
        }
    }

    handleEquals(e) {
        // If calculation result currently shown, ignore further clicks on equals button
        if (!/=/g.test(this.state.currentFormula)) {
            // Otherwise, evaluate expression in current formula field and display result
            let formula = this.state.currentFormula;
            // Replace math symbols with JavaScript math operators, where necessary
            formula = formula.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
            let result = eval(formula);
            this.setState({
                currentValue: result,
                currentFormula: this.state.currentFormula + "=" + result
            });
        }
    }

    render() {
        return (
            <div className="calculator">
                <Screen currentFormula={this.state.currentFormula}
                    currentValue={this.state.currentValue} />
                <Buttons clear={this.handleClear}
                    number={this.handleNumbers}
                    decimal={this.handleDecimal}
                    operator={this.handleOperators}
                    equals={this.handleEquals} />
            </div>
        );
    }
}

class Screen extends React.Component {
    render() {
        return (
            <div className="screen">
                <div id="upper-screen" className="display">
                    <TitleBarButtons />
                    <div id="formula-display">{this.props.currentFormula}</div>
                </div>
                <div id="display" className="display">{this.props.currentValue}</div>
            </div>
        );
    }
}

class TitleBarButtons extends React.Component {
    render() {
        return (
            <div>
                <div id="red-button" className="title-bar-button"></div>
                <div id="yellow-button" className="title-bar-button"></div>
                <div id="green-button" className="title-bar-button"></div>
            </div>
        );
    }
}

class Buttons extends React.Component {
    render() {
        return (
            <div className="buttons">
                <button id="clear" className="button-left" value="AC" onClick={this.props.clear}>AC</button>
                <button id="plus-minus" className="button-left" value="±" onClick={this.props.operator}>⁺∕₋</button>
                <button id="percentage" className="button-left" value="%" onClick={this.props.operator}>%</button>
                <button id="divide" className="button-right" value="÷" onClick={this.props.operator}>÷</button>
                <button id="seven" className="button-left" value="7" onClick={this.props.number}>7</button>
                <button id="eight" className="button-left" value="8" onClick={this.props.number}>8</button>
                <button id="nine" className="button-left" value="9" onClick={this.props.number}>9</button>
                <button id="multiply" className="button-right" value="×" onClick={this.props.operator}>×</button>
                <button id="four" className="button-left" value="4" onClick={this.props.number}>4</button>
                <button id="five" className="button-left" value="5" onClick={this.props.number}>5</button>
                <button id="six" className="button-left" value="6" onClick={this.props.number}>6</button>
                <button id="subtract" className="button-right" value="−" onClick={this.props.operator}>−</button>
                <button id="one" className="button-left" value="1" onClick={this.props.number}>1</button>
                <button id="two" className="button-left" value="2" onClick={this.props.number}>2</button>
                <button id="three" className="button-left" value="3" onClick={this.props.number}>3</button>
                <button id="add" className="button-right" value="+" onClick={this.props.operator}>+</button>
                <button id="zero" className="button-left" value="0" onClick={this.props.number}>
                    <div id="zero-label">0</div>
                </button>
                <button id="decimal" className="button-left" value="." onClick={this.props.decimal}>.</button>
                <button id="equals" className="button-right" value="=" onClick={this.props.equals}>=</button>
            </div>
        );
    }
}

export default Calculator;
