# Qmala v2

Statyczna strona Zakładu Elektro-Instalacyjnego Wojciech Kumala (qmala.pl).

## Edycja
Strony HTML w katalogu głównym są generowane. Zmieniaj szablony i dane, potem przebuduj:

```bash
pip install jinja2
python3 tools/build.py
```

- `tools/data.json`: realizacje (z listą zdjęć), referencje, dane firmy, zakładka „Praca” (`praca.widoczna`).
- `tools/build.py`: oferta (obwody Q1–Q6), kroki „Jak działamy”, FAQ, nawigacja.
- `tools/templates/`: szablony stron (`_kontakt.html`, `_jak.html`, `_m.html` są wspólne).
- `assets/site.css`, `assets/site.js`: wygląd i zachowanie wszystkich stron.

## System
- Motyw: rozdzielnica i schemat. Granat marki, błękit jako akcja na jasnym tle, cyjan jako „prąd” na ciemnym.
- Skala 80% przez `--z` (rozmiar fontu `html`), na telefonach `--z: 1`.
- Na komputerze każda sekcja strony głównej zajmuje dokładnie jeden ekran (także 1366×768 i 1024×768).
- Formularze (wycena, CV) wysyłają przez Netlify Forms bez otwierania poczty; przy błędzie link „Napisz z własnej poczty”.
- Zdjęcia realizacji i skany referencji ładują się z qmala.pl/images (jak w poprzedniej wersji). Brakujący plik chowa kafel.
- Zdjęcia usług, kroków i pracowni: Google Flow, poglądowe (dopisek w stopce).
