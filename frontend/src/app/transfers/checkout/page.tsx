"use client";

import Link from "next/link";
import {
    Suspense,
    useEffect,
    useState,
} from "react";
import { useSearchParams } from "next/navigation";

import { useSettings } from "@/context/SettingsContext";
import { currencyInfo } from "@/data/currency";
import { getTranslation } from "@/data/translations";

import {
    createTransferBookingInApi,
    getCanonicalTransferOptionTitle,
    getTransferBookingsFromApi,
    getTransferDuration,
    type TransferBooking,
} from "@/services/transferService";

import {
    getTransferDriversFromApi,
    type TransferDriver,
} from "@/services/transferDriverService";

import {
    getTransferLocationsFromApi,
} from "@/services/transferLocationService";

import {
    getTransferVehiclesFromApi,
} from "@/services/transferVehicleService";

import type {
    TransferVehicle,
} from "@/data/transferVehicles";

import {
    isAuthenticated,
} from "@/services/authService";

const transferCheckoutTranslations = {
    "English": {
        passengerDetails: "Passenger details",
        whoIsTravelling: "Who is travelling?",
        firstName: "First name",
        lastName: "Last name",
        emailAddress: "Email address",
        phoneNumber: "Phone number",
        specialRequests: "Special requests",
        firstNamePlaceholder: "Your first name",
        lastNamePlaceholder: "Your last name",
        phonePlaceholder: "Enter your phone number",
        completeYour: "Complete your",
        transferBooking: "transfer booking.",
        heroDescription: "Enter your details to complete your transfer reservation.",
        transferUnavailable: "Transfer unavailable",
        yourTransfer: "YOUR TRANSFER",
        from: "from",
        returnJourney: "RETURN JOURNEY",
        confirmTransfer: "Confirm transfer",
        backToTransferDetails: "Back to transfer details",
        requiredPassengerDetails: "Please complete all required passenger details.",
        invalidTransferDateTime: "Please select a valid transfer date and time.",
        invalidReturnDateTime: "Please select a valid return date and time.",
        cannotDetermineCity: "We could not determine the transfer city.",
        departureUnavailable: "No vehicle with an available assigned driver is available for the departure on {date} at {time}. Please choose a different departure date or time.",
        returnUnavailable: "No vehicle with an available assigned driver is available for the return on {date} at {time}. Please choose a different return date or time.",
        pairUnavailable: "No single vehicle and assigned driver pair is available for both the departure on {departureDate} at {departureTime} and the return on {returnDate} at {returnTime}. Please choose different departure or return date/time.",
        transferUnavailableMessage: "No vehicle with an available assigned driver is available for the transfer on {date} at {time}. Please choose a different date or time.",
        noAssignedDriver: "The selected vehicle does not have an assigned driver.",
        noLongerAvailable: "This vehicle and driver pair is no longer available for the selected transfer. Please choose a different date or time.",
        passengerSingular: "passenger",
        journeyPlaceholder: "Anything we should know about your journey?",
        transferReviewNote: "Your transfer details will be reviewed before the reservation is confirmed.",
    },
    "Română": {
        passengerDetails: "Datele pasagerului",
        whoIsTravelling: "Cine călătorește?",
        firstName: "Prenume",
        lastName: "Nume",
        emailAddress: "Adresă de email",
        phoneNumber: "Număr de telefon",
        specialRequests: "Solicitări speciale",
        firstNamePlaceholder: "Prenumele tău",
        lastNamePlaceholder: "Numele tău",
        phonePlaceholder: "Introdu numărul de telefon",
        completeYour: "Finalizează",
        transferBooking: "rezervarea transferului.",
        heroDescription: "Introdu datele tale pentru a finaliza rezervarea transferului.",
        transferUnavailable: "Transfer indisponibil",
        yourTransfer: "TRANSFERUL TĂU",
        from: "de la",
        returnJourney: "CURSA DE ÎNTOARCERE",
        confirmTransfer: "Confirmă transferul",
        backToTransferDetails: "Înapoi la detaliile transferului",
        requiredPassengerDetails: "Completează toate datele obligatorii ale pasagerului.",
        invalidTransferDateTime: "Selectează o dată și o oră valide pentru transfer.",
        invalidReturnDateTime: "Selectează o dată și o oră valide pentru întoarcere.",
        cannotDetermineCity: "Nu am putut determina orașul transferului.",
        departureUnavailable: "Nu este disponibil niciun vehicul cu șofer alocat pentru plecarea din {date} la {time}. Alege o altă dată sau oră de plecare.",
        returnUnavailable: "Nu este disponibil niciun vehicul cu șofer alocat pentru întoarcerea din {date} la {time}. Alege o altă dată sau oră de întoarcere.",
        pairUnavailable: "Nu există aceeași pereche vehicul–șofer disponibilă atât pentru plecarea din {departureDate} la {departureTime}, cât și pentru întoarcerea din {returnDate} la {returnTime}. Alege alte date sau ore.",
        transferUnavailableMessage: "Nu este disponibil niciun vehicul cu șofer alocat pentru transferul din {date} la {time}. Alege o altă dată sau oră.",
        noAssignedDriver: "Vehiculul selectat nu are un șofer alocat.",
        noLongerAvailable: "Această pereche vehicul–șofer nu mai este disponibilă pentru transferul selectat. Alege o altă dată sau oră.",
        passengerSingular: "pasager",
        journeyPlaceholder: "Este ceva ce ar trebui să știm despre călătoria ta?",
        transferReviewNote: "Detaliile transferului vor fi verificate înainte ca rezervarea să fie confirmată.",
    },
    "Русский": {
        passengerDetails: "Данные гостя",
        whoIsTravelling: "Кто путешествует?",
        firstName: "Имя",
        lastName: "Фамилия",
        emailAddress: "Электронная почта",
        phoneNumber: "Номер телефона",
        specialRequests: "Особые пожелания",
        firstNamePlaceholder: "Ваше имя",
        lastNamePlaceholder: "Ваша фамилия",
        phonePlaceholder: "Введите номер телефона",
        completeYour: "Завершите",
        transferBooking: "бронирование трансфера.",
        heroDescription: "Введите свои данные, чтобы завершить бронирование трансфера.",
        transferUnavailable: "Трансфер недоступен",
        yourTransfer: "ВАШ ТРАНСФЕР",
        from: "от",
        returnJourney: "ОБРАТНАЯ ПОЕЗДКА",
        confirmTransfer: "Подтвердить трансфер",
        backToTransferDetails: "Назад к деталям трансфера",
        requiredPassengerDetails: "Заполните все обязательные данные пассажира.",
        invalidTransferDateTime: "Выберите корректные дату и время трансфера.",
        invalidReturnDateTime: "Выберите корректные дату и время обратной поездки.",
        cannotDetermineCity: "Не удалось определить город трансфера.",
        departureUnavailable: "На отправление {date} в {time} нет доступного автомобиля с назначенным водителем. Выберите другую дату или время отправления.",
        returnUnavailable: "На обратную поездку {date} в {time} нет доступного автомобиля с назначенным водителем. Выберите другую дату или время возврата.",
        pairUnavailable: "Нет одной пары автомобиль–водитель, доступной и для отправления {departureDate} в {departureTime}, и для возврата {returnDate} в {returnTime}. Выберите другие дату или время.",
        transferUnavailableMessage: "На трансфер {date} в {time} нет доступного автомобиля с назначенным водителем. Выберите другую дату или время.",
        noAssignedDriver: "У выбранного автомобиля нет назначенного водителя.",
        noLongerAvailable: "Эта пара автомобиль–водитель больше недоступна для выбранного трансфера. Выберите другую дату или время.",
        passengerSingular: "пассажир",
        journeyPlaceholder: "Есть ли что-то, что нам следует знать о вашей поездке?",
        transferReviewNote: "Данные трансфера будут проверены перед подтверждением бронирования.",
    },
    "Українська": {
        passengerDetails: "Дані гостя",
        whoIsTravelling: "Хто подорожує?",
        firstName: "Ім’я",
        lastName: "Прізвище",
        emailAddress: "Електронна пошта",
        phoneNumber: "Номер телефону",
        specialRequests: "Особливі побажання",
        firstNamePlaceholder: "Ваше ім’я",
        lastNamePlaceholder: "Ваше прізвище",
        phonePlaceholder: "Введіть номер телефону",
        completeYour: "Завершіть",
        transferBooking: "бронювання трансферу.",
        heroDescription: "Введіть свої дані, щоб завершити бронювання трансферу.",
        transferUnavailable: "Трансфер недоступний",
        yourTransfer: "ВАШ ТРАНСФЕР",
        from: "від",
        returnJourney: "ЗВОРОТНА ПОЇЗДКА",
        confirmTransfer: "Підтвердити трансфер",
        backToTransferDetails: "Назад до деталей трансферу",
        requiredPassengerDetails: "Заповніть усі обов’язкові дані пасажира.",
        invalidTransferDateTime: "Виберіть коректні дату й час трансферу.",
        invalidReturnDateTime: "Виберіть коректні дату й час зворотної поїздки.",
        cannotDetermineCity: "Не вдалося визначити місто трансферу.",
        departureUnavailable: "На виїзд {date} о {time} немає доступного автомобіля з призначеним водієм. Виберіть іншу дату або час виїзду.",
        returnUnavailable: "На повернення {date} о {time} немає доступного автомобіля з призначеним водієм. Виберіть іншу дату або час повернення.",
        pairUnavailable: "Немає однієї пари автомобіль–водій, доступної і для виїзду {departureDate} о {departureTime}, і для повернення {returnDate} о {returnTime}. Виберіть інші дату або час.",
        transferUnavailableMessage: "На трансфер {date} о {time} немає доступного автомобіля з призначеним водієм. Виберіть іншу дату або час.",
        noAssignedDriver: "Для вибраного автомобіля не призначено водія.",
        noLongerAvailable: "Ця пара автомобіль–водій більше недоступна для вибраного трансферу. Виберіть іншу дату або час.",
        passengerSingular: "пасажир",
        journeyPlaceholder: "Чи є щось, що нам варто знати про вашу поїздку?",
        transferReviewNote: "Дані трансферу буде перевірено перед підтвердженням бронювання.",
    },
    "Français": {
        passengerDetails: "Informations du voyageur",
        whoIsTravelling: "Qui voyage ?",
        firstName: "Prénom",
        lastName: "Nom",
        emailAddress: "Adresse e-mail",
        phoneNumber: "Numéro de téléphone",
        specialRequests: "Demandes spéciales",
        firstNamePlaceholder: "Votre prénom",
        lastNamePlaceholder: "Votre nom",
        phonePlaceholder: "Saisissez votre numéro de téléphone",
        completeYour: "Finalisez",
        transferBooking: "votre réservation de transfert.",
        heroDescription: "Saisissez vos informations pour finaliser votre réservation de transfert.",
        transferUnavailable: "Transfert indisponible",
        yourTransfer: "VOTRE TRANSFERT",
        from: "à partir de",
        returnJourney: "TRAJET RETOUR",
        confirmTransfer: "Confirmer le transfert",
        backToTransferDetails: "Retour aux détails du transfert",
        requiredPassengerDetails: "Veuillez compléter toutes les informations obligatoires du passager.",
        invalidTransferDateTime: "Veuillez sélectionner une date et une heure de transfert valides.",
        invalidReturnDateTime: "Veuillez sélectionner une date et une heure de retour valides.",
        cannotDetermineCity: "Nous n’avons pas pu déterminer la ville du transfert.",
        departureUnavailable: "Aucun véhicule avec chauffeur attribué n’est disponible pour le départ le {date} à {time}. Choisissez une autre date ou heure de départ.",
        returnUnavailable: "Aucun véhicule avec chauffeur attribué n’est disponible pour le retour le {date} à {time}. Choisissez une autre date ou heure de retour.",
        pairUnavailable: "Aucune même paire véhicule–chauffeur n’est disponible à la fois pour le départ le {departureDate} à {departureTime} et le retour le {returnDate} à {returnTime}. Choisissez d’autres dates ou heures.",
        transferUnavailableMessage: "Aucun véhicule avec chauffeur attribué n’est disponible pour le transfert le {date} à {time}. Choisissez une autre date ou heure.",
        noAssignedDriver: "Le véhicule sélectionné n’a pas de chauffeur attribué.",
        noLongerAvailable: "Cette paire véhicule–chauffeur n’est plus disponible pour le transfert sélectionné. Choisissez une autre date ou heure.",
        passengerSingular: "passager",
        journeyPlaceholder: "Y a-t-il quelque chose que nous devrions savoir sur votre trajet ?",
        transferReviewNote: "Les détails de votre transfert seront vérifiés avant la confirmation de la réservation.",
    },
    "Español": {
        passengerDetails: "Datos del huésped",
        whoIsTravelling: "¿Quién viaja?",
        firstName: "Nombre",
        lastName: "Apellidos",
        emailAddress: "Correo electrónico",
        phoneNumber: "Número de teléfono",
        specialRequests: "Solicitudes especiales",
        firstNamePlaceholder: "Tu nombre",
        lastNamePlaceholder: "Tus apellidos",
        phonePlaceholder: "Introduce tu número de teléfono",
        completeYour: "Completa",
        transferBooking: "tu reserva de traslado.",
        heroDescription: "Introduce tus datos para completar la reserva del traslado.",
        transferUnavailable: "Traslado no disponible",
        yourTransfer: "TU TRASLADO",
        from: "desde",
        returnJourney: "VIAJE DE REGRESO",
        confirmTransfer: "Confirmar traslado",
        backToTransferDetails: "Volver a los detalles del traslado",
        requiredPassengerDetails: "Completa todos los datos obligatorios del pasajero.",
        invalidTransferDateTime: "Selecciona una fecha y hora válidas para el traslado.",
        invalidReturnDateTime: "Selecciona una fecha y hora válidas para el regreso.",
        cannotDetermineCity: "No pudimos determinar la ciudad del traslado.",
        departureUnavailable: "No hay ningún vehículo con conductor asignado disponible para la salida del {date} a las {time}. Elige otra fecha u hora de salida.",
        returnUnavailable: "No hay ningún vehículo con conductor asignado disponible para el regreso del {date} a las {time}. Elige otra fecha u hora de regreso.",
        pairUnavailable: "No hay una misma pareja de vehículo y conductor disponible tanto para la salida del {departureDate} a las {departureTime} como para el regreso del {returnDate} a las {returnTime}. Elige otras fechas u horas.",
        transferUnavailableMessage: "No hay ningún vehículo con conductor asignado disponible para el traslado del {date} a las {time}. Elige otra fecha u hora.",
        noAssignedDriver: "El vehículo seleccionado no tiene un conductor asignado.",
        noLongerAvailable: "Esta pareja de vehículo y conductor ya no está disponible para el traslado seleccionado. Elige otra fecha u hora.",
        passengerSingular: "pasajero",
        journeyPlaceholder: "¿Hay algo que debamos saber sobre tu trayecto?",
        transferReviewNote: "Los datos del traslado se revisarán antes de confirmar la reserva.",
    },
    "Deutsch": {
        passengerDetails: "Gästedaten",
        whoIsTravelling: "Wer reist?",
        firstName: "Vorname",
        lastName: "Nachname",
        emailAddress: "E-Mail-Adresse",
        phoneNumber: "Telefonnummer",
        specialRequests: "Besondere Wünsche",
        firstNamePlaceholder: "Ihr Vorname",
        lastNamePlaceholder: "Ihr Nachname",
        phonePlaceholder: "Telefonnummer eingeben",
        completeYour: "Schließen Sie",
        transferBooking: "Ihre Transferbuchung ab.",
        heroDescription: "Geben Sie Ihre Daten ein, um Ihre Transferreservierung abzuschließen.",
        transferUnavailable: "Transfer nicht verfügbar",
        yourTransfer: "IHR TRANSFER",
        from: "ab",
        returnJourney: "RÜCKFAHRT",
        confirmTransfer: "Transfer bestätigen",
        backToTransferDetails: "Zurück zu den Transferdetails",
        requiredPassengerDetails: "Bitte füllen Sie alle erforderlichen Passagierdaten aus.",
        invalidTransferDateTime: "Bitte wählen Sie ein gültiges Transferdatum und eine gültige Uhrzeit.",
        invalidReturnDateTime: "Bitte wählen Sie ein gültiges Rückfahrtdatum und eine gültige Uhrzeit.",
        cannotDetermineCity: "Die Transferstadt konnte nicht ermittelt werden.",
        departureUnavailable: "Für die Abfahrt am {date} um {time} ist kein Fahrzeug mit zugewiesenem Fahrer verfügbar. Wählen Sie ein anderes Datum oder eine andere Uhrzeit.",
        returnUnavailable: "Für die Rückfahrt am {date} um {time} ist kein Fahrzeug mit zugewiesenem Fahrer verfügbar. Wählen Sie ein anderes Datum oder eine andere Uhrzeit.",
        pairUnavailable: "Es ist keine einzelne Fahrzeug-Fahrer-Kombination sowohl für die Abfahrt am {departureDate} um {departureTime} als auch für die Rückfahrt am {returnDate} um {returnTime} verfügbar. Wählen Sie andere Daten oder Uhrzeiten.",
        transferUnavailableMessage: "Für den Transfer am {date} um {time} ist kein Fahrzeug mit zugewiesenem Fahrer verfügbar. Wählen Sie ein anderes Datum oder eine andere Uhrzeit.",
        noAssignedDriver: "Dem ausgewählten Fahrzeug ist kein Fahrer zugewiesen.",
        noLongerAvailable: "Diese Fahrzeug-Fahrer-Kombination ist für den ausgewählten Transfer nicht mehr verfügbar. Wählen Sie ein anderes Datum oder eine andere Uhrzeit.",
        passengerSingular: "Passagier",
        journeyPlaceholder: "Gibt es etwas, das wir über Ihre Fahrt wissen sollten?",
        transferReviewNote: "Ihre Transferdetails werden vor der Bestätigung der Reservierung geprüft.",
    },
    "Italiano": {
        passengerDetails: "Dati dell’ospite",
        whoIsTravelling: "Chi viaggia?",
        firstName: "Nome",
        lastName: "Cognome",
        emailAddress: "Indirizzo e-mail",
        phoneNumber: "Numero di telefono",
        specialRequests: "Richieste speciali",
        firstNamePlaceholder: "Il tuo nome",
        lastNamePlaceholder: "Il tuo cognome",
        phonePlaceholder: "Inserisci il numero di telefono",
        completeYour: "Completa",
        transferBooking: "la prenotazione del trasferimento.",
        heroDescription: "Inserisci i tuoi dati per completare la prenotazione del trasferimento.",
        transferUnavailable: "Trasferimento non disponibile",
        yourTransfer: "IL TUO TRASFERIMENTO",
        from: "da",
        returnJourney: "VIAGGIO DI RITORNO",
        confirmTransfer: "Conferma trasferimento",
        backToTransferDetails: "Torna ai dettagli del trasferimento",
        requiredPassengerDetails: "Compila tutti i dati obbligatori del passeggero.",
        invalidTransferDateTime: "Seleziona una data e un’ora valide per il trasferimento.",
        invalidReturnDateTime: "Seleziona una data e un’ora valide per il ritorno.",
        cannotDetermineCity: "Non è stato possibile determinare la città del trasferimento.",
        departureUnavailable: "Nessun veicolo con autista assegnato è disponibile per la partenza del {date} alle {time}. Scegli un’altra data o ora di partenza.",
        returnUnavailable: "Nessun veicolo con autista assegnato è disponibile per il ritorno del {date} alle {time}. Scegli un’altra data o ora di ritorno.",
        pairUnavailable: "Nessuna singola coppia veicolo-autista è disponibile sia per la partenza del {departureDate} alle {departureTime} sia per il ritorno del {returnDate} alle {returnTime}. Scegli date o orari diversi.",
        transferUnavailableMessage: "Nessun veicolo con autista assegnato è disponibile per il trasferimento del {date} alle {time}. Scegli un’altra data o ora.",
        noAssignedDriver: "Il veicolo selezionato non ha un autista assegnato.",
        noLongerAvailable: "Questa coppia veicolo-autista non è più disponibile per il trasferimento selezionato. Scegli un’altra data o ora.",
        passengerSingular: "passeggero",
        journeyPlaceholder: "C’è qualcosa che dovremmo sapere sul tuo viaggio?",
        transferReviewNote: "I dettagli del trasferimento verranno verificati prima della conferma della prenotazione.",
    },
    "Português": {
        passengerDetails: "Dados do hóspede",
        whoIsTravelling: "Quem vai viajar?",
        firstName: "Nome",
        lastName: "Apelido",
        emailAddress: "Endereço de e-mail",
        phoneNumber: "Número de telefone",
        specialRequests: "Pedidos especiais",
        firstNamePlaceholder: "O seu nome",
        lastNamePlaceholder: "O seu apelido",
        phonePlaceholder: "Introduza o número de telefone",
        completeYour: "Conclua",
        transferBooking: "a sua reserva de transfer.",
        heroDescription: "Introduza os seus dados para concluir a reserva do transfer.",
        transferUnavailable: "Transfer indisponível",
        yourTransfer: "O SEU TRANSFER",
        from: "desde",
        returnJourney: "VIAGEM DE REGRESSO",
        confirmTransfer: "Confirmar transfer",
        backToTransferDetails: "Voltar aos detalhes do transfer",
        requiredPassengerDetails: "Preencha todos os dados obrigatórios do passageiro.",
        invalidTransferDateTime: "Selecione uma data e hora válidas para o transfer.",
        invalidReturnDateTime: "Selecione uma data e hora válidas para o regresso.",
        cannotDetermineCity: "Não foi possível determinar a cidade do transfer.",
        departureUnavailable: "Não há veículo com motorista atribuído disponível para a partida em {date} às {time}. Escolha outra data ou hora de partida.",
        returnUnavailable: "Não há veículo com motorista atribuído disponível para o regresso em {date} às {time}. Escolha outra data ou hora de regresso.",
        pairUnavailable: "Não há uma única combinação veículo-motorista disponível tanto para a partida em {departureDate} às {departureTime} como para o regresso em {returnDate} às {returnTime}. Escolha outras datas ou horas.",
        transferUnavailableMessage: "Não há veículo com motorista atribuído disponível para o transfer em {date} às {time}. Escolha outra data ou hora.",
        noAssignedDriver: "O veículo selecionado não tem motorista atribuído.",
        noLongerAvailable: "Esta combinação veículo-motorista já não está disponível para o transfer selecionado. Escolha outra data ou hora.",
        passengerSingular: "passageiro",
        journeyPlaceholder: "Há algo que devamos saber sobre a sua viagem?",
        transferReviewNote: "Os detalhes do transfer serão verificados antes da confirmação da reserva.",
    },
    "Nederlands": {
        passengerDetails: "Gastgegevens",
        whoIsTravelling: "Wie reist er?",
        firstName: "Voornaam",
        lastName: "Achternaam",
        emailAddress: "E-mailadres",
        phoneNumber: "Telefoonnummer",
        specialRequests: "Speciale verzoeken",
        firstNamePlaceholder: "Je voornaam",
        lastNamePlaceholder: "Je achternaam",
        phonePlaceholder: "Voer je telefoonnummer in",
        completeYour: "Voltooi",
        transferBooking: "je transferboeking.",
        heroDescription: "Vul je gegevens in om je transferreservering te voltooien.",
        transferUnavailable: "Transfer niet beschikbaar",
        yourTransfer: "JOUW TRANSFER",
        from: "vanaf",
        returnJourney: "TERUGREIS",
        confirmTransfer: "Transfer bevestigen",
        backToTransferDetails: "Terug naar transferdetails",
        requiredPassengerDetails: "Vul alle verplichte passagiersgegevens in.",
        invalidTransferDateTime: "Selecteer een geldige datum en tijd voor de transfer.",
        invalidReturnDateTime: "Selecteer een geldige datum en tijd voor de terugreis.",
        cannotDetermineCity: "We konden de transferstad niet bepalen.",
        departureUnavailable: "Er is geen voertuig met toegewezen chauffeur beschikbaar voor vertrek op {date} om {time}. Kies een andere vertrekdatum of -tijd.",
        returnUnavailable: "Er is geen voertuig met toegewezen chauffeur beschikbaar voor de terugreis op {date} om {time}. Kies een andere retourdatum of -tijd.",
        pairUnavailable: "Er is geen enkele voertuig-chauffeurcombinatie beschikbaar voor zowel vertrek op {departureDate} om {departureTime} als terugkeer op {returnDate} om {returnTime}. Kies andere data of tijden.",
        transferUnavailableMessage: "Er is geen voertuig met toegewezen chauffeur beschikbaar voor de transfer op {date} om {time}. Kies een andere datum of tijd.",
        noAssignedDriver: "Aan het geselecteerde voertuig is geen chauffeur toegewezen.",
        noLongerAvailable: "Deze voertuig-chauffeurcombinatie is niet meer beschikbaar voor de geselecteerde transfer. Kies een andere datum of tijd.",
        passengerSingular: "passagier",
        journeyPlaceholder: "Is er iets dat we over je rit moeten weten?",
        transferReviewNote: "Je transfergegevens worden gecontroleerd voordat de reservering wordt bevestigd.",
    },
    "Norsk": {
        passengerDetails: "Gjesteopplysninger",
        whoIsTravelling: "Hvem reiser?",
        firstName: "Fornavn",
        lastName: "Etternavn",
        emailAddress: "E-postadresse",
        phoneNumber: "Telefonnummer",
        specialRequests: "Spesielle ønsker",
        firstNamePlaceholder: "Fornavnet ditt",
        lastNamePlaceholder: "Etternavnet ditt",
        phonePlaceholder: "Skriv inn telefonnummeret ditt",
        completeYour: "Fullfør",
        transferBooking: "transferbestillingen din.",
        heroDescription: "Skriv inn opplysningene dine for å fullføre transferreservasjonen.",
        transferUnavailable: "Transfer utilgjengelig",
        yourTransfer: "DIN TRANSFER",
        from: "fra",
        returnJourney: "RETURREISE",
        confirmTransfer: "Bekreft transfer",
        backToTransferDetails: "Tilbake til transferdetaljer",
        requiredPassengerDetails: "Fyll ut alle obligatoriske passasjeropplysninger.",
        invalidTransferDateTime: "Velg en gyldig dato og tid for transferen.",
        invalidReturnDateTime: "Velg en gyldig dato og tid for returen.",
        cannotDetermineCity: "Vi kunne ikke fastslå transferbyen.",
        departureUnavailable: "Ingen bil med tildelt sjåfør er tilgjengelig for avreise {date} kl. {time}. Velg en annen avreisedato eller -tid.",
        returnUnavailable: "Ingen bil med tildelt sjåfør er tilgjengelig for returen {date} kl. {time}. Velg en annen returdato eller -tid.",
        pairUnavailable: "Ingen enkelt bil-sjåfør-kombinasjon er tilgjengelig både for avreise {departureDate} kl. {departureTime} og retur {returnDate} kl. {returnTime}. Velg andre datoer eller tider.",
        transferUnavailableMessage: "Ingen bil med tildelt sjåfør er tilgjengelig for transferen {date} kl. {time}. Velg en annen dato eller tid.",
        noAssignedDriver: "Den valgte bilen har ingen tildelt sjåfør.",
        noLongerAvailable: "Denne bil-sjåfør-kombinasjonen er ikke lenger tilgjengelig for den valgte transferen. Velg en annen dato eller tid.",
        passengerSingular: "passasjer",
        journeyPlaceholder: "Er det noe vi bør vite om reisen din?",
        transferReviewNote: "Transferopplysningene dine blir gjennomgått før reservasjonen bekreftes.",
    },
    "Svenska": {
        passengerDetails: "Gästuppgifter",
        whoIsTravelling: "Vem reser?",
        firstName: "Förnamn",
        lastName: "Efternamn",
        emailAddress: "E-postadress",
        phoneNumber: "Telefonnummer",
        specialRequests: "Särskilda önskemål",
        firstNamePlaceholder: "Ditt förnamn",
        lastNamePlaceholder: "Ditt efternamn",
        phonePlaceholder: "Ange ditt telefonnummer",
        completeYour: "Slutför",
        transferBooking: "din transferbokning.",
        heroDescription: "Ange dina uppgifter för att slutföra din transferbokning.",
        transferUnavailable: "Transfer ej tillgänglig",
        yourTransfer: "DIN TRANSFER",
        from: "från",
        returnJourney: "RETURRESA",
        confirmTransfer: "Bekräfta transfer",
        backToTransferDetails: "Tillbaka till transferdetaljer",
        requiredPassengerDetails: "Fyll i alla obligatoriska passageraruppgifter.",
        invalidTransferDateTime: "Välj ett giltigt datum och en giltig tid för transfern.",
        invalidReturnDateTime: "Välj ett giltigt datum och en giltig tid för returresan.",
        cannotDetermineCity: "Vi kunde inte fastställa transferstaden.",
        departureUnavailable: "Inget fordon med tilldelad förare är tillgängligt för avresan den {date} kl. {time}. Välj ett annat avresedatum eller en annan tid.",
        returnUnavailable: "Inget fordon med tilldelad förare är tillgängligt för returen den {date} kl. {time}. Välj ett annat returdatum eller en annan tid.",
        pairUnavailable: "Ingen enskild fordons- och förarkombination är tillgänglig både för avresan den {departureDate} kl. {departureTime} och returen den {returnDate} kl. {returnTime}. Välj andra datum eller tider.",
        transferUnavailableMessage: "Inget fordon med tilldelad förare är tillgängligt för transfern den {date} kl. {time}. Välj ett annat datum eller en annan tid.",
        noAssignedDriver: "Det valda fordonet har ingen tilldelad förare.",
        noLongerAvailable: "Denna fordons- och förarkombination är inte längre tillgänglig för den valda transfern. Välj ett annat datum eller en annan tid.",
        passengerSingular: "passagerare",
        journeyPlaceholder: "Är det något vi bör veta om din resa?",
        transferReviewNote: "Dina transferuppgifter granskas innan bokningen bekräftas.",
    },
    "Dansk": {
        passengerDetails: "Gæsteoplysninger",
        whoIsTravelling: "Hvem rejser?",
        firstName: "Fornavn",
        lastName: "Efternavn",
        emailAddress: "E-mailadresse",
        phoneNumber: "Telefonnummer",
        specialRequests: "Særlige ønsker",
        firstNamePlaceholder: "Dit fornavn",
        lastNamePlaceholder: "Dit efternavn",
        phonePlaceholder: "Indtast dit telefonnummer",
        completeYour: "Gennemfør",
        transferBooking: "din transferbooking.",
        heroDescription: "Indtast dine oplysninger for at gennemføre din transferreservation.",
        transferUnavailable: "Transfer ikke tilgængelig",
        yourTransfer: "DIN TRANSFER",
        from: "fra",
        returnJourney: "RETURREJSE",
        confirmTransfer: "Bekræft transfer",
        backToTransferDetails: "Tilbage til transferoplysninger",
        requiredPassengerDetails: "Udfyld alle obligatoriske passageroplysninger.",
        invalidTransferDateTime: "Vælg en gyldig dato og tid for transferen.",
        invalidReturnDateTime: "Vælg en gyldig dato og tid for returen.",
        cannotDetermineCity: "Vi kunne ikke fastslå transferbyen.",
        departureUnavailable: "Intet køretøj med tildelt chauffør er tilgængeligt til afgang den {date} kl. {time}. Vælg en anden afgangsdato eller -tid.",
        returnUnavailable: "Intet køretøj med tildelt chauffør er tilgængeligt til returen den {date} kl. {time}. Vælg en anden returdato eller -tid.",
        pairUnavailable: "Ingen enkelt kombination af køretøj og chauffør er tilgængelig både til afgangen den {departureDate} kl. {departureTime} og returen den {returnDate} kl. {returnTime}. Vælg andre datoer eller tider.",
        transferUnavailableMessage: "Intet køretøj med tildelt chauffør er tilgængeligt til transferen den {date} kl. {time}. Vælg en anden dato eller tid.",
        noAssignedDriver: "Det valgte køretøj har ingen tildelt chauffør.",
        noLongerAvailable: "Denne kombination af køretøj og chauffør er ikke længere tilgængelig til den valgte transfer. Vælg en anden dato eller tid.",
        passengerSingular: "passager",
        journeyPlaceholder: "Er der noget, vi bør vide om din rejse?",
        transferReviewNote: "Dine transferoplysninger bliver gennemgået, før reservationen bekræftes.",
    },
    "Suomi": {
        passengerDetails: "Vieraan tiedot",
        whoIsTravelling: "Kuka matkustaa?",
        firstName: "Etunimi",
        lastName: "Sukunimi",
        emailAddress: "Sähköpostiosoite",
        phoneNumber: "Puhelinnumero",
        specialRequests: "Erityistoiveet",
        firstNamePlaceholder: "Etunimesi",
        lastNamePlaceholder: "Sukunimesi",
        phonePlaceholder: "Anna puhelinnumerosi",
        completeYour: "Viimeistele",
        transferBooking: "kuljetusvarauksesi.",
        heroDescription: "Anna tietosi viimeistelläksesi kuljetusvarauksen.",
        transferUnavailable: "Kuljetus ei ole saatavilla",
        yourTransfer: "KULJETUKSESI",
        from: "alkaen",
        returnJourney: "PALUUMATKA",
        confirmTransfer: "Vahvista kuljetus",
        backToTransferDetails: "Takaisin kuljetuksen tietoihin",
        requiredPassengerDetails: "Täytä kaikki pakolliset matkustajatiedot.",
        invalidTransferDateTime: "Valitse kuljetukselle kelvollinen päivämäärä ja aika.",
        invalidReturnDateTime: "Valitse paluumatkalle kelvollinen päivämäärä ja aika.",
        cannotDetermineCity: "Kuljetuskaupunkia ei voitu määrittää.",
        departureUnavailable: "Yhtään ajoneuvoa, jolla on nimetty kuljettaja, ei ole saatavilla lähtöön {date} klo {time}. Valitse toinen lähtöpäivä tai -aika.",
        returnUnavailable: "Yhtään ajoneuvoa, jolla on nimetty kuljettaja, ei ole saatavilla paluuseen {date} klo {time}. Valitse toinen paluupäivä tai -aika.",
        pairUnavailable: "Sama ajoneuvo-kuljettajapari ei ole saatavilla sekä lähtöön {departureDate} klo {departureTime} että paluuseen {returnDate} klo {returnTime}. Valitse toiset päivät tai ajat.",
        transferUnavailableMessage: "Yhtään ajoneuvoa, jolla on nimetty kuljettaja, ei ole saatavilla kuljetukseen {date} klo {time}. Valitse toinen päivämäärä tai aika.",
        noAssignedDriver: "Valitulle ajoneuvolle ei ole nimetty kuljettajaa.",
        noLongerAvailable: "Tämä ajoneuvo-kuljettajapari ei ole enää saatavilla valittuun kuljetukseen. Valitse toinen päivämäärä tai aika.",
        passengerSingular: "matkustaja",
        journeyPlaceholder: "Onko jotain, mitä meidän pitäisi tietää matkastasi?",
        transferReviewNote: "Kuljetuksen tiedot tarkistetaan ennen varauksen vahvistamista.",
    },
    "Polski": {
        passengerDetails: "Dane gościa",
        whoIsTravelling: "Kto podróżuje?",
        firstName: "Imię",
        lastName: "Nazwisko",
        emailAddress: "Adres e-mail",
        phoneNumber: "Numer telefonu",
        specialRequests: "Specjalne życzenia",
        firstNamePlaceholder: "Twoje imię",
        lastNamePlaceholder: "Twoje nazwisko",
        phonePlaceholder: "Wpisz numer telefonu",
        completeYour: "Dokończ",
        transferBooking: "rezerwację transferu.",
        heroDescription: "Wprowadź swoje dane, aby dokończyć rezerwację transferu.",
        transferUnavailable: "Transfer niedostępny",
        yourTransfer: "TWÓJ TRANSFER",
        from: "od",
        returnJourney: "PODRÓŻ POWROTNA",
        confirmTransfer: "Potwierdź transfer",
        backToTransferDetails: "Wróć do szczegółów transferu",
        requiredPassengerDetails: "Uzupełnij wszystkie wymagane dane pasażera.",
        invalidTransferDateTime: "Wybierz prawidłową datę i godzinę transferu.",
        invalidReturnDateTime: "Wybierz prawidłową datę i godzinę powrotu.",
        cannotDetermineCity: "Nie udało się określić miasta transferu.",
        departureUnavailable: "Brak dostępnego pojazdu z przypisanym kierowcą na wyjazd {date} o {time}. Wybierz inną datę lub godzinę wyjazdu.",
        returnUnavailable: "Brak dostępnego pojazdu z przypisanym kierowcą na powrót {date} o {time}. Wybierz inną datę lub godzinę powrotu.",
        pairUnavailable: "Brak jednej pary pojazd–kierowca dostępnej zarówno na wyjazd {departureDate} o {departureTime}, jak i na powrót {returnDate} o {returnTime}. Wybierz inne daty lub godziny.",
        transferUnavailableMessage: "Brak dostępnego pojazdu z przypisanym kierowcą na transfer {date} o {time}. Wybierz inną datę lub godzinę.",
        noAssignedDriver: "Wybrany pojazd nie ma przypisanego kierowcy.",
        noLongerAvailable: "Ta para pojazd–kierowca nie jest już dostępna dla wybranego transferu. Wybierz inną datę lub godzinę.",
        passengerSingular: "pasażer",
        journeyPlaceholder: "Czy jest coś, co powinniśmy wiedzieć o Twojej podróży?",
        transferReviewNote: "Szczegóły transferu zostaną sprawdzone przed potwierdzeniem rezerwacji.",
    },
    "Čeština": {
        passengerDetails: "Údaje hosta",
        whoIsTravelling: "Kdo cestuje?",
        firstName: "Jméno",
        lastName: "Příjmení",
        emailAddress: "E-mailová adresa",
        phoneNumber: "Telefonní číslo",
        specialRequests: "Zvláštní požadavky",
        firstNamePlaceholder: "Vaše jméno",
        lastNamePlaceholder: "Vaše příjmení",
        phonePlaceholder: "Zadejte telefonní číslo",
        completeYour: "Dokončete",
        transferBooking: "rezervaci transferu.",
        heroDescription: "Zadejte své údaje a dokončete rezervaci transferu.",
        transferUnavailable: "Transfer není dostupný",
        yourTransfer: "VÁŠ TRANSFER",
        from: "od",
        returnJourney: "ZPÁTEČNÍ CESTA",
        confirmTransfer: "Potvrdit transfer",
        backToTransferDetails: "Zpět na podrobnosti transferu",
        requiredPassengerDetails: "Vyplňte všechny povinné údaje cestujícího.",
        invalidTransferDateTime: "Vyberte platné datum a čas transferu.",
        invalidReturnDateTime: "Vyberte platné datum a čas zpáteční cesty.",
        cannotDetermineCity: "Nepodařilo se určit město transferu.",
        departureUnavailable: "Pro odjezd dne {date} v {time} není k dispozici žádné vozidlo s přiřazeným řidičem. Zvolte jiné datum nebo čas odjezdu.",
        returnUnavailable: "Pro návrat dne {date} v {time} není k dispozici žádné vozidlo s přiřazeným řidičem. Zvolte jiné datum nebo čas návratu.",
        pairUnavailable: "Není k dispozici jedna kombinace vozidla a řidiče pro odjezd dne {departureDate} v {departureTime} i návrat dne {returnDate} v {returnTime}. Zvolte jiné datumy nebo časy.",
        transferUnavailableMessage: "Pro transfer dne {date} v {time} není k dispozici žádné vozidlo s přiřazeným řidičem. Zvolte jiné datum nebo čas.",
        noAssignedDriver: "Vybrané vozidlo nemá přiřazeného řidiče.",
        noLongerAvailable: "Tato kombinace vozidla a řidiče již není pro vybraný transfer dostupná. Zvolte jiné datum nebo čas.",
        passengerSingular: "cestující",
        journeyPlaceholder: "Je něco, co bychom měli vědět o vaší cestě?",
        transferReviewNote: "Podrobnosti transferu budou před potvrzením rezervace zkontrolovány.",
    },
    "Slovenčina": {
        passengerDetails: "Údaje hosťa",
        whoIsTravelling: "Kto cestuje?",
        firstName: "Meno",
        lastName: "Priezvisko",
        emailAddress: "E-mailová adresa",
        phoneNumber: "Telefónne číslo",
        specialRequests: "Špeciálne požiadavky",
        firstNamePlaceholder: "Vaše meno",
        lastNamePlaceholder: "Vaše priezvisko",
        phonePlaceholder: "Zadajte telefónne číslo",
        completeYour: "Dokončite",
        transferBooking: "rezerváciu transferu.",
        heroDescription: "Zadajte svoje údaje a dokončite rezerváciu transferu.",
        transferUnavailable: "Transfer nie je dostupný",
        yourTransfer: "VÁŠ TRANSFER",
        from: "od",
        returnJourney: "SPIATOČNÁ CESTA",
        confirmTransfer: "Potvrdiť transfer",
        backToTransferDetails: "Späť na podrobnosti transferu",
        requiredPassengerDetails: "Vyplňte všetky povinné údaje cestujúceho.",
        invalidTransferDateTime: "Vyberte platný dátum a čas transferu.",
        invalidReturnDateTime: "Vyberte platný dátum a čas spiatočnej cesty.",
        cannotDetermineCity: "Nepodarilo sa určiť mesto transferu.",
        departureUnavailable: "Na odchod {date} o {time} nie je k dispozícii žiadne vozidlo s prideleným vodičom. Vyberte iný dátum alebo čas odchodu.",
        returnUnavailable: "Na návrat {date} o {time} nie je k dispozícii žiadne vozidlo s prideleným vodičom. Vyberte iný dátum alebo čas návratu.",
        pairUnavailable: "Nie je k dispozícii jedna kombinácia vozidla a vodiča pre odchod {departureDate} o {departureTime} aj návrat {returnDate} o {returnTime}. Vyberte iné dátumy alebo časy.",
        transferUnavailableMessage: "Na transfer {date} o {time} nie je k dispozícii žiadne vozidlo s prideleným vodičom. Vyberte iný dátum alebo čas.",
        noAssignedDriver: "Vybrané vozidlo nemá prideleného vodiča.",
        noLongerAvailable: "Táto kombinácia vozidla a vodiča už nie je pre vybraný transfer dostupná. Vyberte iný dátum alebo čas.",
        passengerSingular: "cestujúci",
        journeyPlaceholder: "Je niečo, čo by sme mali vedieť o vašej ceste?",
        transferReviewNote: "Podrobnosti transferu budú pred potvrdením rezervácie skontrolované.",
    },
    "Magyar": {
        passengerDetails: "Vendég adatai",
        whoIsTravelling: "Ki utazik?",
        firstName: "Keresztnév",
        lastName: "Vezetéknév",
        emailAddress: "E-mail-cím",
        phoneNumber: "Telefonszám",
        specialRequests: "Különleges kérések",
        firstNamePlaceholder: "Keresztneve",
        lastNamePlaceholder: "Vezetékneve",
        phonePlaceholder: "Adja meg telefonszámát",
        completeYour: "Fejezze be",
        transferBooking: "a transzferfoglalását.",
        heroDescription: "Adja meg adatait a transzferfoglalás befejezéséhez.",
        transferUnavailable: "A transzfer nem elérhető",
        yourTransfer: "AZ ÖN TRANSZFERE",
        from: "ettől",
        returnJourney: "VISSZAÚT",
        confirmTransfer: "Transzfer megerősítése",
        backToTransferDetails: "Vissza a transzfer részleteihez",
        requiredPassengerDetails: "Töltse ki az összes kötelező utasadatot.",
        invalidTransferDateTime: "Válasszon érvényes dátumot és időpontot a transzferhez.",
        invalidReturnDateTime: "Válasszon érvényes dátumot és időpontot a visszaúthoz.",
        cannotDetermineCity: "Nem sikerült meghatározni a transzfer városát.",
        departureUnavailable: "Nincs elérhető, kijelölt sofőrrel rendelkező jármű a(z) {date} {time} időpontú induláshoz. Válasszon másik dátumot vagy időpontot.",
        returnUnavailable: "Nincs elérhető, kijelölt sofőrrel rendelkező jármű a(z) {date} {time} időpontú visszaúthoz. Válasszon másik dátumot vagy időpontot.",
        pairUnavailable: "Nincs egyetlen jármű-sofőr páros sem, amely elérhető lenne mind a(z) {departureDate} {departureTime} időpontú induláshoz, mind a(z) {returnDate} {returnTime} időpontú visszaúthoz. Válasszon más dátumokat vagy időpontokat.",
        transferUnavailableMessage: "Nincs elérhető, kijelölt sofőrrel rendelkező jármű a(z) {date} {time} időpontú transzferhez. Válasszon másik dátumot vagy időpontot.",
        noAssignedDriver: "A kiválasztott járműhöz nincs sofőr hozzárendelve.",
        noLongerAvailable: "Ez a jármű-sofőr páros már nem elérhető a kiválasztott transzferhez. Válasszon másik dátumot vagy időpontot.",
        passengerSingular: "utas",
        journeyPlaceholder: "Van valami, amit tudnunk kell az utazásáról?",
        transferReviewNote: "A transzfer adatait a foglalás megerősítése előtt ellenőrizzük.",
    },
    "Български": {
        passengerDetails: "Данни на госта",
        whoIsTravelling: "Кой пътува?",
        firstName: "Име",
        lastName: "Фамилия",
        emailAddress: "Имейл адрес",
        phoneNumber: "Телефонен номер",
        specialRequests: "Специални изисквания",
        firstNamePlaceholder: "Вашето име",
        lastNamePlaceholder: "Вашата фамилия",
        phonePlaceholder: "Въведете телефонен номер",
        completeYour: "Завършете",
        transferBooking: "резервацията на трансфера.",
        heroDescription: "Въведете данните си, за да завършите резервацията на трансфера.",
        transferUnavailable: "Трансферът не е наличен",
        yourTransfer: "ВАШИЯТ ТРАНСФЕР",
        from: "от",
        returnJourney: "ОБРАТНО ПЪТУВАНЕ",
        confirmTransfer: "Потвърди трансфера",
        backToTransferDetails: "Назад към детайлите на трансфера",
        requiredPassengerDetails: "Попълнете всички задължителни данни за пътника.",
        invalidTransferDateTime: "Изберете валидни дата и час за трансфера.",
        invalidReturnDateTime: "Изберете валидни дата и час за връщането.",
        cannotDetermineCity: "Не успяхме да определим града на трансфера.",
        departureUnavailable: "Няма наличен автомобил с назначен шофьор за отпътуване на {date} в {time}. Изберете друга дата или час.",
        returnUnavailable: "Няма наличен автомобил с назначен шофьор за връщане на {date} в {time}. Изберете друга дата или час.",
        pairUnavailable: "Няма една и съща двойка автомобил–шофьор, налична и за отпътуване на {departureDate} в {departureTime}, и за връщане на {returnDate} в {returnTime}. Изберете други дати или часове.",
        transferUnavailableMessage: "Няма наличен автомобил с назначен шофьор за трансфера на {date} в {time}. Изберете друга дата или час.",
        noAssignedDriver: "Избраният автомобил няма назначен шофьор.",
        noLongerAvailable: "Тази двойка автомобил–шофьор вече не е налична за избрания трансфер. Изберете друга дата или час.",
        passengerSingular: "пътник",
        journeyPlaceholder: "Има ли нещо, което трябва да знаем за пътуването ви?",
        transferReviewNote: "Детайлите за трансфера ще бъдат прегледани преди потвърждаване на резервацията.",
    },
    "Hrvatski": {
        passengerDetails: "Podaci gosta",
        whoIsTravelling: "Tko putuje?",
        firstName: "Ime",
        lastName: "Prezime",
        emailAddress: "Adresa e-pošte",
        phoneNumber: "Broj telefona",
        specialRequests: "Posebni zahtjevi",
        firstNamePlaceholder: "Vaše ime",
        lastNamePlaceholder: "Vaše prezime",
        phonePlaceholder: "Unesite broj telefona",
        completeYour: "Dovršite",
        transferBooking: "rezervaciju transfera.",
        heroDescription: "Unesite svoje podatke kako biste dovršili rezervaciju transfera.",
        transferUnavailable: "Transfer nije dostupan",
        yourTransfer: "VAŠ TRANSFER",
        from: "od",
        returnJourney: "POVRATNO PUTOVANJE",
        confirmTransfer: "Potvrdi transfer",
        backToTransferDetails: "Natrag na detalje transfera",
        requiredPassengerDetails: "Ispunite sve obavezne podatke o putniku.",
        invalidTransferDateTime: "Odaberite valjani datum i vrijeme transfera.",
        invalidReturnDateTime: "Odaberite valjani datum i vrijeme povratka.",
        cannotDetermineCity: "Nismo mogli odrediti grad transfera.",
        departureUnavailable: "Nema dostupnog vozila s dodijeljenim vozačem za polazak {date} u {time}. Odaberite drugi datum ili vrijeme polaska.",
        returnUnavailable: "Nema dostupnog vozila s dodijeljenim vozačem za povratak {date} u {time}. Odaberite drugi datum ili vrijeme povratka.",
        pairUnavailable: "Nema jednog para vozilo–vozač dostupnog i za polazak {departureDate} u {departureTime} i za povratak {returnDate} u {returnTime}. Odaberite druge datume ili vremena.",
        transferUnavailableMessage: "Nema dostupnog vozila s dodijeljenim vozačem za transfer {date} u {time}. Odaberite drugi datum ili vrijeme.",
        noAssignedDriver: "Odabrano vozilo nema dodijeljenog vozača.",
        noLongerAvailable: "Ovaj par vozilo–vozač više nije dostupan za odabrani transfer. Odaberite drugi datum ili vrijeme.",
        passengerSingular: "putnik",
        journeyPlaceholder: "Postoji li nešto što bismo trebali znati o vašem putovanju?",
        transferReviewNote: "Detalji transfera bit će provjereni prije potvrde rezervacije.",
    },
    "Slovenščina": {
        passengerDetails: "Podatki gosta",
        whoIsTravelling: "Kdo potuje?",
        firstName: "Ime",
        lastName: "Priimek",
        emailAddress: "E-poštni naslov",
        phoneNumber: "Telefonska številka",
        specialRequests: "Posebne zahteve",
        firstNamePlaceholder: "Vaše ime",
        lastNamePlaceholder: "Vaš priimek",
        phonePlaceholder: "Vnesite telefonsko številko",
        completeYour: "Dokončajte",
        transferBooking: "rezervacijo prevoza.",
        heroDescription: "Vnesite svoje podatke za dokončanje rezervacije prevoza.",
        transferUnavailable: "Prevoz ni na voljo",
        yourTransfer: "VAŠ PREVOZ",
        from: "od",
        returnJourney: "POVRATNA VOŽNJA",
        confirmTransfer: "Potrdi prevoz",
        backToTransferDetails: "Nazaj na podrobnosti prevoza",
        requiredPassengerDetails: "Izpolnite vse obvezne podatke potnika.",
        invalidTransferDateTime: "Izberite veljaven datum in čas prevoza.",
        invalidReturnDateTime: "Izberite veljaven datum in čas povratka.",
        cannotDetermineCity: "Mesta prevoza ni bilo mogoče določiti.",
        departureUnavailable: "Za odhod {date} ob {time} ni na voljo vozila z dodeljenim voznikom. Izberite drug datum ali čas odhoda.",
        returnUnavailable: "Za povratek {date} ob {time} ni na voljo vozila z dodeljenim voznikom. Izberite drug datum ali čas povratka.",
        pairUnavailable: "Ni enega para vozilo–voznik, ki bi bil na voljo tako za odhod {departureDate} ob {departureTime} kot za povratek {returnDate} ob {returnTime}. Izberite druge datume ali čase.",
        transferUnavailableMessage: "Za prevoz {date} ob {time} ni na voljo vozila z dodeljenim voznikom. Izberite drug datum ali čas.",
        noAssignedDriver: "Izbrano vozilo nima dodeljenega voznika.",
        noLongerAvailable: "Ta par vozilo–voznik ni več na voljo za izbrani prevoz. Izberite drug datum ali čas.",
        passengerSingular: "potnik",
        journeyPlaceholder: "Je kaj, kar bi morali vedeti o vašem potovanju?",
        transferReviewNote: "Podrobnosti prevoza bodo pregledane pred potrditvijo rezervacije.",
    },
    "Srpski": {
        passengerDetails: "Podaci gosta",
        whoIsTravelling: "Ko putuje?",
        firstName: "Ime",
        lastName: "Prezime",
        emailAddress: "Adresa e-pošte",
        phoneNumber: "Broj telefona",
        specialRequests: "Posebni zahtevi",
        firstNamePlaceholder: "Vaše ime",
        lastNamePlaceholder: "Vaše prezime",
        phonePlaceholder: "Unesite broj telefona",
        completeYour: "Završite",
        transferBooking: "rezervaciju transfera.",
        heroDescription: "Unesite svoje podatke da biste završili rezervaciju transfera.",
        transferUnavailable: "Transfer nije dostupan",
        yourTransfer: "VAŠ TRANSFER",
        from: "od",
        returnJourney: "POVRATNO PUTOVANJE",
        confirmTransfer: "Potvrdi transfer",
        backToTransferDetails: "Nazad na detalje transfera",
        requiredPassengerDetails: "Popunite sve obavezne podatke o putniku.",
        invalidTransferDateTime: "Izaberite važeći datum i vreme transfera.",
        invalidReturnDateTime: "Izaberite važeći datum i vreme povratka.",
        cannotDetermineCity: "Nismo mogli da odredimo grad transfera.",
        departureUnavailable: "Nema dostupnog vozila sa dodeljenim vozačem za polazak {date} u {time}. Izaberite drugi datum ili vreme polaska.",
        returnUnavailable: "Nema dostupnog vozila sa dodeljenim vozačem za povratak {date} u {time}. Izaberite drugi datum ili vreme povratka.",
        pairUnavailable: "Nema jednog para vozilo–vozač dostupnog i za polazak {departureDate} u {departureTime} i za povratak {returnDate} u {returnTime}. Izaberite druge datume ili vremena.",
        transferUnavailableMessage: "Nema dostupnog vozila sa dodeljenim vozačem za transfer {date} u {time}. Izaberite drugi datum ili vreme.",
        noAssignedDriver: "Izabrano vozilo nema dodeljenog vozača.",
        noLongerAvailable: "Ovaj par vozilo–vozač više nije dostupan za izabrani transfer. Izaberite drugi datum ili vreme.",
        passengerSingular: "putnik",
        journeyPlaceholder: "Postoji li nešto što bi trebalo da znamo o vašem putovanju?",
        transferReviewNote: "Detalji transfera biće provereni pre potvrde rezervacije.",
    },
    "Bosanski": {
        passengerDetails: "Podaci gosta",
        whoIsTravelling: "Ko putuje?",
        firstName: "Ime",
        lastName: "Prezime",
        emailAddress: "Adresa e-pošte",
        phoneNumber: "Broj telefona",
        specialRequests: "Posebni zahtjevi",
        firstNamePlaceholder: "Vaše ime",
        lastNamePlaceholder: "Vaše prezime",
        phonePlaceholder: "Unesite broj telefona",
        completeYour: "Završite",
        transferBooking: "rezervaciju transfera.",
        heroDescription: "Unesite svoje podatke kako biste završili rezervaciju transfera.",
        transferUnavailable: "Transfer nije dostupan",
        yourTransfer: "VAŠ TRANSFER",
        from: "od",
        returnJourney: "POVRATNO PUTOVANJE",
        confirmTransfer: "Potvrdi transfer",
        backToTransferDetails: "Nazad na detalje transfera",
        requiredPassengerDetails: "Popunite sve obavezne podatke o putniku.",
        invalidTransferDateTime: "Odaberite važeći datum i vrijeme transfera.",
        invalidReturnDateTime: "Odaberite važeći datum i vrijeme povratka.",
        cannotDetermineCity: "Nismo mogli odrediti grad transfera.",
        departureUnavailable: "Nema dostupnog vozila s dodijeljenim vozačem za polazak {date} u {time}. Odaberite drugi datum ili vrijeme polaska.",
        returnUnavailable: "Nema dostupnog vozila s dodijeljenim vozačem za povratak {date} u {time}. Odaberite drugi datum ili vrijeme povratka.",
        pairUnavailable: "Nema jednog para vozilo–vozač dostupnog i za polazak {departureDate} u {departureTime} i za povratak {returnDate} u {returnTime}. Odaberite druge datume ili vremena.",
        transferUnavailableMessage: "Nema dostupnog vozila s dodijeljenim vozačem za transfer {date} u {time}. Odaberite drugi datum ili vrijeme.",
        noAssignedDriver: "Odabrano vozilo nema dodijeljenog vozača.",
        noLongerAvailable: "Ovaj par vozilo–vozač više nije dostupan za odabrani transfer. Odaberite drugi datum ili vrijeme.",
        passengerSingular: "putnik",
        journeyPlaceholder: "Postoji li nešto što bismo trebali znati o vašem putovanju?",
        transferReviewNote: "Detalji transfera bit će provjereni prije potvrde rezervacije.",
    },
    "Ελληνικά": {
        passengerDetails: "Στοιχεία επισκέπτη",
        whoIsTravelling: "Ποιος ταξιδεύει;",
        firstName: "Όνομα",
        lastName: "Επώνυμο",
        emailAddress: "Διεύθυνση email",
        phoneNumber: "Αριθμός τηλεφώνου",
        specialRequests: "Ειδικά αιτήματα",
        firstNamePlaceholder: "Το όνομά σας",
        lastNamePlaceholder: "Το επώνυμό σας",
        phonePlaceholder: "Εισαγάγετε τον αριθμό τηλεφώνου σας",
        completeYour: "Ολοκληρώστε",
        transferBooking: "την κράτηση μεταφοράς σας.",
        heroDescription: "Εισαγάγετε τα στοιχεία σας για να ολοκληρώσετε την κράτηση μεταφοράς.",
        transferUnavailable: "Η μεταφορά δεν είναι διαθέσιμη",
        yourTransfer: "Η ΜΕΤΑΦΟΡΑ ΣΑΣ",
        from: "από",
        returnJourney: "ΔΙΑΔΡΟΜΗ ΕΠΙΣΤΡΟΦΗΣ",
        confirmTransfer: "Επιβεβαίωση μεταφοράς",
        backToTransferDetails: "Επιστροφή στις λεπτομέρειες μεταφοράς",
        requiredPassengerDetails: "Συμπληρώστε όλα τα υποχρεωτικά στοιχεία του επιβάτη.",
        invalidTransferDateTime: "Επιλέξτε έγκυρη ημερομηνία και ώρα μεταφοράς.",
        invalidReturnDateTime: "Επιλέξτε έγκυρη ημερομηνία και ώρα επιστροφής.",
        cannotDetermineCity: "Δεν μπορέσαμε να προσδιορίσουμε την πόλη της μεταφοράς.",
        departureUnavailable: "Δεν υπάρχει διαθέσιμο όχημα με ανατεθειμένο οδηγό για την αναχώρηση στις {date} και ώρα {time}. Επιλέξτε άλλη ημερομηνία ή ώρα αναχώρησης.",
        returnUnavailable: "Δεν υπάρχει διαθέσιμο όχημα με ανατεθειμένο οδηγό για την επιστροφή στις {date} και ώρα {time}. Επιλέξτε άλλη ημερομηνία ή ώρα επιστροφής.",
        pairUnavailable: "Δεν υπάρχει ένα ζεύγος οχήματος–οδηγού διαθέσιμο τόσο για την αναχώρηση στις {departureDate} και ώρα {departureTime} όσο και για την επιστροφή στις {returnDate} και ώρα {returnTime}. Επιλέξτε άλλες ημερομηνίες ή ώρες.",
        transferUnavailableMessage: "Δεν υπάρχει διαθέσιμο όχημα με ανατεθειμένο οδηγό για τη μεταφορά στις {date} και ώρα {time}. Επιλέξτε άλλη ημερομηνία ή ώρα.",
        noAssignedDriver: "Το επιλεγμένο όχημα δεν έχει ανατεθειμένο οδηγό.",
        noLongerAvailable: "Αυτό το ζεύγος οχήματος–οδηγού δεν είναι πλέον διαθέσιμο για την επιλεγμένη μεταφορά. Επιλέξτε άλλη ημερομηνία ή ώρα.",
        passengerSingular: "επιβάτης",
        journeyPlaceholder: "Υπάρχει κάτι που πρέπει να γνωρίζουμε για τη διαδρομή σας;",
        transferReviewNote: "Οι λεπτομέρειες της μεταφοράς θα ελεγχθούν πριν επιβεβαιωθεί η κράτηση.",
    },
    "Türkçe": {
        passengerDetails: "Misafir bilgileri",
        whoIsTravelling: "Kim seyahat ediyor?",
        firstName: "Ad",
        lastName: "Soyad",
        emailAddress: "E-posta adresi",
        phoneNumber: "Telefon numarası",
        specialRequests: "Özel talepler",
        firstNamePlaceholder: "Adınız",
        lastNamePlaceholder: "Soyadınız",
        phonePlaceholder: "Telefon numaranızı girin",
        completeYour: "Tamamlayın",
        transferBooking: "transfer rezervasyonunuzu.",
        heroDescription: "Transfer rezervasyonunuzu tamamlamak için bilgilerinizi girin.",
        transferUnavailable: "Transfer kullanılamıyor",
        yourTransfer: "TRANSFERİNİZ",
        from: "başlangıç",
        returnJourney: "DÖNÜŞ YOLCULUĞU",
        confirmTransfer: "Transferi onayla",
        backToTransferDetails: "Transfer ayrıntılarına dön",
        requiredPassengerDetails: "Lütfen tüm zorunlu yolcu bilgilerini doldurun.",
        invalidTransferDateTime: "Lütfen geçerli bir transfer tarihi ve saati seçin.",
        invalidReturnDateTime: "Lütfen geçerli bir dönüş tarihi ve saati seçin.",
        cannotDetermineCity: "Transfer şehrini belirleyemedik.",
        departureUnavailable: "{date} tarihinde saat {time} kalkışı için atanmış sürücüsü bulunan uygun araç yok. Farklı bir kalkış tarihi veya saati seçin.",
        returnUnavailable: "{date} tarihinde saat {time} dönüşü için atanmış sürücüsü bulunan uygun araç yok. Farklı bir dönüş tarihi veya saati seçin.",
        pairUnavailable: "Hem {departureDate} saat {departureTime} kalkışı hem de {returnDate} saat {returnTime} dönüşü için uygun tek bir araç-sürücü çifti yok. Farklı tarih veya saatler seçin.",
        transferUnavailableMessage: "{date} tarihinde saat {time} transferi için atanmış sürücüsü bulunan uygun araç yok. Farklı bir tarih veya saat seçin.",
        noAssignedDriver: "Seçilen araca atanmış bir sürücü yok.",
        noLongerAvailable: "Bu araç-sürücü çifti seçilen transfer için artık uygun değil. Farklı bir tarih veya saat seçin.",
        passengerSingular: "yolcu",
        journeyPlaceholder: "Yolculuğunuz hakkında bilmemiz gereken bir şey var mı?",
        transferReviewNote: "Transfer bilgileriniz rezervasyon onaylanmadan önce incelenecektir.",
    },
    "العربية": {
        passengerDetails: "بيانات الضيف",
        whoIsTravelling: "من المسافر؟",
        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        emailAddress: "البريد الإلكتروني",
        phoneNumber: "رقم الهاتف",
        specialRequests: "طلبات خاصة",
        firstNamePlaceholder: "اسمك الأول",
        lastNamePlaceholder: "اسم العائلة",
        phonePlaceholder: "أدخل رقم هاتفك",
        completeYour: "أكمل",
        transferBooking: "حجز خدمة النقل.",
        heroDescription: "أدخل بياناتك لإكمال حجز خدمة النقل.",
        transferUnavailable: "خدمة النقل غير متاحة",
        yourTransfer: "خدمة النقل الخاصة بك",
        from: "ابتداءً من",
        returnJourney: "رحلة العودة",
        confirmTransfer: "تأكيد النقل",
        backToTransferDetails: "العودة إلى تفاصيل النقل",
        requiredPassengerDetails: "يرجى إكمال جميع بيانات الراكب المطلوبة.",
        invalidTransferDateTime: "يرجى اختيار تاريخ ووقت صالحين لخدمة النقل.",
        invalidReturnDateTime: "يرجى اختيار تاريخ ووقت صالحين لرحلة العودة.",
        cannotDetermineCity: "تعذر تحديد مدينة خدمة النقل.",
        departureUnavailable: "لا تتوفر مركبة بسائق معيّن للمغادرة في {date} الساعة {time}. يرجى اختيار تاريخ أو وقت مغادرة آخر.",
        returnUnavailable: "لا تتوفر مركبة بسائق معيّن للعودة في {date} الساعة {time}. يرجى اختيار تاريخ أو وقت عودة آخر.",
        pairUnavailable: "لا تتوفر مركبة واحدة مع سائقها لكل من المغادرة في {departureDate} الساعة {departureTime} والعودة في {returnDate} الساعة {returnTime}. يرجى اختيار تواريخ أو أوقات أخرى.",
        transferUnavailableMessage: "لا تتوفر مركبة بسائق معيّن للنقل في {date} الساعة {time}. يرجى اختيار تاريخ أو وقت آخر.",
        noAssignedDriver: "لا يوجد سائق معيّن للمركبة المحددة.",
        noLongerAvailable: "لم تعد هذه المركبة مع سائقها متاحة لخدمة النقل المحددة. يرجى اختيار تاريخ أو وقت آخر.",
        passengerSingular: "راكب",
        journeyPlaceholder: "هل هناك ما ينبغي أن نعرفه عن رحلتك؟",
        transferReviewNote: "ستتم مراجعة تفاصيل خدمة النقل قبل تأكيد الحجز.",
    },
    "עברית": {
        passengerDetails: "פרטי האורח",
        whoIsTravelling: "מי נוסע?",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        emailAddress: "כתובת דוא״ל",
        phoneNumber: "מספר טלפון",
        specialRequests: "בקשות מיוחדות",
        firstNamePlaceholder: "השם הפרטי שלך",
        lastNamePlaceholder: "שם המשפחה שלך",
        phonePlaceholder: "הזן מספר טלפון",
        completeYour: "השלימו את",
        transferBooking: "הזמנת ההסעה שלכם.",
        heroDescription: "הזינו את הפרטים שלכם כדי להשלים את הזמנת ההסעה.",
        transferUnavailable: "ההסעה אינה זמינה",
        yourTransfer: "ההסעה שלכם",
        from: "החל מ־",
        returnJourney: "נסיעת חזור",
        confirmTransfer: "אישור ההסעה",
        backToTransferDetails: "חזרה לפרטי ההסעה",
        requiredPassengerDetails: "יש למלא את כל פרטי הנוסע הנדרשים.",
        invalidTransferDateTime: "יש לבחור תאריך ושעה תקינים להסעה.",
        invalidReturnDateTime: "יש לבחור תאריך ושעה תקינים לנסיעת החזור.",
        cannotDetermineCity: "לא הצלחנו לקבוע את עיר ההסעה.",
        departureUnavailable: "אין רכב עם נהג משויך הזמין ליציאה בתאריך {date} בשעה {time}. יש לבחור תאריך או שעה אחרים.",
        returnUnavailable: "אין רכב עם נהג משויך הזמין לחזרה בתאריך {date} בשעה {time}. יש לבחור תאריך או שעה אחרים.",
        pairUnavailable: "אין צמד רכב–נהג אחד הזמין גם ליציאה בתאריך {departureDate} בשעה {departureTime} וגם לחזרה בתאריך {returnDate} בשעה {returnTime}. יש לבחור תאריכים או שעות אחרים.",
        transferUnavailableMessage: "אין רכב עם נהג משויך הזמין להסעה בתאריך {date} בשעה {time}. יש לבחור תאריך או שעה אחרים.",
        noAssignedDriver: "לרכב שנבחר אין נהג משויך.",
        noLongerAvailable: "צמד הרכב–נהג הזה כבר אינו זמין להסעה שנבחרה. יש לבחור תאריך או שעה אחרים.",
        passengerSingular: "נוסע",
        journeyPlaceholder: "האם יש משהו שכדאי שנדע על הנסיעה שלכם?",
        transferReviewNote: "פרטי ההסעה ייבדקו לפני אישור ההזמנה.",
    },
    "हिन्दी": {
        passengerDetails: "मेहमान की जानकारी",
        whoIsTravelling: "कौन यात्रा कर रहा है?",
        firstName: "पहला नाम",
        lastName: "उपनाम",
        emailAddress: "ईमेल पता",
        phoneNumber: "फ़ोन नंबर",
        specialRequests: "विशेष अनुरोध",
        firstNamePlaceholder: "आपका पहला नाम",
        lastNamePlaceholder: "आपका उपनाम",
        phonePlaceholder: "अपना फ़ोन नंबर दर्ज करें",
        completeYour: "अपनी",
        transferBooking: "ट्रांसफ़र बुकिंग पूरी करें।",
        heroDescription: "अपनी ट्रांसफ़र बुकिंग पूरी करने के लिए अपनी जानकारी दर्ज करें।",
        transferUnavailable: "ट्रांसफ़र उपलब्ध नहीं है",
        yourTransfer: "आपका ट्रांसफ़र",
        from: "से",
        returnJourney: "वापसी यात्रा",
        confirmTransfer: "ट्रांसफ़र की पुष्टि करें",
        backToTransferDetails: "ट्रांसफ़र विवरण पर वापस जाएँ",
        requiredPassengerDetails: "कृपया सभी आवश्यक यात्री विवरण भरें।",
        invalidTransferDateTime: "कृपया ट्रांसफ़र के लिए मान्य तारीख और समय चुनें।",
        invalidReturnDateTime: "कृपया वापसी के लिए मान्य तारीख और समय चुनें।",
        cannotDetermineCity: "हम ट्रांसफ़र शहर निर्धारित नहीं कर सके।",
        departureUnavailable: "{date} को {time} बजे प्रस्थान के लिए निर्धारित ड्राइवर वाला कोई वाहन उपलब्ध नहीं है। कृपया दूसरी तारीख या समय चुनें।",
        returnUnavailable: "{date} को {time} बजे वापसी के लिए निर्धारित ड्राइवर वाला कोई वाहन उपलब्ध नहीं है। कृपया दूसरी तारीख या समय चुनें।",
        pairUnavailable: "{departureDate} को {departureTime} बजे प्रस्थान और {returnDate} को {returnTime} बजे वापसी, दोनों के लिए एक ही वाहन–ड्राइवर जोड़ी उपलब्ध नहीं है। कृपया दूसरी तारीखें या समय चुनें।",
        transferUnavailableMessage: "{date} को {time} बजे ट्रांसफ़र के लिए निर्धारित ड्राइवर वाला कोई वाहन उपलब्ध नहीं है। कृपया दूसरी तारीख या समय चुनें।",
        noAssignedDriver: "चुने गए वाहन के लिए कोई ड्राइवर निर्धारित नहीं है।",
        noLongerAvailable: "यह वाहन–ड्राइवर जोड़ी चुने गए ट्रांसफ़र के लिए अब उपलब्ध नहीं है। कृपया दूसरी तारीख या समय चुनें।",
        passengerSingular: "यात्री",
        journeyPlaceholder: "क्या आपकी यात्रा के बारे में हमें कुछ जानना चाहिए?",
        transferReviewNote: "आरक्षण की पुष्टि से पहले ट्रांसफ़र विवरण की समीक्षा की जाएगी।",
    },
    "ไทย": {
        passengerDetails: "ข้อมูลผู้เข้าพัก",
        whoIsTravelling: "ใครเป็นผู้เดินทาง?",
        firstName: "ชื่อ",
        lastName: "นามสกุล",
        emailAddress: "อีเมล",
        phoneNumber: "หมายเลขโทรศัพท์",
        specialRequests: "คำขอพิเศษ",
        firstNamePlaceholder: "ชื่อของคุณ",
        lastNamePlaceholder: "นามสกุลของคุณ",
        phonePlaceholder: "กรอกหมายเลขโทรศัพท์",
        completeYour: "ดำเนินการ",
        transferBooking: "จองรถรับส่งให้เสร็จสมบูรณ์",
        heroDescription: "กรอกข้อมูลของคุณเพื่อดำเนินการจองรถรับส่งให้เสร็จสมบูรณ์",
        transferUnavailable: "ไม่มีบริการรถรับส่ง",
        yourTransfer: "รถรับส่งของคุณ",
        from: "เริ่มต้นที่",
        returnJourney: "เที่ยวขากลับ",
        confirmTransfer: "ยืนยันรถรับส่ง",
        backToTransferDetails: "กลับไปยังรายละเอียดรถรับส่ง",
        requiredPassengerDetails: "กรุณากรอกข้อมูลผู้โดยสารที่จำเป็นให้ครบถ้วน",
        invalidTransferDateTime: "กรุณาเลือกวันที่และเวลารถรับส่งที่ถูกต้อง",
        invalidReturnDateTime: "กรุณาเลือกวันที่และเวลาขากลับที่ถูกต้อง",
        cannotDetermineCity: "ไม่สามารถระบุเมืองสำหรับรถรับส่งได้",
        departureUnavailable: "ไม่มีรถพร้อมคนขับที่ได้รับมอบหมายสำหรับเที่ยวขาไปวันที่ {date} เวลา {time} กรุณาเลือกวันที่หรือเวลาอื่น",
        returnUnavailable: "ไม่มีรถพร้อมคนขับที่ได้รับมอบหมายสำหรับเที่ยวขากลับวันที่ {date} เวลา {time} กรุณาเลือกวันที่หรือเวลาอื่น",
        pairUnavailable: "ไม่มีรถและคนขับคู่เดียวกันที่ว่างทั้งเที่ยวขาไปวันที่ {departureDate} เวลา {departureTime} และเที่ยวขากลับวันที่ {returnDate} เวลา {returnTime} กรุณาเลือกวันที่หรือเวลาอื่น",
        transferUnavailableMessage: "ไม่มีรถพร้อมคนขับที่ได้รับมอบหมายสำหรับรถรับส่งวันที่ {date} เวลา {time} กรุณาเลือกวันที่หรือเวลาอื่น",
        noAssignedDriver: "รถที่เลือกไม่มีคนขับที่ได้รับมอบหมาย",
        noLongerAvailable: "รถและคนขับคู่นี้ไม่ว่างสำหรับรถรับส่งที่เลือกแล้ว กรุณาเลือกวันที่หรือเวลาอื่น",
        passengerSingular: "ผู้โดยสาร",
        journeyPlaceholder: "มีอะไรที่เราควรรู้เกี่ยวกับการเดินทางของคุณหรือไม่?",
        transferReviewNote: "รายละเอียดรถรับส่งจะได้รับการตรวจสอบก่อนยืนยันการจอง",
    },
    "Bahasa Indonesia": {
        passengerDetails: "Data tamu",
        whoIsTravelling: "Siapa yang bepergian?",
        firstName: "Nama depan",
        lastName: "Nama belakang",
        emailAddress: "Alamat email",
        phoneNumber: "Nomor telepon",
        specialRequests: "Permintaan khusus",
        firstNamePlaceholder: "Nama depan Anda",
        lastNamePlaceholder: "Nama belakang Anda",
        phonePlaceholder: "Masukkan nomor telepon Anda",
        completeYour: "Selesaikan",
        transferBooking: "pemesanan transfer Anda.",
        heroDescription: "Masukkan data Anda untuk menyelesaikan reservasi transfer.",
        transferUnavailable: "Transfer tidak tersedia",
        yourTransfer: "TRANSFER ANDA",
        from: "mulai",
        returnJourney: "PERJALANAN PULANG",
        confirmTransfer: "Konfirmasi transfer",
        backToTransferDetails: "Kembali ke detail transfer",
        requiredPassengerDetails: "Lengkapi semua data penumpang yang wajib.",
        invalidTransferDateTime: "Pilih tanggal dan waktu transfer yang valid.",
        invalidReturnDateTime: "Pilih tanggal dan waktu perjalanan pulang yang valid.",
        cannotDetermineCity: "Kami tidak dapat menentukan kota transfer.",
        departureUnavailable: "Tidak ada kendaraan dengan pengemudi yang ditugaskan tersedia untuk keberangkatan pada {date} pukul {time}. Pilih tanggal atau waktu keberangkatan lain.",
        returnUnavailable: "Tidak ada kendaraan dengan pengemudi yang ditugaskan tersedia untuk perjalanan pulang pada {date} pukul {time}. Pilih tanggal atau waktu pulang lain.",
        pairUnavailable: "Tidak ada satu pasangan kendaraan-pengemudi yang tersedia untuk keberangkatan pada {departureDate} pukul {departureTime} sekaligus perjalanan pulang pada {returnDate} pukul {returnTime}. Pilih tanggal atau waktu lain.",
        transferUnavailableMessage: "Tidak ada kendaraan dengan pengemudi yang ditugaskan tersedia untuk transfer pada {date} pukul {time}. Pilih tanggal atau waktu lain.",
        noAssignedDriver: "Kendaraan yang dipilih tidak memiliki pengemudi yang ditugaskan.",
        noLongerAvailable: "Pasangan kendaraan-pengemudi ini tidak lagi tersedia untuk transfer yang dipilih. Pilih tanggal atau waktu lain.",
        passengerSingular: "penumpang",
        journeyPlaceholder: "Adakah hal yang perlu kami ketahui tentang perjalanan Anda?",
        transferReviewNote: "Detail transfer akan ditinjau sebelum reservasi dikonfirmasi.",
    },
    "Tiếng Việt": {
        passengerDetails: "Thông tin khách",
        whoIsTravelling: "Ai sẽ đi?",
        firstName: "Tên",
        lastName: "Họ",
        emailAddress: "Địa chỉ email",
        phoneNumber: "Số điện thoại",
        specialRequests: "Yêu cầu đặc biệt",
        firstNamePlaceholder: "Tên của bạn",
        lastNamePlaceholder: "Họ của bạn",
        phonePlaceholder: "Nhập số điện thoại",
        completeYour: "Hoàn tất",
        transferBooking: "đặt xe đưa đón của bạn.",
        heroDescription: "Nhập thông tin của bạn để hoàn tất đặt xe đưa đón.",
        transferUnavailable: "Xe đưa đón không khả dụng",
        yourTransfer: "XE ĐƯA ĐÓN CỦA BẠN",
        from: "từ",
        returnJourney: "CHUYẾN VỀ",
        confirmTransfer: "Xác nhận xe đưa đón",
        backToTransferDetails: "Quay lại chi tiết xe đưa đón",
        requiredPassengerDetails: "Vui lòng điền đầy đủ thông tin hành khách bắt buộc.",
        invalidTransferDateTime: "Vui lòng chọn ngày và giờ đưa đón hợp lệ.",
        invalidReturnDateTime: "Vui lòng chọn ngày và giờ chuyến về hợp lệ.",
        cannotDetermineCity: "Không thể xác định thành phố của chuyến đưa đón.",
        departureUnavailable: "Không có xe với tài xế được chỉ định cho chuyến đi ngày {date} lúc {time}. Vui lòng chọn ngày hoặc giờ khác.",
        returnUnavailable: "Không có xe với tài xế được chỉ định cho chuyến về ngày {date} lúc {time}. Vui lòng chọn ngày hoặc giờ khác.",
        pairUnavailable: "Không có cùng một cặp xe-tài xế khả dụng cho cả chuyến đi ngày {departureDate} lúc {departureTime} và chuyến về ngày {returnDate} lúc {returnTime}. Vui lòng chọn ngày hoặc giờ khác.",
        transferUnavailableMessage: "Không có xe với tài xế được chỉ định cho chuyến đưa đón ngày {date} lúc {time}. Vui lòng chọn ngày hoặc giờ khác.",
        noAssignedDriver: "Xe đã chọn chưa được chỉ định tài xế.",
        noLongerAvailable: "Cặp xe-tài xế này không còn khả dụng cho chuyến đưa đón đã chọn. Vui lòng chọn ngày hoặc giờ khác.",
        passengerSingular: "hành khách",
        journeyPlaceholder: "Có điều gì chúng tôi cần biết về hành trình của bạn không?",
        transferReviewNote: "Thông tin xe đưa đón sẽ được kiểm tra trước khi xác nhận đặt chỗ.",
    },
    "한국어": {
        passengerDetails: "투숙객 정보",
        whoIsTravelling: "누가 여행하나요?",
        firstName: "이름",
        lastName: "성",
        emailAddress: "이메일 주소",
        phoneNumber: "전화번호",
        specialRequests: "특별 요청",
        firstNamePlaceholder: "이름 입력",
        lastNamePlaceholder: "성 입력",
        phonePlaceholder: "전화번호 입력",
        completeYour: "완료하세요",
        transferBooking: "공항 이동 예약을.",
        heroDescription: "이동 서비스 예약을 완료하려면 정보를 입력하세요.",
        transferUnavailable: "이동 서비스 이용 불가",
        yourTransfer: "내 이동 서비스",
        from: "최저",
        returnJourney: "귀환 여정",
        confirmTransfer: "이동 서비스 확정",
        backToTransferDetails: "이동 서비스 상세로 돌아가기",
        requiredPassengerDetails: "필수 승객 정보를 모두 입력해 주세요.",
        invalidTransferDateTime: "유효한 이동 날짜와 시간을 선택해 주세요.",
        invalidReturnDateTime: "유효한 귀환 날짜와 시간을 선택해 주세요.",
        cannotDetermineCity: "이동 서비스 도시를 확인할 수 없습니다.",
        departureUnavailable: "{date} {time} 출발에 배정된 운전자가 있는 이용 가능한 차량이 없습니다. 다른 출발 날짜나 시간을 선택해 주세요.",
        returnUnavailable: "{date} {time} 귀환에 배정된 운전자가 있는 이용 가능한 차량이 없습니다. 다른 귀환 날짜나 시간을 선택해 주세요.",
        pairUnavailable: "{departureDate} {departureTime} 출발과 {returnDate} {returnTime} 귀환 모두에 이용 가능한 동일한 차량-운전자 조합이 없습니다. 다른 날짜나 시간을 선택해 주세요.",
        transferUnavailableMessage: "{date} {time} 이동 서비스에 배정된 운전자가 있는 이용 가능한 차량이 없습니다. 다른 날짜나 시간을 선택해 주세요.",
        noAssignedDriver: "선택한 차량에 배정된 운전자가 없습니다.",
        noLongerAvailable: "이 차량-운전자 조합은 선택한 이동 서비스에 더 이상 이용할 수 없습니다. 다른 날짜나 시간을 선택해 주세요.",
        passengerSingular: "승객",
        journeyPlaceholder: "여정에 대해 알려주실 사항이 있나요?",
        transferReviewNote: "예약이 확정되기 전에 이동 서비스 정보가 검토됩니다.",
    },
    "日本語": {
        passengerDetails: "宿泊者情報",
        whoIsTravelling: "どなたが宿泊しますか？",
        firstName: "名",
        lastName: "姓",
        emailAddress: "メールアドレス",
        phoneNumber: "電話番号",
        specialRequests: "特別なリクエスト",
        firstNamePlaceholder: "名を入力",
        lastNamePlaceholder: "姓を入力",
        phonePlaceholder: "電話番号を入力",
        completeYour: "完了してください",
        transferBooking: "送迎予約を。",
        heroDescription: "送迎予約を完了するために情報を入力してください。",
        transferUnavailable: "送迎を利用できません",
        yourTransfer: "ご予約の送迎",
        from: "最低",
        returnJourney: "復路",
        confirmTransfer: "送迎を確定",
        backToTransferDetails: "送迎詳細に戻る",
        requiredPassengerDetails: "必須の乗客情報をすべて入力してください。",
        invalidTransferDateTime: "有効な送迎日と時刻を選択してください。",
        invalidReturnDateTime: "有効な復路の日付と時刻を選択してください。",
        cannotDetermineCity: "送迎都市を特定できませんでした。",
        departureUnavailable: "{date} {time} の往路に、担当ドライバー付きの利用可能な車両がありません。別の日付または時刻を選択してください。",
        returnUnavailable: "{date} {time} の復路に、担当ドライバー付きの利用可能な車両がありません。別の日付または時刻を選択してください。",
        pairUnavailable: "{departureDate} {departureTime} の往路と {returnDate} {returnTime} の復路の両方に利用可能な同一の車両・ドライバーの組み合わせがありません。別の日付または時刻を選択してください。",
        transferUnavailableMessage: "{date} {time} の送迎に、担当ドライバー付きの利用可能な車両がありません。別の日付または時刻を選択してください。",
        noAssignedDriver: "選択した車両には担当ドライバーが割り当てられていません。",
        noLongerAvailable: "この車両・ドライバーの組み合わせは、選択した送迎では利用できなくなりました。別の日付または時刻を選択してください。",
        passengerSingular: "乗客",
        journeyPlaceholder: "移動について事前に知らせておきたいことはありますか？",
        transferReviewNote: "予約確定前に送迎内容を確認します。",
    },
    "中文": {
        passengerDetails: "住客信息",
        whoIsTravelling: "谁将入住？",
        firstName: "名",
        lastName: "姓",
        emailAddress: "电子邮箱",
        phoneNumber: "电话号码",
        specialRequests: "特殊要求",
        firstNamePlaceholder: "请输入名字",
        lastNamePlaceholder: "请输入姓氏",
        phonePlaceholder: "请输入电话号码",
        completeYour: "完成",
        transferBooking: "您的接送预订。",
        heroDescription: "请输入您的信息以完成接送预订。",
        transferUnavailable: "接送服务不可用",
        yourTransfer: "您的接送",
        from: "起价",
        returnJourney: "返程",
        confirmTransfer: "确认接送",
        backToTransferDetails: "返回接送详情",
        requiredPassengerDetails: "请填写所有必填乘客信息。",
        invalidTransferDateTime: "请选择有效的接送日期和时间。",
        invalidReturnDateTime: "请选择有效的返程日期和时间。",
        cannotDetermineCity: "无法确定接送城市。",
        departureUnavailable: "{date} {time} 的去程没有可用的车辆及已分配司机。请选择其他去程日期或时间。",
        returnUnavailable: "{date} {time} 的返程没有可用的车辆及已分配司机。请选择其他返程日期或时间。",
        pairUnavailable: "没有同一车辆和司机组合可同时用于 {departureDate} {departureTime} 的去程和 {returnDate} {returnTime} 的返程。请选择其他日期或时间。",
        transferUnavailableMessage: "{date} {time} 的接送没有可用的车辆及已分配司机。请选择其他日期或时间。",
        noAssignedDriver: "所选车辆没有已分配的司机。",
        noLongerAvailable: "此车辆和司机组合已无法用于所选接送。请选择其他日期或时间。",
        passengerSingular: "乘客",
        journeyPlaceholder: "关于您的行程，还有什么需要我们提前了解的吗？",
        transferReviewNote: "预订确认前，我们会核对您的接送信息。",
    },
    "繁體中文": {
        passengerDetails: "住客資料",
        whoIsTravelling: "誰將入住？",
        firstName: "名字",
        lastName: "姓氏",
        emailAddress: "電子郵件",
        phoneNumber: "電話號碼",
        specialRequests: "特殊需求",
        firstNamePlaceholder: "請輸入名字",
        lastNamePlaceholder: "請輸入姓氏",
        phonePlaceholder: "請輸入電話號碼",
        completeYour: "完成",
        transferBooking: "您的接送預訂。",
        heroDescription: "請輸入您的資料以完成接送預訂。",
        transferUnavailable: "接送服務不可用",
        yourTransfer: "您的接送",
        from: "起價",
        returnJourney: "回程",
        confirmTransfer: "確認接送",
        backToTransferDetails: "返回接送詳情",
        requiredPassengerDetails: "請填寫所有必填乘客資料。",
        invalidTransferDateTime: "請選擇有效的接送日期和時間。",
        invalidReturnDateTime: "請選擇有效的回程日期和時間。",
        cannotDetermineCity: "無法確定接送城市。",
        departureUnavailable: "{date} {time} 的去程沒有可用的車輛及已指派司機。請選擇其他去程日期或時間。",
        returnUnavailable: "{date} {time} 的回程沒有可用的車輛及已指派司機。請選擇其他回程日期或時間。",
        pairUnavailable: "沒有同一車輛和司機組合可同時用於 {departureDate} {departureTime} 的去程和 {returnDate} {returnTime} 的回程。請選擇其他日期或時間。",
        transferUnavailableMessage: "{date} {time} 的接送沒有可用的車輛及已指派司機。請選擇其他日期或時間。",
        noAssignedDriver: "所選車輛沒有已指派的司機。",
        noLongerAvailable: "此車輛和司機組合已無法用於所選接送。請選擇其他日期或時間。",
        passengerSingular: "乘客",
        journeyPlaceholder: "關於您的行程，還有什麼需要我們提前知道的嗎？",
        transferReviewNote: "預訂確認前，我們會檢查您的接送資料。",
    },
    "Català": {
        passengerDetails: "Dades de l’hoste",
        whoIsTravelling: "Qui viatja?",
        firstName: "Nom",
        lastName: "Cognoms",
        emailAddress: "Adreça electrònica",
        phoneNumber: "Número de telèfon",
        specialRequests: "Peticions especials",
        firstNamePlaceholder: "El teu nom",
        lastNamePlaceholder: "Els teus cognoms",
        phonePlaceholder: "Introdueix el número de telèfon",
        completeYour: "Completa",
        transferBooking: "la reserva del trasllat.",
        heroDescription: "Introdueix les teves dades per completar la reserva del trasllat.",
        transferUnavailable: "Trasllat no disponible",
        yourTransfer: "EL TEU TRASLLAT",
        from: "des de",
        returnJourney: "VIATGE DE TORNADA",
        confirmTransfer: "Confirma el trasllat",
        backToTransferDetails: "Torna als detalls del trasllat",
        requiredPassengerDetails: "Completa totes les dades obligatòries del passatger.",
        invalidTransferDateTime: "Selecciona una data i una hora vàlides per al trasllat.",
        invalidReturnDateTime: "Selecciona una data i una hora vàlides per a la tornada.",
        cannotDetermineCity: "No hem pogut determinar la ciutat del trasllat.",
        departureUnavailable: "No hi ha cap vehicle amb conductor assignat disponible per a la sortida del {date} a les {time}. Tria una altra data o hora de sortida.",
        returnUnavailable: "No hi ha cap vehicle amb conductor assignat disponible per a la tornada del {date} a les {time}. Tria una altra data o hora de tornada.",
        pairUnavailable: "No hi ha una mateixa parella vehicle-conductor disponible tant per a la sortida del {departureDate} a les {departureTime} com per a la tornada del {returnDate} a les {returnTime}. Tria altres dates o hores.",
        transferUnavailableMessage: "No hi ha cap vehicle amb conductor assignat disponible per al trasllat del {date} a les {time}. Tria una altra data o hora.",
        noAssignedDriver: "El vehicle seleccionat no té cap conductor assignat.",
        noLongerAvailable: "Aquesta parella vehicle-conductor ja no està disponible per al trasllat seleccionat. Tria una altra data o hora.",
        passengerSingular: "passatger",
        journeyPlaceholder: "Hi ha alguna cosa que hauríem de saber sobre el teu trajecte?",
        transferReviewNote: "Les dades del trasllat es revisaran abans de confirmar la reserva.",
    },
    "Eesti": {
        passengerDetails: "Külalise andmed",
        whoIsTravelling: "Kes reisib?",
        firstName: "Eesnimi",
        lastName: "Perekonnanimi",
        emailAddress: "E-posti aadress",
        phoneNumber: "Telefoninumber",
        specialRequests: "Erisoovid",
        firstNamePlaceholder: "Teie eesnimi",
        lastNamePlaceholder: "Teie perekonnanimi",
        phonePlaceholder: "Sisestage telefoninumber",
        completeYour: "Lõpetage",
        transferBooking: "transfeeribroneering.",
        heroDescription: "Sisestage oma andmed transfeeribroneeringu lõpetamiseks.",
        transferUnavailable: "Transfeer pole saadaval",
        yourTransfer: "TEIE TRANSFEER",
        from: "alates",
        returnJourney: "TAGASISÕIT",
        confirmTransfer: "Kinnita transfeer",
        backToTransferDetails: "Tagasi transfeeri üksikasjade juurde",
        requiredPassengerDetails: "Täitke kõik kohustuslikud reisijaandmed.",
        invalidTransferDateTime: "Valige transfeeri jaoks kehtiv kuupäev ja kellaaeg.",
        invalidReturnDateTime: "Valige tagasisõidu jaoks kehtiv kuupäev ja kellaaeg.",
        cannotDetermineCity: "Transfeeri linna ei õnnestunud määrata.",
        departureUnavailable: "Väljumiseks {date} kell {time} pole saadaval sõidukit määratud juhiga. Valige muu väljumiskuupäev või -aeg.",
        returnUnavailable: "Tagasisõiduks {date} kell {time} pole saadaval sõidukit määratud juhiga. Valige muu tagasisõidukuupäev või -aeg.",
        pairUnavailable: "Sama sõiduki ja juhi paar pole saadaval nii väljumiseks {departureDate} kell {departureTime} kui ka tagasisõiduks {returnDate} kell {returnTime}. Valige muud kuupäevad või ajad.",
        transferUnavailableMessage: "Transfeeriks {date} kell {time} pole saadaval sõidukit määratud juhiga. Valige muu kuupäev või aeg.",
        noAssignedDriver: "Valitud sõidukile pole juhti määratud.",
        noLongerAvailable: "See sõiduki ja juhi paar pole valitud transfeeriks enam saadaval. Valige muu kuupäev või aeg.",
        passengerSingular: "reisija",
        journeyPlaceholder: "Kas peaksime teie sõidu kohta midagi teadma?",
        transferReviewNote: "Transfeeri andmed vaadatakse enne broneeringu kinnitamist üle.",
    },
    "Latviešu": {
        passengerDetails: "Viesa dati",
        whoIsTravelling: "Kas ceļo?",
        firstName: "Vārds",
        lastName: "Uzvārds",
        emailAddress: "E-pasta adrese",
        phoneNumber: "Tālruņa numurs",
        specialRequests: "Īpašas vēlmes",
        firstNamePlaceholder: "Jūsu vārds",
        lastNamePlaceholder: "Jūsu uzvārds",
        phonePlaceholder: "Ievadiet tālruņa numuru",
        completeYour: "Pabeidziet",
        transferBooking: "transfēra rezervāciju.",
        heroDescription: "Ievadiet savus datus, lai pabeigtu transfēra rezervāciju.",
        transferUnavailable: "Transfērs nav pieejams",
        yourTransfer: "JŪSU TRANSFĒRS",
        from: "no",
        returnJourney: "ATPAKAĻCEĻŠ",
        confirmTransfer: "Apstiprināt transfēru",
        backToTransferDetails: "Atpakaļ uz transfēra informāciju",
        requiredPassengerDetails: "Aizpildiet visus obligātos pasažiera datus.",
        invalidTransferDateTime: "Izvēlieties derīgu transfēra datumu un laiku.",
        invalidReturnDateTime: "Izvēlieties derīgu atpakaļceļa datumu un laiku.",
        cannotDetermineCity: "Neizdevās noteikt transfēra pilsētu.",
        departureUnavailable: "Izbraukšanai {date} plkst. {time} nav pieejams transportlīdzeklis ar piešķirtu vadītāju. Izvēlieties citu izbraukšanas datumu vai laiku.",
        returnUnavailable: "Atpakaļceļam {date} plkst. {time} nav pieejams transportlīdzeklis ar piešķirtu vadītāju. Izvēlieties citu atpakaļceļa datumu vai laiku.",
        pairUnavailable: "Nav vienas transportlīdzekļa un vadītāja kombinācijas, kas būtu pieejama gan izbraukšanai {departureDate} plkst. {departureTime}, gan atpakaļceļam {returnDate} plkst. {returnTime}. Izvēlieties citus datumus vai laikus.",
        transferUnavailableMessage: "Transfēram {date} plkst. {time} nav pieejams transportlīdzeklis ar piešķirtu vadītāju. Izvēlieties citu datumu vai laiku.",
        noAssignedDriver: "Izvēlētajam transportlīdzeklim nav piešķirts vadītājs.",
        noLongerAvailable: "Šī transportlīdzekļa un vadītāja kombinācija izvēlētajam transfēram vairs nav pieejama. Izvēlieties citu datumu vai laiku.",
        passengerSingular: "pasažieris",
        journeyPlaceholder: "Vai ir kas tāds, kas mums būtu jāzina par jūsu braucienu?",
        transferReviewNote: "Transfēra informācija tiks pārbaudīta pirms rezervācijas apstiprināšanas.",
    },
    "Lietuvių": {
        passengerDetails: "Svečio duomenys",
        whoIsTravelling: "Kas keliauja?",
        firstName: "Vardas",
        lastName: "Pavardė",
        emailAddress: "El. pašto adresas",
        phoneNumber: "Telefono numeris",
        specialRequests: "Specialūs pageidavimai",
        firstNamePlaceholder: "Jūsų vardas",
        lastNamePlaceholder: "Jūsų pavardė",
        phonePlaceholder: "Įveskite telefono numerį",
        completeYour: "Užbaikite",
        transferBooking: "pervežimo rezervaciją.",
        heroDescription: "Įveskite savo duomenis, kad užbaigtumėte pervežimo rezervaciją.",
        transferUnavailable: "Pervežimas nepasiekiamas",
        yourTransfer: "JŪSŲ PERVEŽIMAS",
        from: "nuo",
        returnJourney: "KELIONĖ ATGAL",
        confirmTransfer: "Patvirtinti pervežimą",
        backToTransferDetails: "Grįžti į pervežimo informaciją",
        requiredPassengerDetails: "Užpildykite visus privalomus keleivio duomenis.",
        invalidTransferDateTime: "Pasirinkite galiojančią pervežimo datą ir laiką.",
        invalidReturnDateTime: "Pasirinkite galiojančią kelionės atgal datą ir laiką.",
        cannotDetermineCity: "Nepavyko nustatyti pervežimo miesto.",
        departureUnavailable: "Išvykimui {date} {time} nėra laisvos transporto priemonės su priskirtu vairuotoju. Pasirinkite kitą išvykimo datą arba laiką.",
        returnUnavailable: "Grįžimui {date} {time} nėra laisvos transporto priemonės su priskirtu vairuotoju. Pasirinkite kitą grįžimo datą arba laiką.",
        pairUnavailable: "Nėra vienos transporto priemonės ir vairuotojo poros, kuri būtų laisva tiek išvykimui {departureDate} {departureTime}, tiek grįžimui {returnDate} {returnTime}. Pasirinkite kitas datas arba laikus.",
        transferUnavailableMessage: "Pervežimui {date} {time} nėra laisvos transporto priemonės su priskirtu vairuotoju. Pasirinkite kitą datą arba laiką.",
        noAssignedDriver: "Pasirinktai transporto priemonei nepriskirtas vairuotojas.",
        noLongerAvailable: "Ši transporto priemonės ir vairuotojo pora pasirinktam pervežimui nebepasiekiama. Pasirinkite kitą datą arba laiką.",
        passengerSingular: "keleivis",
        journeyPlaceholder: "Ar yra kas nors, ką turėtume žinoti apie jūsų kelionę?",
        transferReviewNote: "Pervežimo informacija bus patikrinta prieš patvirtinant rezervaciją.",
    },
};

