const StandardButton = {
  LeftDpad: {
    Up: 12,
    Right: 15,
    Down: 13,
    Left: 14,
  },
  RightCluster: {
    Down: 0,  // xbox: A, snes: B, ps: X
    Right: 1, // xbox: B, snes: A, ps: Circle
    Left: 2,  // xbox: X, snes: Y, ps: Square
    Up: 3,    // xbox: Y, snes: X, ps: Triangle
  },
  Left: {
    Trigger: 6,
    Shoulder: 4,
    StickPress: 10,
  },
  Right: {
    Trigger: 7,
    Shoulder: 5,
    StickPress: 11,
  },
  Menu: {
    Select: 8,
    Start: 9,
    Center: 16,
  },
}

export const Standard360 = {
  ...StandardButton,
  RightCluster: {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
  }
}

export const StandardPS = {
  ...StandardButton,
  RightCluster: {
    X: 0,
    Circle: 1,
    Square: 2,
    Triangle: 3,
  }
}

export const StandardSNES = {
  ...StandardButton,
  RightCluster: {
    B: 0,
    A: 1,
    Y: 2,
    X: 3,
  }
}

export default StandardButton