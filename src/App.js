import React from 'react';
import ScaleText from "react-scale-text";
import './stylesheet.css';

// TODO:
// - Implement keyboard binding to buttons
// - Flash warning to user when max input length exceeded
// - Implement a "C" clear button to clear current value, not just "AC",
//     which clears all
// - Setup tests for code (expected output from button presses, etc)

// Maximum number of digits allowed in a single numeric value
const MaxSignificantDigits = 10;
// Maximum length of digits and symbols in formula to be evaluated
const MaxFormulaLength = 80;

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: '',  // Save as string, not number, so can easily append digits
            currentFormula: '\u200B' // Unicode zero-width whitespace character used throughout to enforce word breaks as well as correct div heights at start of new formula
        }
        this.handleClear = this.handleClear.bind(this);
        this.handleNumbers = this.handleNumbers.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handlePrimaryOperators = this.handlePrimaryOperators.bind(this);
        this.handleSecondaryOperators = this.handleSecondaryOperators.bind(this);
        this.handleEquals = this.handleEquals.bind(this);
    }

    evaluateMath(expr) {
        console.log(expr);
        // Replace math symbols with JavaScript math operators, where necessary
        expr = String(expr).replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace('∞', 'Infinity').replace(/[\u200B]/g, '');
        console.log(expr);
        // Evaluate and round result
        let result = Math.round(1000000000000 * eval(expr)) / 1000000000000;
        result = result.toPrecision(MaxSignificantDigits);
        // Remove trailing zeroes in decimal values, ignoring exponential numbers,
        // and decimal point itself, if necessary
        if (result.indexOf('.') !== -1 && result.indexOf('e') === -1) {
            result = result.replace(/0+$/, "");
            if (result.slice(-1) === '.') {
                result = result.slice(0, -1);
            }
        }
        // Return result, replacing Infinity text to math symbol
        return String(result).replace('Infinity', '∞');
    }

    handleClear(e) {
        this.setState({
            currentValue: '',
            currentFormula: '\u200B'
        });
    }

    handleNumbers(e) {
        // If calculation result currently displayed, clicking a number starts a new formula
        if (/=/g.test(this.state.currentFormula)) {
            this.setState({
                currentValue: e.target.value,
                currentFormula: '\u200B'
            });
        }
        // Ignore input if current value is invalid (exponential, infinite, NaN or too long)
        // or total length of formula too long
        else if (String(this.state.currentValue).indexOf('e') === -1 &&
            String(this.state.currentValue).indexOf('∞') === -1 &&
            String(this.state.currentValue).indexOf('NaN') === -1 &&
            String(this.state.currentValue).replace(/[^0-9]/g, "").length < MaxSignificantDigits &&
            String(this.state.currentValue).length + String(this.state.currentFormula).length < MaxFormulaLength) {
            // Otherwise, if current value not infinite, concatenate new digits on end
            this.setState({
                currentValue:
                    this.state.currentValue === '0' ?
                        e.target.value : this.state.currentValue + e.target.value,
            });
        }
    }

    handleDecimal(e) {
        // If calculation result currently displayed, clicking decimal starts a new formula
        if (/=/g.test(this.state.currentFormula)) {
            this.setState({
                currentValue: '0.',
                currentFormula: '\u200B'
            });
        }
        // Ignore input if current value is invalid (exponential, infinite, NaN)
        else if (String(this.state.currentValue).indexOf('e') === -1 &&
            String(this.state.currentValue).indexOf('∞') === -1 &&
            String(this.state.currentValue).indexOf('NaN') === -1) {
            this.setState({
                // If current value already includes a decimal point, ignore input.
                // Otherwise, concatenate it on the end.
                currentValue:
                    /\./g.test(this.state.currentValue) ?
                        this.state.currentValue :
                        this.state.currentValue === '' ?
                            this.state.currentValue + "0." : // Add leading zero, e.g. display "0.1" instead of ".1"
                            this.state.currentValue + "."
            });
        }
    }

    handlePrimaryOperators(e) {
        let currentFormula;
        // If calculation result currently shown, clear old formula and start
        // calculating again with previous result value.
        if (/=/g.test(this.state.currentFormula)) {
            currentFormula = '\u200B';
        } else {
            currentFormula = this.state.currentFormula;
        }
        // Only add new operator onto end of formula if none yet there
        if (this.state.currentValue !== '') {
            this.setState({
                currentFormula:
                    String(this.state.currentValue)[0] === '-' ?
                        currentFormula + '(' + this.state.currentValue + ')' + '\u200b' + e.target.value + '\u200b' :
                        currentFormula + this.state.currentValue + '\u200b' + e.target.value + '\u200b',
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
                currentFormula: '\u200B'
            });
        }
        // Only perform operations on non-zero values
        if (this.state.currentValue !== '' && this.evaluateMath(this.state.currentValue) !== 0) {
            if (e.target.value === '±') {
                this.setState({
                    // Negate current numeric value
                    // String used for multiplication to cater for infinity value
                    currentValue: this.evaluateMath(this.state.currentValue + ' * -1'),
                });
            } else if (e.target.value === '%') {
                // Ignore infinite values
                if (String(this.state.currentValue).indexOf('∞') === -1) {
                    let result = this.evaluateMath(this.state.currentValue / 100);
                    this.setState({
                        // Divide current numeric value by 100
                        currentValue: result
                    });
                }
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
                currentFormula: formula + '\u200b' + '=' + '\u200b'
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
                    <p id="formula-display">{this.props.currentFormula}</p>
                </div>
                <div id="display" className="display">
                    <ScaleText>
                        <p>{this.props.currentValue}</p>
                    </ScaleText>
                </div>
            </div>
        );
    }
}

class TitleBarButtons extends React.Component {
    render() {
        return (
            <div className="title-bar-buttons">
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
