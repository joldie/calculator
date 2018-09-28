import React from 'react';
import ScaleText from "react-scale-text";
import './stylesheet.css';

// Maximum number of digits allowed in a single numeric value
const MaxSignificantDigits = 10;
// Maximum length of digits and symbols in formula to be evaluated
const MaxFormulaLength = 80;
// List of data for each button on the calculator
const buttonData = [{
    id: "clear",
    className: "button-left",
    value: "AC",
    onClick: "clear",
    keyCode: 8,
    shiftKey: false
}, {
    id: "plus-minus",
    className: "button-left",
    value: "±",
    onClick: "operator2",
    keyCode: 173,
    shiftKey: true
}, {
    id: "percentage",
    className: "button-left",
    value: "%",
    onClick: "operator2",
    keyCode: 53,
    shiftKey: true
}, {
    id: "divide",
    className: "button-right",
    value: "÷",
    onClick: "operator1",
    keyCode: 191,
    shiftKey: false
}, {
    id: "seven",
    className: "button-left",
    value: "7",
    onClick: "number",
    keyCode: 55,
    shiftKey: false
}, {
    id: "eight",
    className: "button-left",
    value: "8",
    onClick: "number",
    keyCode: 56,
    shiftKey: false
}, {
    id: "nine",
    className: "button-left",
    value: "9",
    onClick: "number",
    keyCode: 57,
    shiftKey: false
}, {
    id: "multiply",
    className: "button-right",
    value: "×",
    onClick: "operator1",
    keyCode: 56,
    shiftKey: true
}, {
    id: "four",
    className: "button-left",
    value: "4",
    onClick: "number",
    keyCode: 52,
    shiftKey: false
}, {
    id: "five",
    className: "button-left",
    value: "5",
    onClick: "number",
    keyCode: 53,
    shiftKey: false
}, {
    id: "six",
    className: "button-left",
    value: "6",
    onClick: "number",
    keyCode: 54,
    shiftKey: false
}, {
    id: "subtract",
    className: "button-right",
    value: "−",
    onClick: "operator1",
    keyCode: 173,
    shiftKey: false
}, {
    id: "one",
    className: "button-left",
    value: "1",
    onClick: "number",
    keyCode: 49,
    shiftKey: false
}, {
    id: "two",
    className: "button-left",
    value: "2",
    onClick: "number",
    keyCode: 50,
    shiftKey: false
}, {
    id: "three",
    className: "button-left",
    value: "3",
    onClick: "number",
    keyCode: 51,
    shiftKey: false
}, {
    id: "add",
    className: "button-right",
    value: "+",
    onClick: "operator1",
    keyCode: 61,
    shiftKey: true
}, {
    id: "zero",
    className: "button-left",
    value: "0",
    onClick: "number",
    keyCode: 48,
    shiftKey: false
}, {
    id: "decimal",
    className: "button-left",
    value: ".",
    onClick: "decimal",
    keyCode: 190,
    shiftKey: false
}, {
    id: "equals",
    className: "button-right",
    value: "=",
    onClick: "equals",
    keyCode: 13,
    shiftKey: false
}];

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: '',  // Save as string, not number, so can easily append digits
            previousValue: '', // Temporary store of value when error message flashes on screen
            currentFormula: '\u200B', // Unicode zero-width whitespace character used throughout to enforce word breaks as well as correct div heights at start of new formula
            previousFormula: '' // Temporary store of formula when error message flashes on screen
        }
        this.maxDigitWarning = this.maxDigitWarning.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleNumbers = this.handleNumbers.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handlePrimaryOperators = this.handlePrimaryOperators.bind(this);
        this.handleSecondaryOperators = this.handleSecondaryOperators.bind(this);
        this.handleEquals = this.handleEquals.bind(this);
    }

    evaluateMath(expr) {
        // Replace math symbols with JavaScript math operators, where necessary
        expr = String(expr).replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace('∞', 'Infinity').replace(/[\u200B]/g, '');
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

    maxDigitWarning() {
        this.setState({
            currentValue: 'Max Input Length',
            previousValue: this.state.currentValue,
            currentFormula: '',
            previousFormula: this.state.currentFormula
        });
        setTimeout(() => this.setState({
            currentValue: this.state.previousValue,
            currentFormula: this.state.previousFormula
        }), 1000);
    }

    handleClear(e) {
        // Clear current value, if it isn't null
        if (this.state.currentValue !== '') {
            this.setState({
                currentValue: ''
            });
        } else {
            // Otherwise clear screen completely
            this.setState({
                currentValue: '',
                currentFormula: '\u200B'
            });
        }
    }

    handleNumbers(e) {
        // If calculation result currently displayed, clicking a number starts a new formula
        if (/=/g.test(this.state.currentFormula)) {
            this.setState({
                currentValue: e.target.value,
                currentFormula: '\u200B'
            });
        }
        // Flash warning if user input for single value or whole expression too long
        else if (String(this.state.currentValue).replace(/[^0-9]/g, "").length >= MaxSignificantDigits ||
            String(this.state.currentValue).length + String(this.state.currentFormula).length >= MaxFormulaLength) {
            this.maxDigitWarning();
        }
        // Ignore input if current value is invalid (exponential, infinite, NaN)
        else if (String(this.state.currentValue).indexOf('e') === -1 &&
            String(this.state.currentValue).indexOf('∞') === -1 &&
            String(this.state.currentValue).indexOf('NaN') === -1) {
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
                        currentFormula + '(' + this.state.currentValue + ')\u200b' + e.target.value + '\u200b' :
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
                currentFormula: formula + '\u200b=\u200b'
            });
        }
    }

    render() {

        let displayValue, displayFormula;
        // Until a number has been pressed, display a zero on the screen
        this.state.currentValue === '' ?
            displayValue = '0' :
            displayValue = this.state.currentValue;
        // Display negative numbers in parantheses in formula screen for clarity
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
                    equals={this.handleEquals}
                    currentValue={this.state.currentValue} />
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
        let buttons = buttonData.map((buttonObj, i, buttonArray) => {
            return (
                <Button
                    id={buttonArray[i].id}
                    key={i}
                    className={buttonArray[i].className}
                    value={buttonArray[i].value}
                    onClick={this.props[buttonArray[i].onClick]}
                    keyCode={buttonArray[i].keyCode}
                    shiftKey={buttonArray[i].shiftKey}
                    clear={this.props.clear}
                    number={this.props.number}
                    decimal={this.props.decimal}
                    operator1={this.props.operator1}
                    operator2={this.props.operator2}
                    equals={this.props.equals}
                    currentValue={this.props.currentValue} />
            )
        });
        return (
            <div className="buttons">
                {buttons}
            </div>
        );
    }
}

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    handleKeyPress(e) {
        if (e.keyCode === this.props.keyCode && e.shiftKey === this.props.shiftKey) {
            e.target.value = document.getElementById(this.props.id).value;
            this.props.onClick(e);
        }
    }
    render() {
        let display = this.props.value;
        if (display === "±") { display = "⁺∕₋" }
        if (display === "AC" && this.props.currentValue !== "") { display = "C" }
        return (
            <button id={this.props.id}
                className={this.props.className}
                value={this.props.value}
                onClick={this.props.onClick} >{display}</button>
        )
    }
}

export default Calculator;
