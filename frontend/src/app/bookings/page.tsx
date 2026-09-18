"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    Building2,
    DoorOpen,
    User,
    CalendarDays,
    Users,
    Tag,
    Circle,
    Search,
    SlidersHorizontal,
    X,
    Phone,
    Clock3,
    Mail,
} from "lucide-react";

import {
    getPropertiesFromApi,
} from "../../services/propertyService";

import {
    getRoomsFromApi,
} from "../../services/roomService";

import {
    getBookingsFromApi,
    getBookingsByUserIdFromApi,
    updateBookingInApi,
    type Booking,
} from "../../services/bookingService";

import { useSettings } from "../../context/SettingsContext";
import { useUser } from "../../context/UserContext";
import { currencyInfo } from "../../data/currency";
import { getTranslation } from "../../data/translations";

import {
    getTransferBookingsFromApi,
    updateTransferBookingInApi,
    type TransferBooking,
} from "../../services/transferService";

import {
    getTransferVehiclesFromApi,
} from "../../services/transferVehicleService";

import {
    getTransferDriversFromApi,
    type TransferDriver,
} from "../../services/transferDriverService";

import type {
    TransferVehicle,
} from "../../data/transferVehicles";

import type {
    Property,
    Room,
} from "../../types/types";


/* =========================================================
   BOOKING PAGE TRANSLATIONS
   ========================================================= */

