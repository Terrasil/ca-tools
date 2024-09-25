export default function isCyclic(ruleNumber: number, k: number) {
  // Przykład użycia
  const ruleTable = generateTable(ruleNumber, k)
  console.log(ruleTable)
  if (ruleTable == false) return false
  const spatialPeriod = 2
  const periodicSolutions = findPeriodicSolutions(
    ruleTable as { [key: string]: any },
    spatialPeriod
  )
  console.log(periodicSolutions)
  return periodicSolutions
}

function generateTable(ruleNumber: number, k: number) {
  // Oblicz ile kombinacji sąsiadów z komórką centralną (k^3)
  const combinations = k ** 3
  // Przekształcenie ruleNumber na string w systemie k-arnym, dopasowany do ilości kombinacji
  let ruleString = ruleNumber.toString(k).padStart(combinations, '0')
  // Mapa do przechowywania wyników
  const resultMap: Record<string, number> = {}
  // Oblicz ile kombinacji sąsiadów (k^2)
  // Iteracja po każdej kombinacji sąsiadów
  for (let i = 0; i < combinations; i++) {
    // Reprezentacja sąsiadów w postaci k-arnej
    const neighborhood = i.toString(k).padStart(3, '0') // Dla sąsiadów o długości 3
    const neighbor = neighborhood[0] + neighborhood[2] // Dla sąsiadów o długości 2
    // Sprawdzenie, jaka wartość jest przypisana do tej kombinacji w ruleString
    const output = parseInt(ruleString[combinations - 1 - i], k)
    // Jeśli wartość dla tej kombinacji istnieje już w mapie, sprawdź spójność
    if (resultMap.hasOwnProperty(neighbor)) {
      if (resultMap[neighbor] !== output) {
        return false // Jeśli jest konflikt, zwróć false
      }
    } else {
      // Jeśli nie ma tej kombinacji w mapie, dodaj ją
      resultMap[neighbor] = output
    }
  }
  // Jeśli nie było konfliktów, zwróć mapę
  return resultMap
}

// Find periodic solutions by directed graph on configurations
function findPeriodicSolutions(
  ruleTable: { [key: string]: string },
  spatialPeriod: number
): Array<Array<string>> {
  const periodicSolutions: Array<Array<string>> = []
  // Krok 1: Znajdź wszystkie cykle w grafie konfiguracji
  const cycles = findDirectedCycles(ruleTable)
  // Krok 2: Dla każdego cyklu, zbuduj kafelek T umieszczając konfiguracje w kolejnych wierszach
  cycles.forEach((cycle) => {
    const tile: Array<string> = []
    // Umieszczamy każdą konfigurację w wierszu kafelka
    cycle.forEach((configuration) => {
      tile.push(configuration)
    })
    // Krok 3: Sprawdź, czy przestrzenna okresowość jest minimalna
    if (isMinimalSpatialPeriod(tile, spatialPeriod)) {
      periodicSolutions.push(tile)
    }
  })
  return periodicSolutions
}

// Funkcja DFS, która szuka cykli w grafie skierowanym
function dfs(
  node: string,
  ruleTable: { [key: string]: string },
  visited: Set<string>,
  path: Array<string>,
  cycles: Array<Array<string>>
) {
  if (visited.has(node)) {
    // Znaleziono cykl, sprawdzamy czy cykl jest zamknięty (czy ostatni stan prowadzi z powrotem do początkowego)
    const cycleStartIndex = path.indexOf(node)
    if (cycleStartIndex !== -1) {
      cycles.push(path.slice(cycleStartIndex))
    }
    return
  }
  visited.add(node)
  path.push(node)
  const nextState = ruleTable[node]
  if (nextState) {
    dfs(nextState, ruleTable, visited, path, cycles)
  }
  path.pop()
  visited.delete(node)
}

// Funkcja pomocnicza do znajdowania cykli w grafie skierowanym
function findDirectedCycles(ruleTable: { [key: string]: string }): Array<Array<string>> {
  const cycles: Array<Array<string>> = []
  // Lista wszystkich stanów w grafie
  const states = Object.keys(ruleTable)
  // Sprawdzamy cykle dla każdego stanu startowego
  states.forEach((startState) => {
    const visited = new Set<string>()
    const path: Array<string> = []
    dfs(startState, ruleTable, visited, path, cycles)
  })
  return cycles
}

// Sprawdzenie minimalnej okresowości przestrzennej
function isMinimalSpatialPeriod(tile: Array<string>, period: number): boolean {
  for (let i = 1; i < period; i++) {
    if (tile[i] === tile[0]) {
      return false // Znaleziono powtarzający się wiersz, co oznacza, że okres nie jest minimalny
    }
  }
  return true
}
