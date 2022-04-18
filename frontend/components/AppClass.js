import React from 'react'
import axios from 'axios';

export default class AppClass extends React.Component {
  initialGrid = [['', '', ''], ['', "B", ''], ['', '', '']];

  state = {
    grid: this.initialGrid,
    steps: 0,
    email: "",
    message: "",
  };

  handleMove = evt => {
    // Boundary logic
    // Set state
    const direction = evt.target.id
    const newCoords = this.calculateUpdatedCoords(direction);

    if (!this.isInBounds(newCoords[0], newCoords[1])) {
      this.setState({
        ...this.state,
        message: `You can't go ${direction}`
      });
    } else {
      const updatedGrid = this.updateGrid(newCoords);
      this.setState({
        ...this.state,
        grid: updatedGrid,
        steps: this.state.steps + 1,
        message: ''
      });
    }

  }

  handleTyping = evt => {
    this.setState({
      ...this.state,
      email: evt.target.value
    });
  }

  handleSubmit = evt => {
    evt.preventDefault();
    const [x, y] = this.getActiveCoordinate(this.state.grid);
    const postPackage = {
      "x": x,
      "y": y,
      "steps": this.state.steps,
      "email": this.state.email
    }
    axios.post("http://localhost:9000/api/result", postPackage)
      .then(res => {
        this.setState({
          ...this.state,
          message: res.data.message,
          email: ""
        });
      })
      .catch(err => {
        this.setState({
          ...this.state,
          message: err.response.data.message,
        });
      })
  }

  isInBounds = (x, y) => {
    return (x > 0 && x < 4 && y > 0 && y < 4) ? true : false;
  }

  calculateUpdatedCoords = direction => {
    let [x, y] = this.getActiveCoordinate(this.state.grid);
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

  updateGrid = newCoords => {
    let newGrid = [[], [], []];

    this.initialGrid.forEach((row, rowIdx) => {
      row.forEach((space, colIdx) => {
        newGrid[rowIdx][colIdx] = 
          (newCoords[1] - 1 === rowIdx && newCoords[0] - 1 === colIdx) 
          ? 'B'
          : '';
      });
    });

    return newGrid;
  }

  getActiveCoordinate(grid) {
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

  resetState = () => {
    this.setState({
      grid: this.initialGrid,
      steps: 0,
      email: "",
      message: "",
    });
  };

  render() {
    const { className } = this.props
    const [x, y] = this.getActiveCoordinate(this.state.grid);
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">
            Coordinates ({x}, {y})
          </h3>
          <h3 id="steps">
            You moved { this.state.steps } time{this.state.steps === 1 ? "" : "s"}
          </h3>
        </div>
        <div id="grid">
          {
            this.state.grid.map((row, rowIdx) => {
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
          <h3 id="message">{ this.state.message }</h3>
        </div>
        <div id="keypad">
          <button onClick={this.handleMove} id="left">LEFT</button>
          <button onClick={this.handleMove} id="up">UP</button>
          <button onClick={this.handleMove} id="right">RIGHT</button>
          <button onClick={this.handleMove} id="down">DOWN</button>
          <button onClick={this.resetState} id="reset">reset</button>
        </div>
        <form onSubmit={this.handleSubmit}>
          <input 
            onChange={this.handleTyping} 
            value={this.state.email}
            id="email" 
            type="email" 
            placeholder="type email" 
          />
          <input id="submit" type="submit" />
        </form>
      </div>
    )
  }
}
