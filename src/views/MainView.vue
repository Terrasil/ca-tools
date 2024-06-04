<template>
  <div class="card flex justify-content-center">
    <div class="flex flex-column gap-2">
      <div class="card flex gap-2 p-fluid">
        <div class="w-10rem">
          <label for="numberInput"><b>Ilość komórek</b></label>
          <InputNumber
            id="numberInput"
            mode="decimal"
            :allowEmpty="false"
            v-model="numberValue"
            showButtons
            :min="1"
            @input="onValueChanged"
          />
        </div>
        <div class="w-10rem">
          <label for="iterationInput"><b>Ilość iteracji</b></label>
          <InputNumber
            id="iterationInput"
            mode="decimal"
            :allowEmpty="false"
            v-model="iterationValue"
            showButtons
            :min="0"
          />
        </div>
        <div class="w-10rem">
          <label for="statesInput"><b>Ilość stanów</b></label>
          <InputNumber
            id="statesInput"
            mode="decimal"
            :allowEmpty="false"
            v-model="statesValue"
            showButtons
            :min="2"
          />
        </div>
        <div class="w-10rem">
          <label for="edgeTypeInput"><b>Typ warunku brzegowego</b></label>
          <InputNumber
            id="edgeTypeInput"
            mode="decimal"
            :allowEmpty="false"
            v-model="edgeTypeValue"
            showButtons
            :min="0"
            :max="2"
          />
        </div>
        <div class="w-10rem" v-if="edgeTypeValue === 2">
          <label for="edgeValueInput"><b>Wartość wypełnienia</b></label>
          <InputNumber
            id="edgeValueInput"
            mode="decimal"
            :allowEmpty="false"
            v-model="edgeValue"
            showButtons
            :min="0"
            :max="statesValue - 1"
          />
        </div>
        <!--<Button icon="pi pi-cog" severity="secondary" aria-label="Options" outlined />-->
        <Button icon="pi pi-upload" severity="secondary" outlined />
        <Button icon="pi pi-download" severity="secondary" outlined />
        <Dropdown v-model="selectedCountry" :options="countries" optionLabel="name" class="w-1 p-1">
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex align-items-center">
              <img
                :alt="slotProps.value.label"
                src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`"
                style="width: 18px"
              />
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex align-items-center">
              <img
                :alt="slotProps.option.label"
                src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`"
                style="width: 18px"
              />
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </Dropdown>
      </div>
      <div class="card flex gap-2 p-fluid">
        <Fieldset legend="Rules" class="max-w-0">
          <div class="card flex gap-2">
            <div class="w-1">
              <div class="flex justify-content-center">
                <label :for="`input-all`" class="font-bold block mb-2">all</label>
              </div>
              <InputNumber
                v-model="allRule"
                class="w-5rem mb-1"
                mode="decimal"
                showButtons
                :allowEmpty="false"
                :min="0"
                :max="calculatePossibleAutomata(statesValue)"
                :inputId="`input-all`"
                @input="changeAllRules"
              />
              <InputNumber
                v-model="allState"
                class="w-5rem"
                mode="decimal"
                showButtons
                :allowEmpty="false"
                :min="0"
                :max="statesValue - 1"
                :inputId="`input-all`"
                @input="changeAllStates"
              />
            </div>
            <Divider layout="vertical" />
            <div class="card flex gap-2 p-fluid pb-2 rules">
              <div v-for="i in numberValue" :key="i">
                <div class="flex justify-content-center">
                  <label :for="`input-${i}`" class="font-bold block mb-2">f{{ i }}</label>
                </div>
                <InputNumber
                  class="w-5rem mb-1"
                  v-model="ruleInputs[i]"
                  mode="decimal"
                  showButtons
                  :allowEmpty="false"
                  :min="0"
                  :max="calculatePossibleAutomata(statesValue)"
                  :inputId="`input-${i}`"
                />
                <InputNumber
                  class="w-5rem"
                  v-model="startValueInputs[i]"
                  mode="decimal"
                  showButtons
                  :allowEmpty="false"
                  :min="0"
                  :max="statesValue - 1"
                  :inputId="`input-${i}`"
                />
              </div>
            </div>
          </div>
        </Fieldset>
        <Fieldset legend="Własności">
          <span :class="wlasnosci.zachowanieSumy ? 'text-green-400' : 'text-red-400'"
            ><i class="pi mr-1" :class="wlasnosci.zachowanieSumy ? 'pi-check' : 'pi-times'"></i
            >Zachowywanie sumy</span
          ><br />
          <span :class="wlasnosci.odwracalnosc ? 'text-green-400' : 'text-red-400'"
            ><i class="pi mr-1" :class="wlasnosci.odwracalnosc ? 'pi-check' : 'pi-times'"></i
            >Odwracalny</span
          ><br />
          <span :class="wlasnosci.replikacja ? 'text-green-400' : 'text-red-400'"
            ><i class="pi mr-1" :class="wlasnosci.replikacja ? 'pi-check' : 'pi-times'"></i
            >Replikujący</span
          ><br />
          <span :class="wlasnosci.okresowosc ? 'text-green-400' : 'text-red-400'"
            ><i class="pi mr-1" :class="wlasnosci.okresowosc ? 'pi-check' : 'pi-times'"></i
            >Cykliczny</span
          >
        </Fieldset>
      </div>
      <Splitter>
        <SplitterPanel class="p-3">
          <div id="vue-canvas" class="full-w"></div>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, toRaw } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Fieldset from 'primevue/fieldset'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Divider from 'primevue/divider'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

