# Qmala v2: plan redesignu i prompty do Google Flow

Źródło: `FabianAdrianW/Qmala-website` (Eleventy + panel CMS, Netlify).
Cel: `FabianAdrianW/qmala_v2` (repo puste). Wynik końcowy: `index.html` + `assets/v2.css` + `assets/v2.js` + `img/v2/`.
Wzór jakości: Brama Oleśnicka v13 (`fabianadrianw.github.io/Brama-ole-nicka`).

---

## 1. Diagnoza: dlaczego obecna strona wygląda mniej profesjonalnie niż Brama

| Obecny Qmala | Brama (wzór) | Co zmieniamy |
|---|---|---|
| Hero w kolumnach, zdjęcie w ramce z dwoma pływającymi kaflami | Zdjęcie na całą szerokość, lewa strona zdjęcia rozjaśniona i przechodzi w tło, tekst na niej | Pełnoekranowe hero z jednym spokojnym zdjęciem |
| Bento 6 kafli, każdy z ikoną, opisem i 2–5 „pigułkami” | 6 równych kafli ze zdjęciem i jednym podpisem | Kafle usług: zdjęcie + nazwa + jedna linia. Pigułki znikają ze strony głównej (zostają w Ofercie) |
| Zaokrąglenia 24 px, przyciski-pigułki, cień pod przyciskiem | Prawie ostre rogi (4 px), wersaliki z rozstrzeleniem, płasko | Przyciski prostokątne, wersaliki 12 px, `letter-spacing .12em` |
| Nagłówki jednolite | Nagłówek + kursywa w kolorze akcentu („Polecamy *z karty*”) | Newsreader zostaje, dochodzi kursywa w błękicie królewskim |
| Zdjęcia z różnych źródeł, różne światło i kolorystyka | Jedna sesja z Flow: to samo światło, ten sam obiektyw, ta sama paleta | Komplet ~16 grafik z jednym blokiem stylu (sekcja 4) |
| Dużo elementów naraz (marquee, strip, lista, cytaty w pętli, oś czasu) | Jedna myśl na sekcję, dużo powietrza | 9 sekcji, każda z jednym zadaniem |
| Pas cytatów jasno-ciemny na zmianę | Jeden ciemny pas opinii z dużą liczbą | Granatowy pas: „7 listów referencyjnych” + cytaty |

## 2. System wizualny v2 (marka Qmala, układ Brama)

Paleta zostaje z `BRAND.md`, zmienia się tylko jej użycie.

| Token | Wartość | Rola |
|---|---|---|
| `--bg` | #F4F6F9 | tło (chłodny papier zamiast mgły) |
| `--sheet` | #E8EDF3 | sekcje przyciemnione |
| `--card` | #FFFFFF | karty, pasek informacji |
| `--ink` | #0B1626 | tekst, przyciski główne, pas opinii, stopka |
| `--muted` | #55637A | opisy |
| `--accent` | #2350C4 | kursywa w h2, linki, liczby na jasnym |
| `--accent-dark` | #2FE3F2 | tylko na granacie: liczby, kreski, hover |
| `--line` | rgba(11,22,38,.12) | linie prowadzące, ramki |

- Nagłówki: Newsreader 500, h1 ~ clamp(2.8rem, 6vw, 5.2rem), kursywa 400 w `--accent`.
- Tekst: Geist 400/500. Etykiety i przyciski: Geist 600, wersaliki, 12 px, rozstrzelenie .12em.
- Rogi: zdjęcia i karty 6 px, przyciski 4 px. Bez pigułek, bez cieni pod przyciskami.
- Logo: `logo-light.png` w lewym górnym rogu (zgodnie z BRAND.md), `logo-dark.png` w stopce.
- Ruch (jak w Bramie, wyłączany przez `prefers-reduced-motion`): linie h1 wjeżdżają spod maski, zdjęcie hero wyostrza się, tło przycisku wjeżdża od lewej, kafle: zoom zdjęcia, lista „Jak działamy”: zdjęcie po lewej podmienia się z odsłonięciem `clip-path`, liczniki na pasku liczb, cytaty w pętli z pauzą.
- Motyw własny Qmala (odpowiednik „kutej bramy”): cienka linia w błękicie jak przewód, z kropką-zaciskiem na końcu. Używana jako przekładka między sekcjami i jako linia prowadząca w listach. Bez błyskawic i ikon prądu.

