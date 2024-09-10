<template>
  <div class="card flex justify-content-center">
    <div class="flex flex-column gap-2">
      <div class="card flex gap-2 p-fluid" style="min-height: 5rem">
        <div class="w-10rem align-content-end">
          <label for="numberInput"
            ><b>{{ $t('cells') }}</b></label
          >
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
        <div class="w-10rem align-content-end">
          <label for="iterationInput"
            ><b>{{ $t('iterations') }}</b></label
          >
          <InputNumber
            id="iterationInput"
            mode="decimal"
            :allowEmpty="false"
            v-model="iterationValue"
            showButtons
            :min="0"
          />
        </div>
        <div class="w-10rem align-content-end">
          <label for="statesInput"
            ><b>{{ $t('states') }}</b></label
          >
          <InputNumber
            id="statesInput"
            mode="decimal"
            :allowEmpty="false"
            v-model="statesValue"
            showButtons
            :min="2"
            :max="4"
          />
        </div>
        <div class="w-10rem align-content-end">
          <label for="edgeTypeInput"
            ><b>{{ $t('boundary') }}</b></label
          >
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
        <div class="w-10rem align-content-end" v-if="edgeTypeValue === 2">
          <label for="edgeValueInput"
            ><b>{{ $t('fill') }}</b></label
          >
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

        <div class="w-10rem align-content-end">
          <Button
            class="roll-button align-content-start text-xl"
            icon="mdi mdi-graphql"
            severity="secondary"
            outlined
            title="Generuj diagram de Burjin'a"
            @click="toggleGraphDialog"
          />
        </div>
        <div class="flex flex-1 gap-2 justify-content-end">
          <Button
            class="option-h align-content-start justify-content-center"
            icon="pi pi-cog"
            severity="secondary"
            aria-label="Options"
            outlined
            @click="toggleOptionDialog"
          />
          <Button
            class="option-h align-content-start"
            icon="pi pi-upload"
            severity="secondary"
            outlined
            @click="toggleImportDialog"
          />
          <Button
            class="option-h align-content-start"
            icon="pi pi-download"
            severity="secondary"
            outlined
            @click="toggleExportDialog"
          />
          <Dropdown
            v-model="selectedCountry"
            :options="countries"
            optionLabel="name"
            class="w-5rem option-h p-1"
            @change="updateLocale"
          >
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
      </div>
      <div class="card flex gap-2 p-fluid">
        <Fieldset :legend="$t('parameters')" class="max-w-0 pb-2">
          <div class="card flex gap-2">
            <div>
              <div class="flex justify-content-center">
                <label :for="`input-all`" class="font-bold block mb-2">{{ $t('all') }}</label>
              </div>
              <div class="flex justify-content-end">
                <div class="flex justify-content-end option-h">
                  <span class="line-height-5 mr-2">{{ $t('rule') }}</span>
                </div>
                <InputNumber
                  v-model="allRule"
                  class="w-5rem mb-1 mr-2"
                  mode="decimal"
                  showButtons
                  :allowEmpty="false"
                  :min="0"
                  :max="calculatePossibleAutomata(statesValue)"
                  :inputId="`input-all`"
                  @input="changeAllRules"
                />
                <Button
                  class="roll-button align-content-start text-xl"
                  icon="mdi mdi-dice-multiple"
                  severity="secondary"
                  outlined
                  @click="randomAllRule"
                />
              </div>
              <div class="flex justify-content-end">
                <div class="flex justify-content-end">
                  <span class="line-height-5 mr-2">{{ $t('state') }}</span>
                </div>
                <InputNumber
                  v-model="allState"
                  class="w-5rem mr-2"
                  mode="decimal"
                  showButtons
                  :allowEmpty="false"
                  :min="0"
                  :max="statesValue - 1"
                  :inputId="`input-all`"
                  @input="changeAllStates"
                />
                <Button
                  class="roll-button align-content-start text-xl"
                  icon="mdi mdi-dice-multiple"
                  severity="secondary"
                  outlined
                  @click="randomAllState"
                />
              </div>
            </div>
            <Divider layout="vertical" />
            <div>
              <div class="flex justify-content-center">
                <label :for="`input-placeholder`" class="font-bold block mb-2">&nbsp;</label>
              </div>
              <Button
                class="roll-button align-content-start text-xl mb-1"
                icon="mdi mdi-dice-multiple"
                severity="secondary"
                outlined
              />
              <Button
                class="roll-button align-content-start text-xl"
                icon="mdi mdi-dice-multiple"
                severity="secondary"
                outlined
              />
            </div>
            <div
              class="card flex gap-2 pb-2 rules"
              :class="{ 'justify-content-center': numberValue < 8 }"
            >
              <div v-for="i in numberValue" :key="i" class="w-5rem">
                <div class="flex justify-content-center">
                  <label :for="`input-${i}`" class="font-bold block mb-2">f{{ i }}</label>
                </div>
                <InputNumber
                  class="w-5rem mb-1"
                  v-model="ruleInputs[i - 1]"
                  mode="decimal"
                  showButtons
                  :allowEmpty="false"
                  :min="0"
                  :max="calculatePossibleAutomata(statesValue)"
                  :inputId="`input-${i}`"
                />
                <InputNumber
                  class="w-5rem"
                  v-model="startValueInputs[i - 1]"
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
        <Fieldset :legend="$t('classes')">
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
  <div id="cy" ref="cyContainer"></div>
  <Dialog v-model:visible="visibleOptionDialog" modal header="Opcje" :style="{ width: '25rem' }">
  </Dialog>
  <Dialog v-model:visible="visibleImportDialog" modal header="Importuj" :style="{ width: '25rem' }">
  </Dialog>
  <Dialog v-model:visible="visibleGraphDialog" modal header="Diagram de Burjina'a">
    <div id="graph" ref="graph"></div>
  </Dialog>
  <Dialog
    v-model:visible="visibleExportDialog"
    modal
    header="Eksportuj"
    :style="{ width: '25rem' }"
  >
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, toRaw, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import InputNumber from 'primevue/inputnumber'
import Fieldset from 'primevue/fieldset'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Divider from 'primevue/divider'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

