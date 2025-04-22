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
          <Dropdown
            v-model="edgeTypeOptionValue"
            :options="edgeOptions"
            optionLabel="name"
            @change="updateEdgeType"
          ></Dropdown>
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
                @click="randomRules"
              />
              <Button
                class="roll-button align-content-start text-xl"
                icon="mdi mdi-dice-multiple"
                severity="secondary"
                outlined
                @click="randomStates"
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
        <Fieldset :legend="$t('properties')">
          <div>
            <span v-if="isCalculateingNCCA" class="text-primary-400"
              ><i class="mr-1 pi pi-spin pi-spinner"></i>{{ $t('ncca') }}</span
            >
            <span v-else :class="properties.ncca ? 'text-green-400' : 'text-red-400'"
              ><i class="pi mr-1" :class="properties.ncca ? 'pi-check' : 'pi-times'"></i
              >{{ $t('ncca') }}</span
            >
          </div>
          <div
            v-if="
              Object.values(ruleInputs).every((value) => value === Object.values(ruleInputs)[0])
            "
          >
            <div>
              <span v-if="isCalculateingReverse" class="text-primary-400"
                ><i class="mr-1 pi pi-spin pi-spinner"></i>{{ $t('reversibeNcca') }}</span
              >
              <span v-else :class="properties.reversableNcca ? 'text-green-400' : 'text-red-400'"
                ><i class="pi mr-1" :class="properties.reversableNcca ? 'pi-check' : 'pi-times'"></i
                >{{ $t('reversibeNcca') }}</span
              ><br />
              <div v-if="properties.reversableNcca">
                <span class="text-green-400"
                  ><i class="mr-1 ml-4"
                    >{{ $t('rule') }}: {{ properties.reversableNcca?.rule }}</i
                  ></span
                ><br />
                <span class="text-green-400"
                  ><i class="mr-1 ml-4">LUT: {{ properties.reversableNcca?.lut }}</i></span
                >
              </div>
            </div>
            <div>
              <span v-if="isCalculateingCyclic" class="text-primary-400"
                ><i class="mr-1 pi pi-spin pi-spinner"></i>{{ $t('periodic') }}</span
              >
              <span
                v-else
                :class="properties.cyclic.grids?.length ? 'text-green-400' : 'text-red-400'"
              >
                <i
                  class="pi mr-1"
                  :class="properties.cyclic.grids?.length ? 'pi-check' : 'pi-times'"
                ></i
                >{{ $t('periodic') }} </span
              ><br />
              <div v-if="properties.cyclic.grids?.length">
                <div class="flex">
                  <div>
                    <span class="text-green-400"
                      ><i class="mr-1 ml-4">σ = {{ properties.cyclic.sigma }}</i></span
                    ><br />
                    <span class="text-green-400"
                      ><i class="mr-1 ml-4">|T| = {{ properties.cyclic.grids?.length }}</i></span
                    ><br />
                  </div>
                  <div class="flex-1 align-content-center"></div>
                  <div class="align-content-center">
                    <Button
                      v-if="properties.cyclic.grids?.length"
                      class="roll-button align-content-start text-xl"
                      icon="pi pi-search"
                      severity="secondary"
                      outlined
                      title="Podgląd krat T"
                      @click="toggleTilesDialog"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <span class="text-gray-400"
              ><i class="mr-1 pi pi-minus"></i>{{ $t('reversibeNcca') }}</span
            ><br />
            <span class="text-gray-400"><i class="mr-1 pi pi-minus"></i>{{ $t('periodic') }}</span>
          </div>
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
    <div class="flex align-items-center mb-2">
      <Checkbox v-model="options.showNeighbours" :binary="true" @change="null" />
      <label for="showNeighbours" class="ml-2">{{ $t('showNeighbours') }}</label>
    </div>
    <div v-if="options.showNeighbours" class="flex align-items-center mb-2">
      <Checkbox v-model="options.gradientNeighbours" :binary="true" @change="null" />
      <label for="gradientNeighbours" class="ml-2">{{ $t('gradientNeighbours') }}</label>
    </div>
  </Dialog>
  <Dialog v-model:visible="visibleImportDialog" modal header="Importuj">
    <div class="flex gap-2 p-fluid mb-3">
      <div>
        <FileUpload
          id="import-ca"
          accept=".txt,.ca"
          mode="basic"
          chooseLabel="Importuj CA"
          custom-upload
          :show-upload-button="false"
          :show-cancel-button="false"
          :show-clear-button="false"
          :show-files="true"
          :show-size="1000"
          @select="onUpload"
          @clear="null"
        >
          <template #empty>
            <p>Drag and drop files to here to upload.</p>
          </template>
        </FileUpload>
      </div>
      <div class="flex flex-1 gap-2 justify-content-end">
        <div class="align-content-end">
          <span :class="validLUT ? 'text-green-400' : 'text-red-400'"
            ><i class="pi mr-1" :class="validLUT ? 'pi-check' : 'pi-times'"></i
            >{{ validLUT ? $t('validLut') : $t('invalidLut') }}</span
          ><br />
        </div>
      </div>
    </div>
    <div>
      <Textarea v-model="importLUTtext" @input="parseLUT(importLUTtext)" rows="12" cols="48" />
    </div>
    <div class="flex flex-1 justify-content-end">
      <Button
        :disabled="!validLUT"
        severity="primary"
        label="Użyj"
        class="mt-3"
        icon="pi pi-check"
        iconPos="right"
        @click="setParsedLUT"
      />
    </div>
  </Dialog>
  <Dialog v-model:visible="visibleGraphDialog" modal header="Diagram de Burjina'a">
    <div id="graph" ref="graph"></div>
  </Dialog>
  <Dialog v-model:visible="visibleExportDialog" modal header="Eksportuj">
    <div class="flex align-items-center mb-2">
      <Checkbox v-model="useStates" :binary="true" @change="generateExportLUT()" />
      <label for="useStates" class="ml-2">{{ $t('useStates') }}</label>
    </div>
    <Textarea v-model="exportLUTtext" disabled rows="12" cols="48" />
    <div class="flex flex-1 justify-content-end">
      <Button
        severity="primary"
        label="Pobierz"
        class="mt-3"
        icon="pi pi-download"
        iconPos="right"
        @click="downloadLUT"
      />
    </div>
  </Dialog>

  <Dialog
    v-model:visible="visibleTilesDialog"
    modal
    :style="{ maxWidth: '80vw', maxHeight: '80vh', overflow: 'hidden' }"
    :header="'Kraty T dla σ = ' + properties.cyclic.sigma"
  >
    <div class="flex gap-2 p-2">
      <div v-for="tile in properties.cyclic.grids" class="w-max">
        <div class="flex justify-content-center">
          <span>𝜏 = {{ tile.length }}</span>
        </div>
        <div v-for="(row, rowIndex) in tile" :key="rowIndex" class="flex">
          <div v-for="(value, colIndex) in row" :key="colIndex" :style="getCellStyle(value)"></div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, toRaw, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FileUploadSelectEvent } from 'primevue/fileupload'
