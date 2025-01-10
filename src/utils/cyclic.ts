export default function isCyclic(
  states: { [key: number]: number },
  ruleNumber: number,
  k: number
): { sigma: number; grids: string[][] | undefined } {
  const sigma = calculateSigma(states)
  const graph = generateConfigurationGraph(sigma, ruleNumber, k)
  const cycles = findCycles(graph)
  const tGrid = generateTGrid(cycles, sigma)
  return {
    sigma: sigma,
    grids: tGrid
  }
}

function calculateSigma(states: { [key: number]: number }): number {
  const n = Object.keys(states).length
  const values = Object.values(states)
  const prefix = new Array(n).fill(0)
  let j = 0
  for (let i = 1; i < n; i++) {
    while (j > 0 && values[i] !== values[j]) {
      j = prefix[j - 1]
    }
    if (values[i] === values[j]) {
      j++
    }
    prefix[i] = j
  }
  const patternLength = n - prefix[n - 1]
  if (n % patternLength === 0) {
    return patternLength
  }
  return n
}

function generateConfigurationGraph(
  sigma: number,
  rule: number,
  k: number
): { nodes: string[]; edges: { from: string; to: string }[] } {
  const nodes: string[] = []
  const edges: { from: string; to: string }[] = []
  const totalConfigs = Math.pow(k, sigma)
  for (let i = 0; i < totalConfigs; i++) {
    const config = i.toString(k).padStart(sigma, '0')
    nodes.push(config)
  }
  for (const node of nodes) {
    const nextState: number[] = []
    for (let i = 0; i < sigma; i++) {
      const left = parseInt(node[(i - 1 + sigma) % sigma], k)
      const center = parseInt(node[i], k)
      const right = parseInt(node[(i + 1) % sigma], k)
      const neighborhoodIndex = left * k * k + center * k + right
      const newState = Math.floor(rule / Math.pow(k, neighborhoodIndex)) % k
      nextState.push(newState)
    }
    const nextNode = nextState.join('')
    edges.push({ from: node, to: nextNode })
  }
  return { nodes, edges }
}

function findCycles(graph: { nodes: string[]; edges: { from: string; to: string }[] }): string[][] {
  const { nodes, edges } = graph
  const visited = new Set<string>()
  const stack = new Set<string>()
  const cycles: string[][] = []
  const adjacencyList: { [key: string]: string[] } = {}
  for (const node of nodes) {
    adjacencyList[node] = []
  }
  for (const edge of edges) {
    adjacencyList[edge.from].push(edge.to)
  }
  function dfs(node: string, path: string[]) {
    if (stack.has(node)) {
      const cycleStartIndex = path.indexOf(node)
      cycles.push(path.slice(cycleStartIndex))
      return
    }
    if (visited.has(node)) {
      return
    }
    visited.add(node)
    stack.add(node)
    path.push(node)
    for (const neighbor of adjacencyList[node]) {
      dfs(neighbor, path)
    }
    stack.delete(node)
    path.pop()
  }
  for (const node of nodes) {
    if (!visited.has(node)) {
      dfs(node, [])
    }
  }
  return cycles
}

function generateTGrid(cycles: string[][], sigma: number): string[][] {
  const tiles: string[][] = []
  for (const cycle of cycles) {
    const tile: string[] = []
    const tau = cycle.length
    for (let t = 0; t < tau; t++) {
      tile.push(cycle[t])
    }
    if (isMinimalTile(tile, sigma, tau)) {
      tiles.push(tile)
    }
  }
  return tiles
}

function isMinimalTile(tile: string[], sigma: number, tau: number): boolean {
  for (let i = 1; i < sigma; i++) {
    if (tile.every((row, index) => row === tile[(index + i) % tau])) {
      return false
    }
  }
  for (let i = 1; i < tau; i++) {
    if (tile.every((row, index) => row === tile[(index + i) % tau])) {
      return false
    }
  }
  return true
}