// @ts-ignore
import p5 from 'p5'

const numberValue = ref(8)
const iterationValue = ref(10)
const statesValue = ref(2)
const edgeTypeValue = ref(0)
const edgeValue = ref(0)
const allRule = ref(0)
const allState = ref(0)
const ruleInputs = ref<{ [key: number]: number }>({})
const startValueInputs = ref<{ [key: number]: number }>({})

const wlasnosci = ref({
  zachowanieSumy: false,
  odwracalnosc: false,
  replikacja: false,
  okresowosc: false
})

const selectedCountry = ref({ name: 'Polski', code: 'PL' })
const countries = ref([
  { name: 'English', code: 'UK' },
  { name: 'Polski', code: 'PL' }
])

let p5Instance: p5 | null = null

const onValueChanged = (event: { value: number }) => {
  for (
    let i = 0;
    i < Math.max(numberValue.value, Object.keys(startValueInputs.value).length);
    i++
  ) {
    if (i >= event.value) {
      delete startValueInputs.value[i]
      delete ruleInputs.value[i]
      continue
    }
    if (startValueInputs.value[i] != undefined) continue
    startValueInputs.value[i] = allState.value
    ruleInputs.value[i] = allRule.value
  }
}

function calculatePossibleAutomata(states: number) {
  const possibleNeighborhoods = Math.pow(states, 3)
  const possibleAutomata = Math.pow(states, possibleNeighborhoods)
  return possibleAutomata
}

const changeAllRules = (event: { value: number }) => {
  for (let i = 0; i < numberValue.value; i++) {
    ruleInputs.value[i] = event.value
  }
}

const changeAllStates = (event: { value: number }) => {
  for (let i = 0; i < numberValue.value; i++) {
    startValueInputs.value[i] = event.value
  }
}

