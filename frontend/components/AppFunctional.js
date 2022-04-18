import React, { useState } from 'react'
import axios from 'axios';

export default function AppFunctional(props) {  
  const initialGrid = [['', '', ''], ['', "B", ''], ['', '', '']];
  const [state, setState] = useState({
    grid: initialGrid,
    steps: 0,
    email: "",
    message: "",
  });

  const handleMove = evt => {
    // Boundary logic
    // Set state
    const direction = evt.target.id
    const newCoords = calculateUpdatedCoords(direction);

    if (!isInBounds(newCoords[0], newCoords[1])) {
      setState({
        ...state,
        message: `You can't go ${direction}`
      });
    } else {
      const updatedGrid = updateGrid(newCoords);
      setState({
        ...state,
        grid: updatedGrid,
        steps: state.steps + 1,
        message: ''
      });
    }

  }

const   handleTyping = evt => {
    setState({
      ...state,
      email: evt.target.value
    });
  }

  const handleSubmit = evt => {
    evt.preventDefault();
    const [x, y] = getActiveCoordinate(state.grid);
    const postPackage = {
      "x": x,
      "y": y,
      "steps": state.steps,
      "email": state.email
    }
    axios.post("http://localhost:9000/api/result", postPackage)
      .then(res => {
        setState({
          ...state,
          message: res.data.message,
          email: ''
        });
      })
      .catch(err => {
        setState({
          ...state,
          message: err.response.data.message
        });
      });
  }

  const isInBounds = (x, y) => {
    return (x > 0 && x < 4 && y > 0 && y < 4) ? true : false;
  }

  const calculateUpdatedCoords = direction => {
    let [x, y] = getActiveCoordinate(state.grid);
    switch(direction) {
      case "up":
        y--;
        break;
      case "left":
        x--;
        break;
      case "right":
        x++;
        break;
      case "down":
        y++;
        break;
      default:
        break;
    }
    return [x, y];
  }

  const updateGrid = newCoords => {
    let newGrid = [[], [], []];

    initialGrid.forEach((row, rowIdx) => {
      row.forEach((space, colIdx) => {
        newGrid[rowIdx][colIdx] = 
          (newCoords[1] - 1 === rowIdx && newCoords[0] - 1 === colIdx) 
          ? 'B'
          : '';
      });
    });

    return newGrid;
  }

  const getActiveCoordinate = (grid) => {
    let x, y;
    grid.forEach((row, rowIdx) => {
      row.forEach((space, colIdx) => {
        if (space) {
          x = colIdx;
          y = rowIdx;
        }
      })
    });
    return [x + 1, y + 1];
  }

  const resetState = () => {
    setState({
      grid: initialGrid,
      steps: 0,
      email: "",
      message: "",
    });
  };

  const [x, y] = getActiveCoordinate(state.grid);

  return (
    <div id="wrapper" className={props.className}>
        <div className="info">
          <h3 id="coordinates">
            Coordinates ({x}, {y})
          </h3>
          <h3 id="steps">
            You moved { state.steps } time{state.steps === 1 ? "" : "s"}
          </h3>
        </div>
        <div id="grid">
          {/* Create a loop here? */}
          {
            state.grid.map((row, rowIdx) => {
              return row.map((space, colIdx) => {
                return (
                <div 
                  key={`${rowIdx}-${colIdx}`} 
                  className={`square${(space) ? " active" : ""}`}>
                  { space }
                </div>
                )
              })
            })
          }
        </div>
        <div className="info">
          <h3 id="message">{ state.message }</h3>
        </div>
        <div id="keypad">
          <button onClick={handleMove} id="left">LEFT</button>
          <button onClick={handleMove} id="up">UP</button>
          <button onClick={handleMove} id="right">RIGHT</button>
          <button onClick={handleMove} id="down">DOWN</button>
          <button onClick={resetState} id="reset">reset</button>
        </div>
        <form onSubmit={handleSubmit}>
        <input 
            onChange={handleTyping} 
            value={state.email}
            id="email" 
            type="email" 
            placeholder="type email" 
          />
          <input id="submit" type="submit" />
        </form>
    </div>
  )
}