## 3. Strona główna v2: kolejność sekcji

1. **Navbar**: logo, Oferta · Realizacje · Referencje · O firmie · Kontakt, przycisk granatowy „☎ 501 739 926”. Przy przewijaniu tło z blur, bez drgania na samej górze (błąd z v1).
2. **Hero** (pełna szerokość, `hero.webp`; na telefonie `hero-m.webp` nad tekstem; opcjonalnie film `hero.mp4`):
   „Instalacje elektryczne *we Wrocławiu od 1978 roku*”, lede o rodzinnym zakładzie, przyciski „Poproś o wycenę →” i „Zadzwoń”.
   Pasek liczb: **1978** rok założenia · **2** pokolenia elektryków · **17** obiektów na liście realizacji.
3. **Pasek informacji** (biała listwa pod hero): Wrocław i cała Polska · Biuro 501 739 926 · Wyceny: Mirosław Kumala 501 148 733.
4. **„Co *robimy*”**: 6 kafli ze zdjęciem (instalacje, rozdzielnice, automatyka LCN, oświetlenie i iluminacje, pomiary i odgromy, sieci i zabezpieczenia), link „Pełna oferta →”.
5. **„Jak *działamy*”**: po lewej duże zdjęcie, po prawej 4 kroki (Rozmowa, Wycena, Wykonanie, Pomiary i odbiór) z linią prowadzącą. Najechanie na krok podmienia zdjęcie. Treść z `o-firmie.njk`.
6. **Granatowy pas „Tak piszą *klienci*”**: po lewej duże „7” i „listów referencyjnych”, po prawej cytaty w pętli (Zgromadzenie Córek Maryi Wspomożycielki, ANPA Techniki Oświetleniowe), link „Wszystkie referencje →”.
7. **„Zaufały nam *uczelnie i muzeum*”**: 3 wyróżnione realizacje (prawdziwe zdjęcia EIT+, Politechnika C-15, Muzeum Narodowe) + lista pozostałych z rokiem na linii prowadzącej. Tylko prawdziwe zdjęcia.
8. **„Dwa pokolenia, *jeden zakład*”**: tekst (1978 Mirosław, 1999 Wojciech) + kolaż 3 zdjęć z podpisami.
9. **Dwa panele**: „Dla domu” i „Dla firm i instytucji”, każdy ze zdjęciem i linkiem.
10. **„Zanim *zadzwonisz*”** (FAQ, 4–5 pytań z faktów: zasięg, KNR i negocjacja ceny, awarie, LCN, dokumentacja). Pytania bez potwierdzonej odpowiedzi oznaczone `[DO UZUPEŁNIENIA]`.
11. **Wycena i kontakt**: formularz (imię, telefon, e-mail, opis), wysyłka bez otwierania poczty; obok telefony i dane firmy.
12. **Stopka granatowa** + dolny pasek na telefonie: „Zadzwoń” / „Wycena”.
    Dopisek: „Zdjęcia w sekcjach usług mają charakter poglądowy. Realizacje to prawdziwe obiekty.”

Podstrony (Oferta, Realizacje, Referencje, O firmie) dostają ten sam nagłówek, nawigację i stopkę w drugiej partii pracy.

## 4. Grafiki z Google Flow

