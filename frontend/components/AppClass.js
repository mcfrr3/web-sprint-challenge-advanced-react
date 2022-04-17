import React from 'react'

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
    console.log(newCoords);

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
    console.log(evt);
    this.setState({
      ...this.state,
      email: evt.target.value
    });
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
    console.log("direction: ", direction);
    console.log("new coords: ", x, y);
    return [x, y];
  }

  updateGrid = newCoords => {
    let newGrid = [[], [], []];

    this.initialGrid.forEach((row, rowIdx) => {
      row.forEach((space, colIdx) => {
        console.log("rowIdx, colIdx: ", rowIdx, colIdx);
        console.log("newCoords: ", newCoords);
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
          x = rowIdx;
          y = colIdx;
        }
      })
    });
    console.log("getActiveCoord: ", x, y);
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
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates (2, 2)</h3>
          <h3 id="steps">You moved { this.state.steps } times</h3>
        </div>
        <div id="grid">
          {/* Create a loop here? */}
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
          <button id="reset">reset</button>
        </div>
        <form>
          <input onChange={this.handleTyping} id="email" type="email" placeholder="type email" />
          <input id="submit" type="submit" />
        </form>
      </div>
    )
  }
}