import InputNumber from 'primevue/inputnumber'
import Fieldset from 'primevue/fieldset'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Divider from 'primevue/divider'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import Checkbox from 'primevue/checkbox'
import isNcca from '@/utils/ncca'
import isRevertable from '@/utils/revert'
import isCyclic from '@/utils/cyclic'

// @ts-ignore
import p5 from 'p5'
// @ts-ignore
import * as d3 from 'd3'
// @ts-ignore
import { instance } from '@viz-js/viz'

const i18n: any = useI18n()

const isCalculateingNCCA = ref(true)
const isCalculateingReverse = ref(true)
const isCalculateingCyclic = ref(true)
const numberValue = ref(8)
const iterationValue = ref(10)
const statesValue = ref(2)
const edgeTypeValue = ref(0)
const edgeTypeOptionValue = ref({ name: i18n.t('endless'), value: 0 })
const edgeValue = ref(0)
const allRule = ref<number>(0)
const allState = ref(0)
const useStates = ref(false)
const ruleInputs = ref<{ [key: number]: number }>({})
const startValueInputs = ref<{ [key: number]: number }>({})
const importLUTtext = ref<string>('')
const exportLUTtext = ref<string>('')
const validLUT = ref(false)
const parsedLUT = ref<{
  states?: string
  rules?: Array<string>
  k?: number
}>({
  states: undefined,
  rules: undefined,
  k: undefined
})
type Options = {
  showNeighbours: boolean
  gradientNeighbours: boolean
}
const options = ref<Options>({
  showNeighbours: true,
  gradientNeighbours: true
})

