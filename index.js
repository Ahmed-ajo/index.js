"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("submit-button"); // const damit die Variable nicht für eine andere Referenz wiederverwendet werden kann. (beugt verwirrung vor)
    const siteName = document.getElementById("site-name"); // document. bezieht sich auf das komplette html dokument
    const apiUrl = document.getElementById("api-endpoint"); // getElementbyID zum erzeugen der Referenz
    const navTitle = document.getElementById("navbar_title");
    const navLinks = document.getElementById("navbar_links");
    const content = document.getElementById("main-content");
    const buttonColors = {}; // Leeres Objekt, um Button-Farben zu speichern; Record<> Stellt sicher, dass buttonColors nur Werte und Schlüssel vom Typen string haben kann.
    console.log("Hello world");
    btn.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault(); // Verhindert das neu laden der Seite, bevor die if Anweisung ausgeführt wurde. ; e ist der Name für das Event-Objekt.
        navTitle.textContent = siteName.value.trim().length > 20
            ? `${siteName.value.trim().substring(0, 20)}...`
            : siteName.value.trim();
        if (!apiUrl.value.trim()) { // Wenn das Eingabefeld für die API leer ist, wird die Meldung ausgegeben.
            alert("Bitte geben Sie eine gültige URL ein.");
            return;
        }
        setRandomBtnClass(btn);
        try {
            const res = yield fetch(apiUrl.value.trim()); // Die API-Request wird gesendet und auf eine Antwort gewartet.
            if (!res.ok)
                throw new Error("API-Daten nicht abrufbar."); // Wenn !res true ist, also res false, kommt eine Fehlermeldung.
            const data = yield res.json(); // Die Antwort wird als JSON konvertiert und die relevanten Links werden extrahiert, um später dynamische Navigationselemente zu erstellen.
            const { products_link, customer_link, orders_link, vendors_link } = data.links;
            // Dieser Abschnitt generiert eine Liste von Links, die aus der API abgerufen werden, diese werden in der Navigation der Webseite angezeigt.
            navLinks.innerHTML = `
        <li style="display: inline-block; margin-right: 15px;">
    <a href="https://api.predic8.de${products_link}" id="products">Products</a>
  </li>
  <li style="display: inline-block; margin-right: 15px;">
    <a href="https://api.predic8.de${vendors_link}" id="vendors">Vendors</a>
  </li>
  <li style="display: inline-block; margin-right: 15px;">
    <a href="https://api.predic8.de${orders_link}" id="orders">Orders</a>
  </li>
  <li style="display: inline-block; margin-right: 15px;">
    <a href="https://api.predic8.de${customer_link}" id="customers">Customers</a>
  </li>
      `; // Erlaubt mehrzeilige Strings, also den HTML String.
            ["products", "vendors", "orders", "customers"].forEach((id) => {
                var _a;
                if (!buttonColors[id]) { // Hier wird geprüft, ob eine id bereits eine Farbe im buttonColor-Objekt gespeichert hat,
                    buttonColors[id] = getRandomButtonClass(); // wenn nicht wird eine zufällige Klasse zuwgewiesen.
                }
                (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (evt) => __awaiter(void 0, void 0, void 0, function* () {
                    evt.preventDefault(); // Wenn auf einen der Links gecklickt wird, wird die Navigation verhindert und es wird die Funktion appendData aufgerufen, um die Daten von der URL zu laden, die im hrefe des Links angegeben sind.
                    yield appendData(evt.target.href, id, content, buttonColors[id]); // auch die passende Button-Farbe und das Ziel HTML-Element für die Anzeige wird übergeben.
                }));
            });
        }
        catch (err) { // Falls ein Fehler im try-Block auftritt, wird die Fehlermeldung im catch-Block ausgeführt.
            console.error(err);
            alert("Fehler beim Abrufen der API."); // alert zeigt eine Pop-up-Nachricht im Browser an.
        }
    }));
});
// Funktion zum Abrufen von Daten aus der API und zur Darstellung der Ergebnisse im HTML.
function appendData(url, entity, container, buttonClass) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(url); // API-Daten werden mit fetch() abgerufen
            if (!res.ok)
                throw new Error("Daten nicht geladen."); // Wenn die Daten nicht ankommen, wird eine Fehlermeldung ausgegeben.
            const json = yield res.json(); // Die Antwort wird in ein JSON-Objekt umgewandelt.
            const arr = json[entity] || []; // Der Array wird aus dem JSON genommen, für z.B. "products", falls er nicht exisitiert, wird ein leerer Arrary zugewiesen.
            const section = document.createElement("div"); // Ein neues div-Element, das später die Daten enthalten wird, wird erstellt.
            section.innerHTML = `<h3>Übersicht ${entity}</h3>`; // In das div-Element wird eine h3-Überschrift mit dem Namen der Entität hinzugefügt.
            section.innerHTML += arr.length ? (entity === "orders" ? createOrdersTable(arr, buttonClass) : createDefaultTable(arr, buttonClass)) : "Keine Daten vorhanden."; // Falls Daten vorhanden sind -> in Tabelle einfügen, falls nicht -> Fehlermeldung.
            container.appendChild(section); // Das div-Element, wird an das Container-HTML-Element angehängt.
            section.querySelectorAll(".details-button").forEach((btn) => {
                btn.classList.add(buttonClass); // Eine CSS-Klasse wird dem Button hinzugefügt.
                btn.addEventListener("click", (evt) => __awaiter(this, void 0, void 0, function* () {
                    const detailUrl = evt.target.getAttribute("data-detail-url");
                    if (detailUrl)
                        yield showDetails(detailUrl); // Wenn die Detail-URL vorhanden ist, wird eine Funktion showDetails aufgerufen, um detaillierte Informationen zu dem Datensatz anzuzeigen.
                }));
            });
        }
        catch (err) { // Falls während des try-Blocks ein Fehler auftritt, wird die Fehlermeldung ausgegeben.
            console.error(err);
            alert("Fehler beim Laden der Daten.");
        }
    });
}
// Die Funktion erstellt eine HTML-Tabelle mit den Daten der API und stellt für jedes Element einen "Details"-Button bereit, der eine URL zu den Informationen enthält.
function createDefaultTable(data, buttonClass) {
    return `
    <table class="table table-striped">
      <thead><tr><th>ID</th><th>Name</th><th>Aktion</th></tr></thead>
      <tbody>
        ${data.map((item) => {
        var _a, _b;
        return `
            <tr>
              <td>${(_a = item.id) !== null && _a !== void 0 ? _a : "-"}</td>
              <td>${(_b = item.name) !== null && _b !== void 0 ? _b : "-"}</td>
              <td>
                <button class="btn details-button ${buttonClass}" 
                  data-detail-url="https://api.predic8.de${item.self_link}">
                  Details
                </button>
              </td>
            </tr>
          `;
    })
        .join("")}
      </tbody>
    </table>
  `;
}
// Die Funktion nimmt ein Array von data und erstellt für jede Bestellung eine Tabellenzeile mit den Informationen und fügt jeder Bestellung einen "Details" Button hinzu.
function createOrdersTable(data, buttonClass) {
    return `
    <table class="table table-striped">
      <thead><tr><th>ID</th><th>Status</th><th>Artikel</th><th>Kunde</th><th>Aktion</th></tr></thead>
      <tbody>
        ${data.map((o) => {
        var _a, _b, _c, _d;
        return `
            <tr>
              <td>${o.id}</td>
              <td>${o.state}</td>
              <td>${"Prod=" + (((_a = o.items[0]) === null || _a === void 0 ? void 0 : _a.product_id) || "-")} (Qty=${((_b = o.items[1]) === null || _b === void 0 ? void 0 : _b.quantity) || 0})</td>
              <td>${((_c = o.customer) === null || _c === void 0 ? void 0 : _c.firstname) || ""} ${((_d = o.customer) === null || _d === void 0 ? void 0 : _d.lastname) || ""}</td>
              <td>
                <button class="btn details-button ${buttonClass}" data-detail-url="https://api.predic8.de/shop/v2/orders">
                  Details
                </button>
              </td>
            </tr>
          `;
    })
        .join("")}
      </tbody>
    </table>
  `;
}
function showDetails(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(url);
            if (!res.ok)
                throw new Error("Details konnten nicht geladen werden.");
            const details = yield res.json(); // Die Antwort des Servers (die als res gepeichert ist) wird in ein JSON-Objekt umgewandelt; Durch await wartet der Code bis die JSON-Daten verfügbar sind.
            const modalBody = document.getElementById("detailsModal_body");
            modalBody.innerHTML = `<pre>${JSON.stringify(details, null, 2)}</pre>`; // details-Objekt wird in JSON umgewandelt, pre-Tag sorgt für formatierte Ausgabe (leserlicher)
            const modal = new window.bootstrap.Modal(document.getElementById("detailsModal")); // Ein neues Modal-Objekt wird erstellt.
            modal.show(); // Das Modal wird sichtbar, das zuvor mit HTML-Element detailsModal verknüpft wurde.
        }
        catch (e) {
            console.error(e); // Falls ein Fehler auftritt, wird dieser in der Konsole ausgegeben.
        }
    });
}
// Die Funktion weist einem Button eine zufällige Bootstrap-Klassenfarbe zu.
function setRandomBtnClass(btn) {
    const classes = ["btn-primary", "btn-secondary", "btn-success", "btn-danger", "btn-warning", "btn-info"]; // Array mit den verschiedenen Bootstrap-Klassen für die Farbe des Buttons.
    btn.classList.remove(...classes); // Entfernt alle vordefinierten Klassen vom Button.
    btn.classList.add(classes[Math.floor(Math.random() * classes.length)]); // Dem Button wird eine zufällige Klasse aus dem classes Array hinzugefügt. Math.random erzeugt die Zufällige Zahl und Math.floor rundet die Zahl ab, damit ein gültiger Index aus dem Array generiert wird.
}
// Die Funktion gibt eine zufällige Button-Klasse zurück.
function getRandomButtonClass() {
    const classes = ["btn-primary", "btn-secondary", "btn-success", "btn-danger", "btn-warning", "btn-info"];
    return classes[Math.floor(Math.random() * classes.length)];
}
