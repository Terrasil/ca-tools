# Cellular Automata Tools

## Autor

Patryk Morawski  
Praca magisterska — 2025  
Aplikacja webowa stworzona na potrzeby analizy wybranych klas jednowymiarowych automatów komórkowych (m.in. NCCA, odwracalność, cykliczność).

## Opis projektu

Aplikacja umożliwia:

- wizualizację działania automatów komórkowych w czasie rzeczywistym (z użyciem biblioteki `p5.js`);
- analizę wybranych własności automatów:
  - zachowywanie sumy stanów (Number-Conserving Cellular Automata, NCCA),
  - odwracalność — wraz z generowaniem reguły odwrotnej,
  - cykliczność przestrzenno-czasową — detekcja powtarzalnych wzorców;
- generowanie grafów de Bruijna (`Viz.js` / `Graphviz`);
- pracę w pełni po stronie klienta — bez backendu serwerowego.

Aplikacja została napisana w:

- **JavaScript** i **TypeScript**
- z użyciem frameworka **Vue.js**  
  Całość działa w przeglądarce — bez instalacji dodatkowego oprogramowania.

### Główne funkcje interfejsu:

- Edycja parametrów automatu (liczba stanów, długość taśmy, liczba iteracji);
- Wybór rodzaju sąsiedztwa (periodyczne, odbijające, pochłaniające);
- Import i eksport konfiguracji z/do kodu LUT (z możliwością uwzględnienia stanów początkowych);
- Wsparcie języka polskiego i angielskiego;
- Panel konfiguracji reguł i stanów komórek indywidualnie i globalnie;
- Losowe generowanie reguł/stanu początkowego;
- Eksport wizualizacji do pliku graficznego;
- Analiza i prezentacja właściwości badanego automatu.

## Uruchomienie i budowa projektu

### Instalacja zależności

```sh
npm install
```

### Uruchomienie w trybie developerskim

```sh
npm run dev
```

### Budowa wersji produkcyjnej

```sh
npm run build
```