// @ts-ignore
import p5 from 'p5'
// @ts-ignore
import cytoscape from 'cytoscape'
// @ts-ignore
import * as d3 from 'd3'
// @ts-ignore
import { instance } from '@viz-js/viz'

const numberValue = ref(8)
const iterationValue = ref(10)
const statesValue = ref(2)
const edgeTypeValue = ref(0)
const edgeValue = ref(0)
const allRule = ref(0)
const allState = ref(0)
const ruleInputs = ref<{ [key: number]: number }>({})
const startValueInputs = ref<{ [key: number]: number }>({})

const visibleOptionDialog = ref(false)
const toggleOptionDialog = () => (visibleOptionDialog.value = true)
const visibleImportDialog = ref(false)
const toggleImportDialog = () => (visibleImportDialog.value = true)
const visibleExportDialog = ref(false)
const toggleExportDialog = () => (visibleExportDialog.value = true)
const visibleGraphDialog = ref(false)
const toggleGraphDialog = () => {
  instance()
    .then((viz) => {
      const dotCode = generateCircularLayout(edges)
      const svgElement = viz.renderSVGElement(dotCode) // Synchronous render
      // Append the SVG element using document.getElementById
      const graphElement = document.getElementById('graph') // Find the element by ID
      if (graphElement) {
        graphElement.innerHTML = '' // Clear any previous content
        graphElement.appendChild(svgElement) // Append the new SVG
      } else {
        console.error('Graph element not found')
      }
    })
    .catch((error) => {
      console.error('Error rendering graph:', error)
    })
  visibleGraphDialog.value = true
}

const cyContainer = ref(null)
const graph = ref(null)

const i18n: any = useI18n()

const wlasnosci = ref({
  zachowanieSumy: false,
  odwracalnosc: false,
  replikacja: false,
  okresowosc: false
})

const selectedCountry = ref({ name: 'Polski', code: 'PL', value: 'pl' })
const countries = ref([
  { name: 'English', code: 'UK', value: 'en' },
  { name: 'Polski', code: 'PL', value: 'pl' }
])

const updateLocale = (lang: any) => {
  i18n.locale.value = lang.value.value
}

const randomAllRule = () => {
  console.log(statesValue.value)
  const randomRule = Math.floor(Math.random() * (calculatePossibleAutomata(statesValue.value) + 1))
  allRule.value = randomRule
  changeAllRules({ value: randomRule })
}
const randomAllState = () => {
  const randomState = Math.floor(Math.random() * statesValue.value)
  allState.value = randomState
  changeAllStates({ value: randomState })
}

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
  return possibleAutomata - 1
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
function validateImportedLUT(lut: string) {}