### Zasady
- Wszystkie prompty po angielsku (Flow lepiej je rozumie). Do każdego doklej **blok stylu** poniżej, bez zmian. To on daje spójność jak w Bramie.
- Generuj po 4 warianty, wybierz 1. Jeśli Flow pozwala na obraz referencyjny („ingredients”), po wybraniu hero dawaj go jako referencję stylu do kolejnych.
- Ludzie: tylko dłonie i sylwetki tyłem, bez twarzy w ostrości. Bez napisów, logo, marek na sprzęcie.
- Hero bez rozdzielnicy (było odrzucone w v1).
- Pobieraj w najwyższej rozdzielczości, nazwy plików jak w tabeli. Konwersję do WebP i przycięcie robię ja.

### Blok stylu (doklej na końcu każdego promptu)
```
Editorial architectural photography, shot on a full-frame camera with a 35mm lens, natural soft daylight from a large window, cool neutral palette: off-white walls, deep navy, brushed steel and light oak, one subtle royal-blue accent, gentle contrast, realistic materials and textures, clean and orderly, calm premium mood, shallow depth of field, no text, no logos, no brand names, no watermarks, no visible faces.
```

### 4.1 Hero
| Plik | Proporcje | Prompt |
|---|---|---|
| `hero.png` | 16:9 | A freshly finished minimalist apartment hallway opening into a living room in a renovated Wrocław tenement, high ceiling with a slim recessed linear LED line glowing softly, matte white flush wall switches, light oak floor. Composition: all detail in the right two thirds, the left third is a calm, almost empty, bright off-white wall fading to near white, giving space for a headline. Late afternoon light. |
| `hero-m.png` | 9:16 | Same minimalist hallway with a slim recessed linear LED line on the high ceiling, vertical composition, the light line leading the eye from the top of the frame into the room, matte white wall switch in the lower third, bright and airy, light oak floor. |

### 4.2 Film do hero (opcjonalnie, Veo w Flow, 8 s, bez dźwięku)
| Plik | Proporcje | Prompt |
|---|---|---|
| `hero.mp4` | 16:9 | Start from the hero image. Very slow forward dolly along the hallway. The recessed linear LED lights in the ceiling switch on one after another from the back of the room toward the camera, each with a soft warm-white fade-in. Subtle dust in the window light. No people, no camera shake, no flicker, seamless calm motion. |
| `hero-m.mp4` | 9:16 | Start from the vertical hero image. Slow upward tilt following the ceiling light line while the LED segments switch on one by one with a soft fade-in. Calm, no people, no flicker. |

### 4.3 Kafle usług „Co robimy” (1:1)
| Plik | Prompt |
|---|---|
| `uslugi-instalacje.png` | Close-up of an electrician's hands in clean work gloves feeding neatly stripped copper wires into a flush-mounted wall box in a freshly plastered white wall, a coil of white cable and a wire stripper on a step below, orderly and precise. |
| `uslugi-rozdzielnice.png` | Close-up of a newly assembled residential distribution board with a single row of white modular breakers on a DIN rail, wires combed perfectly straight and labeled with blank tags, open steel door with navy inner panel, soft side light. |
| `uslugi-automatyka.png` | A slim glass smart-home wall touch panel mounted at eye level in a modern hallway, the screen showing abstract soft blue tiles without any readable text, next to matching matte white switches, evening ambient light in the room behind. |
| `uslugi-oswietlenie.png` | A historic red-brick neo-gothic building facade in Wrocław at blue hour, discreetly illuminated with warm white wall-washer lights from below, deep navy sky, a few lit windows, calm empty street in front. |
| `uslugi-pomiary.png` | A gloved hand holding a professional multifunction installation tester with test probes touching a wall socket, the device screen showing only abstract bars without readable digits, a folder with blank measurement protocol forms on a table in the background. |
| `uslugi-sieci.png` | Close-up of a server rack patch panel with neatly bundled navy and light-grey network cables in perfect parallel lines, velcro ties, cool daylight, a small part of a clean technical room in soft focus. |

