import React from 'react';
import './stylesheet.css';

// TODO:
// - Enforce max length of inputs:
//     const maxIndividualValueLength = 10 (for example)
//     const maxFormulaLength = 50 (for example)
// - Reduce font size as input length grows, so that screen must not resize
// - Implement a "C" clear button to clear current value, not just "AC",
//     which clears all

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: '0',  // Save as string, not number, so can also display operators, etc.
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
        // Check if input too long. If so -> flash warning and ignore input
        // ...
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
            // If last digit a decimal point, ignore.
            // Otherwise, append to end of current value and formula
            // ...
            // If before any other numbers, add leading zero
            // ...
        });
    }

    handleOperators(e) {
        this.setState({
            // If plus-minus, invert sign of current value
            // ...
            // Else if percentage, divide current value by 100
            // ...
            // Else, deal with 4 standard math operators
            // ...
        });
    }

    handleEquals(e) {
        this.setState({
            // If last button was also an equals, ignore input
            // ...
            // Otherwise, evaluate expression in current formula field and display result
            // ...
        });
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
                <button id="plus-minus" className="button-left" value="⁺∕₋" onClick={this.props.operator}>⁺∕₋</button>
                <button id="percentage" className="button-left" value="%" onClick={this.props.operator}>%</button>
                <button id="divide" className="button-right" value="÷">÷</button>
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
