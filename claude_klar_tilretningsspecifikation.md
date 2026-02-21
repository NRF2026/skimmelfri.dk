# Claude‑klar tilretningsspecifikation (skimmelfri.dk)

**Formål:** Implementér de konkrete ændringer nedenfor i GitHub‑repoet for skimmelfri.dk, så siden fremstår mere troværdig og professionel, har udfyldte undersider med relevant viden, og undgår ansvarspådragende juridisk/medicinsk rådgivning.

**Vigtigst (må ikke brydes):**
- Siden må **ikke** beskrive sig som “non‑profit” eller “ikke‑kommerciel”. Den må kun beskrive sig som en side, der **samler og formidler** viden og råd fra pålidelige kilder.
- Teksten må **ikke** give personlig medicinsk/juridisk rådgivning. Brug neutralt sprog: “kan”, “typisk”, “ofte”, “overvej”, “søg professionel hjælp”.
- “Om siden”: Forfatteren er en familiefar ved navn **Nils**, med **tre børn**, der har haft en **generel bekymring** for dårligt indeklima og skimmelsvamp (ingen påstand om konkrete egne skimmelsager).
- Ingen affiliate‑links, ingen brand‑anbefalinger, ingen absolutte løfter.

---

## 0) Arbejdsplan (sådan skal du løse opgaven)
1. Scan repoet for eksisterende sider og navigation (menu/links) og identificér 404/ikke‑eksisterende links.
2. Opret manglende undersider og fyld dem med indhold iht. kravene herunder.
3. Opdatér navigation, kort, interne links og “relaterede artikler”, så alt peger korrekt.
4. Forbedr design (CSS) med få, sikre greb (hero‑billede, kort, infobokse).
5. Tilføj billeder (rettighedsfrie eller AI‑genererede) med alt‑tekster.
6. Kør lokal link‑check (simpel script eller manuel) og ret døde interne links.

---

## 1) Globale tekstkrav (gælder alle sider)
### 1.1 Tone & disclaimers
- Indsæt en kort, ens disclaimer på alle artikelsider (øverst eller nederst):
  - “Denne side samler og formidler generel viden om indeklima og skimmelsvamp. Indholdet kan ikke erstatte professionel vurdering, juridisk rådgivning eller lægefaglig rådgivning.”
- Undgå imperativer som “du skal”. Brug “det kan være en god idé at…”.
- Brug “kontakt fagperson/byggesagkyndig/læge” ved usikkerhed eller ved større problemer.

### 1.2 Kilder
- Tilføj nederst på hver artikel en sektion: **Kilder** med 3–7 links til relevante kilder.
- Brug primært danske, anerkendte kilder (Sundhedsstyrelsen, Bolius, skimmel.dk, CISBO/BUILD, Danvak, Teknologisk Institut, Astma‑Allergi Danmark).

### 1.3 Struktur
- H1 (side‑titel), kort intro (2–4 linjer), derefter H2‑afsnit + punktopstillinger.
- Tilføj “Sidst opdateret: YYYY‑MM‑DD” nederst.

---

## 2) Informationsarkitektur (opret/udfyld alle disse sider)
> Brug repoets eksisterende mappe‑struktur (forebyg/, find/, fjern/, ressourcer/, produkter/, om/ osv.). Hvis en side allerede findes, så udbyg den – ikke slet den.

### 2.1 Forebyg (forebyg/)
Opret/udfyld:
- `forebyg/hvad-er-skimmelsvamp.html`
- `forebyg/ventilation-og-udluftning.html`
- `forebyg/opvarmning-og-fugt.html`
- `forebyg/undga-fugtige-aktiviteter.html`
- `forebyg/rengoring-og-indeklimavaner.html`
- `forebyg/fugt-og-indeklima.html`

Indholdskrav (kort):
- Forklar sammenhænge: fugt → risiko for skimmel, kondens, temperatur.
- Hygrometer og relativ fugt (typiske intervaller) – formuler neutralt.
- Praktiske vaner: udluftning, udsugning, tørring efter bad/køkken, undgå tøjtørring inde.

### 2.2 Find (find/)
Opret/udfyld:
- `find/tegn-pa-skimmelsvamp.html`
- `find/risici-og-helbredssymptomer.html`
- `find/aftryksplader.html`
- `find/mycometer-test.html`
- `find/luftmaling.html`
- `find/dna-test.html`
- `find/skimmel-i-bygningsmaterialer.html`