onBeforeMount(() => {
  for (let i = 0; i < numberValue.value; i++) {
    ruleInputs.value[i] = 0
    startValueInputs.value[i] = 0
  }

  const script = (p5: p5) => {
    //outside variables
    p5.rules = {}
    p5.start = {}
    p5.states = null
    p5.edge = 2 // 0 - periodic, 1 - mirror, 2 - filled by edgeValue
    p5.edgeValue = 1
    p5.iterations = null

    let cols = Object.keys(p5.start).length
    let rows = p5.iterations
    let grid: any[][] = []

    function drawGrid() {
      let spacingCells = Math.ceil(cols / 2)
      let cellSize = p5.width / (cols + spacingCells * 2)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let colorValue = 255 - (grid[y][x] / (p5.states - 1)) * 255
          p5.fill(colorValue)
          p5.stroke(0)
          p5.rect((x + spacingCells) * cellSize, y * cellSize, cellSize, cellSize)
        }
      }

      //draw neighbors
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < spacingCells; x++) {
          let colorValue = 0
          if (p5.edge === 0)
            colorValue = 255 - (grid[y][cols - spacingCells + x] / (p5.states - 1)) * 255
          if (p5.edge === 1) colorValue = 255 - (grid[y][spacingCells - x] / (p5.states - 1)) * 255
          if (p5.edge === 2) colorValue = 255 - (p5.edgeValue / (p5.states - 1)) * 255
          p5.fill(colorValue / 2)
          p5.stroke(0)
          p5.rect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < spacingCells; x++) {
          let colorValue = 0
          if (p5.edge === 0) colorValue = 255 - (grid[y][x] / (p5.states - 1)) * 255
          if (p5.edge === 1) colorValue = 255 - (grid[y][cols - x - 1] / (p5.states - 1)) * 255
          if (p5.edge === 2) colorValue = 255 - (p5.edgeValue / (p5.states - 1)) * 255
          p5.fill(colorValue / 2)
          p5.stroke(0)
          p5.rect((cols + spacingCells + x) * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }

    function generateRule(ruleNumber: { toString: (arg0: number) => string }) {
      let baseString = ruleNumber.toString(p5.states).padStart(Math.pow(p5.states, 3), '0')
      return baseString.split('').map(Number).reverse()
    }

    function generateNextState() {
      for (let y = 1; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let left, center, right

          if (p5.edge === 0) {
            // Periodic
            left = grid[y - 1][(x - 1 + cols) % cols]
            center = grid[y - 1][x]
            right = grid[y - 1][(x + 1) % cols]
          } else if (p5.edge === 1) {
            // Mirror
            left = grid[y - 1][x === 0 ? 0 : x - 1]
            center = grid[y - 1][x]
            right = grid[y - 1][x === cols - 1 ? cols - 1 : x + 1]
          } else if (p5.edge === 2) {
            // Filled by edgeValue
            left = x === 0 ? p5.edgeValue : grid[y - 1][x - 1]
            center = grid[y - 1][x]
            right = x === cols - 1 ? p5.edgeValue : grid[y - 1][x + 1]
          }

          let index = left * p5.states * p5.states + center * p5.states + right
          let ruleNumber = p5.rules[x]
          let cellRules = generateRule(ruleNumber)
          grid[y][x] = cellRules[index]
        }
      }
    }

    function checkNumberConservation(
      f: (left: number, center: number, right: number) => number,
      S: number | null,
      testConfigurations: number[][]
    ) {
      function sum(arr: number[]) {
        return arr.reduce((a, b) => a + b, 0)
      }

      for (const x of testConfigurations) {
        const sumBefore = sum(x)
        const xNew: number[] = []
        for (let i = 0; i < x.length; i++) {
          const left = i > 0 ? x[i - 1] : 0
          const center = x[i]
          const right = i < x.length - 1 ? x[i + 1] : 0
          const newState = f(left, center, right)
          xNew.push(newState)
        }
        const sumAfter = sum(xNew)
        if (sumBefore !== sumAfter) {
          return false
        }
      }
      return true
    }

    function checkReversibility(
      F: (left: number, center: number, right: number) => number,
      S: number | null,
      testConfigurations: number[][]
    ): [boolean, Map<any, any> | null] {
      function generateRightGraph(
        F: (left: number, center: number, right: number) => number,
        S: number | null
      ) {
        const graph = new Map()

        function addEdge(u: any, y: number) {
          const v = F(u[0], u[1], y)
          if (!graph.has(u)) {
            graph.set(u, [])
          }
          graph.get(u).push(v)
        }

        const initial = F(0, 0, 0)
        const nodes = [initial]
        graph.set(initial, [])

        while (nodes.length > 0) {
          const u = nodes.pop()!
          for (let y = 0; y < (S || 10); y++) {
            const v = F(u[0], u[1], y)
            if (!graph.has(v)) {
              graph.set(v, [])
              nodes.push(v)
            }
            addEdge(u, y)
          }
        }

        return graph
      }

      function constructInverseFunction(graph: Map<any, any[]>) {
        const F_inv = new Map()
        for (const [u, neighbors] of graph.entries()) {
          for (const v of neighbors) {
            if (!F_inv.has(v)) {
              F_inv.set(v, [])
            }
            F_inv.get(v).push(u)
          }
        }
        return F_inv
      }

      function isStronglyConnected(graph: Map<any, any[]>) {
        function dfs(graph: Map<any, any[]>, node: any, visited: Set<any>) {
          visited.add(node)
          for (let neighbor of graph.get(node) || []) {
            if (!visited.has(neighbor)) {
              dfs(graph, neighbor, visited)
            }
          }
        }

        const nodes = Array.from(graph.keys())
        const visited = new Set()
        dfs(graph, nodes[0], visited)

        if (visited.size !== nodes.length) {
          return false
        }

        const transposedGraph = new Map()
        for (let [node, neighbors] of graph.entries()) {
          for (let neighbor of neighbors) {
            if (!transposedGraph.has(neighbor)) {
              transposedGraph.set(neighbor, [])
            }
            transposedGraph.get(neighbor).push(node)
          }
        }

        const transposedVisited = new Set()
        dfs(transposedGraph, nodes[0], transposedVisited)

        return transposedVisited.size === nodes.length
      }

      const graph = generateRightGraph(F, S)
      if (isStronglyConnected(graph)) {
        const F_inv = constructInverseFunction(graph)
        for (const x of testConfigurations) {
          const xNew = F(x[0], x[1], x[2])
          const xRestored = F_inv.get(xNew)
          if (!xRestored || JSON.stringify(x) !== JSON.stringify(xRestored[0])) {
            return [false, null]
          }
        }
        return [true, F_inv]
      }
      return [false, null]
    }

    function checkReplication(
      K: (left: number, center: number, right: number) => number,
      n0: number,
      testConfigurations: number[][]
    ) {
      function updateConfiguration(
        x: number[],
        K: (left: number, center: number, right: number) => number
      ) {
        const xNew: number[] = []
        for (let i = 0; i < x.length; i++) {
          const left = i > 0 ? x[i - 1] : 0
          const center = x[i]
          const right = i < x.length - 1 ? x[i + 1] : 0
          const newState = K(left, center, right)
          xNew.push(newState)
        }
        return xNew
      }

      function isReplicator(initialConfig: number[], currentConfig: number[]) {
        const initialString = initialConfig.join('')
        const currentString = currentConfig.join('')
        return currentString.includes(initialString + initialString)
      }

      for (const x of testConfigurations) {
        let currentConfig = x
        for (let t = 1; t <= n0; t++) {
          currentConfig = updateConfiguration(currentConfig, K)
        }
        if (isReplicator(x, currentConfig)) {
          return true
        }
      }
      return false
    }

    function checkPeriodicity(
      f: (left: number, center: number, right: number) => number,
      n0: number,
      testConfigurations: number[][]
    ) {
      function updateConfiguration(
        x: number[],
        f: (left: number, center: number, right: number) => number
      ) {
        const xNew: number[] = []
        for (let i = 0; i < x.length; i++) {
          const left = i > 0 ? x[i - 1] : 0
          const center = x[i]
          const right = i < x.length - 1 ? x[i + 1] : 0
          const newState = f(left, center, right)
          xNew.push(newState)
        }
        return xNew
      }

      for (const x of testConfigurations) {
        const initialConfig = x
        let currentConfig = x
        for (let t = 1; t <= n0; t++) {
          currentConfig = updateConfiguration(currentConfig, f)
          if (JSON.stringify(currentConfig) === JSON.stringify(initialConfig)) {
            return true
          }
        }
      }
      return false
    }

    function tests() {
      const f = (left: number, center: number, right: number) =>
        p5.rules[`${left}${center}${right}`] || 0
      const S = p5.states
      const testConfigurations = [Object.values(p5.start) as number[]]

      wlasnosci.value.zachowanieSumy = checkNumberConservation(f, S, testConfigurations)
      wlasnosci.value.odwracalnosc = checkReversibility(f, S, testConfigurations)[0] ?? undefined
      wlasnosci.value.replikacja = checkReplication(f, p5.iterations, testConfigurations)
      wlasnosci.value.okresowosc = checkPeriodicity(f, p5.iterations, testConfigurations)
    }

    p5.setup = () => {
      const parentElement = document.getElementById('vue-canvas')
      const parentWidth = parentElement?.clientWidth ?? 0
      rows = p5.iterations
      const parentHeight = (p5.width / cols) * rows ?? 500
      const canvas = p5.createCanvas(parentWidth, parentHeight)
      canvas.parent('vue-canvas')
    }

    p5.draw = () => {
      if (cols != Object.keys(p5.start).length) {
        cols = Object.keys(p5.start).length
        p5.windowResized()
      }
      if (rows != p5.iterations) {
        rows = p5.iterations
        p5.windowResized()
      }
      grid[0] = Object.values(p5.start)
      for (let i = 1; i < rows; i++) {
        grid[i] = Array(cols).fill(0)
      }
      p5.background(255)
      generateNextState()
      drawGrid()
      tests()
    }

    p5.windowResized = () => {
      const parentElement = document.getElementById('vue-canvas')
      const parentWidth = parentElement?.clientWidth ?? 0
      const parentHeight = (p5.width / cols) * rows ?? 500
      p5.resizeCanvas(parentWidth, parentHeight)
    }
  }

  p5Instance = new p5(script)
  p5Instance.iterations = iterationValue.value
  p5Instance.states = statesValue.value
})

watch(
  ruleInputs,
  (newRuleInputs) => {
    if (p5Instance) p5Instance.rules = toRaw(newRuleInputs)
  },
  { deep: true }
)
watch(
  startValueInputs,
  (newStartValueInputs) => {
    if (p5Instance) p5Instance.start = toRaw(newStartValueInputs)
  },
  { deep: true }
)
watch(
  iterationValue,
  (newIterationValue) => {
    if (p5Instance) p5Instance.iterations = toRaw(newIterationValue)
  },
  { deep: true }
)
watch(
  statesValue,
  (newStatesValue) => {
    if (p5Instance) p5Instance.states = toRaw(newStatesValue)
  },
  { deep: true }
)
watch(
  edgeTypeValue,
  (newEdgeTypeValue) => {
    if (p5Instance) p5Instance.edge = toRaw(newEdgeTypeValue)
  },
  { deep: true }
)
watch(
  edgeValue,
  (newEdgeValue) => {
    if (p5Instance) p5Instance.edgeValue = toRaw(newEdgeValue)
  },
  { deep: true }
)
</script>

<style>
.rules {
  max-width: 696px !important;
  min-width: 696px !important;
  overflow-x: auto;
}
</style>
