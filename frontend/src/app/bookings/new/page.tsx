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
    getPropertiesFromApi,
} from "../../../services/propertyService";

import {
    getRoomsByPropertyIdFromApi,
} from "../../../services/roomService";

import {
    checkRoomAvailabilityFromApi,
    createBookingInApi,
} from "../../../services/bookingService";

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
        pending: "Pending confirmation",
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
        roomUnavailable: "This room is already booked for the selected dates.",
        passengerDetails: "Passenger details",
        whoIsTravelling: "Who is travelling?",
        firstName: "First name",
        lastName: "Last name",
        emailAddress: "Email address",
        phoneNumber: "Phone number",
        specialRequests: "Special requests",
        specialRequestsPlaceholder: "Anything we should know about your stay?",
        bookingReviewNote: "Your booking details will be reviewed before the reservation is confirmed.",
        confirmBooking: "Confirm booking",
        backToBooking: "Back to booking details",
        requiredFields: "Please fill in all required fields.",
        invalidEmail: "Please enter a valid email address.",

        firstNamePlaceholder: "Your first name",
        lastNamePlaceholder: "Your last name",
        phonePlaceholder: "Enter your phone number",
    },
    "Română": {
        pending: "În așteptarea confirmării",
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
        roomUnavailable: "Această cameră este deja rezervată pentru datele selectate.",
        passengerDetails: "Datele pasagerului",
        whoIsTravelling: "Cine călătorește?",
        firstName: "Prenume",
        lastName: "Nume",
        emailAddress: "Adresă de email",
        phoneNumber: "Număr de telefon",
        specialRequests: "Solicitări speciale",
        specialRequestsPlaceholder: "Este ceva ce ar trebui să știm despre șederea ta?",
        bookingReviewNote: "Datele rezervării vor fi verificate înainte ca rezervarea să fie confirmată.",
        confirmBooking: "Confirmă rezervarea",
        backToBooking: "Înapoi la detaliile rezervării",
        requiredFields: "Completează toate câmpurile obligatorii.",
        invalidEmail: "Introdu o adresă de email validă.",

        firstNamePlaceholder: "Prenumele tău",
        lastNamePlaceholder: "Numele tău",
        phonePlaceholder: "Introdu numărul de telefon",
    },
    "Русский": {
        pending: "Ожидает подтверждения",
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

        roomUnavailable: "Этот номер уже забронирован на выбранные даты.",
        passengerDetails: "Данные гостя",
        whoIsTravelling: "Кто путешествует?",
        firstName: "Имя",
        lastName: "Фамилия",
        emailAddress: "Электронная почта",
        phoneNumber: "Номер телефона",
        specialRequests: "Особые пожелания",
        specialRequestsPlaceholder: "Есть ли что-то, что нам следует знать о вашем проживании?",
        bookingReviewNote: "Данные бронирования будут проверены перед подтверждением резервации.",
        confirmBooking: "Подтвердить бронирование",
        backToBooking: "Назад к деталям бронирования",
        requiredFields: "Заполните все обязательные поля.",
        invalidEmail: "Введите действительный адрес электронной почты.",
        firstNamePlaceholder: "Ваше имя",
        lastNamePlaceholder: "Ваша фамилия",
        phonePlaceholder: "Введите номер телефона",
    },
    "Українська": {
        pending: "Очікує підтвердження",
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

        roomUnavailable: "Цей номер уже заброньований на вибрані дати.",
        passengerDetails: "Дані гостя",
        whoIsTravelling: "Хто подорожує?",
        firstName: "Ім’я",
        lastName: "Прізвище",
        emailAddress: "Електронна пошта",
        phoneNumber: "Номер телефону",
        specialRequests: "Особливі побажання",
        specialRequestsPlaceholder: "Чи є щось, що нам варто знати про ваше проживання?",
        bookingReviewNote: "Дані бронювання буде перевірено перед підтвердженням резервації.",
        confirmBooking: "Підтвердити бронювання",
        backToBooking: "Назад до деталей бронювання",
        requiredFields: "Заповніть усі обов’язкові поля.",
        invalidEmail: "Введіть дійсну електронну адресу.",
        firstNamePlaceholder: "Ваше ім’я",
        lastNamePlaceholder: "Ваше прізвище",
        phonePlaceholder: "Введіть номер телефону",
    },
    "Français": {
        pending: "En attente de confirmation",
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

        roomUnavailable: "Cette chambre est déjà réservée pour les dates sélectionnées.",
        passengerDetails: "Informations du voyageur",
        whoIsTravelling: "Qui voyage ?",
        firstName: "Prénom",
        lastName: "Nom",
        emailAddress: "Adresse e-mail",
        phoneNumber: "Numéro de téléphone",
        specialRequests: "Demandes spéciales",
        specialRequestsPlaceholder: "Y a-t-il quelque chose que nous devrions savoir sur votre séjour ?",
        bookingReviewNote: "Les détails de votre réservation seront vérifiés avant confirmation.",
        confirmBooking: "Confirmer la réservation",
        backToBooking: "Retour aux détails de la réservation",
        requiredFields: "Veuillez remplir tous les champs obligatoires.",
        invalidEmail: "Veuillez saisir une adresse e-mail valide.",
        firstNamePlaceholder: "Votre prénom",
        lastNamePlaceholder: "Votre nom",
        phonePlaceholder: "Saisissez votre numéro de téléphone",
    },
    "Español": {
        pending: "Pendiente de confirmación",
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

        roomUnavailable: "Esta habitación ya está reservada para las fechas seleccionadas.",
        passengerDetails: "Datos del huésped",
        whoIsTravelling: "¿Quién viaja?",
        firstName: "Nombre",
        lastName: "Apellidos",
        emailAddress: "Correo electrónico",
        phoneNumber: "Número de teléfono",
        specialRequests: "Solicitudes especiales",
        specialRequestsPlaceholder: "¿Hay algo que debamos saber sobre tu estancia?",
        bookingReviewNote: "Los datos de tu reserva se revisarán antes de confirmar la reserva.",
        confirmBooking: "Confirmar reserva",
        backToBooking: "Volver a los detalles de la reserva",
        requiredFields: "Completa todos los campos obligatorios.",
        invalidEmail: "Introduce una dirección de correo válida.",
        firstNamePlaceholder: "Tu nombre",
        lastNamePlaceholder: "Tus apellidos",
        phonePlaceholder: "Introduce tu número de teléfono",
    },
    "Deutsch": {
        pending: "Bestätigung ausstehend",
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

        roomUnavailable: "Dieses Zimmer ist für die ausgewählten Daten bereits gebucht.",
        passengerDetails: "Gästedaten",
        whoIsTravelling: "Wer reist?",
        firstName: "Vorname",
        lastName: "Nachname",
        emailAddress: "E-Mail-Adresse",
        phoneNumber: "Telefonnummer",
        specialRequests: "Besondere Wünsche",
        specialRequestsPlaceholder: "Gibt es etwas, das wir über Ihren Aufenthalt wissen sollten?",
        bookingReviewNote: "Ihre Buchungsdaten werden vor der Bestätigung geprüft.",
        confirmBooking: "Buchung bestätigen",
        backToBooking: "Zurück zu den Buchungsdetails",
        requiredFields: "Bitte füllen Sie alle Pflichtfelder aus.",
        invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        firstNamePlaceholder: "Ihr Vorname",
        lastNamePlaceholder: "Ihr Nachname",
        phonePlaceholder: "Telefonnummer eingeben",
    },
    "Italiano": {
        pending: "In attesa di conferma",
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

        roomUnavailable: "Questa camera è già prenotata per le date selezionate.",
        passengerDetails: "Dati dell’ospite",
        whoIsTravelling: "Chi viaggia?",
        firstName: "Nome",
        lastName: "Cognome",
        emailAddress: "Indirizzo e-mail",
        phoneNumber: "Numero di telefono",
        specialRequests: "Richieste speciali",
        specialRequestsPlaceholder: "C’è qualcosa che dovremmo sapere sul tuo soggiorno?",
        bookingReviewNote: "I dettagli della prenotazione verranno verificati prima della conferma.",
        confirmBooking: "Conferma prenotazione",
        backToBooking: "Torna ai dettagli della prenotazione",
        requiredFields: "Compila tutti i campi obbligatori.",
        invalidEmail: "Inserisci un indirizzo e-mail valido.",
        firstNamePlaceholder: "Il tuo nome",
        lastNamePlaceholder: "Il tuo cognome",
        phonePlaceholder: "Inserisci il numero di telefono",
    },
    "Português": {
        pending: "A aguardar confirmação",
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

        roomUnavailable: "Este quarto já está reservado para as datas selecionadas.",
        passengerDetails: "Dados do hóspede",
        whoIsTravelling: "Quem vai viajar?",
        firstName: "Nome",
        lastName: "Apelido",
        emailAddress: "Endereço de e-mail",
        phoneNumber: "Número de telefone",
        specialRequests: "Pedidos especiais",
        specialRequestsPlaceholder: "Há algo que devamos saber sobre a sua estadia?",
        bookingReviewNote: "Os dados da reserva serão verificados antes da confirmação.",
        confirmBooking: "Confirmar reserva",
        backToBooking: "Voltar aos detalhes da reserva",
        requiredFields: "Preencha todos os campos obrigatórios.",
        invalidEmail: "Introduza um endereço de e-mail válido.",
        firstNamePlaceholder: "O seu nome",
        lastNamePlaceholder: "O seu apelido",
        phonePlaceholder: "Introduza o número de telefone",
    },
    "Nederlands": {
        pending: "Wacht op bevestiging",
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

        roomUnavailable: "Deze kamer is al geboekt voor de geselecteerde data.",
        passengerDetails: "Gastgegevens",
        whoIsTravelling: "Wie reist er?",
        firstName: "Voornaam",
        lastName: "Achternaam",
        emailAddress: "E-mailadres",
        phoneNumber: "Telefoonnummer",
        specialRequests: "Speciale verzoeken",
        specialRequestsPlaceholder: "Is er iets dat we over je verblijf moeten weten?",
        bookingReviewNote: "Je boekingsgegevens worden gecontroleerd voordat de reservering wordt bevestigd.",
        confirmBooking: "Boeking bevestigen",
        backToBooking: "Terug naar boekingsgegevens",
        requiredFields: "Vul alle verplichte velden in.",
        invalidEmail: "Voer een geldig e-mailadres in.",
        firstNamePlaceholder: "Je voornaam",
        lastNamePlaceholder: "Je achternaam",
        phonePlaceholder: "Voer je telefoonnummer in",
    },
    "Norsk": {
        pending: "Venter på bekreftelse",
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

        roomUnavailable: "Dette rommet er allerede bestilt for de valgte datoene.",
        passengerDetails: "Gjesteopplysninger",
        whoIsTravelling: "Hvem reiser?",
        firstName: "Fornavn",
        lastName: "Etternavn",
        emailAddress: "E-postadresse",
        phoneNumber: "Telefonnummer",
        specialRequests: "Spesielle ønsker",
        specialRequestsPlaceholder: "Er det noe vi bør vite om oppholdet ditt?",
        bookingReviewNote: "Bestillingsopplysningene dine blir gjennomgått før reservasjonen bekreftes.",
        confirmBooking: "Bekreft bestilling",
        backToBooking: "Tilbake til bestillingsdetaljer",
        requiredFields: "Fyll ut alle obligatoriske felt.",
        invalidEmail: "Skriv inn en gyldig e-postadresse.",
        firstNamePlaceholder: "Fornavnet ditt",
        lastNamePlaceholder: "Etternavnet ditt",
        phonePlaceholder: "Skriv inn telefonnummeret ditt",
    },
    "Svenska": {
        pending: "Väntar på bekräftelse",
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

        roomUnavailable: "Det här rummet är redan bokat för de valda datumen.",
        passengerDetails: "Gästuppgifter",
        whoIsTravelling: "Vem reser?",
        firstName: "Förnamn",
        lastName: "Efternamn",
        emailAddress: "E-postadress",
        phoneNumber: "Telefonnummer",
        specialRequests: "Särskilda önskemål",
        specialRequestsPlaceholder: "Är det något vi bör veta om din vistelse?",
        bookingReviewNote: "Dina bokningsuppgifter granskas innan bokningen bekräftas.",
        confirmBooking: "Bekräfta bokning",
        backToBooking: "Tillbaka till bokningsdetaljer",
        requiredFields: "Fyll i alla obligatoriska fält.",
        invalidEmail: "Ange en giltig e-postadress.",
        firstNamePlaceholder: "Ditt förnamn",
        lastNamePlaceholder: "Ditt efternamn",
        phonePlaceholder: "Ange ditt telefonnummer",
    },
    "Dansk": {
        pending: "Afventer bekræftelse",
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

        roomUnavailable: "Dette værelse er allerede booket på de valgte datoer.",
        passengerDetails: "Gæsteoplysninger",
        whoIsTravelling: "Hvem rejser?",
        firstName: "Fornavn",
        lastName: "Efternavn",
        emailAddress: "E-mailadresse",
        phoneNumber: "Telefonnummer",
        specialRequests: "Særlige ønsker",
        specialRequestsPlaceholder: "Er der noget, vi bør vide om dit ophold?",
        bookingReviewNote: "Dine bookingoplysninger bliver gennemgået, før reservationen bekræftes.",
        confirmBooking: "Bekræft booking",
        backToBooking: "Tilbage til bookingoplysninger",
        requiredFields: "Udfyld alle obligatoriske felter.",
        invalidEmail: "Indtast en gyldig e-mailadresse.",
        firstNamePlaceholder: "Dit fornavn",
        lastNamePlaceholder: "Dit efternavn",
        phonePlaceholder: "Indtast dit telefonnummer",
    },
    "Suomi": {
        pending: "Odottaa vahvistusta",
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

        roomUnavailable: "Tämä huone on jo varattu valituille päiville.",
        passengerDetails: "Vieraan tiedot",
        whoIsTravelling: "Kuka matkustaa?",
        firstName: "Etunimi",
        lastName: "Sukunimi",
        emailAddress: "Sähköpostiosoite",
        phoneNumber: "Puhelinnumero",
        specialRequests: "Erityistoiveet",
        specialRequestsPlaceholder: "Onko jotain, mitä meidän pitäisi tietää majoituksestasi?",
        bookingReviewNote: "Varaustiedot tarkistetaan ennen varauksen vahvistamista.",
        confirmBooking: "Vahvista varaus",
        backToBooking: "Takaisin varaustietoihin",
        requiredFields: "Täytä kaikki pakolliset kentät.",
        invalidEmail: "Anna kelvollinen sähköpostiosoite.",
        firstNamePlaceholder: "Etunimesi",
        lastNamePlaceholder: "Sukunimesi",
        phonePlaceholder: "Anna puhelinnumerosi",
    },
    "Polski": {
        pending: "Oczekuje na potwierdzenie",
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

        roomUnavailable: "Ten pokój jest już zarezerwowany w wybranym terminie.",
        passengerDetails: "Dane gościa",
        whoIsTravelling: "Kto podróżuje?",
        firstName: "Imię",
        lastName: "Nazwisko",
        emailAddress: "Adres e-mail",
        phoneNumber: "Numer telefonu",
        specialRequests: "Specjalne życzenia",
        specialRequestsPlaceholder: "Czy jest coś, co powinniśmy wiedzieć o Twoim pobycie?",
        bookingReviewNote: "Dane rezerwacji zostaną sprawdzone przed jej potwierdzeniem.",
        confirmBooking: "Potwierdź rezerwację",
        backToBooking: "Wróć do szczegółów rezerwacji",
        requiredFields: "Wypełnij wszystkie wymagane pola.",
        invalidEmail: "Wpisz prawidłowy adres e-mail.",
        firstNamePlaceholder: "Twoje imię",
        lastNamePlaceholder: "Twoje nazwisko",
        phonePlaceholder: "Wpisz numer telefonu",
    },
    "Čeština": {
        pending: "Čeká na potvrzení",
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

        roomUnavailable: "Tento pokoj je pro vybrané termíny již rezervován.",
        passengerDetails: "Údaje hosta",
        whoIsTravelling: "Kdo cestuje?",
        firstName: "Jméno",
        lastName: "Příjmení",
        emailAddress: "E-mailová adresa",
        phoneNumber: "Telefonní číslo",
        specialRequests: "Zvláštní požadavky",
        specialRequestsPlaceholder: "Je něco, co bychom měli vědět o vašem pobytu?",
        bookingReviewNote: "Údaje rezervace budou před potvrzením zkontrolovány.",
        confirmBooking: "Potvrdit rezervaci",
        backToBooking: "Zpět k detailům rezervace",
        requiredFields: "Vyplňte všechna povinná pole.",
        invalidEmail: "Zadejte platnou e-mailovou adresu.",
        firstNamePlaceholder: "Vaše jméno",
        lastNamePlaceholder: "Vaše příjmení",
        phonePlaceholder: "Zadejte telefonní číslo",
    },
    "Slovenčina": {
        pending: "Čaká na potvrdenie",
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

        roomUnavailable: "Táto izba je už na vybrané dátumy rezervovaná.",
        passengerDetails: "Údaje hosťa",
        whoIsTravelling: "Kto cestuje?",
        firstName: "Meno",
        lastName: "Priezvisko",
        emailAddress: "E-mailová adresa",
        phoneNumber: "Telefónne číslo",
        specialRequests: "Špeciálne požiadavky",
        specialRequestsPlaceholder: "Je niečo, čo by sme mali vedieť o vašom pobyte?",
        bookingReviewNote: "Údaje rezervácie budú pred potvrdením skontrolované.",
        confirmBooking: "Potvrdiť rezerváciu",
        backToBooking: "Späť k detailom rezervácie",
        requiredFields: "Vyplňte všetky povinné polia.",
        invalidEmail: "Zadajte platnú e-mailovú adresu.",
        firstNamePlaceholder: "Vaše meno",
        lastNamePlaceholder: "Vaše priezvisko",
        phonePlaceholder: "Zadajte telefónne číslo",
    },
    "Magyar": {
        pending: "Megerősítésre vár",
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

        roomUnavailable: "Ez a szoba a kiválasztott időpontokra már foglalt.",
        passengerDetails: "Vendég adatai",
        whoIsTravelling: "Ki utazik?",
        firstName: "Keresztnév",
        lastName: "Vezetéknév",
        emailAddress: "E-mail-cím",
        phoneNumber: "Telefonszám",
        specialRequests: "Különleges kérések",
        specialRequestsPlaceholder: "Van valami, amit tudnunk kell a tartózkodásáról?",
        bookingReviewNote: "A foglalási adatokat a megerősítés előtt ellenőrizzük.",
        confirmBooking: "Foglalás megerősítése",
        backToBooking: "Vissza a foglalás részleteihez",
        requiredFields: "Töltse ki az összes kötelező mezőt.",
        invalidEmail: "Adjon meg érvényes e-mail-címet.",
        firstNamePlaceholder: "Keresztneve",
        lastNamePlaceholder: "Vezetékneve",
        phonePlaceholder: "Adja meg telefonszámát",
    },
    "Български": {
        pending: "Очаква потвърждение",
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

        roomUnavailable: "Тази стая вече е резервирана за избраните дати.",
        passengerDetails: "Данни на госта",
        whoIsTravelling: "Кой пътува?",
        firstName: "Име",
        lastName: "Фамилия",
        emailAddress: "Имейл адрес",
        phoneNumber: "Телефонен номер",
        specialRequests: "Специални изисквания",
        specialRequestsPlaceholder: "Има ли нещо, което трябва да знаем за престоя ви?",
        bookingReviewNote: "Данните за резервацията ще бъдат прегледани преди потвърждение.",
        confirmBooking: "Потвърди резервацията",
        backToBooking: "Назад към данните за резервацията",
        requiredFields: "Попълнете всички задължителни полета.",
        invalidEmail: "Въведете валиден имейл адрес.",
        firstNamePlaceholder: "Вашето име",
        lastNamePlaceholder: "Вашата фамилия",
        phonePlaceholder: "Въведете телефонен номер",
    },
    "Hrvatski": {
        pending: "Čeka potvrdu",
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

        roomUnavailable: "Ova je soba već rezervirana za odabrane datume.",
        passengerDetails: "Podaci gosta",
        whoIsTravelling: "Tko putuje?",
        firstName: "Ime",
        lastName: "Prezime",
        emailAddress: "Adresa e-pošte",
        phoneNumber: "Broj telefona",
        specialRequests: "Posebni zahtjevi",
        specialRequestsPlaceholder: "Postoji li nešto što bismo trebali znati o vašem boravku?",
        bookingReviewNote: "Podaci rezervacije bit će provjereni prije potvrde.",
        confirmBooking: "Potvrdi rezervaciju",
        backToBooking: "Natrag na detalje rezervacije",
        requiredFields: "Ispunite sva obavezna polja.",
        invalidEmail: "Unesite valjanu adresu e-pošte.",
        firstNamePlaceholder: "Vaše ime",
        lastNamePlaceholder: "Vaše prezime",
        phonePlaceholder: "Unesite broj telefona",
    },
    "Slovenščina": {
        pending: "Čaka na potrditev",
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

        roomUnavailable: "Ta soba je za izbrane datume že rezervirana.",
        passengerDetails: "Podatki gosta",
        whoIsTravelling: "Kdo potuje?",
        firstName: "Ime",
        lastName: "Priimek",
        emailAddress: "E-poštni naslov",
        phoneNumber: "Telefonska številka",
        specialRequests: "Posebne zahteve",
        specialRequestsPlaceholder: "Je kaj, kar bi morali vedeti o vašem bivanju?",
        bookingReviewNote: "Podatki rezervacije bodo pregledani pred potrditvijo.",
        confirmBooking: "Potrdi rezervacijo",
        backToBooking: "Nazaj na podrobnosti rezervacije",
        requiredFields: "Izpolnite vsa obvezna polja.",
        invalidEmail: "Vnesite veljaven e-poštni naslov.",
        firstNamePlaceholder: "Vaše ime",
        lastNamePlaceholder: "Vaš priimek",
        phonePlaceholder: "Vnesite telefonsko številko",
    },
    "Srpski": {
        pending: "Čeka potvrdu",
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

        roomUnavailable: "Ova soba je već rezervisana za izabrane datume.",
        passengerDetails: "Podaci gosta",
        whoIsTravelling: "Ko putuje?",
        firstName: "Ime",
        lastName: "Prezime",
        emailAddress: "Adresa e-pošte",
        phoneNumber: "Broj telefona",
        specialRequests: "Posebni zahtevi",
        specialRequestsPlaceholder: "Postoji li nešto što bi trebalo da znamo o vašem boravku?",
        bookingReviewNote: "Podaci rezervacije biće provereni pre potvrde.",
        confirmBooking: "Potvrdi rezervaciju",
        backToBooking: "Nazad na detalje rezervacije",
        requiredFields: "Popunite sva obavezna polja.",
        invalidEmail: "Unesite važeću adresu e-pošte.",
        firstNamePlaceholder: "Vaše ime",
        lastNamePlaceholder: "Vaše prezime",
        phonePlaceholder: "Unesite broj telefona",
    },
    "Bosanski": {
        pending: "Čeka potvrdu",
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

        roomUnavailable: "Ova soba je već rezervisana za odabrane datume.",
        passengerDetails: "Podaci gosta",
        whoIsTravelling: "Ko putuje?",
        firstName: "Ime",
        lastName: "Prezime",
        emailAddress: "Adresa e-pošte",
        phoneNumber: "Broj telefona",
        specialRequests: "Posebni zahtjevi",
        specialRequestsPlaceholder: "Postoji li nešto što bismo trebali znati o vašem boravku?",
        bookingReviewNote: "Podaci rezervacije bit će provjereni prije potvrde.",
        confirmBooking: "Potvrdi rezervaciju",
        backToBooking: "Nazad na detalje rezervacije",
        requiredFields: "Popunite sva obavezna polja.",
        invalidEmail: "Unesite važeću adresu e-pošte.",
        firstNamePlaceholder: "Vaše ime",
        lastNamePlaceholder: "Vaše prezime",
        phonePlaceholder: "Unesite broj telefona",
    },
    "Ελληνικά": {
        pending: "Αναμονή επιβεβαίωσης",
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

        roomUnavailable: "Αυτό το δωμάτιο είναι ήδη κρατημένο για τις επιλεγμένες ημερομηνίες.",
        passengerDetails: "Στοιχεία επισκέπτη",
        whoIsTravelling: "Ποιος ταξιδεύει;",
        firstName: "Όνομα",
        lastName: "Επώνυμο",
        emailAddress: "Διεύθυνση email",
        phoneNumber: "Αριθμός τηλεφώνου",
        specialRequests: "Ειδικά αιτήματα",
        specialRequestsPlaceholder: "Υπάρχει κάτι που πρέπει να γνωρίζουμε για τη διαμονή σας;",
        bookingReviewNote: "Τα στοιχεία της κράτησης θα ελεγχθούν πριν από την επιβεβαίωση.",
        confirmBooking: "Επιβεβαίωση κράτησης",
        backToBooking: "Επιστροφή στα στοιχεία κράτησης",
        requiredFields: "Συμπληρώστε όλα τα υποχρεωτικά πεδία.",
        invalidEmail: "Εισαγάγετε μια έγκυρη διεύθυνση email.",
        firstNamePlaceholder: "Το όνομά σας",
        lastNamePlaceholder: "Το επώνυμό σας",
        phonePlaceholder: "Εισαγάγετε τον αριθμό τηλεφώνου σας",
    },
    "Türkçe": {
        pending: "Onay bekliyor",
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

        roomUnavailable: "Bu oda seçilen tarihler için zaten rezerve edilmiş.",
        passengerDetails: "Misafir bilgileri",
        whoIsTravelling: "Kim seyahat ediyor?",
        firstName: "Ad",
        lastName: "Soyad",
        emailAddress: "E-posta adresi",
        phoneNumber: "Telefon numarası",
        specialRequests: "Özel talepler",
        specialRequestsPlaceholder: "Konaklamanız hakkında bilmemiz gereken bir şey var mı?",
        bookingReviewNote: "Rezervasyon bilgileriniz onaydan önce incelenecektir.",
        confirmBooking: "Rezervasyonu onayla",
        backToBooking: "Rezervasyon ayrıntılarına dön",
        requiredFields: "Lütfen tüm zorunlu alanları doldurun.",
        invalidEmail: "Lütfen geçerli bir e-posta adresi girin.",
        firstNamePlaceholder: "Adınız",
        lastNamePlaceholder: "Soyadınız",
        phonePlaceholder: "Telefon numaranızı girin",
    },
    "العربية": {
        pending: "في انتظار التأكيد",
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

        roomUnavailable: "هذه الغرفة محجوزة بالفعل في التواريخ المحددة.",
        passengerDetails: "بيانات الضيف",
        whoIsTravelling: "من المسافر؟",
        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        emailAddress: "البريد الإلكتروني",
        phoneNumber: "رقم الهاتف",
        specialRequests: "طلبات خاصة",
        specialRequestsPlaceholder: "هل هناك ما ينبغي أن نعرفه عن إقامتك؟",
        bookingReviewNote: "ستتم مراجعة بيانات الحجز قبل تأكيده.",
        confirmBooking: "تأكيد الحجز",
        backToBooking: "العودة إلى تفاصيل الحجز",
        requiredFields: "يرجى ملء جميع الحقول المطلوبة.",
        invalidEmail: "يرجى إدخال بريد إلكتروني صالح.",
        firstNamePlaceholder: "اسمك الأول",
        lastNamePlaceholder: "اسم العائلة",
        phonePlaceholder: "أدخل رقم هاتفك",
    },
    "עברית": {
        pending: "ממתין לאישור",
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

        roomUnavailable: "החדר הזה כבר מוזמן לתאריכים שנבחרו.",
        passengerDetails: "פרטי האורח",
        whoIsTravelling: "מי נוסע?",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        emailAddress: "כתובת דוא״ל",
        phoneNumber: "מספר טלפון",
        specialRequests: "בקשות מיוחדות",
        specialRequestsPlaceholder: "האם יש משהו שכדאי שנדע על השהייה שלך?",
        bookingReviewNote: "פרטי ההזמנה ייבדקו לפני אישור ההזמנה.",
        confirmBooking: "אישור ההזמנה",
        backToBooking: "חזרה לפרטי ההזמנה",
        requiredFields: "יש למלא את כל שדות החובה.",
        invalidEmail: "יש להזין כתובת דוא״ל תקינה.",
        firstNamePlaceholder: "השם הפרטי שלך",
        lastNamePlaceholder: "שם המשפחה שלך",
        phonePlaceholder: "הזן מספר טלפון",
    },
    "हिन्दी": {
        pending: "पुष्टि की प्रतीक्षा में",
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

        roomUnavailable: "यह कमरा चुनी गई तारीखों के लिए पहले से बुक है।",
        passengerDetails: "मेहमान की जानकारी",
        whoIsTravelling: "कौन यात्रा कर रहा है?",
        firstName: "पहला नाम",
        lastName: "उपनाम",
        emailAddress: "ईमेल पता",
        phoneNumber: "फ़ोन नंबर",
        specialRequests: "विशेष अनुरोध",
        specialRequestsPlaceholder: "क्या आपके ठहरने के बारे में हमें कुछ जानना चाहिए?",
        bookingReviewNote: "पुष्टि से पहले आपकी बुकिंग जानकारी की समीक्षा की जाएगी।",
        confirmBooking: "बुकिंग की पुष्टि करें",
        backToBooking: "बुकिंग विवरण पर वापस जाएँ",
        requiredFields: "सभी आवश्यक फ़ील्ड भरें।",
        invalidEmail: "मान्य ईमेल पता दर्ज करें।",
        firstNamePlaceholder: "आपका पहला नाम",
        lastNamePlaceholder: "आपका उपनाम",
        phonePlaceholder: "अपना फ़ोन नंबर दर्ज करें",
    },
    "ไทย": {
        pending: "รอการยืนยัน",
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

        roomUnavailable: "ห้องนี้ถูกจองแล้วในวันที่เลือก",
        passengerDetails: "ข้อมูลผู้เข้าพัก",
        whoIsTravelling: "ใครเป็นผู้เดินทาง?",
        firstName: "ชื่อ",
        lastName: "นามสกุล",
        emailAddress: "อีเมล",
        phoneNumber: "หมายเลขโทรศัพท์",
        specialRequests: "คำขอพิเศษ",
        specialRequestsPlaceholder: "มีอะไรที่เราควรรู้เกี่ยวกับการเข้าพักของคุณหรือไม่?",
        bookingReviewNote: "รายละเอียดการจองจะได้รับการตรวจสอบก่อนยืนยันการจอง",
        confirmBooking: "ยืนยันการจอง",
        backToBooking: "กลับไปยังรายละเอียดการจอง",
        requiredFields: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน",
        invalidEmail: "กรุณากรอกอีเมลที่ถูกต้อง",
        firstNamePlaceholder: "ชื่อของคุณ",
        lastNamePlaceholder: "นามสกุลของคุณ",
        phonePlaceholder: "กรอกหมายเลขโทรศัพท์",
    },
    "Bahasa Indonesia": {
        pending: "Menunggu konfirmasi",
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

        roomUnavailable: "Kamar ini sudah dipesan untuk tanggal yang dipilih.",
        passengerDetails: "Data tamu",
        whoIsTravelling: "Siapa yang bepergian?",
        firstName: "Nama depan",
        lastName: "Nama belakang",
        emailAddress: "Alamat email",
        phoneNumber: "Nomor telepon",
        specialRequests: "Permintaan khusus",
        specialRequestsPlaceholder: "Adakah hal yang perlu kami ketahui tentang masa inap Anda?",
        bookingReviewNote: "Detail pemesanan Anda akan ditinjau sebelum reservasi dikonfirmasi.",
        confirmBooking: "Konfirmasi pemesanan",
        backToBooking: "Kembali ke detail pemesanan",
        requiredFields: "Isi semua kolom wajib.",
        invalidEmail: "Masukkan alamat email yang valid.",
        firstNamePlaceholder: "Nama depan Anda",
        lastNamePlaceholder: "Nama belakang Anda",
        phonePlaceholder: "Masukkan nomor telepon Anda",
    },
    "Tiếng Việt": {
        pending: "Đang chờ xác nhận",
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

        roomUnavailable: "Phòng này đã được đặt cho các ngày đã chọn.",
        passengerDetails: "Thông tin khách",
        whoIsTravelling: "Ai sẽ đi?",
        firstName: "Tên",
        lastName: "Họ",
        emailAddress: "Địa chỉ email",
        phoneNumber: "Số điện thoại",
        specialRequests: "Yêu cầu đặc biệt",
        specialRequestsPlaceholder: "Có điều gì chúng tôi cần biết về kỳ nghỉ của bạn không?",
        bookingReviewNote: "Thông tin đặt phòng sẽ được kiểm tra trước khi xác nhận.",
        confirmBooking: "Xác nhận đặt phòng",
        backToBooking: "Quay lại chi tiết đặt phòng",
        requiredFields: "Vui lòng điền đầy đủ các trường bắt buộc.",
        invalidEmail: "Vui lòng nhập địa chỉ email hợp lệ.",
        firstNamePlaceholder: "Tên của bạn",
        lastNamePlaceholder: "Họ của bạn",
        phonePlaceholder: "Nhập số điện thoại",
    },
    "한국어": {
        pending: "확인 대기 중",
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

        roomUnavailable: "선택한 날짜에는 이미 예약된 객실입니다.",
        passengerDetails: "투숙객 정보",
        whoIsTravelling: "누가 여행하나요?",
        firstName: "이름",
        lastName: "성",
        emailAddress: "이메일 주소",
        phoneNumber: "전화번호",
        specialRequests: "특별 요청",
        specialRequestsPlaceholder: "숙박과 관련해 알려주실 사항이 있나요?",
        bookingReviewNote: "예약이 확정되기 전에 예약 정보가 검토됩니다.",
        confirmBooking: "예약 확인",
        backToBooking: "예약 세부정보로 돌아가기",
        requiredFields: "필수 입력란을 모두 작성해 주세요.",
        invalidEmail: "유효한 이메일 주소를 입력해 주세요.",
        firstNamePlaceholder: "이름 입력",
        lastNamePlaceholder: "성 입력",
        phonePlaceholder: "전화번호 입력",
    },
    "日本語": {
        pending: "確認待ち",
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

        roomUnavailable: "この客室は選択した日程ですでに予約されています。",
        passengerDetails: "宿泊者情報",
        whoIsTravelling: "どなたが宿泊しますか？",
        firstName: "名",
        lastName: "姓",
        emailAddress: "メールアドレス",
        phoneNumber: "電話番号",
        specialRequests: "特別なリクエスト",
        specialRequestsPlaceholder: "ご滞在について事前に知らせておきたいことはありますか？",
        bookingReviewNote: "予約確定前に予約内容を確認します。",
        confirmBooking: "予約を確定",
        backToBooking: "予約詳細に戻る",
        requiredFields: "必須項目をすべて入力してください。",
        invalidEmail: "有効なメールアドレスを入力してください。",
        firstNamePlaceholder: "名を入力",
        lastNamePlaceholder: "姓を入力",
        phonePlaceholder: "電話番号を入力",
    },
    "中文": {
        pending: "等待确认",
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

        roomUnavailable: "所选日期的该客房已被预订。",
        passengerDetails: "住客信息",
        whoIsTravelling: "谁将入住？",
        firstName: "名",
        lastName: "姓",
        emailAddress: "电子邮箱",
        phoneNumber: "电话号码",
        specialRequests: "特殊要求",
        specialRequestsPlaceholder: "关于您的住宿，还有什么需要我们提前了解的吗？",
        bookingReviewNote: "预订确认前，我们会核对您的预订信息。",
        confirmBooking: "确认预订",
        backToBooking: "返回预订详情",
        requiredFields: "请填写所有必填字段。",
        invalidEmail: "请输入有效的电子邮箱地址。",
        firstNamePlaceholder: "请输入名字",
        lastNamePlaceholder: "请输入姓氏",
        phonePlaceholder: "请输入电话号码",
    },
    "繁體中文": {
        pending: "等待確認",
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

        roomUnavailable: "所選日期的此客房已被預訂。",
        passengerDetails: "住客資料",
        whoIsTravelling: "誰將入住？",
        firstName: "名字",
        lastName: "姓氏",
        emailAddress: "電子郵件",
        phoneNumber: "電話號碼",
        specialRequests: "特殊需求",
        specialRequestsPlaceholder: "關於您的住宿，還有什麼需要我們提前知道的嗎？",
        bookingReviewNote: "預訂確認前，我們會檢查您的預訂資料。",
        confirmBooking: "確認預訂",
        backToBooking: "返回預訂詳情",
        requiredFields: "請填寫所有必填欄位。",
        invalidEmail: "請輸入有效的電子郵件地址。",
        firstNamePlaceholder: "請輸入名字",
        lastNamePlaceholder: "請輸入姓氏",
        phonePlaceholder: "請輸入電話號碼",
    },
    "Català": {
        pending: "Pendent de confirmació",
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

        roomUnavailable: "Aquesta habitació ja està reservada per a les dates seleccionades.",
        passengerDetails: "Dades de l’hoste",
        whoIsTravelling: "Qui viatja?",
        firstName: "Nom",
        lastName: "Cognoms",
        emailAddress: "Adreça electrònica",
        phoneNumber: "Número de telèfon",
        specialRequests: "Peticions especials",
        specialRequestsPlaceholder: "Hi ha alguna cosa que hauríem de saber sobre la teva estada?",
        bookingReviewNote: "Les dades de la reserva es revisaran abans de confirmar-la.",
        confirmBooking: "Confirma la reserva",
        backToBooking: "Torna als detalls de la reserva",
        requiredFields: "Omple tots els camps obligatoris.",
        invalidEmail: "Introdueix una adreça electrònica vàlida.",
        firstNamePlaceholder: "El teu nom",
        lastNamePlaceholder: "Els teus cognoms",
        phonePlaceholder: "Introdueix el número de telèfon",
    },
    "Eesti": {
        pending: "Kinnituse ootel",
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

        roomUnavailable: "See tuba on valitud kuupäevadeks juba broneeritud.",
        passengerDetails: "Külalise andmed",
        whoIsTravelling: "Kes reisib?",
        firstName: "Eesnimi",
        lastName: "Perekonnanimi",
        emailAddress: "E-posti aadress",
        phoneNumber: "Telefoninumber",
        specialRequests: "Erisoovid",
        specialRequestsPlaceholder: "Kas peaksime teie peatumise kohta midagi teadma?",
        bookingReviewNote: "Broneeringu andmed vaadatakse enne kinnitamist üle.",
        confirmBooking: "Kinnita broneering",
        backToBooking: "Tagasi broneeringu üksikasjade juurde",
        requiredFields: "Täitke kõik kohustuslikud väljad.",
        invalidEmail: "Sisestage kehtiv e-posti aadress.",
        firstNamePlaceholder: "Teie eesnimi",
        lastNamePlaceholder: "Teie perekonnanimi",
        phonePlaceholder: "Sisestage telefoninumber",
    },
    "Latviešu": {
        pending: "Gaida apstiprinājumu",
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

        roomUnavailable: "Šis numurs izvēlētajos datumos jau ir rezervēts.",
        passengerDetails: "Viesa dati",
        whoIsTravelling: "Kas ceļo?",
        firstName: "Vārds",
        lastName: "Uzvārds",
        emailAddress: "E-pasta adrese",
        phoneNumber: "Tālruņa numurs",
        specialRequests: "Īpašas vēlmes",
        specialRequestsPlaceholder: "Vai ir kas tāds, kas mums būtu jāzina par jūsu uzturēšanos?",
        bookingReviewNote: "Rezervācijas dati tiks pārbaudīti pirms apstiprināšanas.",
        confirmBooking: "Apstiprināt rezervāciju",
        backToBooking: "Atpakaļ uz rezervācijas informāciju",
        requiredFields: "Aizpildiet visus obligātos laukus.",
        invalidEmail: "Ievadiet derīgu e-pasta adresi.",
        firstNamePlaceholder: "Jūsu vārds",
        lastNamePlaceholder: "Jūsu uzvārds",
        phonePlaceholder: "Ievadiet tālruņa numuru",
    },
    "Lietuvių": {
        pending: "Laukiama patvirtinimo",
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

        roomUnavailable: "Šis kambarys pasirinktomis datomis jau rezervuotas.",
        passengerDetails: "Svečio duomenys",
        whoIsTravelling: "Kas keliauja?",
        firstName: "Vardas",
        lastName: "Pavardė",
        emailAddress: "El. pašto adresas",
        phoneNumber: "Telefono numeris",
        specialRequests: "Specialūs pageidavimai",
        specialRequestsPlaceholder: "Ar yra kas nors, ką turėtume žinoti apie jūsų viešnagę?",
        bookingReviewNote: "Rezervacijos duomenys bus patikrinti prieš patvirtinimą.",
        confirmBooking: "Patvirtinti rezervaciją",
        backToBooking: "Grįžti į rezervacijos informaciją",
        requiredFields: "Užpildykite visus privalomus laukus.",
        invalidEmail: "Įveskite galiojantį el. pašto adresą.",
        firstNamePlaceholder: "Jūsų vardas",
        lastNamePlaceholder: "Jūsų pavardė",
        phonePlaceholder: "Įveskite telefono numerį",
    },
} as const;

