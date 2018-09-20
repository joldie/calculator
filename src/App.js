import React from 'react';
import './stylesheet.css';

class Calculator extends React.Component {
  render() {
    return (
      <div className="calculator">
        <Screen />
        <Buttons />
      </div>
    );
  }
}

class Screen extends React.Component {
  render() {
    return (
      <div className="screen">
        <div id="formula-display" className="display"></div>
        <div id="display" className="display">0</div>
      </div>
    );
  }
}

class Buttons extends React.Component {
  render() {
    return (
      <div className="buttons">
        <button id="clear" className="button-left" value="AC">AC</button>
        <button id="plus-minus" className="button-left" value="±">±</button>
        <button id="percentage" className="button-left" value="%">%</button>
        <button id="divide" className="button-right" value="÷">÷</button>
        <button id="seven" className="button-left" value="7">7</button>
        <button id="eight" className="button-left" value="8">8</button>
        <button id="nine" className="button-left" value="9">9</button>
        <button id="multiply" className="button-right" value="x">x</button>
        <button id="four" className="button-left" value="4">4</button>
        <button id="five" className="button-left" value="5">5</button>
        <button id="six" className="button-left" value="6">6</button>
        <button id="subtract" className="button-right" value="-">-</button>
        <button id="one" className="button-left" value="1">1</button>
        <button id="two" className="button-left" value="2">2</button>
        <button id="three" className="button-left" value="3">3</button>
        <button id="add" className="button-right" value="+">+</button>
        <button id="zero" className="button-left" value="0">0</button>
        <button id="decimal" className="button-left" value=".">.</button>
        <button id="equals" className="button-right" value="=">=</button>
      </div>
    );
  }

}

export default Calculator;