const visibleOptionDialog = ref(false)
const toggleOptionDialog = () => (visibleOptionDialog.value = true)
const visibleImportDialog = ref(false)
const toggleImportDialog = () => (visibleImportDialog.value = true)
const visibleExportDialog = ref(false)
const toggleExportDialog = () => {
  generateExportLUT()
  visibleExportDialog.value = true
}
const visibleTilesDialog = ref(false)
const toggleTilesDialog = () => (visibleTilesDialog.value = true)
const visibleGraphDialog = ref(false)
const toggleGraphDialog = () => {
  const k = statesValue.value // Number of states allRule
  const r = 1 // Neighborhood radius
  const neighborhoodSize = 2 * r + 1
  const ruleLUT = convertToBase(allRule.value, k, neighborhoodSize) // Example rule LUT for r=1, k=2
  const edges = generateAutomatonEdges(k, r, ruleLUT)
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

const properties = ref<{
  ncca: boolean
  reversableNcca: undefined | { rule: number; lut: string }
  periodic: boolean
  cyclic: { sigma: number; grids: string[][] | undefined }
}>({
  ncca: false,
  reversableNcca: undefined,
  periodic: false,
  cyclic: { sigma: 0, grids: undefined }
})

const selectedCountry = ref({ name: 'Polski', code: 'PL', value: 'pl' })
const countries = ref([
  { name: 'English', code: 'UK', value: 'en' },
  { name: 'Polski', code: 'PL', value: 'pl' }
])

const edgeOptions = ref([
  { name: i18n.t('endless'), value: 0 },
  { name: i18n.t('mirror'), value: 1 },
  { name: i18n.t('filled'), value: 2 }
])

const updateLocale = (lang: any) => {
  i18n.locale.value = lang.value.value
  edgeOptions.value = [
    { name: i18n.t('endless'), value: 0 },
    { name: i18n.t('mirror'), value: 1 },
    { name: i18n.t('filled'), value: 2 }
  ]
  edgeTypeOptionValue.value = edgeOptions.value.find(
    (e) => e.value === edgeTypeOptionValue.value.value
  ) ?? { name: i18n.t('endless'), value: 0 }
}

const updateEdgeType = (edge: any) => {
  edgeTypeValue.value = edge.value.value
}

const calculateNCCA = async () => {
  isCalculateingNCCA.value = true
  return new Promise(async (resolve) => {
    properties.value.ncca = await isNcca(Object.values(ruleInputs.value), statesValue.value)
    isCalculateingNCCA.value = false
    resolve(properties.value.ncca)
  })
}
const calculateReverse = async (newRuleInputs: { [key: number]: number } | null = null) => {
  isCalculateingReverse.value = true
  return new Promise(async (resolve) => {
    const rules = newRuleInputs ?? ruleInputs.value
    if (Object.values(rules).every((value) => value === Object.values(rules)[0]))
      properties.value.reversableNcca = await isRevertable(rules[0], statesValue.value)
    else properties.value.reversableNcca = undefined
    isCalculateingReverse.value = false
    resolve(properties.value.reversableNcca)
  })
}
const calculateCyclic = async (newStartValueInputs: { [key: number]: number } | null = null) => {
  isCalculateingCyclic.value = true
  return new Promise(async (resolve) => {
    const rules = ruleInputs.value
    const states = newStartValueInputs ?? startValueInputs.value
    if (Object.values(rules).every((value) => value === Object.values(rules)[0]))
      properties.value.cyclic = await isCyclic(states, rules[0], statesValue.value)
    else properties.value.cyclic = { sigma: 0, grids: undefined }
    isCalculateingCyclic.value = false
    resolve(properties.value.cyclic)
  })
}

const randomAllRule = () => {
  const randomRule = Math.floor(Math.random() * (calculatePossibleAutomata(statesValue.value) + 1))
  allRule.value = randomRule
  changeAllRules({ value: randomRule })
}

const randomAllState = () => {
  const randomState = Math.floor(Math.random() * statesValue.value)
  allState.value = randomState
  changeAllStates({ value: randomState })
}

const randomRules = () => {
  for (let i = 0; i < numberValue.value; i++) {
    ruleInputs.value[i] = Math.floor(
      Math.random() * (calculatePossibleAutomata(statesValue.value) + 1)
    )
  }
}

const randomStates = () => {
  for (let i = 0; i < numberValue.value; i++) {
    startValueInputs.value[i] = Math.floor(Math.random() * statesValue.value)
  }
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

function setParsedLUT() {
  const data = parsedLUT.value
  if (data.rules === undefined || data.k === undefined) return
  statesValue.value = data.k
  if (data.states !== undefined) {
    numberValue.value = data.states.length
    for (let i = 0; i < data.states.length; i++) {
      startValueInputs.value[i] = parseInt(data.states[i], data.k)
    }
  }
  if (data.rules.length === 1) {
    allRule.value = parseInt(data.rules[0], data.k)
    changeAllRules({ value: parseInt(data.rules[0], data.k) })
  } else {
    for (let i = 0; i < data.rules.length; i++) {
      ruleInputs.value[i] = parseInt(data.rules[i], data.k)
    }
  }
  visibleImportDialog.value = false
  importLUTtext.value = ''
}

function generateExportLUT() {
  let exportLut = ''
  if (useStates.value) {
    Object.values(startValueInputs.value).forEach((input) => {
      exportLut += input.toString()
    })
    exportLut += ':'
  }
  if (
    Object.values(ruleInputs.value).some((value) => value !== Object.values(ruleInputs.value)[0])
  ) {
    // If there are more than one input, generate LUT for each and join with "|"
    exportLut += Object.values(ruleInputs.value)
      .map((input) => generateLUT(input, statesValue.value, 1))
      .join('|')
  } else {
    // If there's exactly one input, generate LUT without any separator
    exportLut += generateLUT(Object.values(ruleInputs.value)[0], statesValue.value, 1)
  }
  exportLUTtext.value = exportLut
}

function parseLUT(lut: string) {
  validLUT.value = true
  if (lut.indexOf(':') >= 0 && lut.indexOf('|') >= 0 && lut.indexOf(':') > lut.indexOf('|'))
    validLUT.value = false
  if ((lut.match(/:/g) || []).length > 1) validLUT.value = false

  if (lut.indexOf(':') >= 0) {
    const [statesPart, rulesPart] = lut.split(':')
    const states = statesPart
    let k = 0
    const rules = rulesPart?.split('|')
    rules.forEach(function (value, _index) {
      if (validLUT.value && !validateLUT(value).isValid) validLUT.value = false
      else k = validateLUT(value).states ?? 0
    })
    if ((lut.match(/\|/g) || []).length > 0 && (lut.match(/\|/g) || []).length < states.length - 1)
      validLUT.value = false
    parsedLUT.value = {
      states,
      rules,
      k
    }
  } else {
    const rules = lut?.split('|')
    let k = 0
    rules.forEach(function (value, _index) {
      if (!validateLUT(value).isValid) validLUT.value = false
      else k = validateLUT(value).states ?? 0
    })
    const states = undefined
    parsedLUT.value = {
      states,
      rules,
      k
    }
  }
  if (!validLUT.value) {
    parsedLUT.value = {
      states: undefined,
      rules: undefined,
      k: undefined
    }
  }
}

function validateLUT(lut: string) {
  // Znajdź maksymalny stan w LUT (wyciąganie liczby stanów s)
  let maxValue = Math.max(...lut.split('').map(Number))
  let s = maxValue + 1 // liczba stanów
  // Długość LUT
  let lutLength = lut.length
  // Znajdź odpowiedniego kandydata na r
  let foundValidR = false
  let r = 0
  // Szukamy r, gdzie s^(2r+1) == lutLength
  for (let possibleR = 0; possibleR < 100; possibleR++) {
    if (Math.pow(s, 2 * possibleR + 1) === lutLength) {
      r = possibleR
      foundValidR = true
      break
    }
  }
  // Jeśli nie znaleziono poprawnego r, zwracamy błąd
  if (!foundValidR) {
    return { isValid: false, states: null, radius: null }
  }
  // Walidacja ciągu LUT: wszystkie liczby muszą być mniejsze niż s
  let isValid = lut.split('').every((c: string) => {
    let value = parseInt(c, 10)
    return value >= 0 && value < s
  })
  // Jeśli walidacja jest poprawna, zwracamy dane
  if (isValid) {
    return {
      isValid: r > 0,
      states: s,
      radius: r
    }
  } else {
    return { isValid: false, states: null, radius: null }
  }
}

function generateLUT(rule: number, states: number, neighbours: number) {
  const lutLength = Math.pow(states, 2 * neighbours + 1) // Calculate LUT length
  let lut = ''

  // Generate LUT by converting the rule number to a base `states`
  for (let i = 0; i < lutLength; i++) {
    // Get the corresponding state for each position
    lut = (rule % states) + lut // Append the state to the LUT
    rule = Math.floor(rule / states) // Update the rule by dividing it by states
  }

  return lut
}

function getCellStyle(value) {
  const maxValue = statesValue.value - 1
  const grayScale = Math.floor((value / maxValue) * 255)
  const backgroundColor = `rgb(${255 - grayScale}, ${255 - grayScale}, ${255 - grayScale})`
  return {
    backgroundColor,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    fontSize: '14px',
    border: '1px solid #777'
  }
}

// Generate data for the graph
function generateAutomatonEdges(k: number, r: number, ruleLUT: string) {
  const neighborhoodSize = 2 * r + 1
  const edges = []

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

function convertToBase(n: number, k: number, x: number) {
  if (k < 2 || k > 36) {
    throw new Error('Base must be between 2 and 36') // 10 digits and 26 letters
  }
  // Calculate the minimum length based on k^x
  const minLength = Math.pow(k, x)
  // Convert number to the specified base
  let result = n.toString(k)
  // Pad the result with leading zeros if necessary to match the minLength
  while (result.length < minLength) {
    result = '0' + result
  }
  return result
}

const onUpload = async (event: FileUploadSelectEvent) => {
  // Ensure there is a file selected
  if (event.files.length > 0) {
    const file = event.files[0] // Get the first file
    const reader = new FileReader()
    reader.onload = (e) => {
      // Check if the result is a string
      const result = e.target?.result
      if (typeof result === 'string') {
        importLUTtext.value = result.trim()
        parseLUT(importLUTtext.value)
      } else {
        console.error('File content is not a valid string')
      }
    }
    reader.onerror = (e) => {
      console.error('Error reading file:', e)
    }
    // Read the file as text
    reader.readAsText(file)
  }
}

// Funkcja do zapisywania danych do pliku
const downloadLUT = async () => {
  try {
    // Opcje dla showSaveFilePicker
    const options = {
      suggestedName: 'lut.ca',
      types: [
        {
          description: 'Cellural Automata File',
          accept: { 'text/plain': ['.ca'] }
        },
        {
          description: 'Text Files',
          accept: { 'text/plain': ['.txt'] }
        }
      ]
    }

    // Otwórz okno dialogowe "Zapisz jako"
    // @ts-ignore funkcja wbudowana w przeglądarkę
    const handle = await showSaveFilePicker(options)

    // Stwórz plik w pamięci
    const writable = await handle.createWritable()
    await writable.write(exportLUTtext.value) // Zapisz dane do pliku
    await writable.close() // Zamknij plik i zakończ operację

    visibleExportDialog.value = false
  } catch (err) {
    console.error('Error saving the file:', err)
  }
}

// Function to generate DOT graph
function generateCircularLayout(edges: any[]) {
  const nodes = new Set()
  let dotOutput = 'digraph finite_state_machine {\n'
  dotOutput += '\tlayout=fdp;\n'
  dotOutput += '\tnode [shape = circle, fixedsize=true];\n\n'

  edges.forEach((edge: unknown[]) => {
    nodes.add(edge[0])
    nodes.add(edge[1])
  })

  const nodeArray = Array.from(nodes)
  const numNodes = nodeArray.length
  const radius = Math.sqrt(numNodes)
  for (let i = 0; i < numNodes; i++) {
    const angle = (2 * Math.PI * i) / numNodes
    const x = (radius * Math.cos(angle)).toFixed(3)
    const y = (radius * Math.sin(angle)).toFixed(3)
    dotOutput += `\t"${nodeArray[i]}" [pos="${x},${y}!"];\n`
  }

  dotOutput += '\n'

  edges.forEach((edge: any[]) => {
    const startNode = edge[0]
    const endNode = edge[1]
    const label = edge[2]
    dotOutput += `\t"${startNode}" -> "${endNode}" [label = "${label}"];\n`
  })

  dotOutput += '}'
  return dotOutput
}

onBeforeMount(async () => {
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
    p5.drawNeighborsGradient = true
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
    function drawTextWithShadow(txt, textSize, x, y) {
      p5.textSize(textSize)
      p5.stroke(255)
      p5.strokeWeight(textSize / 8)
      p5.fill(0)
      p5.text(txt, x, y)

      p5.noStroke()
    }
    const subscriptDigits = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']
    function toSubscript(num) {
      return String(num)
        .split('')
        .map((d) => subscriptDigits[parseInt(d)])
        .join('')
    }

    function drawGrid() {
      let spacingCells = p5.drawNeighbors ? Math.ceil(cols / 2) : 1
      let cellSize = p5.width / (cols + spacingCells * 2)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let colorValue = 255 - (grid[y][x] / (p5.states - 1)) * 255
          p5.fill(colorValue)
          if (p5.drawGrid) p5.stroke(127)
          else p5.noStroke(127)
          p5.rect((x + spacingCells) * cellSize, y * cellSize + cellSize / 4, cellSize, cellSize)
        }
      }
      // draw neighbors
      if (p5.drawNeighbors) {
        // left
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < spacingCells; x++) {
            let colorValue = 0
            if (p5.edge === 0)
              colorValue = 255 - (grid[y][cols - spacingCells + x] / (p5.states - 1)) * 255
            if (p5.edge === 1)
              colorValue = 255 - (grid[y][spacingCells - x] / (p5.states - 1)) * 255
            if (p5.edge === 2) colorValue = 255 - (p5.edgeValue / (p5.states - 1)) * 255
            p5.fill(colorValue)
            if (p5.drawGrid) p5.stroke(127)
            else p5.noStroke(127)
            p5.rect(x * cellSize, y * cellSize + cellSize / 4, cellSize, cellSize)
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
            if (p5.drawGrid) p5.stroke(127)
            else p5.noStroke(127)
            p5.rect(
              (cols + spacingCells + x) * cellSize,
              y * cellSize + cellSize / 4,
              cellSize,
              cellSize
            )
          }
        }
        // left
        drawGradient(
          0,
          cellSize / 4,
          spacingCells * cellSize,
          rows * cellSize + 1,
          p5.drawNeighborsGradient ? p5.color(255, 255, 255, 255) : p5.color(192, 192, 192, 128),
          p5.color(192, 192, 192, 128)
        )
        // right
        drawGradient(
          (cols + spacingCells) * cellSize,
          cellSize / 4,
          spacingCells * cellSize,
          rows * cellSize + 1,
          p5.color(192, 192, 192, 128),
          p5.drawNeighborsGradient ? p5.color(255, 255, 255, 255) : p5.color(192, 192, 192, 128)
        )
      }

      if (p5.drawNeighbors) {
        if (p5.edge === 1) {
          for (let x = cols / 2; x > 0; x--) {
            drawTextWithShadow(
              'c' + toSubscript(x),
              cellSize / 4,
              spacingCells * cellSize + cellSize / 2 - cellSize * x,
              cellSize / 6
            )
          }
          for (let x = cols / 2; x > 0; x--) {
            drawTextWithShadow(
              'c' + toSubscript(cols - x + 1),
              cellSize / 4,
              (cols + spacingCells - 1) * cellSize + cellSize / 2 + cellSize * x,
              cellSize / 6
            )
          }
        } else {
          for (let x = cols / 2; x > 0; x--) {
            drawTextWithShadow(
              'c' + toSubscript(cols - x + 1),
              cellSize / 4,
              spacingCells * cellSize + cellSize / 2 - cellSize * x,
              cellSize / 6
            )
          }
          for (let x = cols / 2; x > 0; x--) {
            drawTextWithShadow(
              'c' + toSubscript(x),
              cellSize / 4,
              (cols + spacingCells - 1) * cellSize + cellSize / 2 + cellSize * x,
              cellSize / 6
            )
          }
        }
      }
      for (let x = 0; x < cols; x++) {
        drawTextWithShadow(
          'c' + toSubscript(x + 1),
          cellSize / 4,
          spacingCells * cellSize + cellSize / 2 + cellSize * x,
          cellSize / 6
        )
      }
      for (let y = 0; y < rows; y++) {
        drawTextWithShadow(
          't' + toSubscript(y + 1),
          cellSize / 4,
          (spacingCells - 1) * cellSize + cellSize / 2,
          (cellSize / 8) * 7 + cellSize * y
        )
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

    p5.setup = async () => {
      const parentElement = document.getElementById('vue-canvas')
      const parentWidth = parentElement?.clientWidth ?? 0
      rows = p5.iterations
      let spacingCells = p5.drawNeighbors ? Math.ceil(cols / 2) * 2 : 0
      let cellSize = p5.width / (cols + spacingCells)
      const parentHeight = 1 + cellSize * rows + cellSize / 4
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
      p5.windowResized()
      generateNextState()
      drawGrid()
      p5.noLoop()
    }

    p5.windowResized = () => {
      const parentElement = document.getElementById('vue-canvas')
      const parentWidth = parentElement?.clientWidth ?? 0
      let spacingCells = p5.drawNeighbors ? Math.ceil(cols / 2) * 2 : 0
      let cellSize = p5.width / (cols + spacingCells)
      const parentHeight = 1 + cellSize * rows + cellSize / 4
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
    calculateReverse(newRuleInputs)
    calculateNCCA()
    calculateCyclic()
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
    calculateCyclic(newStartValueInputs)
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
    calculateNCCA()
    calculateReverse()
    calculateCyclic()
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
watch(
  options,
  (newOptionsValue) => {
    if (p5Instance) {
      p5Instance.drawNeighbors = toRaw(newOptionsValue)?.showNeighbours
      p5Instance.drawNeighborsGradient = toRaw(newOptionsValue)?.gradientNeighbours
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
