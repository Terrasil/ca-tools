<template>
  <div class="card flex justify-content-center">
    <div class="flex flex-column gap-2">
      <label for="numberInput">Number Input</label>
      <InputNumber id="numberInput" v-model="numberValue" />
      <Fieldset legend="Rules">
        <div class="card flex gap-2 flex-wrap p-fluid">
          <div v-for="i in numberValue" :key="i">
            <div class="flex justify-content-center">
              <label :for="`input=${i}`" class="font-bold block mb-2">f{{ i }}</label>
            </div>
            <InputNumber
              class="w-5rem"
              v-model="inputArray[i]"
              mode="decimal"
              showButtons
              :allowEmpty="false"
              :min="0"
              :max="255"
              :inputId="`input=${i}`"
            />
          </div>
        </div>
      </Fieldset>
      <Splitter>
        <SplitterPanel class="p-3">
          <div id="vue-canvas" class="full-w"></div>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Fieldset from 'primevue/fieldset'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import p5 from 'p5'

const numberValue = ref(8)
const inputArray = ref<{ [key: number]: number }>({})

onBeforeMount(() => {
  const script = (p5: p5) => {
    var speed = 2
    var posX = 35

    p5.setup = () => {
      const parentElement = document.getElementById('vue-canvas')
      const parentWidth = parentElement?.clientWidth ?? 0
      const canvas = p5.createCanvas(parentWidth, 500)
      canvas.parent('vue-canvas')
    }

    p5.draw = () => {
      p5.background(245)
      const degree = p5.frameCount * 3
      const y = p5.sin(p5.radians(degree)) * 50

      p5.push()
      p5.translate(0, p5.height / 2)
      p5.fill(66, 184, 131)
      p5.stroke(53, 73, 94)
      p5.strokeWeight(5)
      p5.ellipse(posX, y, 50, 50)
      p5.pop()
      posX += speed

      if (posX > p5.width - 35 || posX < 35) {
        speed *= -1
      }
    }

    p5.windowResized = () => {
      const parentElement = document.getElementById('vue-canvas')
      const parentWidth = parentElement?.clientWidth ?? 0
      const parentHeight = 500
      p5.resizeCanvas(parentWidth, parentHeight)
    }
  }

  new p5(script)
})
</script>
