export default async function isNcca(rules: Array<number>) {
  const n = rules.length // liczba komórek na taśmie
  // Sprawdzamy dla wszystkich możliwych kombinacji x, y, z, u ∈ {0, 1, ..., k-1}
  for (let x = 0; x <= 1; ++x) {
    for (let y = 0; y <= 1; ++y) {
      for (let z = 0; z <= 1; ++z) {
        for (let u = 0; u <= 1; ++u) {
          // Iterujemy po wszystkich komórkach na taśmie
          for (let i = 1; i < n - 1; ++i) {
            // omijamy skrajne komórki
            if (L(x, y, rules[i - 1]) + C(y, z, rules[i]) + R(z, u, rules[i + 1]) !== 1) {
              return false // Jeśli warunek nie jest spełniony, to automat nie jest NCCA
            }
          }
        }
      }
    }
  }
  return true
}

// Function representing the local rule of the cellular automaton for any k
function f(x: number, y: number, z: number, rule: number) {
  const index = x * 4 + y * 2 + z // dla k = 2, indeks to 3-bitowa liczba
  return (rule >> index) & 1 // zwracamy odpowiedni bit
}

// Funkcje wyliczające L, C i R na podstawie reguły dla każdej komórki
function L(x: number, y: number, ruleLeft: number) {
  return f(x, y, 1, ruleLeft) - f(x, y, 0, ruleLeft)
}

function C(y: number, z: number, ruleCenter: number) {
  return f(y, 1, z, ruleCenter) - f(y, 0, z, ruleCenter)
}

function R(z: number, u: number, ruleRight: number) {
  return f(1, z, u, ruleRight) - f(0, z, u, ruleRight)
}
