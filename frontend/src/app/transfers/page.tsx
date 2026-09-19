"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "../../context/SettingsContext";
import { getTranslation } from "../../data/translations";
import { currencyInfo } from "../../data/currency";

import TransferLocationInput from "../../components/TransferLocationInput";

import {
    getTransferLocationsFromApi,
    type TransferLocation,
} from "../../services/transferLocationService";

import { isAuthenticated } from "../../services/authService";

type TransferType = "one-way" | "return";

type TransferOption = {
    id: number;
    titleKey:
        | "privateTransfer"
        | "comfortTransfer"
        | "familyTransfer";
    descriptionKey:
        | "privateDescription"
        | "comfortDescription"
        | "familyDescription";
    passengers: string;
    luggage: string;
    duration: string;
    price: number;
    icon: string;
};

const transferExtraTranslations: Record<
    string,
    Record<string, string>
> = {
    English: {
        privateDescription: "A comfortable private ride just for you and your group.",
        comfortDescription: "Extra space and comfort for a relaxed journey.",
        familyDescription: "More space for families, groups and extra luggage.",
        airportTransfers: "Airport & city transfers,",
        madeSimple: "made simple.",
        heroDescription: "Book a comfortable ride from the airport, hotel, or anywhere in the city.",
        yourJourneyStarts: "Your journey starts",
        beforeYouArrive: "before you arrive.",
        onTimePickup: "On-time pickup",
        onTimeDescription: "Your driver is ready when you are, so you can travel without unnecessary waiting.",
        travelComfortably: "Travel comfortably",
        comfortDescriptionBenefit: "Choose the vehicle that fits your trip, from couples to larger groups.",
        transferOptions: "TRANSFER OPTIONS",
        chooseTheRide: "Choose the ride",
        thatFits: "that fits your trip.",
        from: "from",
        selectTransfer: "Select transfer",
        howItWorks: "HOW IT WORKS",
        fromAirport: "From airport",
        toDoorstep: "to doorstep.",
        howDescription: "A simple transfer experience designed to remove one more thing from your travel planning.",
        tellUsWhere: "Tell us where",
        tellUsDescription: "Enter your pick-up and destination details.",
        chooseYourRide: "Choose your ride",
        chooseRideDescription: "Pick the vehicle that works best for your group.",
        enjoyJourney: "Enjoy the journey",
        enjoyDescription: "Meet your driver and get to your destination comfortably.",
        travelWith: "TRAVEL WITH STAYWAY",
        arriveRelaxed: "Arrive relaxed.",
        leaveRest: "Leave the rest to us.",
        exploreStays: "Explore stays",
        staywayTransfers: "STAYWAY TRANSFERS",
        invalidLocations: "Please select a valid pick-up location and destination.",
        sameCityError: "Pick-up and destination must be in the same city.",
        futureDateError: "Please select today or a future date for your transfer.",
        returnDateError: "Return date cannot be before the departure date.",
    },

    "Română": {
        privateDescription: "O călătorie privată confortabilă, doar pentru tine și grupul tău.",
        comfortDescription: "Mai mult spațiu și confort pentru o călătorie relaxată.",
        familyDescription: "Mai mult spațiu pentru familii, grupuri și bagaje suplimentare.",
        airportTransfers: "Transferuri de la aeroport și în oraș,",
        madeSimple: "fără complicații.",
        heroDescription: "Rezervă o mașină confortabilă de la aeroport, hotel sau orice altă adresă din oraș.",
        yourJourneyStarts: "Călătoria ta începe",
        beforeYouArrive: "înainte să ajungi.",
        onTimePickup: "Preluare la timp",
        onTimeDescription: "Șoferul tău este pregătit când ești și tu, fără așteptări inutile.",
        travelComfortably: "Călătorește confortabil",
        comfortDescriptionBenefit: "Alege vehiculul potrivit pentru călătoria ta, de la cupluri la grupuri mai mari.",
        transferOptions: "OPȚIUNI DE TRANSFER",
        chooseTheRide: "Alege transferul",
        thatFits: "potrivit pentru călătoria ta.",
        from: "de la",
        selectTransfer: "Selectează transferul",
        howItWorks: "CUM FUNCȚIONEAZĂ",
        fromAirport: "De la aeroport",
        toDoorstep: "până la destinație.",
        howDescription: "O experiență simplă de transfer, creată pentru a elimina încă un lucru din planificarea călătoriei.",
        tellUsWhere: "Spune-ne unde",
        tellUsDescription: "Introdu detaliile locului de preluare și ale destinației.",
        chooseYourRide: "Alege transferul",
        chooseRideDescription: "Alege vehiculul potrivit pentru grupul tău.",
        enjoyJourney: "Bucură-te de călătorie",
        enjoyDescription: "Întâlnește șoferul și ajungi confortabil la destinație.",
        travelWith: "CĂLĂTOREȘTE CU STAYWAY",
        arriveRelaxed: "Ajungi relaxat.",
        leaveRest: "De restul ne ocupăm noi.",
        exploreStays: "Explorează cazările",
        staywayTransfers: "TRANSFERURI STAYWAY",
        invalidLocations: "Selectează un loc de preluare și o destinație valide.",
        sameCityError: "Locul de preluare și destinația trebuie să fie în același oraș.",
        futureDateError: "Selectează data de astăzi sau o dată viitoare pentru transfer.",
        returnDateError: "Data întoarcerii nu poate fi înaintea datei plecării.",
    },

    "Русский": {
        privateDescription: "Комфортная частная поездка только для вас и вашей группы.",
        comfortDescription: "Больше пространства и комфорта для спокойной поездки.",
        familyDescription: "Больше места для семей, групп и дополнительного багажа.",
        airportTransfers: "Трансферы из аэропорта и по городу,",
        madeSimple: "просто и удобно.",
        heroDescription: "Закажите комфортную поездку из аэропорта, отеля или любой точки города.",
        yourJourneyStarts: "Ваше путешествие начинается",
        beforeYouArrive: "ещё до вашего прибытия.",
        onTimePickup: "Подача вовремя",
        onTimeDescription: "Водитель будет готов к вашему времени, чтобы вам не пришлось ждать.",
        travelComfortably: "Путешествуйте с комфортом",
        comfortDescriptionBenefit: "Выберите автомобиль, подходящий для вашей поездки — от пары до большой группы.",
        transferOptions: "ВАРИАНТЫ ТРАНСФЕРА",
        chooseTheRide: "Выберите поездку",
        thatFits: "которая подходит вам.",
        from: "от",
        selectTransfer: "Выбрать трансфер",
        howItWorks: "КАК ЭТО РАБОТАЕТ",
        fromAirport: "Из аэропорта",
        toDoorstep: "прямо к месту назначения.",
        howDescription: "Простой сервис трансфера, который делает планирование поездки ещё удобнее.",
        tellUsWhere: "Укажите маршрут",
        tellUsDescription: "Введите место подачи и пункт назначения.",
        chooseYourRide: "Выберите автомобиль",
        chooseRideDescription: "Выберите автомобиль, который лучше всего подходит вашей группе.",
        enjoyJourney: "Наслаждайтесь поездкой",
        enjoyDescription: "Встретьтесь с водителем и с комфортом доберитесь до места назначения.",
        travelWith: "ПУТЕШЕСТВУЙТЕ СО STAYWAY",
        arriveRelaxed: "Приезжайте без забот.",
        leaveRest: "Остальное оставьте нам.",
        exploreStays: "Посмотреть варианты проживания",
        staywayTransfers: "ТРАНСФЕРЫ STAYWAY",
        invalidLocations: "Выберите действительные место подачи и пункт назначения.",
        sameCityError: "Место подачи и пункт назначения должны находиться в одном городе.",
        futureDateError: "Выберите сегодняшнюю или будущую дату трансфера.",
        returnDateError: "Дата возвращения не может быть раньше даты отправления.",
    },

    "Українська": {
        privateDescription: "Комфортна приватна поїздка лише для вас і вашої групи.",
        comfortDescription: "Більше простору та комфорту для спокійної подорожі.",
        familyDescription: "Більше місця для сімей, груп і додаткового багажу.",
        airportTransfers: "Трансфери з аеропорту та містом,",
        madeSimple: "просто й зручно.",
        heroDescription: "Замовте комфортну поїздку з аеропорту, готелю або будь-якої точки міста.",
        yourJourneyStarts: "Ваша подорож починається",
        beforeYouArrive: "ще до вашого прибуття.",
        onTimePickup: "Подача вчасно",
        onTimeDescription: "Водій буде готовий у потрібний час, щоб вам не довелося чекати.",
        travelComfortably: "Подорожуйте комфортно",
        comfortDescriptionBenefit: "Оберіть автомобіль, який підходить для вашої поїздки — від пар до великих груп.",
        transferOptions: "ВАРІАНТИ ТРАНСФЕРУ",
        chooseTheRide: "Оберіть поїздку",
        thatFits: "що підходить вам.",
        from: "від",
        selectTransfer: "Обрати трансфер",
        howItWorks: "ЯК ЦЕ ПРАЦЮЄ",
        fromAirport: "З аеропорту",
        toDoorstep: "до місця призначення.",
        howDescription: "Простий сервіс трансферу, що робить планування подорожі ще зручнішим.",
        tellUsWhere: "Вкажіть маршрут",
        tellUsDescription: "Введіть місце посадки та пункт призначення.",
        chooseYourRide: "Оберіть автомобіль",
        chooseRideDescription: "Оберіть автомобіль, який найкраще підходить вашій групі.",
        enjoyJourney: "Насолоджуйтеся поїздкою",
        enjoyDescription: "Зустріньтеся з водієм і комфортно дістаньтеся до місця призначення.",
        travelWith: "ПОДОРОЖУЙТЕ ЗІ STAYWAY",
        arriveRelaxed: "Приїжджайте без турбот.",
        leaveRest: "Решту залиште нам.",
        exploreStays: "Переглянути помешкання",
        staywayTransfers: "ТРАНСФЕРИ STAYWAY",
        invalidLocations: "Оберіть коректне місце посадки та пункт призначення.",
        sameCityError: "Місце посадки та пункт призначення мають бути в одному місті.",
        futureDateError: "Оберіть сьогоднішню або майбутню дату трансферу.",
        returnDateError: "Дата повернення не може бути раніше дати відправлення.",
    },

    "Français": {
        privateDescription: "Un trajet privé confortable rien que pour vous et votre groupe.",
        comfortDescription: "Plus d’espace et de confort pour un trajet détendu.",
        familyDescription: "Plus d’espace pour les familles, les groupes et les bagages supplémentaires.",
        airportTransfers: "Transferts aéroport et ville,",
        madeSimple: "en toute simplicité.",
        heroDescription: "Réservez un trajet confortable depuis l’aéroport, l’hôtel ou n’importe où en ville.",
        yourJourneyStarts: "Votre voyage commence",
        beforeYouArrive: "avant votre arrivée.",
        onTimePickup: "Prise en charge à l’heure",
        onTimeDescription: "Votre chauffeur est prêt à l’heure prévue afin de vous éviter toute attente inutile.",
        travelComfortably: "Voyagez confortablement",
        comfortDescriptionBenefit: "Choisissez le véhicule adapté à votre trajet, du couple aux groupes plus nombreux.",
        transferOptions: "OPTIONS DE TRANSFERT",
        chooseTheRide: "Choisissez le trajet",
        thatFits: "adapté à votre voyage.",
        from: "à partir de",
        selectTransfer: "Choisir ce transfert",
        howItWorks: "COMMENT ÇA MARCHE",
        fromAirport: "De l’aéroport",
        toDoorstep: "jusqu’à votre destination.",
        howDescription: "Une expérience de transfert simple conçue pour faciliter encore davantage l’organisation de votre voyage.",
        tellUsWhere: "Indiquez-nous où",
        tellUsDescription: "Saisissez les détails de prise en charge et de destination.",
        chooseYourRide: "Choisissez votre véhicule",
        chooseRideDescription: "Choisissez le véhicule qui convient le mieux à votre groupe.",
        enjoyJourney: "Profitez du trajet",
        enjoyDescription: "Retrouvez votre chauffeur et rejoignez votre destination confortablement.",
        travelWith: "VOYAGEZ AVEC STAYWAY",
        arriveRelaxed: "Arrivez détendu.",
        leaveRest: "Nous nous occupons du reste.",
        exploreStays: "Découvrir les hébergements",
        staywayTransfers: "TRANSFERTS STAYWAY",
        invalidLocations: "Veuillez sélectionner un lieu de prise en charge et une destination valides.",
        sameCityError: "Le lieu de prise en charge et la destination doivent se trouver dans la même ville.",
        futureDateError: "Veuillez sélectionner aujourd’hui ou une date future pour votre transfert.",
        returnDateError: "La date de retour ne peut pas être antérieure à la date de départ.",
    },

    "Español": {
        privateDescription: "Un traslado privado y cómodo solo para ti y tu grupo.",
        comfortDescription: "Más espacio y comodidad para un viaje relajado.",
        familyDescription: "Más espacio para familias, grupos y equipaje adicional.",
        airportTransfers: "Traslados de aeropuerto y ciudad,",
        madeSimple: "de forma sencilla.",
        heroDescription: "Reserva un viaje cómodo desde el aeropuerto, el hotel o cualquier punto de la ciudad.",
        yourJourneyStarts: "Tu viaje comienza",
        beforeYouArrive: "antes de que llegues.",
        onTimePickup: "Recogida puntual",
        onTimeDescription: "Tu conductor estará listo a la hora acordada para que no tengas que esperar.",
        travelComfortably: "Viaja cómodamente",
        comfortDescriptionBenefit: "Elige el vehículo que se adapte a tu viaje, desde parejas hasta grupos grandes.",
        transferOptions: "OPCIONES DE TRASLADO",
        chooseTheRide: "Elige el traslado",
        thatFits: "que se adapte a tu viaje.",
        from: "desde",
        selectTransfer: "Seleccionar traslado",
        howItWorks: "CÓMO FUNCIONA",
        fromAirport: "Desde el aeropuerto",
        toDoorstep: "hasta tu destino.",
        howDescription: "Una experiencia de traslado sencilla diseñada para facilitar aún más la planificación de tu viaje.",
        tellUsWhere: "Dinos adónde",
        tellUsDescription: "Introduce los datos del lugar de recogida y del destino.",
        chooseYourRide: "Elige tu vehículo",
        chooseRideDescription: "Elige el vehículo que mejor se adapte a tu grupo.",
        enjoyJourney: "Disfruta del viaje",
        enjoyDescription: "Encuentra a tu conductor y llega cómodamente a tu destino.",
        travelWith: "VIAJA CON STAYWAY",
        arriveRelaxed: "Llega relajado.",
        leaveRest: "Déjanos el resto.",
        exploreStays: "Explorar alojamientos",
        staywayTransfers: "TRASLADOS STAYWAY",
        invalidLocations: "Selecciona un lugar de recogida y un destino válidos.",
        sameCityError: "El lugar de recogida y el destino deben estar en la misma ciudad.",
        futureDateError: "Selecciona hoy o una fecha futura para tu traslado.",
        returnDateError: "La fecha de regreso no puede ser anterior a la fecha de salida.",
    },

    Deutsch: {
        privateDescription: "Eine komfortable Privatfahrt nur für Sie und Ihre Gruppe.",
        comfortDescription: "Mehr Platz und Komfort für eine entspannte Fahrt.",
        familyDescription: "Mehr Platz für Familien, Gruppen und zusätzliches Gepäck.",
        airportTransfers: "Flughafen- und Stadttransfers,",
        madeSimple: "ganz einfach.",
        heroDescription: "Buchen Sie eine komfortable Fahrt vom Flughafen, Hotel oder von jedem Ort in der Stadt.",
        yourJourneyStarts: "Ihre Reise beginnt",
        beforeYouArrive: "noch vor Ihrer Ankunft.",
        onTimePickup: "Pünktliche Abholung",
        onTimeDescription: "Ihr Fahrer ist zur vereinbarten Zeit bereit, damit Sie nicht unnötig warten müssen.",
        travelComfortably: "Komfortabel reisen",
        comfortDescriptionBenefit: "Wählen Sie das passende Fahrzeug für Ihre Reise, von Paaren bis zu größeren Gruppen.",
        transferOptions: "TRANSFEROPTIONEN",
        chooseTheRide: "Wählen Sie die Fahrt",
        thatFits: "die zu Ihrer Reise passt.",
        from: "ab",
        selectTransfer: "Transfer auswählen",
        howItWorks: "SO FUNKTIONIERT ES",
        fromAirport: "Vom Flughafen",
        toDoorstep: "bis zu Ihrem Ziel.",
        howDescription: "Ein einfacher Transferservice, der Ihre Reiseplanung noch unkomplizierter macht.",
        tellUsWhere: "Sagen Sie uns wohin",
        tellUsDescription: "Geben Sie Abholort und Ziel ein.",
        chooseYourRide: "Fahrzeug auswählen",
        chooseRideDescription: "Wählen Sie das Fahrzeug, das am besten zu Ihrer Gruppe passt.",
        enjoyJourney: "Genießen Sie die Fahrt",
        enjoyDescription: "Treffen Sie Ihren Fahrer und erreichen Sie Ihr Ziel bequem.",
        travelWith: "REISEN SIE MIT STAYWAY",
        arriveRelaxed: "Entspannt ankommen.",
        leaveRest: "Den Rest übernehmen wir.",
        exploreStays: "Unterkünfte entdecken",
        staywayTransfers: "STAYWAY TRANSFERS",
        invalidLocations: "Bitte wählen Sie einen gültigen Abholort und ein gültiges Ziel.",
        sameCityError: "Abholort und Ziel müssen sich in derselben Stadt befinden.",
        futureDateError: "Bitte wählen Sie heute oder ein zukünftiges Datum für Ihren Transfer.",
        returnDateError: "Das Rückreisedatum darf nicht vor dem Abreisedatum liegen.",
    },

    Italiano: {
        privateDescription: "Un trasferimento privato e confortevole solo per te e il tuo gruppo.",
        comfortDescription: "Più spazio e comfort per un viaggio rilassante.",
        familyDescription: "Più spazio per famiglie, gruppi e bagagli extra.",
        airportTransfers: "Transfer aeroporto e città,",
        madeSimple: "senza complicazioni.",
        heroDescription: "Prenota un viaggio confortevole dall’aeroporto, dall’hotel o da qualsiasi punto della città.",
        yourJourneyStarts: "Il tuo viaggio inizia",
        beforeYouArrive: "prima del tuo arrivo.",
        onTimePickup: "Prelievo puntuale",
        onTimeDescription: "Il tuo autista sarà pronto all’orario stabilito, così non dovrai aspettare inutilmente.",
        travelComfortably: "Viaggia comodamente",
        comfortDescriptionBenefit: "Scegli il veicolo adatto al tuo viaggio, dalle coppie ai gruppi più numerosi.",
        transferOptions: "OPZIONI DI TRANSFER",
        chooseTheRide: "Scegli il transfer",
        thatFits: "adatto al tuo viaggio.",
        from: "da",
        selectTransfer: "Seleziona transfer",
        howItWorks: "COME FUNZIONA",
        fromAirport: "Dall’aeroporto",
        toDoorstep: "fino alla destinazione.",
        howDescription: "Un’esperienza di transfer semplice, pensata per rendere ancora più facile la pianificazione del viaggio.",
        tellUsWhere: "Dicci dove",
        tellUsDescription: "Inserisci i dettagli del punto di prelievo e della destinazione.",
        chooseYourRide: "Scegli il tuo veicolo",
        chooseRideDescription: "Scegli il veicolo più adatto al tuo gruppo.",
        enjoyJourney: "Goditi il viaggio",
        enjoyDescription: "Incontra il tuo autista e raggiungi comodamente la destinazione.",
        travelWith: "VIAGGIA CON STAYWAY",
        arriveRelaxed: "Arriva rilassato.",
        leaveRest: "Al resto pensiamo noi.",
        exploreStays: "Esplora gli alloggi",
        staywayTransfers: "TRANSFER STAYWAY",
        invalidLocations: "Seleziona un punto di prelievo e una destinazione validi.",
        sameCityError: "Il punto di prelievo e la destinazione devono trovarsi nella stessa città.",
        futureDateError: "Seleziona la data odierna o una data futura per il transfer.",
        returnDateError: "La data di ritorno non può essere precedente alla data di partenza.",
    },

    "Português": {
        privateDescription: "Uma viagem privada confortável só para si e para o seu grupo.",
        comfortDescription: "Mais espaço e conforto para uma viagem tranquila.",
        familyDescription: "Mais espaço para famílias, grupos e bagagem extra.",
        airportTransfers: "Transfers de aeroporto e cidade,",
        madeSimple: "sem complicações.",
        heroDescription: "Reserve uma viagem confortável a partir do aeroporto, hotel ou qualquer ponto da cidade.",
        yourJourneyStarts: "A sua viagem começa",
        beforeYouArrive: "antes de chegar.",
        onTimePickup: "Recolha pontual",
        onTimeDescription: "O seu motorista estará pronto à hora marcada para evitar esperas desnecessárias.",
        travelComfortably: "Viaje confortavelmente",
        comfortDescriptionBenefit: "Escolha o veículo adequado à sua viagem, desde casais a grupos maiores.",
        transferOptions: "OPÇÕES DE TRANSFER",
        chooseTheRide: "Escolha o transfer",
        thatFits: "adequado à sua viagem.",
        from: "desde",
        selectTransfer: "Selecionar transfer",
        howItWorks: "COMO FUNCIONA",
        fromAirport: "Do aeroporto",
        toDoorstep: "até ao destino.",
        howDescription: "Uma experiência de transfer simples, pensada para tornar o planeamento da sua viagem ainda mais fácil.",
        tellUsWhere: "Diga-nos para onde",
        tellUsDescription: "Introduza os detalhes do local de recolha e do destino.",
        chooseYourRide: "Escolha o seu veículo",
        chooseRideDescription: "Escolha o veículo que melhor se adapta ao seu grupo.",
        enjoyJourney: "Aproveite a viagem",
        enjoyDescription: "Encontre o seu motorista e chegue confortavelmente ao seu destino.",
        travelWith: "VIAJE COM A STAYWAY",
        arriveRelaxed: "Chegue relaxado.",
        leaveRest: "Deixe o resto connosco.",
        exploreStays: "Explorar alojamentos",
        staywayTransfers: "TRANSFERS STAYWAY",
        invalidLocations: "Selecione um local de recolha e um destino válidos.",
        sameCityError: "O local de recolha e o destino devem estar na mesma cidade.",
        futureDateError: "Selecione hoje ou uma data futura para o seu transfer.",
        returnDateError: "A data de regresso não pode ser anterior à data de partida.",
    },

    Nederlands: {
        privateDescription: "Een comfortabele privérit speciaal voor jou en je groep.",
        comfortDescription: "Extra ruimte en comfort voor een ontspannen rit.",
        familyDescription: "Meer ruimte voor gezinnen, groepen en extra bagage.",
        airportTransfers: "Luchthaven- en stadstransfers,",
        madeSimple: "eenvoudig geregeld.",
        heroDescription: "Boek een comfortabele rit vanaf de luchthaven, het hotel of elke plek in de stad.",
        yourJourneyStarts: "Je reis begint",
        beforeYouArrive: "nog vóór je aankomt.",
        onTimePickup: "Stipt ophalen",
        onTimeDescription: "Je chauffeur staat op het afgesproken tijdstip klaar, zodat je niet onnodig hoeft te wachten.",
        travelComfortably: "Reis comfortabel",
        comfortDescriptionBenefit: "Kies het voertuig dat bij je reis past, van koppels tot grotere groepen.",
        transferOptions: "TRANSFEROPTIES",
        chooseTheRide: "Kies de rit",
        thatFits: "die bij je reis past.",
        from: "vanaf",
        selectTransfer: "Transfer kiezen",
        howItWorks: "HOE HET WERKT",
        fromAirport: "Van de luchthaven",
        toDoorstep: "tot je bestemming.",
        howDescription: "Een eenvoudige transferervaring die je reisplanning nog gemakkelijker maakt.",
        tellUsWhere: "Vertel ons waarheen",
        tellUsDescription: "Vul de gegevens van je ophaallocatie en bestemming in.",
        chooseYourRide: "Kies je voertuig",
        chooseRideDescription: "Kies het voertuig dat het beste bij je groep past.",
        enjoyJourney: "Geniet van de rit",
        enjoyDescription: "Ontmoet je chauffeur en bereik je bestemming comfortabel.",
        travelWith: "REIS MET STAYWAY",
        arriveRelaxed: "Kom ontspannen aan.",
        leaveRest: "Laat de rest aan ons over.",
        exploreStays: "Verblijven ontdekken",
        staywayTransfers: "STAYWAY TRANSFERS",
        invalidLocations: "Selecteer een geldige ophaallocatie en bestemming.",
        sameCityError: "De ophaallocatie en bestemming moeten in dezelfde stad liggen.",
        futureDateError: "Selecteer vandaag of een toekomstige datum voor je transfer.",
        returnDateError: "De retourdatum mag niet vóór de vertrekdatum liggen.",
    },

    Polski: {
        privateDescription: "Komfortowy prywatny przejazd tylko dla Ciebie i Twojej grupy.",
        comfortDescription: "Więcej przestrzeni i komfortu podczas spokojnej podróży.",
        familyDescription: "Więcej miejsca dla rodzin, grup i dodatkowego bagażu.",
        airportTransfers: "Transfery lotniskowe i miejskie,",
        madeSimple: "prosto i wygodnie.",
        heroDescription: "Zarezerwuj wygodny przejazd z lotniska, hotelu lub dowolnego miejsca w mieście.",
        yourJourneyStarts: "Twoja podróż zaczyna się",
        beforeYouArrive: "jeszcze przed przyjazdem.",
        onTimePickup: "Punktualny odbiór",
        onTimeDescription: "Kierowca będzie gotowy o ustalonej porze, aby uniknąć niepotrzebnego oczekiwania.",
        travelComfortably: "Podróżuj komfortowo",
        comfortDescriptionBenefit: "Wybierz pojazd dopasowany do swojej podróży, od par po większe grupy.",
        transferOptions: "OPCJE TRANSFERU",
        chooseTheRide: "Wybierz przejazd",
        thatFits: "dopasowany do Twojej podróży.",
        from: "od",
        selectTransfer: "Wybierz transfer",
        howItWorks: "JAK TO DZIAŁA",
        fromAirport: "Z lotniska",
        toDoorstep: "aż do celu.",
        howDescription: "Prosty transfer, który ułatwia planowanie podróży.",
        tellUsWhere: "Powiedz nam dokąd",
        tellUsDescription: "Wprowadź miejsce odbioru i miejsce docelowe.",
        chooseYourRide: "Wybierz pojazd",
        chooseRideDescription: "Wybierz pojazd najlepiej dopasowany do Twojej grupy.",
        enjoyJourney: "Ciesz się podróżą",
        enjoyDescription: "Spotkaj się z kierowcą i wygodnie dotrzyj do celu.",
        travelWith: "PODRÓŻUJ ZE STAYWAY",
        arriveRelaxed: "Dotrzyj bez stresu.",
        leaveRest: "Resztą zajmiemy się my.",
        exploreStays: "Odkryj noclegi",
        staywayTransfers: "TRANSFERY STAYWAY",
        invalidLocations: "Wybierz prawidłowe miejsce odbioru i miejsce docelowe.",
        sameCityError: "Miejsce odbioru i miejsce docelowe muszą znajdować się w tym samym mieście.",
        futureDateError: "Wybierz dzisiejszą lub przyszłą datę transferu.",
        returnDateError: "Data powrotu nie może być wcześniejsza niż data wyjazdu.",
    },

    "Čeština": {
        privateDescription: "Pohodlná soukromá jízda jen pro vás a vaši skupinu.",
        comfortDescription: "Více prostoru a pohodlí pro klidnou cestu.",
        familyDescription: "Více místa pro rodiny, skupiny a další zavazadla.",
        airportTransfers: "Letištní a městské transfery,",
        madeSimple: "jednoduše.",
        heroDescription: "Rezervujte si pohodlnou jízdu z letiště, hotelu nebo odkudkoli ve městě.",
        yourJourneyStarts: "Vaše cesta začíná",
        beforeYouArrive: "ještě před příjezdem.",
        onTimePickup: "Vyzvednutí včas",
        onTimeDescription: "Řidič bude připraven v domluvený čas, takže nebudete zbytečně čekat.",
        travelComfortably: "Cestujte pohodlně",
        comfortDescriptionBenefit: "Vyberte si vozidlo vhodné pro vaši cestu, od párů po větší skupiny.",
        transferOptions: "MOŽNOSTI TRANSFERU",
        chooseTheRide: "Vyberte si jízdu",
        thatFits: "která vám vyhovuje.",
        from: "od",
        selectTransfer: "Vybrat transfer",
        howItWorks: "JAK TO FUNGUJE",
        fromAirport: "Z letiště",
        toDoorstep: "až do cíle.",
        howDescription: "Jednoduchý transfer, který vám usnadní plánování cesty.",
        tellUsWhere: "Řekněte nám kam",
        tellUsDescription: "Zadejte místo vyzvednutí a cíl.",
        chooseYourRide: "Vyberte si vozidlo",
        chooseRideDescription: "Vyberte vozidlo, které nejlépe vyhovuje vaší skupině.",
        enjoyJourney: "Užijte si cestu",
        enjoyDescription: "Setkejte se s řidičem a pohodlně dojeďte do cíle.",
        travelWith: "CESTUJTE SE STAYWAY",
        arriveRelaxed: "Přijeďte odpočatí.",
        leaveRest: "Zbytek nechte na nás.",
        exploreStays: "Prozkoumat ubytování",
        staywayTransfers: "TRANSFERY STAYWAY",
        invalidLocations: "Vyberte platné místo vyzvednutí a cíl.",
        sameCityError: "Místo vyzvednutí a cíl musí být ve stejném městě.",
        futureDateError: "Vyberte dnešní nebo budoucí datum transferu.",
        returnDateError: "Datum návratu nesmí být před datem odjezdu.",
    },

    "Ελληνικά": {
        privateDescription: "Μια άνετη ιδιωτική διαδρομή μόνο για εσάς και την παρέα σας.",
        comfortDescription: "Περισσότερος χώρος και άνεση για ένα χαλαρό ταξίδι.",
        familyDescription: "Περισσότερος χώρος για οικογένειες, ομάδες και επιπλέον αποσκευές.",
        airportTransfers: "Μεταφορές αεροδρομίου και πόλης,",
        madeSimple: "εύκολα και απλά.",
        heroDescription: "Κλείστε μια άνετη διαδρομή από το αεροδρόμιο, το ξενοδοχείο ή οποιοδήποτε σημείο της πόλης.",
        yourJourneyStarts: "Το ταξίδι σας ξεκινά",
        beforeYouArrive: "πριν ακόμη φτάσετε.",
        onTimePickup: "Παραλαβή στην ώρα της",
        onTimeDescription: "Ο οδηγός σας θα είναι έτοιμος στην καθορισμένη ώρα, χωρίς περιττή αναμονή.",
        travelComfortably: "Ταξιδέψτε άνετα",
        comfortDescriptionBenefit: "Επιλέξτε το όχημα που ταιριάζει στο ταξίδι σας, από ζευγάρια έως μεγαλύτερες ομάδες.",
        transferOptions: "ΕΠΙΛΟΓΕΣ ΜΕΤΑΦΟΡΑΣ",
        chooseTheRide: "Επιλέξτε τη διαδρομή",
        thatFits: "που σας ταιριάζει.",
        from: "από",
        selectTransfer: "Επιλογή μεταφοράς",
        howItWorks: "ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ",
        fromAirport: "Από το αεροδρόμιο",
        toDoorstep: "μέχρι τον προορισμό σας.",
        howDescription: "Μια απλή εμπειρία μεταφοράς που κάνει τον προγραμματισμό του ταξιδιού ακόμη πιο εύκολο.",
        tellUsWhere: "Πείτε μας πού",
        tellUsDescription: "Εισαγάγετε τα στοιχεία παραλαβής και προορισμού.",
        chooseYourRide: "Επιλέξτε το όχημά σας",
        chooseRideDescription: "Επιλέξτε το όχημα που ταιριάζει καλύτερα στην ομάδα σας.",
        enjoyJourney: "Απολαύστε τη διαδρομή",
        enjoyDescription: "Συναντήστε τον οδηγό σας και φτάστε άνετα στον προορισμό σας.",
        travelWith: "ΤΑΞΙΔΕΨΤΕ ΜΕ ΤΟ STAYWAY",
        arriveRelaxed: "Φτάστε χαλαροί.",
        leaveRest: "Αφήστε τα υπόλοιπα σε εμάς.",
        exploreStays: "Εξερευνήστε καταλύματα",
        staywayTransfers: "ΜΕΤΑΦΟΡΕΣ STAYWAY",
        invalidLocations: "Επιλέξτε έγκυρο σημείο παραλαβής και προορισμό.",
        sameCityError: "Το σημείο παραλαβής και ο προορισμός πρέπει να βρίσκονται στην ίδια πόλη.",
        futureDateError: "Επιλέξτε τη σημερινή ή μια μελλοντική ημερομηνία για τη μεταφορά.",
        returnDateError: "Η ημερομηνία επιστροφής δεν μπορεί να είναι πριν από την ημερομηνία αναχώρησης.",
    },

    "Türkçe": {
        privateDescription: "Yalnızca siz ve grubunuz için konforlu bir özel yolculuk.",
        comfortDescription: "Rahat bir yolculuk için daha fazla alan ve konfor.",
        familyDescription: "Aileler, gruplar ve ekstra bagaj için daha fazla alan.",
        airportTransfers: "Havalimanı ve şehir transferleri,",
        madeSimple: "artık çok kolay.",
        heroDescription: "Havalimanından, otelden veya şehirdeki herhangi bir noktadan konforlu bir yolculuk rezervasyonu yapın.",
        yourJourneyStarts: "Yolculuğunuz",
        beforeYouArrive: "siz varmadan başlar.",
        onTimePickup: "Zamanında karşılama",
        onTimeDescription: "Sürücünüz belirlenen saatte hazır olur, böylece gereksiz yere beklemezsiniz.",
        travelComfortably: "Konforlu seyahat edin",
        comfortDescriptionBenefit: "Çiftlerden daha büyük gruplara kadar yolculuğunuza uygun aracı seçin.",
        transferOptions: "TRANSFER SEÇENEKLERİ",
        chooseTheRide: "Yolculuğunuzu seçin",
        thatFits: "seyahatinize uygun olsun.",
        from: "başlangıç",
        selectTransfer: "Transfer seç",
        howItWorks: "NASIL ÇALIŞIR",
        fromAirport: "Havalimanından",
        toDoorstep: "varış noktanıza kadar.",
        howDescription: "Seyahat planlamanızı kolaylaştırmak için tasarlanmış basit bir transfer deneyimi.",
        tellUsWhere: "Nereye gideceğinizi söyleyin",
        tellUsDescription: "Alış ve varış noktası bilgilerini girin.",
        chooseYourRide: "Aracınızı seçin",
        chooseRideDescription: "Grubunuza en uygun aracı seçin.",
        enjoyJourney: "Yolculuğun keyfini çıkarın",
        enjoyDescription: "Sürücünüzle buluşun ve varış noktanıza konforla ulaşın.",
        travelWith: "STAYWAY İLE SEYAHAT EDİN",
        arriveRelaxed: "Rahatça varın.",
        leaveRest: "Gerisini bize bırakın.",
        exploreStays: "Konaklamaları keşfet",
        staywayTransfers: "STAYWAY TRANSFERLERİ",
        invalidLocations: "Geçerli bir alış noktası ve varış noktası seçin.",
        sameCityError: "Alış noktası ve varış noktası aynı şehirde olmalıdır.",
        futureDateError: "Transferiniz için bugünü veya gelecekteki bir tarihi seçin.",
        returnDateError: "Dönüş tarihi, gidiş tarihinden önce olamaz.",
    },

    Norsk: {
        privateDescription: "En komfortabel privat tur bare for deg og gruppen din.",
        comfortDescription: "Ekstra plass og komfort for en avslappet reise.",
        familyDescription: "Mer plass for familier, grupper og ekstra bagasje.",
        airportTransfers: "Flyplass- og bytransport,",
        madeSimple: "gjort enkelt.",
        heroDescription: "Bestill en komfortabel tur fra flyplassen, hotellet eller hvor som helst i byen.",
        yourJourneyStarts: "Reisen din starter",
        beforeYouArrive: "før du ankommer.",
        onTimePickup: "Henting til avtalt tid",
        onTimeDescription: "Sjåføren din er klar til avtalt tid, slik at du slipper unødvendig venting.",
        travelComfortably: "Reis komfortabelt",
        comfortDescriptionBenefit: "Velg kjøretøyet som passer reisen din, fra par til større grupper.",
        transferOptions: "TRANSFERALTERNATIVER",
        chooseTheRide: "Velg turen",
        thatFits: "som passer reisen din.",
        from: "fra",
        selectTransfer: "Velg transfer",
        howItWorks: "SLIK FUNGERER DET",
        fromAirport: "Fra flyplassen",
        toDoorstep: "til destinasjonen.",
        howDescription: "En enkel transferopplevelse som gjør reiseplanleggingen enda lettere.",
        tellUsWhere: "Fortell oss hvor",
        tellUsDescription: "Oppgi hente- og destinasjonsdetaljer.",
        chooseYourRide: "Velg kjøretøy",
        chooseRideDescription: "Velg kjøretøyet som passer gruppen din best.",
        enjoyJourney: "Nyt reisen",
        enjoyDescription: "Møt sjåføren din og kom komfortabelt frem.",
        travelWith: "REIS MED STAYWAY",
        arriveRelaxed: "Ankom avslappet.",
        leaveRest: "La oss ta oss av resten.",
        exploreStays: "Utforsk overnattingssteder",
        staywayTransfers: "STAYWAY TRANSFER",
        invalidLocations: "Velg et gyldig hentested og en gyldig destinasjon.",
        sameCityError: "Hentested og destinasjon må være i samme by.",
        futureDateError: "Velg dagens dato eller en fremtidig dato for transferen.",
        returnDateError: "Returdatoen kan ikke være før avreisedatoen.",
    },

    Svenska: {
        privateDescription: "En bekväm privat resa bara för dig och din grupp.",
        comfortDescription: "Extra utrymme och komfort för en avkopplande resa.",
        familyDescription: "Mer utrymme för familjer, grupper och extra bagage.",
        airportTransfers: "Flygplats- och stadstransfer,",
        madeSimple: "enkelt och smidigt.",
        heroDescription: "Boka en bekväm resa från flygplatsen, hotellet eller var som helst i staden.",
        yourJourneyStarts: "Din resa börjar",
        beforeYouArrive: "innan du anländer.",
        onTimePickup: "Hämtning i tid",
        onTimeDescription: "Din förare är redo på avtalad tid så att du slipper onödig väntan.",
        travelComfortably: "Res bekvämt",
        comfortDescriptionBenefit: "Välj fordonet som passar din resa, från par till större grupper.",
        transferOptions: "TRANSFERALTERNATIV",
        chooseTheRide: "Välj resan",
        thatFits: "som passar din resa.",
        from: "från",
        selectTransfer: "Välj transfer",
        howItWorks: "SÅ FUNGERAR DET",
        fromAirport: "Från flygplatsen",
        toDoorstep: "till din destination.",
        howDescription: "En enkel transferupplevelse som gör reseplaneringen ännu smidigare.",
        tellUsWhere: "Berätta vart",
        tellUsDescription: "Ange upphämtningsplats och destination.",
        chooseYourRide: "Välj ditt fordon",
        chooseRideDescription: "Välj fordonet som passar din grupp bäst.",
        enjoyJourney: "Njut av resan",
        enjoyDescription: "Möt din förare och ta dig bekvämt till destinationen.",
        travelWith: "RES MED STAYWAY",
        arriveRelaxed: "Anländ avslappnad.",
        leaveRest: "Låt oss sköta resten.",
        exploreStays: "Utforska boenden",
        staywayTransfers: "STAYWAY TRANSFER",
        invalidLocations: "Välj en giltig upphämtningsplats och destination.",
        sameCityError: "Upphämtningsplats och destination måste vara i samma stad.",
        futureDateError: "Välj dagens datum eller ett framtida datum för transfern.",
        returnDateError: "Returdatumet får inte vara före avresedatumet.",
    },

    Dansk: {
        privateDescription: "En komfortabel privat tur kun for dig og din gruppe.",
        comfortDescription: "Ekstra plads og komfort til en afslappet rejse.",
        familyDescription: "Mere plads til familier, grupper og ekstra bagage.",
        airportTransfers: "Lufthavns- og bytransfer,",
        madeSimple: "gjort enkelt.",
        heroDescription: "Book en komfortabel tur fra lufthavnen, hotellet eller hvor som helst i byen.",
        yourJourneyStarts: "Din rejse begynder",
        beforeYouArrive: "før du ankommer.",
        onTimePickup: "Afhentning til tiden",
        onTimeDescription: "Din chauffør er klar til aftalt tid, så du undgår unødig ventetid.",
        travelComfortably: "Rejs komfortabelt",
        comfortDescriptionBenefit: "Vælg det køretøj, der passer til din rejse, fra par til større grupper.",
        transferOptions: "TRANSFERMULIGHEDER",
        chooseTheRide: "Vælg turen",
        thatFits: "der passer til din rejse.",
        from: "fra",
        selectTransfer: "Vælg transfer",
        howItWorks: "SÅDAN FUNGERER DET",
        fromAirport: "Fra lufthavnen",
        toDoorstep: "til din destination.",
        howDescription: "En enkel transferoplevelse, der gør planlægningen af din rejse endnu lettere.",
        tellUsWhere: "Fortæl os hvor",
        tellUsDescription: "Indtast oplysninger om afhentning og destination.",
        chooseYourRide: "Vælg dit køretøj",
        chooseRideDescription: "Vælg det køretøj, der passer bedst til din gruppe.",
        enjoyJourney: "Nyd rejsen",
        enjoyDescription: "Mød din chauffør og kom komfortabelt frem.",
        travelWith: "REJS MED STAYWAY",
        arriveRelaxed: "Ankom afslappet.",
        leaveRest: "Lad os klare resten.",
        exploreStays: "Udforsk overnatningssteder",
        staywayTransfers: "STAYWAY TRANSFER",
        invalidLocations: "Vælg et gyldigt afhentningssted og en gyldig destination.",
        sameCityError: "Afhentningssted og destination skal være i samme by.",
        futureDateError: "Vælg i dag eller en fremtidig dato for din transfer.",
        returnDateError: "Returdatoen kan ikke være før afrejsedatoen.",
    },

    Suomi: {
        privateDescription: "Mukava yksityiskyyti vain sinulle ja ryhmällesi.",
        comfortDescription: "Lisää tilaa ja mukavuutta rentoon matkaan.",
        familyDescription: "Enemmän tilaa perheille, ryhmille ja ylimääräisille matkatavaroille.",
        airportTransfers: "Lentokenttä- ja kaupunkikuljetukset,",
        madeSimple: "helposti.",
        heroDescription: "Varaa mukava kyyti lentokentältä, hotellilta tai mistä tahansa kaupungissa.",
        yourJourneyStarts: "Matkasi alkaa",
        beforeYouArrive: "jo ennen saapumistasi.",
        onTimePickup: "Nouto ajallaan",
        onTimeDescription: "Kuljettajasi on valmiina sovittuna aikana, joten sinun ei tarvitse odottaa turhaan.",
        travelComfortably: "Matkusta mukavasti",
        comfortDescriptionBenefit: "Valitse matkallesi sopiva ajoneuvo pareista suurempiin ryhmiin.",
        transferOptions: "KULJETUSVAIHTOEHDOT",
        chooseTheRide: "Valitse kyyti",
        thatFits: "joka sopii matkallesi.",
        from: "alkaen",
        selectTransfer: "Valitse kuljetus",
        howItWorks: "NÄIN SE TOIMII",
        fromAirport: "Lentokentältä",
        toDoorstep: "määränpäähän asti.",
        howDescription: "Yksinkertainen kuljetuspalvelu, joka helpottaa matkasi suunnittelua.",
        tellUsWhere: "Kerro minne",
        tellUsDescription: "Anna nouto- ja määränpäätiedot.",
        chooseYourRide: "Valitse ajoneuvo",
        chooseRideDescription: "Valitse ryhmällesi parhaiten sopiva ajoneuvo.",
        enjoyJourney: "Nauti matkasta",
        enjoyDescription: "Tapaa kuljettajasi ja saavu mukavasti määränpäähän.",
        travelWith: "MATKUSTA STAYWAYN KANSSA",
        arriveRelaxed: "Saavu rennosti.",
        leaveRest: "Jätä loput meille.",
        exploreStays: "Tutustu majoituksiin",
        staywayTransfers: "STAYWAY-KULJETUKSET",
        invalidLocations: "Valitse kelvollinen noutopaikka ja määränpää.",
        sameCityError: "Noutopaikan ja määränpään on oltava samassa kaupungissa.",
        futureDateError: "Valitse kuljetukselle tämä päivä tai tuleva päivämäärä.",
        returnDateError: "Paluupäivä ei voi olla ennen lähtöpäivää.",
    },

    "Slovenčina": {
        privateDescription: "Pohodlná súkromná jazda len pre vás a vašu skupinu.",
        comfortDescription: "Viac priestoru a pohodlia pre pokojnú cestu.",
        familyDescription: "Viac miesta pre rodiny, skupiny a ďalšiu batožinu.",
        airportTransfers: "Letiskové a mestské transfery,",
        madeSimple: "jednoducho.",
        heroDescription: "Rezervujte si pohodlnú jazdu z letiska, hotela alebo odkiaľkoľvek v meste.",
        yourJourneyStarts: "Vaša cesta sa začína",
        beforeYouArrive: "ešte pred príchodom.",
        onTimePickup: "Vyzdvihnutie načas",
        onTimeDescription: "Vodič bude pripravený v dohodnutom čase, aby ste nemuseli zbytočne čakať.",
        travelComfortably: "Cestujte pohodlne",
        comfortDescriptionBenefit: "Vyberte si vozidlo vhodné pre vašu cestu, od párov po väčšie skupiny.",
        transferOptions: "MOŽNOSTI TRANSFERU",
        chooseTheRide: "Vyberte si jazdu",
        thatFits: "ktorá vám vyhovuje.",
        from: "od",
        selectTransfer: "Vybrať transfer",
        howItWorks: "AKO TO FUNGUJE",
        fromAirport: "Z letiska",
        toDoorstep: "až do cieľa.",
        howDescription: "Jednoduchý transfer, ktorý uľahčuje plánovanie vašej cesty.",
        tellUsWhere: "Povedzte nám kam",
        tellUsDescription: "Zadajte miesto vyzdvihnutia a cieľ.",
        chooseYourRide: "Vyberte si vozidlo",
        chooseRideDescription: "Vyberte vozidlo, ktoré najlepšie vyhovuje vašej skupine.",
        enjoyJourney: "Užite si cestu",
        enjoyDescription: "Stretnite sa s vodičom a pohodlne dorazte do cieľa.",
        travelWith: "CESTUJTE SO STAYWAY",
        arriveRelaxed: "Príďte oddýchnutí.",
        leaveRest: "Zvyšok nechajte na nás.",
        exploreStays: "Preskúmať ubytovanie",
        staywayTransfers: "TRANSFERY STAYWAY",
        invalidLocations: "Vyberte platné miesto vyzdvihnutia a cieľ.",
        sameCityError: "Miesto vyzdvihnutia a cieľ musia byť v rovnakom meste.",
        futureDateError: "Vyberte dnešný alebo budúci dátum transferu.",
        returnDateError: "Dátum návratu nemôže byť pred dátumom odchodu.",
    },

    Magyar: {
        privateDescription: "Kényelmes privát utazás csak Önnek és csoportjának.",
        comfortDescription: "Több hely és kényelem a nyugodt utazáshoz.",
        familyDescription: "Több hely családoknak, csoportoknak és extra poggyásznak.",
        airportTransfers: "Repülőtéri és városi transzferek,",
        madeSimple: "egyszerűen.",
        heroDescription: "Foglaljon kényelmes utat a repülőtérről, a szállodától vagy a város bármely pontjáról.",
        yourJourneyStarts: "Az utazása",
        beforeYouArrive: "már érkezés előtt elkezdődik.",
        onTimePickup: "Pontos felvétel",
        onTimeDescription: "A sofőr a megbeszélt időben készen áll, így nem kell feleslegesen várnia.",
        travelComfortably: "Utazzon kényelmesen",
        comfortDescriptionBenefit: "Válassza az utazásához megfelelő járművet, pároktól a nagyobb csoportokig.",
        transferOptions: "TRANSZFERLEHETŐSÉGEK",
        chooseTheRide: "Válassza ki az utat",
        thatFits: "amely megfelel Önnek.",
        from: "ettől",
        selectTransfer: "Transzfer kiválasztása",
        howItWorks: "HOGYAN MŰKÖDIK",
        fromAirport: "A repülőtérről",
        toDoorstep: "egészen a célállomásig.",
        howDescription: "Egyszerű transzferszolgáltatás, amely még könnyebbé teszi az utazás tervezését.",
        tellUsWhere: "Mondja meg, hová",
        tellUsDescription: "Adja meg a felvételi helyet és a célállomást.",
        chooseYourRide: "Válasszon járművet",
        chooseRideDescription: "Válassza ki a csoportjának legmegfelelőbb járművet.",
        enjoyJourney: "Élvezze az utazást",
        enjoyDescription: "Találkozzon sofőrjével, és érje el kényelmesen a célállomását.",
        travelWith: "UTAZZON A STAYWAY-JEL",
        arriveRelaxed: "Érkezzen kipihenten.",
        leaveRest: "A többit bízza ránk.",
        exploreStays: "Szállások felfedezése",
        staywayTransfers: "STAYWAY TRANSZFEREK",
        invalidLocations: "Válasszon érvényes felvételi helyet és célállomást.",
        sameCityError: "A felvételi helynek és a célállomásnak ugyanabban a városban kell lennie.",
        futureDateError: "Válassza a mai vagy egy jövőbeli dátumot a transzferhez.",
        returnDateError: "A visszaút dátuma nem lehet korábbi az indulás dátumánál.",
    },

    "Български": {
        privateDescription: "Комфортно частно пътуване само за вас и вашата група.",
        comfortDescription: "Повече пространство и комфорт за спокойно пътуване.",
        familyDescription: "Повече място за семейства, групи и допълнителен багаж.",
        airportTransfers: "Летищни и градски трансфери,",
        madeSimple: "лесно и удобно.",
        heroDescription: "Резервирайте комфортно пътуване от летището, хотела или всяка точка в града.",
        yourJourneyStarts: "Вашето пътуване започва",
        beforeYouArrive: "още преди да пристигнете.",
        onTimePickup: "Вземане навреме",
        onTimeDescription: "Шофьорът ви ще бъде готов в уговорения час, за да не чакате излишно.",
        travelComfortably: "Пътувайте комфортно",
        comfortDescriptionBenefit: "Изберете превозното средство, подходящо за вашето пътуване — от двойки до по-големи групи.",
        transferOptions: "ОПЦИИ ЗА ТРАНСФЕР",
        chooseTheRide: "Изберете пътуване",
        thatFits: "което ви подхожда.",
        from: "от",
        selectTransfer: "Изберете трансфер",
        howItWorks: "КАК РАБОТИ",
        fromAirport: "От летището",
        toDoorstep: "до вашата дестинация.",
        howDescription: "Лесен трансфер, създаден да направи планирането на пътуването още по-удобно.",
        tellUsWhere: "Кажете ни къде",
        tellUsDescription: "Въведете мястото за вземане и дестинацията.",
        chooseYourRide: "Изберете автомобил",
        chooseRideDescription: "Изберете автомобила, който е най-подходящ за вашата група.",
        enjoyJourney: "Насладете се на пътуването",
        enjoyDescription: "Срещнете се с шофьора и стигнете комфортно до дестинацията.",
        travelWith: "ПЪТУВАЙТЕ СЪС STAYWAY",
        arriveRelaxed: "Пристигнете спокойни.",
        leaveRest: "Оставете останалото на нас.",
        exploreStays: "Разгледайте местата за настаняване",
        staywayTransfers: "ТРАНСФЕРИ STAYWAY",
        invalidLocations: "Изберете валидно място за вземане и дестинация.",
        sameCityError: "Мястото за вземане и дестинацията трябва да са в един и същ град.",
        futureDateError: "Изберете днешна или бъдеща дата за трансфера.",
        returnDateError: "Датата на връщане не може да е преди датата на заминаване.",
    },

    Hrvatski: {
        privateDescription: "Udobna privatna vožnja samo za vas i vašu grupu.",
        comfortDescription: "Više prostora i udobnosti za opušteno putovanje.",
        familyDescription: "Više prostora za obitelji, grupe i dodatnu prtljagu.",
        airportTransfers: "Transferi iz zračne luke i po gradu,",
        madeSimple: "jednostavno.",
        heroDescription: "Rezervirajte udobnu vožnju iz zračne luke, hotela ili bilo kojeg mjesta u gradu.",
        yourJourneyStarts: "Vaše putovanje počinje",
        beforeYouArrive: "prije nego što stignete.",
        onTimePickup: "Preuzimanje na vrijeme",
        onTimeDescription: "Vaš će vozač biti spreman u dogovoreno vrijeme kako ne biste nepotrebno čekali.",
        travelComfortably: "Putujte udobno",
        comfortDescriptionBenefit: "Odaberite vozilo koje odgovara vašem putovanju, od parova do većih grupa.",
        transferOptions: "OPCIJE TRANSFERA",
        chooseTheRide: "Odaberite vožnju",
        thatFits: "koja vam odgovara.",
        from: "od",
        selectTransfer: "Odaberi transfer",
        howItWorks: "KAKO FUNKCIONIRA",
        fromAirport: "Od zračne luke",
        toDoorstep: "do vašeg odredišta.",
        howDescription: "Jednostavan transfer osmišljen da dodatno olakša planiranje vašeg putovanja.",
        tellUsWhere: "Recite nam kamo",
        tellUsDescription: "Unesite mjesto preuzimanja i odredište.",
        chooseYourRide: "Odaberite vozilo",
        chooseRideDescription: "Odaberite vozilo koje najbolje odgovara vašoj grupi.",
        enjoyJourney: "Uživajte u putovanju",
        enjoyDescription: "Upoznajte vozača i udobno stignite na odredište.",
        travelWith: "PUTUJTE SA STAYWAYEM",
        arriveRelaxed: "Stignite opušteni.",
        leaveRest: "Ostalo prepustite nama.",
        exploreStays: "Istraži smještaje",
        staywayTransfers: "STAYWAY TRANSFERI",
        invalidLocations: "Odaberite valjano mjesto preuzimanja i odredište.",
        sameCityError: "Mjesto preuzimanja i odredište moraju biti u istom gradu.",
        futureDateError: "Odaberite današnji ili budući datum transfera.",
        returnDateError: "Datum povratka ne može biti prije datuma polaska.",
    },

    "Slovenščina": {
        privateDescription: "Udobna zasebna vožnja samo za vas in vašo skupino.",
        comfortDescription: "Več prostora in udobja za sproščeno potovanje.",
        familyDescription: "Več prostora za družine, skupine in dodatno prtljago.",
        airportTransfers: "Letališki in mestni prevozi,",
        madeSimple: "preprosto.",
        heroDescription: "Rezervirajte udobno vožnjo z letališča, hotela ali katere koli točke v mestu.",
        yourJourneyStarts: "Vaše potovanje se začne",
        beforeYouArrive: "še preden prispete.",
        onTimePickup: "Prevzem ob pravem času",
        onTimeDescription: "Voznik bo pripravljen ob dogovorjenem času, zato vam ne bo treba po nepotrebnem čakati.",
        travelComfortably: "Potujte udobno",
        comfortDescriptionBenefit: "Izberite vozilo, ki ustreza vašemu potovanju, od parov do večjih skupin.",
        transferOptions: "MOŽNOSTI PREVOZA",
        chooseTheRide: "Izberite vožnjo",
        thatFits: "ki vam ustreza.",
        from: "od",
        selectTransfer: "Izberi prevoz",
        howItWorks: "KAKO DELUJE",
        fromAirport: "Z letališča",
        toDoorstep: "do cilja.",
        howDescription: "Preprosta izkušnja prevoza, ki dodatno olajša načrtovanje potovanja.",
        tellUsWhere: "Povejte nam kam",
        tellUsDescription: "Vnesite podatke o mestu prevzema in cilju.",
        chooseYourRide: "Izberite vozilo",
        chooseRideDescription: "Izberite vozilo, ki najbolje ustreza vaši skupini.",
        enjoyJourney: "Uživajte v vožnji",
        enjoyDescription: "Spoznajte voznika in udobno prispite na cilj.",
        travelWith: "POTUJTE S STAYWAYEM",
        arriveRelaxed: "Prispite sproščeni.",
        leaveRest: "Ostalo prepustite nam.",
        exploreStays: "Raziščite nastanitve",
        staywayTransfers: "PREVOZI STAYWAY",
        invalidLocations: "Izberite veljavno mesto prevzema in cilj.",
        sameCityError: "Mesto prevzema in cilj morata biti v istem mestu.",
        futureDateError: "Izberite današnji ali prihodnji datum prevoza.",
        returnDateError: "Datum vrnitve ne sme biti pred datumom odhoda.",
    },

    Srpski: {
        privateDescription: "Udobna privatna vožnja samo za vas i vašu grupu.",
        comfortDescription: "Više prostora i udobnosti za opušteno putovanje.",
        familyDescription: "Više prostora za porodice, grupe i dodatni prtljag.",
        airportTransfers: "Aerodromski i gradski transferi,",
        madeSimple: "jednostavno.",
        heroDescription: "Rezervišite udobnu vožnju sa aerodroma, iz hotela ili bilo koje tačke u gradu.",
        yourJourneyStarts: "Vaše putovanje počinje",
        beforeYouArrive: "pre nego što stignete.",
        onTimePickup: "Preuzimanje na vreme",
        onTimeDescription: "Vozač će biti spreman u dogovoreno vreme kako ne biste nepotrebno čekali.",
        travelComfortably: "Putujte udobno",
        comfortDescriptionBenefit: "Izaberite vozilo koje odgovara vašem putovanju, od parova do većih grupa.",
        transferOptions: "OPCIJE TRANSFERA",
        chooseTheRide: "Izaberite vožnju",
        thatFits: "koja vam odgovara.",
        from: "od",
        selectTransfer: "Izaberi transfer",
        howItWorks: "KAKO FUNKCIONIŠE",
        fromAirport: "Sa aerodroma",
        toDoorstep: "do vašeg odredišta.",
        howDescription: "Jednostavan transfer osmišljen da dodatno olakša planiranje putovanja.",
        tellUsWhere: "Recite nam gde",
        tellUsDescription: "Unesite mesto preuzimanja i odredište.",
        chooseYourRide: "Izaberite vozilo",
        chooseRideDescription: "Izaberite vozilo koje najbolje odgovara vašoj grupi.",
        enjoyJourney: "Uživajte u putovanju",
        enjoyDescription: "Upoznajte vozača i udobno stignite na odredište.",
        travelWith: "PUTUJTE SA STAYWAYEM",
        arriveRelaxed: "Stignite opušteni.",
        leaveRest: "Ostalo prepustite nama.",
        exploreStays: "Istražite smeštaje",
        staywayTransfers: "STAYWAY TRANSFERI",
        invalidLocations: "Izaberite važeće mesto preuzimanja i odredište.",
        sameCityError: "Mesto preuzimanja i odredište moraju biti u istom gradu.",
        futureDateError: "Izaberite današnji ili budući datum transfera.",
        returnDateError: "Datum povratka ne može biti pre datuma polaska.",
    },

    Bosanski: {
        privateDescription: "Udobna privatna vožnja samo za vas i vašu grupu.",
        comfortDescription: "Više prostora i udobnosti za opušteno putovanje.",
        familyDescription: "Više prostora za porodice, grupe i dodatni prtljag.",
        airportTransfers: "Aerodromski i gradski transferi,",
        madeSimple: "jednostavno.",
        heroDescription: "Rezervišite udobnu vožnju s aerodroma, iz hotela ili bilo kojeg mjesta u gradu.",
        yourJourneyStarts: "Vaše putovanje počinje",
        beforeYouArrive: "prije nego što stignete.",
        onTimePickup: "Preuzimanje na vrijeme",
        onTimeDescription: "Vozač će biti spreman u dogovoreno vrijeme kako ne biste nepotrebno čekali.",
        travelComfortably: "Putujte udobno",
        comfortDescriptionBenefit: "Odaberite vozilo koje odgovara vašem putovanju, od parova do većih grupa.",
        transferOptions: "OPCIJE TRANSFERA",
        chooseTheRide: "Odaberite vožnju",
        thatFits: "koja vam odgovara.",
        from: "od",
        selectTransfer: "Odaberi transfer",
        howItWorks: "KAKO FUNKCIONIŠE",
        fromAirport: "S aerodroma",
        toDoorstep: "do vašeg odredišta.",
        howDescription: "Jednostavan transfer osmišljen da dodatno olakša planiranje putovanja.",
        tellUsWhere: "Recite nam gdje",
        tellUsDescription: "Unesite mjesto preuzimanja i odredište.",
        chooseYourRide: "Odaberite vozilo",
        chooseRideDescription: "Odaberite vozilo koje najbolje odgovara vašoj grupi.",
        enjoyJourney: "Uživajte u putovanju",
        enjoyDescription: "Upoznajte vozača i udobno stignite na odredište.",
        travelWith: "PUTUJTE SA STAYWAYEM",
        arriveRelaxed: "Stignite opušteni.",
        leaveRest: "Ostalo prepustite nama.",
        exploreStays: "Istražite smještaje",
        staywayTransfers: "STAYWAY TRANSFERI",
        invalidLocations: "Odaberite važeće mjesto preuzimanja i odredište.",
        sameCityError: "Mjesto preuzimanja i odredište moraju biti u istom gradu.",
        futureDateError: "Odaberite današnji ili budući datum transfera.",
        returnDateError: "Datum povratka ne može biti prije datuma polaska.",
    },

    "العربية": {
        privateDescription: "رحلة خاصة ومريحة لك ولمجموعتك فقط.",
        comfortDescription: "مساحة وراحة أكبر لرحلة هادئة.",
        familyDescription: "مساحة أكبر للعائلات والمجموعات والأمتعة الإضافية.",
        airportTransfers: "خدمات نقل المطار والمدينة،",
        madeSimple: "بكل سهولة.",
        heroDescription: "احجز رحلة مريحة من المطار أو الفندق أو أي مكان في المدينة.",
        yourJourneyStarts: "تبدأ رحلتك",
        beforeYouArrive: "قبل وصولك.",
        onTimePickup: "استقبال في الموعد",
        onTimeDescription: "سيكون سائقك جاهزًا في الوقت المحدد لتجنب الانتظار غير الضروري.",
        travelComfortably: "سافر براحة",
        comfortDescriptionBenefit: "اختر المركبة المناسبة لرحلتك، من الأزواج إلى المجموعات الكبيرة.",
        transferOptions: "خيارات النقل",
        chooseTheRide: "اختر الرحلة",
        thatFits: "المناسبة لك.",
        from: "ابتداءً من",
        selectTransfer: "اختر النقل",
        howItWorks: "كيف تعمل الخدمة",
        fromAirport: "من المطار",
        toDoorstep: "إلى وجهتك.",
        howDescription: "تجربة نقل بسيطة صُممت لتجعل تخطيط رحلتك أسهل.",
        tellUsWhere: "أخبرنا إلى أين",
        tellUsDescription: "أدخل تفاصيل موقع الاستقبال والوجهة.",
        chooseYourRide: "اختر مركبتك",
        chooseRideDescription: "اختر المركبة الأنسب لمجموعتك.",
        enjoyJourney: "استمتع بالرحلة",
        enjoyDescription: "قابل سائقك وتوجه إلى وجهتك براحة.",
        travelWith: "سافر مع STAYWAY",
        arriveRelaxed: "صل براحة.",
        leaveRest: "واترك الباقي لنا.",
        exploreStays: "استكشف أماكن الإقامة",
        staywayTransfers: "نقل STAYWAY",
        invalidLocations: "يرجى اختيار موقع استقبال ووجهة صالحين.",
        sameCityError: "يجب أن يكون موقع الاستقبال والوجهة في المدينة نفسها.",
        futureDateError: "يرجى اختيار تاريخ اليوم أو تاريخ مستقبلي للنقل.",
        returnDateError: "لا يمكن أن يكون تاريخ العودة قبل تاريخ المغادرة.",
    },

    "עברית": {
        privateDescription: "נסיעה פרטית ונוחה רק עבורך ועבור הקבוצה שלך.",
        comfortDescription: "יותר מקום ונוחות לנסיעה רגועה.",
        familyDescription: "יותר מקום למשפחות, קבוצות ומטען נוסף.",
        airportTransfers: "הסעות משדה התעופה ובעיר,",
        madeSimple: "בפשטות.",
        heroDescription: "הזמינו נסיעה נוחה משדה התעופה, מהמלון או מכל מקום בעיר.",
        yourJourneyStarts: "המסע שלך מתחיל",
        beforeYouArrive: "עוד לפני ההגעה.",
        onTimePickup: "איסוף בזמן",
        onTimeDescription: "הנהג שלך יהיה מוכן בזמן שנקבע כדי שלא תצטרך להמתין שלא לצורך.",
        travelComfortably: "נוסעים בנוחות",
        comfortDescriptionBenefit: "בחרו את הרכב שמתאים לנסיעה שלכם, מזוגות ועד קבוצות גדולות.",
        transferOptions: "אפשרויות הסעה",
        chooseTheRide: "בחרו את הנסיעה",
        thatFits: "שמתאימה לכם.",
        from: "החל מ־",
        selectTransfer: "בחרו הסעה",
        howItWorks: "איך זה עובד",
        fromAirport: "משדה התעופה",
        toDoorstep: "עד ליעד.",
        howDescription: "חוויית הסעה פשוטה שנועדה להקל עוד יותר על תכנון הנסיעה.",
        tellUsWhere: "ספרו לנו לאן",
        tellUsDescription: "הזינו את פרטי נקודת האיסוף והיעד.",
        chooseYourRide: "בחרו את הרכב",
        chooseRideDescription: "בחרו את הרכב שמתאים ביותר לקבוצה שלכם.",
        enjoyJourney: "תיהנו מהדרך",
        enjoyDescription: "פגשו את הנהג והגיעו בנוחות ליעד.",
        travelWith: "נוסעים עם STAYWAY",
        arriveRelaxed: "מגיעים רגועים.",
        leaveRest: "את השאר השאירו לנו.",
        exploreStays: "גלו מקומות אירוח",
        staywayTransfers: "הסעות STAYWAY",
        invalidLocations: "בחרו נקודת איסוף ויעד תקינים.",
        sameCityError: "נקודת האיסוף והיעד חייבים להיות באותה עיר.",
        futureDateError: "בחרו את היום או תאריך עתידי עבור ההסעה.",
        returnDateError: "תאריך החזרה לא יכול להיות לפני תאריך היציאה.",
    },

    "हिन्दी": {
        privateDescription: "सिर्फ आपके और आपके समूह के लिए आरामदायक निजी यात्रा।",
        comfortDescription: "आरामदायक सफर के लिए अधिक जगह और सुविधा।",
        familyDescription: "परिवारों, समूहों और अतिरिक्त सामान के लिए अधिक जगह।",
        airportTransfers: "एयरपोर्ट और शहर ट्रांसफर,",
        madeSimple: "अब बेहद आसान।",
        heroDescription: "एयरपोर्ट, होटल या शहर में किसी भी जगह से आरामदायक यात्रा बुक करें।",
        yourJourneyStarts: "आपकी यात्रा शुरू होती है",
        beforeYouArrive: "आपके पहुँचने से पहले।",
        onTimePickup: "समय पर पिक-अप",
        onTimeDescription: "आपका ड्राइवर तय समय पर तैयार रहेगा, ताकि आपको बेवजह इंतज़ार न करना पड़े।",
        travelComfortably: "आराम से यात्रा करें",
        comfortDescriptionBenefit: "अपनी यात्रा के अनुसार वाहन चुनें, जोड़ों से लेकर बड़े समूहों तक।",
        transferOptions: "ट्रांसफर विकल्प",
        chooseTheRide: "अपनी यात्रा चुनें",
        thatFits: "जो आपके लिए सही हो।",
        from: "से",
        selectTransfer: "ट्रांसफर चुनें",
        howItWorks: "यह कैसे काम करता है",
        fromAirport: "एयरपोर्ट से",
        toDoorstep: "आपके गंतव्य तक।",
        howDescription: "सरल ट्रांसफर सेवा जो आपकी यात्रा की योजना को और आसान बनाती है।",
        tellUsWhere: "हमें बताएँ कहाँ",
        tellUsDescription: "पिक-अप और गंतव्य की जानकारी दर्ज करें।",
        chooseYourRide: "अपना वाहन चुनें",
        chooseRideDescription: "अपने समूह के लिए सबसे उपयुक्त वाहन चुनें।",
        enjoyJourney: "यात्रा का आनंद लें",
        enjoyDescription: "अपने ड्राइवर से मिलें और आराम से गंतव्य तक पहुँचें।",
        travelWith: "STAYWAY के साथ यात्रा करें",
        arriveRelaxed: "आराम से पहुँचें।",
        leaveRest: "बाकी हम पर छोड़ दें।",
        exploreStays: "ठहरने की जगहें देखें",
        staywayTransfers: "STAYWAY ट्रांसफर",
        invalidLocations: "कृपया सही पिक-अप स्थान और गंतव्य चुनें।",
        sameCityError: "पिक-अप स्थान और गंतव्य एक ही शहर में होने चाहिए।",
        futureDateError: "ट्रांसफर के लिए आज या भविष्य की तारीख चुनें।",
        returnDateError: "वापसी की तारीख प्रस्थान की तारीख से पहले नहीं हो सकती।",
    },

    "ไทย": {
        privateDescription: "บริการรับส่งแบบส่วนตัวที่สะดวกสบายสำหรับคุณและกลุ่มของคุณเท่านั้น",
        comfortDescription: "พื้นที่และความสะดวกสบายมากขึ้นสำหรับการเดินทางที่ผ่อนคลาย",
        familyDescription: "พื้นที่มากขึ้นสำหรับครอบครัว กลุ่ม และสัมภาระเพิ่มเติม",
        airportTransfers: "บริการรับส่งสนามบินและในเมือง",
        madeSimple: "ง่ายและสะดวก",
        heroDescription: "จองการเดินทางที่สะดวกสบายจากสนามบิน โรงแรม หรือทุกจุดในเมือง",
        yourJourneyStarts: "การเดินทางของคุณเริ่มต้น",
        beforeYouArrive: "ก่อนที่คุณจะมาถึง",
        onTimePickup: "รับตรงเวลา",
        onTimeDescription: "คนขับของคุณจะพร้อมตามเวลาที่กำหนด เพื่อให้คุณไม่ต้องรอโดยไม่จำเป็น",
        travelComfortably: "เดินทางอย่างสะดวกสบาย",
        comfortDescriptionBenefit: "เลือกรถที่เหมาะกับการเดินทางของคุณ ตั้งแต่คู่เดินทางไปจนถึงกลุ่มใหญ่",
        transferOptions: "ตัวเลือกการรับส่ง",
        chooseTheRide: "เลือกการเดินทาง",
        thatFits: "ที่เหมาะกับคุณ",
        from: "เริ่มต้น",
        selectTransfer: "เลือกบริการรับส่ง",
        howItWorks: "วิธีการใช้งาน",
        fromAirport: "จากสนามบิน",
        toDoorstep: "ถึงจุดหมายของคุณ",
        howDescription: "บริการรับส่งที่เรียบง่าย ช่วยให้การวางแผนการเดินทางของคุณง่ายยิ่งขึ้น",
        tellUsWhere: "บอกเราว่าจะไปที่ไหน",
        tellUsDescription: "กรอกรายละเอียดจุดรับและจุดหมายปลายทาง",
        chooseYourRide: "เลือกรถของคุณ",
        chooseRideDescription: "เลือกรถที่เหมาะกับกลุ่มของคุณมากที่สุด",
        enjoyJourney: "เพลิดเพลินกับการเดินทาง",
        enjoyDescription: "พบคนขับของคุณและเดินทางถึงจุดหมายอย่างสะดวกสบาย",
        travelWith: "เดินทางกับ STAYWAY",
        arriveRelaxed: "เดินทางถึงอย่างสบายใจ",
        leaveRest: "ที่เหลือให้เราดูแล",
        exploreStays: "สำรวจที่พัก",
        staywayTransfers: "บริการรับส่ง STAYWAY",
        invalidLocations: "โปรดเลือกจุดรับและจุดหมายปลายทางที่ถูกต้อง",
        sameCityError: "จุดรับและจุดหมายปลายทางต้องอยู่ในเมืองเดียวกัน",
        futureDateError: "โปรดเลือกวันนี้หรือวันที่ในอนาคตสำหรับบริการรับส่ง",
        returnDateError: "วันที่เดินทางกลับต้องไม่ก่อนวันที่ออกเดินทาง",
    },

    "Bahasa Indonesia": {
        privateDescription: "Perjalanan pribadi yang nyaman khusus untuk Anda dan grup Anda.",
        comfortDescription: "Ruang dan kenyamanan ekstra untuk perjalanan yang santai.",
        familyDescription: "Lebih banyak ruang untuk keluarga, grup, dan bagasi tambahan.",
        airportTransfers: "Transfer bandara dan kota,",
        madeSimple: "jadi lebih mudah.",
        heroDescription: "Pesan perjalanan nyaman dari bandara, hotel, atau lokasi mana pun di kota.",
        yourJourneyStarts: "Perjalanan Anda dimulai",
        beforeYouArrive: "sebelum Anda tiba.",
        onTimePickup: "Penjemputan tepat waktu",
        onTimeDescription: "Pengemudi Anda siap pada waktu yang disepakati agar Anda tidak perlu menunggu.",
        travelComfortably: "Bepergian dengan nyaman",
        comfortDescriptionBenefit: "Pilih kendaraan yang sesuai dengan perjalanan Anda, dari pasangan hingga grup besar.",
        transferOptions: "PILIHAN TRANSFER",
        chooseTheRide: "Pilih perjalanan",
        thatFits: "yang sesuai untuk Anda.",
        from: "mulai",
        selectTransfer: "Pilih transfer",
        howItWorks: "CARA KERJANYA",
        fromAirport: "Dari bandara",
        toDoorstep: "hingga tujuan Anda.",
        howDescription: "Pengalaman transfer sederhana yang dirancang untuk mempermudah perencanaan perjalanan Anda.",
        tellUsWhere: "Beri tahu kami tujuan Anda",
        tellUsDescription: "Masukkan detail lokasi penjemputan dan tujuan.",
        chooseYourRide: "Pilih kendaraan Anda",
        chooseRideDescription: "Pilih kendaraan yang paling sesuai untuk grup Anda.",
        enjoyJourney: "Nikmati perjalanan",
        enjoyDescription: "Temui pengemudi Anda dan tiba di tujuan dengan nyaman.",
        travelWith: "BEPERGIAN DENGAN STAYWAY",
        arriveRelaxed: "Tiba dengan santai.",
        leaveRest: "Serahkan sisanya kepada kami.",
        exploreStays: "Jelajahi penginapan",
        staywayTransfers: "TRANSFER STAYWAY",
        invalidLocations: "Pilih lokasi penjemputan dan tujuan yang valid.",
        sameCityError: "Lokasi penjemputan dan tujuan harus berada di kota yang sama.",
        futureDateError: "Pilih hari ini atau tanggal mendatang untuk transfer Anda.",
        returnDateError: "Tanggal kembali tidak boleh sebelum tanggal keberangkatan.",
    },

    "Tiếng Việt": {
        privateDescription: "Chuyến đi riêng thoải mái chỉ dành cho bạn và nhóm của bạn.",
        comfortDescription: "Thêm không gian và sự thoải mái cho hành trình thư giãn.",
        familyDescription: "Nhiều không gian hơn cho gia đình, nhóm và hành lý bổ sung.",
        airportTransfers: "Đưa đón sân bay và trong thành phố,",
        madeSimple: "thật đơn giản.",
        heroDescription: "Đặt chuyến đi thoải mái từ sân bay, khách sạn hoặc bất kỳ đâu trong thành phố.",
        yourJourneyStarts: "Hành trình của bạn bắt đầu",
        beforeYouArrive: "trước khi bạn đến.",
        onTimePickup: "Đón đúng giờ",
        onTimeDescription: "Tài xế sẽ sẵn sàng đúng giờ để bạn không phải chờ đợi không cần thiết.",
        travelComfortably: "Di chuyển thoải mái",
        comfortDescriptionBenefit: "Chọn phương tiện phù hợp với chuyến đi của bạn, từ cặp đôi đến nhóm lớn.",
        transferOptions: "LỰA CHỌN ĐƯA ĐÓN",
        chooseTheRide: "Chọn chuyến đi",
        thatFits: "phù hợp với bạn.",
        from: "từ",
        selectTransfer: "Chọn đưa đón",
        howItWorks: "CÁCH HOẠT ĐỘNG",
        fromAirport: "Từ sân bay",
        toDoorstep: "đến điểm đến của bạn.",
        howDescription: "Dịch vụ đưa đón đơn giản giúp việc lên kế hoạch chuyến đi trở nên dễ dàng hơn.",
        tellUsWhere: "Cho chúng tôi biết bạn đi đâu",
        tellUsDescription: "Nhập thông tin điểm đón và điểm đến.",
        chooseYourRide: "Chọn phương tiện",
        chooseRideDescription: "Chọn phương tiện phù hợp nhất với nhóm của bạn.",
        enjoyJourney: "Tận hưởng hành trình",
        enjoyDescription: "Gặp tài xế và đến điểm đến một cách thoải mái.",
        travelWith: "ĐỒNG HÀNH CÙNG STAYWAY",
        arriveRelaxed: "Đến nơi thật thư thái.",
        leaveRest: "Phần còn lại để chúng tôi lo.",
        exploreStays: "Khám phá chỗ ở",
        staywayTransfers: "ĐƯA ĐÓN STAYWAY",
        invalidLocations: "Vui lòng chọn điểm đón và điểm đến hợp lệ.",
        sameCityError: "Điểm đón và điểm đến phải ở cùng một thành phố.",
        futureDateError: "Vui lòng chọn hôm nay hoặc một ngày trong tương lai cho chuyến đưa đón.",
        returnDateError: "Ngày về không thể trước ngày khởi hành.",
    },

    "한국어": {
        privateDescription: "고객님과 일행만을 위한 편안한 전용 차량 서비스입니다.",
        comfortDescription: "여유로운 여행을 위한 더 넓은 공간과 편안함.",
        familyDescription: "가족, 단체 및 추가 수하물을 위한 넉넉한 공간.",
        airportTransfers: "공항 및 시내 이동,",
        madeSimple: "간편하게.",
        heroDescription: "공항, 호텔 또는 도시 어디에서든 편안한 차량을 예약하세요.",
        yourJourneyStarts: "여행은",
        beforeYouArrive: "도착하기 전부터 시작됩니다.",
        onTimePickup: "정시 픽업",
        onTimeDescription: "기사님이 약속된 시간에 준비되어 불필요한 대기 없이 이동할 수 있습니다.",
        travelComfortably: "편안하게 이동하세요",
        comfortDescriptionBenefit: "커플부터 대규모 그룹까지 여행에 맞는 차량을 선택하세요.",
        transferOptions: "이동 옵션",
        chooseTheRide: "차량을 선택하세요",
        thatFits: "여행에 딱 맞게.",
        from: "최저",
        selectTransfer: "이동 서비스 선택",
        howItWorks: "이용 방법",
        fromAirport: "공항에서",
        toDoorstep: "목적지까지.",
        howDescription: "여행 계획의 부담을 하나 더 덜어주는 간편한 이동 서비스입니다.",
        tellUsWhere: "목적지를 알려주세요",
        tellUsDescription: "픽업 장소와 목적지 정보를 입력하세요.",
        chooseYourRide: "차량 선택",
        chooseRideDescription: "일행에게 가장 적합한 차량을 선택하세요.",
        enjoyJourney: "편안한 여행을 즐기세요",
        enjoyDescription: "기사님을 만나 편안하게 목적지까지 이동하세요.",
        travelWith: "STAYWAY와 함께 이동하세요",
        arriveRelaxed: "편안하게 도착하세요.",
        leaveRest: "나머지는 저희에게 맡기세요.",
        exploreStays: "숙소 둘러보기",
        staywayTransfers: "STAYWAY 이동 서비스",
        invalidLocations: "올바른 픽업 장소와 목적지를 선택하세요.",
        sameCityError: "픽업 장소와 목적지는 같은 도시에 있어야 합니다.",
        futureDateError: "오늘 또는 이후 날짜를 선택하세요.",
        returnDateError: "귀국 날짜는 출발 날짜보다 빠를 수 없습니다.",
    },

    "日本語": {
        privateDescription: "お客様とグループだけの快適なプライベート送迎です。",
        comfortDescription: "ゆったりした移動のための広い空間と快適さ。",
        familyDescription: "ご家族、グループ、追加の荷物にも十分なスペース。",
        airportTransfers: "空港・市内送迎を、",
        madeSimple: "もっと簡単に。",
        heroDescription: "空港、ホテル、市内のどこからでも快適な送迎を予約できます。",
        yourJourneyStarts: "旅は",
        beforeYouArrive: "到着前から始まります。",
        onTimePickup: "時間どおりのお迎え",
        onTimeDescription: "ドライバーが指定時刻に待機しているため、無駄な待ち時間がありません。",
        travelComfortably: "快適に移動",
        comfortDescriptionBenefit: "カップルから大人数のグループまで、旅行に合った車両をお選びください。",
        transferOptions: "送迎オプション",
        chooseTheRide: "送迎を選ぶ",
        thatFits: "旅にぴったりの一台を。",
        from: "から",
        selectTransfer: "送迎を選択",
        howItWorks: "ご利用方法",
        fromAirport: "空港から",
        toDoorstep: "目的地まで。",
        howDescription: "旅行の計画をさらに簡単にする、シンプルな送迎サービスです。",
        tellUsWhere: "行き先を入力",
        tellUsDescription: "お迎え場所と目的地の詳細を入力してください。",
        chooseYourRide: "車両を選択",
        chooseRideDescription: "グループに最適な車両をお選びください。",
        enjoyJourney: "移動を楽しむ",
        enjoyDescription: "ドライバーと合流し、快適に目的地へ向かいましょう。",
        travelWith: "STAYWAYで移動",
        arriveRelaxed: "安心して到着。",
        leaveRest: "あとは私たちにお任せください。",
        exploreStays: "宿泊施設を見る",
        staywayTransfers: "STAYWAY送迎",
        invalidLocations: "有効なお迎え場所と目的地を選択してください。",
        sameCityError: "お迎え場所と目的地は同じ都市内である必要があります。",
        futureDateError: "送迎日は今日または未来の日付を選択してください。",
        returnDateError: "帰りの日付を出発日より前に設定することはできません。",
    },

    "中文": {
        privateDescription: "专为您和同行人员提供的舒适私人接送。",
        comfortDescription: "更宽敞、更舒适，让旅程更轻松。",
        familyDescription: "为家庭、团体和额外行李提供更多空间。",
        airportTransfers: "机场及市内接送，",
        madeSimple: "轻松搞定。",
        heroDescription: "可从机场、酒店或城市任何地点预订舒适接送。",
        yourJourneyStarts: "您的旅程",
        beforeYouArrive: "在抵达前就已开始。",
        onTimePickup: "准时接送",
        onTimeDescription: "司机会在约定时间准备好，让您无需无谓等待。",
        travelComfortably: "舒适出行",
        comfortDescriptionBenefit: "从情侣到大型团体，都能选择适合行程的车辆。",
        transferOptions: "接送选项",
        chooseTheRide: "选择接送",
        thatFits: "适合您的行程。",
        from: "起价",
        selectTransfer: "选择接送",
        howItWorks: "使用方式",
        fromAirport: "从机场",
        toDoorstep: "直达目的地。",
        howDescription: "简单的接送体验，让您的旅行规划更加轻松。",
        tellUsWhere: "告诉我们去哪",
        tellUsDescription: "输入接送地点和目的地信息。",
        chooseYourRide: "选择车辆",
        chooseRideDescription: "选择最适合您同行人员的车辆。",
        enjoyJourney: "享受旅程",
        enjoyDescription: "与司机会合，舒适抵达目的地。",
        travelWith: "与 STAYWAY 一起出行",
        arriveRelaxed: "轻松抵达。",
        leaveRest: "其余交给我们。",
        exploreStays: "探索住宿",
        staywayTransfers: "STAYWAY 接送",
        invalidLocations: "请选择有效的接送地点和目的地。",
        sameCityError: "接送地点和目的地必须位于同一城市。",
        futureDateError: "请选择今天或未来日期作为接送日期。",
        returnDateError: "返程日期不能早于出发日期。",
    },

    "繁體中文": {
        privateDescription: "專為您和同行人員提供的舒適私人接送。",
        comfortDescription: "更寬敞、更舒適，讓旅程更輕鬆。",
        familyDescription: "為家庭、團體和額外行李提供更多空間。",
        airportTransfers: "機場及市內接送，",
        madeSimple: "輕鬆完成。",
        heroDescription: "可從機場、飯店或城市任何地點預訂舒適接送。",
        yourJourneyStarts: "您的旅程",
        beforeYouArrive: "在抵達前就已開始。",
        onTimePickup: "準時接送",
        onTimeDescription: "司機會在約定時間準備好，讓您無需不必要的等待。",
        travelComfortably: "舒適出行",
        comfortDescriptionBenefit: "從情侶到大型團體，都能選擇適合行程的車輛。",
        transferOptions: "接送選項",
        chooseTheRide: "選擇接送",
        thatFits: "適合您的行程。",
        from: "起價",
        selectTransfer: "選擇接送",
        howItWorks: "使用方式",
        fromAirport: "從機場",
        toDoorstep: "直達目的地。",
        howDescription: "簡單的接送體驗，讓您的旅行規劃更加輕鬆。",
        tellUsWhere: "告訴我們去哪",
        tellUsDescription: "輸入接送地點和目的地資訊。",
        chooseYourRide: "選擇車輛",
        chooseRideDescription: "選擇最適合您同行人員的車輛。",
        enjoyJourney: "享受旅程",
        enjoyDescription: "與司機會合，舒適抵達目的地。",
        travelWith: "與 STAYWAY 一起出行",
        arriveRelaxed: "輕鬆抵達。",
        leaveRest: "其餘交給我們。",
        exploreStays: "探索住宿",
        staywayTransfers: "STAYWAY 接送",
        invalidLocations: "請選擇有效的接送地點和目的地。",
        sameCityError: "接送地點和目的地必須位於同一城市。",
        futureDateError: "請選擇今天或未來日期作為接送日期。",
        returnDateError: "返程日期不能早於出發日期。",
    },

    "Català": {
        privateDescription: "Un trasllat privat i còmode només per a tu i el teu grup.",
        comfortDescription: "Més espai i comoditat per a un viatge relaxat.",
        familyDescription: "Més espai per a famílies, grups i equipatge addicional.",
        airportTransfers: "Trasllats d’aeroport i ciutat,",
        madeSimple: "fàcils i còmodes.",
        heroDescription: "Reserva un viatge còmode des de l’aeroport, l’hotel o qualsevol punt de la ciutat.",
        yourJourneyStarts: "El teu viatge comença",
        beforeYouArrive: "abans que arribis.",
        onTimePickup: "Recollida puntual",
        onTimeDescription: "El teu conductor estarà preparat a l’hora acordada perquè no hagis d’esperar.",
        travelComfortably: "Viatja còmodament",
        comfortDescriptionBenefit: "Tria el vehicle que s’adapti al teu viatge, des de parelles fins a grups grans.",
        transferOptions: "OPCIONS DE TRASLLAT",
        chooseTheRide: "Tria el trasllat",
        thatFits: "que s’adapti al teu viatge.",
        from: "des de",
        selectTransfer: "Selecciona trasllat",
        howItWorks: "COM FUNCIONA",
        fromAirport: "Des de l’aeroport",
        toDoorstep: "fins a la destinació.",
        howDescription: "Una experiència de trasllat senzilla que facilita encara més la planificació del viatge.",
        tellUsWhere: "Digues-nos on",
        tellUsDescription: "Introdueix les dades del lloc de recollida i la destinació.",
        chooseYourRide: "Tria el vehicle",
        chooseRideDescription: "Tria el vehicle que millor s’adapti al teu grup.",
        enjoyJourney: "Gaudeix del viatge",
        enjoyDescription: "Troba't amb el conductor i arriba còmodament a la destinació.",
        travelWith: "VIATJA AMB STAYWAY",
        arriveRelaxed: "Arriba relaxat.",
        leaveRest: "Deixa'ns la resta.",
        exploreStays: "Explora allotjaments",
        staywayTransfers: "TRASLLATS STAYWAY",
        invalidLocations: "Selecciona un lloc de recollida i una destinació vàlids.",
        sameCityError: "El lloc de recollida i la destinació han d’estar a la mateixa ciutat.",
        futureDateError: "Selecciona avui o una data futura per al trasllat.",
        returnDateError: "La data de tornada no pot ser anterior a la data de sortida.",
    },

    Eesti: {
        privateDescription: "Mugav erasõit ainult teile ja teie grupile.",
        comfortDescription: "Rohkem ruumi ja mugavust rahulikuks sõiduks.",
        familyDescription: "Rohkem ruumi peredele, gruppidele ja lisapagasile.",
        airportTransfers: "Lennujaama- ja linnatransfeerid,",
        madeSimple: "lihtsalt.",
        heroDescription: "Broneerige mugav sõit lennujaamast, hotellist või ükskõik millisest kohast linnas.",
        yourJourneyStarts: "Teie reis algab",
        beforeYouArrive: "juba enne saabumist.",
        onTimePickup: "Õigeaegne pealevõtt",
        onTimeDescription: "Juht on kokkulepitud ajal valmis, nii et te ei pea asjatult ootama.",
        travelComfortably: "Reisige mugavalt",
        comfortDescriptionBenefit: "Valige oma reisile sobiv sõiduk, paaridest suuremate gruppideni.",
        transferOptions: "TRANSFEERIVÕIMALUSED",
        chooseTheRide: "Valige sõit",
        thatFits: "mis sobib teie reisile.",
        from: "alates",
        selectTransfer: "Vali transfeer",
        howItWorks: "KUIDAS SEE TÖÖTAB",
        fromAirport: "Lennujaamast",
        toDoorstep: "sihtkohta.",
        howDescription: "Lihtne transfeeriteenus, mis muudab reisi planeerimise veel lihtsamaks.",
        tellUsWhere: "Öelge meile kuhu",
        tellUsDescription: "Sisestage pealevõtukoha ja sihtkoha andmed.",
        chooseYourRide: "Valige sõiduk",
        chooseRideDescription: "Valige oma grupile kõige paremini sobiv sõiduk.",
        enjoyJourney: "Nautige sõitu",
        enjoyDescription: "Kohtuge juhiga ja jõudke mugavalt sihtkohta.",
        travelWith: "REISIGE STAYWAYGA",
        arriveRelaxed: "Saabuge rahulikult.",
        leaveRest: "Ülejäänu jätke meie hooleks.",
        exploreStays: "Avasta majutusi",
        staywayTransfers: "STAYWAY TRANSFEERID",
        invalidLocations: "Valige kehtiv pealevõtukoht ja sihtkoht.",
        sameCityError: "Pealevõtukoht ja sihtkoht peavad olema samas linnas.",
        futureDateError: "Valige transfeeriks tänane või tulevane kuupäev.",
        returnDateError: "Tagasisõidu kuupäev ei tohi olla enne väljasõidu kuupäeva.",
    },

    "Latviešu": {
        privateDescription: "Ērts privāts brauciens tikai jums un jūsu grupai.",
        comfortDescription: "Vairāk vietas un komforta mierīgam braucienam.",
        familyDescription: "Vairāk vietas ģimenēm, grupām un papildu bagāžai.",
        airportTransfers: "Lidostas un pilsētas transfēri,",
        madeSimple: "vienkārši.",
        heroDescription: "Rezervējiet ērtu braucienu no lidostas, viesnīcas vai jebkuras vietas pilsētā.",
        yourJourneyStarts: "Jūsu ceļojums sākas",
        beforeYouArrive: "vēl pirms ierašanās.",
        onTimePickup: "Savlaicīga paņemšana",
        onTimeDescription: "Vadītājs būs gatavs norunātajā laikā, lai jums nebūtu lieki jāgaida.",
        travelComfortably: "Ceļojiet ērti",
        comfortDescriptionBenefit: "Izvēlieties ceļojumam piemērotu transportlīdzekli — no pāriem līdz lielākām grupām.",
        transferOptions: "TRANSFĒRA IESPĒJAS",
        chooseTheRide: "Izvēlieties braucienu",
        thatFits: "kas jums ir piemērots.",
        from: "no",
        selectTransfer: "Izvēlēties transfēru",
        howItWorks: "KĀ TAS DARBOJAS",
        fromAirport: "No lidostas",
        toDoorstep: "līdz galamērķim.",
        howDescription: "Vienkāršs transfērs, kas padara ceļojuma plānošanu vēl vieglāku.",
        tellUsWhere: "Pasakiet, uz kurieni",
        tellUsDescription: "Ievadiet paņemšanas vietas un galamērķa informāciju.",
        chooseYourRide: "Izvēlieties transportlīdzekli",
        chooseRideDescription: "Izvēlieties transportlīdzekli, kas vislabāk piemērots jūsu grupai.",
        enjoyJourney: "Izbaudiet braucienu",
        enjoyDescription: "Satieciet vadītāju un ērti nokļūstiet galamērķī.",
        travelWith: "CEĻOJIET AR STAYWAY",
        arriveRelaxed: "Ierodieties bez stresa.",
        leaveRest: "Pārējo atstājiet mums.",
        exploreStays: "Izpētīt naktsmītnes",
        staywayTransfers: "STAYWAY TRANSFĒRI",
        invalidLocations: "Izvēlieties derīgu paņemšanas vietu un galamērķi.",
        sameCityError: "Paņemšanas vietai un galamērķim jāatrodas vienā pilsētā.",
        futureDateError: "Izvēlieties šodienas vai nākotnes datumu transfēram.",
        returnDateError: "Atgriešanās datums nevar būt pirms izbraukšanas datuma.",
    },

    "Lietuvių": {
        privateDescription: "Patogi privati kelionė tik jums ir jūsų grupei.",
        comfortDescription: "Daugiau vietos ir komforto ramiai kelionei.",
        familyDescription: "Daugiau vietos šeimoms, grupėms ir papildomam bagažui.",
        airportTransfers: "Oro uosto ir miesto pervežimai,",
        madeSimple: "paprastai.",
        heroDescription: "Užsisakykite patogią kelionę iš oro uosto, viešbučio ar bet kurios miesto vietos.",
        yourJourneyStarts: "Jūsų kelionė prasideda",
        beforeYouArrive: "dar prieš atvykstant.",
        onTimePickup: "Paėmimas laiku",
        onTimeDescription: "Vairuotojas bus pasiruošęs sutartu laiku, todėl nereikės be reikalo laukti.",
        travelComfortably: "Keliaukite patogiai",
        comfortDescriptionBenefit: "Pasirinkite jūsų kelionei tinkamą transporto priemonę – nuo porų iki didesnių grupių.",
        transferOptions: "PERVEŽIMO PASIRINKIMAI",
        chooseTheRide: "Pasirinkite kelionę",
        thatFits: "kuri jums tinka.",
        from: "nuo",
        selectTransfer: "Pasirinkti pervežimą",
        howItWorks: "KAIP TAI VEIKIA",
        fromAirport: "Iš oro uosto",
        toDoorstep: "iki jūsų kelionės tikslo.",
        howDescription: "Paprasta pervežimo paslauga, kuri dar labiau palengvina kelionės planavimą.",
        tellUsWhere: "Pasakykite, kur",
        tellUsDescription: "Įveskite paėmimo vietos ir kelionės tikslo duomenis.",
        chooseYourRide: "Pasirinkite transporto priemonę",
        chooseRideDescription: "Pasirinkite jūsų grupei tinkamiausią transporto priemonę.",
        enjoyJourney: "Mėgaukitės kelione",
        enjoyDescription: "Susitikite su vairuotoju ir patogiai pasiekite kelionės tikslą.",
        travelWith: "KELIAUKITE SU STAYWAY",
        arriveRelaxed: "Atvykite ramiai.",
        leaveRest: "Visa kita palikite mums.",
        exploreStays: "Atraskite apgyvendinimo vietas",
        staywayTransfers: "STAYWAY PERVEŽIMAI",
        invalidLocations: "Pasirinkite galiojančią paėmimo vietą ir kelionės tikslą.",
        sameCityError: "Paėmimo vieta ir kelionės tikslas turi būti tame pačiame mieste.",
        futureDateError: "Pasirinkite šiandienos arba būsimą pervežimo datą.",
        returnDateError: "Grįžimo data negali būti ankstesnė už išvykimo datą.",
    },

};

