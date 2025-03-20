// Selecteert alle kaarten
const kaarten = document.querySelectorAll('.memoryKaarten');

//  De staat van een omgedraaide kaart
let kaartGedraaid = false;

//  Voorkomt dat de spelers meer dan 2 kaarten tegelijk kunnen omdraaien
let kaartenOpSlot = false;

// Variabelen om de eerste en tweede geklikte kaart in op te slaan
let eersteKaart, tweedeKaart;

//  Soundeffects 
const misMatchGeluid = new Audio("sound/wrong.mp3"); 
const isMatchGeluid = new Audio("sound/correct.mp3"); 
const verlorenGeluid = new Audio("sound/defeat.mp3"); 
const gewonnenGeluid = new Audio("sound/victory.mp3"); 

//  Timer 
let tijdOver = 60; // Start met 60 seconden
let timerElement = document.getElementById("timer");
let timerGestart = false; // Houdt bij of de timer al is gestart
let timer; // Variabele om de timer bij te houden

//  Start de timer wanneer de eerste kaart wordt omgedraaid
function startTimer() {
    timer = setInterval(() => {
        tijdOver--; // Verminder de tijd met 1 seconde
        timerElement.innerText = `Tijd resterend: ${tijdOver}s`; 

        
        if (tijdOver <= 0) {
            clearInterval(timer); // Stop de timer
            eindeSpel(false); // Roep de functie aan met 'false' (verloren)
        }
    }, 1000); // De functie wordt elke seconde uitgevoerd
}

// Controleert of de speler gewonnen of verloren heeft
function eindeSpel(gewonnen) {
    clearInterval(timer); // Stop de timer

    if (gewonnen) {
        gewonnenGeluid.play(); // Speelt een overwinningsgeluid af
    } else {
        verlorenGeluid.play(); // Speelt een verliesgeluid af
    }

    // Wacht een halve seconden zodat het geluid afgespeeld wordt voordat de alert verschijnt
    setTimeout(() => {
        alert(gewonnen 
            ? `Gefeliciteerd! Je hebt gewonnen met nog ${tijdOver} seconden over!` 
            : "Tijd is op! Probeer het opnieuw.");
        
        location.reload(); // De pagina word herladen zodat je opnieuw kunt spelen 
    }, 500);
}

// Kaart wordt omgedraaid bij klik
function kaartDraaien() {
    if (kaartenOpSlot || this === eersteKaart) return; // zorgt ervoor dat je niet 2x op dezelfde kaart klikt

    this.classList.add('draai'); // Voegt de CSS-klasse toe om de kaart te draaien

    // Start de timer bij de eerste klik
    if (!timerGestart) {
        startTimer();
        timerGestart = true;
    }

    //  Controleert of dit de eerste of tweede kaart is die wordt omgedraaid
    if (!kaartGedraaid) {
        kaartGedraaid = true;
        eersteKaart = this; // Slaat de eerste geklikte kaart op
    } else {
        tweedeKaart = this; // Slaat de tweede geklikte kaart op
        kaartGedraaid = false;
        checkMatch(); // Controleert of de kaarten overeenkomen
    }
}

// Controleert of de twee omgedraaide kaarten een match zijn
function checkMatch() {
    let isMatch = eersteKaart.dataset.framework === tweedeKaart.dataset.framework;
    isMatch ? kaartenUitschakelen() : kaartenTerugdraaien();
}

// Als je een paar vindt worden de kaarten uitgeschakeld
function kaartenUitschakelen() {
    isMatchGeluid.play(); // Speelt een geluid af bij een correcte match

    // Verwijdert de 'click'-eventlistener zodat de speler deze kaarten niet meer kan selecteren
    eersteKaart.removeEventListener('click', kaartDraaien);
    tweedeKaart.removeEventListener('click', kaartDraaien);

    bordReset(); // Reset de variabelen voor een nieuwe beurt
    controleerWin(); // Controleert of alle kaarten zijn omgedraaid
}

// Bij een verkeerde match worden de kaarten teruggedraaid
function kaartenTerugdraaien() {
    kaartenOpSlot = true; // Blokkeert interactie tijdelijk
    misMatchGeluid.play(); // Speelt een fout-geluid af

    setTimeout(() => {
        eersteKaart.classList.remove('draai');
        tweedeKaart.classList.remove('draai');
        bordReset(); // Reset het bord na 1,5 seconde
    }, 1500);
}

// Reset de geselecteerde kaarten en de spelstatus
function bordReset() {
    [kaartGedraaid, kaartenOpSlot] = [false, false];
    [eersteKaart, tweedeKaart] = [null, null];
}

// Controleert of alle kaarten zijn omgedraaid doormiddel van de css class draai
function controleerWin() {
    let alleKaartenOmgedraaid = [...kaarten].every(kaart => kaart.classList.contains('draai'));
    if (alleKaartenOmgedraaid) eindeSpel(true); // Speel gewonnen scenario af
}

// Schudt de kaarten willekeurig aan het begin van het spel
(function shuffle() {
    kaarten.forEach(kaart => {
        let randomPos = Math.floor(Math.random() * kaarten.length);
        kaart.style.order = randomPos; // CSS-flexbox sorteert de kaarten op basis van deze waarde
    });
})();

// Voegt een 'click' event toe aan alle kaarten zodat ze omgedraaid kunnen worden
kaarten.forEach(kaart => kaart.addEventListener('click', kaartDraaien));
