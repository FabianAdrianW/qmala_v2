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

# sześć obszarów oferty (ikony liniowe jak na poprzedniej stronie)
OFERTA = [
    dict(id="instalacje", q="01", ico=Markup('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'), nazwa="Instalacje elektryczne", krotko="Instalacje", img="uslugi-instalacje",
         temat="Instalacja elektryczna", opis="Nowe instalacje i modernizacje w domach, biurach i obiektach przemysłowych. Przyjeżdżamy też do awarii.",
         uslugi=["Instalacje w budynkach mieszkalnych", "Instalacje w obiektach przemysłowych", "Instalacje w obiektach użyteczności publicznej", "Usuwanie awarii elektrycznych"]),
    dict(id="rozdzielnice", q="02", ico=Markup('<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8.5 8v4M12 8v4M15.5 8v4M8 16.5h8"/>'), nazwa="Rozdzielnice", krotko="Rozdzielnice", img="uslugi-rozdzielnice",
         temat="Rozdzielnica", opis="Dobieramy aparaty, kompletujemy rozdzielnicę i montujemy ją na obiekcie.",
         uslugi=["Rozdzielnie elektryczne", "Kompletacja i montaż rozdzielnic nn"]),
    dict(id="automatyka", q="03", ico=Markup('<path d="M3 11.5 12 4l9 7.5V20H3z"/><path d="M9 15.5a4.2 4.2 0 0 1 6 0"/><circle cx="12" cy="17.6" r=".6" fill="currentColor"/>'), nazwa="Inteligentny dom i automatyka", krotko="Automatyka LCN", img="uslugi-automatyka",
         temat="Inteligentny dom i automatyka", opis="Światło, rolety i ogrzewanie sterowane z jednego miejsca. Jesteśmy partnerem systemu LCN.",
         uslugi=["Inteligentne domy w systemie LCN", "Systemy automatyki i sterowania"]),
    dict(id="oswietlenie", q="04", ico=Markup('<path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-4 10.5c.7.7 1.1 1.5 1.1 2.5h5.8c0-1 .4-1.8 1.1-2.5A6 6 0 0 0 12 3z"/>'), nazwa="Oświetlenie i iluminacje", krotko="Oświetlenie", img="uslugi-oswietlenie",
         temat="Oświetlenie", opis="Oświetlenie wnętrz, iluminacje elewacji i tereny zewnętrzne, razem z pomiarem natężenia.",
         uslugi=["Oświetlenie dekoracyjne i użytkowe", "Iluminacje elewacji", "Pomiary natężenia oświetlenia"]),
    dict(id="pomiary", q="05", ico=Markup('<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5.5"/><circle cx="12" cy="16" r="1.3" fill="currentColor"/>'), nazwa="Projekty, pomiary i odgromy", krotko="Pomiary", img="uslugi-pomiary",
         temat="Projekt, pomiary, przegląd, odgromy", opis="Projekty i protokoły, które przyjmie inspektor nadzoru i ubezpieczyciel.",
         uslugi=["Projekty elektryczne", "Pomiary elektryczne", "Przeglądy okresowe instalacji elektrycznych i odgromowych", "Instalacje odgromowe"]),
    dict(id="sieci", q="06", ico=Markup('<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2V13M12 13l-5.6 4.2M12 13l5.6 4.2"/>'), nazwa="Sieci, telewizja i zabezpieczenia", krotko="Niskie prądy", img="uslugi-sieci",
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


# kategorie realizacji (strona Realizacje: filtry)
KAT = {"nauka": "Nauka i uczelnie", "kultura": "Kultura i zabytki", "szkoly": "Szkoły", "mieszkania": "Osiedla", "firmy": "Firmy i usługi"}
KAT_OBIEKTU = {
    "2015-1-eit": "nauka", "2015-2-politechnika-c15": "nauka", "2012-2-politechnika-e1": "nauka", "2012-5-hirszfeld": "nauka",
    "2013-2-muzeum-narodowe": "kultura", "2013-3-klasztor": "kultura",
    "2013-4-lo7": "szkoly", "2012-3-gimnazjum-15": "szkoly", "2012-4-lo1": "szkoly", "2011-1-sp73": "szkoly",
    "2013-1-ogrody-grabiszynskie": "mieszkania", "2012-1-potokowa": "mieszkania", "2011-3-koreanska": "mieszkania",
    "2014-1-siedlec": "firmy", "2014-2-bykow": "firmy", "2011-2-rysia": "firmy", "stale-barton": "firmy",
}
for r in DATA["realizacje"]:
    r["kat"] = KAT_OBIEKTU.get(r["slug"], "firmy")


def ico(name, cls=""):
    c = f' class="{cls}"' if cls else ""
    return Markup(f'<svg{c} aria-hidden="true"><use href="#i-{name}"/></svg>')


env = Environment(loader=FileSystemLoader(ROOT / "tools/templates"), autoescape=select_autoescape(["html"]),
                  trim_blocks=True, lstrip_blocks=True)
env.globals.update(ico=ico, nav=NAV, kat=KAT, oferta=OFERTA, kroki=KROKI, faq=FAQ, ver=time.strftime("%Y%m%d%H%M"), **DATA)
env.filters["safe_html"] = Markup


def pl(n, one, few, many):
    if n == 1: return f"{n} {one}"
    if n % 10 in (2, 3, 4) and n % 100 not in (12, 13, 14): return f"{n} {few}"
    return f"{n} {many}"


env.filters["pl"] = pl

PAGES = ["index", "oferta", "realizacje", "referencje", "o-firmie", "praca"]
for p in PAGES:
    if p == "praca" and not DATA["praca"].get("widoczna"):
        (ROOT / "praca.html").unlink(missing_ok=True); continue
    html = env.get_template(f"{p}.html").render(page=p)
    (ROOT / f"{p}.html").write_text(html, encoding="utf-8")
    print("ok", p)