Indholdskrav:
- Tjekliste (synlige tegn, lugt, kondens, kolde hjørner, bag møbler).
- Testmetoder: forklar hvad de kan/ikke kan. Understreg at enkelte test ikke altid kan stå alene.
- Helbred: nævn typiske gener og at man bør tale med læge ved vedvarende symptomer.

### 2.3 Fjern (fjern/)
Opret/udfyld:
- `fjern/hvornaar-reagere.html`
- `fjern/fjern-mindre-angreb.html`
- `fjern/fjern-storre-angreb.html`
- `fjern/forsikring.html`

Indholdskrav:
- Skema/infoboks: hvornår kan man typisk selv rengøre vs. hvornår fagfolk er relevant.
- “Fjern mindre angreb”: trin‑for‑trin med fokus på at stoppe fugtkilden, rengøring og tørring, sikkerhed (handsker/udluftning), og at porøse materialer kan kræve udskiftning.
- “Fjern større angreb”: beskriv principper for professionel sanering på et højt niveau (ingen farlige instruktioner).
- “Forsikring”: neutrale formuleringer: “kan afhænge af”, “kontakt dit selskab”.

---

## 3) Navigation og interne links
### 3.1 Topmenu og under‑nav
- Sørg for at menupunkter (Forebyg/Find/Fjern/Ressourcer/Produkter/Om) peger på eksisterende index‑sider.
- På hver kategori‑index (`forebyg/index.html`, `find/index.html`, `fjern/index.html`) skal der være:
  - Liste/kort til alle undersider i kategorien
  - Korte teasers + “Læs mere” link

### 3.2 “Relaterede artikler”
- På hver artikelside: 3 interne links til relevante sider (samme eller nabokategori).

### 3.3 Link‑kvalitet
- Eksterne links på `ressourcer/` skal åbne i nyt faneblad:
  - `target="_blank" rel="noopener noreferrer"`

---

## 4) Design‑løft (CSS + layout) – uden store frameworks
### 4.1 Forside hero
- Tilføj hero‑billede (rettighedsfrit/AI) med overlay og tydelig H1 + undertitel.
- Behold enkel, rolig stil (skandinavisk).

### 4.2 Kort og infobokse
- Gør forside‑kort tydeligere med skygge, padding, hover, ikoner.
- Indfør 2 genbrugelige komponent‑klasser:
  - `.info-box` (neutral)
  - `.warning-box` (blid advarsel, ikke alarmistisk)

### 4.3 Typografi
- Stram linjeafstand, max‑bredde på tekst (fx 70–80 tegn) og luft mellem afsnit.

---

## 5) Billeder
- Opret `img/` mappe og tilføj mindst:
  - `img/hero-ventilation.png`
  - `img/hygrometer.png`
  - `img/cleaning-tiles.png`
- Alle billeder skal have meningsfuld alt‑tekst.
- Hvis du genererer AI‑billeder, gem dem i repoet og brug dem direkte i HTML.

---

## 6) “Om siden” (om/)
Opdatér `om/index.html` (eller relevant fil):
- Historie:
  - “Nils er familiefar med tre børn. Han har gennem tiden haft en generel bekymring for indeklima og skimmelsvamp, og har derfor samlet viden fra pålidelige kilder i én overskuelig guide.”
- Tydeliggør:
  - at siden samler/formidler viden
  - at man bør bruge officielle/autoritative kilder og fagfolk ved tvivl
- Tilføj kort “Kontakt” sektion (mail‑link eller formular hvis allerede findes). Ingen løfter om svar‑tid.

---

## 7) Ressourcer (ressourcer/)
- Behold kategorierne, men:
  - tjek at alle links virker
  - tilføj 1–2 linjer “hvad kan du bruge kilden til” pr. link
  - undgå “uvildig/non‑profit”‑sprog; brug “anerkendt”, “officiel”, “faglig”.

---

## 8) Done‑kriterier (Definition of Done)
- Ingen interne 404‑links fra menu eller kategori‑index.
- Alle listede undersider findes og har:
  - H1 + intro + H2‑afsnit + “Kilder” + “Sidst opdateret”.
- “Om”‑side opfylder Nils‑kravene og bruger ikke konkrete egne skimmelsager.
- Siden nævner ikke “non‑profit”, “ikke‑kommerciel” eller lignende.
- Minimum 3 billeder integreret og alt‑tekster på alle.