type TransferCheckoutKey =
    keyof typeof transferCheckoutTranslations.English;

function getTransferCheckoutText(
    language: string,
    key: TransferCheckoutKey,
    values?: Record<string, string | number>
): string {
    const languageName =
        language.split("|")[0];

    const dictionaries: Record<
        string,
        Partial<Record<TransferCheckoutKey, string>>
    > = transferCheckoutTranslations;

    const dictionary =
        dictionaries[languageName] ??
        transferCheckoutTranslations.English;

    let text =
        dictionary[key] ??
        transferCheckoutTranslations.English[key];

    if (values) {
        Object.entries(values).forEach(
            ([name, value]) => {
                text = text
                    .split(`{${name}}`)
                    .join(String(value));
            }
        );
    }

    return text;
}

function TransferCheckoutContent() {
    const searchParams =
        useSearchParams();

    const { currency, language } = useSettings();

    const t = (
        key: TransferCheckoutKey,
        values?: Record<string, string | number>
    ) =>
        getTransferCheckoutText(
            language,
            key,
            values
        );

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    const formatPrice = (price: number) => {
        const convertedPrice =
            price * selectedCurrency.rate;

        return `${selectedCurrency.symbol}${Math.round(
            convertedPrice
        ).toLocaleString()}`;
    };

    const [
        firstName,
        setFirstName,
    ] = useState("");

    const [
        lastName,
        setLastName,
    ] = useState("");

    const [
        email,
        setEmail,
    ] = useState("");

    const [
        phone,
        setPhone,
    ] = useState("");

    const [
        specialRequests,
        setSpecialRequests,
    ] = useState("");

    const [availabilityError, setAvailabilityError] = useState("");

    /*
     * =========================================
     * TRANSFER DATA
     * =========================================
     */

    const transferType =
        searchParams.get(
            "transferType"
        ) || "one-way";

    const optionId =
        searchParams.get(
            "optionId"
        ) || "";

    const optionTitle =
        searchParams.get(
            "optionTitle"
        ) || "Private transfer";

    const canonicalOptionTitle =
        getCanonicalTransferOptionTitle(
            optionId,
            optionTitle
        );

    const displayOptionTitle =
        optionId === "1"
            ? getTranslation(
                language,
                "privateTransfer"
            )
            : optionId === "2"
                ? getTranslation(
                    language,
                    "comfortTransfer"
                )
                : optionId === "3"
                    ? getTranslation(
                        language,
                        "familyTransfer"
                    )
                    : optionTitle ===
                    "Private transfer"
                        ? getTranslation(
                            language,
                            "privateTransfer"
                        )
                        : optionTitle;

    const basePrice =
        Number(
            searchParams.get(
                "price"
            ) || "32"
        );

    const totalPrice =
        transferType === "return"
            ? basePrice * 2
            : basePrice;

    const pickup =
        searchParams.get(
            "pickup"
        ) || "—";

    const destination =
        searchParams.get(
            "destination"
        ) || "—";

    const date =
        searchParams.get(
            "date"
        ) || "—";

    const time =
        searchParams.get(
            "time"
        ) || "—";

    const passengers =
        searchParams.get(
            "passengers"
        ) || "2";

    const returnDate =
        searchParams.get(
            "returnDate"
        ) || "—";

    const returnTime =
        searchParams.get(
            "returnTime"
        ) || "—";


    /*
     * =========================================
     * DISPLAY DATE FORMAT
     * =========================================
     *
     * Keep the original ISO date in the booking
     * data, but display it as DD.MM.YYYY.
     */

    const formatDisplayDate = (
        value: string
    ) => {
        if (
            !value ||
            value === "—"
        ) {
            return value;
        }

        const parts =
            value.split("-");

        if (
            parts.length !== 3
        ) {
            return value;
        }

        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    };


    /*
     * =========================================
     * AUTHENTICATION
     * =========================================
     *
     * If somebody manually opens checkout
     * while logged out, send them to 401.
     *
     * The main authentication check should
     * ALSO happen on "Select transfer" in
     * transfers/page.tsx.
     */

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href =
                `/401?from=${encodeURIComponent(
                    window.location.pathname +
                    window.location.search
                )}`;
        }
    }, []);


    /*
     * =========================================
     * BACK URL
     * =========================================
     */

    const backToTransfers =
        `/transfers`;


    /*
     * =========================================
     * AVAILABILITY HELPERS
     * =========================================
     *
     * pending   -> occupies the pair
     * confirmed -> occupies the pair
     * cancelled -> frees the pair
     *
     * Older bookings without a status are treated
     * as active for backwards compatibility.
     */

    const isActiveTransferBooking = (
        booking: {
            status?: "pending" | "confirmed" | "cancelled";
        }
    ) => {
        return booking.status !== "cancelled";
    };

    const isTransferLegBusy = (
        existingDate: string,
        existingTime: string,
        existingDuration: number,
        requestedDate: string,
        requestedTime: string,
        requestedDuration: number
    ) => {
        const existingStart = new Date(
            `${existingDate}T${existingTime}`
        ).getTime();

        const requestedStart = new Date(
            `${requestedDate}T${requestedTime}`
        ).getTime();

        if (
            Number.isNaN(existingStart) ||
            Number.isNaN(requestedStart)
        ) {
            return false;
        }

        const existingEnd =
            existingStart +
            existingDuration * 60 * 1000;

        const requestedEnd =
            requestedStart +
            requestedDuration * 60 * 1000;

        return (
            requestedStart < existingEnd &&
            requestedEnd > existingStart
        );
    };

    /*
     * =========================================
     * AVAILABILITY HELPERS
     * =========================================
     *
     * A vehicle and its assigned driver are ONE
     * availability pair.
     *
     * pending   -> occupies the pair
     * confirmed -> occupies the pair
     * cancelled -> frees the pair
     *
     * One-way:
     *   check only the requested outbound leg.
     *
     * Return:
     *   check BOTH requested legs against BOTH legs
     *   of every active existing booking.
     */

    const getActiveTransferBookings = (
        bookings: TransferBooking[]
    ) => {
        return bookings.filter(
            (booking) =>
                isActiveTransferBooking(booking)
        );
    };

    const getTransferBookingsForVehicle = (
        vehicleId: string,
        bookings: TransferBooking[]
    ) => {
        return getActiveTransferBookings(
            bookings
        ).filter(
            (booking) =>
                booking.vehicleId === vehicleId
        );
    };

    const getTransferBookingsForDriver = (
        driverId: string,
        bookings: TransferBooking[]
    ) => {
        return getActiveTransferBookings(
            bookings
        ).filter(
            (booking) =>
                booking.driverId === driverId
        );
    };

    const isLegAvailable = (
        bookings: TransferBooking[],
        requestedDate: string,
        requestedTime: string,
        requestedDuration: number
    ) => {
        if (
            !requestedDate ||
            requestedDate === "—" ||
            !requestedTime ||
            requestedTime === "—"
        ) {
            return false;
        }

        return !bookings.some(
            (booking) => {
                const existingDuration =
                    getTransferDuration(
                        booking.optionTitle
                    );

                /*
                 * Existing outbound leg.
                 */
                if (
                    isTransferLegBusy(
                        booking.date,
                        booking.time,
                        existingDuration,
                        requestedDate,
                        requestedTime,
                        requestedDuration
                    )
                ) {
                    return true;
                }

                /*
                 * Existing return leg.
                 */
                if (
                    booking.transferType ===
                    "return" &&
                    booking.returnDate &&
                    booking.returnTime
                ) {
                    if (
                        isTransferLegBusy(
                            booking.returnDate,
                            booking.returnTime,
                            existingDuration,
                            requestedDate,
                            requestedTime,
                            requestedDuration
                        )
                    ) {
                        return true;
                    }
                }

                return false;
            }
        );
    };

    const isPairAvailable = (
        vehicleId: string,
        driverId: string,
        requiredCategory: string,
        duration: number,
        requestedPassengers: number,
        requestedTransferType:
            | "one-way"
            | "return",
        requestedDate: string,
        requestedTime: string,
        requestedReturnDate: string,
        requestedReturnTime: string,
        cityVehicles: TransferVehicle[],
        cityDrivers: TransferDriver[],
        existingBookings: TransferBooking[]
    ) => {
        /*
         * Vehicles and drivers are supplied from the backend.
         * No localStorage lookup is used here.
         */
        const vehicle =
            cityVehicles.find(
                (item) =>
                    item.id === vehicleId
            );

        const driver =
            cityDrivers.find(
                (item) =>
                    item.id === driverId
            );

        if (
            !vehicle ||
            !driver
        ) {
            return false;
        }

        /*
         * Category and capacity.
         */
        if (
            vehicle.category !==
            requiredCategory
        ) {
            return false;
        }

        if (
            vehicle.passengers <
            requestedPassengers
        ) {
            return false;
        }

        /*
         * The driver MUST be the one assigned
         * to this vehicle.
         */
        if (
            vehicle.driverId !==
            driver.id
        ) {
            return false;
        }

        /*
         * An inactive driver can never be assigned.
         * "busy" is NOT used here because scheduled
         * availability is determined by bookings.
         */
        if (
            driver.status ===
            "inactive"
        ) {
            return false;
        }

        /*
         * Both resources must be free.
         */
        const vehicleBookings =
            getTransferBookingsForVehicle(
                vehicle.id,
                existingBookings
            );

        const driverBookings =
            getTransferBookingsForDriver(
                driver.id,
                existingBookings
            );

        /*
         * One-way: only outbound.
         */
        if (
            !isLegAvailable(
                vehicleBookings,
                requestedDate,
                requestedTime,
                duration
            )
        ) {
            return false;
        }

        if (
            !isLegAvailable(
                driverBookings,
                requestedDate,
                requestedTime,
                duration
            )
        ) {
            return false;
        }

        /*
         * Return: the SAME vehicle + driver pair
         * must also be free for the return leg.
         */
        if (
            requestedTransferType ===
            "return"
        ) {
            if (
                !isLegAvailable(
                    vehicleBookings,
                    requestedReturnDate,
                    requestedReturnTime,
                    duration
                )
            ) {
                return false;
            }

            if (
                !isLegAvailable(
                    driverBookings,
                    requestedReturnDate,
                    requestedReturnTime,
                    duration
                )
            ) {
                return false;
            }
        }

        return true;
    };

    /*
     * =========================================
     * CONFIRM TRANSFER
     * =========================================
     */

    const handleConfirmTransfer =
        async () => {

            setAvailabilityError("");

            /*
             * DOUBLE CHECK AUTHENTICATION
             */

            if (!isAuthenticated()) {
                window.location.href =
                    `/401?from=${encodeURIComponent(
                        window.location.pathname +
                        window.location.search
                    )}`;

                return;
            }


            /*
             * PASSENGER DETAILS
             */

            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone
            ) {
                alert(
                    t("requiredPassengerDetails")
                );

                return;
            }


            /*
             * DATE AND TIME
             */

            if (
                !date ||
                date === "—" ||
                !time ||
                time === "—"
            ) {
                alert(
                    t("invalidTransferDateTime")
                );

                return;
            }


            /*
             * RETURN DATE AND TIME
             */

            if (
                transferType ===
                "return" &&
                (
                    !returnDate ||
                    returnDate === "—" ||
                    !returnTime ||
                    returnTime === "—"
                )
            ) {
                alert(
                    t("invalidReturnDateTime")
                );

                return;
            }


            /*
             * FIND TRANSFER CITY
             */

            let transferLocations;

            try {
                transferLocations =
                    await getTransferLocationsFromApi();
            } catch (error) {
                console.error(
                    "Could not load transfer locations from the backend.",
                    error
                );

                setAvailabilityError(
                    "Could not load transfer locations. Please try again."
                );

                return;
            }

            const normalizedPickup =
                pickup
                    .trim()
                    .toLowerCase();

            const pickupLocation =
                transferLocations.find(
                    (location) =>
                        location.name
                            .trim()
                            .toLowerCase() ===
                        normalizedPickup
                );

            const city =
                pickupLocation?.cityName ||
                "";

            if (!city) {
                alert(
                    t("cannotDetermineCity")
                );

                return;
            }


            /*
             * TRANSFER DURATION
             */

            const duration =
                getTransferDuration(
                    optionTitle
                );


            /*
             * REQUIRED CATEGORY
             */

            const requiredCategory =
                canonicalOptionTitle
                    .toLowerCase()
                    .includes("family")
                    ? "Family"
                    : canonicalOptionTitle
                        .toLowerCase()
                        .includes(
                            "comfort"
                        )
                        ? "Comfort"
                        : "Private";


            /*
             * CURRENT AVAILABILITY DATA FROM BACKEND
             *
             * Bookings, vehicles and drivers are loaded directly
             * from the API. The checkout no longer uses localStorage
             * to decide which vehicle/driver pair is available.
             */

            let existingBookings:
                TransferBooking[];

            let allVehicles:
                TransferVehicle[];

            let allDrivers:
                TransferDriver[];

            try {
                [
                    existingBookings,
                    allVehicles,
                    allDrivers,
                ] = await Promise.all([
                    getTransferBookingsFromApi(),
                    getTransferVehiclesFromApi(),
                    getTransferDriversFromApi(),
                ]);
            } catch {
                setAvailabilityError(
                    "Could not load transfer availability. Please try again."
                );

                return;
            }

            const vehicles =
                allVehicles.filter(
                    (vehicle) =>
                        vehicle.city.toLowerCase() ===
                        city.toLowerCase()
                );

            const drivers =
                allDrivers.filter(
                    (driver) =>
                        driver.city.toLowerCase() ===
                        city.toLowerCase()
                );


            /*
             * FIND AVAILABLE VEHICLE + DRIVER PAIR
             *
             * Each vehicle already contains its assigned driverId.
             * We test the exact vehicle + driver pair.
             *
             * If pair #1 is occupied, .find() automatically
             * continues to pair #2.
             */

            const availableVehicle =
                vehicles.find(
                    (vehicle) => {
                        if (
                            !vehicle.driverId
                        ) {
                            return false;
                        }

                        /*
                         * Skip vehicles that are not in
                         * the requested category/capacity.
                         */
                        if (
                            vehicle.category !==
                            requiredCategory
                        ) {
                            return false;
                        }

                        if (
                            vehicle.passengers <
                            Number(passengers)
                        ) {
                            return false;
                        }

                        const assignedDriver =
                            drivers.find(
                                (driver) =>
                                    driver.id ===
                                    vehicle.driverId
                            );

                        if (
                            !assignedDriver
                        ) {
                            return false;
                        }

                        /*
                         * Only an inactive driver is
                         * permanently unavailable.
                         * Busy is determined by bookings.
                         */
                        if (
                            assignedDriver.status ===
                            "inactive"
                        ) {
                            return false;
                        }

                        return isPairAvailable(
                            vehicle.id,
                            assignedDriver.id,
                            requiredCategory,
                            duration,
                            Number(passengers),
                            transferType ===
                            "return"
                                ? "return"
                                : "one-way",
                            date,
                            time,
                            returnDate,
                            returnTime,
                            vehicles,
                            drivers,
                            existingBookings
                        );
                    }
                );

            if (
                !availableVehicle
            ) {
                /*
                 * Tell the customer exactly which leg is unavailable.
                 *
                 * For a Return transfer we check the two legs separately
                 * only for the purpose of the error message:
                 * - departure
                 * - return
                 *
                 * The real booking check above still requires the SAME
                 * vehicle + driver pair to be available for BOTH legs.
                 */

                const hasAvailableDeparturePair =
                    vehicles.some(
                        (vehicle) => {
                            if (
                                !vehicle.driverId ||
                                vehicle.category !==
                                requiredCategory ||
                                vehicle.passengers <
                                Number(passengers)
                            ) {
                                return false;
                            }

                            const assignedDriver =
                                drivers.find(
                                    (driver) =>
                                        driver.id ===
                                        vehicle.driverId
                                );

                            if (
                                !assignedDriver ||
                                assignedDriver.status ===
                                "inactive"
                            ) {
                                return false;
                            }

                            return isPairAvailable(
                                vehicle.id,
                                assignedDriver.id,
                                requiredCategory,
                                duration,
                                Number(passengers),
                                "one-way",
                                date,
                                time,
                                "—",
                                "—",
                                vehicles,
                                drivers,
                                existingBookings
                            );
                        }
                    );

                if (
                    transferType === "return"
                ) {
                    const hasAvailableReturnPair =
                        vehicles.some(
                            (vehicle) => {
                                if (
                                    !vehicle.driverId ||
                                    vehicle.category !==
                                    requiredCategory ||
                                    vehicle.passengers <
                                    Number(passengers)
                                ) {
                                    return false;
                                }

                                const assignedDriver =
                                    drivers.find(
                                        (driver) =>
                                            driver.id ===
                                            vehicle.driverId
                                    );

                                if (
                                    !assignedDriver ||
                                    assignedDriver.status ===
                                    "inactive"
                                ) {
                                    return false;
                                }

                                return isPairAvailable(
                                    vehicle.id,
                                    assignedDriver.id,
                                    requiredCategory,
                                    duration,
                                    Number(passengers),
                                    "one-way",
                                    returnDate,
                                    returnTime,
                                    "—",
                                    "—",
                                    vehicles,
                                    drivers,
                                    existingBookings
                                );
                            }
                        );

                    if (
                        !hasAvailableDeparturePair
                    ) {
                        setAvailabilityError(
                            t(
                                "departureUnavailable",
                                {
                                    date: formatDisplayDate(date),
                                    time,
                                }
                            )
                        );

                        return;
                    }

                    if (
                        !hasAvailableReturnPair
                    ) {
                        setAvailabilityError(
                            t(
                                "returnUnavailable",
                                {
                                    date: formatDisplayDate(returnDate),
                                    time: returnTime,
                                }
                            )
                        );

                        return;
                    }

                    /*
                     * Both individual legs have an available pair,
                     * but no SINGLE pair is free for both legs.
                     */
                    setAvailabilityError(
                        t(
                            "pairUnavailable",
                            {
                                departureDate: formatDisplayDate(date),
                                departureTime: time,
                                returnDate: formatDisplayDate(returnDate),
                                returnTime,
                            }
                        )
                    );

                    return;
                }

                setAvailabilityError(
                    t(
                        "transferUnavailableMessage",
                        {
                            date: formatDisplayDate(date),
                            time,
                        }
                    )
                );

                return;
            }

            /*
             * The selected driver is always the driver
             * assigned to the selected vehicle.
             */
            const availableDriver =
                drivers.find(
                    (driver) =>
                        driver.id ===
                        availableVehicle.driverId
                );

            if (
                !availableDriver
            ) {
                alert(
                    t("noAssignedDriver")
                );

                return;
            }

            /*
             * FINAL CHECK
             *
             * Re-read bookings, vehicles and drivers immediately
             * before saving. This makes the final decision from the
             * latest backend state, including assignment/status changes.
             */

            let latestBookings:
                TransferBooking[];

            let latestAllVehicles:
                TransferVehicle[];

            let latestAllDrivers:
                TransferDriver[];

            try {
                [
                    latestBookings,
                    latestAllVehicles,
                    latestAllDrivers,
                ] = await Promise.all([
                    getTransferBookingsFromApi(),
                    getTransferVehiclesFromApi(),
                    getTransferDriversFromApi(),
                ]);
            } catch {
                setAvailabilityError(
                    "Could not refresh transfer availability. Please try again."
                );

                return;
            }

            const latestVehicles =
                latestAllVehicles.filter(
                    (vehicle) =>
                        vehicle.city.toLowerCase() ===
                        city.toLowerCase()
                );

            const latestDrivers =
                latestAllDrivers.filter(
                    (driver) =>
                        driver.city.toLowerCase() ===
                        city.toLowerCase()
                );

            const latestSelectedVehicle =
                latestVehicles.find(
                    (vehicle) =>
                        vehicle.id ===
                        availableVehicle.id
                );

            const latestSelectedDriver =
                latestDrivers.find(
                    (driver) =>
                        driver.id ===
                        availableDriver.id
                );

            if (
                !latestSelectedVehicle ||
                !latestSelectedDriver
            ) {
                setAvailabilityError(
                    t("noLongerAvailable")
                );

                return;
            }

            const stillAvailable =
                isPairAvailable(
                    latestSelectedVehicle.id,
                    latestSelectedDriver.id,
                    requiredCategory,
                    duration,
                    Number(passengers),
                    transferType ===
                    "return"
                        ? "return"
                        : "one-way",
                    date,
                    time,
                    returnDate,
                    returnTime,
                    latestVehicles,
                    latestDrivers,
                    latestBookings
                );

            if (!stillAvailable) {
                setAvailabilityError(
                    t("noLongerAvailable")
                );

                return;
            }

            /*
             * CREATE BOOKING
             */

            const booking: TransferBooking = {
                id:
                    `transfer-${Date.now()}`,

                transferType:
                    transferType ===
                    "return"
                        ? "return"
                        : "one-way",

                optionId,

                optionTitle:
                canonicalOptionTitle,

                price:
                    Number(totalPrice),

                vehicleId:
                latestSelectedVehicle.id,

                vehicleName:
                latestSelectedVehicle.name,

                licensePlate:
                latestSelectedVehicle.licensePlate,

                vehicleImage:
                latestSelectedVehicle.image,

                driverId:
                latestSelectedDriver.id,

                driverName:
                latestSelectedDriver.name,

                pickup,

                destination,

                date,

                time,

                passengers:
                    Number(
                        passengers
                    ),

                returnDate:
                    transferType ===
                    "return"
                        ? returnDate
                        : undefined,

                returnTime:
                    transferType ===
                    "return"
                        ? returnTime
                        : undefined,

                firstName,

                lastName,

                email,

                phone,

                specialRequests,

                status:
                    "pending",

                createdAt:
                    new Date().toISOString(),
            };


            /*
             * SAVE
             */

            try {
                await createTransferBookingInApi(
                    booking
                );

                /*
                 * CONFIRMATION
                 */
                window.location.href =
                    "/transfers/confirmation";
            } catch {
                setAvailabilityError(
                    "Could not save the transfer booking. Please try again."
                );
            }
        };


    /*
     * =========================================
     * RENDER
     * =========================================
     */

    return (
        <main className="transfer-checkout-page">

            {/* HERO */}

            <section className="transfer-checkout-hero">

                <div className="transfers-container">

                    <span className="transfers-eyebrow stayway-load-in stayway-load-1">
                        {`STAYWAY ${getTranslation(
                            language,
                            "transfers"
                        ).toUpperCase()}`}
                    </span>

                    <h1 className="stayway-load-in stayway-load-2">
                        {t("completeYour")}
                        <br />
                        <span>
                            {t("transferBooking")}
                        </span>
                    </h1>

                    <p className="stayway-load-in stayway-load-3">
                        {t("heroDescription")}
                    </p>

                </div>

            </section>


            {/* CONTENT */}

            <section className="transfer-checkout-content">

                <div className="transfers-container">

                    {availabilityError && (
                        <div
                            role="alert"
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "12px",
                                marginBottom: "22px",
                                padding: "14px 16px",
                                border: "1px solid #f1b8b8",
                                borderRadius: "12px",
                                background: "#fff5f5",
                                color: "#7f1d1d",
                                fontSize: "14px",
                                lineHeight: 1.5,
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    flexShrink: 0,
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "50%",
                                    background: "#fee2e2",
                                    color: "#dc2626",
                                    fontWeight: 700,
                                    fontSize: "13px",
                                }}
                            >
                                !
                            </span>
                            <div>
                                <strong
                                    style={{
                                        display: "block",
                                        marginBottom: "3px",
                                        color: "#b91c1c",
                                    }}
                                >
                                    {t("transferUnavailable")}
                                </strong>
                                <span>{availabilityError}</span>
                            </div>
                        </div>
                    )}

                    <div className="transfer-checkout-layout">

                        {/* PASSENGER DETAILS */}

                        <div className="transfer-checkout-form-card stayway-load-in stayway-load-4">

                            <span className="transfers-eyebrow">
                                {t("passengerDetails")}
                            </span>

                            <h2>
                                {t("whoIsTravelling")}
                            </h2>


                            <div className="transfer-form-grid">

                                <div className="transfer-form-field">

                                    <label htmlFor="firstName">
                                        {t("firstName")}
                                    </label>

                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder={t("firstNamePlaceholder")}
                                        value={
                                            firstName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setFirstName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </div>


                                <div className="transfer-form-field">

                                    <label htmlFor="lastName">
                                        {t("lastName")}
                                    </label>

                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder={t("lastNamePlaceholder")}
                                        value={
                                            lastName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setLastName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </div>


                                <div className="transfer-form-field">

                                    <label htmlFor="email">
                                        {t("emailAddress")}
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={
                                            email
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEmail(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </div>


                                <div className="transfer-form-field">

                                    <label htmlFor="phone">
                                        {t("phoneNumber")}
                                    </label>

                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder={t("phonePlaceholder")}
                                        value={
                                            phone
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setPhone(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            {/* SPECIAL REQUESTS */}

                            <div className="transfer-form-field transfer-form-field-full">

                                <label htmlFor="requests">
                                    {t("specialRequests")}
                                </label>

                                <textarea
                                    id="requests"
                                    rows={4}
                                    placeholder={t("journeyPlaceholder")}
                                    value={
                                        specialRequests
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSpecialRequests(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />

                            </div>


                            {/* NOTE */}

                            <div className="transfer-checkout-note">

                                <span>
                                    ✓
                                </span>

                                <p>
                                    {t("transferReviewNote")}
                                </p>

                            </div>

                        </div>


                        {/* SUMMARY */}

                        <aside className="transfer-summary-card stayway-load-in stayway-load-5">

                            <div className="transfer-summary-header">

                                <div>

                                    <span className="transfers-eyebrow">
                                        {t("yourTransfer")}
                                    </span>

                                    <h2>
                                        {displayOptionTitle}
                                    </h2>

                                </div>


                                <div className="transfer-summary-price">

                                    <span>
                                        {t("from")}
                                    </span>

                                    <strong>
                                        {formatPrice(basePrice)}
                                    </strong>

                                </div>

                            </div>


                            {/* ROUTE */}

                            <div className="transfer-summary-route">

                                <div>

                                    <span>
                                        {getTranslation(
                                            language,
                                            "pickupLocation"
                                        )}
                                    </span>

                                    <strong>
                                        {pickup}
                                    </strong>

                                </div>


                                <div className="transfer-summary-arrow">
                                    →
                                </div>


                                <div>

                                    <span>
                                        {getTranslation(
                                            language,
                                            "destination"
                                        )}
                                    </span>

                                    <strong>
                                        {destination}
                                    </strong>

                                </div>

                            </div>


                            {/* DETAILS */}

                            <div className="transfer-summary-details">

                                <div>

                                    <span>
                                        {getTranslation(
                                            language,
                                            "date"
                                        )}
                                    </span>

                                    <strong>
                                        {formatDisplayDate(date)}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        {getTranslation(
                                            language,
                                            "time"
                                        )}
                                    </span>

                                    <strong>
                                        {time}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        {getTranslation(
                                            language,
                                            "passengers"
                                        )}
                                    </span>

                                    <strong>
                                        {passengers}{" "}
                                        {passengers ===
                                        "1"
                                            ? t("passengerSingular")
                                            : getTranslation(
                                                language,
                                                "passengers"
                                            )}
                                    </strong>

                                </div>

                            </div>


                            {/* RETURN */}

                            {transferType ===
                                "return" && (

                                    <div className="transfer-summary-return">

                                        <span className="transfers-eyebrow">
                                            {t("returnJourney")}
                                        </span>

                                        <div className="transfer-summary-return-details">

                                            <div>

                                                <span>
                                                    {getTranslation(
                                                        language,
                                                        "returnDate"
                                                    )}
                                                </span>

                                                <strong>
                                                    {formatDisplayDate(returnDate)}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    {getTranslation(
                                                        language,
                                                        "returnTime"
                                                    )}
                                                </span>

                                                <strong>
                                                    {returnTime}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>
                                )}


                            {transferType === "return" && (
                                <div className="transfer-summary-divider" />
                            )}


                            {/* TOTAL */}

                            <div className="transfer-summary-total">

                                <span>
                                    {getTranslation(
                                        language,
                                        "total"
                                    ).replace(/:\s*$/, "")}
                                </span>

                                <strong>
                                    {formatPrice(totalPrice)}
                                </strong>

                            </div>


                            {/* CONFIRM */}

                            <button
                                type="button"
                                className="transfer-confirm-button"
                                onClick={
                                    handleConfirmTransfer
                                }
                            >
                                {t("confirmTransfer")}
                            </button>


                            {/* BACK */}

                            <Link
                                href={backToTransfers}
                                className="transfer-summary-back"
                            >
                                ← {t("backToTransferDetails")}
                            </Link>

                        </aside>

                    </div>

                </div>

            </section>


            <style jsx global>{`
                /* =========================================================
                   TRANSFER CHECKOUT — DARK MODE
                   Removes the white/light surfaces and keeps the page navy.
                ========================================================= */

                html[data-theme="dark"] .transfer-checkout-page {
                    background: #172338 !important;
                    color: #f5f8fc !important;
                }

                html[data-theme="dark"] .transfer-checkout-hero {
                    background: #101d30 !important;
                    border-bottom: 1px solid #2d4059 !important;
                }

                html[data-theme="dark"] .transfer-checkout-hero h1 {
                    color: #f7f9fc !important;
                }

                html[data-theme="dark"] .transfer-checkout-hero h1 span {
                    color: #9b8cff !important;
                }

                html[data-theme="dark"] .transfer-checkout-hero p {
                    color: #aebed1 !important;
                }

                html[data-theme="dark"] .transfer-checkout-content {
                    background: #172338 !important;
                }

                html[data-theme="dark"] .transfer-checkout-content .transfers-container {
                    background: transparent !important;
                }

                html[data-theme="dark"] .transfer-checkout-layout {
                    background: transparent !important;
                }

                html[data-theme="dark"] .transfer-checkout-form-card,
                html[data-theme="dark"] .transfer-summary-card {
                    background: #0d1c2f !important;
                    border: 1px solid #304660 !important;
                    color: #f5f8fc !important;
                    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18) !important;
                }

                html[data-theme="dark"] .transfer-checkout-form-card h2,
                html[data-theme="dark"] .transfer-summary-card h2 {
                    color: #f7f9fc !important;
                }

                html[data-theme="dark"] .transfer-checkout-form-card .transfers-eyebrow,
                html[data-theme="dark"] .transfer-summary-card .transfers-eyebrow {
                    color: #9b8cff !important;
                }

                html[data-theme="dark"] .transfer-form-field label {
                    color: #dce6f2 !important;
                }

                html[data-theme="dark"] .transfer-form-field input,
                html[data-theme="dark"] .transfer-form-field textarea {
                    background: #16263d !important;
                    border: 1px solid #3c526d !important;
                    color: #f5f8fc !important;
                    box-shadow: none !important;
                }

                html[data-theme="dark"] .transfer-form-field input::placeholder,
                html[data-theme="dark"] .transfer-form-field textarea::placeholder {
                    color: #8295ad !important;
                    opacity: 1 !important;
                }

                html[data-theme="dark"] .transfer-form-field input:focus,
                html[data-theme="dark"] .transfer-form-field textarea:focus {
                    border-color: #6e7fa0 !important;
                    outline: none !important;
                    box-shadow: 0 0 0 3px rgba(124, 109, 255, 0.10) !important;
                }

                html[data-theme="dark"] .transfer-checkout-note {
                    background: #16263d !important;
                    border: 1px solid #38506c !important;
                    color: #c9d5e4 !important;
                }

                html[data-theme="dark"] .transfer-checkout-note p {
                    color: #c9d5e4 !important;
                }

                html[data-theme="dark"] .transfer-checkout-note > span {
                    background: #2b3e5b !important;
                    color: #a99cff !important;
                }

                html[data-theme="dark"] .transfer-summary-price span,
                html[data-theme="dark"] .transfer-summary-route span,
                html[data-theme="dark"] .transfer-summary-details span,
                html[data-theme="dark"] .transfer-summary-return-details span,
                html[data-theme="dark"] .transfer-summary-total > span {
                    color: #91a3ba !important;
                }

                html[data-theme="dark"] .transfer-summary-price strong,
                html[data-theme="dark"] .transfer-summary-route strong,
                html[data-theme="dark"] .transfer-summary-details strong,
                html[data-theme="dark"] .transfer-summary-return-details strong,
                html[data-theme="dark"] .transfer-summary-total strong {
                    color: #f7f9fc !important;
                }

                html[data-theme="dark"] .transfer-summary-route,
                html[data-theme="dark"] .transfer-summary-details,
                html[data-theme="dark"] .transfer-summary-return,
                html[data-theme="dark"] .transfer-summary-divider,
                html[data-theme="dark"] .transfer-summary-total {
                    border-color: #2e435d !important;
                }

                html[data-theme="dark"] .transfer-summary-arrow {
                    background: #203752 !important;
                    color: #a99cff !important;
                }

                html[data-theme="dark"] .transfer-summary-back {
                    color: #9fb2c8 !important;
                }

                html[data-theme="dark"] .transfer-summary-back:hover {
                    color: #ffffff !important;
                }

                html[data-theme="dark"] .transfer-confirm-button {
                    background: #6d55e8 !important;
                    color: #ffffff !important;
                }

                html[data-theme="dark"] .transfer-confirm-button:hover {
                    background: #7a63ef !important;
                }

                /* Availability error in dark mode */
                html[data-theme="dark"] [role="alert"] {
                    background: #2a1b22 !important;
                    border-color: #6b3342 !important;
                    color: #ffd5dc !important;
                }

                html[data-theme="dark"] [role="alert"] strong {
                    color: #ff9eab !important;
                }
            `}</style>

        </main>
    );
}

export default function TransferCheckoutPage() {
    return (
        <Suspense fallback={null}>
            <TransferCheckoutContent />
        </Suspense>
    );
}
