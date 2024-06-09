<template>
  <div class="card flex justify-content-center">
    <div class="flex flex-column gap-2">
      <div class="card flex gap-2 p-fluid">
        <div class="w-10rem align-content-end">
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
        <div class="w-10rem align-content-end">
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
        <div class="w-10rem align-content-end">
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
        <div class="w-10rem align-content-end">
          <label for="edgeTypeInput"><b>Warunek brzegowy</b></label>
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
        <div class="flex flex-1 gap-2 justify-content-end">
          <Button
            class="option-h align-content-start justify-content-center"
            icon="pi pi-cog"
            severity="secondary"
            aria-label="Options"
            outlined
          />
          <Button
            class="option-h align-content-start"
            icon="pi pi-upload"
            severity="secondary"
            outlined
          />
          <Button
            class="option-h align-content-start"
            icon="pi pi-download"
            severity="secondary"
            outlined
          />
          <Dropdown
            v-model="selectedCountry"
            :options="countries"
            optionLabel="name"
            class="w-5rem option-h p-1"
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
        <Fieldset legend="Rules" class="max-w-0 pb-2">
          <div class="card flex gap-2">
            <div class="w-5rem">
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
            <div class="card flex justify-content-center gap-2 pb-2 rules">
              <div v-for="i in numberValue" :key="i" class="w-5rem">
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
  <div id="cy" ref="cyContainer"></div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, toRaw, nextTick } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Fieldset from 'primevue/fieldset'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Divider from 'primevue/divider'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

// @ts-ignore
import p5 from 'p5'
import cytoscape from 'cytoscape'

const numberValue = ref(18)
const iterationValue = ref(10)
const statesValue = ref(2)
const edgeTypeValue = ref(0)
const edgeValue = ref(0)
const allRule = ref(0)
const allState = ref(0)
const ruleInputs = ref<{ [key: number]: number }>({})
const startValueInputs = ref<{ [key: number]: number }>({})

const cyContainer = ref(null)

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
  return possibleAutomata - 1
}

const changeAllRules = (event: { value: number }) => {
  for (let i = 0; i <= numberValue.value; i++) {
    ruleInputs.value[i] = event.value
  }
}

const changeAllStates = (event: { value: number }) => {
  for (let i = 0; i <= numberValue.value; i++) {
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

      // draw neighbors
      // left
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < spacingCells; x++) {
          let colorValue = 0
          if (p5.edge === 0)
            colorValue = 255 - (grid[y][cols - spacingCells + x] / (p5.states - 1)) * 255
          if (p5.edge === 1) colorValue = 255 - (grid[y][spacingCells - x] / (p5.states - 1)) * 255
          if (p5.edge === 2) colorValue = 255 - (p5.edgeValue / (p5.states - 1)) * 255
          p5.fill(colorValue)
          p5.stroke(0)
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
          p5.stroke(0)
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

    p5.setup = () => {
      const parentElement = document.getElementById('vue-canvas')
      const parentWidth = parentElement?.clientWidth ?? 0
      rows = p5.iterations
      let spacingCells = Math.ceil(cols / 2) * 2
      const parentHeight = 1 + (p5.width / (cols + spacingCells)) * rows ?? 500
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
      p5.noLoop()
    }

    p5.windowResized = () => {
      const parentElement = document.getElementById('vue-canvas')
      const parentWidth = parentElement?.clientWidth ?? 0
      let spacingCells = Math.ceil(cols / 2) * 2
      const parentHeight = 1 + (p5.width / (cols + spacingCells)) * rows ?? 500
      p5.resizeCanvas(parentWidth, parentHeight)
      p5.loop()
    }
  }

  p5Instance = new p5(script)
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
.option-h {
  height: 2.5rem !important;
}
.rules {
  max-width: 696px !important;
  min-width: 696px !important;
  overflow-x: auto !important;
}
</style>
