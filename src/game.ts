export const GRID_SIZE = 5
export const CELL_COUNT = GRID_SIZE * GRID_SIZE

export type Board = boolean[]

export function createSolvedBoard(): Board {
  return Array.from({ length: CELL_COUNT }, () => false)
}

export function toggleCell(board: Board, index: number): Board {
  if (index < 0 || index >= CELL_COUNT) return [...board]

  const next = [...board]
  const row = Math.floor(index / GRID_SIZE)
  const column = index % GRID_SIZE
  const neighbors = [
    [row, column],
    [row - 1, column],
    [row + 1, column],
    [row, column - 1],
    [row, column + 1],
  ]

  for (const [neighborRow, neighborColumn] of neighbors) {
    if (
      neighborRow >= 0 &&
      neighborRow < GRID_SIZE &&
      neighborColumn >= 0 &&
      neighborColumn < GRID_SIZE
    ) {
      const neighborIndex = neighborRow * GRID_SIZE + neighborColumn
      next[neighborIndex] = !next[neighborIndex]
    }
  }

  return next
}

export function isSolved(board: Board): boolean {
  return board.every((isOn) => !isOn)
}

export function shuffleBoard(random: () => number = Math.random): Board {
  let board = createSolvedBoard()
  const scrambleLength = 14 + Math.floor(random() * 8)

  for (let move = 0; move < scrambleLength; move += 1) {
    const index = Math.floor(random() * CELL_COUNT)
    board = toggleCell(board, index)
  }

  if (isSolved(board)) board = toggleCell(board, 12)
  return board
}