function validateLUT(lut: string) {
  let maxValue = 0
  for (let char of lut) {
    const value = parseInt(char)
    if (value > maxValue) {
      maxValue = value
    }
  }
  const states = maxValue + 1
  const requiredLength = Math.pow(states, 3)
  if (lut.length !== requiredLength) return false
  for (let char of lut) {
    const value = parseInt(char)
    if (isNaN(value) || value < 0 || value >= states) return false
  }
  return true
}

function generateLUT() {}

const generateColors = () => {
  // Generowanie wartości od 0 do 1 z krokiem 0.01
  const values = d3.range(0, 1.01, 0.01)
  // Skala kolorów (gradient)
  const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 1])
  // Przekształcenie wartości na kolory
  console.log(values.map((value: any) => colorScale(value)))
}

// Example data for the graph
// const edges = [
//   ['00', '00', 0],
//   ['00', '01', 1],
//   ['01', '11', 0],
//   ['11', '11', 0],
//   ['11', '10', 0],
//   ['10', '00', 0],
//   ['10', '01', 1],
//   ['01', '10', 0]
// ]

function generateAutomatonEdges(k, r, ruleLUT) {
  const edges = []
  const neighborhoodSize = 2 * r + 1

  // Generate all possible neighborhoods
  const totalCombinations = Math.pow(k, neighborhoodSize)

  for (let i = 0; i < totalCombinations; i++) {
    // Convert index to neighborhood (binary string or base-k string)
    const neighborhood = i.toString(k).padStart(neighborhoodSize, '0')

    // Get the rule output (the next state)
    const nextState = ruleLUT[i]

    // Generate edges based on the neighborhood
    const startState = neighborhood.slice(0, -1) // xy (first part)
    const endState = neighborhood.slice(1) // yz (second part)

    // Push the edge: ["xy", "yz", output]
    edges.push([startState, endState, parseInt(nextState)])
  }

  return edges
}

const k = 3 // Number of states
const r = 1 // Neighborhood radius
const ruleLUT = '022102102202120222212200010' // Example rule LUT for r=1, k=2
const edges = generateAutomatonEdges(k, r, ruleLUT)

