<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { isSolved, shuffleBoard, toggleCell } from './game'

const board = ref(shuffleBoard())
const selectedCell = ref(12)
const moves = ref(0)
const best = ref<number | null>(null)
const isComplete = computed(() => isSolved(board.value))
const litCount = computed(() => board.value.filter(Boolean).length)

function startNewGame() {
  board.value = shuffleBoard()
  selectedCell.value = 12
  moves.value = 0
}

function playCell(index: number) {
  if (isComplete.value) return

  board.value = toggleCell(board.value, index)
  selectedCell.value = index
  moves.value += 1

  if (isSolved(board.value) && (best.value === null || moves.value < best.value)) {
    best.value = moves.value
    try {
      window.localStorage.setItem('grid-ember-best', String(moves.value))
    } catch {
      // The game remains playable when browser storage is unavailable.
    }
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) return

  const row = Math.floor(selectedCell.value / 5)
  const column = selectedCell.value % 5
  let nextRow = row
  let nextColumn = column

  switch (event.key) {
    case 'ArrowUp':
      nextRow = (row + 4) % 5
      break
    case 'ArrowDown':
      nextRow = (row + 1) % 5
      break
    case 'ArrowLeft':
      nextColumn = (column + 4) % 5
      break
    case 'ArrowRight':
      nextColumn = (column + 1) % 5
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      playCell(selectedCell.value)
      return
    case 'r':
    case 'R':
      startNewGame()
      return
    default:
      return
  }

  event.preventDefault()
  selectedCell.value = nextRow * 5 + nextColumn
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  try {
    const savedBest = Number(window.localStorage.getItem('grid-ember-best'))
    if (Number.isFinite(savedBest) && savedBest > 0) best.value = savedBest
  } catch {
    // Ignore storage restrictions and keep the session score in memory.
  }
})

onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="page-shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="Grid Ember home">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <span>GRID <b>EMBER</b></span>
      </a>
      <div class="topbar-note"><span class="status-dot"></span> A little light logic</div>
      <a class="source-link" href="https://github.com/oscarmmi/lights-out" target="_blank" rel="noreferrer">
        <span>Open source</span><span aria-hidden="true">↗</span>
      </a>
    </header>

    <main id="top">
      <section class="intro" aria-labelledby="game-title">
        <div class="eyebrow"><span>PUZZLE NO. 025</span><span class="eyebrow-line"></span><span>TAKE A BREATH</span></div>
        <h1 id="game-title">Light up.<br /><em>Think it through.</em></h1>
        <p class="intro-copy">One tap changes everything around it.<br class="desktop-break" /> Can you bring the whole grid back to quiet?</p>
      </section>

      <section class="game-layout" aria-label="Lights Out puzzle">
        <div class="game-column">
          <div class="game-topline">
            <div class="board-label"><span class="live-indicator"></span> YOUR BOARD <span class="board-size">05 × 05</span></div>
            <div class="lights-counter"><span class="counter-value">{{ String(litCount).padStart(2, '0') }}</span><span>lit</span></div>
          </div>

          <div class="board-frame" :class="{ 'board-won': isComplete }">
            <div class="board-glow" aria-hidden="true"></div>
            <div class="board" role="group" aria-label="5 by 5 light grid. Use arrow keys to move and Enter or Space to toggle.">
              <button
                v-for="(isOn, index) in board"
                :key="index"
                class="cell"
                :class="{ 'is-on': isOn, 'is-selected': selectedCell === index }"
                type="button"
                :aria-label="`Row ${Math.floor(index / 5) + 1}, column ${(index % 5) + 1}, ${isOn ? 'on' : 'off'}${selectedCell === index ? ', selected' : ''}`"
                :aria-pressed="isOn"
                @focus="selectedCell = index"
                @click="playCell(index)"
              >
                <span class="cell-core"></span>
              </button>
            </div>
            <div v-if="isComplete" class="win-spark" aria-hidden="true">✦</div>
          </div>

          <div class="game-footer">
            <div class="move-stat"><span class="stat-label">MOVES</span><span class="stat-number">{{ String(moves).padStart(2, '0') }}</span></div>
            <div class="game-message" aria-live="polite">
              <template v-if="isComplete"><span class="message-spark">✦</span> Beautifully done.</template>
              <template v-else>Every move has a ripple.</template>
            </div>
            <button class="reset-button" type="button" @click="startNewGame"><span aria-hidden="true">↻</span> New puzzle <kbd>R</kbd></button>
          </div>
        </div>

        <aside class="side-panel">
          <div class="side-card best-card">
            <div class="card-heading"><span class="heading-icon">✳</span> PERSONAL BEST</div>
            <div class="best-score">{{ best === null ? '—' : String(best).padStart(2, '0') }}<span>{{ best === null ? 'not set' : 'moves' }}</span></div>
            <div class="best-caption">{{ best === null ? 'Solve a board to set your record.' : 'Your fewest moves so far.' }}</div>
          </div>

          <div class="side-card how-card">
            <div class="card-heading"><span class="heading-icon heading-icon-warm">01</span> HOW TO PLAY</div>
            <p>Switch every light off to solve the board.</p>
            <div class="rule-row"><span class="rule-tile" aria-hidden="true"></span><span>Tap a tile to flip it <strong>and its neighbors.</strong></span></div>
            <div class="rule-divider"></div>
            <div class="key-guide">
              <span class="key-cluster" aria-hidden="true"><kbd>↑</kbd><span><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd></span></span>
              <span>Move around</span>
            </div>
            <div class="key-guide"><span class="key-pair"><kbd>↵</kbd><kbd>SPACE</kbd></span><span>Flip selected tile</span></div>
          </div>

          <div class="aside-note"><span class="note-star">✳</span><span>There’s no rush.<br /><i>Find your own rhythm.</i></span></div>
        </aside>
      </section>
    </main>

    <footer class="page-footer"><span>GRID EMBER <span class="footer-separator">/</span> A SMALL GAME FOR A QUIETER MOMENT</span><span>MADE TO BE PLAYED <span class="footer-heart">♥</span></span></footer>
  </div>
</template>
