"use client";

import {
    Suspense,
    useEffect,
    useState,
} from "react";

import {
    useSearchParams,
    useRouter,
} from "next/navigation";

import Link from "next/link";

import ProtectedRoute from "../../../components/ProtectedRoute";

import {
    getProperties,
} from "../../../services/propertyService";

import {
    getRoomsByPropertyId,
} from "../../../services/roomService";

import {
    useSettings,
} from "../../../context/SettingsContext";

import {
    useUser,
} from "../../../context/UserContext";

import {
    currencyInfo,
} from "../../../data/currency";

import {
    Property,
    Room,
} from "../../../types/types";

import {
    getLocalizedBedType,
} from "../../../data/translations";

const bookingPageTranslations = {
    "English": {
        backToProperty: "Back to property",
        bookYourStay: "Book your stay",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Guests",
        adults: "Adults",
        children: "Children",
        infants: "Infants",
        adult: "adult",
        adultsPlural: "adults",
        child: "child",
        childrenPlural: "children",
        infant: "infant",
        infantsPlural: "infants",
        years: "years",
        under2: "Under 2 years",
        roomCapacity: "Room capacity",
        guest: "guest",
        guestsPlural: "guests",
        night: "night",
        nights: "nights",
        total: "Total",
        confirm: "Confirm booking",
        loading: "Loading booking...",
        propertyNotFound: "Property not found",
        backToStays: "Back to stays",
        selectDates: "Please select check-in and check-out dates.",
        checkInPast: "Check-in date cannot be in the past.",
        checkOutPast: "Check-out date cannot be in the past.",
        checkOutAfter: "Check-out date must be after check-in date.",
        adultRequired: "At least one adult is required.",
        capacity: "This room can accommodate up to {n} adults and children.",
        loggedIn: "You must be logged in to make a booking.",
        propertyMissing: "Property not found.",
    },
    "Română": {
        backToProperty: "Înapoi la proprietate",
        bookYourStay: "Rezervă cazarea",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Oaspeți",
        adults: "Adulți",
        children: "Copii",
        infants: "Bebeluși",
        adult: "adult",
        adultsPlural: "adulți",
        child: "copil",
        childrenPlural: "copii",
        infant: "bebeluș",
        infantsPlural: "bebeluși",
        years: "ani",
        under2: "Sub 2 ani",
        roomCapacity: "Capacitatea camerei",
        guest: "oaspete",
        guestsPlural: "oaspeți",
        night: "noapte",
        nights: "nopți",
        total: "Total",
        confirm: "Confirmă rezervarea",
        loading: "Se încarcă rezervarea...",
        propertyNotFound: "Proprietatea nu a fost găsită",
        backToStays: "Înapoi la cazări",
        selectDates: "Selectează datele de check-in și check-out.",
        checkInPast: "Data de check-in nu poate fi în trecut.",
        checkOutPast: "Data de check-out nu poate fi în trecut.",
        checkOutAfter: "Data de check-out trebuie să fie după data de check-in.",
        adultRequired: "Este necesar cel puțin un adult.",
        capacity: "Această cameră poate găzdui până la {n} adulți și copii.",
        loggedIn: "Trebuie să fii autentificat pentru a face o rezervare.",
        propertyMissing: "Proprietatea nu a fost găsită.",
    },
    "Русский": {
        backToProperty: "Назад к объекту",
        bookYourStay: "Забронировать проживание",
        checkIn: "Заезд",
        checkOut: "Выезд",
        guests: "Гости",
        adults: "Взрослые",
        children: "Дети",
        infants: "Младенцы",
        adult: "взрослый",
        adultsPlural: "взрослых",
        child: "ребёнок",
        childrenPlural: "детей",
        infant: "младенец",
        infantsPlural: "младенцев",
        years: "лет",
        under2: "До 2 лет",
        roomCapacity: "Вместимость номера",
        guest: "гость",
        guestsPlural: "гостей",
        night: "ночь",
        nights: "ночей",
        total: "Итого",
        confirm: "Подтвердить бронирование",
        loading: "Загрузка бронирования...",
        propertyNotFound: "Объект размещения не найден",
        backToStays: "Назад к вариантам размещения",
        selectDates: "Выберите даты заезда и выезда.",
        checkInPast: "Дата заезда не может быть в прошлом.",
        checkOutPast: "Дата выезда не может быть в прошлом.",
        checkOutAfter: "Дата выезда должна быть позже даты заезда.",
        adultRequired: "Требуется хотя бы один взрослый.",
        capacity: "В этом номере могут разместиться до {n} взрослых и детей.",
        loggedIn: "Для бронирования необходимо войти в аккаунт.",
        propertyMissing: "Объект размещения не найден.",
    },
    "Українська": {
        backToProperty: "Назад до помешкання",
        bookYourStay: "Забронювати проживання",
        checkIn: "Заїзд",
        checkOut: "Виїзд",
        guests: "Гості",
        adults: "Дорослі",
        children: "Діти",
        infants: "Немовлята",
        adult: "дорослий",
        adultsPlural: "дорослих",
        child: "дитина",
        childrenPlural: "дітей",
        infant: "немовля",
        infantsPlural: "немовлят",
        years: "років",
        under2: "До 2 років",
        roomCapacity: "Місткість номера",
        guest: "гість",
        guestsPlural: "гостей",
        night: "ніч",
        nights: "ночей",
        total: "Разом",
        confirm: "Підтвердити бронювання",
        loading: "Завантаження бронювання...",
        propertyNotFound: "Помешкання не знайдено",
        backToStays: "Назад до помешкань",
        selectDates: "Виберіть дати заїзду та виїзду.",
        checkInPast: "Дата заїзду не може бути в минулому.",
        checkOutPast: "Дата виїзду не може бути в минулому.",
        checkOutAfter: "Дата виїзду має бути пізніше дати заїзду.",
        adultRequired: "Потрібен принаймні один дорослий.",
        capacity: "У цьому номері можуть розміститися до {n} дорослих і дітей.",
        loggedIn: "Щоб забронювати, потрібно увійти в обліковий запис.",
        propertyMissing: "Помешкання не знайдено.",
    },
    "Français": {
        backToProperty: "Retour à l’établissement",
        bookYourStay: "Réservez votre séjour",
        checkIn: "Arrivée",
        checkOut: "Départ",
        guests: "Voyageurs",
        adults: "Adultes",
        children: "Enfants",
        infants: "Bébés",
        adult: "adulte",
        adultsPlural: "adultes",
        child: "enfant",
        childrenPlural: "enfants",
        infant: "bébé",
        infantsPlural: "bébés",
        years: "ans",
        under2: "Moins de 2 ans",
        roomCapacity: "Capacité de la chambre",
        guest: "voyageur",
        guestsPlural: "voyageurs",
        night: "nuit",
        nights: "nuits",
        total: "Total",
        confirm: "Confirmer la réservation",
        loading: "Chargement de la réservation...",
        propertyNotFound: "Établissement introuvable",
        backToStays: "Retour aux hébergements",
        selectDates: "Veuillez sélectionner les dates d’arrivée et de départ.",
        checkInPast: "La date d’arrivée ne peut pas être dans le passé.",
        checkOutPast: "La date de départ ne peut pas être dans le passé.",
        checkOutAfter: "La date de départ doit être après la date d’arrivée.",
        adultRequired: "Au moins un adulte est requis.",
        capacity: "Cette chambre peut accueillir jusqu’à {n} adultes et enfants.",
        loggedIn: "Vous devez être connecté pour effectuer une réservation.",
        propertyMissing: "Établissement introuvable.",
    },
    "Español": {
        backToProperty: "Volver al alojamiento",
        bookYourStay: "Reserva tu estancia",
        checkIn: "Entrada",
        checkOut: "Salida",
        guests: "Huéspedes",
        adults: "Adultos",
        children: "Niños",
        infants: "Bebés",
        adult: "adulto",
        adultsPlural: "adultos",
        child: "niño",
        childrenPlural: "niños",
        infant: "bebé",
        infantsPlural: "bebés",
        years: "años",
        under2: "Menores de 2 años",
        roomCapacity: "Capacidad de la habitación",
        guest: "huésped",
        guestsPlural: "huéspedes",
        night: "noche",
        nights: "noches",
        total: "Total",
        confirm: "Confirmar reserva",
        loading: "Cargando reserva...",
        propertyNotFound: "Alojamiento no encontrado",
        backToStays: "Volver a alojamientos",
        selectDates: "Selecciona las fechas de entrada y salida.",
        checkInPast: "La fecha de entrada no puede estar en el pasado.",
        checkOutPast: "La fecha de salida no puede estar en el pasado.",
        checkOutAfter: "La fecha de salida debe ser posterior a la fecha de entrada.",
        adultRequired: "Se requiere al menos un adulto.",
        capacity: "Esta habitación puede alojar hasta {n} adultos y niños.",
        loggedIn: "Debes iniciar sesión para hacer una reserva.",
        propertyMissing: "Alojamiento no encontrado.",
    },
    "Deutsch": {
        backToProperty: "Zurück zur Unterkunft",
        bookYourStay: "Aufenthalt buchen",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Gäste",
        adults: "Erwachsene",
        children: "Kinder",
        infants: "Babys",
        adult: "Erwachsener",
        adultsPlural: "Erwachsene",
        child: "Kind",
        childrenPlural: "Kinder",
        infant: "Baby",
        infantsPlural: "Babys",
        years: "Jahre",
        under2: "Unter 2 Jahre",
        roomCapacity: "Zimmerkapazität",
        guest: "Gast",
        guestsPlural: "Gäste",
        night: "Nacht",
        nights: "Nächte",
        total: "Gesamt",
        confirm: "Buchung bestätigen",
        loading: "Buchung wird geladen...",
        propertyNotFound: "Unterkunft nicht gefunden",
        backToStays: "Zurück zu den Unterkünften",
        selectDates: "Bitte wähle die Check-in- und Check-out-Daten aus.",
        checkInPast: "Das Check-in-Datum darf nicht in der Vergangenheit liegen.",
        checkOutPast: "Das Check-out-Datum darf nicht in der Vergangenheit liegen.",
        checkOutAfter: "Das Check-out-Datum muss nach dem Check-in-Datum liegen.",
        adultRequired: "Mindestens ein Erwachsener ist erforderlich.",
        capacity: "Dieses Zimmer bietet Platz für bis zu {n} Erwachsene und Kinder.",
        loggedIn: "Du musst angemeldet sein, um eine Buchung vorzunehmen.",
        propertyMissing: "Unterkunft nicht gefunden.",
    },
    "Italiano": {
        backToProperty: "Torna alla struttura",
        bookYourStay: "Prenota il tuo soggiorno",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Ospiti",
        adults: "Adulti",
        children: "Bambini",
        infants: "Neonati",
        adult: "adulto",
        adultsPlural: "adulti",
        child: "bambino",
        childrenPlural: "bambini",
        infant: "neonato",
        infantsPlural: "neonati",
        years: "anni",
        under2: "Meno di 2 anni",
        roomCapacity: "Capienza della camera",
        guest: "ospite",
        guestsPlural: "ospiti",
        night: "notte",
        nights: "notti",
        total: "Totale",
        confirm: "Conferma prenotazione",
        loading: "Caricamento della prenotazione...",
        propertyNotFound: "Struttura non trovata",
        backToStays: "Torna alle strutture",
        selectDates: "Seleziona le date di check-in e check-out.",
        checkInPast: "La data di check-in non può essere nel passato.",
        checkOutPast: "La data di check-out non può essere nel passato.",
        checkOutAfter: "La data di check-out deve essere successiva alla data di check-in.",
        adultRequired: "È richiesto almeno un adulto.",
        capacity: "Questa camera può ospitare fino a {n} adulti e bambini.",
        loggedIn: "Devi aver effettuato l'accesso per effettuare una prenotazione.",
        propertyMissing: "Struttura non trovata.",
    },
    "Português": {
        backToProperty: "Voltar ao alojamento",
        bookYourStay: "Reserve a sua estadia",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Hóspedes",
        adults: "Adultos",
        children: "Crianças",
        infants: "Bebés",
        adult: "adulto",
        adultsPlural: "adultos",
        child: "criança",
        childrenPlural: "crianças",
        infant: "bebé",
        infantsPlural: "bebés",
        years: "anos",
        under2: "Menos de 2 anos",
        roomCapacity: "Capacidade do quarto",
        guest: "hóspede",
        guestsPlural: "hóspedes",
        night: "noite",
        nights: "noites",
        total: "Total",
        confirm: "Confirmar reserva",
        loading: "A carregar a reserva...",
        propertyNotFound: "Alojamento não encontrado",
        backToStays: "Voltar aos alojamentos",
        selectDates: "Selecione as datas de check-in e check-out.",
        checkInPast: "A data de check-in não pode estar no passado.",
        checkOutPast: "A data de check-out não pode estar no passado.",
        checkOutAfter: "A data de check-out deve ser posterior à data de check-in.",
        adultRequired: "É necessário pelo menos um adulto.",
        capacity: "Este quarto pode acomodar até {n} adultos e crianças.",
        loggedIn: "Tem de iniciar sessão para efetuar uma reserva.",
        propertyMissing: "Alojamento não encontrado.",
    },
    "Nederlands": {
        backToProperty: "Terug naar accommodatie",
        bookYourStay: "Boek je verblijf",
        checkIn: "Inchecken",
        checkOut: "Uitchecken",
        guests: "Gasten",
        adults: "Volwassenen",
        children: "Kinderen",
        infants: "Baby's",
        adult: "volwassene",
        adultsPlural: "volwassenen",
        child: "kind",
        childrenPlural: "kinderen",
        infant: "baby",
        infantsPlural: "baby's",
        years: "jaar",
        under2: "Jonger dan 2 jaar",
        roomCapacity: "Kamercapaciteit",
        guest: "gast",
        guestsPlural: "gasten",
        night: "nacht",
        nights: "nachten",
        total: "Totaal",
        confirm: "Boeking bevestigen",
        loading: "Boeking laden...",
        propertyNotFound: "Accommodatie niet gevonden",
        backToStays: "Terug naar accommodaties",
        selectDates: "Selecteer de in- en uitcheckdatums.",
        checkInPast: "De incheckdatum kan niet in het verleden liggen.",
        checkOutPast: "De uitcheckdatum kan niet in het verleden liggen.",
        checkOutAfter: "De uitcheckdatum moet na de incheckdatum liggen.",
        adultRequired: "Minstens één volwassene is vereist.",
        capacity: "Deze kamer biedt plaats aan maximaal {n} volwassenen en kinderen.",
        loggedIn: "Je moet ingelogd zijn om een boeking te maken.",
        propertyMissing: "Accommodatie niet gevonden.",
    },
    "Norsk": {
        backToProperty: "Tilbake til overnattingsstedet",
        bookYourStay: "Bestill oppholdet ditt",
        checkIn: "Innsjekking",
        checkOut: "Utsjekking",
        guests: "Gjester",
        adults: "Voksne",
        children: "Barn",
        infants: "Spedbarn",
        adult: "voksen",
        adultsPlural: "voksne",
        child: "barn",
        childrenPlural: "barn",
        infant: "spedbarn",
        infantsPlural: "spedbarn",
        years: "år",
        under2: "Under 2 år",
        roomCapacity: "Romkapasitet",
        guest: "gjest",
        guestsPlural: "gjester",
        night: "natt",
        nights: "netter",
        total: "Totalt",
        confirm: "Bekreft bestilling",
        loading: "Laster inn bestilling...",
        propertyNotFound: "Overnattingsstedet ble ikke funnet",
        backToStays: "Tilbake til overnattingssteder",
        selectDates: "Velg innsjekkings- og utsjekkingsdatoer.",
        checkInPast: "Innsjekkingsdatoen kan ikke være i fortiden.",
        checkOutPast: "Utsjekkingsdatoen kan ikke være i fortiden.",
        checkOutAfter: "Utsjekkingsdatoen må være etter innsjekkingsdatoen.",
        adultRequired: "Minst én voksen er påkrevd.",
        capacity: "Dette rommet har plass til opptil {n} voksne og barn.",
        loggedIn: "Du må være logget inn for å bestille.",
        propertyMissing: "Overnattingsstedet ble ikke funnet.",
    },
    "Svenska": {
        backToProperty: "Tillbaka till boendet",
        bookYourStay: "Boka din vistelse",
        checkIn: "Incheckning",
        checkOut: "Utcheckning",
        guests: "Gäster",
        adults: "Vuxna",
        children: "Barn",
        infants: "Spädbarn",
        adult: "vuxen",
        adultsPlural: "vuxna",
        child: "barn",
        childrenPlural: "barn",
        infant: "spädbarn",
        infantsPlural: "spädbarn",
        years: "år",
        under2: "Under 2 år",
        roomCapacity: "Rumskapacitet",
        guest: "gäst",
        guestsPlural: "gäster",
        night: "natt",
        nights: "nätter",
        total: "Totalt",
        confirm: "Bekräfta bokning",
        loading: "Laddar bokning...",
        propertyNotFound: "Boendet hittades inte",
        backToStays: "Tillbaka till boenden",
        selectDates: "Välj in- och utcheckningsdatum.",
        checkInPast: "Incheckningsdatumet kan inte vara i det förflutna.",
        checkOutPast: "Utcheckningsdatumet kan inte vara i det förflutna.",
        checkOutAfter: "Utcheckningsdatumet måste vara efter incheckningsdatumet.",
        adultRequired: "Minst en vuxen krävs.",
        capacity: "Det här rummet rymmer upp till {n} vuxna och barn.",
        loggedIn: "Du måste vara inloggad för att boka.",
        propertyMissing: "Boendet hittades inte.",
    },
    "Dansk": {
        backToProperty: "Tilbage til overnatningsstedet",
        bookYourStay: "Book dit ophold",
        checkIn: "Indtjekning",
        checkOut: "Udtjekning",
        guests: "Gæster",
        adults: "Voksne",
        children: "Børn",
        infants: "Spædbørn",
        adult: "voksen",
        adultsPlural: "voksne",
        child: "barn",
        childrenPlural: "børn",
        infant: "spædbarn",
        infantsPlural: "spædbørn",
        years: "år",
        under2: "Under 2 år",
        roomCapacity: "Værelseskapacitet",
        guest: "gæst",
        guestsPlural: "gæster",
        night: "nat",
        nights: "nætter",
        total: "I alt",
        confirm: "Bekræft booking",
        loading: "Indlæser booking...",
        propertyNotFound: "Overnatningsstedet blev ikke fundet",
        backToStays: "Tilbage til overnatningssteder",
        selectDates: "Vælg ind- og udtjekningsdatoer.",
        checkInPast: "Indtjekningsdatoen kan ikke være i fortiden.",
        checkOutPast: "Udtjekningsdatoen kan ikke være i fortiden.",
        checkOutAfter: "Udtjekningsdatoen skal være efter indtjekningsdatoen.",
        adultRequired: "Mindst én voksen er påkrævet.",
        capacity: "Dette værelse kan rumme op til {n} voksne og børn.",
        loggedIn: "Du skal være logget ind for at foretage en booking.",
        propertyMissing: "Overnatningsstedet blev ikke fundet.",
    },
    "Suomi": {
        backToProperty: "Takaisin majoitukseen",
        bookYourStay: "Varaa majoitus",
        checkIn: "Sisäänkirjautuminen",
        checkOut: "Uloskirjautuminen",
        guests: "Vieraat",
        adults: "Aikuiset",
        children: "Lapset",
        infants: "Vauvat",
        adult: "aikuinen",
        adultsPlural: "aikuista",
        child: "lapsi",
        childrenPlural: "lasta",
        infant: "vauva",
        infantsPlural: "vauvaa",
        years: "vuotta",
        under2: "Alle 2-vuotiaat",
        roomCapacity: "Huoneen kapasiteetti",
        guest: "vieras",
        guestsPlural: "vierasta",
        night: "yö",
        nights: "yötä",
        total: "Yhteensä",
        confirm: "Vahvista varaus",
        loading: "Ladataan varausta...",
        propertyNotFound: "Majoitusta ei löytynyt",
        backToStays: "Takaisin majoituksiin",
        selectDates: "Valitse sisään- ja uloskirjautumispäivät.",
        checkInPast: "Sisäänkirjautumispäivä ei voi olla menneisyydessä.",
        checkOutPast: "Uloskirjautumispäivä ei voi olla menneisyydessä.",
        checkOutAfter: "Uloskirjautumispäivän on oltava sisäänkirjautumispäivän jälkeen.",
        adultRequired: "Vähintään yksi aikuinen vaaditaan.",
        capacity: "Tähän huoneeseen mahtuu enintään {n} aikuista ja lasta.",
        loggedIn: "Sinun on kirjauduttava sisään tehdäksesi varauksen.",
        propertyMissing: "Majoitusta ei löytynyt.",
    },
    "Polski": {
        backToProperty: "Wróć do obiektu",
        bookYourStay: "Zarezerwuj pobyt",
        checkIn: "Zameldowanie",
        checkOut: "Wymeldowanie",
        guests: "Goście",
        adults: "Dorośli",
        children: "Dzieci",
        infants: "Niemowlęta",
        adult: "dorosły",
        adultsPlural: "dorosłych",
        child: "dziecko",
        childrenPlural: "dzieci",
        infant: "niemowlę",
        infantsPlural: "niemowląt",
        years: "lat",
        under2: "Poniżej 2 lat",
        roomCapacity: "Pojemność pokoju",
        guest: "gość",
        guestsPlural: "gości",
        night: "noc",
        nights: "nocy",
        total: "Razem",
        confirm: "Potwierdź rezerwację",
        loading: "Ładowanie rezerwacji...",
        propertyNotFound: "Nie znaleziono obiektu",
        backToStays: "Wróć do obiektów",
        selectDates: "Wybierz daty zameldowania i wymeldowania.",
        checkInPast: "Data zameldowania nie może być w przeszłości.",
        checkOutPast: "Data wymeldowania nie może być w przeszłości.",
        checkOutAfter: "Data wymeldowania musi być późniejsza niż data zameldowania.",
        adultRequired: "Wymagana jest co najmniej jedna osoba dorosła.",
        capacity: "Ten pokój może pomieścić do {n} dorosłych i dzieci.",
        loggedIn: "Musisz być zalogowany, aby dokonać rezerwacji.",
        propertyMissing: "Nie znaleziono obiektu.",
    },
    "Čeština": {
        backToProperty: "Zpět na ubytování",
        bookYourStay: "Rezervujte si pobyt",
        checkIn: "Příjezd",
        checkOut: "Odjezd",
        guests: "Hosté",
        adults: "Dospělí",
        children: "Děti",
        infants: "Kojenci",
        adult: "dospělý",
        adultsPlural: "dospělí",
        child: "dítě",
        childrenPlural: "děti",
        infant: "kojenec",
        infantsPlural: "kojenci",
        years: "let",
        under2: "Méně než 2 roky",
        roomCapacity: "Kapacita pokoje",
        guest: "host",
        guestsPlural: "hosté",
        night: "noc",
        nights: "noci",
        total: "Celkem",
        confirm: "Potvrdit rezervaci",
        loading: "Načítání rezervace...",
        propertyNotFound: "Ubytování nebylo nalezeno",
        backToStays: "Zpět na ubytování",
        selectDates: "Vyberte datum příjezdu a odjezdu.",
        checkInPast: "Datum příjezdu nemůže být v minulosti.",
        checkOutPast: "Datum odjezdu nemůže být v minulosti.",
        checkOutAfter: "Datum odjezdu musí být pozdější než datum příjezdu.",
        adultRequired: "Je vyžadován alespoň jeden dospělý.",
        capacity: "Tento pokoj může ubytovat až {n} dospělých a dětí.",
        loggedIn: "Pro vytvoření rezervace se musíte přihlásit.",
        propertyMissing: "Ubytování nebylo nalezeno.",
    },
    "Slovenčina": {
        backToProperty: "Späť na ubytovanie",
        bookYourStay: "Rezervujte si pobyt",
        checkIn: "Príchod",
        checkOut: "Odchod",
        guests: "Hostia",
        adults: "Dospelí",
        children: "Deti",
        infants: "Dojčatá",
        adult: "dospelý",
        adultsPlural: "dospelí",
        child: "dieťa",
        childrenPlural: "deti",
        infant: "dojča",
        infantsPlural: "dojčatá",
        years: "rokov",
        under2: "Do 2 rokov",
        roomCapacity: "Kapacita izby",
        guest: "hosť",
        guestsPlural: "hostia",
        night: "noc",
        nights: "noci",
        total: "Celkom",
        confirm: "Potvrdiť rezerváciu",
        loading: "Načítava sa rezervácia...",
        propertyNotFound: "Ubytovanie sa nenašlo",
        backToStays: "Späť na ubytovania",
        selectDates: "Vyberte dátum príchodu a odchodu.",
        checkInPast: "Dátum príchodu nemôže byť v minulosti.",
        checkOutPast: "Dátum odchodu nemôže byť v minulosti.",
        checkOutAfter: "Dátum odchodu musí byť neskôr ako dátum príchodu.",
        adultRequired: "Vyžaduje sa aspoň jeden dospelý.",
        capacity: "Táto izba môže ubytovať až {n} dospelých a detí.",
        loggedIn: "Na vytvorenie rezervácie sa musíte prihlásiť.",
        propertyMissing: "Ubytovanie sa nenašlo.",
    },
    "Magyar": {
        backToProperty: "Vissza a szálláshelyhez",
        bookYourStay: "Foglalja le szállását",
        checkIn: "Bejelentkezés",
        checkOut: "Kijelentkezés",
        guests: "Vendégek",
        adults: "Felnőttek",
        children: "Gyermekek",
        infants: "Csecsemők",
        adult: "felnőtt",
        adultsPlural: "felnőtt",
        child: "gyermek",
        childrenPlural: "gyermek",
        infant: "csecsemő",
        infantsPlural: "csecsemő",
        years: "éves",
        under2: "2 év alatt",
        roomCapacity: "Szobakapacitás",
        guest: "vendég",
        guestsPlural: "vendég",
        night: "éjszaka",
        nights: "éjszaka",
        total: "Összesen",
        confirm: "Foglalás megerősítése",
        loading: "Foglalás betöltése...",
        propertyNotFound: "A szálláshely nem található",
        backToStays: "Vissza a szálláshelyekhez",
        selectDates: "Válassza ki a be- és kijelentkezés dátumát.",
        checkInPast: "A bejelentkezés dátuma nem lehet a múltban.",
        checkOutPast: "A kijelentkezés dátuma nem lehet a múltban.",
        checkOutAfter: "A kijelentkezés dátumának a bejelentkezés után kell lennie.",
        adultRequired: "Legalább egy felnőtt szükséges.",
        capacity: "Ez a szoba legfeljebb {n} felnőttet és gyermeket tud elszállásolni.",
        loggedIn: "A foglaláshoz be kell jelentkeznie.",
        propertyMissing: "A szálláshely nem található.",
    },
    "Български": {
        backToProperty: "Назад към мястото за настаняване",
        bookYourStay: "Резервирайте престоя си",
        checkIn: "Настаняване",
        checkOut: "Напускане",
        guests: "Гости",
        adults: "Възрастни",
        children: "Деца",
        infants: "Бебета",
        adult: "възрастен",
        adultsPlural: "възрастни",
        child: "дете",
        childrenPlural: "деца",
        infant: "бебе",
        infantsPlural: "бебета",
        years: "години",
        under2: "Под 2 години",
        roomCapacity: "Капацитет на стаята",
        guest: "гост",
        guestsPlural: "гости",
        night: "нощ",
        nights: "нощи",
        total: "Общо",
        confirm: "Потвърди резервацията",
        loading: "Зареждане на резервацията...",
        propertyNotFound: "Мястото за настаняване не е намерено",
        backToStays: "Назад към местата за настаняване",
        selectDates: "Моля, изберете дати за настаняване и напускане.",
        checkInPast: "Датата на настаняване не може да е в миналото.",
        checkOutPast: "Датата на напускане не може да е в миналото.",
        checkOutAfter: "Датата на напускане трябва да е след датата на настаняване.",
        adultRequired: "Необходим е поне един възрастен.",
        capacity: "Тази стая може да побере до {n} възрастни и деца.",
        loggedIn: "Трябва да сте влезли в профила си, за да направите резервация.",
        propertyMissing: "Мястото за настаняване не е намерено.",
    },
    "Hrvatski": {
        backToProperty: "Natrag na smještaj",
        bookYourStay: "Rezervirajte svoj boravak",
        checkIn: "Prijava",
        checkOut: "Odjava",
        guests: "Gosti",
        adults: "Odrasli",
        children: "Djeca",
        infants: "Bebe",
        adult: "odrasla osoba",
        adultsPlural: "odraslih",
        child: "dijete",
        childrenPlural: "djece",
        infant: "beba",
        infantsPlural: "beba",
        years: "godina",
        under2: "Mlađi od 2 godine",
        roomCapacity: "Kapacitet sobe",
        guest: "gost",
        guestsPlural: "gostiju",
        night: "noć",
        nights: "noći",
        total: "Ukupno",
        confirm: "Potvrdi rezervaciju",
        loading: "Učitavanje rezervacije...",
        propertyNotFound: "Smještaj nije pronađen",
        backToStays: "Natrag na smještaje",
        selectDates: "Odaberite datume prijave i odjave.",
        checkInPast: "Datum prijave ne može biti u prošlosti.",
        checkOutPast: "Datum odjave ne može biti u prošlosti.",
        checkOutAfter: "Datum odjave mora biti nakon datuma prijave.",
        adultRequired: "Potreban je barem jedan odrasli gost.",
        capacity: "Ova soba može primiti do {n} odraslih i djece.",
        loggedIn: "Morate biti prijavljeni za rezervaciju.",
        propertyMissing: "Smještaj nije pronađen.",
    },
    "Slovenščina": {
        backToProperty: "Nazaj na nastanitev",
        bookYourStay: "Rezervirajte svoje bivanje",
        checkIn: "Prijava",
        checkOut: "Odjava",
        guests: "Gostje",
        adults: "Odrasli",
        children: "Otroci",
        infants: "Dojenčki",
        adult: "odrasli",
        adultsPlural: "odraslih",
        child: "otrok",
        childrenPlural: "otrok",
        infant: "dojenček",
        infantsPlural: "dojenčkov",
        years: "let",
        under2: "Mlajši od 2 let",
        roomCapacity: "Kapaciteta sobe",
        guest: "gost",
        guestsPlural: "gostov",
        night: "noč",
        nights: "noči",
        total: "Skupaj",
        confirm: "Potrdi rezervacijo",
        loading: "Nalaganje rezervacije...",
        propertyNotFound: "Nastanitev ni bila najdena",
        backToStays: "Nazaj na nastanitve",
        selectDates: "Izberite datuma prijave in odjave.",
        checkInPast: "Datum prijave ne more biti v preteklosti.",
        checkOutPast: "Datum odjave ne more biti v preteklosti.",
        checkOutAfter: "Datum odjave mora biti po datumu prijave.",
        adultRequired: "Potreben je vsaj en odrasli.",
        capacity: "V tej sobi lahko biva do {n} odraslih in otrok.",
        loggedIn: "Za rezervacijo morate biti prijavljeni.",
        propertyMissing: "Nastanitev ni bila najdena.",
    },
    "Srpski": {
        backToProperty: "Nazad na smeštaj",
        bookYourStay: "Rezervišite svoj boravak",
        checkIn: "Prijava",
        checkOut: "Odjava",
        guests: "Gosti",
        adults: "Odrasli",
        children: "Deca",
        infants: "Bebe",
        adult: "odrasla osoba",
        adultsPlural: "odraslih",
        child: "dete",
        childrenPlural: "dece",
        infant: "beba",
        infantsPlural: "beba",
        years: "godina",
        under2: "Mlađi od 2 godine",
        roomCapacity: "Kapacitet sobe",
        guest: "gost",
        guestsPlural: "gostiju",
        night: "noć",
        nights: "noći",
        total: "Ukupno",
        confirm: "Potvrdi rezervaciju",
        loading: "Učitavanje rezervacije...",
        propertyNotFound: "Smeštaj nije pronađen",
        backToStays: "Nazad na smeštaje",
        selectDates: "Izaberite datume prijave i odjave.",
        checkInPast: "Datum prijave ne može biti u prošlosti.",
        checkOutPast: "Datum odjave ne može biti u prošlosti.",
        checkOutAfter: "Datum odjave mora biti nakon datuma prijave.",
        adultRequired: "Potreban je najmanje jedan odrasli gost.",
        capacity: "Ova soba može da primi do {n} odraslih i dece.",
        loggedIn: "Morate biti prijavljeni da biste napravili rezervaciju.",
        propertyMissing: "Smeštaj nije pronađen.",
    },
    "Bosanski": {
        backToProperty: "Nazad na smještaj",
        bookYourStay: "Rezervišite svoj boravak",
        checkIn: "Prijava",
        checkOut: "Odjava",
        guests: "Gosti",
        adults: "Odrasli",
        children: "Djeca",
        infants: "Bebe",
        adult: "odrasla osoba",
        adultsPlural: "odraslih",
        child: "dijete",
        childrenPlural: "djece",
        infant: "beba",
        infantsPlural: "beba",
        years: "godina",
        under2: "Mlađi od 2 godine",
        roomCapacity: "Kapacitet sobe",
        guest: "gost",
        guestsPlural: "gostiju",
        night: "noć",
        nights: "noći",
        total: "Ukupno",
        confirm: "Potvrdi rezervaciju",
        loading: "Učitavanje rezervacije...",
        propertyNotFound: "Smještaj nije pronađen",
        backToStays: "Nazad na smještaje",
        selectDates: "Odaberite datume prijave i odjave.",
        checkInPast: "Datum prijave ne može biti u prošlosti.",
        checkOutPast: "Datum odjave ne može biti u prošlosti.",
        checkOutAfter: "Datum odjave mora biti nakon datuma prijave.",
        adultRequired: "Potreban je najmanje jedan odrasli gost.",
        capacity: "Ova soba može primiti do {n} odraslih i djece.",
        loggedIn: "Morate biti prijavljeni da biste izvršili rezervaciju.",
        propertyMissing: "Smještaj nije pronađen.",
    },
    "Ελληνικά": {
        backToProperty: "Επιστροφή στο κατάλυμα",
        bookYourStay: "Κάντε κράτηση για τη διαμονή σας",
        checkIn: "Άφιξη",
        checkOut: "Αναχώρηση",
        guests: "Επισκέπτες",
        adults: "Ενήλικες",
        children: "Παιδιά",
        infants: "Βρέφη",
        adult: "ενήλικας",
        adultsPlural: "ενήλικες",
        child: "παιδί",
        childrenPlural: "παιδιά",
        infant: "βρέφος",
        infantsPlural: "βρέφη",
        years: "ετών",
        under2: "Κάτω των 2 ετών",
        roomCapacity: "Χωρητικότητα δωματίου",
        guest: "επισκέπτης",
        guestsPlural: "επισκέπτες",
        night: "νύχτα",
        nights: "νύχτες",
        total: "Σύνολο",
        confirm: "Επιβεβαίωση κράτησης",
        loading: "Φόρτωση κράτησης...",
        propertyNotFound: "Το κατάλυμα δεν βρέθηκε",
        backToStays: "Επιστροφή στα καταλύματα",
        selectDates: "Επιλέξτε ημερομηνίες άφιξης και αναχώρησης.",
        checkInPast: "Η ημερομηνία άφιξης δεν μπορεί να είναι στο παρελθόν.",
        checkOutPast: "Η ημερομηνία αναχώρησης δεν μπορεί να είναι στο παρελθόν.",
        checkOutAfter: "Η ημερομηνία αναχώρησης πρέπει να είναι μετά την ημερομηνία άφιξης.",
        adultRequired: "Απαιτείται τουλάχιστον ένας ενήλικας.",
        capacity: "Αυτό το δωμάτιο μπορεί να φιλοξενήσει έως {n} ενήλικες και παιδιά.",
        loggedIn: "Πρέπει να συνδεθείτε για να κάνετε κράτηση.",
        propertyMissing: "Το κατάλυμα δεν βρέθηκε.",
    },
    "Türkçe": {
        backToProperty: "Konaklama yerine dön",
        bookYourStay: "Konaklamanızı ayırtın",
        checkIn: "Giriş",
        checkOut: "Çıkış",
        guests: "Misafirler",
        adults: "Yetişkinler",
        children: "Çocuklar",
        infants: "Bebekler",
        adult: "yetişkin",
        adultsPlural: "yetişkin",
        child: "çocuk",
        childrenPlural: "çocuk",
        infant: "bebek",
        infantsPlural: "bebek",
        years: "yaş",
        under2: "2 yaşından küçük",
        roomCapacity: "Oda kapasitesi",
        guest: "misafir",
        guestsPlural: "misafir",
        night: "gece",
        nights: "gece",
        total: "Toplam",
        confirm: "Rezervasyonu onayla",
        loading: "Rezervasyon yükleniyor...",
        propertyNotFound: "Konaklama yeri bulunamadı",
        backToStays: "Konaklama yerlerine dön",
        selectDates: "Lütfen giriş ve çıkış tarihlerini seçin.",
        checkInPast: "Giriş tarihi geçmişte olamaz.",
        checkOutPast: "Çıkış tarihi geçmişte olamaz.",
        checkOutAfter: "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
        adultRequired: "En az bir yetişkin gereklidir.",
        capacity: "Bu oda en fazla {n} yetişkin ve çocuk ağırlayabilir.",
        loggedIn: "Rezervasyon yapmak için giriş yapmalısınız.",
        propertyMissing: "Konaklama yeri bulunamadı.",
    },
    "العربية": {
        backToProperty: "العودة إلى مكان الإقامة",
        bookYourStay: "احجز إقامتك",
        checkIn: "تسجيل الوصول",
        checkOut: "تسجيل المغادرة",
        guests: "الضيوف",
        adults: "البالغون",
        children: "الأطفال",
        infants: "الرضع",
        adult: "بالغ",
        adultsPlural: "بالغون",
        child: "طفل",
        childrenPlural: "أطفال",
        infant: "رضيع",
        infantsPlural: "رضع",
        years: "سنوات",
        under2: "أقل من سنتين",
        roomCapacity: "سعة الغرفة",
        guest: "ضيف",
        guestsPlural: "ضيوف",
        night: "ليلة",
        nights: "ليالٍ",
        total: "الإجمالي",
        confirm: "تأكيد الحجز",
        loading: "جارٍ تحميل الحجز...",
        propertyNotFound: "لم يتم العثور على مكان الإقامة",
        backToStays: "العودة إلى أماكن الإقامة",
        selectDates: "يرجى اختيار تاريخ تسجيل الوصول والمغادرة.",
        checkInPast: "لا يمكن أن يكون تاريخ تسجيل الوصول في الماضي.",
        checkOutPast: "لا يمكن أن يكون تاريخ تسجيل المغادرة في الماضي.",
        checkOutAfter: "يجب أن يكون تاريخ تسجيل المغادرة بعد تاريخ تسجيل الوصول.",
        adultRequired: "مطلوب شخص بالغ واحد على الأقل.",
        capacity: "يمكن لهذه الغرفة استيعاب ما يصل إلى {n} من البالغين والأطفال.",
        loggedIn: "يجب تسجيل الدخول لإجراء الحجز.",
        propertyMissing: "لم يتم العثور على مكان الإقامة.",
    },
    "עברית": {
        backToProperty: "חזרה למקום האירוח",
        bookYourStay: "הזמנת השהייה שלך",
        checkIn: "צ'ק-אין",
        checkOut: "צ'ק-אאוט",
        guests: "אורחים",
        adults: "מבוגרים",
        children: "ילדים",
        infants: "תינוקות",
        adult: "מבוגר",
        adultsPlural: "מבוגרים",
        child: "ילד",
        childrenPlural: "ילדים",
        infant: "תינוק",
        infantsPlural: "תינוקות",
        years: "שנים",
        under2: "מתחת לגיל שנתיים",
        roomCapacity: "קיבולת החדר",
        guest: "אורח",
        guestsPlural: "אורחים",
        night: "לילה",
        nights: "לילות",
        total: "סה״כ",
        confirm: "אישור ההזמנה",
        loading: "טוען את ההזמנה...",
        propertyNotFound: "מקום האירוח לא נמצא",
        backToStays: "חזרה למקומות האירוח",
        selectDates: "יש לבחור תאריכי צ'ק-אין וצ'ק-אאוט.",
        checkInPast: "תאריך הצ'ק-אין לא יכול להיות בעבר.",
        checkOutPast: "תאריך הצ'ק-אאוט לא יכול להיות בעבר.",
        checkOutAfter: "תאריך הצ'ק-אאוט חייב להיות אחרי תאריך הצ'ק-אין.",
        adultRequired: "נדרש לפחות מבוגר אחד.",
        capacity: "בחדר זה יכולים להתארח עד {n} מבוגרים וילדים.",
        loggedIn: "יש להתחבר כדי לבצע הזמנה.",
        propertyMissing: "מקום האירוח לא נמצא.",
    },
    "हिन्दी": {
        backToProperty: "आवास पर वापस जाएँ",
        bookYourStay: "अपना ठहराव बुक करें",
        checkIn: "चेक-इन",
        checkOut: "चेक-आउट",
        guests: "मेहमान",
        adults: "वयस्क",
        children: "बच्चे",
        infants: "शिशु",
        adult: "वयस्क",
        adultsPlural: "वयस्क",
        child: "बच्चा",
        childrenPlural: "बच्चे",
        infant: "शिशु",
        infantsPlural: "शिशु",
        years: "वर्ष",
        under2: "2 वर्ष से कम",
        roomCapacity: "कमरे की क्षमता",
        guest: "मेहमान",
        guestsPlural: "मेहमान",
        night: "रात",
        nights: "रातें",
        total: "कुल",
        confirm: "बुकिंग की पुष्टि करें",
        loading: "बुकिंग लोड हो रही है...",
        propertyNotFound: "आवास नहीं मिला",
        backToStays: "आवासों पर वापस जाएँ",
        selectDates: "कृपया चेक-इन और चेक-आउट की तारीखें चुनें।",
        checkInPast: "चेक-इन की तारीख बीत चुकी नहीं हो सकती।",
        checkOutPast: "चेक-आउट की तारीख बीत चुकी नहीं हो सकती।",
        checkOutAfter: "चेक-आउट की तारीख चेक-इन के बाद होनी चाहिए।",
        adultRequired: "कम से कम एक वयस्क आवश्यक है।",
        capacity: "यह कमरा अधिकतम {n} वयस्कों और बच्चों को समायोजित कर सकता है।",
        loggedIn: "बुकिंग करने के लिए आपको लॉग इन करना होगा।",
        propertyMissing: "आवास नहीं मिला।",
    },
    "ไทย": {
        backToProperty: "กลับไปยังที่พัก",
        bookYourStay: "จองที่พักของคุณ",
        checkIn: "เช็กอิน",
        checkOut: "เช็กเอาต์",
        guests: "ผู้เข้าพัก",
        adults: "ผู้ใหญ่",
        children: "เด็ก",
        infants: "ทารก",
        adult: "ผู้ใหญ่",
        adultsPlural: "ผู้ใหญ่",
        child: "เด็ก",
        childrenPlural: "เด็ก",
        infant: "ทารก",
        infantsPlural: "ทารก",
        years: "ปี",
        under2: "อายุต่ำกว่า 2 ปี",
        roomCapacity: "ความจุห้องพัก",
        guest: "ผู้เข้าพัก",
        guestsPlural: "ผู้เข้าพัก",
        night: "คืน",
        nights: "คืน",
        total: "รวม",
        confirm: "ยืนยันการจอง",
        loading: "กำลังโหลดการจอง...",
        propertyNotFound: "ไม่พบที่พัก",
        backToStays: "กลับไปยังที่พักทั้งหมด",
        selectDates: "โปรดเลือกวันที่เช็กอินและเช็กเอาต์",
        checkInPast: "วันที่เช็กอินต้องไม่เป็นวันที่ผ่านมาแล้ว",
        checkOutPast: "วันที่เช็กเอาต์ต้องไม่เป็นวันที่ผ่านมาแล้ว",
        checkOutAfter: "วันที่เช็กเอาต์ต้องหลังวันที่เช็กอิน",
        adultRequired: "ต้องมีผู้ใหญ่อย่างน้อยหนึ่งคน",
        capacity: "ห้องนี้รองรับผู้ใหญ่และเด็กได้สูงสุด {n} คน",
        loggedIn: "คุณต้องเข้าสู่ระบบเพื่อทำการจอง",
        propertyMissing: "ไม่พบที่พัก",
    },
    "Bahasa Indonesia": {
        backToProperty: "Kembali ke akomodasi",
        bookYourStay: "Pesan penginapan Anda",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Tamu",
        adults: "Dewasa",
        children: "Anak-anak",
        infants: "Bayi",
        adult: "dewasa",
        adultsPlural: "dewasa",
        child: "anak",
        childrenPlural: "anak-anak",
        infant: "bayi",
        infantsPlural: "bayi",
        years: "tahun",
        under2: "Di bawah 2 tahun",
        roomCapacity: "Kapasitas kamar",
        guest: "tamu",
        guestsPlural: "tamu",
        night: "malam",
        nights: "malam",
        total: "Total",
        confirm: "Konfirmasi pemesanan",
        loading: "Memuat pemesanan...",
        propertyNotFound: "Akomodasi tidak ditemukan",
        backToStays: "Kembali ke akomodasi",
        selectDates: "Silakan pilih tanggal check-in dan check-out.",
        checkInPast: "Tanggal check-in tidak boleh di masa lalu.",
        checkOutPast: "Tanggal check-out tidak boleh di masa lalu.",
        checkOutAfter: "Tanggal check-out harus setelah tanggal check-in.",
        adultRequired: "Setidaknya satu orang dewasa diperlukan.",
        capacity: "Kamar ini dapat menampung hingga {n} orang dewasa dan anak-anak.",
        loggedIn: "Anda harus masuk untuk melakukan pemesanan.",
        propertyMissing: "Akomodasi tidak ditemukan.",
    },
    "Tiếng Việt": {
        backToProperty: "Quay lại chỗ nghỉ",
        bookYourStay: "Đặt chỗ ở của bạn",
        checkIn: "Nhận phòng",
        checkOut: "Trả phòng",
        guests: "Khách",
        adults: "Người lớn",
        children: "Trẻ em",
        infants: "Trẻ sơ sinh",
        adult: "người lớn",
        adultsPlural: "người lớn",
        child: "trẻ em",
        childrenPlural: "trẻ em",
        infant: "trẻ sơ sinh",
        infantsPlural: "trẻ sơ sinh",
        years: "tuổi",
        under2: "Dưới 2 tuổi",
        roomCapacity: "Sức chứa phòng",
        guest: "khách",
        guestsPlural: "khách",
        night: "đêm",
        nights: "đêm",
        total: "Tổng cộng",
        confirm: "Xác nhận đặt phòng",
        loading: "Đang tải đặt phòng...",
        propertyNotFound: "Không tìm thấy chỗ nghỉ",
        backToStays: "Quay lại các chỗ nghỉ",
        selectDates: "Vui lòng chọn ngày nhận phòng và trả phòng.",
        checkInPast: "Ngày nhận phòng không thể ở trong quá khứ.",
        checkOutPast: "Ngày trả phòng không thể ở trong quá khứ.",
        checkOutAfter: "Ngày trả phòng phải sau ngày nhận phòng.",
        adultRequired: "Cần ít nhất một người lớn.",
        capacity: "Phòng này có thể chứa tối đa {n} người lớn và trẻ em.",
        loggedIn: "Bạn phải đăng nhập để đặt phòng.",
        propertyMissing: "Không tìm thấy chỗ nghỉ.",
    },
    "한국어": {
        backToProperty: "숙소로 돌아가기",
        bookYourStay: "숙박 예약하기",
        checkIn: "체크인",
        checkOut: "체크아웃",
        guests: "투숙객",
        adults: "성인",
        children: "어린이",
        infants: "유아",
        adult: "성인",
        adultsPlural: "성인",
        child: "어린이",
        childrenPlural: "어린이",
        infant: "유아",
        infantsPlural: "유아",
        years: "세",
        under2: "2세 미만",
        roomCapacity: "객실 수용 인원",
        guest: "명",
        guestsPlural: "명",
        night: "박",
        nights: "박",
        total: "총액",
        confirm: "예약 확인",
        loading: "예약을 불러오는 중...",
        propertyNotFound: "숙소를 찾을 수 없습니다",
        backToStays: "숙소 목록으로 돌아가기",
        selectDates: "체크인 및 체크아웃 날짜를 선택하세요.",
        checkInPast: "체크인 날짜는 과거일 수 없습니다.",
        checkOutPast: "체크아웃 날짜는 과거일 수 없습니다.",
        checkOutAfter: "체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.",
        adultRequired: "최소 한 명의 성인이 필요합니다.",
        capacity: "이 객실은 성인과 어린이를 최대 {n}명까지 수용할 수 있습니다.",
        loggedIn: "예약하려면 로그인해야 합니다.",
        propertyMissing: "숙소를 찾을 수 없습니다.",
    },
    "日本語": {
        backToProperty: "宿泊施設に戻る",
        bookYourStay: "宿泊を予約する",
        checkIn: "チェックイン",
        checkOut: "チェックアウト",
        guests: "宿泊人数",
        adults: "大人",
        children: "子ども",
        infants: "乳幼児",
        adult: "大人",
        adultsPlural: "大人",
        child: "子ども",
        childrenPlural: "子ども",
        infant: "乳幼児",
        infantsPlural: "乳幼児",
        years: "歳",
        under2: "2歳未満",
        roomCapacity: "客室定員",
        guest: "名",
        guestsPlural: "名",
        night: "泊",
        nights: "泊",
        total: "合計",
        confirm: "予約を確定する",
        loading: "予約を読み込んでいます...",
        propertyNotFound: "宿泊施設が見つかりません",
        backToStays: "宿泊施設一覧に戻る",
        selectDates: "チェックインとチェックアウトの日付を選択してください。",
        checkInPast: "チェックイン日は過去の日付にできません。",
        checkOutPast: "チェックアウト日は過去の日付にできません。",
        checkOutAfter: "チェックアウト日はチェックイン日より後である必要があります。",
        adultRequired: "大人が1名以上必要です。",
        capacity: "この客室は大人と子どもを最大{n}名まで収容できます。",
        loggedIn: "予約するにはログインしてください。",
        propertyMissing: "宿泊施設が見つかりません。",
    },
    "中文": {
        backToProperty: "返回住宿",
        bookYourStay: "预订您的住宿",
        checkIn: "入住",
        checkOut: "退房",
        guests: "住客",
        adults: "成人",
        children: "儿童",
        infants: "婴儿",
        adult: "成人",
        adultsPlural: "成人",
        child: "儿童",
        childrenPlural: "儿童",
        infant: "婴儿",
        infantsPlural: "婴儿",
        years: "岁",
        under2: "2岁以下",
        roomCapacity: "客房容量",
        guest: "位客人",
        guestsPlural: "位客人",
        night: "晚",
        nights: "晚",
        total: "总计",
        confirm: "确认预订",
        loading: "正在加载预订...",
        propertyNotFound: "未找到住宿",
        backToStays: "返回住宿列表",
        selectDates: "请选择入住和退房日期。",
        checkInPast: "入住日期不能是过去的日期。",
        checkOutPast: "退房日期不能是过去的日期。",
        checkOutAfter: "退房日期必须晚于入住日期。",
        adultRequired: "至少需要一名成人。",
        capacity: "此客房最多可容纳 {n} 名成人和儿童。",
        loggedIn: "您必须登录后才能预订。",
        propertyMissing: "未找到住宿。",
    },
    "繁體中文": {
        backToProperty: "返回住宿",
        bookYourStay: "預訂您的住宿",
        checkIn: "入住",
        checkOut: "退房",
        guests: "房客",
        adults: "成人",
        children: "兒童",
        infants: "嬰兒",
        adult: "成人",
        adultsPlural: "成人",
        child: "兒童",
        childrenPlural: "兒童",
        infant: "嬰兒",
        infantsPlural: "嬰兒",
        years: "歲",
        under2: "2 歲以下",
        roomCapacity: "客房容量",
        guest: "位房客",
        guestsPlural: "位房客",
        night: "晚",
        nights: "晚",
        total: "總計",
        confirm: "確認預訂",
        loading: "正在載入預訂...",
        propertyNotFound: "找不到住宿",
        backToStays: "返回住宿列表",
        selectDates: "請選擇入住和退房日期。",
        checkInPast: "入住日期不能是過去的日期。",
        checkOutPast: "退房日期不能是過去的日期。",
        checkOutAfter: "退房日期必須晚於入住日期。",
        adultRequired: "至少需要一位成人。",
        capacity: "此客房最多可容納 {n} 位成人和兒童。",
        loggedIn: "您必須登入才能進行預訂。",
        propertyMissing: "找不到住宿。",
    },
    "Català": {
        backToProperty: "Torna a l'allotjament",
        bookYourStay: "Reserva la teva estada",
        checkIn: "Entrada",
        checkOut: "Sortida",
        guests: "Hostes",
        adults: "Adults",
        children: "Nens",
        infants: "Nadons",
        adult: "adult",
        adultsPlural: "adults",
        child: "nen",
        childrenPlural: "nens",
        infant: "nadó",
        infantsPlural: "nadons",
        years: "anys",
        under2: "Menors de 2 anys",
        roomCapacity: "Capacitat de l'habitació",
        guest: "hoste",
        guestsPlural: "hostes",
        night: "nit",
        nights: "nits",
        total: "Total",
        confirm: "Confirma la reserva",
        loading: "S'està carregant la reserva...",
        propertyNotFound: "Allotjament no trobat",
        backToStays: "Torna als allotjaments",
        selectDates: "Selecciona les dates d'entrada i sortida.",
        checkInPast: "La data d'entrada no pot ser en el passat.",
        checkOutPast: "La data de sortida no pot ser en el passat.",
        checkOutAfter: "La data de sortida ha de ser posterior a la data d'entrada.",
        adultRequired: "Cal almenys un adult.",
        capacity: "Aquesta habitació pot allotjar fins a {n} adults i nens.",
        loggedIn: "Has d'iniciar sessió per fer una reserva.",
        propertyMissing: "Allotjament no trobat.",
    },
    "Eesti": {
        backToProperty: "Tagasi majutuskohta",
        bookYourStay: "Broneeri oma peatumine",
        checkIn: "Sisseregistreerimine",
        checkOut: "Väljaregistreerimine",
        guests: "Külalised",
        adults: "Täiskasvanud",
        children: "Lapsed",
        infants: "Imikud",
        adult: "täiskasvanu",
        adultsPlural: "täiskasvanut",
        child: "laps",
        childrenPlural: "last",
        infant: "imik",
        infantsPlural: "imikuid",
        years: "aastat",
        under2: "Alla 2 aasta",
        roomCapacity: "Toa mahutavus",
        guest: "külaline",
        guestsPlural: "külalist",
        night: "öö",
        nights: "ööd",
        total: "Kokku",
        confirm: "Kinnita broneering",
        loading: "Broneeringu laadimine...",
        propertyNotFound: "Majutuskohta ei leitud",
        backToStays: "Tagasi majutuskohtade juurde",
        selectDates: "Palun vali sisse- ja väljaregistreerimise kuupäevad.",
        checkInPast: "Sisseregistreerimise kuupäev ei saa olla minevikus.",
        checkOutPast: "Väljaregistreerimise kuupäev ei saa olla minevikus.",
        checkOutAfter: "Väljaregistreerimise kuupäev peab olema pärast sisseregistreerimise kuupäeva.",
        adultRequired: "Vajalik on vähemalt üks täiskasvanu.",
        capacity: "Selles toas saab majutada kuni {n} täiskasvanut ja last.",
        loggedIn: "Broneeringu tegemiseks pead sisse logima.",
        propertyMissing: "Majutuskohta ei leitud.",
    },
    "Latviešu": {
        backToProperty: "Atpakaļ uz naktsmītni",
        bookYourStay: "Rezervējiet savu uzturēšanos",
        checkIn: "Reģistrēšanās",
        checkOut: "Izrakstīšanās",
        guests: "Viesi",
        adults: "Pieaugušie",
        children: "Bērni",
        infants: "Zīdaiņi",
        adult: "pieaugušais",
        adultsPlural: "pieaugušie",
        child: "bērns",
        childrenPlural: "bērni",
        infant: "zīdainis",
        infantsPlural: "zīdaiņi",
        years: "gadi",
        under2: "Līdz 2 gadiem",
        roomCapacity: "Numura ietilpība",
        guest: "viesis",
        guestsPlural: "viesi",
        night: "nakts",
        nights: "naktis",
        total: "Kopā",
        confirm: "Apstiprināt rezervāciju",
        loading: "Notiek rezervācijas ielāde...",
        propertyNotFound: "Naktsmītne nav atrasta",
        backToStays: "Atpakaļ uz naktsmītnēm",
        selectDates: "Lūdzu, izvēlieties reģistrēšanās un izrakstīšanās datumus.",
        checkInPast: "Reģistrēšanās datums nevar būt pagātnē.",
        checkOutPast: "Izrakstīšanās datums nevar būt pagātnē.",
        checkOutAfter: "Izrakstīšanās datumam jābūt pēc reģistrēšanās datuma.",
        adultRequired: "Nepieciešams vismaz viens pieaugušais.",
        capacity: "Šajā numurā var izmitināt līdz {n} pieaugušajiem un bērniem.",
        loggedIn: "Lai veiktu rezervāciju, jums jāpiesakās.",
        propertyMissing: "Naktsmītne nav atrasta.",
    },
    "Lietuvių": {
        backToProperty: "Grįžti į apgyvendinimo vietą",
        bookYourStay: "Užsakykite viešnagę",
        checkIn: "Atvykimas",
        checkOut: "Išvykimas",
        guests: "Svečiai",
        adults: "Suaugusieji",
        children: "Vaikai",
        infants: "Kūdikiai",
        adult: "suaugusysis",
        adultsPlural: "suaugusieji",
        child: "vaikas",
        childrenPlural: "vaikai",
        infant: "kūdikis",
        infantsPlural: "kūdikiai",
        years: "metai",
        under2: "Jaunesni nei 2 metų",
        roomCapacity: "Kambario talpa",
        guest: "svečias",
        guestsPlural: "svečiai",
        night: "naktis",
        nights: "naktys",
        total: "Iš viso",
        confirm: "Patvirtinti rezervaciją",
        loading: "Kraunama rezervacija...",
        propertyNotFound: "Apgyvendinimo vieta nerasta",
        backToStays: "Grįžti į apgyvendinimo vietas",
        selectDates: "Pasirinkite atvykimo ir išvykimo datas.",
        checkInPast: "Atvykimo data negali būti praeityje.",
        checkOutPast: "Išvykimo data negali būti praeityje.",
        checkOutAfter: "Išvykimo data turi būti vėlesnė už atvykimo datą.",
        adultRequired: "Reikalingas bent vienas suaugusysis.",
        capacity: "Šiame kambaryje gali apsistoti iki {n} suaugusiųjų ir vaikų.",
        loggedIn: "Norėdami užsisakyti turite prisijungti.",
        propertyMissing: "Apgyvendinimo vieta nerasta.",
    },
} as const;