// Function to generate DOT graph
function generateCircularLayout(edges) {
  const nodes = new Set()
  const radius = 2
  let dotOutput = 'digraph finite_state_machine {\n'
  dotOutput += '\tlayout=fdp;\n'
  dotOutput += '\tnode [shape = circle, fixedsize=true];\n\n'

  edges.forEach((edge) => {
    nodes.add(edge[0])
    nodes.add(edge[1])
  })

  const nodeArray = Array.from(nodes)
  const numNodes = nodeArray.length
  for (let i = 0; i < numNodes; i++) {
    const angle = (2 * Math.PI * i) / numNodes
    const x = (radius * Math.cos(angle)).toFixed(3)
    const y = (radius * Math.sin(angle)).toFixed(3)
    dotOutput += `\t"${nodeArray[i]}" [pos="${x},${y}!"];\n`
  }

  dotOutput += '\n'

  edges.forEach((edge) => {
    const startNode = edge[0]
    const endNode = edge[1]
    const label = edge[2]
    dotOutput += `\t"${startNode}" -> "${endNode}" [label = "${label}"];\n`
  })

  dotOutput += '}'
  return dotOutput
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
    p5.drawNeighbors = true
    p5.drawGrid = true

    let cols = Object.keys(p5.start).length
    let rows = p5.iterations
    let grid: any[][] = []

    function drawGradient(
      x: number,
      y: number,
      w: number,
      h: number,
      startColor: any,
      endColor: any
    ) {
      let gradient = p5.drawingContext.createLinearGradient(x, 0, x + w, 0)
      gradient.addColorStop(0, startColor)
      gradient.addColorStop(1, endColor)
      let saveFillStyle = p5.drawingContext.fillStyle
      p5.drawingContext.fillStyle = gradient
      p5.drawingContext.fillRect(x, y, w, h)
      p5.drawingContext.fillStyle = saveFillStyle
    }

    function drawGrid() {
      let spacingCells = p5.drawNeighbors ? Math.ceil(cols / 2) : 0
      let cellSize = p5.width / (cols + spacingCells * 2)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let colorValue = 255 - (grid[y][x] / (p5.states - 1)) * 255
          p5.fill(colorValue)
          if (p5.drawGrid) p5.stroke(0)
          else p5.noStroke(0)
          p5.rect((x + spacingCells) * cellSize, y * cellSize, cellSize, cellSize)
        }
      }

      // draw neighbors
      if (!p5.drawNeighbors) return
      // left
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < spacingCells; x++) {
          let colorValue = 0
          if (p5.edge === 0)
            colorValue = 255 - (grid[y][cols - spacingCells + x] / (p5.states - 1)) * 255
          if (p5.edge === 1) colorValue = 255 - (grid[y][spacingCells - x] / (p5.states - 1)) * 255
          if (p5.edge === 2) colorValue = 255 - (p5.edgeValue / (p5.states - 1)) * 255
          p5.fill(colorValue)
          if (p5.drawGrid) p5.stroke(0)
          else p5.noStroke(0)
          p5.rect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
      // right
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < spacingCells; x++) {
          let colorValue = 0
          if (p5.edge === 0) colorValue = 255 - (grid[y][x] / (p5.states - 1)) * 255
          if (p5.edge === 1) colorValue = 255 - (grid[y][cols - x - 1] / (p5.states - 1)) * 255
          if (p5.edge === 2) colorValue = 255 - (p5.edgeValue / (p5.states - 1)) * 255
          p5.fill(colorValue)
          if (p5.drawGrid) p5.stroke(0)
          else p5.noStroke(0)
          p5.rect((cols + spacingCells + x) * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
      // left
      drawGradient(
        0,
        0,
        spacingCells * cellSize,
        rows * cellSize + 1,
        p5.color(255, 255, 255, 255),
        p5.color(0, 0, 0, 128)
      )
      // right
      drawGradient(
        (cols + spacingCells) * cellSize,
        0,
        spacingCells * cellSize,
        rows * cellSize + 1,
        p5.color(0, 0, 0, 128),
        p5.color(255, 255, 255, 255)
      )
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

    p5.setup = async () => {
      const parentElement = document.getElementById('vue-canvas')
      const parentWidth = parentElement?.clientWidth ?? 0
      rows = p5.iterations
      let spacingCells = p5.drawNeighbors ? Math.ceil(cols / 2) * 2 : 0
      const parentHeight = 1 + (p5.width / (cols + spacingCells)) * rows
      const canvas = p5.createCanvas(parentWidth, parentHeight)
      await nextTick()
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
      p5.noLoop()
    }

    p5.windowResized = () => {
      const parentElement = document.getElementById('vue-canvas')
      const parentWidth = parentElement?.clientWidth ?? 0
      let spacingCells = p5.drawNeighbors ? Math.ceil(cols / 2) * 2 : 0
      const parentHeight = 1 + (p5.width / (cols + spacingCells)) * rows ?? 500
      p5.resizeCanvas(parentWidth, parentHeight)
      p5.loop()
    }
  }

  p5Instance = new p5(script)
  p5Instance.rules = ruleInputs.value
  p5Instance.start = startValueInputs.value
  p5Instance.iterations = iterationValue.value
  p5Instance.states = statesValue.value
  p5Instance.edge = edgeTypeValue.value
  p5Instance.edgeValue = edgeValue.value
})

watch(
  ruleInputs,
  (newRuleInputs) => {
    if (p5Instance) {
      p5Instance.rules = toRaw(newRuleInputs)
      p5Instance.loop()
    }
  },
  { deep: true }
)
watch(
  startValueInputs,
  (newStartValueInputs) => {
    if (p5Instance) {
      p5Instance.start = toRaw(newStartValueInputs)
      p5Instance.loop()
    }
  },
  { deep: true }
)
watch(
  iterationValue,
  (newIterationValue) => {
    if (p5Instance) {
      p5Instance.iterations = toRaw(newIterationValue)
      p5Instance.loop()
    }
  },
  { deep: true }
)
watch(
  statesValue,
  (newStatesValue) => {
    if (p5Instance) {
      p5Instance.states = toRaw(newStatesValue)
      p5Instance.loop()
    }
  },
  { deep: true }
)
watch(
  edgeTypeValue,
  (newEdgeTypeValue) => {
    if (p5Instance) {
      p5Instance.edge = toRaw(newEdgeTypeValue)
      p5Instance.loop()
    }
  },
  { deep: true }
)
watch(
  edgeValue,
  (newEdgeValue) => {
    if (p5Instance) {
      p5Instance.edgeValue = toRaw(newEdgeValue)
      p5Instance.loop()
    }
  },
  { deep: true }
)
</script>

<style>
.roll-button {
  width: 2.375rem;
  height: 2.375rem;
}
.line-height-5 {
  line-height: 2.25;
}
.option-h {
  height: 2.5rem !important;
}
.rules {
  max-width: 696px !important;
  min-width: 696px !important;
  overflow-x: auto !important;
}
#graph {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
