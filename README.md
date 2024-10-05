# cellular-automata-tools

Narzędzia do analizy własności k-arnych automatów komórkowych takich jak, zachowywanie sumy stanów (ang. Number Conserving), owracalność NCCA oraz cykliczność/okresowość przestrzenno czasowa.

#### NCCA 

Wykorzytsanie alkorytmu do weryfikacji non-uniform NCCA na potrzeby ENCCA.

#### Reversibility

Badanie odwracalności automatu komórkowego z jednoczesnym podaniem odwrotnego CA.

#### Cyclic / Periodic

Wykrywanie czyklicznhych struktur w przestrzeni automatu oraz w przejściach

#### Funkcjonalności
- Zmiana długości taśmy
- Zmiana ilośc stanów
- Zmiana ilośc symulowanch iteracji
- Zmiana typu sąsiedztwa (periodyczne, odbijające i pochłaniające)
- Import automatu z kodu LUT i z pliku tekstowego (również z stanem początkowym taśmy)
- Eksport automatu do kodu LUT i do pliku tekstowego (również z stanem początkowym taśmy)
- Obsługa języka polskiego i angielskiego
- Opcje:
  - Wyświetlanie granic taśmy
  - Wyświtlanie granicy taśmy z gradientem (fadeout)
- Ustawianie zasady automatu dla całej taśmy
- Ustawienie zasady dla poszczególnych komórek taśmy
- Losowanie zasad komórek taśmy
- Ustawienie wartości początkowej dla wszystkich komórek
- Ustawienie wartości początkowych dla poszczególnych komórek
- Losowe ustawienie wartości poczatkowej dla komórek
- Wyświetlanie symulowanych iteracji
- Wyświetlanie grafu de Burjina

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