const bookingPageTranslations: Record<string, Record<string, string>> = {
    "English": {"title": "Bookings", "searchAdmin": "Search by hotel, user or date...", "searchUser": "Search by hotel, room or date...", "searchBookings": "Search bookings", "filterUser": "Filter by user", "allUsers": "All users", "filterStatus": "Filter by status", "allStatuses": "All statuses", "confirmed": "Confirmed", "cancelled": "Cancelled", "pending": "Pending", "sortBookings": "Sort bookings", "newest": "Check-in: newest", "oldest": "Check-in: oldest", "totalHigh": "Total: high to low", "totalLow": "Total: low to high", "clear": "Clear", "clearSearch": "Clear search", "showing": "Showing", "of": "of", "bookings": "bookings", "noFound": "No bookings found", "tryFilters": "Try another search term or change the filters.", "property": "Property", "room": "Room", "user": "User", "unknownUser": "Unknown user", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Guests", "total": "Total", "status": "Status", "viewProperty": "View property", "cancelBooking": "Cancel booking", "roomNotSpecified": "Room not specified", "adult": "adult", "adults": "adults", "child": "child", "children": "children", "infant": "infant", "infants": "infants", "loading": "Loading booking...", "backProperty": "← Back to property", "backStays": "← Back to stays", "confirmBooking": "Confirm booking", "night": "night", "nights": "nights", "roomCapacity": "Room capacity", "guest": "guest", "guestsWord": "guests", "totalLabel": "Total", "errorDates": "Please select check-in and check-out dates.", "errorCheckInPast": "Check-in date cannot be in the past.", "errorCheckOutPast": "Check-out date cannot be in the past.", "errorOrder": "Check-out date must be after check-in date.", "errorAdult": "At least one adult is required.", "errorCapacity": "This room can accommodate up to {count} adults and children.", "errorLogin": "You must be logged in to make a booking.", "errorProperty": "Property not found.", "adultYears": "13+ years", "childYears": "2–12 years", "infantYears": "Under 2 years", "propertyNotFound": "Property not found."},
    "Română": {"title": "Rezervări", "searchAdmin": "Caută după hotel, utilizator sau dată...", "searchUser": "Caută după hotel, cameră sau dată...", "searchBookings": "Caută rezervări", "filterUser": "Filtrează după utilizator", "allUsers": "Toți utilizatorii", "filterStatus": "Filtrează după status", "allStatuses": "Toate statusurile", "confirmed": "Confirmată", "cancelled": "Anulată", "pending": "În așteptare", "sortBookings": "Sortează rezervările", "newest": "Check-in: cele mai noi", "oldest": "Check-in: cele mai vechi", "totalHigh": "Total: de la mare la mic", "totalLow": "Total: de la mic la mare", "clear": "Șterge", "clearSearch": "Șterge căutarea", "showing": "Se afișează", "of": "din", "bookings": "rezervări", "noFound": "Nu au fost găsite rezervări", "tryFilters": "Încearcă un alt termen de căutare sau schimbă filtrele.", "property": "Proprietate", "room": "Cameră", "user": "Utilizator", "unknownUser": "Utilizator necunoscut", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Oaspeți", "total": "Total", "status": "Status", "viewProperty": "Vezi proprietatea", "cancelBooking": "Anulează rezervarea", "roomNotSpecified": "Camera nu este specificată", "adult": "adult", "adults": "adulți", "child": "copil", "children": "copii", "infant": "bebeluș", "infants": "bebeluși", "loading": "Se încarcă rezervarea...", "backProperty": "← Înapoi la proprietate", "backStays": "← Înapoi la cazări", "confirmBooking": "Confirmă rezervarea", "night": "noapte", "nights": "nopți", "roomCapacity": "Capacitatea camerei", "guest": "oaspete", "guestsWord": "oaspeți", "totalLabel": "Total", "errorDates": "Selectează datele de check-in și check-out.", "errorCheckInPast": "Data de check-in nu poate fi în trecut.", "errorCheckOutPast": "Data de check-out nu poate fi în trecut.", "errorOrder": "Data de check-out trebuie să fie după data de check-in.", "errorAdult": "Este necesar cel puțin un adult.", "errorCapacity": "Această cameră poate găzdui până la {count} adulți și copii.", "errorLogin": "Trebuie să fii autentificat pentru a face o rezervare.", "errorProperty": "Proprietatea nu a fost găsită.", "adultYears": "13+ ani", "childYears": "2–12 ani", "infantYears": "Sub 2 ani", "propertyNotFound": "Proprietatea nu a fost găsită."},
    "Русский": {"title": "Бронирования", "searchAdmin": "Поиск по отелю, пользователю или дате...", "searchUser": "Поиск по отелю, номеру или дате...", "searchBookings": "Поиск бронирований", "filterUser": "Фильтр по пользователю", "allUsers": "Все пользователи", "filterStatus": "Фильтр по статусу", "allStatuses": "Все статусы", "confirmed": "Подтверждено", "cancelled": "Отменено", "pending": "Ожидает подтверждения", "sortBookings": "Сортировка бронирований", "newest": "Заезд: сначала новые", "oldest": "Заезд: сначала старые", "totalHigh": "Сумма: от большей к меньшей", "totalLow": "Сумма: от меньшей к большей", "clear": "Очистить", "clearSearch": "Очистить поиск", "showing": "Показано", "of": "из", "bookings": "бронирований", "noFound": "Бронирования не найдены", "tryFilters": "Попробуйте другой поисковый запрос или измените фильтры.", "property": "Объект", "room": "Номер", "user": "Пользователь", "unknownUser": "Неизвестный пользователь", "checkIn": "Заезд", "checkOut": "Выезд", "guests": "Гости", "total": "Итого", "status": "Статус", "viewProperty": "Посмотреть объект", "cancelBooking": "Отменить бронирование", "roomNotSpecified": "Номер не указан", "adult": "взрослый", "adults": "взрослых", "child": "ребёнок", "children": "детей", "infant": "младенец", "infants": "младенцев", "loading": "Загрузка бронирования...", "backProperty": "← Назад к объекту", "backStays": "← Назад к вариантам размещения", "confirmBooking": "Подтвердить бронирование", "night": "ночь", "nights": "ночи", "roomCapacity": "Вместимость номера", "guest": "гость", "guestsWord": "гостей", "totalLabel": "Итого", "errorDates": "Пожалуйста, выберите даты заезда и выезда.", "errorCheckInPast": "Дата заезда не может быть в прошлом.", "errorCheckOutPast": "Дата выезда не может быть в прошлом.", "errorOrder": "Дата выезда должна быть позже даты заезда.", "errorAdult": "Требуется хотя бы один взрослый.", "errorCapacity": "В этом номере могут разместиться до {count} взрослых и детей.", "errorLogin": "Для бронирования необходимо войти в аккаунт.", "errorProperty": "Объект не найден.", "adultYears": "13+ лет", "childYears": "2–12 лет", "infantYears": "До 2 лет", "propertyNotFound": "Объект не найден."},
    "Українська": {"title": "Бронювання", "searchAdmin": "Пошук за готелем, користувачем або датою...", "searchUser": "Пошук за готелем, номером або датою...", "searchBookings": "Пошук бронювань", "filterUser": "Фільтр за користувачем", "allUsers": "Усі користувачі", "filterStatus": "Фільтр за статусом", "allStatuses": "Усі статуси", "confirmed": "Підтверджено", "cancelled": "Скасовано", "pending": "Очікує підтвердження", "sortBookings": "Сортування бронювань", "newest": "Заїзд: спочатку нові", "oldest": "Заїзд: спочатку старі", "totalHigh": "Сума: від більшої до меншої", "totalLow": "Сума: від меншої до більшої", "clear": "Очистити", "clearSearch": "Очистити пошук", "showing": "Показано", "of": "з", "bookings": "бронювань", "noFound": "Бронювань не знайдено", "tryFilters": "Спробуйте інший пошуковий запит або змініть фільтри.", "property": "Об'єкт", "room": "Номер", "user": "Користувач", "unknownUser": "Невідомий користувач", "checkIn": "Заїзд", "checkOut": "Виїзд", "guests": "Гості", "total": "Всього", "status": "Статус", "viewProperty": "Переглянути об'єкт", "cancelBooking": "Скасувати бронювання", "roomNotSpecified": "Номер не вказано", "adult": "дорослий", "adults": "дорослих", "child": "дитина", "children": "дітей", "infant": "немовля", "infants": "немовлят", "loading": "Завантаження бронювання...", "backProperty": "← Назад до об'єкта", "backStays": "← Назад до помешкань", "confirmBooking": "Підтвердити бронювання", "night": "ніч", "nights": "ночі", "roomCapacity": "Місткість номера", "guest": "гість", "guestsWord": "гостей", "totalLabel": "Всього", "errorDates": "Будь ласка, виберіть дати заїзду та виїзду.", "errorCheckInPast": "Дата заїзду не може бути в минулому.", "errorCheckOutPast": "Дата виїзду не може бути в минулому.", "errorOrder": "Дата виїзду має бути пізнішою за дату заїзду.", "errorAdult": "Потрібен принаймні один дорослий.", "errorCapacity": "У цьому номері можуть розміститися до {count} дорослих і дітей.", "errorLogin": "Вам потрібно увійти в обліковий запис, щоб зробити бронювання.", "errorProperty": "Об'єкт не знайдено.", "adultYears": "13+ років", "childYears": "2–12 років", "infantYears": "До 2 років", "propertyNotFound": "Об'єкт не знайдено."},
    "Français": {"title": "Réservations", "searchAdmin": "Rechercher par hôtel, utilisateur ou date...", "searchUser": "Rechercher par hôtel, chambre ou date...", "searchBookings": "Rechercher des réservations", "filterUser": "Filtrer par utilisateur", "allUsers": "Tous les utilisateurs", "filterStatus": "Filtrer par statut", "allStatuses": "Tous les statuts", "confirmed": "Confirmée", "cancelled": "Annulée", "pending": "En attente", "sortBookings": "Trier les réservations", "newest": "Arrivée : plus récentes", "oldest": "Arrivée : plus anciennes", "totalHigh": "Total : du plus élevé au plus bas", "totalLow": "Total : du plus bas au plus élevé", "clear": "Effacer", "clearSearch": "Effacer la recherche", "showing": "Affichage de", "of": "sur", "bookings": "réservations", "noFound": "Aucune réservation trouvée", "tryFilters": "Essayez un autre terme de recherche ou modifiez les filtres.", "property": "Hébergement", "room": "Chambre", "user": "Utilisateur", "unknownUser": "Utilisateur inconnu", "checkIn": "Arrivée", "checkOut": "Départ", "guests": "Voyageurs", "total": "Total", "status": "Statut", "viewProperty": "Voir l'hébergement", "cancelBooking": "Annuler la réservation", "roomNotSpecified": "Chambre non spécifiée", "adult": "adulte", "adults": "adultes", "child": "enfant", "children": "enfants", "infant": "bébé", "infants": "bébés", "loading": "Chargement de la réservation...", "backProperty": "← Retour à l'hébergement", "backStays": "← Retour aux hébergements", "confirmBooking": "Confirmer la réservation", "night": "nuit", "nights": "nuits", "roomCapacity": "Capacité de la chambre", "guest": "voyageur", "guestsWord": "voyageurs", "totalLabel": "Total", "errorDates": "Veuillez sélectionner les dates d'arrivée et de départ.", "errorCheckInPast": "La date d'arrivée ne peut pas être dans le passé.", "errorCheckOutPast": "La date de départ ne peut pas être dans le passé.", "errorOrder": "La date de départ doit être postérieure à la date d'arrivée.", "errorAdult": "Au moins un adulte est requis.", "errorCapacity": "Cette chambre peut accueillir jusqu'à {count} adultes et enfants.", "errorLogin": "Vous devez être connecté pour effectuer une réservation.", "errorProperty": "Hébergement introuvable.", "adultYears": "13 ans et plus", "childYears": "2–12 ans", "infantYears": "Moins de 2 ans", "propertyNotFound": "Hébergement introuvable."},
    "Español": {"title": "Reservas", "searchAdmin": "Buscar por hotel, usuario o fecha...", "searchUser": "Buscar por hotel, habitación o fecha...", "searchBookings": "Buscar reservas", "filterUser": "Filtrar por usuario", "allUsers": "Todos los usuarios", "filterStatus": "Filtrar por estado", "allStatuses": "Todos los estados", "confirmed": "Confirmada", "cancelled": "Cancelada", "pending": "Pendiente", "sortBookings": "Ordenar reservas", "newest": "Entrada: más recientes", "oldest": "Entrada: más antiguas", "totalHigh": "Total: de mayor a menor", "totalLow": "Total: de menor a mayor", "clear": "Limpiar", "clearSearch": "Limpiar búsqueda", "showing": "Mostrando", "of": "de", "bookings": "reservas", "noFound": "No se encontraron reservas", "tryFilters": "Prueba otro término de búsqueda o cambia los filtros.", "property": "Alojamiento", "room": "Habitación", "user": "Usuario", "unknownUser": "Usuario desconocido", "checkIn": "Entrada", "checkOut": "Salida", "guests": "Huéspedes", "total": "Total", "status": "Estado", "viewProperty": "Ver alojamiento", "cancelBooking": "Cancelar reserva", "roomNotSpecified": "Habitación no especificada", "adult": "adulto", "adults": "adultos", "child": "niño", "children": "niños", "infant": "bebé", "infants": "bebés", "loading": "Cargando la reserva...", "backProperty": "← Volver al alojamiento", "backStays": "← Volver a los alojamientos", "confirmBooking": "Confirmar reserva", "night": "noche", "nights": "noches", "roomCapacity": "Capacidad de la habitación", "guest": "huésped", "guestsWord": "huéspedes", "totalLabel": "Total", "errorDates": "Selecciona las fechas de entrada y salida.", "errorCheckInPast": "La fecha de entrada no puede estar en el pasado.", "errorCheckOutPast": "La fecha de salida no puede estar en el pasado.", "errorOrder": "La fecha de salida debe ser posterior a la fecha de entrada.", "errorAdult": "Se requiere al menos un adulto.", "errorCapacity": "Esta habitación puede alojar hasta {count} adultos y niños.", "errorLogin": "Debes iniciar sesión para realizar una reserva.", "errorProperty": "Alojamiento no encontrado.", "adultYears": "13+ años", "childYears": "2–12 años", "infantYears": "Menos de 2 años", "propertyNotFound": "Alojamiento no encontrado."},
    "Deutsch": {"title": "Buchungen", "searchAdmin": "Nach Hotel, Benutzer oder Datum suchen...", "searchUser": "Nach Hotel, Zimmer oder Datum suchen...", "searchBookings": "Buchungen suchen", "filterUser": "Nach Benutzer filtern", "allUsers": "Alle Benutzer", "filterStatus": "Nach Status filtern", "allStatuses": "Alle Status", "confirmed": "Bestätigt", "cancelled": "Storniert", "pending": "Ausstehend", "sortBookings": "Buchungen sortieren", "newest": "Check-in: neueste zuerst", "oldest": "Check-in: älteste zuerst", "totalHigh": "Gesamt: absteigend", "totalLow": "Gesamt: aufsteigend", "clear": "Löschen", "clearSearch": "Suche löschen", "showing": "Angezeigt", "of": "von", "bookings": "Buchungen", "noFound": "Keine Buchungen gefunden", "tryFilters": "Versuche einen anderen Suchbegriff oder ändere die Filter.", "property": "Unterkunft", "room": "Zimmer", "user": "Benutzer", "unknownUser": "Unbekannter Benutzer", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Gäste", "total": "Gesamt", "status": "Status", "viewProperty": "Unterkunft ansehen", "cancelBooking": "Buchung stornieren", "roomNotSpecified": "Zimmer nicht angegeben", "adult": "Erwachsener", "adults": "Erwachsene", "child": "Kind", "children": "Kinder", "infant": "Baby", "infants": "Babys", "loading": "Buchung wird geladen...", "backProperty": "← Zurück zur Unterkunft", "backStays": "← Zurück zu den Unterkünften", "confirmBooking": "Buchung bestätigen", "night": "Nacht", "nights": "Nächte", "roomCapacity": "Zimmerkapazität", "guest": "Gast", "guestsWord": "Gäste", "totalLabel": "Gesamt", "errorDates": "Bitte wähle Check-in- und Check-out-Daten aus.", "errorCheckInPast": "Das Check-in-Datum darf nicht in der Vergangenheit liegen.", "errorCheckOutPast": "Das Check-out-Datum darf nicht in der Vergangenheit liegen.", "errorOrder": "Das Check-out-Datum muss nach dem Check-in-Datum liegen.", "errorAdult": "Mindestens ein Erwachsener ist erforderlich.", "errorCapacity": "Dieses Zimmer bietet Platz für bis zu {count} Erwachsene und Kinder.", "errorLogin": "Du musst angemeldet sein, um eine Buchung vorzunehmen.", "errorProperty": "Unterkunft nicht gefunden.", "adultYears": "13+ Jahre", "childYears": "2–12 Jahre", "infantYears": "Unter 2 Jahre", "propertyNotFound": "Unterkunft nicht gefunden."},
    "Italiano": {"title": "Prenotazioni", "searchAdmin": "Cerca per hotel, utente o data...", "searchUser": "Cerca per hotel, camera o data...", "searchBookings": "Cerca prenotazioni", "filterUser": "Filtra per utente", "allUsers": "Tutti gli utenti", "filterStatus": "Filtra per stato", "allStatuses": "Tutti gli stati", "confirmed": "Confermata", "cancelled": "Annullata", "pending": "In attesa", "sortBookings": "Ordina prenotazioni", "newest": "Check-in: più recenti", "oldest": "Check-in: meno recenti", "totalHigh": "Totale: dal più alto al più basso", "totalLow": "Totale: dal più basso al più alto", "clear": "Cancella", "clearSearch": "Cancella ricerca", "showing": "Visualizzate", "of": "di", "bookings": "prenotazioni", "noFound": "Nessuna prenotazione trovata", "tryFilters": "Prova un altro termine di ricerca o modifica i filtri.", "property": "Struttura", "room": "Camera", "user": "Utente", "unknownUser": "Utente sconosciuto", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Ospiti", "total": "Totale", "status": "Stato", "viewProperty": "Visualizza struttura", "cancelBooking": "Annulla prenotazione", "roomNotSpecified": "Camera non specificata", "adult": "adulto", "adults": "adulti", "child": "bambino", "children": "bambini", "infant": "neonato", "infants": "neonati", "loading": "Caricamento della prenotazione...", "backProperty": "← Torna alla struttura", "backStays": "← Torna alle strutture", "confirmBooking": "Conferma prenotazione", "night": "notte", "nights": "notti", "roomCapacity": "Capienza della camera", "guest": "ospite", "guestsWord": "ospiti", "totalLabel": "Totale", "errorDates": "Seleziona le date di check-in e check-out.", "errorCheckInPast": "La data di check-in non può essere nel passato.", "errorCheckOutPast": "La data di check-out non può essere nel passato.", "errorOrder": "La data di check-out deve essere successiva alla data di check-in.", "errorAdult": "È richiesto almeno un adulto.", "errorCapacity": "Questa camera può ospitare fino a {count} adulti e bambini.", "errorLogin": "Devi aver effettuato l'accesso per effettuare una prenotazione.", "errorProperty": "Struttura non trovata.", "adultYears": "13+ anni", "childYears": "2–12 anni", "infantYears": "Meno di 2 anni", "propertyNotFound": "Struttura non trovata."},
    "Português": {"title": "Reservas", "searchAdmin": "Pesquisar por hotel, utilizador ou data...", "searchUser": "Pesquisar por hotel, quarto ou data...", "searchBookings": "Pesquisar reservas", "filterUser": "Filtrar por utilizador", "allUsers": "Todos os utilizadores", "filterStatus": "Filtrar por estado", "allStatuses": "Todos os estados", "confirmed": "Confirmada", "cancelled": "Cancelada", "pending": "Pendente", "sortBookings": "Ordenar reservas", "newest": "Check-in: mais recentes", "oldest": "Check-in: mais antigas", "totalHigh": "Total: do maior para o menor", "totalLow": "Total: do menor para o maior", "clear": "Limpar", "clearSearch": "Limpar pesquisa", "showing": "A mostrar", "of": "de", "bookings": "reservas", "noFound": "Nenhuma reserva encontrada", "tryFilters": "Tente outro termo de pesquisa ou altere os filtros.", "property": "Alojamento", "room": "Quarto", "user": "Utilizador", "unknownUser": "Utilizador desconhecido", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Hóspedes", "total": "Total", "status": "Estado", "viewProperty": "Ver alojamento", "cancelBooking": "Cancelar reserva", "roomNotSpecified": "Quarto não especificado", "adult": "adulto", "adults": "adultos", "child": "criança", "children": "crianças", "infant": "bebé", "infants": "bebés", "loading": "A carregar a reserva...", "backProperty": "← Voltar ao alojamento", "backStays": "← Voltar aos alojamentos", "confirmBooking": "Confirmar reserva", "night": "noite", "nights": "noites", "roomCapacity": "Capacidade do quarto", "guest": "hóspede", "guestsWord": "hóspedes", "totalLabel": "Total", "errorDates": "Selecione as datas de check-in e check-out.", "errorCheckInPast": "A data de check-in não pode estar no passado.", "errorCheckOutPast": "A data de check-out não pode estar no passado.", "errorOrder": "A data de check-out deve ser posterior à data de check-in.", "errorAdult": "É necessário pelo menos um adulto.", "errorCapacity": "Este quarto pode acomodar até {count} adultos e crianças.", "errorLogin": "Tem de iniciar sessão para efetuar uma reserva.", "errorProperty": "Alojamento não encontrado.", "adultYears": "13+ anos", "childYears": "2–12 anos", "infantYears": "Menos de 2 anos", "propertyNotFound": "Alojamento não encontrado."},
    "Nederlands": {"title": "Boekingen", "searchAdmin": "Zoeken op hotel, gebruiker of datum...", "searchUser": "Zoeken op hotel, kamer of datum...", "searchBookings": "Boekingen zoeken", "filterUser": "Filteren op gebruiker", "allUsers": "Alle gebruikers", "filterStatus": "Filteren op status", "allStatuses": "Alle statussen", "confirmed": "Bevestigd", "cancelled": "Geannuleerd", "pending": "In afwachting", "sortBookings": "Boekingen sorteren", "newest": "Check-in: nieuwste", "oldest": "Check-in: oudste", "totalHigh": "Totaal: hoog naar laag", "totalLow": "Totaal: laag naar hoog", "clear": "Wissen", "clearSearch": "Zoekopdracht wissen", "showing": "Weergave van", "of": "van", "bookings": "boekingen", "noFound": "Geen boekingen gevonden", "tryFilters": "Probeer een andere zoekterm of pas de filters aan.", "property": "Accommodatie", "room": "Kamer", "user": "Gebruiker", "unknownUser": "Onbekende gebruiker", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Gasten", "total": "Totaal", "status": "Status", "viewProperty": "Accommodatie bekijken", "cancelBooking": "Boeking annuleren", "roomNotSpecified": "Kamer niet opgegeven", "adult": "volwassene", "adults": "volwassenen", "child": "kind", "children": "kinderen", "infant": "baby", "infants": "baby's", "loading": "Boeking wordt geladen...", "backProperty": "← Terug naar accommodatie", "backStays": "← Terug naar accommodaties", "confirmBooking": "Boeking bevestigen", "night": "nacht", "nights": "nachten", "roomCapacity": "Kamercapaciteit", "guest": "gast", "guestsWord": "gasten", "totalLabel": "Totaal", "errorDates": "Selecteer de check-in- en check-outdatums.", "errorCheckInPast": "De check-indatum mag niet in het verleden liggen.", "errorCheckOutPast": "De check-outdatum mag niet in het verleden liggen.", "errorOrder": "De check-outdatum moet na de check-indatum liggen.", "errorAdult": "Er is minimaal één volwassene vereist.", "errorCapacity": "Deze kamer biedt plaats aan maximaal {count} volwassenen en kinderen.", "errorLogin": "Je moet ingelogd zijn om een boeking te maken.", "errorProperty": "Accommodatie niet gevonden.", "adultYears": "13+ jaar", "childYears": "2–12 jaar", "infantYears": "Jonger dan 2 jaar", "propertyNotFound": "Accommodatie niet gevonden."},
    "Norsk": {"title": "Bestillinger", "searchAdmin": "Søk etter hotell, bruker eller dato...", "searchUser": "Søk etter hotell, rom eller dato...", "searchBookings": "Søk i bestillinger", "filterUser": "Filtrer etter bruker", "allUsers": "Alle brukere", "filterStatus": "Filtrer etter status", "allStatuses": "Alle statuser", "confirmed": "Bekreftet", "cancelled": "Kansellert", "pending": "Venter", "sortBookings": "Sorter bestillinger", "newest": "Innsjekking: nyeste", "oldest": "Innsjekking: eldste", "totalHigh": "Total: høy til lav", "totalLow": "Total: lav til høy", "clear": "Tøm", "clearSearch": "Tøm søk", "showing": "Viser", "of": "av", "bookings": "bestillinger", "noFound": "Ingen bestillinger funnet", "tryFilters": "Prøv et annet søkeord eller endre filtrene.", "property": "Overnattingssted", "room": "Rom", "user": "Bruker", "unknownUser": "Ukjent bruker", "checkIn": "Innsjekking", "checkOut": "Utsjekking", "guests": "Gjester", "total": "Totalt", "status": "Status", "viewProperty": "Se overnattingssted", "cancelBooking": "Avbestill bestilling", "roomNotSpecified": "Rom ikke spesifisert", "adult": "voksen", "adults": "voksne", "child": "barn", "children": "barn", "infant": "spedbarn", "infants": "spedbarn", "loading": "Laster inn bestilling...", "backProperty": "← Tilbake til overnattingsstedet", "backStays": "← Tilbake til overnattingssteder", "confirmBooking": "Bekreft bestilling", "night": "natt", "nights": "netter", "roomCapacity": "Romkapasitet", "guest": "gjest", "guestsWord": "gjester", "totalLabel": "Totalt", "errorDates": "Velg innsjekkings- og utsjekkingsdatoer.", "errorCheckInPast": "Innsjekkingsdato kan ikke være i fortiden.", "errorCheckOutPast": "Utsjekkingsdato kan ikke være i fortiden.", "errorOrder": "Utsjekkingsdato må være etter innsjekkingsdato.", "errorAdult": "Minst én voksen er påkrevd.", "errorCapacity": "Dette rommet har plass til opptil {count} voksne og barn.", "errorLogin": "Du må være logget inn for å bestille.", "errorProperty": "Overnattingssted ikke funnet.", "adultYears": "13+ år", "childYears": "2–12 år", "infantYears": "Under 2 år", "propertyNotFound": "Overnattingssted ikke funnet."},
    "Svenska": {"title": "Bokningar", "searchAdmin": "Sök efter hotell, användare eller datum...", "searchUser": "Sök efter hotell, rum eller datum...", "searchBookings": "Sök bokningar", "filterUser": "Filtrera efter användare", "allUsers": "Alla användare", "filterStatus": "Filtrera efter status", "allStatuses": "Alla statusar", "confirmed": "Bekräftad", "cancelled": "Avbokad", "pending": "Väntande", "sortBookings": "Sortera bokningar", "newest": "Incheckning: nyaste", "oldest": "Incheckning: äldsta", "totalHigh": "Totalt: högst till lägst", "totalLow": "Totalt: lägst till högst", "clear": "Rensa", "clearSearch": "Rensa sökning", "showing": "Visar", "of": "av", "bookings": "bokningar", "noFound": "Inga bokningar hittades", "tryFilters": "Prova ett annat sökord eller ändra filtren.", "property": "Boende", "room": "Rum", "user": "Användare", "unknownUser": "Okänd användare", "checkIn": "Incheckning", "checkOut": "Utcheckning", "guests": "Gäster", "total": "Totalt", "status": "Status", "viewProperty": "Visa boende", "cancelBooking": "Avboka bokning", "roomNotSpecified": "Rum ej angivet", "adult": "vuxen", "adults": "vuxna", "child": "barn", "children": "barn", "infant": "spädbarn", "infants": "spädbarn", "loading": "Laddar bokningen...", "backProperty": "← Tillbaka till boendet", "backStays": "← Tillbaka till boenden", "confirmBooking": "Bekräfta bokning", "night": "natt", "nights": "nätter", "roomCapacity": "Rummets kapacitet", "guest": "gäst", "guestsWord": "gäster", "totalLabel": "Totalt", "errorDates": "Välj inchecknings- och utcheckningsdatum.", "errorCheckInPast": "Incheckningsdatum kan inte vara i det förflutna.", "errorCheckOutPast": "Utcheckningsdatum kan inte vara i det förflutna.", "errorOrder": "Utcheckningsdatum måste vara efter incheckningsdatum.", "errorAdult": "Minst en vuxen krävs.", "errorCapacity": "Det här rummet rymmer upp till {count} vuxna och barn.", "errorLogin": "Du måste vara inloggad för att göra en bokning.", "errorProperty": "Boendet hittades inte.", "adultYears": "13+ år", "childYears": "2–12 år", "infantYears": "Under 2 år", "propertyNotFound": "Boendet hittades inte."},
    "Dansk": {"title": "Reservationer", "searchAdmin": "Søg efter hotel, bruger eller dato...", "searchUser": "Søg efter hotel, værelse eller dato...", "searchBookings": "Søg reservationer", "filterUser": "Filtrer efter bruger", "allUsers": "Alle brugere", "filterStatus": "Filtrer efter status", "allStatuses": "Alle statusser", "confirmed": "Bekræftet", "cancelled": "Annulleret", "pending": "Afventer", "sortBookings": "Sorter reservationer", "newest": "Check-in: nyeste", "oldest": "Check-in: ældste", "totalHigh": "Total: høj til lav", "totalLow": "Total: lav til høj", "clear": "Ryd", "clearSearch": "Ryd søgning", "showing": "Viser", "of": "af", "bookings": "reservationer", "noFound": "Ingen reservationer fundet", "tryFilters": "Prøv et andet søgeord eller ændr filtrene.", "property": "Overnatningssted", "room": "Værelse", "user": "Bruger", "unknownUser": "Ukendt bruger", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Gæster", "total": "Total", "status": "Status", "viewProperty": "Se overnatningssted", "cancelBooking": "Annuller reservation", "roomNotSpecified": "Værelse ikke angivet", "adult": "voksen", "adults": "voksne", "child": "barn", "children": "børn", "infant": "spædbarn", "infants": "spædbørn", "loading": "Indlæser reservation...", "backProperty": "← Tilbage til overnatningsstedet", "backStays": "← Tilbage til overnatningssteder", "confirmBooking": "Bekræft reservation", "night": "nat", "nights": "nætter", "roomCapacity": "Værelseskapacitet", "guest": "gæst", "guestsWord": "gæster", "totalLabel": "I alt", "errorDates": "Vælg check-in- og check-outdatoer.", "errorCheckInPast": "Check-in-datoen kan ikke være i fortiden.", "errorCheckOutPast": "Check-out-datoen kan ikke være i fortiden.", "errorOrder": "Check-out-datoen skal være efter check-in-datoen.", "errorAdult": "Mindst én voksen er påkrævet.", "errorCapacity": "Dette værelse kan rumme op til {count} voksne og børn.", "errorLogin": "Du skal være logget ind for at foretage en reservation.", "errorProperty": "Overnatningssted ikke fundet.", "adultYears": "13+ år", "childYears": "2–12 år", "infantYears": "Under 2 år", "propertyNotFound": "Overnatningssted ikke fundet."},
    "Suomi": {"title": "Varaukset", "searchAdmin": "Hae hotellin, käyttäjän tai päivämäärän mukaan...", "searchUser": "Hae hotellin, huoneen tai päivämäärän mukaan...", "searchBookings": "Hae varauksia", "filterUser": "Suodata käyttäjän mukaan", "allUsers": "Kaikki käyttäjät", "filterStatus": "Suodata tilan mukaan", "allStatuses": "Kaikki tilat", "confirmed": "Vahvistettu", "cancelled": "Peruutettu", "pending": "Odottaa vahvistusta", "sortBookings": "Lajittele varaukset", "newest": "Sisäänkirjautuminen: uusimmat", "oldest": "Sisäänkirjautuminen: vanhimmat", "totalHigh": "Yhteensä: suurimmasta pienimpään", "totalLow": "Yhteensä: pienimmästä suurimpaan", "clear": "Tyhjennä", "clearSearch": "Tyhjennä haku", "showing": "Näytetään", "of": "/", "bookings": "varausta", "noFound": "Varauksia ei löytynyt", "tryFilters": "Kokeile toista hakusanaa tai muuta suodattimia.", "property": "Majoitus", "room": "Huone", "user": "Käyttäjä", "unknownUser": "Tuntematon käyttäjä", "checkIn": "Sisäänkirjautuminen", "checkOut": "Uloskirjautuminen", "guests": "Vieraat", "total": "Yhteensä", "status": "Tila", "viewProperty": "Näytä majoitus", "cancelBooking": "Peruuta varaus", "roomNotSpecified": "Huonetta ei määritetty", "adult": "aikuinen", "adults": "aikuista", "child": "lapsi", "children": "lasta", "infant": "vauva", "infants": "vauvaa", "loading": "Ladataan varausta...", "backProperty": "← Takaisin majoitukseen", "backStays": "← Takaisin majoituksiin", "confirmBooking": "Vahvista varaus", "night": "yö", "nights": "yötä", "roomCapacity": "Huoneen kapasiteetti", "guest": "vieras", "guestsWord": "vierasta", "totalLabel": "Yhteensä", "errorDates": "Valitse sisään- ja uloskirjautumispäivät.", "errorCheckInPast": "Sisäänkirjautumispäivä ei voi olla menneisyydessä.", "errorCheckOutPast": "Uloskirjautumispäivä ei voi olla menneisyydessä.", "errorOrder": "Uloskirjautumispäivän on oltava sisäänkirjautumispäivän jälkeen.", "errorAdult": "Vähintään yksi aikuinen vaaditaan.", "errorCapacity": "Tähän huoneeseen mahtuu enintään {count} aikuista ja lasta.", "errorLogin": "Sinun on oltava kirjautuneena tehdäksesi varauksen.", "errorProperty": "Majoitusta ei löytynyt.", "adultYears": "13+ vuotta", "childYears": "2–12 vuotta", "infantYears": "Alle 2-vuotiaat", "propertyNotFound": "Majoitusta ei löytynyt."},
    "Polski": {"title": "Rezerwacje", "searchAdmin": "Szukaj według hotelu, użytkownika lub daty...", "searchUser": "Szukaj według hotelu, pokoju lub daty...", "searchBookings": "Szukaj rezerwacji", "filterUser": "Filtruj według użytkownika", "allUsers": "Wszyscy użytkownicy", "filterStatus": "Filtruj według statusu", "allStatuses": "Wszystkie statusy", "confirmed": "Potwierdzona", "cancelled": "Anulowana", "pending": "Oczekująca", "sortBookings": "Sortuj rezerwacje", "newest": "Zameldowanie: najnowsze", "oldest": "Zameldowanie: najstarsze", "totalHigh": "Suma: od najwyższej do najniższej", "totalLow": "Suma: od najniższej do najwyższej", "clear": "Wyczyść", "clearSearch": "Wyczyść wyszukiwanie", "showing": "Wyświetlanie", "of": "z", "bookings": "rezerwacji", "noFound": "Nie znaleziono rezerwacji", "tryFilters": "Spróbuj innego hasła lub zmień filtry.", "property": "Obiekt", "room": "Pokój", "user": "Użytkownik", "unknownUser": "Nieznany użytkownik", "checkIn": "Zameldowanie", "checkOut": "Wymeldowanie", "guests": "Goście", "total": "Suma", "status": "Status", "viewProperty": "Zobacz obiekt", "cancelBooking": "Anuluj rezerwację", "roomNotSpecified": "Nie określono pokoju", "adult": "dorosły", "adults": "dorosłych", "child": "dziecko", "children": "dzieci", "infant": "niemowlę", "infants": "niemowląt", "loading": "Ładowanie rezerwacji...", "backProperty": "← Wróć do obiektu", "backStays": "← Wróć do obiektów", "confirmBooking": "Potwierdź rezerwację", "night": "noc", "nights": "nocy", "roomCapacity": "Pojemność pokoju", "guest": "gość", "guestsWord": "gości", "totalLabel": "Suma", "errorDates": "Wybierz daty zameldowania i wymeldowania.", "errorCheckInPast": "Data zameldowania nie może być w przeszłości.", "errorCheckOutPast": "Data wymeldowania nie może być w przeszłości.", "errorOrder": "Data wymeldowania musi być późniejsza niż data zameldowania.", "errorAdult": "Wymagany jest co najmniej jeden dorosły.", "errorCapacity": "Ten pokój może pomieścić do {count} dorosłych i dzieci.", "errorLogin": "Musisz być zalogowany, aby dokonać rezerwacji.", "errorProperty": "Nie znaleziono obiektu.", "adultYears": "13+ lat", "childYears": "2–12 lat", "infantYears": "Poniżej 2 lat", "propertyNotFound": "Nie znaleziono obiektu."},
    "Čeština": {"title": "Rezervace", "searchAdmin": "Hledat podle hotelu, uživatele nebo data...", "searchUser": "Hledat podle hotelu, pokoje nebo data...", "searchBookings": "Hledat rezervace", "filterUser": "Filtrovat podle uživatele", "allUsers": "Všichni uživatelé", "filterStatus": "Filtrovat podle stavu", "allStatuses": "Všechny stavy", "confirmed": "Potvrzeno", "cancelled": "Zrušeno", "pending": "Čeká na potvrzení", "sortBookings": "Seřadit rezervace", "newest": "Check-in: nejnovější", "oldest": "Check-in: nejstarší", "totalHigh": "Celkem: od nejvyššího po nejnižší", "totalLow": "Celkem: od nejnižšího po nejvyšší", "clear": "Vymazat", "clearSearch": "Vymazat hledání", "showing": "Zobrazeno", "of": "z", "bookings": "rezervací", "noFound": "Nebyly nalezeny žádné rezervace", "tryFilters": "Zkuste jiný hledaný výraz nebo změňte filtry.", "property": "Ubytování", "room": "Pokoj", "user": "Uživatel", "unknownUser": "Neznámý uživatel", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Hosté", "total": "Celkem", "status": "Stav", "viewProperty": "Zobrazit ubytování", "cancelBooking": "Zrušit rezervaci", "roomNotSpecified": "Pokoj není uveden", "adult": "dospělý", "adults": "dospělí", "child": "dítě", "children": "děti", "infant": "kojence", "infants": "kojenců", "loading": "Načítání rezervace...", "backProperty": "← Zpět k ubytování", "backStays": "← Zpět k ubytováním", "confirmBooking": "Potvrdit rezervaci", "night": "noc", "nights": "noci", "roomCapacity": "Kapacita pokoje", "guest": "host", "guestsWord": "hosté", "totalLabel": "Celkem", "errorDates": "Vyberte datum příjezdu a odjezdu.", "errorCheckInPast": "Datum příjezdu nemůže být v minulosti.", "errorCheckOutPast": "Datum odjezdu nemůže být v minulosti.", "errorOrder": "Datum odjezdu musí být pozdější než datum příjezdu.", "errorAdult": "Je vyžadován alespoň jeden dospělý.", "errorCapacity": "Tento pokoj může ubytovat až {count} dospělých a dětí.", "errorLogin": "Pro vytvoření rezervace musíte být přihlášeni.", "errorProperty": "Ubytování nebylo nalezeno.", "adultYears": "13+ let", "childYears": "2–12 let", "infantYears": "Méně než 2 roky", "propertyNotFound": "Ubytování nebylo nalezeno."},
    "Slovenčina": {"title": "Rezervácie", "searchAdmin": "Hľadať podľa hotela, používateľa alebo dátumu...", "searchUser": "Hľadať podľa hotela, izby alebo dátumu...", "searchBookings": "Hľadať rezervácie", "filterUser": "Filtrovať podľa používateľa", "allUsers": "Všetci používatelia", "filterStatus": "Filtrovať podľa stavu", "allStatuses": "Všetky stavy", "confirmed": "Potvrdená", "cancelled": "Zrušená", "pending": "Čaká na potvrdenie", "sortBookings": "Zoradiť rezervácie", "newest": "Check-in: najnovšie", "oldest": "Check-in: najstaršie", "totalHigh": "Celkom: od najvyššieho po najnižší", "totalLow": "Celkom: od najnižšieho po najvyšší", "clear": "Vymazať", "clearSearch": "Vymazať vyhľadávanie", "showing": "Zobrazené", "of": "z", "bookings": "rezervácií", "noFound": "Nenašli sa žiadne rezervácie", "tryFilters": "Skúste iný vyhľadávaný výraz alebo zmeňte filtre.", "property": "Ubytovanie", "room": "Izba", "user": "Používateľ", "unknownUser": "Neznámy používateľ", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Hostia", "total": "Celkom", "status": "Stav", "viewProperty": "Zobraziť ubytovanie", "cancelBooking": "Zrušiť rezerváciu", "roomNotSpecified": "Izba nie je uvedená", "adult": "dospelý", "adults": "dospelí", "child": "dieťa", "children": "deti", "infant": "dojča", "infants": "dojčatá", "loading": "Načítava sa rezervácia...", "backProperty": "← Späť na ubytovanie", "backStays": "← Späť na ubytovania", "confirmBooking": "Potvrdiť rezerváciu", "night": "noc", "nights": "noci", "roomCapacity": "Kapacita izby", "guest": "hosť", "guestsWord": "hostia", "totalLabel": "Celkom", "errorDates": "Vyberte dátumy príchodu a odchodu.", "errorCheckInPast": "Dátum príchodu nemôže byť v minulosti.", "errorCheckOutPast": "Dátum odchodu nemôže byť v minulosti.", "errorOrder": "Dátum odchodu musí byť neskôr ako dátum príchodu.", "errorAdult": "Vyžaduje sa aspoň jeden dospelý.", "errorCapacity": "Táto izba môže ubytovať až {count} dospelých a detí.", "errorLogin": "Na vytvorenie rezervácie musíte byť prihlásení.", "errorProperty": "Ubytovanie sa nenašlo.", "adultYears": "13+ rokov", "childYears": "2–12 rokov", "infantYears": "Menej ako 2 roky", "propertyNotFound": "Ubytovanie sa nenašlo."},
    "Magyar": {"title": "Foglalások", "searchAdmin": "Keresés szálloda, felhasználó vagy dátum szerint...", "searchUser": "Keresés szálloda, szoba vagy dátum szerint...", "searchBookings": "Foglalások keresése", "filterUser": "Szűrés felhasználó szerint", "allUsers": "Összes felhasználó", "filterStatus": "Szűrés állapot szerint", "allStatuses": "Összes állapot", "confirmed": "Megerősítve", "cancelled": "Törölve", "pending": "Függőben", "sortBookings": "Foglalások rendezése", "newest": "Bejelentkezés: legújabb", "oldest": "Bejelentkezés: legrégebbi", "totalHigh": "Összeg: magasról alacsonyra", "totalLow": "Összeg: alacsonyról magasra", "clear": "Törlés", "clearSearch": "Keresés törlése", "showing": "Megjelenítve", "of": "ebből", "bookings": "foglalás", "noFound": "Nem találhatók foglalások", "tryFilters": "Próbáljon más keresőkifejezést vagy módosítsa a szűrőket.", "property": "Szállás", "room": "Szoba", "user": "Felhasználó", "unknownUser": "Ismeretlen felhasználó", "checkIn": "Bejelentkezés", "checkOut": "Kijelentkezés", "guests": "Vendégek", "total": "Összesen", "status": "Állapot", "viewProperty": "Szállás megtekintése", "cancelBooking": "Foglalás lemondása", "roomNotSpecified": "Nincs megadva szoba", "adult": "felnőtt", "adults": "felnőtt", "child": "gyermek", "children": "gyermek", "infant": "csecsemő", "infants": "csecsemő", "loading": "Foglalás betöltése...", "backProperty": "← Vissza a szálláshoz", "backStays": "← Vissza a szállásokhoz", "confirmBooking": "Foglalás megerősítése", "night": "éjszaka", "nights": "éjszaka", "roomCapacity": "Szobakapacitás", "guest": "vendég", "guestsWord": "vendég", "totalLabel": "Összesen", "errorDates": "Válaszd ki a be- és kijelentkezés dátumát.", "errorCheckInPast": "A bejelentkezés dátuma nem lehet a múltban.", "errorCheckOutPast": "A kijelentkezés dátuma nem lehet a múltban.", "errorOrder": "A kijelentkezés dátumának a bejelentkezés után kell lennie.", "errorAdult": "Legalább egy felnőtt szükséges.", "errorCapacity": "Ez a szoba legfeljebb {count} felnőttet és gyermeket tud fogadni.", "errorLogin": "A foglaláshoz be kell jelentkezned.", "errorProperty": "A szállás nem található.", "adultYears": "13+ év", "childYears": "2–12 év", "infantYears": "2 év alatt", "propertyNotFound": "A szállás nem található."},
    "Български": {"title": "Резервации", "searchAdmin": "Търсене по хотел, потребител или дата...", "searchUser": "Търсене по хотел, стая или дата...", "searchBookings": "Търсене на резервации", "filterUser": "Филтриране по потребител", "allUsers": "Всички потребители", "filterStatus": "Филтриране по статус", "allStatuses": "Всички статуси", "confirmed": "Потвърдена", "cancelled": "Отменена", "pending": "В очакване", "sortBookings": "Сортиране на резервациите", "newest": "Настаняване: най-нови", "oldest": "Настаняване: най-стари", "totalHigh": "Общо: от високо към ниско", "totalLow": "Общо: от ниско към високо", "clear": "Изчисти", "clearSearch": "Изчисти търсенето", "showing": "Показани", "of": "от", "bookings": "резервации", "noFound": "Няма намерени резервации", "tryFilters": "Опитайте друг термин за търсене или променете филтрите.", "property": "Обект", "room": "Стая", "user": "Потребител", "unknownUser": "Неизвестен потребител", "checkIn": "Настаняване", "checkOut": "Напускане", "guests": "Гости", "total": "Общо", "status": "Статус", "viewProperty": "Виж обекта", "cancelBooking": "Отмени резервацията", "roomNotSpecified": "Стаята не е посочена", "adult": "възрастен", "adults": "възрастни", "child": "дете", "children": "деца", "infant": "бебе", "infants": "бебета", "loading": "Зареждане на резервацията...", "backProperty": "← Назад към обекта", "backStays": "← Назад към местата за настаняване", "confirmBooking": "Потвърди резервацията", "night": "нощ", "nights": "нощи", "roomCapacity": "Капацитет на стаята", "guest": "гост", "guestsWord": "гости", "totalLabel": "Общо", "errorDates": "Моля, изберете дати за настаняване и напускане.", "errorCheckInPast": "Датата на настаняване не може да е в миналото.", "errorCheckOutPast": "Датата на напускане не може да е в миналото.", "errorOrder": "Датата на напускане трябва да е след датата на настаняване.", "errorAdult": "Изисква се поне един възрастен.", "errorCapacity": "Тази стая може да побере до {count} възрастни и деца.", "errorLogin": "Трябва да сте влезли в профила си, за да направите резервация.", "errorProperty": "Обектът не е намерен.", "adultYears": "13+ години", "childYears": "2–12 години", "infantYears": "Под 2 години", "propertyNotFound": "Обектът не е намерен."},
    "Hrvatski": {"title": "Rezervacije", "searchAdmin": "Pretraži prema hotelu, korisniku ili datumu...", "searchUser": "Pretraži prema hotelu, sobi ili datumu...", "searchBookings": "Pretraži rezervacije", "filterUser": "Filtriraj prema korisniku", "allUsers": "Svi korisnici", "filterStatus": "Filtriraj prema statusu", "allStatuses": "Svi statusi", "confirmed": "Potvrđeno", "cancelled": "Otkazano", "pending": "Na čekanju", "sortBookings": "Sortiraj rezervacije", "newest": "Prijava: najnovije", "oldest": "Prijava: najstarije", "totalHigh": "Ukupno: od najvećeg prema najmanjem", "totalLow": "Ukupno: od najmanjeg prema najvećem", "clear": "Očisti", "clearSearch": "Očisti pretragu", "showing": "Prikazano", "of": "od", "bookings": "rezervacija", "noFound": "Nisu pronađene rezervacije", "tryFilters": "Pokušajte drugi pojam ili promijenite filtre.", "property": "Smještaj", "room": "Soba", "user": "Korisnik", "unknownUser": "Nepoznati korisnik", "checkIn": "Prijava", "checkOut": "Odjava", "guests": "Gosti", "total": "Ukupno", "status": "Status", "viewProperty": "Pogledaj smještaj", "cancelBooking": "Otkaži rezervaciju", "roomNotSpecified": "Soba nije navedena", "adult": "odrasla osoba", "adults": "odrasle osobe", "child": "dijete", "children": "djeca", "infant": "dojenče", "infants": "dojenčad", "loading": "Učitavanje rezervacije...", "backProperty": "← Natrag na smještaj", "backStays": "← Natrag na smještaje", "confirmBooking": "Potvrdi rezervaciju", "night": "noć", "nights": "noći", "roomCapacity": "Kapacitet sobe", "guest": "gost", "guestsWord": "gostiju", "totalLabel": "Ukupno", "errorDates": "Odaberite datume prijave i odjave.", "errorCheckInPast": "Datum prijave ne može biti u prošlosti.", "errorCheckOutPast": "Datum odjave ne može biti u prošlosti.", "errorOrder": "Datum odjave mora biti nakon datuma prijave.", "errorAdult": "Potreban je najmanje jedan odrasli gost.", "errorCapacity": "Ova soba može primiti do {count} odraslih i djece.", "errorLogin": "Morate biti prijavljeni kako biste napravili rezervaciju.", "errorProperty": "Smještaj nije pronađen.", "adultYears": "13+ godina", "childYears": "2–12 godina", "infantYears": "Mlađi od 2 godine", "propertyNotFound": "Smještaj nije pronađen."},
    "Slovenščina": {"title": "Rezervacije", "searchAdmin": "Išči po hotelu, uporabniku ali datumu...", "searchUser": "Išči po hotelu, sobi ali datumu...", "searchBookings": "Išči rezervacije", "filterUser": "Filtriraj po uporabniku", "allUsers": "Vsi uporabniki", "filterStatus": "Filtriraj po statusu", "allStatuses": "Vsi statusi", "confirmed": "Potrjeno", "cancelled": "Preklicano", "pending": "V čakanju", "sortBookings": "Razvrsti rezervacije", "newest": "Prijava: najnovejše", "oldest": "Prijava: najstarejše", "totalHigh": "Skupaj: od največjega do najmanjšega", "totalLow": "Skupaj: od najmanjšega do največjega", "clear": "Počisti", "clearSearch": "Počisti iskanje", "showing": "Prikazano", "of": "od", "bookings": "rezervacij", "noFound": "Rezervacij ni bilo mogoče najti", "tryFilters": "Poskusite drug iskalni izraz ali spremenite filtre.", "property": "Nastanitev", "room": "Soba", "user": "Uporabnik", "unknownUser": "Neznan uporabnik", "checkIn": "Prijava", "checkOut": "Odjava", "guests": "Gostje", "total": "Skupaj", "status": "Status", "viewProperty": "Ogled nastanitve", "cancelBooking": "Prekliči rezervacijo", "roomNotSpecified": "Soba ni navedena", "adult": "odrasli", "adults": "odrasli", "child": "otrok", "children": "otroci", "infant": "dojenček", "infants": "dojenčki", "loading": "Nalaganje rezervacije...", "backProperty": "← Nazaj na nastanitev", "backStays": "← Nazaj na nastanitve", "confirmBooking": "Potrdi rezervacijo", "night": "noč", "nights": "noči", "roomCapacity": "Kapaciteta sobe", "guest": "gost", "guestsWord": "gostov", "totalLabel": "Skupaj", "errorDates": "Izberite datuma prijave in odjave.", "errorCheckInPast": "Datum prijave ne more biti v preteklosti.", "errorCheckOutPast": "Datum odjave ne more biti v preteklosti.", "errorOrder": "Datum odjave mora biti pozneje kot datum prijave.", "errorAdult": "Potreben je vsaj en odrasli.", "errorCapacity": "V tej sobi lahko biva do {count} odraslih in otrok.", "errorLogin": "Za rezervacijo morate biti prijavljeni.", "errorProperty": "Nastanitve ni bilo mogoče najti.", "adultYears": "13+ let", "childYears": "2–12 let", "infantYears": "Mlajši od 2 let", "propertyNotFound": "Nastanitve ni bilo mogoče najti."},
    "Srpski": {"title": "Rezervacije", "searchAdmin": "Pretraži po hotelu, korisniku ili datumu...", "searchUser": "Pretraži po hotelu, sobi ili datumu...", "searchBookings": "Pretraži rezervacije", "filterUser": "Filtriraj po korisniku", "allUsers": "Svi korisnici", "filterStatus": "Filtriraj po statusu", "allStatuses": "Svi statusi", "confirmed": "Potvrđeno", "cancelled": "Otkazano", "pending": "Na čekanju", "sortBookings": "Sortiraj rezervacije", "newest": "Prijava: najnovije", "oldest": "Prijava: najstarije", "totalHigh": "Ukupno: od najvećeg ka najmanjem", "totalLow": "Ukupno: od najmanjeg ka najvećem", "clear": "Obriši", "clearSearch": "Obriši pretragu", "showing": "Prikazano", "of": "od", "bookings": "rezervacija", "noFound": "Nisu pronađene rezervacije", "tryFilters": "Pokušajte drugi pojam za pretragu ili promenite filtere.", "property": "Smeštaj", "room": "Soba", "user": "Korisnik", "unknownUser": "Nepoznat korisnik", "checkIn": "Prijava", "checkOut": "Odjava", "guests": "Gosti", "total": "Ukupno", "status": "Status", "viewProperty": "Pogledaj smeštaj", "cancelBooking": "Otkaži rezervaciju", "roomNotSpecified": "Soba nije navedena", "adult": "odrasla osoba", "adults": "odrasle osobe", "child": "dete", "children": "deca", "infant": "beba", "infants": "bebe", "loading": "Učitavanje rezervacije...", "backProperty": "← Nazad na smeštaj", "backStays": "← Nazad na smeštaje", "confirmBooking": "Potvrdi rezervaciju", "night": "noć", "nights": "noći", "roomCapacity": "Kapacitet sobe", "guest": "gost", "guestsWord": "gostiju", "totalLabel": "Ukupno", "errorDates": "Izaberite datume prijave i odjave.", "errorCheckInPast": "Datum prijave ne može biti u prošlosti.", "errorCheckOutPast": "Datum odjave ne može biti u prošlosti.", "errorOrder": "Datum odjave mora biti nakon datuma prijave.", "errorAdult": "Potreban je najmanje jedan odrasli.", "errorCapacity": "Ova soba može da primi do {count} odraslih i dece.", "errorLogin": "Morate biti prijavljeni da biste napravili rezervaciju.", "errorProperty": "Smeštaj nije pronađen.", "adultYears": "13+ godina", "childYears": "2–12 godina", "infantYears": "Mlađi od 2 godine", "propertyNotFound": "Smeštaj nije pronađen."},
    "Bosanski": {"title": "Rezervacije", "searchAdmin": "Pretraži prema hotelu, korisniku ili datumu...", "searchUser": "Pretraži prema hotelu, sobi ili datumu...", "searchBookings": "Pretraži rezervacije", "filterUser": "Filtriraj prema korisniku", "allUsers": "Svi korisnici", "filterStatus": "Filtriraj prema statusu", "allStatuses": "Svi statusi", "confirmed": "Potvrđeno", "cancelled": "Otkazano", "pending": "Na čekanju", "sortBookings": "Sortiraj rezervacije", "newest": "Prijava: najnovije", "oldest": "Prijava: najstarije", "totalHigh": "Ukupno: od najvećeg do najmanjeg", "totalLow": "Ukupno: od najmanjeg do najvećeg", "clear": "Očisti", "clearSearch": "Očisti pretragu", "showing": "Prikazano", "of": "od", "bookings": "rezervacija", "noFound": "Nisu pronađene rezervacije", "tryFilters": "Pokušajte drugi pojam za pretragu ili promijenite filtere.", "property": "Objekat", "room": "Soba", "user": "Korisnik", "unknownUser": "Nepoznat korisnik", "checkIn": "Prijava", "checkOut": "Odjava", "guests": "Gosti", "total": "Ukupno", "status": "Status", "viewProperty": "Pogledaj objekat", "cancelBooking": "Otkaži rezervaciju", "roomNotSpecified": "Soba nije navedena", "adult": "odrasla osoba", "adults": "odrasle osobe", "child": "dijete", "children": "djeca", "infant": "beba", "infants": "bebe", "loading": "Učitavanje rezervacije...", "backProperty": "← Nazad na objekat", "backStays": "← Nazad na objekte", "confirmBooking": "Potvrdi rezervaciju", "night": "noć", "nights": "noći", "roomCapacity": "Kapacitet sobe", "guest": "gost", "guestsWord": "gostiju", "totalLabel": "Ukupno", "errorDates": "Odaberite datume prijave i odjave.", "errorCheckInPast": "Datum prijave ne može biti u prošlosti.", "errorCheckOutPast": "Datum odjave ne može biti u prošlosti.", "errorOrder": "Datum odjave mora biti nakon datuma prijave.", "errorAdult": "Potreban je najmanje jedan odrasli.", "errorCapacity": "Ova soba može primiti do {count} odraslih i djece.", "errorLogin": "Morate biti prijavljeni da biste napravili rezervaciju.", "errorProperty": "Objekat nije pronađen.", "adultYears": "13+ godina", "childYears": "2–12 godina", "infantYears": "Mlađi od 2 godine", "propertyNotFound": "Objekat nije pronađen."},
    "Ελληνικά": {"title": "Κρατήσεις", "searchAdmin": "Αναζήτηση ανά ξενοδοχείο, χρήστη ή ημερομηνία...", "searchUser": "Αναζήτηση ανά ξενοδοχείο, δωμάτιο ή ημερομηνία...", "searchBookings": "Αναζήτηση κρατήσεων", "filterUser": "Φιλτράρισμα ανά χρήστη", "allUsers": "Όλοι οι χρήστες", "filterStatus": "Φιλτράρισμα ανά κατάσταση", "allStatuses": "Όλες οι καταστάσεις", "confirmed": "Επιβεβαιωμένη", "cancelled": "Ακυρωμένη", "pending": "Σε αναμονή", "sortBookings": "Ταξινόμηση κρατήσεων", "newest": "Check-in: νεότερες", "oldest": "Check-in: παλαιότερες", "totalHigh": "Σύνολο: από υψηλότερο σε χαμηλότερο", "totalLow": "Σύνολο: από χαμηλότερο σε υψηλότερο", "clear": "Εκκαθάριση", "clearSearch": "Εκκαθάριση αναζήτησης", "showing": "Εμφάνιση", "of": "από", "bookings": "κρατήσεις", "noFound": "Δεν βρέθηκαν κρατήσεις", "tryFilters": "Δοκιμάστε άλλον όρο αναζήτησης ή αλλάξτε τα φίλτρα.", "property": "Κατάλυμα", "room": "Δωμάτιο", "user": "Χρήστης", "unknownUser": "Άγνωστος χρήστης", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Επισκέπτες", "total": "Σύνολο", "status": "Κατάσταση", "viewProperty": "Προβολή καταλύματος", "cancelBooking": "Ακύρωση κράτησης", "roomNotSpecified": "Δεν έχει οριστεί δωμάτιο", "adult": "ενήλικας", "adults": "ενήλικες", "child": "παιδί", "children": "παιδιά", "infant": "βρέφος", "infants": "βρέφη", "loading": "Φόρτωση κράτησης...", "backProperty": "← Επιστροφή στο κατάλυμα", "backStays": "← Επιστροφή στα καταλύματα", "confirmBooking": "Επιβεβαίωση κράτησης", "night": "νύχτα", "nights": "νύχτες", "roomCapacity": "Χωρητικότητα δωματίου", "guest": "επισκέπτης", "guestsWord": "επισκέπτες", "totalLabel": "Σύνολο", "errorDates": "Επιλέξτε ημερομηνίες check-in και check-out.", "errorCheckInPast": "Η ημερομηνία check-in δεν μπορεί να είναι στο παρελθόν.", "errorCheckOutPast": "Η ημερομηνία check-out δεν μπορεί να είναι στο παρελθόν.", "errorOrder": "Η ημερομηνία check-out πρέπει να είναι μετά την ημερομηνία check-in.", "errorAdult": "Απαιτείται τουλάχιστον ένας ενήλικας.", "errorCapacity": "Αυτό το δωμάτιο μπορεί να φιλοξενήσει έως {count} ενήλικες και παιδιά.", "errorLogin": "Πρέπει να συνδεθείτε για να κάνετε κράτηση.", "errorProperty": "Το κατάλυμα δεν βρέθηκε.", "adultYears": "13+ ετών", "childYears": "2–12 ετών", "infantYears": "Κάτω των 2 ετών", "propertyNotFound": "Το κατάλυμα δεν βρέθηκε."},
    "Türkçe": {"title": "Rezervasyonlar", "searchAdmin": "Otel, kullanıcı veya tarihe göre ara...", "searchUser": "Otel, oda veya tarihe göre ara...", "searchBookings": "Rezervasyonlarda ara", "filterUser": "Kullanıcıya göre filtrele", "allUsers": "Tüm kullanıcılar", "filterStatus": "Duruma göre filtrele", "allStatuses": "Tüm durumlar", "confirmed": "Onaylandı", "cancelled": "İptal edildi", "pending": "Beklemede", "sortBookings": "Rezervasyonları sırala", "newest": "Giriş: en yeni", "oldest": "Giriş: en eski", "totalHigh": "Toplam: yüksekten düşüğe", "totalLow": "Toplam: düşükten yükseğe", "clear": "Temizle", "clearSearch": "Aramayı temizle", "showing": "Gösteriliyor", "of": "/", "bookings": "rezervasyon", "noFound": "Rezervasyon bulunamadı", "tryFilters": "Başka bir arama terimi deneyin veya filtreleri değiştirin.", "property": "Tesis", "room": "Oda", "user": "Kullanıcı", "unknownUser": "Bilinmeyen kullanıcı", "checkIn": "Giriş", "checkOut": "Çıkış", "guests": "Misafirler", "total": "Toplam", "status": "Durum", "viewProperty": "Tesisi görüntüle", "cancelBooking": "Rezervasyonu iptal et", "roomNotSpecified": "Oda belirtilmedi", "adult": "yetişkin", "adults": "yetişkin", "child": "çocuk", "children": "çocuk", "infant": "bebek", "infants": "bebek", "loading": "Rezervasyon yükleniyor...", "backProperty": "← Tesise dön", "backStays": "← Konaklama yerlerine dön", "confirmBooking": "Rezervasyonu onayla", "night": "gece", "nights": "gece", "roomCapacity": "Oda kapasitesi", "guest": "misafir", "guestsWord": "misafir", "totalLabel": "Toplam", "errorDates": "Giriş ve çıkış tarihlerini seçin.", "errorCheckInPast": "Giriş tarihi geçmişte olamaz.", "errorCheckOutPast": "Çıkış tarihi geçmişte olamaz.", "errorOrder": "Çıkış tarihi giriş tarihinden sonra olmalıdır.", "errorAdult": "En az bir yetişkin gereklidir.", "errorCapacity": "Bu oda en fazla {count} yetişkin ve çocuk ağırlayabilir.", "errorLogin": "Rezervasyon yapmak için giriş yapmalısınız.", "errorProperty": "Tesis bulunamadı.", "adultYears": "13+ yaş", "childYears": "2–12 yaş", "infantYears": "2 yaş altı", "propertyNotFound": "Tesis bulunamadı."},
    "العربية": {"title": "الحجوزات", "searchAdmin": "البحث حسب الفندق أو المستخدم أو التاريخ...", "searchUser": "البحث حسب الفندق أو الغرفة أو التاريخ...", "searchBookings": "البحث في الحجوزات", "filterUser": "التصفية حسب المستخدم", "allUsers": "جميع المستخدمين", "filterStatus": "التصفية حسب الحالة", "allStatuses": "جميع الحالات", "confirmed": "مؤكد", "cancelled": "ملغى", "pending": "قيد الانتظار", "sortBookings": "ترتيب الحجوزات", "newest": "تسجيل الوصول: الأحدث", "oldest": "تسجيل الوصول: الأقدم", "totalHigh": "الإجمالي: من الأعلى إلى الأقل", "totalLow": "الإجمالي: من الأقل إلى الأعلى", "clear": "مسح", "clearSearch": "مسح البحث", "showing": "عرض", "of": "من", "bookings": "حجوزات", "noFound": "لم يتم العثور على حجوزات", "tryFilters": "جرّب مصطلح بحث آخر أو غيّر الفلاتر.", "property": "مكان الإقامة", "room": "الغرفة", "user": "المستخدم", "unknownUser": "مستخدم غير معروف", "checkIn": "تسجيل الوصول", "checkOut": "تسجيل المغادرة", "guests": "الضيوف", "total": "الإجمالي", "status": "الحالة", "viewProperty": "عرض مكان الإقامة", "cancelBooking": "إلغاء الحجز", "roomNotSpecified": "الغرفة غير محددة", "adult": "بالغ", "adults": "بالغون", "child": "طفل", "children": "أطفال", "infant": "رضيع", "infants": "رُضّع", "loading": "جارٍ تحميل الحجز...", "backProperty": "← العودة إلى مكان الإقامة", "backStays": "← العودة إلى أماكن الإقامة", "confirmBooking": "تأكيد الحجز", "night": "ليلة", "nights": "ليالٍ", "roomCapacity": "سعة الغرفة", "guest": "ضيف", "guestsWord": "ضيوف", "totalLabel": "الإجمالي", "errorDates": "يرجى اختيار تاريخ تسجيل الوصول والمغادرة.", "errorCheckInPast": "لا يمكن أن يكون تاريخ تسجيل الوصول في الماضي.", "errorCheckOutPast": "لا يمكن أن يكون تاريخ تسجيل المغادرة في الماضي.", "errorOrder": "يجب أن يكون تاريخ تسجيل المغادرة بعد تاريخ تسجيل الوصول.", "errorAdult": "يجب وجود شخص بالغ واحد على الأقل.", "errorCapacity": "يمكن لهذه الغرفة استيعاب ما يصل إلى {count} من البالغين والأطفال.", "errorLogin": "يجب تسجيل الدخول لإجراء الحجز.", "errorProperty": "لم يتم العثور على مكان الإقامة.", "adultYears": "13 سنة فأكثر", "childYears": "2–12 سنة", "infantYears": "أقل من سنتين", "propertyNotFound": "لم يتم العثور على مكان الإقامة."},
    "עברית": {"title": "הזמנות", "searchAdmin": "חיפוש לפי מלון, משתמש או תאריך...", "searchUser": "חיפוש לפי מלון, חדר או תאריך...", "searchBookings": "חיפוש הזמנות", "filterUser": "סינון לפי משתמש", "allUsers": "כל המשתמשים", "filterStatus": "סינון לפי סטטוס", "allStatuses": "כל הסטטוסים", "confirmed": "מאושר", "cancelled": "בוטל", "pending": "ממתין לאישור", "sortBookings": "מיון הזמנות", "newest": "צ'ק-אין: החדשות ביותר", "oldest": "צ'ק-אין: הישנות ביותר", "totalHigh": "סה״כ: מהגבוה לנמוך", "totalLow": "סה״כ: מהנמוך לגבוה", "clear": "נקה", "clearSearch": "נקה חיפוש", "showing": "מציג", "of": "מתוך", "bookings": "הזמנות", "noFound": "לא נמצאו הזמנות", "tryFilters": "נסה מונח חיפוש אחר או שנה את המסננים.", "property": "מקום אירוח", "room": "חדר", "user": "משתמש", "unknownUser": "משתמש לא ידוע", "checkIn": "צ'ק-אין", "checkOut": "צ'ק-אאוט", "guests": "אורחים", "total": "סה״כ", "status": "סטטוס", "viewProperty": "הצג מקום אירוח", "cancelBooking": "ביטול הזמנה", "roomNotSpecified": "החדר לא צוין", "adult": "מבוגר", "adults": "מבוגרים", "child": "ילד", "children": "ילדים", "infant": "תינוק", "infants": "תינוקות", "loading": "טוען הזמנה...", "backProperty": "← חזרה למקום האירוח", "backStays": "← חזרה למקומות האירוח", "confirmBooking": "אישור הזמנה", "night": "לילה", "nights": "לילות", "roomCapacity": "קיבולת החדר", "guest": "אורח", "guestsWord": "אורחים", "totalLabel": "סה״כ", "errorDates": "יש לבחור תאריכי צ'ק-אין וצ'ק-אאוט.", "errorCheckInPast": "תאריך הצ'ק-אין לא יכול להיות בעבר.", "errorCheckOutPast": "תאריך הצ'ק-אאוט לא יכול להיות בעבר.", "errorOrder": "תאריך הצ'ק-אאוט חייב להיות אחרי תאריך הצ'ק-אין.", "errorAdult": "נדרש לפחות מבוגר אחד.", "errorCapacity": "חדר זה יכול לארח עד {count} מבוגרים וילדים.", "errorLogin": "יש להתחבר כדי לבצע הזמנה.", "errorProperty": "מקום האירוח לא נמצא.", "adultYears": "13+ שנים", "childYears": "2–12 שנים", "infantYears": "מתחת לגיל שנתיים", "propertyNotFound": "מקום האירוח לא נמצא."},
    "हिन्दी": {"title": "बुकिंग", "searchAdmin": "होटल, उपयोगकर्ता या तारीख से खोजें...", "searchUser": "होटल, कमरे या तारीख से खोजें...", "searchBookings": "बुकिंग खोजें", "filterUser": "उपयोगकर्ता के अनुसार फ़िल्टर करें", "allUsers": "सभी उपयोगकर्ता", "filterStatus": "स्थिति के अनुसार फ़िल्टर करें", "allStatuses": "सभी स्थितियाँ", "confirmed": "पुष्टि की गई", "cancelled": "रद्द", "pending": "लंबित", "sortBookings": "बुकिंग क्रमबद्ध करें", "newest": "चेक-इन: नवीनतम", "oldest": "चेक-इन: सबसे पुरानी", "totalHigh": "कुल: अधिक से कम", "totalLow": "कुल: कम से अधिक", "clear": "साफ़ करें", "clearSearch": "खोज साफ़ करें", "showing": "दिखाया जा रहा है", "of": "में से", "bookings": "बुकिंग", "noFound": "कोई बुकिंग नहीं मिली", "tryFilters": "कोई दूसरा खोज शब्द आज़माएँ या फ़िल्टर बदलें।", "property": "प्रॉपर्टी", "room": "कमरा", "user": "उपयोगकर्ता", "unknownUser": "अज्ञात उपयोगकर्ता", "checkIn": "चेक-इन", "checkOut": "चेक-आउट", "guests": "मेहमान", "total": "कुल", "status": "स्थिति", "viewProperty": "प्रॉपर्टी देखें", "cancelBooking": "बुकिंग रद्द करें", "roomNotSpecified": "कमरा निर्दिष्ट नहीं है", "adult": "वयस्क", "adults": "वयस्क", "child": "बच्चा", "children": "बच्चे", "infant": "शिशु", "infants": "शिशु", "loading": "बुकिंग लोड हो रही है...", "backProperty": "← प्रॉपर्टी पर वापस जाएँ", "backStays": "← आवासों पर वापस जाएँ", "confirmBooking": "बुकिंग की पुष्टि करें", "night": "रात", "nights": "रातें", "roomCapacity": "कमरे की क्षमता", "guest": "मेहमान", "guestsWord": "मेहमान", "totalLabel": "कुल", "errorDates": "कृपया चेक-इन और चेक-आउट की तारीखें चुनें।", "errorCheckInPast": "चेक-इन की तारीख पिछली नहीं हो सकती।", "errorCheckOutPast": "चेक-आउट की तारीख पिछली नहीं हो सकती।", "errorOrder": "चेक-आउट की तारीख चेक-इन के बाद होनी चाहिए।", "errorAdult": "कम से कम एक वयस्क आवश्यक है।", "errorCapacity": "यह कमरा अधिकतम {count} वयस्कों और बच्चों को समायोजित कर सकता है।", "errorLogin": "बुकिंग करने के लिए आपको लॉग इन करना होगा।", "errorProperty": "प्रॉपर्टी नहीं मिली।", "adultYears": "13+ वर्ष", "childYears": "2–12 वर्ष", "infantYears": "2 वर्ष से कम", "propertyNotFound": "प्रॉपर्टी नहीं मिली।"},
    "ไทย": {"title": "การจอง", "searchAdmin": "ค้นหาตามโรงแรม ผู้ใช้ หรือวันที่...", "searchUser": "ค้นหาตามโรงแรม ห้องพัก หรือวันที่...", "searchBookings": "ค้นหาการจอง", "filterUser": "กรองตามผู้ใช้", "allUsers": "ผู้ใช้ทั้งหมด", "filterStatus": "กรองตามสถานะ", "allStatuses": "สถานะทั้งหมด", "confirmed": "ยืนยันแล้ว", "cancelled": "ยกเลิกแล้ว", "pending": "รอยืนยัน", "sortBookings": "เรียงการจอง", "newest": "เช็กอิน: ใหม่ที่สุด", "oldest": "เช็กอิน: เก่าที่สุด", "totalHigh": "ยอดรวม: มากไปน้อย", "totalLow": "ยอดรวม: น้อยไปมาก", "clear": "ล้าง", "clearSearch": "ล้างการค้นหา", "showing": "แสดง", "of": "จาก", "bookings": "การจอง", "noFound": "ไม่พบการจอง", "tryFilters": "ลองใช้คำค้นหาอื่นหรือเปลี่ยนตัวกรอง", "property": "ที่พัก", "room": "ห้องพัก", "user": "ผู้ใช้", "unknownUser": "ผู้ใช้ที่ไม่รู้จัก", "checkIn": "เช็กอิน", "checkOut": "เช็กเอาต์", "guests": "ผู้เข้าพัก", "total": "รวม", "status": "สถานะ", "viewProperty": "ดูที่พัก", "cancelBooking": "ยกเลิกการจอง", "roomNotSpecified": "ไม่ได้ระบุห้อง", "adult": "ผู้ใหญ่", "adults": "ผู้ใหญ่", "child": "เด็ก", "children": "เด็ก", "infant": "ทารก", "infants": "ทารก", "loading": "กำลังโหลดการจอง...", "backProperty": "← กลับไปยังที่พัก", "backStays": "← กลับไปยังที่พักทั้งหมด", "confirmBooking": "ยืนยันการจอง", "night": "คืน", "nights": "คืน", "roomCapacity": "ความจุของห้อง", "guest": "ผู้เข้าพัก", "guestsWord": "ผู้เข้าพัก", "totalLabel": "รวม", "errorDates": "โปรดเลือกวันที่เช็กอินและเช็กเอาต์", "errorCheckInPast": "วันที่เช็กอินต้องไม่เป็นวันที่ผ่านมาแล้ว", "errorCheckOutPast": "วันที่เช็กเอาต์ต้องไม่เป็นวันที่ผ่านมาแล้ว", "errorOrder": "วันที่เช็กเอาต์ต้องอยู่หลังวันที่เช็กอิน", "errorAdult": "ต้องมีผู้ใหญ่อย่างน้อยหนึ่งคน", "errorCapacity": "ห้องนี้รองรับผู้ใหญ่และเด็กได้สูงสุด {count} คน", "errorLogin": "คุณต้องเข้าสู่ระบบเพื่อทำการจอง", "errorProperty": "ไม่พบที่พัก", "adultYears": "13+ ปี", "childYears": "2–12 ปี", "infantYears": "อายุต่ำกว่า 2 ปี", "propertyNotFound": "ไม่พบที่พัก"},
    "Bahasa Indonesia": {"title": "Pemesanan", "searchAdmin": "Cari berdasarkan hotel, pengguna, atau tanggal...", "searchUser": "Cari berdasarkan hotel, kamar, atau tanggal...", "searchBookings": "Cari pemesanan", "filterUser": "Filter berdasarkan pengguna", "allUsers": "Semua pengguna", "filterStatus": "Filter berdasarkan status", "allStatuses": "Semua status", "confirmed": "Dikonfirmasi", "cancelled": "Dibatalkan", "pending": "Menunggu", "sortBookings": "Urutkan pemesanan", "newest": "Check-in: terbaru", "oldest": "Check-in: terlama", "totalHigh": "Total: tertinggi ke terendah", "totalLow": "Total: terendah ke tertinggi", "clear": "Hapus", "clearSearch": "Hapus pencarian", "showing": "Menampilkan", "of": "dari", "bookings": "pemesanan", "noFound": "Pemesanan tidak ditemukan", "tryFilters": "Coba istilah pencarian lain atau ubah filter.", "property": "Properti", "room": "Kamar", "user": "Pengguna", "unknownUser": "Pengguna tidak dikenal", "checkIn": "Check-in", "checkOut": "Check-out", "guests": "Tamu", "total": "Total", "status": "Status", "viewProperty": "Lihat properti", "cancelBooking": "Batalkan pemesanan", "roomNotSpecified": "Kamar tidak ditentukan", "adult": "dewasa", "adults": "dewasa", "child": "anak", "children": "anak-anak", "infant": "bayi", "infants": "bayi", "loading": "Memuat pemesanan...", "backProperty": "← Kembali ke properti", "backStays": "← Kembali ke properti", "confirmBooking": "Konfirmasi pemesanan", "night": "malam", "nights": "malam", "roomCapacity": "Kapasitas kamar", "guest": "tamu", "guestsWord": "tamu", "totalLabel": "Total", "errorDates": "Silakan pilih tanggal check-in dan check-out.", "errorCheckInPast": "Tanggal check-in tidak boleh di masa lalu.", "errorCheckOutPast": "Tanggal check-out tidak boleh di masa lalu.", "errorOrder": "Tanggal check-out harus setelah tanggal check-in.", "errorAdult": "Diperlukan setidaknya satu orang dewasa.", "errorCapacity": "Kamar ini dapat menampung hingga {count} orang dewasa dan anak-anak.", "errorLogin": "Anda harus masuk untuk melakukan pemesanan.", "errorProperty": "Properti tidak ditemukan.", "adultYears": "13+ tahun", "childYears": "2–12 tahun", "infantYears": "Di bawah 2 tahun", "propertyNotFound": "Properti tidak ditemukan."},
    "Tiếng Việt": {"title": "Đặt phòng", "searchAdmin": "Tìm theo khách sạn, người dùng hoặc ngày...", "searchUser": "Tìm theo khách sạn, phòng hoặc ngày...", "searchBookings": "Tìm kiếm đặt phòng", "filterUser": "Lọc theo người dùng", "allUsers": "Tất cả người dùng", "filterStatus": "Lọc theo trạng thái", "allStatuses": "Tất cả trạng thái", "confirmed": "Đã xác nhận", "cancelled": "Đã hủy", "pending": "Đang chờ", "sortBookings": "Sắp xếp đặt phòng", "newest": "Nhận phòng: mới nhất", "oldest": "Nhận phòng: cũ nhất", "totalHigh": "Tổng: cao đến thấp", "totalLow": "Tổng: thấp đến cao", "clear": "Xóa", "clearSearch": "Xóa tìm kiếm", "showing": "Đang hiển thị", "of": "trên", "bookings": "đặt phòng", "noFound": "Không tìm thấy đặt phòng", "tryFilters": "Hãy thử từ khóa khác hoặc thay đổi bộ lọc.", "property": "Chỗ nghỉ", "room": "Phòng", "user": "Người dùng", "unknownUser": "Người dùng không xác định", "checkIn": "Nhận phòng", "checkOut": "Trả phòng", "guests": "Khách", "total": "Tổng", "status": "Trạng thái", "viewProperty": "Xem chỗ nghỉ", "cancelBooking": "Hủy đặt phòng", "roomNotSpecified": "Chưa chỉ định phòng", "adult": "người lớn", "adults": "người lớn", "child": "trẻ em", "children": "trẻ em", "infant": "em bé", "infants": "em bé", "loading": "Đang tải đặt phòng...", "backProperty": "← Quay lại chỗ nghỉ", "backStays": "← Quay lại các chỗ nghỉ", "confirmBooking": "Xác nhận đặt phòng", "night": "đêm", "nights": "đêm", "roomCapacity": "Sức chứa phòng", "guest": "khách", "guestsWord": "khách", "totalLabel": "Tổng cộng", "errorDates": "Vui lòng chọn ngày nhận phòng và trả phòng.", "errorCheckInPast": "Ngày nhận phòng không thể ở trong quá khứ.", "errorCheckOutPast": "Ngày trả phòng không thể ở trong quá khứ.", "errorOrder": "Ngày trả phòng phải sau ngày nhận phòng.", "errorAdult": "Cần ít nhất một người lớn.", "errorCapacity": "Phòng này có thể chứa tối đa {count} người lớn và trẻ em.", "errorLogin": "Bạn phải đăng nhập để đặt phòng.", "errorProperty": "Không tìm thấy chỗ nghỉ.", "adultYears": "13+ tuổi", "childYears": "2–12 tuổi", "infantYears": "Dưới 2 tuổi", "propertyNotFound": "Không tìm thấy chỗ nghỉ."},
    "한국어": {"title": "예약", "searchAdmin": "호텔, 사용자 또는 날짜로 검색...", "searchUser": "호텔, 객실 또는 날짜로 검색...", "searchBookings": "예약 검색", "filterUser": "사용자별 필터", "allUsers": "모든 사용자", "filterStatus": "상태별 필터", "allStatuses": "모든 상태", "confirmed": "확정됨", "cancelled": "취소됨", "pending": "대기 중", "sortBookings": "예약 정렬", "newest": "체크인: 최신순", "oldest": "체크인: 오래된순", "totalHigh": "총액: 높은순", "totalLow": "총액: 낮은순", "clear": "지우기", "clearSearch": "검색 지우기", "showing": "표시", "of": "중", "bookings": "예약", "noFound": "예약을 찾을 수 없습니다", "tryFilters": "다른 검색어를 입력하거나 필터를 변경해 보세요.", "property": "숙소", "room": "객실", "user": "사용자", "unknownUser": "알 수 없는 사용자", "checkIn": "체크인", "checkOut": "체크아웃", "guests": "투숙객", "total": "총액", "status": "상태", "viewProperty": "숙소 보기", "cancelBooking": "예약 취소", "roomNotSpecified": "객실이 지정되지 않음", "adult": "성인", "adults": "성인", "child": "어린이", "children": "어린이", "infant": "유아", "infants": "유아", "loading": "예약을 불러오는 중...", "backProperty": "← 숙소로 돌아가기", "backStays": "← 숙소 목록으로 돌아가기", "confirmBooking": "예약 확인", "night": "박", "nights": "박", "roomCapacity": "객실 수용 인원", "guest": "명", "guestsWord": "명", "totalLabel": "총액", "errorDates": "체크인 및 체크아웃 날짜를 선택하세요.", "errorCheckInPast": "체크인 날짜는 과거일 수 없습니다.", "errorCheckOutPast": "체크아웃 날짜는 과거일 수 없습니다.", "errorOrder": "체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.", "errorAdult": "최소 한 명의 성인이 필요합니다.", "errorCapacity": "이 객실은 최대 {count}명의 성인과 어린이를 수용할 수 있습니다.", "errorLogin": "예약하려면 로그인해야 합니다.", "errorProperty": "숙소를 찾을 수 없습니다.", "adultYears": "13세 이상", "childYears": "2–12세", "infantYears": "2세 미만", "propertyNotFound": "숙소를 찾을 수 없습니다."},
    "日本語": {"title": "予約", "searchAdmin": "ホテル、ユーザー、または日付で検索...", "searchUser": "ホテル、部屋、または日付で検索...", "searchBookings": "予約を検索", "filterUser": "ユーザーで絞り込む", "allUsers": "すべてのユーザー", "filterStatus": "ステータスで絞り込む", "allStatuses": "すべてのステータス", "confirmed": "確定", "cancelled": "キャンセル済み", "pending": "保留中", "sortBookings": "予約を並べ替え", "newest": "チェックイン：新しい順", "oldest": "チェックイン：古い順", "totalHigh": "合計：高い順", "totalLow": "合計：安い順", "clear": "クリア", "clearSearch": "検索をクリア", "showing": "表示", "of": "全", "bookings": "件の予約", "noFound": "予約が見つかりません", "tryFilters": "別の検索語を試すか、フィルターを変更してください。", "property": "宿泊施設", "room": "部屋", "user": "ユーザー", "unknownUser": "不明なユーザー", "checkIn": "チェックイン", "checkOut": "チェックアウト", "guests": "宿泊者", "total": "合計", "status": "ステータス", "viewProperty": "宿泊施設を見る", "cancelBooking": "予約をキャンセル", "roomNotSpecified": "部屋が指定されていません", "adult": "大人", "adults": "大人", "child": "子ども", "children": "子ども", "infant": "乳幼児", "infants": "乳幼児", "loading": "予約を読み込んでいます...", "backProperty": "← 宿泊施設に戻る", "backStays": "← 宿泊施設一覧に戻る", "confirmBooking": "予約を確定", "night": "泊", "nights": "泊", "roomCapacity": "部屋の定員", "guest": "名", "guestsWord": "名", "totalLabel": "合計", "errorDates": "チェックインとチェックアウトの日付を選択してください。", "errorCheckInPast": "チェックイン日は過去の日付にできません。", "errorCheckOutPast": "チェックアウト日は過去の日付にできません。", "errorOrder": "チェックアウト日はチェックイン日より後である必要があります。", "errorAdult": "大人が1名以上必要です。", "errorCapacity": "この部屋には最大{count}名の大人と子どもが宿泊できます。", "errorLogin": "予約するにはログインしてください。", "errorProperty": "宿泊施設が見つかりません。", "adultYears": "13歳以上", "childYears": "2～12歳", "infantYears": "2歳未満", "propertyNotFound": "宿泊施設が見つかりません。"},
    "中文": {"title": "预订", "searchAdmin": "按酒店、用户或日期搜索...", "searchUser": "按酒店、房间或日期搜索...", "searchBookings": "搜索预订", "filterUser": "按用户筛选", "allUsers": "所有用户", "filterStatus": "按状态筛选", "allStatuses": "所有状态", "confirmed": "已确认", "cancelled": "已取消", "pending": "待确认", "sortBookings": "排序预订", "newest": "入住：最新", "oldest": "入住：最早", "totalHigh": "总计：从高到低", "totalLow": "总计：从低到高", "clear": "清除", "clearSearch": "清除搜索", "showing": "显示", "of": "共", "bookings": "个预订", "noFound": "未找到预订", "tryFilters": "请尝试其他搜索词或更改筛选条件。", "property": "住宿", "room": "房间", "user": "用户", "unknownUser": "未知用户", "checkIn": "入住", "checkOut": "退房", "guests": "住客", "total": "总计", "status": "状态", "viewProperty": "查看住宿", "cancelBooking": "取消预订", "roomNotSpecified": "未指定房间", "adult": "成人", "adults": "成人", "child": "儿童", "children": "儿童", "infant": "婴儿", "infants": "婴儿", "loading": "正在加载预订...", "backProperty": "← 返回住宿", "backStays": "← 返回住宿列表", "confirmBooking": "确认预订", "night": "晚", "nights": "晚", "roomCapacity": "房间容量", "guest": "位客人", "guestsWord": "位客人", "totalLabel": "总计", "errorDates": "请选择入住和退房日期。", "errorCheckInPast": "入住日期不能是过去的日期。", "errorCheckOutPast": "退房日期不能是过去的日期。", "errorOrder": "退房日期必须晚于入住日期。", "errorAdult": "至少需要一名成人。", "errorCapacity": "此房间最多可容纳 {count} 名成人和儿童。", "errorLogin": "您必须登录才能进行预订。", "errorProperty": "未找到住宿。", "adultYears": "13岁以上", "childYears": "2–12岁", "infantYears": "2岁以下", "propertyNotFound": "未找到住宿。"},
    "繁體中文": {"title": "預訂", "searchAdmin": "按飯店、使用者或日期搜尋...", "searchUser": "按飯店、房間或日期搜尋...", "searchBookings": "搜尋預訂", "filterUser": "依使用者篩選", "allUsers": "所有使用者", "filterStatus": "依狀態篩選", "allStatuses": "所有狀態", "confirmed": "已確認", "cancelled": "已取消", "pending": "待確認", "sortBookings": "排序預訂", "newest": "入住：最新", "oldest": "入住：最早", "totalHigh": "總計：由高到低", "totalLow": "總計：由低到高", "clear": "清除", "clearSearch": "清除搜尋", "showing": "顯示", "of": "共", "bookings": "筆預訂", "noFound": "找不到預訂", "tryFilters": "請嘗試其他搜尋字詞或變更篩選條件。", "property": "住宿", "room": "房間", "user": "使用者", "unknownUser": "未知使用者", "checkIn": "入住", "checkOut": "退房", "guests": "房客", "total": "總計", "status": "狀態", "viewProperty": "查看住宿", "cancelBooking": "取消預訂", "roomNotSpecified": "未指定房間", "adult": "成人", "adults": "成人", "child": "兒童", "children": "兒童", "infant": "嬰兒", "infants": "嬰兒", "loading": "正在載入預訂...", "backProperty": "← 返回住宿", "backStays": "← 返回住宿列表", "confirmBooking": "確認預訂", "night": "晚", "nights": "晚", "roomCapacity": "房間容量", "guest": "位房客", "guestsWord": "位房客", "totalLabel": "總計", "errorDates": "請選擇入住和退房日期。", "errorCheckInPast": "入住日期不能是過去的日期。", "errorCheckOutPast": "退房日期不能是過去的日期。", "errorOrder": "退房日期必須晚於入住日期。", "errorAdult": "至少需要一位成人。", "errorCapacity": "此房間最多可容納 {count} 位成人和兒童。", "errorLogin": "您必須登入才能進行預訂。", "errorProperty": "找不到住宿。", "adultYears": "13歲以上", "childYears": "2–12歲", "infantYears": "2歲以下", "propertyNotFound": "找不到住宿。"},
    "Català": {"title": "Reserves", "searchAdmin": "Cerca per hotel, usuari o data...", "searchUser": "Cerca per hotel, habitació o data...", "searchBookings": "Cerca reserves", "filterUser": "Filtra per usuari", "allUsers": "Tots els usuaris", "filterStatus": "Filtra per estat", "allStatuses": "Tots els estats", "confirmed": "Confirmada", "cancelled": "Cancel·lada", "pending": "Pendent", "sortBookings": "Ordena les reserves", "newest": "Entrada: més recents", "oldest": "Entrada: més antigues", "totalHigh": "Total: de més alt a més baix", "totalLow": "Total: de més baix a més alt", "clear": "Neteja", "clearSearch": "Neteja la cerca", "showing": "Mostrant", "of": "de", "bookings": "reserves", "noFound": "No s'han trobat reserves", "tryFilters": "Prova un altre terme de cerca o canvia els filtres.", "property": "Allotjament", "room": "Habitació", "user": "Usuari", "unknownUser": "Usuari desconegut", "checkIn": "Entrada", "checkOut": "Sortida", "guests": "Hostes", "total": "Total", "status": "Estat", "viewProperty": "Veure allotjament", "cancelBooking": "Cancel·la la reserva", "roomNotSpecified": "Habitació no especificada", "adult": "adult", "adults": "adults", "child": "nen", "children": "nens", "infant": "nadó", "infants": "nadons", "loading": "S'està carregant la reserva...", "backProperty": "← Torna a l'allotjament", "backStays": "← Torna als allotjaments", "confirmBooking": "Confirma la reserva", "night": "nit", "nights": "nits", "roomCapacity": "Capacitat de l'habitació", "guest": "hoste", "guestsWord": "hostes", "totalLabel": "Total", "errorDates": "Selecciona les dates d'entrada i sortida.", "errorCheckInPast": "La data d'entrada no pot ser en el passat.", "errorCheckOutPast": "La data de sortida no pot ser en el passat.", "errorOrder": "La data de sortida ha de ser posterior a la data d'entrada.", "errorAdult": "Cal almenys un adult.", "errorCapacity": "Aquesta habitació pot allotjar fins a {count} adults i nens.", "errorLogin": "Has d'iniciar sessió per fer una reserva.", "errorProperty": "No s'ha trobat l'allotjament.", "adultYears": "13+ anys", "childYears": "2–12 anys", "infantYears": "Menys de 2 anys", "propertyNotFound": "No s'ha trobat l'allotjament."},
    "Eesti": {"title": "Broneeringud", "searchAdmin": "Otsi hotelli, kasutaja või kuupäeva järgi...", "searchUser": "Otsi hotelli, toa või kuupäeva järgi...", "searchBookings": "Otsi broneeringuid", "filterUser": "Filtreeri kasutaja järgi", "allUsers": "Kõik kasutajad", "filterStatus": "Filtreeri oleku järgi", "allStatuses": "Kõik olekud", "confirmed": "Kinnitatud", "cancelled": "Tühistatud", "pending": "Ootel", "sortBookings": "Sorteeri broneeringuid", "newest": "Sisseregistreerimine: uusimad", "oldest": "Sisseregistreerimine: vanimad", "totalHigh": "Kokku: suuremast väiksemani", "totalLow": "Kokku: väiksemast suuremani", "clear": "Tühjenda", "clearSearch": "Tühjenda otsing", "showing": "Kuvatakse", "of": "broneeringust", "bookings": "broneeringut", "noFound": "Broneeringuid ei leitud", "tryFilters": "Proovi teist otsinguterminit või muuda filtreid.", "property": "Majutus", "room": "Tuba", "user": "Kasutaja", "unknownUser": "Tundmatu kasutaja", "checkIn": "Sisseregistreerimine", "checkOut": "Väljaregistreerimine", "guests": "Külalised", "total": "Kokku", "status": "Olek", "viewProperty": "Vaata majutust", "cancelBooking": "Tühista broneering", "roomNotSpecified": "Tuba pole määratud", "adult": "täiskasvanu", "adults": "täiskasvanut", "child": "laps", "children": "last", "infant": "imik", "infants": "imikut", "loading": "Broneeringu laadimine...", "backProperty": "← Tagasi majutuse juurde", "backStays": "← Tagasi majutuste juurde", "confirmBooking": "Kinnita broneering", "night": "öö", "nights": "ööd", "roomCapacity": "Toa mahutavus", "guest": "külaline", "guestsWord": "külalist", "totalLabel": "Kokku", "errorDates": "Valige sisse- ja väljaregistreerimise kuupäevad.", "errorCheckInPast": "Sisseregistreerimise kuupäev ei saa olla minevikus.", "errorCheckOutPast": "Väljaregistreerimise kuupäev ei saa olla minevikus.", "errorOrder": "Väljaregistreerimise kuupäev peab olema pärast sisseregistreerimise kuupäeva.", "errorAdult": "Vajalik on vähemalt üks täiskasvanu.", "errorCapacity": "Selles toas saab majutada kuni {count} täiskasvanut ja last.", "errorLogin": "Broneeringu tegemiseks peate sisse logima.", "errorProperty": "Majutust ei leitud.", "adultYears": "13+ aastat", "childYears": "2–12 aastat", "infantYears": "Alla 2-aastased", "propertyNotFound": "Majutust ei leitud."},
    "Latviešu": {"title": "Rezervācijas", "searchAdmin": "Meklēt pēc viesnīcas, lietotāja vai datuma...", "searchUser": "Meklēt pēc viesnīcas, istabas vai datuma...", "searchBookings": "Meklēt rezervācijas", "filterUser": "Filtrēt pēc lietotāja", "allUsers": "Visi lietotāji", "filterStatus": "Filtrēt pēc statusa", "allStatuses": "Visi statusi", "confirmed": "Apstiprināta", "cancelled": "Atcelta", "pending": "Gaida apstiprinājumu", "sortBookings": "Kārtot rezervācijas", "newest": "Ierašanās: jaunākās", "oldest": "Ierašanās: vecākās", "totalHigh": "Kopā: no lielākās uz mazāko", "totalLow": "Kopā: no mazākās uz lielāko", "clear": "Notīrīt", "clearSearch": "Notīrīt meklēšanu", "showing": "Rāda", "of": "no", "bookings": "rezervācijām", "noFound": "Rezervācijas nav atrastas", "tryFilters": "Izmēģiniet citu meklēšanas vārdu vai mainiet filtrus.", "property": "Naktsmītne", "room": "Istaba", "user": "Lietotājs", "unknownUser": "Nezināms lietotājs", "checkIn": "Ierašanās", "checkOut": "Izrakstīšanās", "guests": "Viesi", "total": "Kopā", "status": "Statuss", "viewProperty": "Skatīt naktsmītni", "cancelBooking": "Atcelt rezervāciju", "roomNotSpecified": "Istaba nav norādīta", "adult": "pieaugušais", "adults": "pieaugušie", "child": "bērns", "children": "bērni", "infant": "zīdainis", "infants": "zīdaiņi", "loading": "Notiek rezervācijas ielāde...", "backProperty": "← Atpakaļ uz naktsmītni", "backStays": "← Atpakaļ uz naktsmītnēm", "confirmBooking": "Apstiprināt rezervāciju", "night": "nakts", "nights": "naktis", "roomCapacity": "Istabas ietilpība", "guest": "viesis", "guestsWord": "viesi", "totalLabel": "Kopā", "errorDates": "Lūdzu, izvēlieties ierašanās un izrakstīšanās datumus.", "errorCheckInPast": "Ierašanās datums nevar būt pagātnē.", "errorCheckOutPast": "Izrakstīšanās datums nevar būt pagātnē.", "errorOrder": "Izrakstīšanās datumam jābūt pēc ierašanās datuma.", "errorAdult": "Nepieciešams vismaz viens pieaugušais.", "errorCapacity": "Šajā numurā var izmitināt līdz {count} pieaugušajiem un bērniem.", "errorLogin": "Lai veiktu rezervāciju, jums jāpiesakās.", "errorProperty": "Naktsmītne nav atrasta.", "adultYears": "13+ gadi", "childYears": "2–12 gadi", "infantYears": "Līdz 2 gadiem", "propertyNotFound": "Naktsmītne nav atrasta."},
    "Lietuvių": {"title": "Užsakymai", "searchAdmin": "Ieškoti pagal viešbutį, naudotoją arba datą...", "searchUser": "Ieškoti pagal viešbutį, kambarį arba datą...", "searchBookings": "Ieškoti užsakymų", "filterUser": "Filtruoti pagal naudotoją", "allUsers": "Visi naudotojai", "filterStatus": "Filtruoti pagal būseną", "allStatuses": "Visos būsenos", "confirmed": "Patvirtinta", "cancelled": "Atšaukta", "pending": "Laukiama patvirtinimo", "sortBookings": "Rikiuoti užsakymus", "newest": "Atvykimas: naujausi", "oldest": "Atvykimas: seniausi", "totalHigh": "Iš viso: nuo didžiausio iki mažiausio", "totalLow": "Iš viso: nuo mažiausio iki didžiausio", "clear": "Išvalyti", "clearSearch": "Išvalyti paiešką", "showing": "Rodoma", "of": "iš", "bookings": "užsakymų", "noFound": "Užsakymų nerasta", "tryFilters": "Pabandykite kitą paieškos terminą arba pakeiskite filtrus.", "property": "Apgyvendinimo vieta", "room": "Kambarys", "user": "Naudotojas", "unknownUser": "Nežinomas naudotojas", "checkIn": "Atvykimas", "checkOut": "Išvykimas", "guests": "Svečiai", "total": "Iš viso", "status": "Būsena", "viewProperty": "Peržiūrėti apgyvendinimo vietą", "cancelBooking": "Atšaukti užsakymą", "roomNotSpecified": "Kambarys nenurodytas", "adult": "suaugusysis", "adults": "suaugusieji", "child": "vaikas", "children": "vaikai", "infant": "kūdikis", "infants": "kūdikiai", "loading": "Įkeliama rezervacija...", "backProperty": "← Grįžti į apgyvendinimo vietą", "backStays": "← Grįžti į apgyvendinimo vietas", "confirmBooking": "Patvirtinti rezervaciją", "night": "naktis", "nights": "naktys", "roomCapacity": "Kambario talpa", "guest": "svečias", "guestsWord": "svečiai", "totalLabel": "Iš viso", "errorDates": "Pasirinkite atvykimo ir išvykimo datas.", "errorCheckInPast": "Atvykimo data negali būti praeityje.", "errorCheckOutPast": "Išvykimo data negali būti praeityje.", "errorOrder": "Išvykimo data turi būti vėlesnė už atvykimo datą.", "errorAdult": "Reikalingas bent vienas suaugusysis.", "errorCapacity": "Šiame kambaryje gali apsistoti iki {count} suaugusiųjų ir vaikų.", "errorLogin": "Norėdami atlikti rezervaciją turite prisijungti.", "errorProperty": "Apgyvendinimo vieta nerasta.", "adultYears": "13+ metų", "childYears": "2–12 metų", "infantYears": "Iki 2 metų", "propertyNotFound": "Apgyvendinimo vieta nerasta."}
};



/* =========================================================
   BOOKINGS PAGE — EXTRA UI TRANSLATIONS
   Text only. No booking/filter/storage logic is changed.
   ========================================================= */

const bookingPageExtraTranslations: Record<
    string,
    Record<string, string>
> = {
    English: {
        email: "Email",
        phone: "Phone",
        bookingPending: "Booking pending",
        pendingMessage: "Your reservation is waiting for confirmation from StayWay.",
        transferSearchPlaceholder: "Search by route, vehicle or driver...",
        clearTransferSearch: "Clear transfer search",
        filterTransferType: "Filter by transfer type",
        allTransferTypes: "All types",
        filterTransferDate: "Filter by transfer date",
        allDates: "All dates",
        upcoming: "Upcoming",
        past: "Past",
        filterVehicle: "Filter by vehicle",
        allVehicles: "All vehicles",
        filterPassengers: "Filter by passengers",
        anyPassengers: "Any passengers",
        sortTransfers: "Sort transfers",
        transfersLower: "transfers",
        newestFirst: "Newest first",
        oldestFirst: "Oldest first",
        priceHigh: "Price: high",
        priceLow: "Price: low",
        driver: "Driver",
        noTransfersFound: "No transfer bookings found",
        noTransfersHint: "Try changing the filters or book a new transfer.",
        findTransfers: "Find transfers",
        basicRoom: "Basic",
    },

    "Română": {
        email: "Email",
        phone: "Telefon",
        bookingPending: "Rezervare în așteptare",
        pendingMessage: "Rezervarea ta așteaptă confirmarea StayWay.",
        transferSearchPlaceholder: "Caută după rută, vehicul sau șofer...",
        clearTransferSearch: "Șterge căutarea transferurilor",
        filterTransferType: "Filtrează după tipul transferului",
        allTransferTypes: "Toate tipurile",
        filterTransferDate: "Filtrează după data transferului",
        allDates: "Toate datele",
        upcoming: "Viitoare",
        past: "Trecute",
        filterVehicle: "Filtrează după vehicul",
        allVehicles: "Toate vehiculele",
        filterPassengers: "Filtrează după pasageri",
        anyPassengers: "Orice număr de pasageri",
        sortTransfers: "Sortează transferurile",
        transfersLower: "transferuri",
        newestFirst: "Cele mai noi",
        oldestFirst: "Cele mai vechi",
        priceHigh: "Preț: descrescător",
        priceLow: "Preț: crescător",
        driver: "Șofer",
        noTransfersFound: "Nu au fost găsite rezervări de transfer",
        noTransfersHint: "Schimbă filtrele sau rezervă un transfer nou.",
        findTransfers: "Caută transferuri",
        basicRoom: "Basică",
    },

    "Русский": {
        email: "Email",
        phone: "Телефон",
        bookingPending: "Бронирование ожидает подтверждения",
        pendingMessage: "Ваше бронирование ожидает подтверждения от StayWay.",
        transferSearchPlaceholder: "Поиск по маршруту, автомобилю или водителю...",
        clearTransferSearch: "Очистить поиск трансферов",
        filterTransferType: "Фильтр по типу трансфера",
        allTransferTypes: "Все типы",
        filterTransferDate: "Фильтр по дате трансфера",
        allDates: "Все даты",
        upcoming: "Предстоящие",
        past: "Прошедшие",
        filterVehicle: "Фильтр по автомобилю",
        allVehicles: "Все автомобили",
        filterPassengers: "Фильтр по пассажирам",
        anyPassengers: "Любое число пассажиров",
        sortTransfers: "Сортировать трансферы",
        transfersLower: "трансферов",
        newestFirst: "Сначала новые",
        oldestFirst: "Сначала старые",
        priceHigh: "Цена: по убыванию",
        priceLow: "Цена: по возрастанию",
        driver: "Водитель",
        noTransfersFound: "Бронирования трансферов не найдены",
        noTransfersHint: "Измените фильтры или забронируйте новый трансфер.",
        findTransfers: "Найти трансфер",
        basicRoom: "Базовый",
    },

    "Українська": {
        email: "Email",
        phone: "Телефон",
        bookingPending: "Бронювання очікує підтвердження",
        pendingMessage: "Ваше бронювання очікує підтвердження від StayWay.",
        transferSearchPlaceholder: "Пошук за маршрутом, автомобілем або водієм...",
        clearTransferSearch: "Очистити пошук трансферів",
        filterTransferType: "Фільтр за типом трансферу",
        allTransferTypes: "Усі типи",
        filterTransferDate: "Фільтр за датою трансферу",
        allDates: "Усі дати",
        upcoming: "Майбутні",
        past: "Минулі",
        filterVehicle: "Фільтр за автомобілем",
        allVehicles: "Усі автомобілі",
        filterPassengers: "Фільтр за пасажирами",
        anyPassengers: "Будь-яка кількість пасажирів",
        sortTransfers: "Сортувати трансфери",
        transfersLower: "трансферів",
        newestFirst: "Спочатку нові",
        oldestFirst: "Спочатку старі",
        priceHigh: "Ціна: за спаданням",
        priceLow: "Ціна: за зростанням",
        driver: "Водій",
        noTransfersFound: "Бронювань трансферів не знайдено",
        noTransfersHint: "Змініть фільтри або забронюйте новий трансфер.",
        findTransfers: "Знайти трансфер",
        basicRoom: "Базовий",
    },

    "Français": {
        email: "E-mail",
        phone: "Téléphone",
        bookingPending: "Réservation en attente",
        pendingMessage: "Votre réservation attend la confirmation de StayWay.",
        transferSearchPlaceholder: "Rechercher par trajet, véhicule ou chauffeur...",
        clearTransferSearch: "Effacer la recherche de transferts",
        filterTransferType: "Filtrer par type de transfert",
        allTransferTypes: "Tous les types",
        filterTransferDate: "Filtrer par date de transfert",
        allDates: "Toutes les dates",
        upcoming: "À venir",
        past: "Passés",
        filterVehicle: "Filtrer par véhicule",
        allVehicles: "Tous les véhicules",
        filterPassengers: "Filtrer par passagers",
        anyPassengers: "Tous nombres de passagers",
        sortTransfers: "Trier les transferts",
        transfersLower: "transferts",
        newestFirst: "Plus récents d’abord",
        oldestFirst: "Plus anciens d’abord",
        priceHigh: "Prix : décroissant",
        priceLow: "Prix : croissant",
        driver: "Chauffeur",
        noTransfersFound: "Aucune réservation de transfert trouvée",
        noTransfersHint: "Modifiez les filtres ou réservez un nouveau transfert.",
        findTransfers: "Trouver un transfert",
        basicRoom: "Basique",
    },

    "Español": {
        email: "Correo electrónico",
        phone: "Teléfono",
        bookingPending: "Reserva pendiente",
        pendingMessage: "Tu reserva está esperando la confirmación de StayWay.",
        transferSearchPlaceholder: "Buscar por ruta, vehículo o conductor...",
        clearTransferSearch: "Limpiar búsqueda de traslados",
        filterTransferType: "Filtrar por tipo de traslado",
        allTransferTypes: "Todos los tipos",
        filterTransferDate: "Filtrar por fecha del traslado",
        allDates: "Todas las fechas",
        upcoming: "Próximos",
        past: "Pasados",
        filterVehicle: "Filtrar por vehículo",
        allVehicles: "Todos los vehículos",
        filterPassengers: "Filtrar por pasajeros",
        anyPassengers: "Cualquier número de pasajeros",
        sortTransfers: "Ordenar traslados",
        transfersLower: "traslados",
        newestFirst: "Más recientes primero",
        oldestFirst: "Más antiguos primero",
        priceHigh: "Precio: de mayor a menor",
        priceLow: "Precio: de menor a mayor",
        driver: "Conductor",
        noTransfersFound: "No se encontraron reservas de traslado",
        noTransfersHint: "Cambia los filtros o reserva un nuevo traslado.",
        findTransfers: "Buscar traslados",
        basicRoom: "Básica",
    },

    "Deutsch": {
        email: "E-Mail",
        phone: "Telefon",
        bookingPending: "Buchung ausstehend",
        pendingMessage: "Ihre Buchung wartet auf die Bestätigung durch StayWay.",
        transferSearchPlaceholder: "Nach Route, Fahrzeug oder Fahrer suchen...",
        clearTransferSearch: "Transfersuche löschen",
        filterTransferType: "Nach Transfertyp filtern",
        allTransferTypes: "Alle Typen",
        filterTransferDate: "Nach Transferdatum filtern",
        allDates: "Alle Daten",
        upcoming: "Bevorstehend",
        past: "Vergangen",
        filterVehicle: "Nach Fahrzeug filtern",
        allVehicles: "Alle Fahrzeuge",
        filterPassengers: "Nach Passagieren filtern",
        anyPassengers: "Beliebige Passagierzahl",
        sortTransfers: "Transfers sortieren",
        transfersLower: "Transfers",
        newestFirst: "Neueste zuerst",
        oldestFirst: "Älteste zuerst",
        priceHigh: "Preis: absteigend",
        priceLow: "Preis: aufsteigend",
        driver: "Fahrer",
        noTransfersFound: "Keine Transferbuchungen gefunden",
        noTransfersHint: "Ändern Sie die Filter oder buchen Sie einen neuen Transfer.",
        findTransfers: "Transfer finden",
        basicRoom: "Basis",
    },

    "Italiano": {
        email: "Email",
        phone: "Telefono",
        bookingPending: "Prenotazione in attesa",
        pendingMessage: "La tua prenotazione è in attesa della conferma di StayWay.",
        transferSearchPlaceholder: "Cerca per percorso, veicolo o autista...",
        clearTransferSearch: "Cancella ricerca transfer",
        filterTransferType: "Filtra per tipo di transfer",
        allTransferTypes: "Tutti i tipi",
        filterTransferDate: "Filtra per data del transfer",
        allDates: "Tutte le date",
        upcoming: "Prossimi",
        past: "Passati",
        filterVehicle: "Filtra per veicolo",
        allVehicles: "Tutti i veicoli",
        filterPassengers: "Filtra per passeggeri",
        anyPassengers: "Qualsiasi numero di passeggeri",
        sortTransfers: "Ordina transfer",
        transfersLower: "transfer",
        newestFirst: "Più recenti prima",
        oldestFirst: "Più vecchi prima",
        priceHigh: "Prezzo: decrescente",
        priceLow: "Prezzo: crescente",
        driver: "Autista",
        noTransfersFound: "Nessuna prenotazione transfer trovata",
        noTransfersHint: "Modifica i filtri o prenota un nuovo transfer.",
        findTransfers: "Trova transfer",
        basicRoom: "Base",
    },

    "Português": {
        email: "E-mail",
        phone: "Telefone",
        bookingPending: "Reserva pendente",
        pendingMessage: "A sua reserva está à espera da confirmação da StayWay.",
        transferSearchPlaceholder: "Pesquisar por rota, veículo ou motorista...",
        clearTransferSearch: "Limpar pesquisa de transfers",
        filterTransferType: "Filtrar por tipo de transfer",
        allTransferTypes: "Todos os tipos",
        filterTransferDate: "Filtrar por data do transfer",
        allDates: "Todas as datas",
        upcoming: "Próximos",
        past: "Passados",
        filterVehicle: "Filtrar por veículo",
        allVehicles: "Todos os veículos",
        filterPassengers: "Filtrar por passageiros",
        anyPassengers: "Qualquer número de passageiros",
        sortTransfers: "Ordenar transfers",
        transfersLower: "transfers",
        newestFirst: "Mais recentes primeiro",
        oldestFirst: "Mais antigos primeiro",
        priceHigh: "Preço: do maior para o menor",
        priceLow: "Preço: do menor para o maior",
        driver: "Motorista",
        noTransfersFound: "Nenhuma reserva de transfer encontrada",
        noTransfersHint: "Altere os filtros ou reserve um novo transfer.",
        findTransfers: "Encontrar transfer",
        basicRoom: "Básico",
    },

    "Nederlands": {
        email: "E-mail",
        phone: "Telefoon",
        bookingPending: "Boeking in afwachting",
        pendingMessage: "Je boeking wacht op bevestiging van StayWay.",
        transferSearchPlaceholder: "Zoeken op route, voertuig of chauffeur...",
        clearTransferSearch: "Transferzoekopdracht wissen",
        filterTransferType: "Filteren op transfertype",
        allTransferTypes: "Alle typen",
        filterTransferDate: "Filteren op transferdatum",
        allDates: "Alle datums",
        upcoming: "Aankomend",
        past: "Voorbij",
        filterVehicle: "Filteren op voertuig",
        allVehicles: "Alle voertuigen",
        filterPassengers: "Filteren op passagiers",
        anyPassengers: "Elk aantal passagiers",
        sortTransfers: "Transfers sorteren",
        transfersLower: "transfers",
        newestFirst: "Nieuwste eerst",
        oldestFirst: "Oudste eerst",
        priceHigh: "Prijs: hoog naar laag",
        priceLow: "Prijs: laag naar hoog",
        driver: "Chauffeur",
        noTransfersFound: "Geen transferboekingen gevonden",
        noTransfersHint: "Pas de filters aan of boek een nieuwe transfer.",
        findTransfers: "Transfer zoeken",
        basicRoom: "Basis",
    },

    "Norsk": {
        email: "E-post",
        phone: "Telefon",
        bookingPending: "Bestilling venter",
        pendingMessage: "Bestillingen din venter på bekreftelse fra StayWay.",
        transferSearchPlaceholder: "Søk etter rute, kjøretøy eller sjåfør...",
        clearTransferSearch: "Tøm transfersøk",
        filterTransferType: "Filtrer etter transfertype",
        allTransferTypes: "Alle typer",
        filterTransferDate: "Filtrer etter transferdato",
        allDates: "Alle datoer",
        upcoming: "Kommende",
        past: "Tidligere",
        filterVehicle: "Filtrer etter kjøretøy",
        allVehicles: "Alle kjøretøy",
        filterPassengers: "Filtrer etter passasjerer",
        anyPassengers: "Valgfritt antall passasjerer",
        sortTransfers: "Sorter transfer",
        transfersLower: "transfer",
        newestFirst: "Nyeste først",
        oldestFirst: "Eldste først",
        priceHigh: "Pris: høy til lav",
        priceLow: "Pris: lav til høy",
        driver: "Sjåfør",
        noTransfersFound: "Ingen transferbestillinger funnet",
        noTransfersHint: "Endre filtrene eller bestill en ny transfer.",
        findTransfers: "Finn transfer",
        basicRoom: "Basis",
    },

    "Svenska": {
        email: "E-post",
        phone: "Telefon",
        bookingPending: "Bokning väntar",
        pendingMessage: "Din bokning väntar på bekräftelse från StayWay.",
        transferSearchPlaceholder: "Sök efter rutt, fordon eller förare...",
        clearTransferSearch: "Rensa transfersökning",
        filterTransferType: "Filtrera efter transfertyp",
        allTransferTypes: "Alla typer",
        filterTransferDate: "Filtrera efter transferdatum",
        allDates: "Alla datum",
        upcoming: "Kommande",
        past: "Tidigare",
        filterVehicle: "Filtrera efter fordon",
        allVehicles: "Alla fordon",
        filterPassengers: "Filtrera efter passagerare",
        anyPassengers: "Valfritt antal passagerare",
        sortTransfers: "Sortera transfer",
        transfersLower: "transfer",
        newestFirst: "Nyaste först",
        oldestFirst: "Äldsta först",
        priceHigh: "Pris: högst till lägst",
        priceLow: "Pris: lägst till högst",
        driver: "Förare",
        noTransfersFound: "Inga transferbokningar hittades",
        noTransfersHint: "Ändra filtren eller boka en ny transfer.",
        findTransfers: "Hitta transfer",
        basicRoom: "Bas",
    },

    "Dansk": {
        email: "E-mail",
        phone: "Telefon",
        bookingPending: "Reservation afventer",
        pendingMessage: "Din reservation afventer bekræftelse fra StayWay.",
        transferSearchPlaceholder: "Søg efter rute, køretøj eller chauffør...",
        clearTransferSearch: "Ryd transfersøgning",
        filterTransferType: "Filtrer efter transfertype",
        allTransferTypes: "Alle typer",
        filterTransferDate: "Filtrer efter transferdato",
        allDates: "Alle datoer",
        upcoming: "Kommende",
        past: "Tidligere",
        filterVehicle: "Filtrer efter køretøj",
        allVehicles: "Alle køretøjer",
        filterPassengers: "Filtrer efter passagerer",
        anyPassengers: "Ethvert antal passagerer",
        sortTransfers: "Sorter transfers",
        transfersLower: "transfers",
        newestFirst: "Nyeste først",
        oldestFirst: "Ældste først",
        priceHigh: "Pris: høj til lav",
        priceLow: "Pris: lav til høj",
        driver: "Chauffør",
        noTransfersFound: "Ingen transferreservationer fundet",
        noTransfersHint: "Skift filtrene eller book en ny transfer.",
        findTransfers: "Find transfer",
        basicRoom: "Basis",
    },

    "Suomi": {
        email: "Sähköposti",
        phone: "Puhelin",
        bookingPending: "Varaus odottaa",
        pendingMessage: "Varauksesi odottaa StayWayn vahvistusta.",
        transferSearchPlaceholder: "Hae reitin, ajoneuvon tai kuljettajan mukaan...",
        clearTransferSearch: "Tyhjennä kuljetushaku",
        filterTransferType: "Suodata kuljetustyypin mukaan",
        allTransferTypes: "Kaikki tyypit",
        filterTransferDate: "Suodata kuljetuspäivän mukaan",
        allDates: "Kaikki päivät",
        upcoming: "Tulevat",
        past: "Menneet",
        filterVehicle: "Suodata ajoneuvon mukaan",
        allVehicles: "Kaikki ajoneuvot",
        filterPassengers: "Suodata matkustajien mukaan",
        anyPassengers: "Mikä tahansa matkustajamäärä",
        sortTransfers: "Lajittele kuljetukset",
        transfersLower: "kuljetusta",
        newestFirst: "Uusimmat ensin",
        oldestFirst: "Vanhimmat ensin",
        priceHigh: "Hinta: korkein ensin",
        priceLow: "Hinta: matalin ensin",
        driver: "Kuljettaja",
        noTransfersFound: "Kuljetusvarauksia ei löytynyt",
        noTransfersHint: "Muuta suodattimia tai varaa uusi kuljetus.",
        findTransfers: "Etsi kuljetus",
        basicRoom: "Perus",
    },

    "Polski": {
        email: "E-mail",
        phone: "Telefon",
        bookingPending: "Rezerwacja oczekuje",
        pendingMessage: "Twoja rezerwacja oczekuje na potwierdzenie przez StayWay.",
        transferSearchPlaceholder: "Szukaj według trasy, pojazdu lub kierowcy...",
        clearTransferSearch: "Wyczyść wyszukiwanie transferów",
        filterTransferType: "Filtruj według typu transferu",
        allTransferTypes: "Wszystkie typy",
        filterTransferDate: "Filtruj według daty transferu",
        allDates: "Wszystkie daty",
        upcoming: "Nadchodzące",
        past: "Minione",
        filterVehicle: "Filtruj według pojazdu",
        allVehicles: "Wszystkie pojazdy",
        filterPassengers: "Filtruj według pasażerów",
        anyPassengers: "Dowolna liczba pasażerów",
        sortTransfers: "Sortuj transfery",
        transfersLower: "transferów",
        newestFirst: "Najnowsze najpierw",
        oldestFirst: "Najstarsze najpierw",
        priceHigh: "Cena: malejąco",
        priceLow: "Cena: rosnąco",
        driver: "Kierowca",
        noTransfersFound: "Nie znaleziono rezerwacji transferów",
        noTransfersHint: "Zmień filtry lub zarezerwuj nowy transfer.",
        findTransfers: "Znajdź transfer",
        basicRoom: "Podstawowy",
    },

    "Čeština": {
        email: "E-mail",
        phone: "Telefon",
        bookingPending: "Rezervace čeká",
        pendingMessage: "Vaše rezervace čeká na potvrzení StayWay.",
        transferSearchPlaceholder: "Hledat podle trasy, vozidla nebo řidiče...",
        clearTransferSearch: "Vymazat hledání transferů",
        filterTransferType: "Filtrovat podle typu transferu",
        allTransferTypes: "Všechny typy",
        filterTransferDate: "Filtrovat podle data transferu",
        allDates: "Všechna data",
        upcoming: "Nadcházející",
        past: "Minulé",
        filterVehicle: "Filtrovat podle vozidla",
        allVehicles: "Všechna vozidla",
        filterPassengers: "Filtrovat podle cestujících",
        anyPassengers: "Libovolný počet cestujících",
        sortTransfers: "Seřadit transfery",
        transfersLower: "transferů",
        newestFirst: "Nejnovější první",
        oldestFirst: "Nejstarší první",
        priceHigh: "Cena: od nejvyšší",
        priceLow: "Cena: od nejnižší",
        driver: "Řidič",
        noTransfersFound: "Nebyly nalezeny rezervace transferů",
        noTransfersHint: "Změňte filtry nebo si rezervujte nový transfer.",
        findTransfers: "Najít transfer",
        basicRoom: "Základní",
    },

    "Slovenčina": {
        email: "E-mail",
        phone: "Telefón",
        bookingPending: "Rezervácia čaká",
        pendingMessage: "Vaša rezervácia čaká na potvrdenie StayWay.",
        transferSearchPlaceholder: "Hľadať podľa trasy, vozidla alebo vodiča...",
        clearTransferSearch: "Vymazať vyhľadávanie transferov",
        filterTransferType: "Filtrovať podľa typu transferu",
        allTransferTypes: "Všetky typy",
        filterTransferDate: "Filtrovať podľa dátumu transferu",
        allDates: "Všetky dátumy",
        upcoming: "Nadchádzajúce",
        past: "Minulé",
        filterVehicle: "Filtrovať podľa vozidla",
        allVehicles: "Všetky vozidlá",
        filterPassengers: "Filtrovať podľa cestujúcich",
        anyPassengers: "Ľubovoľný počet cestujúcich",
        sortTransfers: "Zoradiť transfery",
        transfersLower: "transferov",
        newestFirst: "Najnovšie prvé",
        oldestFirst: "Najstaršie prvé",
        priceHigh: "Cena: od najvyššej",
        priceLow: "Cena: od najnižšej",
        driver: "Vodič",
        noTransfersFound: "Nenašli sa rezervácie transferov",
        noTransfersHint: "Zmeňte filtre alebo si rezervujte nový transfer.",
        findTransfers: "Nájsť transfer",
        basicRoom: "Základná",
    },

    "Magyar": {
        email: "E-mail",
        phone: "Telefon",
        bookingPending: "Foglalás függőben",
        pendingMessage: "A foglalása a StayWay megerősítésére vár.",
        transferSearchPlaceholder: "Keresés útvonal, jármű vagy sofőr alapján...",
        clearTransferSearch: "Transzferkeresés törlése",
        filterTransferType: "Szűrés transzfertípus szerint",
        allTransferTypes: "Minden típus",
        filterTransferDate: "Szűrés transzferdátum szerint",
        allDates: "Minden dátum",
        upcoming: "Közelgő",
        past: "Korábbi",
        filterVehicle: "Szűrés jármű szerint",
        allVehicles: "Minden jármű",
        filterPassengers: "Szűrés utasok szerint",
        anyPassengers: "Bármennyi utas",
        sortTransfers: "Transzferek rendezése",
        transfersLower: "transzfer",
        newestFirst: "Legújabb elöl",
        oldestFirst: "Legrégebbi elöl",
        priceHigh: "Ár: csökkenő",
        priceLow: "Ár: növekvő",
        driver: "Sofőr",
        noTransfersFound: "Nem találhatók transzferfoglalások",
        noTransfersHint: "Módosítsa a szűrőket vagy foglaljon új transzfert.",
        findTransfers: "Transzfer keresése",
        basicRoom: "Alap",
    },

    "Български": {
        email: "Имейл",
        phone: "Телефон",
        bookingPending: "Резервацията изчаква",
        pendingMessage: "Вашата резервация очаква потвърждение от StayWay.",
        transferSearchPlaceholder: "Търсене по маршрут, автомобил или шофьор...",
        clearTransferSearch: "Изчисти търсенето на трансфери",
        filterTransferType: "Филтрирай по тип трансфер",
        allTransferTypes: "Всички типове",
        filterTransferDate: "Филтрирай по дата на трансфера",
        allDates: "Всички дати",
        upcoming: "Предстоящи",
        past: "Минали",
        filterVehicle: "Филтрирай по автомобил",
        allVehicles: "Всички автомобили",
        filterPassengers: "Филтрирай по пътници",
        anyPassengers: "Произволен брой пътници",
        sortTransfers: "Сортирай трансферите",
        transfersLower: "трансфера",
        newestFirst: "Най-нови първо",
        oldestFirst: "Най-стари първо",
        priceHigh: "Цена: от висока към ниска",
        priceLow: "Цена: от ниска към висока",
        driver: "Шофьор",
        noTransfersFound: "Не са намерени резервации за трансфер",
        noTransfersHint: "Променете филтрите или резервирайте нов трансфер.",
        findTransfers: "Намери трансфер",
        basicRoom: "Основна",
    },

    "Hrvatski": {
        email: "E-pošta",
        phone: "Telefon",
        bookingPending: "Rezervacija na čekanju",
        pendingMessage: "Vaša rezervacija čeka potvrdu StayWaya.",
        transferSearchPlaceholder: "Pretraži prema ruti, vozilu ili vozaču...",
        clearTransferSearch: "Očisti pretragu transfera",
        filterTransferType: "Filtriraj prema vrsti transfera",
        allTransferTypes: "Sve vrste",
        filterTransferDate: "Filtriraj prema datumu transfera",
        allDates: "Svi datumi",
        upcoming: "Nadolazeći",
        past: "Prošli",
        filterVehicle: "Filtriraj prema vozilu",
        allVehicles: "Sva vozila",
        filterPassengers: "Filtriraj prema putnicima",
        anyPassengers: "Bilo koji broj putnika",
        sortTransfers: "Sortiraj transfere",
        transfersLower: "transfera",
        newestFirst: "Najnoviji prvo",
        oldestFirst: "Najstariji prvo",
        priceHigh: "Cijena: od više prema nižoj",
        priceLow: "Cijena: od niže prema višoj",
        driver: "Vozač",
        noTransfersFound: "Nisu pronađene rezervacije transfera",
        noTransfersHint: "Promijenite filtre ili rezervirajte novi transfer.",
        findTransfers: "Pronađi transfer",
        basicRoom: "Osnovna",
    },

    "Slovenščina": {
        email: "E-pošta",
        phone: "Telefon",
        bookingPending: "Rezervacija čaka",
        pendingMessage: "Vaša rezervacija čaka na potrditev StayWaya.",
        transferSearchPlaceholder: "Išči po poti, vozilu ali vozniku...",
        clearTransferSearch: "Počisti iskanje prevozov",
        filterTransferType: "Filtriraj po vrsti prevoza",
        allTransferTypes: "Vse vrste",
        filterTransferDate: "Filtriraj po datumu prevoza",
        allDates: "Vsi datumi",
        upcoming: "Prihajajoči",
        past: "Pretekli",
        filterVehicle: "Filtriraj po vozilu",
        allVehicles: "Vsa vozila",
        filterPassengers: "Filtriraj po potnikih",
        anyPassengers: "Poljubno število potnikov",
        sortTransfers: "Razvrsti prevoze",
        transfersLower: "prevozov",
        newestFirst: "Najnovejši najprej",
        oldestFirst: "Najstarejši najprej",
        priceHigh: "Cena: od najvišje",
        priceLow: "Cena: od najnižje",
        driver: "Voznik",
        noTransfersFound: "Rezervacij prevozov ni bilo mogoče najti",
        noTransfersHint: "Spremenite filtre ali rezervirajte nov prevoz.",
        findTransfers: "Poišči prevoz",
        basicRoom: "Osnovna",
    },

    "Srpski": {
        email: "E-pošta",
        phone: "Telefon",
        bookingPending: "Rezervacija na čekanju",
        pendingMessage: "Vaša rezervacija čeka potvrdu StayWaya.",
        transferSearchPlaceholder: "Pretraži po ruti, vozilu ili vozaču...",
        clearTransferSearch: "Obriši pretragu transfera",
        filterTransferType: "Filtriraj po vrsti transfera",
        allTransferTypes: "Sve vrste",
        filterTransferDate: "Filtriraj po datumu transfera",
        allDates: "Svi datumi",
        upcoming: "Predstojeći",
        past: "Prošli",
        filterVehicle: "Filtriraj po vozilu",
        allVehicles: "Sva vozila",
        filterPassengers: "Filtriraj po putnicima",
        anyPassengers: "Bilo koji broj putnika",
        sortTransfers: "Sortiraj transfere",
        transfersLower: "transfera",
        newestFirst: "Najnoviji prvo",
        oldestFirst: "Najstariji prvo",
        priceHigh: "Cena: od više ka nižoj",
        priceLow: "Cena: od niže ka višoj",
        driver: "Vozač",
        noTransfersFound: "Nisu pronađene rezervacije transfera",
        noTransfersHint: "Promenite filtere ili rezervišite novi transfer.",
        findTransfers: "Pronađi transfer",
        basicRoom: "Osnovna",
    },

    "Bosanski": {
        email: "E-mail",
        phone: "Telefon",
        bookingPending: "Rezervacija na čekanju",
        pendingMessage: "Vaša rezervacija čeka potvrdu StayWaya.",
        transferSearchPlaceholder: "Pretraži prema ruti, vozilu ili vozaču...",
        clearTransferSearch: "Očisti pretragu transfera",
        filterTransferType: "Filtriraj prema vrsti transfera",
        allTransferTypes: "Sve vrste",
        filterTransferDate: "Filtriraj prema datumu transfera",
        allDates: "Svi datumi",
        upcoming: "Predstojeći",
        past: "Prošli",
        filterVehicle: "Filtriraj prema vozilu",
        allVehicles: "Sva vozila",
        filterPassengers: "Filtriraj prema putnicima",
        anyPassengers: "Bilo koji broj putnika",
        sortTransfers: "Sortiraj transfere",
        transfersLower: "transfera",
        newestFirst: "Najnoviji prvo",
        oldestFirst: "Najstariji prvo",
        priceHigh: "Cijena: od više prema nižoj",
        priceLow: "Cijena: od niže prema višoj",
        driver: "Vozač",
        noTransfersFound: "Nisu pronađene rezervacije transfera",
        noTransfersHint: "Promijenite filtere ili rezervišite novi transfer.",
        findTransfers: "Pronađi transfer",
        basicRoom: "Osnovna",
    },

    "Ελληνικά": {
        email: "Email",
        phone: "Τηλέφωνο",
        bookingPending: "Κράτηση σε αναμονή",
        pendingMessage: "Η κράτησή σας περιμένει επιβεβαίωση από το StayWay.",
        transferSearchPlaceholder: "Αναζήτηση ανά διαδρομή, όχημα ή οδηγό...",
        clearTransferSearch: "Εκκαθάριση αναζήτησης μεταφορών",
        filterTransferType: "Φιλτράρισμα ανά τύπο μεταφοράς",
        allTransferTypes: "Όλοι οι τύποι",
        filterTransferDate: "Φιλτράρισμα ανά ημερομηνία μεταφοράς",
        allDates: "Όλες οι ημερομηνίες",
        upcoming: "Επερχόμενες",
        past: "Προηγούμενες",
        filterVehicle: "Φιλτράρισμα ανά όχημα",
        allVehicles: "Όλα τα οχήματα",
        filterPassengers: "Φιλτράρισμα ανά επιβάτες",
        anyPassengers: "Οποιοσδήποτε αριθμός επιβατών",
        sortTransfers: "Ταξινόμηση μεταφορών",
        transfersLower: "μεταφορές",
        newestFirst: "Νεότερα πρώτα",
        oldestFirst: "Παλαιότερα πρώτα",
        priceHigh: "Τιμή: φθίνουσα",
        priceLow: "Τιμή: αύξουσα",
        driver: "Οδηγός",
        noTransfersFound: "Δεν βρέθηκαν κρατήσεις μεταφοράς",
        noTransfersHint: "Αλλάξτε τα φίλτρα ή κλείστε νέα μεταφορά.",
        findTransfers: "Βρείτε μεταφορά",
        basicRoom: "Βασικό",
    },

    "Türkçe": {
        email: "E-posta",
        phone: "Telefon",
        bookingPending: "Rezervasyon beklemede",
        pendingMessage: "Rezervasyonunuz StayWay onayını bekliyor.",
        transferSearchPlaceholder: "Rota, araç veya sürücüye göre ara...",
        clearTransferSearch: "Transfer aramasını temizle",
        filterTransferType: "Transfer türüne göre filtrele",
        allTransferTypes: "Tüm türler",
        filterTransferDate: "Transfer tarihine göre filtrele",
        allDates: "Tüm tarihler",
        upcoming: "Yaklaşan",
        past: "Geçmiş",
        filterVehicle: "Araca göre filtrele",
        allVehicles: "Tüm araçlar",
        filterPassengers: "Yolcuya göre filtrele",
        anyPassengers: "Herhangi bir yolcu sayısı",
        sortTransfers: "Transferleri sırala",
        transfersLower: "transfer",
        newestFirst: "En yeni önce",
        oldestFirst: "En eski önce",
        priceHigh: "Fiyat: yüksekten düşüğe",
        priceLow: "Fiyat: düşükten yükseğe",
        driver: "Sürücü",
        noTransfersFound: "Transfer rezervasyonu bulunamadı",
        noTransfersHint: "Filtreleri değiştirin veya yeni bir transfer rezervasyonu yapın.",
        findTransfers: "Transfer bul",
        basicRoom: "Temel",
    },

    "العربية": {
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        bookingPending: "الحجز قيد الانتظار",
        pendingMessage: "حجزك ينتظر تأكيد StayWay.",
        transferSearchPlaceholder: "البحث حسب المسار أو المركبة أو السائق...",
        clearTransferSearch: "مسح بحث النقل",
        filterTransferType: "التصفية حسب نوع النقل",
        allTransferTypes: "جميع الأنواع",
        filterTransferDate: "التصفية حسب تاريخ النقل",
        allDates: "جميع التواريخ",
        upcoming: "القادمة",
        past: "السابقة",
        filterVehicle: "التصفية حسب المركبة",
        allVehicles: "جميع المركبات",
        filterPassengers: "التصفية حسب الركاب",
        anyPassengers: "أي عدد من الركاب",
        sortTransfers: "ترتيب خدمات النقل",
        transfersLower: "خدمات نقل",
        newestFirst: "الأحدث أولاً",
        oldestFirst: "الأقدم أولاً",
        priceHigh: "السعر: من الأعلى إلى الأقل",
        priceLow: "السعر: من الأقل إلى الأعلى",
        driver: "السائق",
        noTransfersFound: "لم يتم العثور على حجوزات نقل",
        noTransfersHint: "غيّر عوامل التصفية أو احجز خدمة نقل جديدة.",
        findTransfers: "البحث عن نقل",
        basicRoom: "أساسية",
    },

    "עברית": {
        email: "אימייל",
        phone: "טלפון",
        bookingPending: "ההזמנה ממתינה",
        pendingMessage: "ההזמנה שלך ממתינה לאישור של StayWay.",
        transferSearchPlaceholder: "חיפוש לפי מסלול, רכב או נהג...",
        clearTransferSearch: "נקה חיפוש הסעות",
        filterTransferType: "סינון לפי סוג הסעה",
        allTransferTypes: "כל הסוגים",
        filterTransferDate: "סינון לפי תאריך הסעה",
        allDates: "כל התאריכים",
        upcoming: "עתידיות",
        past: "קודמות",
        filterVehicle: "סינון לפי רכב",
        allVehicles: "כל הרכבים",
        filterPassengers: "סינון לפי נוסעים",
        anyPassengers: "כל מספר נוסעים",
        sortTransfers: "מיון הסעות",
        transfersLower: "הסעות",
        newestFirst: "החדשות ביותר תחילה",
        oldestFirst: "הישנות ביותר תחילה",
        priceHigh: "מחיר: מהגבוה לנמוך",
        priceLow: "מחיר: מהנמוך לגבוה",
        driver: "נהג",
        noTransfersFound: "לא נמצאו הזמנות הסעה",
        noTransfersHint: "שנה את המסננים או הזמן הסעה חדשה.",
        findTransfers: "מצא הסעה",
        basicRoom: "בסיסי",
    },

    "हिन्दी": {
        email: "ईमेल",
        phone: "फ़ोन",
        bookingPending: "बुकिंग लंबित है",
        pendingMessage: "आपकी बुकिंग StayWay की पुष्टि की प्रतीक्षा कर रही है।",
        transferSearchPlaceholder: "रूट, वाहन या ड्राइवर से खोजें...",
        clearTransferSearch: "ट्रांसफर खोज साफ़ करें",
        filterTransferType: "ट्रांसफर प्रकार से फ़िल्टर करें",
        allTransferTypes: "सभी प्रकार",
        filterTransferDate: "ट्रांसफर तारीख से फ़िल्टर करें",
        allDates: "सभी तारीखें",
        upcoming: "आगामी",
        past: "पिछली",
        filterVehicle: "वाहन से फ़िल्टर करें",
        allVehicles: "सभी वाहन",
        filterPassengers: "यात्रियों से फ़िल्टर करें",
        anyPassengers: "यात्रियों की कोई भी संख्या",
        sortTransfers: "ट्रांसफर क्रमबद्ध करें",
        transfersLower: "ट्रांसफर",
        newestFirst: "नए पहले",
        oldestFirst: "पुराने पहले",
        priceHigh: "कीमत: अधिक से कम",
        priceLow: "कीमत: कम से अधिक",
        driver: "ड्राइवर",
        noTransfersFound: "कोई ट्रांसफर बुकिंग नहीं मिली",
        noTransfersHint: "फ़िल्टर बदलें या नया ट्रांसफर बुक करें।",
        findTransfers: "ट्रांसफर खोजें",
        basicRoom: "बेसिक",
    },

    "ไทย": {
        email: "อีเมล",
        phone: "โทรศัพท์",
        bookingPending: "การจองกำลังรอการยืนยัน",
        pendingMessage: "การจองของคุณกำลังรอการยืนยันจาก StayWay",
        transferSearchPlaceholder: "ค้นหาตามเส้นทาง รถ หรือคนขับ...",
        clearTransferSearch: "ล้างการค้นหาบริการรับส่ง",
        filterTransferType: "กรองตามประเภทบริการรับส่ง",
        allTransferTypes: "ทุกประเภท",
        filterTransferDate: "กรองตามวันที่บริการรับส่ง",
        allDates: "ทุกวันที่",
        upcoming: "กำลังจะมาถึง",
        past: "ที่ผ่านมา",
        filterVehicle: "กรองตามรถ",
        allVehicles: "รถทั้งหมด",
        filterPassengers: "กรองตามผู้โดยสาร",
        anyPassengers: "จำนวนผู้โดยสารใดก็ได้",
        sortTransfers: "เรียงบริการรับส่ง",
        transfersLower: "บริการรับส่ง",
        newestFirst: "ใหม่ล่าสุดก่อน",
        oldestFirst: "เก่าที่สุดก่อน",
        priceHigh: "ราคา: สูงไปต่ำ",
        priceLow: "ราคา: ต่ำไปสูง",
        driver: "คนขับ",
        noTransfersFound: "ไม่พบการจองบริการรับส่ง",
        noTransfersHint: "เปลี่ยนตัวกรองหรือจองบริการรับส่งใหม่",
        findTransfers: "ค้นหาบริการรับส่ง",
        basicRoom: "พื้นฐาน",
    },

    "Bahasa Indonesia": {
        email: "Email",
        phone: "Telepon",
        bookingPending: "Pemesanan menunggu",
        pendingMessage: "Pemesanan Anda menunggu konfirmasi dari StayWay.",
        transferSearchPlaceholder: "Cari berdasarkan rute, kendaraan, atau pengemudi...",
        clearTransferSearch: "Hapus pencarian transfer",
        filterTransferType: "Filter berdasarkan jenis transfer",
        allTransferTypes: "Semua jenis",
        filterTransferDate: "Filter berdasarkan tanggal transfer",
        allDates: "Semua tanggal",
        upcoming: "Mendatang",
        past: "Lampau",
        filterVehicle: "Filter berdasarkan kendaraan",
        allVehicles: "Semua kendaraan",
        filterPassengers: "Filter berdasarkan penumpang",
        anyPassengers: "Jumlah penumpang apa pun",
        sortTransfers: "Urutkan transfer",
        transfersLower: "transfer",
        newestFirst: "Terbaru dahulu",
        oldestFirst: "Terlama dahulu",
        priceHigh: "Harga: tinggi ke rendah",
        priceLow: "Harga: rendah ke tinggi",
        driver: "Pengemudi",
        noTransfersFound: "Pemesanan transfer tidak ditemukan",
        noTransfersHint: "Ubah filter atau pesan transfer baru.",
        findTransfers: "Cari transfer",
        basicRoom: "Dasar",
    },

    "Tiếng Việt": {
        email: "Email",
        phone: "Điện thoại",
        bookingPending: "Đặt chỗ đang chờ",
        pendingMessage: "Đặt chỗ của bạn đang chờ StayWay xác nhận.",
        transferSearchPlaceholder: "Tìm theo tuyến đường, xe hoặc tài xế...",
        clearTransferSearch: "Xóa tìm kiếm đưa đón",
        filterTransferType: "Lọc theo loại đưa đón",
        allTransferTypes: "Tất cả loại",
        filterTransferDate: "Lọc theo ngày đưa đón",
        allDates: "Tất cả ngày",
        upcoming: "Sắp tới",
        past: "Đã qua",
        filterVehicle: "Lọc theo xe",
        allVehicles: "Tất cả xe",
        filterPassengers: "Lọc theo hành khách",
        anyPassengers: "Bất kỳ số hành khách",
        sortTransfers: "Sắp xếp đưa đón",
        transfersLower: "lượt đưa đón",
        newestFirst: "Mới nhất trước",
        oldestFirst: "Cũ nhất trước",
        priceHigh: "Giá: cao xuống thấp",
        priceLow: "Giá: thấp lên cao",
        driver: "Tài xế",
        noTransfersFound: "Không tìm thấy đặt chỗ đưa đón",
        noTransfersHint: "Thay đổi bộ lọc hoặc đặt chuyến đưa đón mới.",
        findTransfers: "Tìm chuyến đưa đón",
        basicRoom: "Cơ bản",
    },

    "한국어": {
        email: "이메일",
        phone: "전화",
        bookingPending: "예약 대기 중",
        pendingMessage: "예약이 StayWay의 확인을 기다리고 있습니다.",
        transferSearchPlaceholder: "경로, 차량 또는 기사로 검색...",
        clearTransferSearch: "이동 서비스 검색 지우기",
        filterTransferType: "이동 유형별 필터",
        allTransferTypes: "모든 유형",
        filterTransferDate: "이동 날짜별 필터",
        allDates: "모든 날짜",
        upcoming: "예정",
        past: "지난 일정",
        filterVehicle: "차량별 필터",
        allVehicles: "모든 차량",
        filterPassengers: "승객 수별 필터",
        anyPassengers: "모든 승객 수",
        sortTransfers: "이동 서비스 정렬",
        transfersLower: "이동 서비스",
        newestFirst: "최신순",
        oldestFirst: "오래된순",
        priceHigh: "가격: 높은순",
        priceLow: "가격: 낮은순",
        driver: "기사",
        noTransfersFound: "이동 서비스 예약을 찾을 수 없습니다",
        noTransfersHint: "필터를 변경하거나 새 이동 서비스를 예약하세요.",
        findTransfers: "이동 서비스 찾기",
        basicRoom: "기본",
    },

    "日本語": {
        email: "メール",
        phone: "電話",
        bookingPending: "予約保留中",
        pendingMessage: "予約はStayWayの確認を待っています。",
        transferSearchPlaceholder: "ルート、車両、ドライバーで検索...",
        clearTransferSearch: "送迎検索をクリア",
        filterTransferType: "送迎タイプで絞り込む",
        allTransferTypes: "すべてのタイプ",
        filterTransferDate: "送迎日で絞り込む",
        allDates: "すべての日付",
        upcoming: "今後",
        past: "過去",
        filterVehicle: "車両で絞り込む",
        allVehicles: "すべての車両",
        filterPassengers: "乗客数で絞り込む",
        anyPassengers: "任意の乗客数",
        sortTransfers: "送迎を並べ替え",
        transfersLower: "件の送迎",
        newestFirst: "新しい順",
        oldestFirst: "古い順",
        priceHigh: "価格：高い順",
        priceLow: "価格：安い順",
        driver: "ドライバー",
        noTransfersFound: "送迎予約が見つかりません",
        noTransfersHint: "フィルターを変更するか、新しい送迎を予約してください。",
        findTransfers: "送迎を探す",
        basicRoom: "ベーシック",
    },

    "中文": {
        email: "电子邮箱",
        phone: "电话",
        bookingPending: "预订待确认",
        pendingMessage: "您的预订正在等待 StayWay 确认。",
        transferSearchPlaceholder: "按路线、车辆或司机搜索...",
        clearTransferSearch: "清除接送搜索",
        filterTransferType: "按接送类型筛选",
        allTransferTypes: "所有类型",
        filterTransferDate: "按接送日期筛选",
        allDates: "所有日期",
        upcoming: "即将到来",
        past: "已过去",
        filterVehicle: "按车辆筛选",
        allVehicles: "所有车辆",
        filterPassengers: "按乘客筛选",
        anyPassengers: "任意乘客人数",
        sortTransfers: "接送排序",
        transfersLower: "个接送",
        newestFirst: "最新优先",
        oldestFirst: "最早优先",
        priceHigh: "价格：从高到低",
        priceLow: "价格：从低到高",
        driver: "司机",
        noTransfersFound: "未找到接送预订",
        noTransfersHint: "请更改筛选条件或预订新的接送服务。",
        findTransfers: "查找接送",
        basicRoom: "基础",
    },

    "繁體中文": {
        email: "電子郵件",
        phone: "電話",
        bookingPending: "預訂待確認",
        pendingMessage: "您的預訂正在等待 StayWay 確認。",
        transferSearchPlaceholder: "依路線、車輛或司機搜尋...",
        clearTransferSearch: "清除接送搜尋",
        filterTransferType: "依接送類型篩選",
        allTransferTypes: "所有類型",
        filterTransferDate: "依接送日期篩選",
        allDates: "所有日期",
        upcoming: "即將到來",
        past: "已過去",
        filterVehicle: "依車輛篩選",
        allVehicles: "所有車輛",
        filterPassengers: "依乘客篩選",
        anyPassengers: "任意乘客人數",
        sortTransfers: "接送排序",
        transfersLower: "筆接送",
        newestFirst: "最新優先",
        oldestFirst: "最早優先",
        priceHigh: "價格：由高到低",
        priceLow: "價格：由低到高",
        driver: "司機",
        noTransfersFound: "找不到接送預訂",
        noTransfersHint: "請更改篩選條件或預訂新的接送服務。",
        findTransfers: "尋找接送",
        basicRoom: "基本",
    },

    "Català": {
        email: "Correu electrònic",
        phone: "Telèfon",
        bookingPending: "Reserva pendent",
        pendingMessage: "La teva reserva espera la confirmació de StayWay.",
        transferSearchPlaceholder: "Cerca per ruta, vehicle o conductor...",
        clearTransferSearch: "Neteja la cerca de trasllats",
        filterTransferType: "Filtra per tipus de trasllat",
        allTransferTypes: "Tots els tipus",
        filterTransferDate: "Filtra per data del trasllat",
        allDates: "Totes les dates",
        upcoming: "Propers",
        past: "Passats",
        filterVehicle: "Filtra per vehicle",
        allVehicles: "Tots els vehicles",
        filterPassengers: "Filtra per passatgers",
        anyPassengers: "Qualsevol nombre de passatgers",
        sortTransfers: "Ordena els trasllats",
        transfersLower: "trasllats",
        newestFirst: "Més recents primer",
        oldestFirst: "Més antics primer",
        priceHigh: "Preu: de més alt a més baix",
        priceLow: "Preu: de més baix a més alt",
        driver: "Conductor",
        noTransfersFound: "No s'han trobat reserves de trasllat",
        noTransfersHint: "Canvia els filtres o reserva un nou trasllat.",
        findTransfers: "Troba un trasllat",
        basicRoom: "Bàsica",
    },

    "Eesti": {
        email: "E-post",
        phone: "Telefon",
        bookingPending: "Broneering ootel",
        pendingMessage: "Teie broneering ootab StayWay kinnitust.",
        transferSearchPlaceholder: "Otsi marsruudi, sõiduki või juhi järgi...",
        clearTransferSearch: "Tühjenda transfeeriotsing",
        filterTransferType: "Filtreeri transfeeri tüübi järgi",
        allTransferTypes: "Kõik tüübid",
        filterTransferDate: "Filtreeri transfeeri kuupäeva järgi",
        allDates: "Kõik kuupäevad",
        upcoming: "Tulevased",
        past: "Möödunud",
        filterVehicle: "Filtreeri sõiduki järgi",
        allVehicles: "Kõik sõidukid",
        filterPassengers: "Filtreeri reisijate järgi",
        anyPassengers: "Mis tahes reisijate arv",
        sortTransfers: "Sorteeri transfeere",
        transfersLower: "transfeeri",
        newestFirst: "Uusimad enne",
        oldestFirst: "Vanimad enne",
        priceHigh: "Hind: kõrgemast madalamani",
        priceLow: "Hind: madalamast kõrgemani",
        driver: "Juht",
        noTransfersFound: "Transfeeribroneeringuid ei leitud",
        noTransfersHint: "Muutke filtreid või broneerige uus transfeer.",
        findTransfers: "Leia transfeer",
        basicRoom: "Põhituba",
    },

    "Latviešu": {
        email: "E-pasts",
        phone: "Tālrunis",
        bookingPending: "Rezervācija gaida",
        pendingMessage: "Jūsu rezervācija gaida StayWay apstiprinājumu.",
        transferSearchPlaceholder: "Meklēt pēc maršruta, transportlīdzekļa vai vadītāja...",
        clearTransferSearch: "Notīrīt transfēru meklēšanu",
        filterTransferType: "Filtrēt pēc transfēra veida",
        allTransferTypes: "Visi veidi",
        filterTransferDate: "Filtrēt pēc transfēra datuma",
        allDates: "Visi datumi",
        upcoming: "Gaidāmie",
        past: "Pagājušie",
        filterVehicle: "Filtrēt pēc transportlīdzekļa",
        allVehicles: "Visi transportlīdzekļi",
        filterPassengers: "Filtrēt pēc pasažieriem",
        anyPassengers: "Jebkurš pasažieru skaits",
        sortTransfers: "Kārtot transfērus",
        transfersLower: "transfēri",
        newestFirst: "Jaunākie vispirms",
        oldestFirst: "Vecākie vispirms",
        priceHigh: "Cena: no augstākās uz zemāko",
        priceLow: "Cena: no zemākās uz augstāko",
        driver: "Vadītājs",
        noTransfersFound: "Transfēru rezervācijas nav atrastas",
        noTransfersHint: "Mainiet filtrus vai rezervējiet jaunu transfēru.",
        findTransfers: "Atrast transfēru",
        basicRoom: "Pamata",
    },

    "Lietuvių": {
        email: "El. paštas",
        phone: "Telefonas",
        bookingPending: "Užsakymas laukia",
        pendingMessage: "Jūsų užsakymas laukia StayWay patvirtinimo.",
        transferSearchPlaceholder: "Ieškoti pagal maršrutą, transporto priemonę ar vairuotoją...",
        clearTransferSearch: "Išvalyti pervežimų paiešką",
        filterTransferType: "Filtruoti pagal pervežimo tipą",
        allTransferTypes: "Visi tipai",
        filterTransferDate: "Filtruoti pagal pervežimo datą",
        allDates: "Visos datos",
        upcoming: "Būsimi",
        past: "Praėję",
        filterVehicle: "Filtruoti pagal transporto priemonę",
        allVehicles: "Visos transporto priemonės",
        filterPassengers: "Filtruoti pagal keleivius",
        anyPassengers: "Bet koks keleivių skaičius",
        sortTransfers: "Rikiuoti pervežimus",
        transfersLower: "pervežimų",
        newestFirst: "Naujausi pirmiausia",
        oldestFirst: "Seniausi pirmiausia",
        priceHigh: "Kaina: nuo didžiausios",
        priceLow: "Kaina: nuo mažiausios",
        driver: "Vairuotojas",
        noTransfersFound: "Pervežimų užsakymų nerasta",
        noTransfersHint: "Pakeiskite filtrus arba užsisakykite naują pervežimą.",
        findTransfers: "Rasti pervežimą",
        basicRoom: "Pagrindinis",
    },
};

function getBookingPageText(language: string, key: string): string {
    const languageName = language.split("|")[0];

    return (
        bookingPageExtraTranslations[languageName]?.[key] ??
        bookingPageTranslations[languageName]?.[key] ??
        bookingPageExtraTranslations.English[key] ??
        bookingPageTranslations.English[key] ??
        key
    );
}

const bookingSupportedLanguages = Object.keys(
    bookingPageTranslations
);

function getLocalizedTransferBookingTitle(
    title: string,
    language: string
): string {
    const transferTitleKeys = [
        "privateTransfer",
        "comfortTransfer",
        "familyTransfer",
    ] as const;

    const normalizedTitle =
        title.trim().toLocaleLowerCase();

    for (const supportedLanguage of bookingSupportedLanguages) {
        for (const key of transferTitleKeys) {
            const translatedTitle =
                getTranslation(
                    supportedLanguage,
                    key
                );

            if (
                translatedTitle
                    .trim()
                    .toLocaleLowerCase() ===
                normalizedTitle
            ) {
                return getTranslation(
                    language,
                    key
                );
            }
        }
    }

    return title;
}

function getLocalizedBookingRoomName(
    roomName: string | undefined,
    language: string
): string {
    if (!roomName) {
        return getBookingPageText(
            language,
            "roomNotSpecified"
        );
    }

    if (
        roomName
            .trim()
            .toLocaleLowerCase() ===
        "basic"
    ) {
        return getBookingPageText(
            language,
            "basicRoom"
        );
    }

    return roomName;
}

function formatDate(date: string) {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
}

function formatTransferDate(date: string) {
    if (!date || date === "—") {
        return "—";
    }

    return formatDate(date);
}

function BookingsContent() {
    const { language, currency } = useSettings();
    const { currentUser } = useUser();

    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [transferBookings, setTransferBookings] =
        useState<TransferBooking[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeBookingTab, setActiveBookingTab] =
        useState<"stays" | "transfers">("stays");

    /*
     * Property and room data come only from the backend.
     */
    const [allProperties, setAllProperties] =
        useState<Property[]>([]);

    const [allRooms, setAllRooms] =
        useState<Room[]>([]);

    const [
        allTransferVehicles,
        setAllTransferVehicles,
    ] = useState<TransferVehicle[]>([]);

    const [
        allTransferDrivers,
        setAllTransferDrivers,
    ] = useState<TransferDriver[]>([]);

    const [search, setSearch] = useState("");
    const [userFilter, setUserFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    const [transferSearch, setTransferSearch] = useState("");
    const [transferTypeFilter, setTransferTypeFilter] =
        useState<"all" | "one-way" | "return">("all");
    const [transferDateFilter, setTransferDateFilter] =
        useState<"all" | "upcoming" | "past">("all");
    const [transferVehicleFilter, setTransferVehicleFilter] =
        useState("all");
    const [transferPassengersFilter, setTransferPassengersFilter] =
        useState<"all" | "1-3" | "4-5" | "6+">("all");
    const [transferSortBy, setTransferSortBy] =
        useState<"newest" | "oldest" | "priceHigh" | "priceLow">("newest");

    const selectedCurrency =
        currencyInfo[currency] ?? currencyInfo["Euro"];

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        let isActive = true;

        const loadPageData = async () => {
            setIsLoaded(false);

            /*
             * Property and room information is loaded from
             * the ASP.NET Core backend.
             */
            try {
                const loadedProperties =
                    await getPropertiesFromApi();

                if (isActive) {
                    setAllProperties(
                        loadedProperties
                    );
                }
            } catch (error) {
                console.error(
                    "Could not load properties from the backend.",
                    error
                );

                if (isActive) {
                    setAllProperties([]);
                }
            }

            try {
                const loadedRooms =
                    await getRoomsFromApi();

                if (isActive) {
                    setAllRooms(
                        loadedRooms
                    );
                }
            } catch (error) {
                console.error(
                    "Could not load rooms from the backend.",
                    error
                );

                if (isActive) {
                    setAllRooms([]);
                }
            }

            try {
                const loadedVehicles =
                    await getTransferVehiclesFromApi();

                if (isActive) {
                    setAllTransferVehicles(
                        loadedVehicles
                    );
                }
            } catch (error) {
                console.error(
                    "Could not load transfer vehicles from the backend.",
                    error
                );

                if (isActive) {
                    setAllTransferVehicles([]);
                }
            }

            try {
                const loadedDrivers =
                    await getTransferDriversFromApi();

                if (isActive) {
                    setAllTransferDrivers(
                        loadedDrivers
                    );
                }
            } catch (error) {
                console.error(
                    "Could not load transfer drivers from the backend.",
                    error
                );

                if (isActive) {
                    setAllTransferDrivers([]);
                }
            }

            try {
                const visibleBookings =
                    currentUser.role === "admin"
                        ? await getBookingsFromApi()
                        : await getBookingsByUserIdFromApi(
                            currentUser.id
                        );

                if (isActive) {
                    setUserBookings(visibleBookings);
                }
            } catch (error) {
                console.error(
                    "Could not load stay bookings from the backend.",
                    error
                );

                if (isActive) {
                    setUserBookings([]);
                }
            }

            try {
                const allTransferBookings =
                    await getTransferBookingsFromApi();

                const visibleTransferBookings =
                    currentUser.role === "admin"
                        ? allTransferBookings
                        : allTransferBookings.filter(
                            (booking) =>
                                booking.email === currentUser.email
                        );

                if (isActive) {
                    setTransferBookings(
                        visibleTransferBookings
                    );
                }
            } catch (error) {
                console.error(
                    "Could not load transfer bookings from the backend.",
                    error
                );

                if (isActive) {
                    setTransferBookings([]);
                }
            }

            if (isActive) {
                setIsLoaded(true);
            }
        };

        void loadPageData();

        return () => {
            isActive = false;
        };
    }, [currentUser]);

    const formatPrice = (price: number) => {
        const convertedPrice =
            price * selectedCurrency.rate;

        return `${selectedCurrency.symbol}${Math.round(
            convertedPrice
        ).toLocaleString()}`;
    };

    const getStatusText = (status: string) => {
        if (status === "confirmed") {
            return (
                getTranslation(
                    language,
                    "confirmed"
                ) || "confirmed"
            );
        }

        if (status === "cancelled") {
            return (
                getTranslation(
                    language,
                    "cancelled"
                ) || "cancelled"
            );
        }

        if (status === "pending") {
            return (
                getBookingPageText(
                    language,
                    "pending"
                ) || "pending"
            );
        }

        return status;
    };

    const getGuestText = (booking: Booking) => {
        if (
            booking.adults !== undefined ||
            booking.children !== undefined ||
            booking.infants !== undefined
        ) {
            const adults =
                booking.adults ?? 0;

            const children =
                booking.children ?? 0;

            const infants =
                booking.infants ?? 0;

            return `${adults} ${
                adults === 1
                    ? getBookingPageText(language, "adult")
                    : getBookingPageText(language, "adults")
            } · ${children} ${
                children === 1
                    ? getBookingPageText(language, "child")
                    : getBookingPageText(language, "children")
            } · ${infants} ${
                infants === 1
                    ? getBookingPageText(language, "infant")
                    : getBookingPageText(language, "infants")
            }`;
        }

        return `${booking.guests} ${
            booking.guests === 1
                ? getBookingPageText(language, "guest")
                : getBookingPageText(language, "guestsWord")
        }`;
    };

    const bookingUserOptions = useMemo(() => {
        const uniqueUsers = new Map<
            string,
            {
                userId: string;
                name: string;
                email: string;
            }
        >();

        userBookings.forEach((booking) => {
            const name =
                booking.firstName ||
                booking.lastName
                    ? `${booking.firstName ?? ""} ${booking.lastName ?? ""}`.trim()
                    : getBookingPageText(
                        language,
                        "unknownUser"
                    );

            const email =
                booking.email ?? "";

            const key = String(booking.userId);

            if (!uniqueUsers.has(key)) {
                uniqueUsers.set(key, {
                    userId: booking.userId,
                    name,
                    email,
                });
            }
        });

        return Array.from(
            uniqueUsers.values()
        );
    }, [userBookings, language]);


    const filteredBookings = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        const result = userBookings.filter(
            (booking) => {
                /*
                 * Use dynamic properties instead
                 * of static mock properties.
                 */
                const property =
                    allProperties.find(
                        (item) =>
                            item.id ===
                            booking.propertyId
                    );

                /*
                 * Use dynamic rooms instead
                 * of static mock rooms.
                 */
                const room =
                    allRooms.find(
                        (item) =>
                            item.id ===
                            booking.roomId &&
                            item.propertyId ===
                            booking.propertyId
                    );

                const matchesUser =
                    userFilter === "All" ||
                    String(booking.userId) ===
                    userFilter;

                const searchableText = [
                    property?.name ?? "",
                    room?.name ?? "",
                    booking.firstName ?? "",
                    booking.lastName ?? "",
                    booking.email ?? "",
                    booking.phone ?? "",
                    booking.status,
                    booking.checkIn,
                    booking.checkOut,
                    formatDate(
                        booking.checkIn
                    ),
                    formatDate(
                        booking.checkOut
                    ),
                    String(
                        booking.totalPrice
                    ),
                ]
                    .join(" ")
                    .toLowerCase();

                const matchesSearch =
                    query === "" ||
                    searchableText.includes(
                        query
                    );

                const matchesStatus =
                    statusFilter === "All" ||
                    booking.status ===
                    statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesUser
                );
            }
        );

        return [...result].sort(
            (a, b) => {
                if (
                    sortBy === "oldest"
                ) {
                    return (
                        new Date(
                            a.checkIn
                        ).getTime() -
                        new Date(
                            b.checkIn
                        ).getTime()
                    );
                }

                if (
                    sortBy === "totalHigh"
                ) {
                    return (
                        b.totalPrice -
                        a.totalPrice
                    );
                }

                if (
                    sortBy === "totalLow"
                ) {
                    return (
                        a.totalPrice -
                        b.totalPrice
                    );
                }

                return (
                    new Date(
                        b.checkIn
                    ).getTime() -
                    new Date(
                        a.checkIn
                    ).getTime()
                );
            }
        );
    }, [
        userBookings,
        allProperties,
        allRooms,
        search,
        userFilter,
        statusFilter,
        sortBy,
    ]);

    const filteredTransferBookings = useMemo(() => {
        const query = transferSearch.trim().toLowerCase();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = transferBookings.filter((booking) => {
            const transferVehicle = booking.vehicleId
                ? allTransferVehicles.find(
                    (vehicle) =>
                        vehicle.id ===
                        booking.vehicleId
                )
                : undefined;

            const vehicleName =
                booking.vehicleName ||
                transferVehicle?.name ||
                "";

            const licensePlate =
                booking.licensePlate ||
                transferVehicle?.licensePlate ||
                "";

            const searchableText = [
                booking.id,
                booking.firstName,
                booking.lastName,
                booking.email,
                booking.phone,
                booking.optionTitle,
                vehicleName,
                licensePlate,
                booking.driverName,
                booking.pickup,
                booking.destination,
                booking.date,
                booking.time,
                booking.returnDate,
                booking.returnTime,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                query === "" ||
                searchableText.includes(query);

            const matchesType =
                transferTypeFilter === "all" ||
                booking.transferType === transferTypeFilter;

            const bookingDate = new Date(
                `${booking.date}T00:00:00`
            );
            bookingDate.setHours(0, 0, 0, 0);

            const matchesDate =
                transferDateFilter === "all" ||
                (transferDateFilter === "upcoming" &&
                    !Number.isNaN(bookingDate.getTime()) &&
                    bookingDate >= today) ||
                (transferDateFilter === "past" &&
                    !Number.isNaN(bookingDate.getTime()) &&
                    bookingDate < today);

            const matchesVehicle =
                transferVehicleFilter === "all" ||
                vehicleName === transferVehicleFilter;

            const passengers = Number(booking.passengers);

            const matchesPassengers =
                transferPassengersFilter === "all" ||
                (transferPassengersFilter === "1-3" &&
                    passengers >= 1 &&
                    passengers <= 3) ||
                (transferPassengersFilter === "4-5" &&
                    passengers >= 4 &&
                    passengers <= 5) ||
                (transferPassengersFilter === "6+" &&
                    passengers >= 6);

            return (
                matchesSearch &&
                matchesType &&
                matchesDate &&
                matchesVehicle &&
                matchesPassengers
            );
        });

        return [...filtered].sort((a, b) => {
            if (transferSortBy === "oldest") {
                return (
                    new Date(a.date).getTime() -
                    new Date(b.date).getTime()
                );
            }

            if (transferSortBy === "priceHigh") {
                return b.price - a.price;
            }

            if (transferSortBy === "priceLow") {
                return a.price - b.price;
            }

            return (
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
            );
        });
    }, [
        transferBookings,
        allTransferVehicles,
        transferSearch,
        transferTypeFilter,
        transferDateFilter,
        transferVehicleFilter,
        transferPassengersFilter,
        transferSortBy,
    ]);

    const transferVehicleOptions = useMemo(() => {
        return Array.from(
            new Set(
                transferBookings
                    .map((booking) => {
                        const transferVehicle = booking.vehicleId
                            ? allTransferVehicles.find(
                                (vehicle) =>
                                    vehicle.id ===
                                    booking.vehicleId
                            )
                            : undefined;

                        return (
                            booking.vehicleName ||
                            transferVehicle?.name ||
                            ""
                        );
                    })
                    .filter(Boolean)
            )
        ).sort((a, b) => a.localeCompare(b));
    }, [
        transferBookings,
        allTransferVehicles,
    ]);

    const clearTransferFilters = () => {
        setTransferSearch("");
        setTransferTypeFilter("all");
        setTransferDateFilter("all");
        setTransferVehicleFilter("all");
        setTransferPassengersFilter("all");
        setTransferSortBy("newest");
    };

    const clearFilters = () => {
        setSearch("");
        setUserFilter("All");
        setStatusFilter("All");
        setSortBy("newest");
    };

    const clearSearch = () => {
        setSearch("");
    };

    const hasActiveFilters =
        search.trim() !== "" ||
        userFilter !== "All" ||
        statusFilter !== "All" ||
        sortBy !== "newest";

    const handleCancelBooking = async (
        bookingId: number
    ) => {
        const confirmed =
            window.confirm(
                getTranslation(
                    language,
                    "cancelQuestion"
                )
            );

        if (!confirmed) {
            return;
        }

        const booking = userBookings.find(
            (item) => item.id === bookingId
        );

        if (!booking) {
            return;
        }

        try {
            const updatedBooking =
                await updateBookingInApi(
                    bookingId,
                    {
                        userId: booking.userId,
                        propertyId: booking.propertyId,
                        roomId: booking.roomId,
                        checkIn: booking.checkIn,
                        checkOut: booking.checkOut,
                        adults: booking.adults,
                        children: booking.children,
                        infants: booking.infants,
                        guests: booking.guests,
                        totalPrice: booking.totalPrice,
                        status: "cancelled",
                        firstName: booking.firstName,
                        lastName: booking.lastName,
                        email: booking.email,
                        phone: booking.phone,
                        specialRequests: booking.specialRequests,
                    }
                );

            setUserBookings(
                (currentBookings) =>
                    currentBookings.map(
                        (item) =>
                            item.id === bookingId
                                ? updatedBooking
                                : item
                    )
            );
        } catch (error) {
            console.error(
                "Could not cancel the booking through the backend.",
                error
            );
        }
    };

    const handleCancelTransferBooking = async (
        bookingId: string
    ) => {
        const confirmed =
            window.confirm(
                getTranslation(
                    language,
                    "cancelQuestion"
                )
            );

        if (!confirmed) {
            return;
        }

        const booking =
            transferBookings.find(
                (item) => item.id === bookingId
            );

        if (!booking) {
            return;
        }

        try {
            const updatedBooking =
                await updateTransferBookingInApi(
                    bookingId,
                    {
                        ...booking,
                        status: "cancelled",
                    }
                );

            setTransferBookings(
                (currentBookings) =>
                    currentBookings.map(
                        (item) =>
                            item.id === bookingId
                                ? updatedBooking
                                : item
                    )
            );

            window.dispatchEvent(
                new Event(
                    "stayway_transfers_changed"
                )
            );
        } catch (error) {
            console.error(
                "Could not cancel the transfer booking through the backend.",
                error
            );

            window.alert(
                "Could not cancel the transfer booking. Please try again."
            );
        }
    };

    if (!isLoaded) {
        return (
            <main className="bookings-loading-page">
                <section className="section">
                    <div className="container bookings-page">
                        <p>
                            {getTranslation(
                                language,
                                "loading"
                            )}
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="bookings-root">
            <style jsx global>{`
    .bookings-page {

    width: 100%;
    min-width: 0;
}

.bookings-tabs {
    max-width: 100%;
}

.bookings-tab {
    flex: 0 1 auto;
}

.bookings-filters > * {
    min-width: 0;
}

.bookings-clear-button {
    justify-self: stretch;
}

.booking-card,
.bookings-transfer-card {
    min-width: 0;
    box-sizing: border-box;
}

.booking-content,
.bookings-transfer-card {
    overflow-wrap: anywhere;
}

.booking-status.status-pending {
    background: #fff6df !important;
    color: #b7791f !important;
}

@media (max-width: 700px) {
.bookings-transfer-footer {
        align-items: flex-start !important;
        flex-direction: column !important;
    }

.bookings-transfer-footer > span:last-child {
        align-self: flex-start;
    }
}

@media (max-width: 1100px) {
.bookings-page {
        padding-left: 24px !important;
        padding-right: 24px !important;
    }

.bookings-filters {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

.bookings-filters > *:first-child {
        grid-column: 1 / -1;
    }

.bookings-clear-button {
        width: 100% !important;
    }
}

@media (max-width: 1100px) {
.bookings-transfer-filters {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

.bookings-transfer-filters > div:first-child {
        grid-column: 1 / -1;
    }

.bookings-transfer-filters .bookings-clear-button {
        width: 100% !important;
    }
}

@media (max-width: 700px) {
.bookings-page {
        padding-left: 16px !important;
        padding-right: 16px !important;
    }

.bookings-tabs {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        width: 100%;
        box-sizing: border-box;
        gap: 4px !important;
    }

.bookings-tab {
        min-width: 0 !important;
        width: 100%;
        padding-left: 10px !important;
        padding-right: 10px !important;
        white-space: nowrap;
    }

.bookings-filters {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
        margin-bottom: 24px !important;
    }

.bookings-filters > *:first-child {
        grid-column: auto;
    }

.bookings-filters > * {
        width: 100%;
    }

        .bookings-transfer-filters {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
        margin-bottom: 24px !important;
    }

.bookings-transfer-filters > div:first-child {
        grid-column: auto;
    }

.bookings-transfer-filters > * {
        width: 100%;
    }

        .bookings-transfer-results-bar {
        flex-wrap: wrap;
    }

.bookings-transfer-results-bar > div {
        width: 190px !important;
    }

.booking-card {
        padding: 22px 18px !important;
        border-radius: 18px !important;
    }

.booking-content,
.booking-info {
        width: 100%;
    }

.bookings-transfer-card {
        padding: 20px 16px !important;
        border-radius: 18px !important;
    }

.bookings-transfer-card > div:first-child {
        flex-direction: column !important;
        align-items: stretch !important;
    }

.bookings-transfer-card > div:first-child > div:last-child {
        text-align: left !important;
    }

.bookings-transfer-card > div:nth-child(2),
.bookings-transfer-card > div:nth-child(3) {
        grid-template-columns: 1fr !important;
    }

.bookings-transfer-card > div:last-child {
        flex-direction: column !important;
        align-items: flex-start !important;
    }
}

@media (max-width: 430px) {
.bookings-page {
        padding-left: 12px !important;
        padding-right: 12px !important;
    }

.bookings-tabs {
        border-radius: 16px !important;
        padding: 4px !important;
    }

.bookings-tab {
        min-height: 46px !important;
        font-size: 14px !important;
        gap: 6px !important;
    }

.bookings-tab span[aria-hidden="true"] {
        width: 27px !important;
        height: 27px !important;
        border-radius: 9px !important;
        font-size: 14px !important;
    }

.booking-card,
.bookings-transfer-card {
        padding: 18px 14px !important;
    }
}
`}</style>
            <section className="section">
                <div className="container bookings-page">

                    <div
                        className="bookings-page-header"
                        style={{
                            marginBottom: "28px",
                        }}
                    >
                        <span
                            className="stayway-load-in stayway-load-1"
                            style={{
                                display: "inline-block",
                                marginBottom: "10px",
                                color: "#6c5ce7",
                                fontSize: "12px",
                                fontWeight: 800,
                                letterSpacing: "0.12em",
                            }}
                        >
                            STAYWAY
                        </span>

                        <h1
                            className="page-title stayway-load-in stayway-load-2"
                            style={{
                                fontSize: "42px",
                                lineHeight: 1.1,
                                fontWeight: 800,
                                letterSpacing: "-0.02em",
                                margin: 0,
                            }}
                        >
                            {getBookingPageText(language, "title")}
                        </h1>
                    </div>

                    <div
                        className="bookings-tabs stayway-load-in stayway-load-3"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "5px",
                            marginBottom: "30px",
                            borderRadius: "18px",
                            background: "rgba(255, 255, 255, 0.58)",
                            border: "1px solid rgba(108, 92, 231, 0.12)",
                            boxShadow: "0 8px 28px rgba(78, 64, 125, 0.07)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                        }}
                    >
                        <button
                            type="button"
                            className={`bookings-tab ${
                                activeBookingTab === "stays"
                                    ? "active"
                                    : ""
                            }`}
                            style={{
                                position: "relative",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "9px",
                                minWidth: "172px",
                                minHeight: "48px",
                                padding: "0 22px",
                                border: "0",
                                borderRadius: "14px",
                                background:
                                    activeBookingTab === "stays"
                                        ? "#ffffff"
                                        : "transparent",
                                color:
                                    activeBookingTab === "stays"
                                        ? "#5f4bd8"
                                        : "#817b91",
                                fontSize: "15px",
                                fontWeight: 800,
                                letterSpacing: "-0.01em",
                                cursor: "pointer",
                                boxShadow:
                                    activeBookingTab === "stays"
                                        ? "0 7px 20px rgba(78, 64, 125, 0.11), inset 0 0 0 1px rgba(108, 92, 231, 0.08)"
                                        : "none",
                                transition:
                                    "background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease",
                            }}
                            onClick={() =>
                                setActiveBookingTab("stays")
                            }
                        >
                            <span>{getTranslation(language, "stays")}</span>
                            {activeBookingTab === "stays" && (
                                <span
                                    aria-hidden="true"
                                    style={{
                                        position: "absolute",
                                        left: "24px",
                                        right: "24px",
                                        bottom: "-5px",
                                        height: "3px",
                                        borderRadius: "999px",
                                        background: "linear-gradient(90deg, #6c5ce7, #8b7cf6)",
                                    }}
                                />
                            )}
                        </button>

                        <button
                            type="button"
                            className={`bookings-tab ${
                                activeBookingTab === "transfers"
                                    ? "active"
                                    : ""
                            }`}
                            style={{
                                position: "relative",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "9px",
                                minWidth: "172px",
                                minHeight: "48px",
                                padding: "0 22px",
                                border: "0",
                                borderRadius: "14px",
                                background:
                                    activeBookingTab === "transfers"
                                        ? "#ffffff"
                                        : "transparent",
                                color:
                                    activeBookingTab === "transfers"
                                        ? "#5f4bd8"
                                        : "#817b91",
                                fontSize: "15px",
                                fontWeight: 800,
                                letterSpacing: "-0.01em",
                                cursor: "pointer",
                                boxShadow:
                                    activeBookingTab === "transfers"
                                        ? "0 7px 20px rgba(78, 64, 125, 0.11), inset 0 0 0 1px rgba(108, 92, 231, 0.08)"
                                        : "none",
                                transition:
                                    "background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease",
                            }}
                            onClick={() =>
                                setActiveBookingTab("transfers")
                            }
                        >
                            <span>{getTranslation(language, "transfers")}</span>
                            {activeBookingTab === "transfers" && (
                                <span
                                    aria-hidden="true"
                                    style={{
                                        position: "absolute",
                                        left: "24px",
                                        right: "24px",
                                        bottom: "-5px",
                                        height: "3px",
                                        borderRadius: "999px",
                                        background: "linear-gradient(90deg, #6c5ce7, #8b7cf6)",
                                    }}
                                />
                            )}
                        </button>
                    </div>

                    {activeBookingTab === "stays" && (
                        <>
                            {/* SEARCH + FILTERS */}

                            <div
                                className="bookings-filters stayway-load-in stayway-load-4"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(180px, 1fr))",
                                    gap: "12px",
                                    alignItems:
                                        "stretch",
                                    marginBottom:
                                        "32px",
                                }}
                            >

                                {/* SEARCH */}

                                <div
                                    style={{
                                        position:
                                            "relative",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        background:
                                            "#ffffff",
                                        border:
                                            "1px solid #ddd8ec",
                                        borderRadius:
                                            "16px",
                                        minHeight:
                                            "58px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                        transition:
                                            "border-color 0.2s ease, box-shadow 0.2s ease",
                                    }}
                                >
                                    <Search
                                        size={20}
                                        style={{
                                            marginLeft:
                                                "18px",
                                            color:
                                                "#6c5ce7",
                                            flexShrink:
                                                0,
                                        }}
                                    />

                                    <input
                                        type="text"
                                        value={
                                            search
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSearch(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder={
                                            currentUser?.role ===
                                            "admin"
                                                ? getBookingPageText(language, "searchAdmin")
                                                : getBookingPageText(language, "searchUser")
                                        }
                                        aria-label={getBookingPageText(language, "searchBookings")}
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "56px",
                                            border:
                                                "none",
                                            outline:
                                                "none",
                                            background:
                                                "transparent",
                                            padding:
                                                "0 16px 0 12px",
                                            fontSize:
                                                "15px",
                                            color:
                                                "#302d3a",
                                            boxSizing:
                                                "border-box",
                                        }}
                                    />

                                    {search && (
                                        <button
                                            type="button"
                                            onClick={
                                                clearSearch
                                            }
                                            aria-label={getBookingPageText(language, "clearSearch")}
                                            style={{
                                                border:
                                                    "none",
                                                background:
                                                    "transparent",
                                                cursor:
                                                    "pointer",
                                                marginRight:
                                                    "12px",
                                                padding:
                                                    "6px",
                                                color:
                                                    "#777184",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                            }}
                                        >
                                            <X
                                                size={
                                                    18
                                                }
                                            />
                                        </button>
                                    )}
                                </div>

                                {/* USER FILTER — ADMIN ONLY */}

                                {currentUser?.role ===
                                    "admin" && (
                                        <div
                                            style={{
                                                position:
                                                    "relative",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                background:
                                                    "#ffffff",
                                                border:
                                                    "1px solid #ddd8ec",
                                                borderRadius:
                                                    "16px",
                                                minHeight:
                                                    "58px",
                                                boxShadow:
                                                    "0 8px 24px rgba(78, 64, 125, 0.06)",
                                            }}
                                        >
                                            <User
                                                size={18}
                                                style={{
                                                    marginLeft:
                                                        "16px",
                                                    color:
                                                        "#6c5ce7",
                                                    flexShrink:
                                                        0,
                                                }}
                                            />

                                            <select
                                                value={
                                                    userFilter
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setUserFilter(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                aria-label={getBookingPageText(language, "filterUser")}
                                                style={{
                                                    width:
                                                        "100%",
                                                    height:
                                                        "56px",
                                                    border:
                                                        "none",
                                                    outline:
                                                        "none",
                                                    background:
                                                        "transparent",
                                                    padding:
                                                        "0 14px 0 10px",
                                                    fontSize:
                                                        "15px",
                                                    color:
                                                        "#302d3a",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                <option value="All">
                                                    {getBookingPageText(language, "allUsers")}
                                                </option>

                                                {bookingUserOptions.map(
                                                    (user) => (
                                                        <option
                                                            key={user.userId}
                                                            value={String(
                                                                user.userId
                                                            )}
                                                        >
                                                            {user.name}
                                                            {user.email
                                                                ? ` · ${user.email}`
                                                                : ""}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    )}

                                {/* STATUS */}

                                <div
                                    style={{
                                        position:
                                            "relative",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        background:
                                            "#ffffff",
                                        border:
                                            "1px solid #ddd8ec",
                                        borderRadius:
                                            "16px",
                                        minHeight:
                                            "58px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                    }}
                                >
                                    <Circle
                                        size={17}
                                        style={{
                                            marginLeft:
                                                "16px",
                                            color:
                                                "#6c5ce7",
                                            flexShrink:
                                                0,
                                        }}
                                    />

                                    <select
                                        value={
                                            statusFilter
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setStatusFilter(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        aria-label={getBookingPageText(language, "filterStatus")}
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "56px",
                                            border:
                                                "none",
                                            outline:
                                                "none",
                                            background:
                                                "transparent",
                                            padding:
                                                "0 14px 0 10px",
                                            fontSize:
                                                "15px",
                                            color:
                                                "#302d3a",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        <option value="All">
                                            {getBookingPageText(language, "allStatuses")}
                                        </option>

                                        <option value="pending">
                                            {getBookingPageText(language, "pending")}
                                        </option>

                                        <option value="confirmed">
                                            {getBookingPageText(language, "confirmed")}
                                        </option>

                                        <option value="cancelled">
                                            {getBookingPageText(language, "cancelled")}
                                        </option>
                                    </select>
                                </div>

                                {/* SORT */}

                                <div
                                    style={{
                                        position:
                                            "relative",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        background:
                                            "#ffffff",
                                        border:
                                            "1px solid #ddd8ec",
                                        borderRadius:
                                            "16px",
                                        minHeight:
                                            "58px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                    }}
                                >
                                    <SlidersHorizontal
                                        size={18}
                                        style={{
                                            marginLeft:
                                                "16px",
                                            color:
                                                "#6c5ce7",
                                            flexShrink:
                                                0,
                                        }}
                                    />

                                    <select
                                        value={
                                            sortBy
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSortBy(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        aria-label={getBookingPageText(language, "sortBookings")}
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "56px",
                                            border:
                                                "none",
                                            outline:
                                                "none",
                                            background:
                                                "transparent",
                                            padding:
                                                "0 0px 0 10px",
                                            fontSize:
                                                "15px",
                                            color:
                                                "#302d3a",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        <option value="newest">
                                            {getBookingPageText(language, "checkIn")}: newest
                                        </option>

                                        <option value="oldest">
                                            {getBookingPageText(language, "checkIn")}: oldest
                                        </option>

                                        <option value="totalHigh">
                                            {getBookingPageText(language, "totalHigh")}
                                        </option>

                                        <option value="totalLow">
                                            {getBookingPageText(language, "totalLow")}
                                        </option>
                                    </select>
                                </div>

                                {/* CLEAR */}

                                <button
                                    type="button"
                                    className="bookings-clear-button"
                                    onClick={
                                        clearFilters
                                    }
                                    disabled={
                                        !hasActiveFilters
                                    }
                                    aria-label={getBookingPageText(language, "clear")}
                                    style={{
                                        minHeight:
                                            "58px",
                                        width:
                                            "160px",
                                        padding:
                                            "0 18px",
                                        border:
                                            "1px solid #ddd8ec",
                                        borderRadius:
                                            "16px",
                                        background:
                                            hasActiveFilters
                                                ? "#ffffff"
                                                : "#f7f5fb",
                                        color:
                                            hasActiveFilters
                                                ? "#5b526b"
                                                : "#aaa4b4",
                                        fontSize:
                                            "15px",
                                        fontWeight:
                                            700,
                                        cursor:
                                            hasActiveFilters
                                                ? "pointer"
                                                : "default",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                    }}
                                >
                                    {getBookingPageText(language, "clear")}
                                </button>
                            </div>

                            {/* RESULTS COUNT */}

                            {userBookings.length >
                                0 && (
                                    <div
                                        className="stayway-load-in stayway-load-4"
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "space-between",
                                            gap: "12px",
                                            marginBottom:
                                                "18px",
                                            color:
                                                "#777184",
                                            fontSize:
                                                "14px",
                                        }}
                                    >
                            <span>
                                {getBookingPageText(language, "showing")}{" "}
                                <strong
                                    style={{
                                        color:
                                            "#393343",
                                    }}
                                >
                                    {
                                        filteredBookings.length
                                    }
                                </strong>{" "}
                                {getBookingPageText(language, "of")}{" "}
                                <strong
                                    style={{
                                        color:
                                            "#393343",
                                    }}
                                >
                                    {
                                        userBookings.length
                                    }
                                </strong>{" "}
                                {getBookingPageText(language, "bookings")}
                            </span>
                                    </div>
                                )}

                            {/* NO BOOKINGS */}

                            {userBookings.length ===
                            0 ? (
                                <div
                                    className="bookings-empty stayway-load-in stayway-load-4"
                                    style={{
                                        minHeight: "280px",
                                        padding: "48px 24px",
                                        borderRadius: "20px",
                                        background: "#ffffff",
                                        border: "1px solid #e4dff0",
                                        textAlign: "center",
                                        boxShadow: "0 10px 30px rgba(78, 64, 125, 0.06)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "64px",
                                            height: "64px",
                                            margin: "0 auto 16px",
                                            borderRadius: "18px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#f1edff",
                                            fontSize: "28px",
                                        }}
                                    >
                                        🏨
                                    </div>

                                    <h3
                                        style={{
                                            margin: "0 0 8px",
                                            fontSize: "20px",
                                            fontWeight: 800,
                                            color: "#302d3a",
                                        }}
                                    >
                                        {getBookingPageText(language, "noTransfersFound")}
                                    </h3>

                                    <Link
                                        href="/stays"
                                        className="button"
                                    >
                                        {getBookingPageText(language, "backStays")}
                                    </Link>
                                </div>
                            ) : filteredBookings.length ===
                            0 ? (
                                <div
                                    className="home-empty-state stayway-load-in stayway-load-4"
                                    style={{
                                        minHeight: "280px",
                                        padding: "42px 28px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        borderRadius: "24px",
                                        border: "1px solid #e8e2f4",
                                        background: "#ffffff",
                                        boxShadow: "0 12px 32px rgba(92, 70, 150, 0.06)",
                                    }}
                                >
                                    <div
                                        aria-hidden="true"
                                        style={{
                                            width: "68px",
                                            height: "68px",
                                            marginBottom: "18px",
                                            borderRadius: "20px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#f0ebff",
                                            border: "1px solid #e1d9ff",
                                            color: "#6c5ce7",
                                        }}
                                    >
                                        <Search size={30} strokeWidth={2.2} />
                                    </div>

                                    <h3
                                        style={{
                                            margin: "0 0 8px",
                                            fontSize: "23px",
                                            lineHeight: 1.2,
                                            fontWeight: 800,
                                            letterSpacing: "-0.02em",
                                            color: "#302d3a",
                                        }}
                                    >
                                        {getBookingPageText(language, "noFound")}
                                    </h3>

                                    <p
                                        style={{
                                            margin: "0 0 20px",
                                            maxWidth: "440px",
                                            color: "#777184",
                                            fontSize: "14px",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {getBookingPageText(language, "tryFilters")}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setUserFilter("All");
                                            setStatusFilter("All");
                                            setSortBy("newest");
                                        }}
                                        style={{
                                            minWidth: "118px",
                                            padding: "10px 18px",
                                            borderRadius: "12px",
                                            border: "1px solid #ddd5f4",
                                            background: "#ffffff",
                                            color: "#5d4fc3",
                                            fontSize: "13px",
                                            fontWeight: 800,
                                            cursor: "pointer",
                                            boxShadow: "0 6px 16px rgba(92, 70, 150, 0.06)",
                                        }}
                                    >
                                        {getBookingPageText(language, "clear")}
                                    </button>
                                </div>
                            ) : (
                                <div className="bookings-list stayway-load-in stayway-load-6">

                                    {filteredBookings.map(
                                        (
                                            booking
                                        ) => {

                                            /*
                                             * IMPORTANT:
                                             * Dynamic property lookup.
                                             */
                                            const property =
                                                allProperties.find(
                                                    (
                                                        item
                                                    ) =>
                                                        item.id ===
                                                        booking.propertyId
                                                );

                                            /*
                                             * IMPORTANT:
                                             * Dynamic room lookup.
                                             */
                                            const room =
                                                allRooms.find(
                                                    (
                                                        item
                                                    ) =>
                                                        item.id ===
                                                        booking.roomId &&
                                                        item.propertyId ===
                                                        booking.propertyId
                                                );

                                            const isConfirmed =
                                                booking.status ===
                                                "confirmed";

                                            return (
                                                <div
                                                    className="booking-card"
                                                    key={
                                                        booking.id
                                                    }
                                                    style={{}}
                                                >
                                                    <div className="booking-content">

                                                        <h2>
                                                            {
                                                                property?.name
                                                            }
                                                        </h2>

                                                        <div className="booking-info">

                                                            {/* PROPERTY */}

                                                            <div className="booking-info-row">
                                                                <Building2 className="booking-info-icon" />

                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            getTranslation(
                                                                                language,
                                                                                "property"
                                                                            )
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                {
                                                                    property?.name
                                                                }
                                                            </span>
                                                                </div>
                                                            </div>

                                                            {/* ROOM */}

                                                            <div className="booking-info-row">
                                                                <DoorOpen className="booking-info-icon" />

                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            getTranslation(
                                                                                language,
                                                                                "room"
                                                                            )
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                {
                                                                    getLocalizedBookingRoomName(
                                                                        room?.name,
                                                                        language
                                                                    )
                                                                }
                                                            </span>
                                                                </div>
                                                            </div>

                                                            {/* GUEST */}

                                                            <div className="booking-info-row">
                                                                <User className="booking-info-icon" />

                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            getTranslation(
                                                                                language,
                                                                                "user"
                                                                            )
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                        {
                                                                            booking.firstName ||
                                                                            booking.lastName
                                                                                ? `${booking.firstName ?? ""} ${booking.lastName ?? ""}`.trim()
                                                                                : getBookingPageText(
                                                                                    language,
                                                                                    "unknownUser"
                                                                                )
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* EMAIL */}

                                                            <div className="booking-info-row">
                                                                <Mail className="booking-info-icon" />

                                                                <div>
                                                                    <strong>
                                                                        {getBookingPageText(language, "email")}
                                                                    </strong>

                                                                    <span>
                                                                        {
                                                                            booking.email ??
                                                                            "—"
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* PHONE */}

                                                            <div className="booking-info-row">
                                                                <Phone className="booking-info-icon" />

                                                                <div>
                                                                    <strong>
                                                                        {getBookingPageText(language, "phone")}
                                                                    </strong>

                                                                    <span>
                                                                        {booking.phone ?? "—"}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* CHECK-IN */}

                                                            <div className="booking-info-row">
                                                                <CalendarDays className="booking-info-icon" />

                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            getTranslation(
                                                                                language,
                                                                                "checkIn"
                                                                            )
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                {
                                                                    formatDate(
                                                                        booking.checkIn
                                                                    )
                                                                }
                                                            </span>
                                                                </div>
                                                            </div>

                                                            {/* CHECK-OUT */}

                                                            <div className="booking-info-row">
                                                                <CalendarDays className="booking-info-icon" />

                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            getTranslation(
                                                                                language,
                                                                                "checkOut"
                                                                            )
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                {
                                                                    formatDate(
                                                                        booking.checkOut
                                                                    )
                                                                }
                                                            </span>
                                                                </div>
                                                            </div>

                                                            {/* GUESTS */}

                                                            <div className="booking-info-row">
                                                                <Users className="booking-info-icon" />

                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            getTranslation(
                                                                                language,
                                                                                "guests"
                                                                            )
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                {
                                                                    getGuestText(
                                                                        booking
                                                                    )
                                                                }
                                                            </span>
                                                                </div>
                                                            </div>

                                                            {/* TOTAL */}

                                                            <div className="booking-info-row">
                                                                <Tag className="booking-info-icon" />

                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            getTranslation(
                                                                                language,
                                                                                "total"
                                                                            )
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                {
                                                                    formatPrice(
                                                                        booking.totalPrice
                                                                    )
                                                                }
                                                            </span>
                                                                </div>
                                                            </div>

                                                            {/* STATUS */}

                                                            <div
                                                                className="booking-info-row"
                                                                style={
                                                                    booking.status ===
                                                                    "pending"
                                                                        ? {
                                                                            padding:
                                                                                "14px 16px",
                                                                            marginTop:
                                                                                "4px",
                                                                            border:
                                                                                "1px solid #f1dfb4",
                                                                            borderRadius:
                                                                                "14px",
                                                                            background:
                                                                                "#fffaf0",
                                                                        }
                                                                        : undefined
                                                                }
                                                            >
                                                                {booking.status ===
                                                                "pending" ? (
                                                                    <Clock3
                                                                        className="booking-info-icon"
                                                                        style={{
                                                                            color:
                                                                                "#d99518",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Circle className="booking-info-icon status-icon" />
                                                                )}

                                                                <div
                                                                    style={{
                                                                        flex: 1,
                                                                    }}
                                                                >
                                                                    <strong>
                                                                        {booking.status ===
                                                                        "pending"
                                                                            ? getBookingPageText(language, "bookingPending")
                                                                            : getTranslation(
                                                                                language,
                                                                                "status"
                                                                            )}
                                                                    </strong>

                                                                    <span
                                                                        className={
                                                                            booking.status ===
                                                                            "pending"
                                                                                ? undefined
                                                                                : isConfirmed
                                                                                    ? "booking-status status-confirmed"
                                                                                    : "booking-status status-cancelled"
                                                                        }
                                                                        style={
                                                                            booking.status ===
                                                                            "pending"
                                                                                ? {
                                                                                    display:
                                                                                        "block",
                                                                                    marginTop:
                                                                                        "3px",
                                                                                    color:
                                                                                        "#8a7650",
                                                                                }
                                                                                : undefined
                                                                        }
                                                                    >
                                                                        {booking.status ===
                                                                        "pending"
                                                                            ? getBookingPageText(language, "pendingMessage")
                                                                            : getStatusText(
                                                                                booking.status
                                                                            )}
                                                                    </span>
                                                                </div>

                                                                {booking.status ===
                                                                    "pending" && (
                                                                        <span
                                                                            style={{
                                                                                flexShrink: 0,
                                                                                padding:
                                                                                    "6px 10px",
                                                                                borderRadius:
                                                                                    "999px",
                                                                                background:
                                                                                    "#fff0c9",
                                                                                color:
                                                                                    "#a66a00",
                                                                                fontSize:
                                                                                    "12px",
                                                                                fontWeight:
                                                                                    700,
                                                                            }}
                                                                        >
                                                                        {getBookingPageText(language, "pending")}
                                                                    </span>
                                                                    )}
                                                            </div>

                                                        </div>

                                                        <div className="booking-actions">

                                                            {property && (
                                                                <Link
                                                                    href={`/stays/${property.id}`}
                                                                    className="button"
                                                                >
                                                                    {
                                                                        getTranslation(
                                                                            language,
                                                                            "viewProperty"
                                                                        )
                                                                    }
                                                                </Link>
                                                            )}

                                                            {booking.status !==
                                                                "cancelled" && (
                                                                    <button
                                                                        type="button"
                                                                        className="cancel-button"
                                                                        onClick={() =>
                                                                            handleCancelBooking(
                                                                                booking.id
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            getTranslation(
                                                                                language,
                                                                                "cancelBooking"
                                                                            )
                                                                        }
                                                                    </button>
                                                                )}

                                                        </div>

                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </>
                    )}

                    {activeBookingTab === "transfers" && (
                        <section className="bookings-transfers-section">
                            <div
                                className="bookings-transfer-filters stayway-load-in stayway-load-3"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "minmax(0, 1.8fr) repeat(4, minmax(0, 1fr)) 160px",
                                    gap: "10px",
                                    alignItems: "stretch",
                                    marginBottom: "32px",
                                }}
                            >
                                {/* SEARCH */}
                                <div
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        background: "#ffffff",
                                        border: "1px solid #ddd8ec",
                                        borderRadius: "16px",
                                        minHeight: "58px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                        transition:
                                            "border-color 0.2s ease, box-shadow 0.2s ease",
                                    }}
                                >
                                    <Search
                                        size={20}
                                        style={{
                                            marginLeft: "18px",
                                            color: "#6c5ce7",
                                            flexShrink: 0,
                                        }}
                                    />

                                    <input
                                        id="transfer-search"
                                        type="text"
                                        value={transferSearch}
                                        onChange={(event) =>
                                            setTransferSearch(event.target.value)
                                        }
                                        placeholder={getBookingPageText(language, "transferSearchPlaceholder")}
                                        aria-label={getTranslation(language, "searchTransfers")}
                                        style={{
                                            width: "100%",
                                            height: "56px",
                                            border: "none",
                                            outline: "none",
                                            background: "transparent",
                                            padding: "0 8px 0 12px",
                                            fontSize: "14px",
                                            color: "#302d3a",
                                            boxSizing: "border-box",
                                            minWidth: 0,
                                        }}
                                    />

                                    {transferSearch && (
                                        <button
                                            type="button"
                                            onClick={() => setTransferSearch("")}
                                            aria-label={getBookingPageText(language, "clearTransferSearch")}
                                            style={{
                                                border: "none",
                                                background: "transparent",
                                                cursor: "pointer",
                                                marginRight: "10px",
                                                padding: "6px",
                                                color: "#777184",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>

                                {/* TRANSFER TYPE */}
                                <div
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        background: "#ffffff",
                                        border: "1px solid #ddd8ec",
                                        borderRadius: "16px",
                                        minHeight: "58px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                    }}
                                >
                                    <Tag
                                        size={18}
                                        style={{
                                            marginLeft: "16px",
                                            color: "#6c5ce7",
                                            flexShrink: 0,
                                        }}
                                    />

                                    <select
                                        id="transfer-type-filter"
                                        value={transferTypeFilter}
                                        onChange={(event) =>
                                            setTransferTypeFilter(
                                                event.target.value as typeof transferTypeFilter
                                            )
                                        }
                                        aria-label={getBookingPageText(language, "filterTransferType")}
                                        style={{
                                            width: "100%",
                                            height: "56px",
                                            border: "none",
                                            outline: "none",
                                            background: "transparent",
                                            padding: "0 8px 0 8px",
                                            fontSize: "14px",
                                            color: "#302d3a",
                                            cursor: "pointer",
                                            minWidth: 0,
                                        }}
                                    >
                                        <option value="all">
                                            {getBookingPageText(language, "allTransferTypes")}
                                        </option>
                                        <option value="one-way">
                                            {getTranslation(language, "oneWay")}
                                        </option>
                                        <option value="return">
                                            {getTranslation(language, "return")}
                                        </option>
                                    </select>
                                </div>

                                {/* DATE */}
                                <div
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        background: "#ffffff",
                                        border: "1px solid #ddd8ec",
                                        borderRadius: "16px",
                                        minHeight: "58px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                    }}
                                >
                                    <CalendarDays
                                        size={18}
                                        style={{
                                            marginLeft: "16px",
                                            color: "#6c5ce7",
                                            flexShrink: 0,
                                        }}
                                    />

                                    <select
                                        id="transfer-date-filter"
                                        value={transferDateFilter}
                                        onChange={(event) =>
                                            setTransferDateFilter(
                                                event.target.value as typeof transferDateFilter
                                            )
                                        }
                                        aria-label={getBookingPageText(language, "filterTransferDate")}
                                        style={{
                                            width: "100%",
                                            height: "56px",
                                            border: "none",
                                            outline: "none",
                                            background: "transparent",
                                            padding: "0 8px 0 8px",
                                            fontSize: "14px",
                                            color: "#302d3a",
                                            cursor: "pointer",
                                            minWidth: 0,
                                        }}
                                    >
                                        <option value="all">
                                            {getBookingPageText(language, "allDates")}
                                        </option>
                                        <option value="upcoming">
                                            {getBookingPageText(language, "upcoming")}
                                        </option>
                                        <option value="past">
                                            {getBookingPageText(language, "past")}
                                        </option>
                                    </select>
                                </div>

                                {/* VEHICLE */}
                                <div
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        background: "#ffffff",
                                        border: "1px solid #ddd8ec",
                                        borderRadius: "16px",
                                        minHeight: "58px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                    }}
                                >
                                    <Tag
                                        size={18}
                                        style={{
                                            marginLeft: "16px",
                                            color: "#6c5ce7",
                                            flexShrink: 0,
                                        }}
                                    />

                                    <select
                                        id="transfer-vehicle-filter"
                                        value={transferVehicleFilter}
                                        onChange={(event) =>
                                            setTransferVehicleFilter(event.target.value)
                                        }
                                        aria-label={getBookingPageText(language, "filterVehicle")}
                                        style={{
                                            width: "100%",
                                            height: "56px",
                                            border: "none",
                                            outline: "none",
                                            background: "transparent",
                                            padding: "0 8px 0 8px",
                                            fontSize: "14px",
                                            color: "#302d3a",
                                            cursor: "pointer",
                                            minWidth: 0,
                                        }}
                                    >
                                        <option value="all">
                                            {getBookingPageText(language, "allVehicles")}
                                        </option>
                                        {transferVehicleOptions.map((vehicle) => (
                                            <option key={vehicle} value={vehicle}>
                                                {vehicle}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* PASSENGERS */}
                                <div
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        background: "#ffffff",
                                        border: "1px solid #ddd8ec",
                                        borderRadius: "16px",
                                        minHeight: "58px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                    }}
                                >
                                    <Users
                                        size={18}
                                        style={{
                                            marginLeft: "16px",
                                            color: "#6c5ce7",
                                            flexShrink: 0,
                                        }}
                                    />

                                    <select
                                        id="transfer-passengers-filter"
                                        value={transferPassengersFilter}
                                        onChange={(event) =>
                                            setTransferPassengersFilter(
                                                event.target.value as typeof transferPassengersFilter
                                            )
                                        }
                                        aria-label={getBookingPageText(language, "filterPassengers")}
                                        style={{
                                            width: "100%",
                                            height: "56px",
                                            border: "none",
                                            outline: "none",
                                            background: "transparent",
                                            padding: "0 8px 0 8px",
                                            fontSize: "14px",
                                            color: "#302d3a",
                                            cursor: "pointer",
                                            minWidth: 0,
                                        }}
                                    >
                                        <option value="all">
                                            {getBookingPageText(language, "anyPassengers")}
                                        </option>
                                        <option value="1-3">1–3</option>
                                        <option value="4-5">4–5</option>
                                        <option value="6+">6+</option>
                                    </select>
                                </div>

                                {/* CLEAR */}
                                <button
                                    type="button"
                                    className="bookings-clear-button"
                                    onClick={clearTransferFilters}
                                    disabled={
                                        transferSearch.trim() === "" &&
                                        transferTypeFilter === "all" &&
                                        transferDateFilter === "all" &&
                                        transferVehicleFilter === "all" &&
                                        transferPassengersFilter === "all" &&
                                        transferSortBy === "newest"
                                    }
                                    aria-label={getBookingPageText(language, "clear")}
                                    style={{
                                        minHeight: "58px",
                                        width: "160px",
                                        padding: "0 18px",
                                        border: "1px solid #ddd8ec",
                                        borderRadius: "16px",
                                        background:
                                            transferSearch.trim() !== "" ||
                                            transferTypeFilter !== "all" ||
                                            transferDateFilter !== "all" ||
                                            transferVehicleFilter !== "all" ||
                                            transferPassengersFilter !== "all" ||
                                            transferSortBy !== "newest"
                                                ? "#ffffff"
                                                : "#f7f5fb",
                                        color:
                                            transferSearch.trim() !== "" ||
                                            transferTypeFilter !== "all" ||
                                            transferDateFilter !== "all" ||
                                            transferVehicleFilter !== "all" ||
                                            transferPassengersFilter !== "all" ||
                                            transferSortBy !== "newest"
                                                ? "#5b526b"
                                                : "#aaa4b5",
                                        cursor:
                                            transferSearch.trim() !== "" ||
                                            transferTypeFilter !== "all" ||
                                            transferDateFilter !== "all" ||
                                            transferVehicleFilter !== "all" ||
                                            transferPassengersFilter !== "all" ||
                                            transferSortBy !== "newest"
                                                ? "pointer"
                                                : "default",
                                        fontSize: "15px",
                                        fontWeight: 700,
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                    }}
                                >
                                    {getBookingPageText(language, "clear")}
                                </button>
                            </div>

                            <div
                                className="bookings-transfer-results-bar stayway-load-in stayway-load-6"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                    marginBottom: "16px",
                                    color: "#777184",
                                    fontSize: "14px",
                                }}
                            >
                                <span>
                                    {getBookingPageText(language, "showing")}{" "}
                                    <strong style={{ color: "#302d3a" }}>
                                        {filteredTransferBookings.length}
                                    </strong>{" "}
                                    {getBookingPageText(language, "of")}{" "}
                                    <strong style={{ color: "#302d3a" }}>
                                        {transferBookings.length}
                                    </strong>{" "}
                                    {getBookingPageText(language, "transfersLower")}
                                </span>




                                <div
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        width: "190px",
                                        minHeight: "42px",
                                        background: "#ffffff",
                                        border: "1px solid #ddd8ec",
                                        borderRadius: "14px",
                                        boxShadow: "0 8px 24px rgba(78, 64, 125, 0.05)",
                                    }}
                                >
                                    <SlidersHorizontal
                                        size={17}
                                        style={{
                                            marginLeft: "14px",
                                            color: "#6c5ce7",
                                            flexShrink: 0,
                                        }}
                                    />
                                    <select
                                        id="transfer-sort"
                                        value={transferSortBy}
                                        onChange={(event) =>
                                            setTransferSortBy(
                                                event.target.value as typeof transferSortBy
                                            )
                                        }
                                        aria-label={getBookingPageText(language, "sortTransfers")}
                                        style={{
                                            width: "100%",
                                            height: "40px",
                                            border: "none",
                                            outline: "none",
                                            background: "transparent",
                                            padding: "0 8px",
                                            fontSize: "14px",
                                            color: "#302d3a",
                                            cursor: "pointer",
                                            minWidth: 0,
                                        }}
                                    >
                                        <option value="newest">
                                            {getBookingPageText(language, "newestFirst")}
                                        </option>
                                        <option value="oldest">
                                            {getBookingPageText(language, "oldestFirst")}
                                        </option>
                                        <option value="priceHigh">
                                            {getBookingPageText(language, "priceHigh")}
                                        </option>
                                        <option value="priceLow">
                                            {getBookingPageText(language, "priceLow")}
                                        </option>
                                    </select>
                                </div>                            </div>

                            {filteredTransferBookings.length === 0 ? (
                                <div
                                    className="bookings-empty stayway-load-in stayway-load-6"
                                    style={{
                                        padding: "48px 24px",
                                        borderRadius: "20px",
                                        background: "#ffffff",
                                        border: "1px solid #e4dff0",
                                        textAlign: "center",
                                        boxShadow: "0 10px 30px rgba(78, 64, 125, 0.06)",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "64px",
                                            height: "64px",
                                            margin: "0 auto 16px",
                                            borderRadius: "18px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#f1edff",
                                            fontSize: "28px",
                                        }}
                                    >
                                        🚘
                                    </div>

                                    <h3
                                        style={{
                                            margin: "0 0 8px",
                                            fontSize: "20px",
                                            fontWeight: 800,
                                            color: "#302d3a",
                                        }}
                                    >
                                        {getTranslation(language, "noBookings")}
                                    </h3>

                                    <p
                                        style={{
                                            margin: "0 0 22px",
                                            color: "#777184",
                                        }}
                                    >
                                        {getBookingPageText(language, "noTransfersHint")}
                                    </p>

                                    <Link
                                        href="/transfers"
                                        className="button"
                                    >
                                        {getBookingPageText(language, "findTransfers")}
                                    </Link>
                                </div>
                            ) : (
                                <div
                                    className="bookings-transfers-list stayway-load-in stayway-load-5"
                                    style={{
                                        display: "grid",
                                        gap: "18px",
                                    }}
                                >
                                    {filteredTransferBookings.map(
                                        (booking) => {
                                            const isReturn =
                                                booking.transferType === "return";

                                            const passengerLabel =
                                                getTranslation(language, "passengers");

                                            const transferVehicle = booking.vehicleId
                                                ? allTransferVehicles.find(
                                                    (vehicle) =>
                                                        vehicle.id ===
                                                        booking.vehicleId
                                                )
                                                : undefined;

                                            const driverId =
                                                booking.driverId ||
                                                transferVehicle?.driverId;

                                            const transferDriver = driverId
                                                ? allTransferDrivers.find(
                                                    (driver) =>
                                                        driver.id ===
                                                        driverId
                                                )
                                                : undefined;

                                            const vehicleImage =
                                                (booking as TransferBooking & {
                                                    vehicleImage?: string;
                                                }).vehicleImage ||
                                                transferVehicle?.image;

                                            const vehicleName =
                                                booking.vehicleName ||
                                                transferVehicle?.name;

                                            const licensePlate =
                                                booking.licensePlate ||
                                                transferVehicle?.licensePlate;

                                            const driverName =
                                                booking.driverName ||
                                                transferDriver?.name;

                                            const transferStatus =
                                                booking.status ?? "confirmed";

                                            const transferStatusText =
                                                transferStatus === "pending"
                                                    ? getBookingPageText(language, "pending")
                                                    : transferStatus === "cancelled"
                                                        ? getBookingPageText(language, "cancelled")
                                                        : getBookingPageText(language, "confirmed");

                                            return (
                                                <article
                                                    key={booking.id}
                                                    className="bookings-transfer-card"
                                                    style={{
                                                        padding: "28px",
                                                        borderRadius: "24px",
                                                        background: "#ffffff",
                                                        border: "1px solid #e8e2f4",
                                                        boxShadow: "0 14px 38px rgba(78, 64, 125, 0.08)",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "flex-start",
                                                            justifyContent: "space-between",
                                                            gap: "24px",
                                                            marginBottom: "24px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "18px",
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            {vehicleImage ? (
                                                                <img
                                                                    src={vehicleImage}
                                                                    alt={vehicleName || booking.optionTitle}
                                                                    style={{
                                                                        width: "138px",
                                                                        height: "92px",
                                                                        borderRadius: "18px",
                                                                        objectFit: "cover",
                                                                        display: "block",
                                                                        flexShrink: 0,
                                                                        background: "#f1edff",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span
                                                                    style={{
                                                                        width: "138px",
                                                                        height: "92px",
                                                                        borderRadius: "18px",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        background: "#f1edff",
                                                                        fontSize: "34px",
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    🚘
                                                                </span>
                                                            )}

                                                            <div style={{ minWidth: 0 }}>
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "10px",
                                                                        flexWrap: "wrap",
                                                                        marginBottom: "7px",
                                                                    }}
                                                                >
                                                                    <h3
                                                                        style={{
                                                                            margin: 0,
                                                                            color: "#272333",
                                                                            fontSize: "22px",
                                                                            lineHeight: 1.2,
                                                                            fontWeight: 850,
                                                                        }}
                                                                    >
                                                                        {getLocalizedTransferBookingTitle(
                                                                            booking.optionTitle,
                                                                            language
                                                                        )}
                                                                    </h3>
                                                                    <span
                                                                        style={{
                                                                            display: "inline-flex",
                                                                            alignItems: "center",
                                                                            padding: "7px 12px",
                                                                            borderRadius: "999px",
                                                                            background: "#f0ebff",
                                                                            color: "#6751dc",
                                                                            fontSize: "12px",
                                                                            fontWeight: 800,
                                                                        }}
                                                                    >
                                                                        {isReturn ? getTranslation(language, "return") : getTranslation(language, "oneWay")}
                                                                    </span>
                                                                </div>

                                                                {vehicleName && (
                                                                    <div
                                                                        style={{
                                                                            color: "#3d3949",
                                                                            fontSize: "15px",
                                                                            fontWeight: 800,
                                                                            lineHeight: 1.45,
                                                                        }}
                                                                    >
                                                                        {vehicleName}{licensePlate ? ` · ${licensePlate}` : ""}
                                                                    </div>
                                                                )}

                                                                {driverName && (
                                                                    <div
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            flexWrap: "wrap",
                                                                            gap: "9px",
                                                                            marginTop: "10px",
                                                                            color: "#716b7d",
                                                                            fontSize: "13px",
                                                                            fontWeight: 650,
                                                                        }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                width: "28px",
                                                                                height: "28px",
                                                                                borderRadius: "9px",
                                                                                display: "inline-flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                background: "#f1edff",
                                                                                color: "#7055e8",
                                                                                flexShrink: 0,
                                                                            }}
                                                                        >
                                                                            <User size={15} strokeWidth={2.4} />
                                                                        </span>
                                                                        <span>
                                                                            {getBookingPageText(language, "driver")}: {driverName}
                                                                        </span>
                                                                        {transferDriver?.phone && (
                                                                            <>
                                                                                <span style={{ color: "#c9c3d5" }}>•</span>
                                                                                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                                                                    <Phone size={14} strokeWidth={2.3} />
                                                                                    {transferDriver.phone}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div
                                                            style={{
                                                                flexShrink: 0,
                                                                minWidth: "118px",
                                                                padding: "13px 18px",
                                                                borderRadius: "18px",
                                                                background: "#faf7ff",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <span style={{ display: "block", marginBottom: "3px", color: "#817a91", fontSize: "12px", fontWeight: 700 }}>
                                                                {getTranslation(language, "total")}
                                                            </span>
                                                            <strong style={{ color: "#6c5ce7", fontSize: "25px", lineHeight: 1.1, fontWeight: 900 }}>
                                                                {formatPrice(booking.price)}
                                                            </strong>
                                                        </div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(160px, 0.7fr)",
                                                            gap: 0,
                                                            padding: "4px 0",
                                                            borderRadius: "20px",
                                                            background: "linear-gradient(135deg, #faf8ff 0%, #f5f1ff 100%)",
                                                            border: "1px solid #eee9f8",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "20px", borderRight: "1px solid #e7e1f2" }}>
                                                            <span style={{ width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0ebff", color: "#7055e8", flexShrink: 0 }}>
                                                                <Building2 size={23} strokeWidth={2.2} />
                                                            </span>
                                                            <div style={{ minWidth: 0 }}>
                                                                <span style={{ display: "block", marginBottom: "5px", color: "#8b8498", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                                    {getTranslation(language, "pickupLocation")}
                                                                </span>
                                                                <strong style={{ display: "block", color: "#302d3a", fontSize: "14px", lineHeight: 1.4 }}>
                                                                    {booking.pickup}
                                                                </strong>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "20px", borderRight: "1px solid #e7e1f2" }}>
                                                            <span style={{ width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0ebff", color: "#7055e8", flexShrink: 0 }}>
                                                                <Building2 size={23} strokeWidth={2.2} />
                                                            </span>
                                                            <div style={{ minWidth: 0 }}>
                                                                <span style={{ display: "block", marginBottom: "5px", color: "#8b8498", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                                    {getTranslation(language, "destination")}
                                                                </span>
                                                                <strong style={{ display: "block", color: "#302d3a", fontSize: "14px", lineHeight: 1.4 }}>
                                                                    {booking.destination}
                                                                </strong>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "20px" }}>
                                                            <span style={{ width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0ebff", color: "#7055e8", flexShrink: 0 }}>
                                                                <Users size={23} strokeWidth={2.2} />
                                                            </span>
                                                            <div>
                                                                <span style={{ display: "block", marginBottom: "5px", color: "#8b8498", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                                    {getTranslation(language, "passengers")}
                                                                </span>
                                                                <strong style={{ display: "block", color: "#302d3a", fontSize: "14px" }}>
                                                                    {booking.passengers} {passengerLabel}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: isReturn ? "repeat(4, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))",
                                                            gap: "12px",
                                                            marginTop: "14px",
                                                        }}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "17px 18px", borderRadius: "18px", border: "1px solid #ebe6f7", background: "#ffffff" }}>
                                                            <span style={{ width: "44px", height: "44px", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0ff", color: "#7055e8", flexShrink: 0 }}>
                                                                <CalendarDays size={21} strokeWidth={2.2} />
                                                            </span>
                                                            <div>
                                                                <span style={{ display: "block", marginBottom: "4px", color: "#8b8498", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                                    {getTranslation(language, "date")}
                                                                </span>
                                                                <strong style={{ color: "#302d3a", fontSize: "14px" }}>{formatTransferDate(booking.date)}</strong>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "17px 18px", borderRadius: "18px", border: "1px solid #ebe6f7", background: "#ffffff" }}>
                                                            <span style={{ width: "44px", height: "44px", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0ff", color: "#7055e8", flexShrink: 0 }}>
                                                                <Clock3 size={21} strokeWidth={2.2} />
                                                            </span>
                                                            <div>
                                                                <span style={{ display: "block", marginBottom: "4px", color: "#8b8498", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                                    {getTranslation(language, "time")}
                                                                </span>
                                                                <strong style={{ color: "#302d3a", fontSize: "14px" }}>{booking.time}</strong>
                                                            </div>
                                                        </div>

                                                        {isReturn && (
                                                            <>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "17px 18px", borderRadius: "18px", border: "1px solid #ebe6f7", background: "#ffffff" }}>
                                                                    <span style={{ width: "44px", height: "44px", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0ff", color: "#7055e8", flexShrink: 0 }}>
                                                                        <CalendarDays size={21} strokeWidth={2.2} />
                                                                    </span>
                                                                    <div>
                                                                        <span style={{ display: "block", marginBottom: "4px", color: "#8b8498", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                                            {getTranslation(language, "returnDate")}
                                                                        </span>
                                                                        <strong style={{ color: "#302d3a", fontSize: "14px" }}>{formatTransferDate(booking.returnDate ?? "—")}</strong>
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "13px", padding: "17px 18px", borderRadius: "18px", border: "1px solid #ebe6f7", background: "#ffffff" }}>
                                                                    <span style={{ width: "44px", height: "44px", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0ff", color: "#7055e8", flexShrink: 0 }}>
                                                                        <Clock3 size={21} strokeWidth={2.2} />
                                                                    </span>
                                                                    <div>
                                                                        <span style={{ display: "block", marginBottom: "4px", color: "#8b8498", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                                            {getTranslation(language, "returnTime")}
                                                                        </span>
                                                                        <strong style={{ color: "#302d3a", fontSize: "14px" }}>{booking.returnTime ?? "—"}</strong>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div
                                                        className="bookings-transfer-footer"
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            gap: "16px",
                                                            marginTop: "18px",
                                                            paddingTop: "16px",
                                                            borderTop: "1px solid #eeeaf5",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "flex-start",
                                                                gap: "12px",
                                                                flexWrap: "nowrap",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "8px",
                                                                    padding: "9px 14px",
                                                                    borderRadius: "999px",
                                                                    background:
                                                                        transferStatus === "confirmed"
                                                                            ? "#e9f9ef"
                                                                            : transferStatus === "pending"
                                                                                ? "#fff6df"
                                                                                : "#fff0f0",
                                                                    color:
                                                                        transferStatus === "confirmed"
                                                                            ? "#238657"
                                                                            : transferStatus === "pending"
                                                                                ? "#b7791f"
                                                                                : "#c24141",
                                                                    fontSize: "13px",
                                                                    fontWeight: 800,
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        width: "8px",
                                                                        height: "8px",
                                                                        borderRadius: "50%",
                                                                        background:
                                                                            transferStatus === "confirmed"
                                                                                ? "#2d9b67"
                                                                                : transferStatus === "pending"
                                                                                    ? "#d89a2b"
                                                                                    : "#d95c5c",
                                                                    }}
                                                                />
                                                                {transferStatusText}
                                                            </span>

                                                            {transferStatus !== "cancelled" && (
                                                                <button
                                                                    type="button"
                                                                    className="cancel-button"
                                                                    style={{
                                                                        margin: 0,
                                                                        alignSelf: "center",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleCancelTransferBooking(
                                                                            booking.id
                                                                        )
                                                                    }
                                                                >
                                                                    {getTranslation(
                                                                        language,
                                                                        "cancelBooking"
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>

                                                        <span
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "8px",
                                                                padding: "8px 12px 8px 9px",
                                                                borderRadius: "14px",
                                                                background: "#faf8ff",
                                                                border: "1px solid #eee9f8",
                                                                color: "#777084",
                                                                fontSize: "13px",
                                                                fontWeight: 650,
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: "28px",
                                                                    height: "28px",
                                                                    borderRadius: "9px",
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    background: "#f0ebff",
                                                                    color: "#7055e8",
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                <User size={14} strokeWidth={2.4} />
                                                            </span>
                                                            <span>
                                                                {getTranslation(language, "user")} {booking.firstName} {booking.lastName}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </article>
                                            );

                                        }
                                    )}
                                </div>
                            )}
                        </section>
                    )}

                </div>
            </section>
        </main>
    );
}

export default function BookingsPage() {
    return (
        <ProtectedRoute>
            <BookingsContent />
        </ProtectedRoute>
    );
}
