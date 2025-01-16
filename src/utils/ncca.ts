export default async function isNcca(rules: Array<number>, k: number) {
  while (rules.length < 3) {
    // poprawia bład gdy zamało regół
    rules.push(rules[0])
  }
  const n = rules.length
  for (let x = 0; x < k; ++x) {
    for (let y = 0; y < k; ++y) {
      for (let z = 0; z < k; ++z) {
        for (let u = 0; u < k; ++u) {
          for (let i = 1; i < n - 1; ++i) {
            if (L(x, y, rules[i - 1], k) + C(y, z, rules[i], k) + R(z, u, rules[i + 1], k) !== 1) {
              return false
            }
          }
        }
      }
    }
  }
  return true
}

function f(x: number, y: number, z: number, rule: number, k: number) {
  const index = x * k * k + y * k + z
  console.log(Math.floor(rule / Math.pow(k, index)) % k)
  return Math.floor(rule / Math.pow(k, index)) % k
}

function L(x: number, y: number, ruleLeft: number, k: number) {
  return f(x, y, 1, ruleLeft, k) - f(x, y, 0, ruleLeft, k)
}

function C(y: number, z: number, ruleCenter: number, k: number) {
  return f(y, 1, z, ruleCenter, k) - f(y, 0, z, ruleCenter, k)
}

function R(z: number, u: number, ruleRight: number, k: number) {
  return f(1, z, u, ruleRight, k) - f(0, z, u, ruleRight, k)
}
