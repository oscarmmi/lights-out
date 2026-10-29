import { describe, expect, it } from 'vitest'
import { createSolvedBoard, isSolved, shuffleBoard, toggleCell } from './game'

describe('Grid Ember game logic', () => {
  it('flips a center cell and its four orthogonal neighbors', () => {
    const board = toggleCell(createSolvedBoard(), 12)
    expect(board.filter(Boolean)).toHaveLength(5)
    expect([7, 11, 12, 13, 17].every((index) => board[index])).toBe(true)
  })

  it('flips three cells from a corner', () => {
    const board = toggleCell(createSolvedBoard(), 0)
    expect(board.filter(Boolean)).toHaveLength(3)
    expect([0, 1, 5].every((index) => board[index])).toBe(true)
  })

  it('recognizes an all-off board as solved', () => {
    expect(isSolved(createSolvedBoard())).toBe(true)
    expect(isSolved(toggleCell(createSolvedBoard(), 0))).toBe(false)
  })

  it('creates a solvable, unsolved shuffle', () => {
    const board = shuffleBoard(() => 0.42)
    expect(board).toHaveLength(25)
    expect(isSolved(board)).toBe(false)
  })

  it('does not mutate the original board', () => {
    const original = createSolvedBoard()
    toggleCell(original, 12)
    expect(isSolved(original)).toBe(true)
  })
})