### 4.4 „Jak działamy” (4:3, podmieniane na hover)
| Plik | Prompt |
|---|---|
| `krok-rozmowa.png` | Top-down view of a light oak desk with an architectural floor plan printed in fine navy lines, a pencil, a ruler and a smartphone lying face down, a cup of coffee at the edge, morning daylight. |
| `krok-wycena.png` | A printed cost estimate sheet with blank tables (no readable text) on a clipboard, resting on rolled building plans, a calculator and a pen beside it, soft window light, orderly desk. |
| `krok-wykonanie.png` | Interior of a building under construction: bare concrete ceiling with neatly routed grey electrical conduits and junction boxes in straight parallel lines, a stepladder in the corner, daylight from large openings. |
| `krok-odbior.png` | A finished bright office room with recessed ceiling lights switched on, in the foreground on a clean desk a closed navy folder and an installation tester placed neatly side by side, sense of completion. |

### 4.5 „Dwa pokolenia, jeden zakład” (kolaż)
| Plik | Proporcje | Prompt |
|---|---|---|
| `firma-dlonie.png` | 3:4 | Two pairs of hands over an electrical floor plan on a workbench: one older, weathered hand pointing at the plan, one younger hand holding a pencil, warm workshop light, sense of passing on the craft. |
| `firma-warsztat.png` | 1:1 | A well-used but tidy electrician's workbench: vintage screwdrivers with worn wooden handles next to modern insulated tools, a small vise, wire spools on a pegboard behind, soft light. |
| `firma-przelaczniki.png` | 1:1 | An old round brown bakelite rotary light switch mounted next to a modern flat matte white switch on the same off-white wall, side light showing texture, symbolic of two generations. |

### 4.6 Panele „Dla domu” / „Dla firm i instytucji” (16:9)
| Plik | Prompt |
|---|---|
| `panel-dom.png` | A cozy modern living room in a single-family house at dusk, warm indirect lighting from ceiling coves and a floor lamp, large window showing a navy evening sky and garden, nobody in the room. |
| `panel-firmy.png` | A long modern university or research building corridor with rhythmic linear ceiling lights, glass walls of labs on one side, polished concrete floor, a person walking away in the far distance as a small silhouette. |

### 4.7 Czego nie generujemy
- Realizacje (EIT+, Politechnika, Muzeum i reszta): tylko prawdziwe zdjęcia z obecnego repo i z qmala.pl.
- Logo, favicon: zostają z `src/assets/brand/`.
- Tła sekcji i motyw przewodu: SVG/CSS, lżejsze niż grafika.
- `og.jpg`: wytnę z `hero.png` z logo.

Razem: 2 hero + 2 filmy (opcja) + 6 + 4 + 3 + 2 = **17 grafik**.

## 5. Kolejność pracy

1. Ty: generujesz grafiki z sekcji 4 i wrzucasz je tutaj (albo do folderu na komputerze, który mi udostępnisz).
2. Ja: konwersja do WebP (1600/800 px), przycięcia, `og.jpg`.
3. Ja: `index.html` + `assets/v2.css` + `assets/v2.js` w `qmala_v2`, dane z obecnego repo (telefony, realizacje, referencje, kroki).
4. Ja: kontrola w przeglądarce: 390 / 1440 / 3840 px, zoom 50–200%, kontrast, `prefers-reduced-motion`, Lighthouse.
5. Commit i push do `qmala_v2`, plik `index.html` wysłany tutaj.
6. Partia 2 (po akceptacji wyglądu): podstrony w tym samym stylu.

## 6. Decyzje do potwierdzenia

1. **Hosting i formularz.** Obecny formularz używa Netlify Forms. Na GitHub Pages nie zadziała.
   Domyślnie: v2 jako statyczne pliki, podpinam nowy projekt Netlify do `qmala_v2` i formularz działa jak teraz.
2. **Panel CMS.** v2 to statyczny `index.html`, więc klient nie będzie edytował realizacji i zakładki „Zatrudniamy” przez panel.
   Domyślnie: najpierw statyczny index do akceptacji wyglądu, potem przenoszę go do szablonów Eleventy z panelem (partia 2).
3. **Paleta.** Domyślnie chłodna paleta marki (sekcja 2). Alternatywa: ciepła biel jak w Bramie, granat bez zmian.