type BookingPageKey = keyof typeof bookingPageTranslations.English;

function getBookingText(
    language: string,
    key: BookingPageKey,
    values?: Record<string, string | number>
): string {
    const languageName = language.split("|")[0];
    const dictionary =
        bookingPageTranslations[languageName as keyof typeof bookingPageTranslations] ??
        bookingPageTranslations.English;

    let text = dictionary[key] ?? bookingPageTranslations.English[key];

    if (values) {
        Object.entries(values).forEach(([name, value]) => {
            text = text.replace(`{${name}}`, String(value));
        });
    }

    return text;
}




function getTodayDate(): string {
    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =========================================================
   BOOKING FORM
   ========================================================= */

function NewBookingForm() {

    const searchParams =
        useSearchParams();

    const router =
        useRouter();

    const { currency, language } =
        useSettings();

    const { currentUser } =
        useUser();


    /* =====================================================
       CURRENCY
       ===================================================== */

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];


    /* =====================================================
       URL PARAMETERS
       ===================================================== */

    const propertyId =
        Number(
            searchParams.get(
                "propertyId"
            )
        );

    const roomId =
        Number(
            searchParams.get(
                "roomId"
            )
        );


    /* =====================================================
       DATA
       ===================================================== */

    const [
        property,
        setProperty,
    ] =
        useState<Property | null>(
            null
        );

    const [
        propertyRooms,
        setPropertyRooms,
    ] =
        useState<Room[]>([]);

    const [
        isLoaded,
        setIsLoaded,
    ] =
        useState(false);


    /*
     * IMPORTANT:
     *
     * getProperties() and getRoomsByPropertyId()
     * use localStorage.
     *
     * Therefore we load them only after the
     * component has mounted in the browser.
     *
     * This prevents the Next.js hydration error.
     */

    useEffect(() => {

        const allProperties =
            getProperties();

        const foundProperty =
            allProperties.find(
                (item) =>
                    item.id ===
                    propertyId
            );

        setProperty(
            foundProperty ?? null
        );

        if (foundProperty) {

            const rooms =
                getRoomsByPropertyId(
                    foundProperty.id
                );

            setPropertyRooms(
                rooms
            );
        } else {

            setPropertyRooms([]);

        }

        setIsLoaded(true);

    }, [propertyId]);


    /* =====================================================
       FORM STATE
       ===================================================== */

    const [
        checkIn,
        setCheckIn,
    ] =
        useState("");

    const [
        checkOut,
        setCheckOut,
    ] =
        useState("");


    const [
        adults,
        setAdults,
    ] =
        useState(1);

    const [
        children,
        setChildren,
    ] =
        useState(0);

    const [
        infants,
        setInfants,
    ] =
        useState(0);


    const [
        error,
        setError,
    ] =
        useState("");


    /* =====================================================
       SELECTED ROOM
       ===================================================== */

    const selectedRoom =
        propertyRooms.find(
            (room) =>
                room.id ===
                roomId
        );

    const formattedRoomSize =
        selectedRoom &&
        selectedRoom.size !== undefined &&
        selectedRoom.size !== null &&
        selectedRoom.size !== ""
            ? typeof selectedRoom.size === "number"
                ? `${selectedRoom.size} m²`
                : selectedRoom.size
            : "";


    /* =====================================================
       PRICES
       ===================================================== */

    const pricePerNight =
        selectedRoom?.pricePerNight ??
        property?.pricePerNight ??
        0;


    const totalGuests =
        adults +
        children +
        infants;


    const roomCapacity =
        selectedRoom?.guests ??
        1;


    /* =====================================================
       NIGHTS
       ===================================================== */

    const calculateNights =
        () => {

            if (
                !checkIn ||
                !checkOut
            ) {
                return 0;
            }

            const start =
                new Date(
                    checkIn
                );

            const end =
                new Date(
                    checkOut
                );

            const difference =
                end.getTime() -
                start.getTime();

            return Math.ceil(
                difference /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );
        };


    const nights =
        calculateNights();


    const totalPrice =
        nights *
        pricePerNight;


    /* =====================================================
       FORMAT PRICE
       ===================================================== */

    const formatPrice =
        (
            price: number
        ) => {

            const convertedPrice =
                price *
                selectedCurrency.rate;

            return (
                `${selectedCurrency.symbol}${Math.round(
                    convertedPrice
                ).toLocaleString()}`
            );
        };


    /* =====================================================
       BOOKING
       ===================================================== */

    const handleBooking =
        () => {

            setError("");


            /* ---------------------------------------------
               DATES REQUIRED
               --------------------------------------------- */

            if (
                !checkIn ||
                !checkOut
            ) {

                setError(
                    getBookingText(language, "selectDates")
                );

                return;
            }


            /* ---------------------------------------------
               TODAY
               --------------------------------------------- */

            const today =
                getTodayDate();


            /* ---------------------------------------------
               CHECK-IN CANNOT BE IN THE PAST
               --------------------------------------------- */

            if (
                checkIn <
                today
            ) {

                setError(
                    getBookingText(language, "checkInPast")
                );

                return;
            }


            /* ---------------------------------------------
               CHECK-OUT CANNOT BE IN THE PAST
               --------------------------------------------- */

            if (
                checkOut <
                today
            ) {

                setError(
                    getBookingText(language, "checkOutPast")
                );

                return;
            }


            /* ---------------------------------------------
               CHECK-OUT MUST BE AFTER CHECK-IN
               --------------------------------------------- */

            if (
                checkOut <=
                checkIn
            ) {

                setError(
                    getBookingText(language, "checkOutAfter")
                );

                return;
            }


            /* ---------------------------------------------
               ADULT REQUIRED
               --------------------------------------------- */

            if (
                adults < 1
            ) {

                setError(
                    getBookingText(language, "adultRequired")
                );

                return;
            }


            /* ---------------------------------------------
               ROOM CAPACITY
               --------------------------------------------- */

            if (
                selectedRoom &&
                adults +
                children >
                selectedRoom.guests
            ) {

                setError(
                    getBookingText(language, "capacity", { n: selectedRoom.guests })
                );

                return;
            }


            /* ---------------------------------------------
               USER REQUIRED
               --------------------------------------------- */

            if (
                !currentUser
            ) {

                setError(
                    getBookingText(language, "loggedIn")
                );

                return;
            }


            /* ---------------------------------------------
               PROPERTY REQUIRED
               --------------------------------------------- */

            if (
                !property
            ) {

                setError(
                    getBookingText(language, "propertyMissing")
                );

                return;
            }


            /* ---------------------------------------------
               CREATE BOOKING
               --------------------------------------------- */

            const newBooking = {

                id:
                    Date.now(),

                userId:
                currentUser.id,

                propertyId:
                property.id,

                roomId:
                selectedRoom?.id,

                checkIn,

                checkOut,

                adults,

                children,

                infants,

                /*
                 * Total number of guests.
                 */
                guests:
                totalGuests,

                /*
                 * Price is stored in the
                 * application's base currency.
                 */
                totalPrice,

                status:
                    "confirmed" as const,
            };


            /* ---------------------------------------------
               LOAD EXISTING BOOKINGS
               --------------------------------------------- */

            const savedBookings =
                localStorage.getItem(
                    "stayway_bookings"
                );


            let bookings: typeof newBooking[] =
                [];


            if (
                savedBookings
            ) {

                try {

                    bookings =
                        JSON.parse(
                            savedBookings
                        );

                } catch {

                    bookings = [];

                }

            }


            /* ---------------------------------------------
               SAVE
               --------------------------------------------- */

            bookings.push(
                newBooking
            );


            localStorage.setItem(
                "stayway_bookings",
                JSON.stringify(
                    bookings
                )
            );


            /* ---------------------------------------------
               REDIRECT
               --------------------------------------------- */

            router.push(
                "/bookings"
            );
        };


    /* =====================================================
       ADULTS
       ===================================================== */

    const decreaseAdults =
        () => {

            setAdults(
                (current) =>
                    Math.max(
                        1,
                        current - 1
                    )
            );
        };


    const increaseAdults =
        () => {

            if (
                adults +
                1 +
                children <=
                roomCapacity
            ) {

                setAdults(
                    (current) =>
                        current + 1
                );
            }
        };


    /* =====================================================
       CHILDREN
       ===================================================== */

    const decreaseChildren =
        () => {

            setChildren(
                (current) =>
                    Math.max(
                        0,
                        current - 1
                    )
            );
        };


    const increaseChildren =
        () => {

            if (
                adults +
                children +
                1 <=
                roomCapacity
            ) {

                setChildren(
                    (current) =>
                        current + 1
                );
            }
        };


    /* =====================================================
       INFANTS
       ===================================================== */

    const decreaseInfants =
        () => {

            setInfants(
                (current) =>
                    Math.max(
                        0,
                        current - 1
                    )
            );
        };


    const increaseInfants =
        () => {

            setInfants(
                (current) =>
                    current + 1
            );
        };


    /* =====================================================
       LOADING
       ===================================================== */

    if (
        !isLoaded
    ) {

        return (

            <main className="bookings-loading-page">

                <section className="section">

                    <div className="container booking-page">

                        <p>
                            {getBookingText(language, "loading")}
                        </p>

                    </div>

                </section>

            </main>
        );
    }


    /* =====================================================
       PROPERTY NOT FOUND
       ===================================================== */

    if (
        !property
    ) {

        return (

            <main className="container">

                <h1>
                    {getBookingText(language, "propertyNotFound")}
                </h1>

                <Link
                    href="/stays"
                >
                    ← {getBookingText(language, "backToStays")}
                </Link>

            </main>
        );
    }


    /* =====================================================
       MAIN UI
       ===================================================== */

    return (

        <ProtectedRoute>

            <main>

                <section className="section">

                    <div className="container booking-page">


                        {/* BACK */}

                        <Link
                            href={`/stays/${property.id}`}
                        >
                            ← {getBookingText(language, "backToProperty")}
                        </Link>


                        {/* TITLE */}

                        <h1>
                            {getBookingText(language, "bookYourStay")}
                        </h1>


                        <div className="booking-layout">


                            {/* =================================================
                               FORM
                               ================================================= */}

                            <div className="booking-form">


                                <h2>
                                    {property.name}
                                </h2>


                                <p>
                                    {property.address}
                                </p>


                                {/* SELECTED ROOM */}

                                {selectedRoom && (

                                    <div className="selected-room-info">

                                        <strong>
                                            {
                                                selectedRoom.name
                                            }
                                        </strong>

                                        <p>
                                            {formattedRoomSize}

                                            {" · "}

                                            {getLocalizedBedType(
                                                selectedRoom.bed,
                                                language
                                            )}
                                        </p>

                                        <p>
                                            {
                                                formatPrice(
                                                    selectedRoom.pricePerNight
                                                )
                                            }

                                            {` / ${getBookingText(language, "night")}`}
                                        </p>

                                    </div>

                                )}


                                {/* =================================================
                                   CHECK-IN
                                   ================================================= */}

                                <label>

                                    {getBookingText(language, "checkIn")}

                                    <input
                                        type="date"
                                        value={
                                            checkIn
                                        }
                                        min={
                                            getTodayDate()
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCheckIn(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </label>


                                {/* =================================================
                                   CHECK-OUT
                                   ================================================= */}

                                <label>

                                    {getBookingText(language, "checkOut")}

                                    <input
                                        type="date"
                                        value={
                                            checkOut
                                        }
                                        min={
                                            checkIn ||
                                            getTodayDate()
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCheckOut(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </label>


                                {/* =================================================
                                   GUESTS
                                   ================================================= */}

                                <div className="guests-section">

                                    <h2>
                                        {getBookingText(language, "guests")}
                                    </h2>


                                    {/* ADULTS */}

                                    <div className="guest-row">

                                        <div>

                                            <strong>
                                                {getBookingText(language, "adults")}
                                            </strong>

                                            <span>
                                                13+ {getBookingText(language, "years")}
                                            </span>

                                        </div>


                                        <div className="guest-counter">

                                            <button
                                                type="button"
                                                onClick={
                                                    decreaseAdults
                                                }
                                                disabled={
                                                    adults === 1
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {adults}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={
                                                    increaseAdults
                                                }
                                                disabled={
                                                    adults +
                                                    children >=
                                                    roomCapacity
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>


                                    {/* CHILDREN */}

                                    <div className="guest-row">

                                        <div>

                                            <strong>
                                                {getBookingText(language, "children")}
                                            </strong>

                                            <span>
                                                2–12 {getBookingText(language, "years")}
                                            </span>

                                        </div>


                                        <div className="guest-counter">

                                            <button
                                                type="button"
                                                onClick={
                                                    decreaseChildren
                                                }
                                                disabled={
                                                    children === 0
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {children}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={
                                                    increaseChildren
                                                }
                                                disabled={
                                                    adults +
                                                    children >=
                                                    roomCapacity
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>


                                    {/* INFANTS */}

                                    <div className="guest-row">

                                        <div>

                                            <strong>
                                                {getBookingText(language, "infants")}
                                            </strong>

                                            <span>
                                                {getBookingText(language, "under2")}
                                            </span>

                                        </div>


                                        <div className="guest-counter">

                                            <button
                                                type="button"
                                                onClick={
                                                    decreaseInfants
                                                }
                                                disabled={
                                                    infants === 0
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {infants}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={
                                                    increaseInfants
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>


                                    {/* GUEST SUMMARY */}

                                    <p className="guest-summary">

                                        {adults}{" "}

                                        {getBookingText(
                                            language,
                                            adults === 1
                                                ? "adult"
                                                : "adultsPlural"
                                        )}

                                        {" · "}

                                        {children}{" "}

                                        {getBookingText(
                                            language,
                                            children === 1
                                                ? "child"
                                                : "childrenPlural"
                                        )}

                                        {" · "}

                                        {infants}{" "}

                                        {getBookingText(
                                            language,
                                            infants === 1
                                                ? "infant"
                                                : "infantsPlural"
                                        )}

                                    </p>


                                    <p className="guest-capacity">

                                        {getBookingText(language, "roomCapacity")}:{" "}

                                        {
                                            roomCapacity
                                        }{" "}

                                        {getBookingText(
                                            language,
                                            roomCapacity === 1
                                                ? "guest"
                                                : "guestsPlural"
                                        )}

                                    </p>

                                </div>


                                {/* ERROR */}

                                {error && (

                                    <p className="booking-error">

                                        {
                                            error
                                        }

                                    </p>

                                )}


                                {/* CONFIRM */}

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        handleBooking
                                    }
                                >
                                    {getBookingText(language, "confirm")}
                                </button>

                            </div>


                            {/* =================================================
                               SUMMARY
                               ================================================= */}

                            <div className="booking-summary">


                                <img
                                    src={
                                        property.image
                                    }
                                    alt={
                                        property.name
                                    }
                                />


                                <h2>
                                    {
                                        property.name
                                    }
                                </h2>


                                <p>
                                    {
                                        property.address
                                    }
                                </p>


                                {selectedRoom && (

                                    <div className="booking-room-summary">

                                        <strong>
                                            {
                                                selectedRoom.name
                                            }
                                        </strong>

                                        <p>
                                            {formattedRoomSize}

                                            {" · "}

                                            {getLocalizedBedType(
                                                selectedRoom.bed,
                                                language
                                            )}
                                        </p>

                                    </div>

                                )}


                                <p>

                                    {
                                        formatPrice(
                                            pricePerNight
                                        )
                                    }

                                    {` / ${getBookingText(language, "night")}`}

                                </p>


                                {nights > 0 && (

                                    <div className="booking-total">

                                        <p>

                                            {
                                                nights
                                            }{" "}

                                            {getBookingText(
                                                language,
                                                nights === 1
                                                    ? "night"
                                                    : "nights"
                                            )}

                                        </p>


                                        <p>

                                            {
                                                formatPrice(
                                                    pricePerNight
                                                )
                                            }

                                            {" × "}

                                            {
                                                nights
                                            }

                                        </p>


                                        <strong>

                                            {getBookingText(language, "total")}:{" "}

                                            {
                                                formatPrice(
                                                    totalPrice
                                                )
                                            }

                                        </strong>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </ProtectedRoute>
    );
}


/* =========================================================
   PAGE
   ========================================================= */

export default function NewBookingPage() {

    const { language } =
        useSettings();

    return (

        <Suspense
            fallback={

                <main className="container">

                    <p>
                        {getBookingText(language, "loading")}
                    </p>

                </main>
            }
        >

            <NewBookingForm />

        </Suspense>
    );
}
