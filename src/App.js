import React from 'react';
import './stylesheet.css';

// TODO:
// - Need to deal with Infinity output
// - Implement keyboard binding to buttons
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
            currentValue: '',  // Save as string, not number, so can easily append digits
            currentFormula: ''
        }
        this.handleClear = this.handleClear.bind(this);
        this.handleNumbers = this.handleNumbers.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handlePrimaryOperators = this.handlePrimaryOperators.bind(this);
        this.handleSecondaryOperators = this.handleSecondaryOperators.bind(this);
        this.handleEquals = this.handleEquals.bind(this);
    }

    evaluateMath(expr) {
        // Replace math symbols with JavaScript math operators, where necessary
        expr = String(expr).replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
        // Evaluate and round result
        return Math.round(1000000000000 * eval(expr)) / 1000000000000;
    }

    handleClear(e) {
        this.setState({
            currentValue: '',
            currentFormula: ''
        });
    }

    handleNumbers(e) {
        // If calculation result currently displayed, clicking a number starts a new formula
        if (/=/g.test(this.state.currentFormula)) {
            this.setState({
                currentValue: e.target.value,
                currentFormula: ''
            });
        } else {
            // Otherwise, concatenate new digits on end of current value
            this.setState({
                currentValue:
                    this.state.currentValue === '0' ?
                        e.target.value : this.state.currentValue + e.target.value,
            });
        }
    }

    handleDecimal(e) {
        // If exponential number (e.g. 1e-5) showing, ignore decimal button input
        if (String(this.state.currentValue).indexOf('e') === -1) {
            // If calculation result currently displayed, clicking decimal starts a new formula
            if (/=/g.test(this.state.currentFormula)) {
                this.setState({
                    currentValue: '0.',
                    currentFormula: ''
                });
            } else {
                this.setState({
                    // If current value already includes a decimal point, ignore input.
                    // Otherwise, concatenate it on the end.
                    currentValue:
                        /\./g.test(this.state.currentValue) ?
                            this.state.currentValue :
                            this.state.currentValue === '' ?
                                this.state.currentValue + "0." : // Add leading zero, e.g. "0.1" instead of ".1"
                                this.state.currentValue + "."
                });
            }
        }
    }

    handlePrimaryOperators(e) {
        let currentFormula;
        // If calculation result currently shown, clear old formula and start
        // calculating again with previous result value.
        if (/=/g.test(this.state.currentFormula)) {
            currentFormula = '';
        } else {
            currentFormula = this.state.currentFormula;
        }
        // Only add new operator onto end of formula if none yet there
        if (this.state.currentValue !== '') {
            this.setState({
                currentFormula:
                    String(this.state.currentValue)[0] === '-' ?
                        currentFormula + '(' + this.state.currentValue + ')' + e.target.value :
                        currentFormula + this.state.currentValue + e.target.value,
                currentValue:
                    ''
            });
        }
    }

    handleSecondaryOperators(e) {
        // If calculation result currently displayed, clicking a secondary operator
        // applies operation to result and clears formula
        if (/=/g.test(this.state.currentFormula)) {
            this.setState({
                currentFormula: ''
            });
        }
        // Only perform operations on non-zero values
        if (this.state.currentValue !== '' && eval(this.state.currentValue) !== 0) {
            if (e.target.value === '±') {
                this.setState({
                    // Negate current numeric value
                    currentValue: eval(this.state.currentValue * -1),
                });
            } else if (e.target.value === '%') {
                let result = this.evaluateMath(this.state.currentValue / 100);
                this.setState({
                    // Divide current numeric value by 100
                    currentValue: result
                });
            }
        }
    }

    handleEquals(e) {
        // If calculation result currently shown or formula is incomplete (i.e.
        // an operator on end), ignore click on equals button
        if ((!/=/g.test(this.state.currentFormula)) && this.state.currentValue !== '') {
            // Otherwise, evaluate expression in current formula field and display result
            let formula;
            String(this.state.currentValue)[0] === '-' ?
                formula = this.state.currentFormula + '(' + this.state.currentValue + ')' :
                formula = this.state.currentFormula + this.state.currentValue
            let result = this.evaluateMath(formula);
            this.setState({
                currentValue: result,
                currentFormula: formula + '='
            });
        }
    }

    render() {

        let displayValue, displayFormula;
        // Until a number has been pressed, display a zero on the screen
        this.state.currentValue === '' ?
            displayValue = '0' :
            displayValue = this.state.currentValue;
        // Display negative numbers in paranthese in formula screen for clarity
        String(this.state.currentValue)[0] === '-' ?
            displayFormula = this.state.currentFormula + '(' + this.state.currentValue + ')' :
            displayFormula = this.state.currentFormula + this.state.currentValue;

        return (
            <div className="calculator">
                <Screen currentFormula={displayFormula}
                    currentValue={displayValue} />
                <Buttons clear={this.handleClear}
                    number={this.handleNumbers}
                    decimal={this.handleDecimal}
                    operator1={this.handlePrimaryOperators}
                    operator2={this.handleSecondaryOperators}
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
                <button id="plus-minus" className="button-left" value="±" onClick={this.props.operator2}>⁺∕₋</button>
                <button id="percentage" className="button-left" value="%" onClick={this.props.operator2}>%</button>
                <button id="divide" className="button-right" value="÷" onClick={this.props.operator1}>÷</button>
                <button id="seven" className="button-left" value="7" onClick={this.props.number}>7</button>
                <button id="eight" className="button-left" value="8" onClick={this.props.number}>8</button>
                <button id="nine" className="button-left" value="9" onClick={this.props.number}>9</button>
                <button id="multiply" className="button-right" value="×" onClick={this.props.operator1}>×</button>
                <button id="four" className="button-left" value="4" onClick={this.props.number}>4</button>
                <button id="five" className="button-left" value="5" onClick={this.props.number}>5</button>
                <button id="six" className="button-left" value="6" onClick={this.props.number}>6</button>
                <button id="subtract" className="button-right" value="−" onClick={this.props.operator1}>−</button>
                <button id="one" className="button-left" value="1" onClick={this.props.number}>1</button>
                <button id="two" className="button-left" value="2" onClick={this.props.number}>2</button>
                <button id="three" className="button-left" value="3" onClick={this.props.number}>3</button>
                <button id="add" className="button-right" value="+" onClick={this.props.operator1}>+</button>
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
