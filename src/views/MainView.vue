<template>
  <div class="card flex justify-content-center">
    <div class="flex flex-column gap-2">
      <div class="card flex gap-2 p-fluid">
        <div>
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
        <div>
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
        <Button icon="pi pi-cog" severity="secondary" aria-label="Options" outlined />
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
                :max="255"
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
                :max="1"
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
                  :max="255"
                  :inputId="`input-${i}`"
                />
                <InputNumber
                  class="w-5rem"
                  v-model="startValueInputs[i]"
                  mode="decimal"
                  showButtons
                  :allowEmpty="false"
                  :min="0"
                  :max="1"
                  :inputId="`input-${i}`"
                />
              </div>
            </div>
          </div>
        </Fieldset>
        <Fieldset legend="Własności">
          <span class="text-red-400"><i class="pi pi-check mr-1"></i>Zachowywanie sumy</span><br />
          <span class="text-red-400"><i class="pi pi-check mr-1"></i>Stabilny</span><br />
          <span class="text-red-400"><i class="pi pi-check mr-1"></i>Cykliczny</span><br />
          <span class="text-red-400"><i class="pi pi-check mr-1"></i>Odwracalny</span><br />
          <span class="text-red-400"><i class="pi pi-check mr-1"></i>Chaotyczny</span>
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
const allRule = ref(0)
const allState = ref(0)
const ruleInputs = ref<{ [key: number]: number }>({})
const startValueInputs = ref<{ [key: number]: number }>({})

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

// Funkcja badająca zachowanie sumy stanów
function sprawdzanieSumyStanow(symulacja: string | any[]) {
  let sumaPoczatkowa = symulacja[0].reduce((a: any, b: any) => a + b, 0)
  for (let t = 0; t < symulacja.length; t++) {
    let sumaObecna = symulacja[t].reduce((a: any, b: any) => a + b, 0)
    if (sumaObecna !== sumaPoczatkowa) {
      return false
    }
  }
  return true
}
// Funkcja badająca stabilność
function sprawdzanieStabilnosci(symulacja: string | any[]) {
  for (let t = 0; t < symulacja.length - 1; t++) {
    if (
      !symulacja[t].every((val: any, index: string | number) => val === symulacja[t + 1][index])
    ) {
      return false
    }
  }
  return true
}
// Funkcja badająca okresowość
function sprawdzanieOkresowosci(symulacja: string | any[]) {
  for (let t1 = 0; t1 < symulacja.length - 1; t1++) {
    for (let t2 = t1 + 1; t2 < symulacja.length; t2++) {
      if (symulacja[t1].every((val: any, index: string | number) => val === symulacja[t2][index])) {
        let okres = t2 - t1
        for (let k = t2; k < symulacja.length; k++) {
          if (
            !symulacja[k].every(
              (val: any, index: string | number) => val === symulacja[k - okres][index]
            )
          ) {
            return false
          }
        }
        return true
      }
    }
  }
  return false
}
// Funkcja badająca odwracalność
function sprawdzanieOdwracalnosci(symulacja: string | any[]) {
  for (let t = 1; t < symulacja.length; t++) {
    let poprzednieStany = new Set(symulacja[t - 1])
    if (poprzednieStany.size > 1) {
      return false
    }
  }
  return true
}
// Funkcja badająca chaotyczność
function sprawdzanieChaotycznosci(symulacja: string | any[], threshold: number) {
  for (let t = 0; t < symulacja.length - 1; t++) {
    for (let i = 0; i < symulacja[t].length; i++) {
      if (Math.abs(symulacja[t][i] - symulacja[t + 1][i]) > threshold) {
        return true
      }
    }
  }
  return false
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
    p5.iterations = null

    //output variables
    p5.symulation = {}

    let cols = Object.keys(p5.start).length
    let rows = p5.iterations
    let grid: any[][] = []

    function drawGrid() {
      let cellSize = p5.width / cols
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (grid[y][x] === 1) {
            p5.fill(0)
          } else {
            p5.fill(255)
          }
          p5.stroke(0)
          p5.rect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }

    function generateRule(ruleNumber: { toString: (arg0: number) => string }) {
      let binaryString = ruleNumber.toString(2).padStart(8, '0')
      return binaryString.split('').map(Number).reverse()
    }

    function generateNextState() {
      for (let y = 1; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let left = grid[y - 1][(x - 1 + cols) % cols]
          let center = grid[y - 1][x]
          let right = grid[y - 1][(x + 1) % cols]
          let index = (left << 2) | (center << 1) | right

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
</script>

<style>
.rules {
  max-width: 696px !important;
  min-width: 696px !important;
  overflow-x: auto;
}
</style>
