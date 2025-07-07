import React, { useState } from 'react';
import './App.css';

/**
 * CalculatorButton component – renders a button with minimalistic style and proper coloring.
 */
function CalculatorButton({ children, onClick, type = "default", ariaLabel, tabIndex }) {
  // Coloring styles by type (accent, primary, secondary, control)
  let style = {};
  switch (type) {
    case 'accent':
      style = { backgroundColor: '#ffb300', color: '#fff' };
      break;
    case 'primary':
      style = { backgroundColor: '#1976d2', color: '#fff' };
      break;
    case 'secondary':
      style = { backgroundColor: '#424242', color: '#fff' };
      break;
    case 'control':
      style = { backgroundColor: '#e0e0e0', color: '#282c34' };
      break;
    default:
      style = { backgroundColor: '#f8f9fa', color: '#282c34' };
  }
  return (
    <button
      className="calculator-btn"
      onClick={onClick}
      style={style}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
    >
      {children}
    </button>
  );
}

// PUBLIC_INTERFACE
/**
 * App – main calculator UI, state, and logic.
 */
function App() {
  // Calculation and result state
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  // Allowed operators for calculator
  const operators = ['+', '-', '×', '÷'];

  // PUBLIC_INTERFACE
  /**
   * Handles pressing number or operator buttons.
   * Only valid arithmetic input patterns are appended to the expression.
   */
  const handleButtonClick = (val) => {
    // Prevent two operators in a row, no leading operator except minus for negative
    if (operators.includes(val)) {
      if (expression === '' && val !== '-') return;
      if (operators.includes(expression.slice(-1))) {
        // Allow replacing an operator
        setExpression(expression.slice(0, -1) + val);
        return;
      }
    }
    // Limit input length to reasonable amount
    if (expression.length >= 32) return;

    setExpression(expression + val);
  };

  // PUBLIC_INTERFACE
  /**
   * Clears the input and result.
   */
  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  // PUBLIC_INTERFACE
  /**
   * Deletes last character from input.
   */
  const handleDelete = () => {
    setExpression(expr => expr.slice(0, -1));
    setResult('');
  };

  // PUBLIC_INTERFACE
  /**
   * Handles calculation of the result when '=' is pressed.
   */
  const handleEquals = () => {
    if (!expression) return;
    let safeExpr = expression.replace(/×/g, '*').replace(/÷/g, '/');
    // Don't end with an operator
    let evalExpr = safeExpr.replace(/[\+\-\*\/]$/, '');
    try {
      // eslint-disable-next-line no-eval
      let evalResult = eval(evalExpr);
      if (typeof evalResult === 'number' && isFinite(evalResult)) {
        setResult(Number(evalResult.toFixed(10)).toString());
      } else {
        setResult('Error');
      }
    } catch {
      setResult('Error');
    }
  };

  /**
   * Handles keyboard input on the calculator.
   */
  const handleKeyDown = (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      handleButtonClick(e.key);
    }
    if (['+', '-', '*', '/', 'x', 'X', '÷'].includes(e.key)) {
      let op = e.key === '*' || e.key === 'x' || e.key === 'X' ? '×'
        : e.key === '/' || e.key === '÷' ? '÷'
        : e.key;
      handleButtonClick(op);
    }
    if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      handleEquals();
    }
    if (e.key === 'Backspace') {
      handleDelete();
    }
    if (e.key === 'Delete') {
      handleClear();
    }
    // Prevent other keys
    if (!/[\d\+\-\*\/xX÷.=]|Enter|Backspace|Delete/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="App" tabIndex={0} onKeyDown={handleKeyDown} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div className="calculator-container" style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 16px rgba(33, 36, 43, 0.08)',
        padding: '2.5rem 1rem',
        maxWidth: 340,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '1.2rem',
        minHeight: 464
      }}>
        {/* Display */}
        <div className="calculator-display" aria-label="Calculator display" style={{
          background: '#f8fafb',
          minHeight: 56,
          borderRadius: 8,
          marginBottom: 12,
          padding: '0.5rem 1rem',
          textAlign: 'right',
          fontSize: 24,
          color: '#282c34',
          border: '1px solid #eaeaea',
          fontFamily: 'monospace',
          wordBreak: 'break-all',
          userSelect: 'all'
        }}>
          <div style={{ color: '#1976d2', minHeight: 19 }}>{expression || <span style={{ color: '#bbb' }}>0</span>}</div>
          <div style={{
            fontWeight: 'bold',
            color: result === 'Error' ? '#d32f2f' : '#ffb300',
            fontSize: result ? 23 : 14,
            minHeight: 20,
            marginTop: 2
          }}>
            {result}
          </div>
        </div>
        {/* Button Grid */}
        <div className="calculator-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10
        }}>
          <CalculatorButton onClick={handleClear} type="control" ariaLabel="Clear" tabIndex={0}>C</CalculatorButton>
          <CalculatorButton onClick={handleDelete} type="control" ariaLabel="Delete" tabIndex={0}>⌫</CalculatorButton>
          <CalculatorButton onClick={() => handleButtonClick('%')} type="secondary" ariaLabel="Modulo" tabIndex={0}>%</CalculatorButton>
          <CalculatorButton onClick={() => handleButtonClick('÷')} type="accent" ariaLabel="Divide" tabIndex={0}>÷</CalculatorButton>

          {[7, 8, 9].map(n =>
            <CalculatorButton key={n} onClick={() => handleButtonClick(n.toString())} ariaLabel={String(n)} tabIndex={0}>{n}</CalculatorButton>
          )}
          <CalculatorButton onClick={() => handleButtonClick('×')} type="accent" ariaLabel="Multiply" tabIndex={0}>×</CalculatorButton>

          {[4, 5, 6].map(n =>
            <CalculatorButton key={n} onClick={() => handleButtonClick(n.toString())} ariaLabel={String(n)} tabIndex={0}>{n}</CalculatorButton>
          )}
          <CalculatorButton onClick={() => handleButtonClick('-')} type="accent" ariaLabel="Subtract" tabIndex={0}>-</CalculatorButton>

          {[1, 2, 3].map(n =>
            <CalculatorButton key={n} onClick={() => handleButtonClick(n.toString())} ariaLabel={String(n)} tabIndex={0}>{n}</CalculatorButton>
          )}
          <CalculatorButton onClick={() => handleButtonClick('+')} type="accent" ariaLabel="Add" tabIndex={0}>+</CalculatorButton>

          <CalculatorButton onClick={() => handleButtonClick('0')} style={{ gridColumn: '1/2' }} ariaLabel="0" tabIndex={0}>0</CalculatorButton>
          <CalculatorButton onClick={() => handleButtonClick('.')} ariaLabel="Decimal" tabIndex={0}>.</CalculatorButton>
          <CalculatorButton onClick={handleEquals} type="primary" ariaLabel="Equals" tabIndex={0} style={{ gridColumn: '3/5' }}>=</CalculatorButton>
        </div>
        {/* Responsive instruction */}
        <div className="calculator-footer" style={{
          marginTop: 10,
          fontSize: 11,
          color: '#888',
          textAlign: 'center'
        }}>
          <span>Calculator · React · Minimal UI</span>
        </div>
      </div>
    </div>
  );
}

export default App;