type BookingPageKey = keyof typeof bookingPageTranslations.English;

function getBookingText(
    language: string,
    key: BookingPageKey,
    values?: Record<string, string | number>
): string {
    const languageName =
        language.split("|")[0];

    const dictionary =
        bookingPageTranslations[
            languageName as keyof typeof bookingPageTranslations
            ] ??
        bookingPageTranslations.English;

    let text: string =
        (dictionary as Partial<typeof bookingPageTranslations.English>)[key] ??
        bookingPageTranslations.English[key];

    if (values) {
        Object.entries(values).forEach(
            ([name, value]) => {
                text = text.replace(
                    `{${name}}`,
                    String(value)
                );
            }
        );
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
     * Property and room data come from the ASP.NET Core backend.
     * No localStorage or mock fallback is used on this page.
     */

    useEffect(() => {

        let mounted = true;

        const loadBookingData =
            async () => {

                setIsLoaded(false);

                if (
                    !Number.isInteger(propertyId) ||
                    propertyId <= 0
                ) {
                    if (mounted) {
                        setProperty(null);
                        setPropertyRooms([]);
                        setIsLoaded(true);
                    }

                    return;
                }

                try {
                    const allProperties =
                        await getPropertiesFromApi();

                    const foundProperty =
                        allProperties.find(
                            (item) =>
                                item.id ===
                                propertyId
                        );

                    if (!mounted) {
                        return;
                    }

                    if (!foundProperty) {
                        setProperty(null);
                        setPropertyRooms([]);
                        setIsLoaded(true);

                        return;
                    }

                    const rooms =
                        await getRoomsByPropertyIdFromApi(
                            foundProperty.id
                        );

                    if (!mounted) {
                        return;
                    }

                    setProperty(
                        foundProperty
                    );

                    setPropertyRooms(
                        rooms
                    );
                } catch (loadError) {
                    console.error(
                        "Could not load booking data from the backend.",
                        loadError
                    );

                    if (!mounted) {
                        return;
                    }

                    setProperty(null);
                    setPropertyRooms([]);
                } finally {
                    if (mounted) {
                        setIsLoaded(true);
                    }
                }
            };

        void loadBookingData();

        return () => {
            mounted = false;
        };

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
       PASSENGER DETAILS
       ===================================================== */

    const [
        firstName,
        setFirstName,
    ] =
        useState("");

    const [
        lastName,
        setLastName,
    ] =
        useState("");

    const [
        email,
        setEmail,
    ] =
        useState("");

    const [
        phone,
        setPhone,
    ] =
        useState("");

    const [
        specialRequests,
        setSpecialRequests,
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
                : String(selectedRoom.size).trim().endsWith("m²")
                    ? String(selectedRoom.size).trim()
                    : `${String(selectedRoom.size).trim()} m²`
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

            if (!checkIn || !checkOut) {
                setError(getBookingText(language, "selectDates"));
                return false;
            }

            const today = getTodayDate();

            if (checkIn < today) {
                setError(getBookingText(language, "checkInPast"));
                return false;
            }

            if (checkOut < today) {
                setError(getBookingText(language, "checkOutPast"));
                return false;
            }

            if (checkOut <= checkIn) {
                setError(getBookingText(language, "checkOutAfter"));
                return false;
            }

            if (adults < 1) {
                setError(getBookingText(language, "adultRequired"));
                return false;
            }

            if (selectedRoom && adults + children > selectedRoom.guests) {
                setError(
                    getBookingText(language, "capacity", {
                        n: selectedRoom.guests,
                    })
                );
                return false;
            }

            if (!currentUser) {
                setError(getBookingText(language, "loggedIn"));
                return false;
            }

            if (!property) {
                setError(getBookingText(language, "propertyMissing"));
                return false;
            }

            return true;
        };


    /* =====================================================
       CONFIRM BOOKING
       ===================================================== */

    const handleConfirmBooking =
        async () => {
            if (!handleBooking()) {
                return;
            }

            setError("");

            if (!currentUser) {
                setError(
                    getBookingText(
                        language,
                        "loggedIn"
                    )
                );

                return;
            }

            if (!property) {
                setError(
                    getBookingText(
                        language,
                        "propertyMissing"
                    )
                );

                return;
            }

            if (
                !firstName.trim() ||
                !lastName.trim() ||
                !email.trim() ||
                !phone.trim()
            ) {
                setError(
                    getBookingText(
                        language,
                        "requiredFields"
                    )
                );

                return;
            }

            const emailIsValid =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    email.trim()
                );

            if (!emailIsValid) {
                setError(
                    getBookingText(
                        language,
                        "invalidEmail"
                    )
                );

                return;
            }

            try {
                /* ---------------------------------------------
                   CHECK ROOM AVAILABILITY THROUGH BACKEND
                   --------------------------------------------- */

                if (selectedRoom) {
                    const isAvailable =
                        await checkRoomAvailabilityFromApi(
                            property.id,
                            selectedRoom.id,
                            checkIn,
                            checkOut
                        );

                    if (!isAvailable) {
                        setError(
                            getBookingText(
                                language,
                                "roomUnavailable"
                            )
                        );

                        return;
                    }
                }

                /* ---------------------------------------------
                   CREATE BOOKING THROUGH BACKEND
                   --------------------------------------------- */

                await createBookingInApi({
                    userId: String(currentUser.id),
                    propertyId: property.id,
                    roomId: selectedRoom?.id,
                    checkIn,
                    checkOut,
                    adults,
                    children,
                    infants,
                    guests: totalGuests,
                    totalPrice,
                    status: "pending",
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    specialRequests:
                        specialRequests.trim(),
                });

                /* ---------------------------------------------
                   REDIRECT
                   --------------------------------------------- */

                router.push("/bookings");
            } catch {
                setError(
                    getBookingText(
                        language,
                        "roomUnavailable"
                    )
                );
            }
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

            <main
                className="bookings-loading-page"
                aria-busy="true"
            >

                <section className="section">

                    <div
                        className="container booking-page"
                        style={{ minHeight: "100dvh" }}
                    />

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
                            className="stayway-load-in stayway-load-1"
                        >
                            ← {getBookingText(language, "backToProperty")}
                        </Link>


                        {/* TITLE */}

                        <h1 className="stayway-load-in stayway-load-2">
                            {getBookingText(language, "bookYourStay")}
                        </h1>


                        <div className="booking-layout">


                            {/* =================================================
                                           FORM
                                ================================================= */}

                            <div className="booking-form stayway-load-in stayway-load-3">


                                <div
                                    style={{
                                        marginTop: "0",
                                    }}
                                >
                                    <div
                                        style={{
                                            marginBottom: "22px",
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin: "0 0 8px",
                                                color: "#7055e8",
                                                fontSize: "12px",
                                                fontWeight: 800,
                                                letterSpacing: "1.5px",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {getBookingText(language, "passengerDetails")}
                                        </p>
                                        <h2
                                            style={{
                                                margin: 0,
                                                fontSize: "26px",
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {getBookingText(language, "whoIsTravelling")}
                                        </h2>
                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                            gap: "16px",
                                        }}
                                    >
                                        <label>
                                            {getBookingText(language, "firstName")}
                                            <input
                                                type="text"
                                                value={firstName}
                                                placeholder={getBookingText(language, "firstNamePlaceholder")}
                                                onChange={(event) =>
                                                    setFirstName(event.target.value)
                                                }
                                                autoComplete="given-name"
                                            />
                                        </label>

                                        <label>
                                            {getBookingText(language, "lastName")}
                                            <input
                                                type="text"
                                                value={lastName}
                                                placeholder={getBookingText(language, "lastNamePlaceholder")}
                                                onChange={(event) =>
                                                    setLastName(event.target.value)
                                                }
                                                autoComplete="family-name"
                                            />
                                        </label>

                                        <label>
                                            {getBookingText(language, "emailAddress")}
                                            <input
                                                type="email"
                                                value={email}
                                                placeholder="you@example.com"
                                                onChange={(event) =>
                                                    setEmail(event.target.value)
                                                }
                                                autoComplete="email"
                                            />
                                        </label>

                                        <label>
                                            {getBookingText(language, "phoneNumber")}
                                            <input
                                                type="tel"
                                                value={phone}
                                                placeholder={getBookingText(language, "phonePlaceholder")}
                                                onChange={(event) =>
                                                    setPhone(event.target.value)
                                                }
                                                autoComplete="tel"
                                            />
                                        </label>
                                    </div>

                                    <label
                                        style={{
                                            display: "block",
                                            marginTop: "18px",
                                        }}
                                    >
                                            <span
                                                style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontWeight: 700,
                                                    color: "#373241",
                                                }}
                                            >
                                                {getBookingText(language, "specialRequests")}
                                            </span>

                                        <textarea
                                            value={specialRequests}
                                            placeholder={getBookingText(
                                                language,
                                                "specialRequestsPlaceholder"
                                            )}
                                            onChange={(event) =>
                                                setSpecialRequests(event.target.value)
                                            }
                                            rows={4}
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                minHeight: "112px",
                                                padding: "14px 16px",
                                                border: "1px solid #e3ddf1",
                                                borderRadius: "14px",
                                                background: "#fff",
                                                color: "#373241",
                                                fontSize: "14px",
                                                lineHeight: 1.5,
                                                resize: "vertical",
                                                boxSizing: "border-box",
                                                outline: "none",
                                            }}
                                        />
                                    </label>

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            marginTop: "18px",
                                            marginBottom: "22px",
                                            padding: "14px 16px",
                                            borderRadius: "14px",
                                            background: "#f7f3ff",
                                            color: "#625b73",
                                            fontSize: "13px",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    width: "22px",
                                                    height: "22px",
                                                    flex: "0 0 22px",
                                                    borderRadius: "50%",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: "#7055e8",
                                                    color: "#fff",
                                                    fontWeight: 800,
                                                }}
                                            >
                                                ✓
                                            </span>

                                        <span>
                                                {getBookingText(
                                                    language,
                                                    "bookingReviewNote"
                                                )}
                                            </span>
                                    </div>

                                </div>


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
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={handleConfirmBooking}
                                    style={{
                                        marginTop: "22px",
                                        width: "100%",
                                    }}
                                >
                                    {getBookingText(language, "confirmBooking")}
                                </button>


                            </div>


                            {/* =================================================
                               SUMMARY
                               ================================================= */}

                            <div className="booking-summary stayway-load-in stayway-load-4">


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
                                                language as keyof typeof bookingPageTranslations
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

                <main aria-busy="true">

                    <section className="section">

                        <div
                            className="container booking-page"
                            style={{ minHeight: "100dvh" }}
                        />

                    </section>

                </main>
            }
        >

            <NewBookingForm />

        </Suspense>
    );
}
