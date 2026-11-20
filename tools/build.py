#!/usr/bin/env python3
"""Generator stron Qmala v2: python3 tools/build.py  (szablony w tools/templates, dane w tools/data.json)."""
import json, time, pathlib
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "tools/data.json").read_text(encoding="utf-8"))

NAV = [
    ("oferta.html", "Oferta", "oferta"),
    ("realizacje.html", "Realizacje", "realizacje"),
    ("referencje.html", "Referencje", "referencje"),
    ("o-firmie.html", "O firmie", "o-firmie"),
    ("praca.html", "Praca", "praca"),
    ("index.html#kontakt", "Kontakt", "kontakt"),
]
if not DATA["praca"].get("widoczna"):
    NAV = [n for n in NAV if n[2] != "praca"]

# sześć obwodów oferty: Q1–Q6 jak oznaczenia aparatów w rozdzielnicy
OFERTA = [
    dict(id="instalacje", q="Q1", nazwa="Instalacje elektryczne", krotko="Instalacje", img="uslugi-instalacje",
         temat="Instalacja elektryczna", opis="Nowe instalacje i modernizacje w domach, biurach i obiektach przemysłowych. Przyjeżdżamy też do awarii.",
         uslugi=["Instalacje w budynkach mieszkalnych", "Instalacje w obiektach przemysłowych", "Instalacje w obiektach użyteczności publicznej", "Usuwanie awarii elektrycznych"]),
    dict(id="rozdzielnice", q="Q2", nazwa="Rozdzielnice", krotko="Rozdzielnice", img="uslugi-rozdzielnice",
         temat="Rozdzielnica", opis="Dobieramy aparaty, kompletujemy rozdzielnicę i montujemy ją na obiekcie.",
         uslugi=["Rozdzielnie elektryczne", "Kompletacja i montaż rozdzielnic nn"]),
    dict(id="automatyka", q="Q3", nazwa="Inteligentny dom i automatyka", krotko="Automatyka LCN", img="uslugi-automatyka",
         temat="Inteligentny dom i automatyka", opis="Światło, rolety i ogrzewanie sterowane z jednego miejsca. Jesteśmy partnerem systemu LCN.",
         uslugi=["Inteligentne domy w systemie LCN", "Systemy automatyki i sterowania"]),
    dict(id="oswietlenie", q="Q4", nazwa="Oświetlenie i iluminacje", krotko="Oświetlenie", img="uslugi-oswietlenie",
         temat="Oświetlenie", opis="Oświetlenie wnętrz, iluminacje elewacji i tereny zewnętrzne, razem z pomiarem natężenia.",
         uslugi=["Oświetlenie dekoracyjne i użytkowe", "Iluminacje elewacji", "Pomiary natężenia oświetlenia"]),
    dict(id="pomiary", q="Q5", nazwa="Projekty, pomiary i odgromy", krotko="Pomiary", img="uslugi-pomiary",
         temat="Projekt, pomiary, przegląd, odgromy", opis="Projekty i protokoły, które przyjmie inspektor nadzoru i ubezpieczyciel.",
         uslugi=["Projekty elektryczne", "Pomiary elektryczne", "Przeglądy okresowe instalacji elektrycznych i odgromowych", "Instalacje odgromowe"]),
    dict(id="sieci", q="Q6", nazwa="Sieci, telewizja i zabezpieczenia", krotko="Niskie prądy", img="uslugi-sieci",
         temat="Sieć, antena, domofon, monitoring", opis="Wszystko, co niskoprądowe, robimy przy okazji jednej wizyty.",
         uslugi=["Sieci komputerowe i telefoniczne (okablowanie strukturalne)", "Anteny telewizji naziemnej i satelitarnej, montaż i strojenie", "Wideofony i domofony", "Monitoring"]),
]

KROKI = [
    dict(n="01", t="Rozmowa", img="krok-rozmowa", p="Pytamy o obiekt, zakres i termin. Jeśli projektu jeszcze nie ma, doradzamy od razu: instalację najtaniej poprawia się na papierze."),
    dict(n="02", t="Wycena", img="krok-wycena", p="Liczymy według KNR albo indywidualnie i pokazujemy, z czego wynika kwota. Cenę można negocjować."),
    dict(n="03", t="Wykonanie", img="krok-wykonanie", p="Zgodnie z projektem i normami, w umówionym terminie. Materiały bierzemy z hurtowni, z którymi współpracujemy, więc płacisz za nie mniej."),
    dict(n="04", t="Pomiary i odbiór", img="krok-odbior", p="Mierzymy instalację, przekazujemy protokoły i dokumentację. Potem możemy wracać na przeglądy okresowe."),
]

FAQ = [
    ("Gdzie pracujecie?", "Najczęściej we Wrocławiu i okolicach, ale realizujemy zlecenia w całej Polsce."),
    ("Jak liczycie cenę?", "Według katalogów KNR albo indywidualnie. Zawsze mówimy, z czego wynika kwota, i można ją negocjować. Wyceny przygotowuje Mirosław Kumala, tel. <a href=\"tel:+48501148733\">501 148 733</a>."),
    ("Przyjeżdżacie do awarii?", "Tak. Zadzwoń pod <a href=\"tel:+48501739926\">501 739 926</a> i powiedz, co się dzieje."),
    ("Kto kupuje materiały?", "Kupujemy je w hurtowniach, z którymi współpracujemy, więc płacisz za nie mniej niż w sklepie."),
    ("Czy dostanę dokumentację i pomiary?", "Tak. Po zakończeniu robót wykonujemy pomiary elektryczne i przekazujemy protokoły. Robimy też przeglądy okresowe."),
    ("Robicie instalacje w zabytkowych budynkach?", "Tak. Pracowaliśmy między innymi w galerii malarstwa Muzeum Narodowego i w zabytkowym budynku klasztornym przy ul. św. Jadwigi we Wrocławiu."),
]


def ico(name, cls=""):
    c = f' class="{cls}"' if cls else ""
    return Markup(f'<svg{c} aria-hidden="true"><use href="#i-{name}"/></svg>')


env = Environment(loader=FileSystemLoader(ROOT / "tools/templates"), autoescape=select_autoescape(["html"]),
                  trim_blocks=True, lstrip_blocks=True)
env.globals.update(ico=ico, nav=NAV, oferta=OFERTA, kroki=KROKI, faq=FAQ, ver=time.strftime("%Y%m%d%H%M"), **DATA)
env.filters["safe_html"] = Markup

PAGES = ["index", "oferta", "realizacje", "referencje", "o-firmie", "praca"]
for p in PAGES:
    if p == "praca" and not DATA["praca"].get("widoczna"):
        (ROOT / "praca.html").unlink(missing_ok=True); continue
    html = env.get_template(f"{p}.html").render(page=p)
    (ROOT / f"{p}.html").write_text(html, encoding="utf-8")
    print("ok", p)