const transferOptions: TransferOption[] = [
    {
        id: 1,
        titleKey: "privateTransfer",
        descriptionKey: "privateDescription",
        passengers: "3",
        luggage: "2",
        duration: "35",
        price: 32,
        icon: "🚘",
    },
    {
        id: 2,
        titleKey: "comfortTransfer",
        descriptionKey: "comfortDescription",
        passengers: "4",
        luggage: "3",
        duration: "35",
        price: 42,
        icon: "🚙",
    },
    {
        id: 3,
        titleKey: "familyTransfer",
        descriptionKey: "familyDescription",
        passengers: "7",
        luggage: "6",
        duration: "40",
        price: 58,
        icon: "🚐",
    },
];

export default function TransfersPage() {
    const { language, currency } = useSettings();

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

    const t = (key: string) => {
        const langName = language.split("|")[0];

        return (
            transferExtraTranslations[langName]?.[key] ??
            transferExtraTranslations.English[key] ??
            getTranslation(
                language,
                key as Parameters<
                    typeof getTranslation
                >[1]
            )
        );
    };

    const [transferType, setTransferType] =
        useState<TransferType>("one-way");

    const [pickup, setPickup] =
        useState("");

    const [destination, setDestination] =
        useState("");

    const [selectedCityName, setSelectedCityName] =
        useState("");

    const [
        transferLocations,
        setTransferLocations,
    ] = useState<TransferLocation[]>([]);

    useEffect(() => {
        let isActive = true;

        const loadTransferLocations =
            async () => {
                try {
                    const locations =
                        await getTransferLocationsFromApi();

                    if (isActive) {
                        setTransferLocations(
                            locations
                        );
                    }
                } catch (error) {
                    console.error(
                        "Could not load transfer locations from the backend.",
                        error
                    );

                    /*
                     * Temporary fallback to the synchronized
                     * local copy if the API is unavailable.
                     */
                    if (isActive) {
                        setTransferLocations([]);
                    }
                }
            };

        void loadTransferLocations();

        return () => {
            isActive = false;
        };
    }, []);

    function findTransferLocation(value: string) {
        const normalized = value.trim().toLowerCase();

        return transferLocations.find(
            (location) =>
                location.name.trim().toLowerCase() ===
                normalized
        );
    }

    const destinationLocations =
        selectedCityName
            ? transferLocations.filter(
                (location) =>
                    location.cityName ===
                    selectedCityName
            )
            : transferLocations;

    const [date, setDate] =
        useState("");

    const [time, setTime] =
        useState("");

    const [returnDate, setReturnDate] =
        useState("");

    const [returnTime, setReturnTime] =
        useState("");

    const [passengers, setPassengers] =
        useState("2");

    const [searched, setSearched] =
        useState(false);

    const getLocalDateString = () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const todayDate = getLocalDateString();

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const pickupLocation =
            findTransferLocation(pickup);

        const destinationLocation =
            findTransferLocation(destination);

        if (
            !pickupLocation ||
            !destinationLocation
        ) {
            alert(
                t("invalidLocations")
            );

            return;
        }

        if (
            pickupLocation.cityName !==
            destinationLocation.cityName
        ) {
            alert(
                t("sameCityError")
            );

            return;
        }

        if (
            !pickup ||
            !destination ||
            !date ||
            !time
        ) {
            return;
        }

        const today = getLocalDateString();

        if (date < today) {
            alert(
                t("futureDateError")
            );

            return;
        }

        if (
            transferType === "return"
        ) {
            if (!returnDate || !returnTime) {
                return;
            }

            if (returnDate < date) {
                alert(
                    t("returnDateError")
                );

                return;
            }
        }

        setSearched(true);

        setTimeout(() => {
            document
                .getElementById(
                    "transfer-options"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        }, 50);
    }

    return (
        <main className="transfers-page">

            {/* HERO */}

            <section className="transfers-hero stayway-load-in stayway-load-1">
                <div className="transfers-container">

                    <div className="transfers-hero-content">

                        <span className="transfers-eyebrow">
                            {t("staywayTransfers")}
                        </span>

                        <h1>
                            {t("airportTransfers")}
                            <br />
                            <span>
                                {t("madeSimple")}
                            </span>
                        </h1>

                        <p>
                            {t("heroDescription")}
                        </p>

                    </div>

                    <div className="transfers-hero-image">

                        <img
                            src="/transfers/transfer1.png"
                            alt="Private car transfer"
                        />

                    </div>

                    {/* SEARCH CARD */}

                    <div className="transfers-search-card">

                        <div className="transfers-type-switch">

                            <button
                                type="button"
                                className={
                                    transferType ===
                                    "one-way"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setTransferType(
                                        "one-way"
                                    )
                                }
                            >
                                <span className="transfer-radio">
                                    {transferType ===
                                        "one-way" &&
                                        "✓"}
                                </span>

                                {t("oneWay")}
                            </button>

                            <button
                                type="button"
                                className={
                                    transferType ===
                                    "return"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setTransferType(
                                        "return"
                                    )
                                }
                            >
                                <span className="transfer-radio">
                                    {transferType ===
                                        "return" &&
                                        "✓"}
                                </span>

                                {t("return")}
                            </button>

                        </div>

                        <form
                            className={`transfers-form ${
                                transferType ===
                                "return"
                                    ? "is-return"
                                    : ""
                            }`}
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {/* PICK-UP */}

                            <div className="transfer-field transfer-location-field">

                                <span className="transfer-field-icon">
                                    📍
                                </span>

                                <div>

                                    <label htmlFor="pickup">
                                        {t(
                                            "pickupLocation"
                                        )}
                                    </label>

                                    <TransferLocationInput
                                        value={pickup}
                                        onChange={(value) => {
                                            setPickup(value);
                                        }}
                                        onSelect={(location) => {
                                            setPickup(location.name);
                                            setSelectedCityName(location.cityName);
                                            setDestination("");
                                        }}
                                        placeholder={t(
                                            "pickupPlaceholder"
                                        )}
                                        locations={transferLocations}
                                    />

                                </div>

                            </div>

                            {/* ROUTE ARROW */}

                            <div className="transfer-route-arrow">
                                →
                            </div>

                            {/* DESTINATION */}

                            <div className="transfer-field transfer-location-field">

                                <span className="transfer-field-icon">
                                    🏁
                                </span>

                                <div>

                                    <label htmlFor="destination">
                                        {t(
                                            "destination"
                                        )}
                                    </label>

                                    <TransferLocationInput
                                        value={destination}
                                        onChange={(value) => {
                                            setDestination(value);
                                        }}
                                        onSelect={(location) => {
                                            setDestination(location.name);
                                        }}
                                        placeholder={t(
                                            "destinationPlaceholder"
                                        )}
                                        locations={destinationLocations}
                                    />

                                </div>

                            </div>

                            {/* DATE */}

                            <div className="transfer-field">

                                <span className="transfer-field-icon">
                                    📅
                                </span>

                                <div>

                                    <label htmlFor="transfer-date">
                                        {t("date")}
                                    </label>

                                    <input
                                        id="transfer-date"
                                        type="date"
                                        value={date}
                                        min={todayDate}
                                        onChange={(event) =>
                                            setDate(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>

                            {/* TIME */}

                            <div className="transfer-field">

                                <span className="transfer-field-icon">
                                    🕐
                                </span>

                                <div>

                                    <label htmlFor="transfer-time">
                                        {t("time")}
                                    </label>

                                    <input
                                        id="transfer-time"
                                        type="time"
                                        value={
                                            time
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setTime(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>

                            {/* RETURN DATE + RETURN TIME */}

                            {transferType ===
                                "return" && (
                                    <>
                                        <div className="transfer-field return-date-field">

                                            <span className="transfer-field-icon">
                                                📅
                                            </span>

                                            <div>

                                                <label htmlFor="return-date">
                                                    {t(
                                                        "returnDate"
                                                    )}
                                                </label>

                                                <input
                                                    id="return-date"
                                                    type="date"
                                                    value={returnDate}
                                                    min={date || todayDate}
                                                    onChange={(event) =>
                                                        setReturnDate(
                                                            event.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>

                                        </div>

                                        <div className="transfer-field return-time-field">

                                            <span className="transfer-field-icon">
                                                🕐
                                            </span>

                                            <div>

                                                <label htmlFor="return-time">
                                                    {t(
                                                        "returnTime"
                                                    )}
                                                </label>

                                                <input
                                                    id="return-time"
                                                    type="time"
                                                    value={
                                                        returnTime
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setReturnTime(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>

                                        </div>
                                    </>
                                )}

                            {/* PASSENGERS */}

                            <div className="transfer-field passengers-field">

                                <span className="transfer-field-icon">
                                    👤
                                </span>

                                <div>

                                    <label htmlFor="passengers">
                                        {t(
                                            "passengers"
                                        )}
                                    </label>

                                    <select
                                        id="passengers"
                                        value={
                                            passengers
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setPassengers(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    >

                                        <option value="1">
                                            {`${1} ${t("passengers")}`}
                                        </option>

                                        <option value="2">
                                            {`${2} ${t("passengers")}`}
                                        </option>

                                        <option value="3">
                                            {`${3} ${t("passengers")}`}
                                        </option>

                                        <option value="4">
                                            {`${4} ${t("passengers")}`}
                                        </option>

                                        <option value="5">
                                            {`${5} ${t("passengers")}`}
                                        </option>

                                        <option value="6">
                                            {`${6} ${t("passengers")}`}
                                        </option>

                                        <option value="7">
                                            {`${7} ${t("passengers")}`}
                                        </option>

                                        <option value="8">
                                            {`${8} ${t("passengers")}`}
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* SEARCH */}

                            <button
                                type="submit"
                                className="transfers-search-button"
                            >
                                {t(
                                    "searchTransfers"
                                )}
                            </button>

                        </form>

                    </div>

                </div>
            </section>

            {/* BENEFITS */}

            <section className="transfers-benefits stayway-load-in stayway-load-2">

                <div className="transfers-container">

                    <div className="transfers-section-heading">

                        <span className="transfers-eyebrow">
                            {t("whyStayWay")}
                        </span>

                        <h2>
                            {t(
                                "yourJourneyStarts"
                            )}
                            <br />
                            {t(
                                "beforeYouArrive"
                            )}
                        </h2>

                    </div>

                    <div className="transfers-benefits-grid">

                        <article className="transfer-benefit-card">

                            <div className="transfer-benefit-icon">
                                ✓
                            </div>

                            <h3>
                                {t(
                                    "fixedPrices"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "fixedPrices"
                                )}
                            </p>

                        </article>

                        <article className="transfer-benefit-card">

                            <div className="transfer-benefit-icon">
                                ◷
                            </div>

                            <h3>
                                {t(
                                    "onTimePickup"
                                )}
                            </h3>

                            <p>
                                {t("onTimeDescription")}
                            </p>

                        </article>

                        <article className="transfer-benefit-card">

                            <div className="transfer-benefit-icon">
                                ♡
                            </div>

                            <h3>
                                {t(
                                    "travelComfortably"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "comfortDescriptionBenefit"
                                )}
                            </p>

                        </article>

                    </div>

                </div>

            </section>

            {/* SEARCH RESULTS */}

            <section
                id="transfer-options"
                className={`transfers-options ${
                    searched
                        ? "is-visible stayway-load-in stayway-load-3"
                        : ""
                }`}
            >

                <div className="transfers-container">

                    <div className="transfers-section-heading centered">

                        <span className="transfers-eyebrow">
                            {t(
                                "transferOptions"
                            )}
                        </span>

                        <h2>
                            {t(
                                "chooseTheRide"
                            )}
                            <br />
                            {t(
                                "thatFits"
                            )}
                        </h2>

                        {searched && (
                            <p className="transfer-search-summary">
                                {pickup}
                                <span>
                                    →
                                </span>
                                {destination}
                            </p>
                        )}

                    </div>

                    <div className="transfers-options-grid">

                        {transferOptions.map(
                            (option) => (
                                <article
                                    className="transfer-option-card"
                                    key={
                                        option.id
                                    }
                                >

                                    <div className="transfer-option-top">

                                        <span className="transfer-option-badge">
                                            {option.id ===
                                            1
                                                ? "01"
                                                : option.id ===
                                                2
                                                    ? "02"
                                                    : "03"}
                                        </span>

                                        <div className="transfer-car-icon">
                                            {
                                                option.icon
                                            }
                                        </div>

                                        <div className="transfer-option-price">

                                            <span>
                                                {t(
                                                    "from"
                                                )}
                                            </span>

                                            <strong>
                                                {formatPrice(
                                                    option.price
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                    <h3>
                                        {t(
                                            option.titleKey
                                        )}
                                    </h3>

                                    <p className="transfer-option-description">
                                        {t(
                                            option.descriptionKey
                                        )}
                                    </p>

                                    <div className="transfer-option-details">

                                        <span>
                                            👤{" "}
                                            {t(
                                                "upTo"
                                            )}{" "}
                                            {
                                                option.passengers
                                            }{" "}
                                            {t(
                                                "passengers"
                                            ).toLowerCase()}
                                        </span>

                                        <span>
                                            🧳{" "}
                                            {
                                                option.luggage
                                            }{" "}
                                            {t(
                                                "suitcases"
                                            )}
                                        </span>

                                        <span>
                                            ◷{" "}
                                            {t(
                                                "approx"
                                            )}{" "}
                                            {
                                                option.duration
                                            }{" "}
                                            {t(
                                                "minutes"
                                            )}
                                        </span>

                                    </div>

                                    {/* SELECT TRANSFER */}

                                    <button
                                        type="button"
                                        className="transfer-select-button"
                                        onClick={() => {

                                            if (
                                                !isAuthenticated()
                                            ) {
                                                window.location.href =
                                                    `/401?from=${encodeURIComponent(
                                                        "/transfers"
                                                    )}`;

                                                return;
                                            }

                                            const params =
                                                new URLSearchParams();

                                            params.set(
                                                "transferType",
                                                transferType
                                            );

                                            params.set(
                                                "optionId",
                                                String(
                                                    option.id
                                                )
                                            );

                                            params.set(
                                                "optionTitle",
                                                t(
                                                    option.titleKey
                                                )
                                            );

                                            params.set(
                                                "price",
                                                String(
                                                    option.price
                                                )
                                            );

                                            params.set(
                                                "pickup",
                                                pickup
                                            );

                                            params.set(
                                                "destination",
                                                destination
                                            );

                                            params.set(
                                                "date",
                                                date
                                            );

                                            params.set(
                                                "time",
                                                time
                                            );

                                            params.set(
                                                "passengers",
                                                passengers
                                            );

                                            if (
                                                transferType ===
                                                "return"
                                            ) {
                                                params.set(
                                                    "returnDate",
                                                    returnDate
                                                );

                                                params.set(
                                                    "returnTime",
                                                    returnTime
                                                );
                                            }

                                            window.location.href =
                                                `/transfers/checkout?${params.toString()}`;
                                        }}
                                    >
                                        {t(
                                            "selectTransfer"
                                        )}
                                    </button>

                                </article>
                            )
                        )}

                    </div>

                </div>

            </section>

            {/* HOW IT WORKS */}

            <section className="transfers-how-it-works stayway-load-in stayway-load-3">

                <div className="transfers-container">

                    <div className="transfers-how-grid">

                        <div className="transfers-section-heading">

                            <span className="transfers-eyebrow">
                                {t(
                                    "howItWorks"
                                )}
                            </span>

                            <h2>
                                {t(
                                    "fromAirport"
                                )}
                                <br />
                                {t(
                                    "toDoorstep"
                                )}
                            </h2>

                            <p>
                                {t(
                                    "howDescription"
                                )}
                            </p>

                        </div>

                        <div className="transfer-steps">

                            <div className="transfer-step">

                                <span className="transfer-step-number">
                                    01
                                </span>

                                <div>

                                    <h3>
                                        {t(
                                            "tellUsWhere"
                                        )}
                                    </h3>

                                    <p>
                                        {t(
                                            "tellUsDescription"
                                        )}
                                    </p>

                                </div>

                            </div>

                            <div className="transfer-step">

                                <span className="transfer-step-number">
                                    02
                                </span>

                                <div>

                                    <h3>
                                        {t(
                                            "chooseYourRide"
                                        )}
                                    </h3>

                                    <p>
                                        {t(
                                            "chooseRideDescription"
                                        )}
                                    </p>

                                </div>

                            </div>

                            <div className="transfer-step">

                                <span className="transfer-step-number">
                                    03
                                </span>

                                <div>

                                    <h3>
                                        {t(
                                            "enjoyJourney"
                                        )}
                                    </h3>

                                    <p>
                                        {t(
                                            "enjoyDescription"
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="transfers-cta stayway-load-in stayway-load-4">

                <div className="transfers-container">

                    <div className="transfers-cta-card">

                        <div>

                            <span className="transfers-eyebrow">
                                {t(
                                    "travelWith"
                                )}
                            </span>

                            <h2>
                                {t(
                                    "arriveRelaxed"
                                )}
                                <br />
                                {t(
                                    "leaveRest"
                                )}
                            </h2>

                        </div>

                        <Link
                            href="/stays"
                            className="transfers-cta-button"
                        >
                            {t(
                                "exploreStays"
                            )}
                        </Link>

                    </div>

                </div>

            </section>

            <style jsx>{`

    .transfers-page {
    --tw-purple: #7055e8;
    --tw-purple-dark: #5d43d4;
    --tw-ink: #272333;
    --tw-muted: #746d80;
    --tw-border: #e9e4f2;

    overflow: visible;
    background: #fff;
}

.transfers-container {
    width: min(
        1360px,
        calc(100% - 64px)
    );

    margin: 0 auto;
}

.transfers-hero {
    position: relative;
    z-index: 10;
    overflow: visible;
    padding: 68px 0 64px;

    background:
        linear-gradient(
            135deg,
            #f7f3ff 0%,
            #f3efff 52%,
            #faf8ff 100%
        );

    isolation: isolate;
}

.transfers-hero::after {
    content: "";
    position: absolute;
    inset: auto 0 0;
    height: 1px;
    background:
        rgba(
            112,
            85,
            232,
            0.08
        );
}

.transfers-hero-content {
    max-width: 760px;
    position: relative;
    z-index: 2;
    transform: translateX(60px);
}

.transfers-hero-image {
    position: absolute;
    top: -20px;
    right: 7%;
    width: min(
        33%,
        660px
    );
    z-index: 1;
    pointer-events: none;
}

.transfers-hero-image img {
    display: block;
    width: 85%;
    height: auto;
    object-fit: contain;
}

.transfers-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    color: var(--tw-purple);

    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}

.transfers-eyebrow::before {
    content: "";
    width: 22px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
}

.transfers-hero h1 {
    margin: 18px 0 18px;
    max-width: 680px;

    color: var(--tw-ink);

    font-size:
        clamp(
            42px,
            4.2vw,
            58px
        );

    line-height: 1.02;
    letter-spacing: -0.045em;
    font-weight: 850;
}

.transfers-hero h1 span {
    color: var(--tw-purple);
}

.transfers-hero-content > p {
    max-width: 620px;
    margin: 0;

    color: var(--tw-muted);

    font-size: 17px;
    line-height: 1.7;
}

.transfers-search-card {
    position: relative;
    z-index: 4;

    margin-top: 85px;
    padding: 16px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.92
        );

    border-radius: 26px;

    background:
        rgba(
            255,
            255,
            255,
            0.92
        );

    box-shadow:
        0 28px 70px
        rgba(
            69,
            49,
            125,
            0.12
        ),
        0 5px 18px
        rgba(
            69,
            49,
            125,
            0.05
        );

    backdrop-filter: blur(18px);
}

.transfers-type-switch {
    display: inline-flex;
    padding: 4px;
    margin-bottom: 12px;

    border-radius: 14px;
    background: #f5f1ff;
}

.transfers-type-switch button {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    min-height: 38px;
    padding: 0 14px;

    border: 0;
    border-radius: 11px;

    background: transparent;
    color: #7c748b;

    font-weight: 750;

    cursor: pointer;
    transition: 180ms ease;
}

.transfers-type-switch button.active {
    color: var(--tw-purple);
    background: #fff;

    box-shadow:
        0 5px 14px
        rgba(
            80,
            57,
            150,
            0.09
        );
}

.transfer-radio {
    display: grid;
    place-items: center;

    width: 18px;
    height: 18px;

    border:
        1.5px solid
        #bdb2dd;

    border-radius: 50%;

    font-size: 10px;
}

.active .transfer-radio {
    border-color:
        var(--tw-purple);

    color: #fff;
    background:
        var(--tw-purple);
}

.transfers-form {
    display: grid;

    grid-template-columns:
        minmax(230px, 1.35fr)
        30px
        minmax(230px, 1.35fr)
        minmax(150px, 0.9fr)
        minmax(150px, 0.9fr)
        minmax(160px, 0.95fr)
        minmax(145px, 0.9fr)
        auto;

    gap: 10px;
    align-items: stretch;
}

.transfer-field {
    min-width: 0;
    min-height: 68px;

    display: flex;
    align-items: center;
    gap: 10px;

    padding: 12px 13px;

    border:
        1px solid
        var(--tw-border);

    border-radius: 15px;

    background: #fff;

    transition: 180ms ease;
}

.transfer-field:focus-within {
    border-color: #b9aaf5;

    box-shadow:
        0 0 0 4px
        rgba(
            112,
            85,
            232,
            0.08
        );
}

.transfer-location-field > div,
.transfer-field > div {
    min-width: 0;
    flex: 1;
}

.transfer-field-icon {
    flex: 0 0 auto;

    display: grid;
    place-items: center;

    width: 30px;
    height: 30px;

    border-radius: 9px;
    background: #f0ebff;

    font-size: 15px;
}

.transfer-field label {
    display: block;
    margin-bottom: 4px;

    color: #7d7688;

    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.03em;
}

.transfer-field input,
.transfer-field select {
    width: 100%;
    min-width: 0;

    padding: 0;

    border: 0;
    outline: 0;

    background: transparent;
    color: var(--tw-ink);

    font-size: 13px;
    font-weight: 650;
}

.transfer-field input::placeholder {
    color: #aaa3b2;
}

.transfer-route-arrow {
    display: grid;
    place-items: center;

    color: var(--tw-purple);

    font-size: 23px;
    font-weight: 700;
}

.transfers-form.is-return
.return-date-field {
    grid-column: 4;
    grid-row: 2;
}

.transfers-form.is-return
.return-time-field {
    grid-column: 5;
    grid-row: 2;
}

.transfers-form.is-return
.passengers-field {
    grid-column: 6;
    grid-row: 1;
}

.transfers-form.is-return
.transfers-search-button {
    grid-column: 6;
    grid-row: 2;

    width: 100%;
    min-width: 0;

    justify-self: stretch;
    align-self: stretch;

    box-sizing: border-box;
}

.transfers-search-button {
    align-self: stretch;

    min-width: 142px;
    padding: 0 22px;

    border: 0;
    border-radius: 15px;

    color: #fff;

    background:
        linear-gradient(
            135deg,
            var(--tw-purple),
            var(--tw-purple-dark)
        );

    font-weight: 800;

    cursor: pointer;

    box-shadow:
        0 12px 25px
        rgba(
            112,
            85,
            232,
            0.24
        );

    transition:
        transform 180ms ease,
        box-shadow 180ms ease;
}

.transfers-search-button:hover,
.transfer-select-button:hover,
.transfers-cta-button:hover {
    transform:
        translateY(-2px);

    box-shadow:
        0 16px 30px
        rgba(
            112,
            85,
            232,
            0.28
        );
}

.transfers-benefits {
    padding: 68px 0 72px;
    background: #fff;
}

.transfers-section-heading h2 {
    margin: 14px 0 0;

    color: var(--tw-ink);

    font-size:
        clamp(
            38px,
            4vw,
            58px
        );

    line-height: 1.02;
    letter-spacing: -0.045em;
    font-weight: 850;
}

.transfers-benefits
    .transfers-section-heading {
    max-width: 700px;
}

.transfers-benefits-grid {
    display: grid;

    grid-template-columns:
        repeat(
            3,
            minmax(0, 1fr)
        );

    gap: 18px;
    margin-top: 30px;
}

.transfer-benefit-card {
    position: relative;

    min-height: 190px;
    padding: 26px;

    border:
        1.5px solid
        #d9d0ff;

    border-radius: 22px;

    background:
        linear-gradient(
            145deg,
            #f8f5ff,
            #f1ebff
        );

    box-shadow:
        0 12px 32px
        rgba(
            54,
            40,
            91,
            0.045
        );

    transition:
        transform 180ms ease,
        box-shadow 180ms ease;
}

.transfer-benefit-card:hover {
    transform:
        translateY(-4px);

    box-shadow:
        0 20px 40px
        rgba(
            54,
            40,
            91,
            0.09
        );
}

.transfer-benefit-icon,
.transfer-car-icon {
    display: grid;
    place-items: center;

    width: 54px;
    height: 54px;

    border-radius: 17px;

    color: var(--tw-purple);
    background: #f0ebff;

    font-size: 21px;
    font-weight: 800;
}

.transfer-benefit-card h3 {
    margin: 22px 0 8px;

    color: var(--tw-ink);

    font-size: 19px;
    letter-spacing: -0.02em;
}

.transfer-benefit-card p,
.transfer-option-description,
.transfers-how-it-works
    .transfers-section-heading
    > p,
.transfer-step p {
    color: var(--tw-muted);
    line-height: 1.65;
}

.transfer-benefit-card p {
    margin: 0;
    font-size: 14px;
}

.transfers-options {
    padding: 40px 0 80px;

    background:
        linear-gradient(
            180deg,
            #f8f5ff 0%,
            #f5f1ff 100%
        );
}

.transfers-section-heading.centered {
    text-align: center;

    max-width: 720px;
    margin: 0 auto;
}

.transfer-search-summary {
    display: inline-flex;
    align-items: center;
    gap: 10px;

    margin: 20px 0 0;
    padding: 9px 14px;

    border:
        1px solid
        #e7e0fa;

    border-radius: 999px;

    color: #655b78;

    background:
        rgba(
            255,
            255,
            255,
            0.72
        );

    font-size: 13px;
    font-weight: 700;
}

.transfer-search-summary span {
    color:
        var(--tw-purple);
}

.transfers-options-grid {
    display: grid;

    grid-template-columns:
        repeat(
            3,
            minmax(0, 1fr)
        );

    gap: 20px;
    margin-top: 48px;
}

.transfer-option-card {
    position: relative;

    display: flex;
    flex-direction: column;

    min-height: 390px;
    padding: 27px;

    overflow: hidden;

    border:
        1px solid
        #e6e0f0;

    border-radius: 24px;

    background: #fff;

    box-shadow:
        0 18px 45px
        rgba(
            60,
            42,
            103,
            0.08
        );

    transition:
        transform 200ms ease,
        box-shadow 200ms ease,
        border-color 200ms ease;
}

.transfer-option-card::before {
    content: "";

    position: absolute;

    width: 180px;
    height: 180px;

    top: -115px;
    right: -80px;

    border-radius: 50%;

    background:
        #f0ebff;
}

.transfer-option-card:hover {
    transform:
        translateY(-6px);

    border-color:
        #d8cef5;

    box-shadow:
        0 28px 58px
        rgba(
            60,
            42,
            103,
            0.13
        );
}

.transfer-option-top {
    position: relative;

    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 16px;
}

.transfer-option-badge {
    position: absolute;

    top: 1px;
    left: 66px;

    color: #a49bae;

    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
}

.transfer-car-icon {
    position: relative;
    z-index: 1;

    width: 58px;
    height: 58px;

    font-size: 24px;
}

.transfer-option-price {
    position: relative;
    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.transfer-option-price span {
    color: #9991a4;
    font-size: 11px;
}

.transfer-option-price strong {
    color: var(--tw-ink);

    font-size: 28px;
    line-height: 1.05;

    letter-spacing: -0.04em;
}

.transfer-option-card h3 {
    margin: 29px 0 9px;

    color: var(--tw-ink);

    font-size: 21px;
    letter-spacing: -0.025em;
}

.transfer-option-description {
    min-height: 52px;
    margin: 0;

    font-size: 14px;
}

.transfer-option-details {
    display: grid;
    gap: 10px;

    margin: 23px 0;
    padding: 19px 0;

    border-top:
        1px solid
        #eeeaf5;

    border-bottom:
        1px solid
        #eeeaf5;
}

.transfer-option-details span {
    color: #645d70;

    font-size: 13px;
    font-weight: 650;
}

.transfer-select-button {
    width: 100%;

    margin-top: auto;

    min-height: 48px;

    border: 0;
    border-radius: 14px;

    color: #fff;

    background:
        linear-gradient(
            135deg,
            var(--tw-purple),
            var(--tw-purple-dark)
        );

    font-weight: 800;

    cursor: pointer;

    transition:
        transform 180ms ease,
        box-shadow 180ms ease;
}

.transfer-steps {
    position: relative;

    display: flex;
    flex-direction: column;

    gap: 22px;
}

.transfer-steps::before {
    content: "";

    position: absolute;

    left: 23px;
    top: 48px;
    bottom: 48px;

    width: 2px;

    background:
        linear-gradient(
            to bottom,
            #ddd2ff,
            #8b5cf6,
            #ddd2ff
        );
}

.transfer-step {
    position: relative;

    display: flex;
    align-items: center;

    gap: 22px;

    padding:
        24px
        30px
        24px
        20px;

    background:
        linear-gradient(
            135deg,
            #ffffff 0%,
            #faf8ff 55%,
            #f3eeff 100%
        );

    border:
        1px solid
        #ddd2ff;

    border-radius: 20px;

    box-shadow:
        0 10px 30px
        rgba(
            109,
            72,
            246,
            0.08
        );

    transition:
        all 0.25s ease;
}

.transfer-step:hover {
    transform:
        translateX(5px);

    border-color:
        #a78bfa;

    box-shadow:
        0 14px 35px
        rgba(
            109,
            72,
            246,
            0.14
        );
}

.transfer-step-number {
    position: relative;
    z-index: 2;

    flex-shrink: 0;

    width: 48px;
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background:
        linear-gradient(
            135deg,
            #7c3aed,
            #6d4df5
        );

    color: white;

    font-size: 13px;
    font-weight: 700;

    box-shadow:
        0 8px 18px
        rgba(
            109,
            72,
            246,
            0.28
        ),
        0 0 0 6px
        #f0eaff;
}

.transfer-step h3 {
    margin: 0 0 7px;

    color: #27213a;

    font-size: 18px;
    font-weight: 700;
}

.transfer-step p {
    margin: 0;

    color: #746d85;

    font-size: 14px;
    line-height: 1.6;
}

.transfers-cta {
    padding: 0 0 110px;
    background: #fff;
}

.transfers-cta-card {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 35px;

    padding: 55px 58px;

    border-radius: 30px;

    background:
        radial-gradient(
            circle at 88% 15%,
            rgba(
                112,
                85,
                232,
                0.18
            )
            0 90px,
            transparent 91px
        ),
        linear-gradient(
            135deg,
            #eee8ff,
            #f6f2ff
        );

    box-shadow:
        0 20px 55px
        rgba(
            64,
            44,
            112,
            0.08
        );
}

.transfers-cta-card h2 {
    margin: 14px 0 0;

    color: var(--tw-ink);

    font-size:
        clamp(
            34px,
            4vw,
            54px
        );

    line-height: 0.98;
    letter-spacing: -0.045em;
}

.transfers-cta-button {
    flex: 0 0 auto;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-height: 50px;
    padding: 0 23px;

    border-radius: 14px;

    color: #fff;

    background:
        linear-gradient(
            135deg,
            var(--tw-purple),
            var(--tw-purple-dark)
        );

    font-weight: 800;
    text-decoration: none;

    box-shadow:
        0 12px 25px
        rgba(
            112,
            85,
            232,
            0.22
        );

    transition:
        transform 180ms ease,
        box-shadow 180ms ease;
}



/* =========================================================
   TRANSFERS — DARK THEME
   Colors only. No layout / spacing / sizing changes.
========================================================= */

:global(html[data-theme="dark"]) .transfers-page {
    --tw-ink: #f7f9ff;
    --tw-muted: #c8d0df;
    --tw-border: #344158;
    background: #0f1a2d;
    color: #f7f9ff;
}

/* HERO */
:global(html[data-theme="dark"]) .transfers-hero {
    background:
        linear-gradient(
            135deg,
            #0f1a2d 0%,
            #15213a 52%,
            #111c30 100%
        );
}

:global(html[data-theme="dark"]) .transfers-hero::after {
    background: rgba(155, 132, 255, 0.16);
}

:global(html[data-theme="dark"]) .transfers-eyebrow {
    color: #9b87ff;
}

:global(html[data-theme="dark"]) .transfers-hero h1,
:global(html[data-theme="dark"]) .transfers-section-heading h2,
:global(html[data-theme="dark"]) .transfer-benefit-card h3,
:global(html[data-theme="dark"]) .transfer-option-card h3,
:global(html[data-theme="dark"]) .transfer-step h3,
:global(html[data-theme="dark"]) .transfers-cta-card h2 {
    color: #f8f9ff;
}

:global(html[data-theme="dark"]) .transfers-hero h1 span {
    color: #8f79ff;
}

:global(html[data-theme="dark"]) .transfers-hero-content > p,
:global(html[data-theme="dark"]) .transfer-benefit-card p,
:global(html[data-theme="dark"]) .transfer-option-description,
:global(html[data-theme="dark"]) .transfers-how-it-works .transfers-section-heading > p,
:global(html[data-theme="dark"]) .transfer-step p {
    color: #c8d0df;
}

/* SEARCH CARD */
    :global(html[data-theme="dark"]) .transfers-search-card {
        background: #1e2d46;
        border: 1px solid #40516d;
        box-shadow:
                0 20px 50px rgba(0, 0, 0, 0.18);
    }

:global(html[data-theme="dark"]) .transfers-type-switch {
    background: #17263d;
}

:global(html[data-theme="dark"]) .transfers-type-switch button {
    color: #c5cddd;
}

:global(html[data-theme="dark"]) .transfers-type-switch button.active {
    color: #a99cff;
    background: #2b3d5c;
    box-shadow: none;
}

:global(html[data-theme="dark"]) .transfer-radio {
    border-color: #788399;
}

:global(html[data-theme="dark"]) .active .transfer-radio {
    border-color: #836cff;
    background: #7055e8;
    color: #ffffff;
}

:global(html[data-theme="dark"]) .transfer-field {
    background: #22324d;
    border-color: #435574;
}

:global(html[data-theme="dark"]) .transfer-field:focus-within {
    border-color: #8e7cff;
    box-shadow: 0 0 0 4px rgba(142, 124, 255, 0.13);
}

:global(html[data-theme="dark"]) .transfer-field-icon {
    background: #2a3c59;
}

:global(html[data-theme="dark"]) .transfer-field label {
    color: #d0d6e3;
}

:global(html[data-theme="dark"]) .transfer-field input,
:global(html[data-theme="dark"]) .transfer-field select {
    color: #f7f9ff;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    color-scheme: normal;
}

:global(html[data-theme="dark"]) .transfer-field input::placeholder {
    color: #aeb8ca;
    opacity: 1;
}

:global(html[data-theme="dark"]) .transfer-field option {
    background: #17243a;
    color: #f7f9ff;
}


:global(html[data-theme="dark"]) .transfer-field input[type="date"],
:global(html[data-theme="dark"]) .transfer-field input[type="time"],
:global(html[data-theme="dark"]) .transfer-field select {
    -webkit-appearance: auto;
    appearance: auto;
    background-color: transparent !important;
}

:global(html[data-theme="dark"]) .transfer-field input::-webkit-datetime-edit,
:global(html[data-theme="dark"]) .transfer-field input::-webkit-datetime-edit-fields-wrapper,
:global(html[data-theme="dark"]) .transfer-field input::-webkit-datetime-edit-text,
:global(html[data-theme="dark"]) .transfer-field input::-webkit-datetime-edit-month-field,
:global(html[data-theme="dark"]) .transfer-field input::-webkit-datetime-edit-day-field,
:global(html[data-theme="dark"]) .transfer-field input::-webkit-datetime-edit-year-field,
:global(html[data-theme="dark"]) .transfer-field input::-webkit-datetime-edit-hour-field,
:global(html[data-theme="dark"]) .transfer-field input::-webkit-datetime-edit-minute-field {
    background: transparent !important;
    color: #f7f9ff !important;
}

/* TransferLocationInput lives in another component */
:global(html[data-theme="dark"]) .transfer-location-input input {
    color: #f7f9ff !important;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    color-scheme: normal;
}

:global(html[data-theme="dark"]) .transfer-location-input input::placeholder {
    color: #aeb8ca !important;
    opacity: 1;
}

:global(html[data-theme="dark"]) .transfer-location-suggestions {
    background: #17243a !important;
    border-color: #3a4861 !important;
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.30) !important;
}

:global(html[data-theme="dark"]) .transfer-location-suggestion:hover {
    background: #22314a !important;
}

:global(html[data-theme="dark"]) .transfer-location-icon {
    background: #293752 !important;
    color: #a997ff !important;
}

:global(html[data-theme="dark"]) .transfer-location-name {
    color: #f7f9ff !important;
}

:global(html[data-theme="dark"]) .transfer-location-meta {
    color: #bdc7d8 !important;
}

/* BENEFITS */
:global(html[data-theme="dark"]) .transfers-benefits {
    background: #111c30;
}

:global(html[data-theme="dark"]) .transfer-benefit-card {
    border-color: #3b4862;
    background:
        linear-gradient(
            145deg,
            #17243a,
            #1b2942
        );
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

:global(html[data-theme="dark"]) .transfer-benefit-card:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.24);
}

:global(html[data-theme="dark"]) .transfer-benefit-icon,
:global(html[data-theme="dark"]) .transfer-car-icon {
    color: #a18eff;
    background: #25334d;
}

/* TRANSFER OPTIONS */
:global(html[data-theme="dark"]) .transfers-options {
    background:
        linear-gradient(
            180deg,
            #0f1a2d 0%,
            #131f34 100%
        );
}

:global(html[data-theme="dark"]) .transfer-search-summary {
    border-color: #3c4961;
    color: #e0e5ef;
    background: #19263d;
}

:global(html[data-theme="dark"]) .transfer-option-card {
    border-color: #38465f;
    background: #18253a;
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.20);
}

:global(html[data-theme="dark"]) .transfer-option-card::before {
    background: #22304a;
}

:global(html[data-theme="dark"]) .transfer-option-card:hover {
    border-color: #6659a8;
    box-shadow: 0 28px 58px rgba(0, 0, 0, 0.28);
}

:global(html[data-theme="dark"]) .transfer-option-badge {
    color: #c2cad9;
}

:global(html[data-theme="dark"]) .transfer-option-price span {
    color: #c1c9d8;
}

:global(html[data-theme="dark"]) .transfer-option-price strong {
    color: #ffffff;
}

:global(html[data-theme="dark"]) .transfer-option-details {
    border-top-color: #344159;
    border-bottom-color: #344159;
}

:global(html[data-theme="dark"]) .transfer-option-details span {
    color: #d8deea;
}

/* HOW IT WORKS */
:global(html[data-theme="dark"]) .transfers-how-it-works {
    background: #111c30;
}

:global(html[data-theme="dark"]) .transfer-steps::before {
    background:
        linear-gradient(
            to bottom,
            #4f4b7e,
            #8b5cf6,
            #4f4b7e
        );
}

:global(html[data-theme="dark"]) .transfer-step {
    background:
        linear-gradient(
            135deg,
            #17243a 0%,
            #1a2941 55%,
            #1e2d48 100%
        );
    border-color: #3a4861;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
}

:global(html[data-theme="dark"]) .transfer-step:hover {
    border-color: #7c6be1;
    box-shadow: 0 14px 35px rgba(0, 0, 0, 0.24);
}

:global(html[data-theme="dark"]) .transfer-step-number {
    box-shadow:
        0 8px 18px rgba(78, 60, 190, 0.28),
        0 0 0 6px #1b2942;
}

/* CTA */
:global(html[data-theme="dark"]) .transfers-cta {
    background: #0f1a2d;
}

:global(html[data-theme="dark"]) .transfers-cta-card {
    background:
        radial-gradient(
            circle at 88% 15%,
            rgba(135, 111, 255, 0.18) 0 90px,
            transparent 91px
        ),
        linear-gradient(
            135deg,
            #19263d,
            #1e2c47
        );
    border: 1px solid #35435c;
    box-shadow: 0 20px 55px rgba(0, 0, 0, 0.20);
}

@media (max-width: 1180px) {

.transfers-form {
    grid-template-columns:
        repeat(
            2,
            minmax(0, 1fr)
        );
}

.transfers-form.is-return
.return-date-field,
.transfers-form.is-return
.return-time-field,
.transfers-form.is-return
.passengers-field,
.transfers-form.is-return
.transfers-search-button {
    grid-column: auto;
    grid-row: auto;
}

.transfer-route-arrow {
    display: none;
}

.transfers-search-button {
    min-height: 62px;
}
}

@media (max-width: 800px) {

.transfers-how-grid
    > .transfers-section-heading {
    margin-top: 0;
}

.transfers-container {
    width:
        min(
            100% - 32px,
            680px
        );
}

.transfers-hero {
    padding:
        62px
        0
        48px;
}

.transfers-hero h1 {
    font-size:
        clamp(
            42px,
            11vw,
            64px
        );
}

.transfers-benefits,
.transfers-options,
.transfers-how-it-works {
    padding:
        25px
        0
        30px;
}

.transfers-how-grid
    > .transfers-section-heading {
    position: relative;
    top: 70px;
}

.transfers-benefits-grid,
.transfers-options-grid {
    grid-template-columns: 1fr;
}

.transfer-benefit-card {
    min-height: 0;
}

.transfers-how-grid {
    grid-template-columns: 1fr;
    gap: 48px;
}

.transfers-cta {
    padding-bottom: 78px;
}

.transfers-cta-card {
    align-items: flex-start;
    flex-direction: column;

    padding:
        38px
        30px;
}
}

@media (max-width: 560px) {

.transfers-container {
    width:
        min(
            100% - 24px,
            680px
        );
}

.transfers-hero {
    padding-top: 45px;
}

.transfers-search-card {
    margin-top: 32px;
    padding: 11px;
    border-radius: 20px;
}

.transfers-type-switch {
    display: flex;
    width: 100%;
}

.transfers-type-switch button {
    flex: 1;
    justify-content: center;
}

.transfers-form {
    grid-template-columns: 1fr;
}

.transfer-field {
    min-height: 58px;
}

.transfers-search-button {
    min-height: 56px;
}

.transfers-section-heading h2 {
    font-size: 39px;
}

.transfer-option-card {
    min-height: 0;
    padding: 23px;
}

.transfer-option-description {
    min-height: 0;
}

.transfer-step {
    grid-template-columns:
        42px
        1fr;

    gap: 13px;
}

.transfers-cta-card h2 {
    font-size: 38px;
}
}

`}</style>

        </main>
    );
}
