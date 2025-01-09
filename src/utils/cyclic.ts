export default function isCyclic(states: Array<number>, ruleNumber: number, k: number) {
  console.log(states)
  console.log(ruleNumber)
  console.log(k)
  console.log(calculateSigma(states))
}

function calculateSigma(states: Array<number>) {
  const n = states.length
  const prefix = new Array(n).fill(0)
  let j = 0
  for (let i = 1; i < n; i++) {
    while (j > 0 && states[i] !== states[j]) {
      j = prefix[j - 1]
    }
    if (states[i] === states[j]) {
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
