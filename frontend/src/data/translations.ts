export type TranslationKey =
    | "home"
    | "destinations"
    | "stays"
    | "myBookings"
    | "admin"
    | "findYourPerfectStay"
    | "search"
    | "whereAreYouGoing"
    | "perNight"
    | "rating"
    | "guests"
    | "checkIn"
    | "checkOut"
    | "property"
    | "room"
    | "user"
    | "total"
    | "status"
    | "viewProperty"
    | "cancelBooking"
    | "loading"
    | "noBookings"
    | "confirmed"
    | "cancelled"
    | "cancelQuestion"
    | "roomNotSpecified";

type TranslationDictionary = Record<
    TranslationKey,
    string
>;

const english: TranslationDictionary = {
    home: "Home",
    destinations: "Destinations",
    stays: "Stays",
    myBookings: "My Bookings",
    admin: "Admin Dashboard",
    findYourPerfectStay: "Find your perfect stay",
    search: "Search",
    whereAreYouGoing: "Where are you going?",
    perNight: "night",
    rating: "Rating",
    guests: "Guests",
    checkIn: "Check-in",
    checkOut: "Check-out",
    property: "Property:",
    room: "Room:",
    user: "User:",
    total: "Total:",
    status: "Status:",
    viewProperty: "View property",
    cancelBooking: "Cancel booking",
    loading: "Loading bookings...",
    noBookings: "You don't have any bookings yet.",
    confirmed: "confirmed",
    cancelled: "cancelled",
    cancelQuestion: "Are you sure you want to cancel this booking?",
    roomNotSpecified: "Room not specified",
};

const romanian: TranslationDictionary = {
    home: "Acasă",
    destinations: "Destinații",
    stays: "Cazări",
    myBookings: "Rezervările mele",
    admin: "Administrare",
    findYourPerfectStay: "Găsește cazarea perfectă",
    search: "Caută",
    whereAreYouGoing: "Unde mergi?",
    perNight: "noapte",
    rating: "Evaluare",
    guests: "Oaspeți",
    checkIn: "Check-in",
    checkOut: "Check-out",
    property: "Proprietate:",
    room: "Cameră:",
    user: "Utilizator:",
    total: "Total:",
    status: "Status:",
    viewProperty: "Vezi proprietatea",
    cancelBooking: "Anulează rezervarea",
    loading: "Se încarcă rezervările...",
    noBookings: "Nu ai încă nicio rezervare.",
    confirmed: "confirmată",
    cancelled: "anulată",
    cancelQuestion: "Sigur vrei să anulezi această rezervare?",
    roomNotSpecified: "Camera nu este specificată",
};

const russian: TranslationDictionary = {
    home: "Главная",
    destinations: "Направления",
    stays: "Отели",
    myBookings: "Мои бронирования",
    admin: "Администрирование",
    findYourPerfectStay:
        "Найдите идеальное место для проживания",
    search: "Поиск",
    whereAreYouGoing: "Куда вы едете?",
    perNight: "ночь",
    rating: "Рейтинг",
    guests: "Гости",
    checkIn: "Заезд",
    checkOut: "Выезд",
    property: "Объект:",
    room: "Номер:",
    user: "Пользователь:",
    total: "Итого:",
    status: "Статус:",
    viewProperty: "Посмотреть объект",
    cancelBooking: "Отменить бронирование",
    loading: "Загрузка бронирований...",
    noBookings: "У вас пока нет бронирований.",
    confirmed: "подтверждено",
    cancelled: "отменено",
    cancelQuestion:
        "Вы уверены, что хотите отменить это бронирование?",
    roomNotSpecified: "Номер не указан",
};

const ukrainian: TranslationDictionary = {
    home: "Головна",
    destinations: "Напрямки",
    stays: "Помешкання",
    myBookings: "Мої бронювання",
    admin: "Адміністрування",
    findYourPerfectStay:
        "Знайдіть ідеальне місце для проживання",
    search: "Пошук",
    whereAreYouGoing: "Куди ви їдете?",
    perNight: "ніч",
    rating: "Рейтинг",
    guests: "Гості",
    checkIn: "Заїзд",
    checkOut: "Виїзд",
    property: "Помешкання:",
    room: "Номер:",
    user: "Користувач:",
    total: "Всього:",
    status: "Статус:",
    viewProperty: "Переглянути помешкання",
    cancelBooking: "Скасувати бронювання",
    loading: "Завантаження бронювань...",
    noBookings: "У вас поки немає бронювань.",
    confirmed: "підтверджено",
    cancelled: "скасовано",
    cancelQuestion:
        "Ви впевнені, що хочете скасувати це бронювання?",
    roomNotSpecified: "Номер не вказано",
};

const french: TranslationDictionary = {
    home: "Accueil",
    destinations: "Destinations",
    stays: "Hébergements",
    myBookings: "Mes réservations",
    admin: "Administration",
    findYourPerfectStay:
        "Trouvez votre séjour idéal",
    search: "Rechercher",
    whereAreYouGoing: "Où allez-vous ?",
    perNight: "nuit",
    rating: "Évaluation",
    guests: "Voyageurs",
    checkIn: "Arrivée",
    checkOut: "Départ",
    property: "Hébergement :",
    room: "Chambre :",
    user: "Utilisateur :",
    total: "Total :",
    status: "Statut :",
    viewProperty: "Voir l'hébergement",
    cancelBooking: "Annuler la réservation",
    loading: "Chargement des réservations...",
    noBookings:
        "Vous n'avez encore aucune réservation.",
    confirmed: "confirmée",
    cancelled: "annulée",
    cancelQuestion:
        "Êtes-vous sûr de vouloir annuler cette réservation ?",
    roomNotSpecified: "Chambre non spécifiée",
};

const spanish: TranslationDictionary = {
    home: "Inicio",
    destinations: "Destinos",
    stays: "Alojamientos",
    myBookings: "Mis reservas",
    admin: "Administración",
    findYourPerfectStay:
        "Encuentra tu estancia perfecta",
    search: "Buscar",
    whereAreYouGoing: "¿Adónde vas?",
    perNight: "noche",
    rating: "Valoración",
    guests: "Huéspedes",
    checkIn: "Entrada",
    checkOut: "Salida",
    property: "Alojamiento:",
    room: "Habitación:",
    user: "Usuario:",
    total: "Total:",
    status: "Estado:",
    viewProperty: "Ver alojamiento",
    cancelBooking: "Cancelar reserva",
    loading: "Cargando reservas...",
    noBookings:
        "Todavía no tienes ninguna reserva.",
    confirmed: "confirmada",
    cancelled: "cancelada",
    cancelQuestion:
        "¿Estás seguro de que quieres cancelar esta reserva?",
    roomNotSpecified:
        "Habitación no especificada",
};

const german: TranslationDictionary = {
    home: "Startseite",
    destinations: "Reiseziele",
    stays: "Unterkünfte",
    myBookings: "Meine Buchungen",
    admin: "Administration",
    findYourPerfectStay:
        "Finde deinen perfekten Aufenthalt",
    search: "Suchen",
    whereAreYouGoing: "Wohin geht es?",
    perNight: "Nacht",
    rating: "Bewertung",
    guests: "Gäste",
    checkIn: "Check-in",
    checkOut: "Check-out",
    property: "Unterkunft:",
    room: "Zimmer:",
    user: "Benutzer:",
    total: "Gesamt:",
    status: "Status:",
    viewProperty: "Unterkunft ansehen",
    cancelBooking: "Buchung stornieren",
    loading: "Buchungen werden geladen...",
    noBookings:
        "Du hast noch keine Buchungen.",
    confirmed: "bestätigt",
    cancelled: "storniert",
    cancelQuestion:
        "Möchtest du diese Buchung wirklich stornieren?",
    roomNotSpecified: "Zimmer nicht angegeben",
};

const italian: TranslationDictionary = {
    home: "Home",
    destinations: "Destinazioni",
    stays: "Strutture",
    myBookings: "Le mie prenotazioni",
    admin: "Amministrazione",
    findYourPerfectStay:
        "Trova il soggiorno perfetto",
    search: "Cerca",
    whereAreYouGoing: "Dove stai andando?",
    perNight: "notte",
    rating: "Valutazione",
    guests: "Ospiti",
    checkIn: "Check-in",
    checkOut: "Check-out",
    property: "Struttura:",
    room: "Camera:",
    user: "Utente:",
    total: "Totale:",
    status: "Stato:",
    viewProperty: "Visualizza struttura",
    cancelBooking: "Annulla prenotazione",
    loading:
        "Caricamento delle prenotazioni...",
    noBookings:
        "Non hai ancora prenotazioni.",
    confirmed: "confermata",
    cancelled: "annullata",
    cancelQuestion:
        "Sei sicuro di voler annullare questa prenotazione?",
    roomNotSpecified:
        "Camera non specificata",
};

const portuguese: TranslationDictionary = {
    home: "Início",
    destinations: "Destinos",
    stays: "Alojamentos",
    myBookings: "As minhas reservas",
    admin: "Administração",
    findYourPerfectStay:
        "Encontre a estadia perfeita",
    search: "Pesquisar",
    whereAreYouGoing: "Para onde vai?",
    perNight: "noite",
    rating: "Avaliação",
    guests: "Hóspedes",
    checkIn: "Check-in",
    checkOut: "Check-out",
    property: "Alojamento:",
    room: "Quarto:",
    user: "Utilizador:",
    total: "Total:",
    status: "Estado:",
    viewProperty: "Ver alojamento",
    cancelBooking: "Cancelar reserva",
    loading: "A carregar reservas...",
    noBookings:
        "Ainda não tens nenhuma reserva.",
    confirmed: "confirmada",
    cancelled: "cancelada",
    cancelQuestion:
        "Tem a certeza de que pretende cancelar esta reserva?",
    roomNotSpecified:
        "Quarto não especificado",
};

const dutch: TranslationDictionary = {
    home: "Home",
    destinations: "Bestemmingen",
    stays: "Accommodaties",
    myBookings: "Mijn reserveringen",
    admin: "Beheer",
    findYourPerfectStay:
        "Vind jouw perfecte verblijf",
    search: "Zoeken",
    whereAreYouGoing: "Waar ga je naartoe?",
    perNight: "nacht",
    rating: "Beoordeling",
    guests: "Gasten",
    checkIn: "Inchecken",
    checkOut: "Uitchecken",
    property: "Accommodatie:",
    room: "Kamer:",
    user: "Gebruiker:",
    total: "Totaal:",
    status: "Status:",
    viewProperty: "Accommodatie bekijken",
    cancelBooking: "Reservering annuleren",
    loading: "Reserveringen laden...",
    noBookings:
        "Je hebt nog geen reserveringen.",
    confirmed: "bevestigd",
    cancelled: "geannuleerd",
    cancelQuestion:
        "Weet je zeker dat je deze reservering wilt annuleren?",
    roomNotSpecified:
        "Kamer niet gespecificeerd",
};

const norwegian: TranslationDictionary = {
    home: "Hjem",
    destinations: "Reisemål",
    stays: "Overnattingssteder",
    myBookings: "Mine bestillinger",
    admin: "Administrasjon",
    findYourPerfectStay:
        "Finn ditt perfekte opphold",
    search: "Søk",
    whereAreYouGoing: "Hvor skal du?",
    perNight: "natt",
    rating: "Vurdering",
    guests: "Gjester",
    checkIn: "Innsjekking",
    checkOut: "Utsjekking",
    property: "Overnattingssted:",
    room: "Rom:",
    user: "Bruker:",
    total: "Totalt:",
    status: "Status:",
    viewProperty: "Se overnattingssted",
    cancelBooking: "Avbestill bestilling",
    loading: "Laster inn bestillinger...",
    noBookings:
        "Du har ingen bestillinger ennå.",
    confirmed: "bekreftet",
    cancelled: "kansellert",
    cancelQuestion:
        "Er du sikker på at du vil avbestille denne bestillingen?",
    roomNotSpecified:
        "Rom ikke spesifisert",
};

const swedish: TranslationDictionary = {
    home: "Hem",
    destinations: "Resmål",
    stays: "Boenden",
    myBookings: "Mina bokningar",
    admin: "Administration",
    findYourPerfectStay:
        "Hitta ditt perfekta boende",
    search: "Sök",
    whereAreYouGoing: "Vart ska du?",
    perNight: "natt",
    rating: "Betyg",
    guests: "Gäster",
    checkIn: "Incheckning",
    checkOut: "Utcheckning",
    property: "Boende:",
    room: "Rum:",
    user: "Användare:",
    total: "Totalt:",
    status: "Status:",
    viewProperty: "Visa boende",
    cancelBooking: "Avboka",
    loading: "Laddar bokningar...",
    noBookings:
        "Du har inga bokningar ännu.",
    confirmed: "bekräftad",
    cancelled: "avbokad",
    cancelQuestion:
        "Är du säker på att du vill avboka den här bokningen?",
    roomNotSpecified:
        "Rum ej specificerat",
};

const danish: TranslationDictionary = {
    home: "Hjem",
    destinations: "Destinationer",
    stays: "Overnatningssteder",
    myBookings: "Mine bookinger",
    admin: "Administration",
    findYourPerfectStay:
        "Find dit perfekte ophold",
    search: "Søg",
    whereAreYouGoing: "Hvor skal du hen?",
    perNight: "nat",
    rating: "Bedømmelse",
    guests: "Gæster",
    checkIn: "Indtjekning",
    checkOut: "Udtjekning",
    property: "Overnatningssted:",
    room: "Værelse:",
    user: "Bruger:",
    total: "I alt:",
    status: "Status:",
    viewProperty: "Se overnatningssted",
    cancelBooking: "Annuller booking",
    loading: "Indlæser bookinger...",
    noBookings:
        "Du har ingen bookinger endnu.",
    confirmed: "bekræftet",
    cancelled: "annulleret",
    cancelQuestion:
        "Er du sikker på, at du vil annullere denne booking?",
    roomNotSpecified:
        "Værelse ikke angivet",
};

const finnish: TranslationDictionary = {
    home: "Etusivu",
    destinations: "Kohteet",
    stays: "Majoitukset",
    myBookings: "Varaukseni",
    admin: "Hallinta",
    findYourPerfectStay:
        "Löydä täydellinen majoitus",
    search: "Hae",
    whereAreYouGoing: "Minne olet menossa?",
    perNight: "yö",
    rating: "Arvio",
    guests: "Vieraat",
    checkIn: "Sisäänkirjautuminen",
    checkOut: "Uloskirjautuminen",
    property: "Majoitus:",
    room: "Huone:",
    user: "Käyttäjä:",
    total: "Yhteensä:",
    status: "Tila:",
    viewProperty: "Näytä majoitus",
    cancelBooking: "Peruuta varaus",
    loading: "Ladataan varauksia...",
    noBookings:
        "Sinulla ei ole vielä varauksia.",
    confirmed: "vahvistettu",
    cancelled: "peruutettu",
    cancelQuestion:
        "Haluatko varmasti peruuttaa tämän varauksen?",
    roomNotSpecified:
        "Huonetta ei määritetty",
};

const polish: TranslationDictionary = {
    home: "Strona główna",
    destinations: "Kierunki",
    stays: "Noclegi",
    myBookings: "Moje rezerwacje",
    admin: "Administracja",
    findYourPerfectStay:
        "Znajdź idealny pobyt",
    search: "Szukaj",
    whereAreYouGoing: "Dokąd się wybierasz?",
    perNight: "noc",
    rating: "Ocena",
    guests: "Goście",
    checkIn: "Zameldowanie",
    checkOut: "Wymeldowanie",
    property: "Obiekt:",
    room: "Pokój:",
    user: "Użytkownik:",
    total: "Suma:",
    status: "Status:",
    viewProperty: "Zobacz obiekt",
    cancelBooking: "Anuluj rezerwację",
    loading: "Ładowanie rezerwacji...",
    noBookings:
        "Nie masz jeszcze żadnych rezerwacji.",
    confirmed: "potwierdzona",
    cancelled: "anulowana",
    cancelQuestion:
        "Czy na pewno chcesz anulować tę rezerwację?",
    roomNotSpecified:
        "Nie określono pokoju",
};

const czech: TranslationDictionary = {
    home: "Domů",
    destinations: "Destinace",
    stays: "Ubytování",
    myBookings: "Moje rezervace",
    admin: "Administrace",
    findYourPerfectStay:
        "Najděte své perfektní ubytování",
    search: "Hledat",
    whereAreYouGoing: "Kam jedete?",
    perNight: "noc",
    rating: "Hodnocení",
    guests: "Hosté",
    checkIn: "Příjezd",
    checkOut: "Odjezd",
    property: "Ubytování:",
    room: "Pokoj:",
    user: "Uživatel:",
    total: "Celkem:",
    status: "Stav:",
    viewProperty: "Zobrazit ubytování",
    cancelBooking: "Zrušit rezervaci",
    loading: "Načítání rezervací...",
    noBookings:
        "Zatím nemáte žádné rezervace.",
    confirmed: "potvrzeno",
    cancelled: "zrušeno",
    cancelQuestion:
        "Opravdu chcete tuto rezervaci zrušit?",
    roomNotSpecified:
        "Pokoj není specifikován",
};

const slovak: TranslationDictionary = {
    home: "Domov",
    destinations: "Destinácie",
    stays: "Ubytovania",
    myBookings: "Moje rezervácie",
    admin: "Administrácia",
    findYourPerfectStay:
        "Nájdite svoje dokonalé ubytovanie",
    search: "Hľadať",
    whereAreYouGoing: "Kam idete?",
    perNight: "noc",
    rating: "Hodnotenie",
    guests: "Hostia",
    checkIn: "Príchod",
    checkOut: "Odchod",
    property: "Ubytovanie:",
    room: "Izba:",
    user: "Používateľ:",
    total: "Celkom:",
    status: "Stav:",
    viewProperty: "Zobraziť ubytovanie",
    cancelBooking: "Zrušiť rezerváciu",
    loading: "Načítavajú sa rezervácie...",
    noBookings:
        "Zatiaľ nemáte žiadne rezervácie.",
    confirmed: "potvrdené",
    cancelled: "zrušená",
    cancelQuestion:
        "Naozaj chcete zrušiť túto rezerváciu?",
    roomNotSpecified:
        "Izba nie je špecifikovaná",
};

const hungarian: TranslationDictionary = {
    home: "Kezdőlap",
    destinations: "Úti célok",
    stays: "Szállások",
    myBookings: "Foglalásaim",
    admin: "Adminisztráció",
    findYourPerfectStay:
        "Találd meg a tökéletes szállást",
    search: "Keresés",
    whereAreYouGoing: "Hová utazol?",
    perNight: "éjszaka",
    rating: "Értékelés",
    guests: "Vendégek",
    checkIn: "Bejelentkezés",
    checkOut: "Kijelentkezés",
    property: "Szállás:",
    room: "Szoba:",
    user: "Felhasználó:",
    total: "Összesen:",
    status: "Állapot:",
    viewProperty: "Szállás megtekintése",
    cancelBooking: "Foglalás törlése",
    loading: "Foglalások betöltése...",
    noBookings:
        "Még nincs foglalásod.",
    confirmed: "megerősítve",
    cancelled: "lemondva",
    cancelQuestion:
        "Biztosan le szeretnéd mondani ezt a foglalást?",
    roomNotSpecified:
        "Nincs megadva szoba",
};

const bulgarian: TranslationDictionary = {
    home: "Начало",
    destinations: "Дестинации",
    stays: "Настаняване",
    myBookings: "Моите резервации",
    admin: "Администрация",
    findYourPerfectStay:
        "Намерете идеалното място за престой",
    search: "Търсене",
    whereAreYouGoing: "Къде отивате?",
    perNight: "нощувка",
    rating: "Оценка",
    guests: "Гости",
    checkIn: "Настаняване",
    checkOut: "Напускане",
    property: "Обект:",
    room: "Стая:",
    user: "Потребител:",
    total: "Общо:",
    status: "Статус:",
    viewProperty: "Вижте обекта",
    cancelBooking: "Отказ на резервацията",
    loading: "Зареждане на резервациите...",
    noBookings:
        "Все още нямате резервации.",
    confirmed: "потвърдена",
    cancelled: "отменена",
    cancelQuestion:
        "Сигурни ли сте, че искате да отмените тази резервация?",
    roomNotSpecified:
        "Стаята не е посочена",
};

const croatian: TranslationDictionary = {
    home: "Početna",
    destinations: "Odredišta",
    stays: "Smještaji",
    myBookings: "Moje rezervacije",
    admin: "Administracija",
    findYourPerfectStay:
        "Pronađite savršen smještaj",
    search: "Pretraži",
    whereAreYouGoing: "Kamo idete?",
    perNight: "noć",
    rating: "Ocjena",
    guests: "Gosti",
    checkIn: "Prijava",
    checkOut: "Odjava",
    property: "Smještaj:",
    room: "Soba:",
    user: "Korisnik:",
    total: "Ukupno:",
    status: "Status:",
    viewProperty: "Pogledaj smještaj",
    cancelBooking: "Otkaži rezervaciju",
    loading: "Učitavanje rezervacija...",
    noBookings:
        "Još nemate rezervacija.",
    confirmed: "potvrđena",
    cancelled: "otkazana",
    cancelQuestion:
        "Jeste li sigurni da želite otkazati ovu rezervaciju?",
    roomNotSpecified:
        "Soba nije navedena",
};

const slovenian: TranslationDictionary = {
    home: "Domov",
    destinations: "Destinacije",
    stays: "Nastanitve",
    myBookings: "Moje rezervacije",
    admin: "Administracija",
    findYourPerfectStay:
        "Poiščite popolno nastanitev",
    search: "Išči",
    whereAreYouGoing: "Kam greste?",
    perNight: "noč",
    rating: "Ocena",
    guests: "Gostje",
    checkIn: "Prijava",
    checkOut: "Odjava",
    property: "Nastanitev:",
    room: "Soba:",
    user: "Uporabnik:",
    total: "Skupaj:",
    status: "Status:",
    viewProperty: "Ogled nastanitve",
    cancelBooking: "Prekliči rezervacijo",
    loading: "Nalaganje rezervacij...",
    noBookings:
        "Še nimate nobene rezervacije.",
    confirmed: "potrjeno",
    cancelled: "preklicana",
    cancelQuestion:
        "Ali ste prepričani, da želite preklicati to rezervacijo?",
    roomNotSpecified:
        "Soba ni določena",
};

const serbian: TranslationDictionary = {
    home: "Početna",
    destinations: "Destinacije",
    stays: "Smeštaji",
    myBookings: "Moje rezervacije",
    admin: "Administracija",
    findYourPerfectStay:
        "Pronađite savršen smeštaj",
    search: "Pretraži",
    whereAreYouGoing: "Gde idete?",
    perNight: "noć",
    rating: "Ocena",
    guests: "Gosti",
    checkIn: "Prijava",
    checkOut: "Odjava",
    property: "Smeštaj:",
    room: "Soba:",
    user: "Korisnik:",
    total: "Ukupno:",
    status: "Status:",
    viewProperty: "Pogledaj smeštaj",
    cancelBooking: "Otkaži rezervaciju",
    loading: "Učitavanje rezervacija...",
    noBookings:
        "Još nemate rezervacija.",
    confirmed: "potvrđena",
    cancelled: "otkazana",
    cancelQuestion:
        "Da li ste sigurni da želite da otkažete ovu rezervaciju?",
    roomNotSpecified:
        "Soba nije navedena",
};

const bosnian: TranslationDictionary = {
    home: "Početna",
    destinations: "Destinacije",
    stays: "Smještaji",
    myBookings: "Moje rezervacije",
    admin: "Administracija",
    findYourPerfectStay:
        "Pronađite savršen smještaj",
    search: "Pretraži",
    whereAreYouGoing: "Kamo idete?",
    perNight: "noć",
    rating: "Ocjena",
    guests: "Gosti",
    checkIn: "Prijava",
    checkOut: "Odjava",
    property: "Smještaj:",
    room: "Soba:",
    user: "Korisnik:",
    total: "Ukupno:",
    status: "Status:",
    viewProperty: "Pogledaj smještaj",
    cancelBooking: "Otkaži rezervaciju",
    loading: "Učitavanje rezervacija...",
    noBookings:
        "Još nemate rezervacija.",
    confirmed: "potvrđena",
    cancelled: "otkazana",
    cancelQuestion:
        "Jeste li sigurni da želite otkazati ovu rezervaciju?",
    roomNotSpecified:
        "Soba nije navedena",
};

const greek: TranslationDictionary = {
    home: "Αρχική",
    destinations: "Προορισμοί",
    stays: "Καταλύματα",
    myBookings: "Οι κρατήσεις μου",
    admin: "Διαχείριση",
    findYourPerfectStay:
        "Βρείτε την ιδανική διαμονή",
    search: "Αναζήτηση",
    whereAreYouGoing: "Πού πηγαίνετε;",
    perNight: "νύχτα",
    rating: "Αξιολόγηση",
    guests: "Επισκέπτες",
    checkIn: "Άφιξη",
    checkOut: "Αναχώρηση",
    property: "Κατάλυμα:",
    room: "Δωμάτιο:",
    user: "Χρήστης:",
    total: "Σύνολο:",
    status: "Κατάσταση:",
    viewProperty: "Προβολή καταλύματος",
    cancelBooking: "Ακύρωση κράτησης",
    loading: "Φόρτωση κρατήσεων...",
    noBookings:
        "Δεν έχετε ακόμη κρατήσεις.",
    confirmed: "επιβεβαιωμένη",
    cancelled: "ακυρωμένη",
    cancelQuestion:
        "Είστε σίγουροι ότι θέλετε να ακυρώσετε αυτή την κράτηση;",
    roomNotSpecified:
        "Δεν έχει καθοριστεί δωμάτιο",
};

const turkish: TranslationDictionary = {
    home: "Ana Sayfa",
    destinations: "Destinasyonlar",
    stays: "Konaklama",
    myBookings: "Rezervasyonlarım",
    admin: "Yönetim",
    findYourPerfectStay:
        "Mükemmel konaklamanızı bulun",
    search: "Ara",
    whereAreYouGoing: "Nereye gidiyorsunuz?",
    perNight: "gece",
    rating: "Puan",
    guests: "Misafirler",
    checkIn: "Giriş",
    checkOut: "Çıkış",
    property: "Tesis:",
    room: "Oda:",
    user: "Kullanıcı:",
    total: "Toplam:",
    status: "Durum:",
    viewProperty: "Tesisi görüntüle",
    cancelBooking: "Rezervasyonu iptal et",
    loading: "Rezervasyonlar yükleniyor...",
    noBookings:
        "Henüz rezervasyonunuz yok.",
    confirmed: "onaylandı",
    cancelled: "iptal edildi",
    cancelQuestion:
        "Bu rezervasyonu iptal etmek istediğinizden emin misiniz?",
    roomNotSpecified:
        "Oda belirtilmemiş",
};

const arabic: TranslationDictionary = {
    home: "الرئيسية",
    destinations: "الوجهات",
    stays: "أماكن الإقامة",
    myBookings: "حجوزاتي",
    admin: "الإدارة",
    findYourPerfectStay:
        "اعثر على إقامتك المثالية",
    search: "بحث",
    whereAreYouGoing: "إلى أين تذهب؟",
    perNight: "ليلة",
    rating: "التقييم",
    guests: "الضيوف",
    checkIn: "تسجيل الوصول",
    checkOut: "تسجيل المغادرة",
    property: "مكان الإقامة:",
    room: "الغرفة:",
    user: "المستخدم:",
    total: "المجموع:",
    status: "الحالة:",
    viewProperty: "عرض مكان الإقامة",
    cancelBooking: "إلغاء الحجز",
    loading: "جارٍ تحميل الحجوزات...",
    noBookings:
        "ليس لديك أي حجوزات حتى الآن.",
    confirmed: "مؤكد",
    cancelled: "ملغى",
    cancelQuestion:
        "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟",
    roomNotSpecified:
        "لم يتم تحديد الغرفة",
};

const hebrew: TranslationDictionary = {
    home: "דף הבית",
    destinations: "יעדים",
    stays: "מקומות לינה",
    myBookings: "ההזמנות שלי",
    admin: "ניהול",
    findYourPerfectStay:
        "מצאו את מקום האירוח המושלם",
    search: "חיפוש",
    whereAreYouGoing: "לאן אתם נוסעים?",
    perNight: "לילה",
    rating: "דירוג",
    guests: "אורחים",
    checkIn: "צ'ק-אין",
    checkOut: "צ'ק-אאוט",
    property: "מקום האירוח:",
    room: "חדר:",
    user: "משתמש:",
    total: "סה״כ:",
    status: "סטטוס:",
    viewProperty: "הצגת מקום האירוח",
    cancelBooking: "ביטול ההזמנה",
    loading: "טוען הזמנות...",
    noBookings:
        "עדיין אין לך הזמנות.",
    confirmed: "מאושרת",
    cancelled: "בוטלה",
    cancelQuestion:
        "האם אתה בטוח שברצונך לבטל את ההזמנה הזו?",
    roomNotSpecified:
        "החדר לא צוין",
};

const hindi: TranslationDictionary = {
    home: "होम",
    destinations: "गंतव्य",
    stays: "ठहरने की जगहें",
    myBookings: "मेरी बुकिंग",
    admin: "प्रशासन",
    findYourPerfectStay:
        "अपना पसंदीदा ठहरने का स्थान खोजें",
    search: "खोजें",
    whereAreYouGoing: "आप कहाँ जा रहे हैं?",
    perNight: "रात",
    rating: "रेटिंग",
    guests: "मेहमान",
    checkIn: "चेक-इन",
    checkOut: "चेक-आउट",
    property: "प्रॉपर्टी:",
    room: "कमरा:",
    user: "उपयोगकर्ता:",
    total: "कुल:",
    status: "स्थिति:",
    viewProperty: "प्रॉपर्टी देखें",
    cancelBooking: "बुकिंग रद्द करें",
    loading: "बुकिंग लोड हो रही हैं...",
    noBookings:
        "आपकी अभी कोई बुकिंग नहीं है।",
    confirmed: "पुष्ट",
    cancelled: "रद्द",
    cancelQuestion:
        "क्या आप वाकई इस बुकिंग को रद्द करना चाहते हैं?",
    roomNotSpecified:
        "कमरा निर्दिष्ट नहीं है",
};

const thai: TranslationDictionary = {
    home: "หน้าแรก",
    destinations: "จุดหมายปลายทาง",
    stays: "ที่พัก",
    myBookings: "การจองของฉัน",
    admin: "ผู้ดูแลระบบ",
    findYourPerfectStay:
        "ค้นหาที่พักที่สมบูรณ์แบบสำหรับคุณ",
    search: "ค้นหา",
    whereAreYouGoing: "คุณจะไปที่ไหน?",
    perNight: "คืน",
    rating: "คะแนน",
    guests: "ผู้เข้าพัก",
    checkIn: "เช็กอิน",
    checkOut: "เช็กเอาต์",
    property: "ที่พัก:",
    room: "ห้อง:",
    user: "ผู้ใช้:",
    total: "ทั้งหมด:",
    status: "สถานะ:",
    viewProperty: "ดูที่พัก",
    cancelBooking: "ยกเลิกการจอง",
    loading: "กำลังโหลดการจอง...",
    noBookings:
        "คุณยังไม่มีการจอง",
    confirmed: "ยืนยันแล้ว",
    cancelled: "ยกเลิกแล้ว",
    cancelQuestion:
        "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?",
    roomNotSpecified:
        "ไม่ได้ระบุห้อง",
};

const indonesian: TranslationDictionary = {
    home: "Beranda",
    destinations: "Destinasi",
    stays: "Akomodasi",
    myBookings: "Pemesanan Saya",
    admin: "Administrasi",
    findYourPerfectStay:
        "Temukan tempat menginap yang sempurna",
    search: "Cari",
    whereAreYouGoing: "Mau pergi ke mana?",
    perNight: "malam",
    rating: "Penilaian",
    guests: "Tamu",
    checkIn: "Check-in",
    checkOut: "Check-out",
    property: "Properti:",
    room: "Kamar:",
    user: "Pengguna:",
    total: "Total:",
    status: "Status:",
    viewProperty: "Lihat properti",
    cancelBooking: "Batalkan pemesanan",
    loading: "Memuat pemesanan...",
    noBookings:
        "Anda belum memiliki pemesanan.",
    confirmed: "dikonfirmasi",
    cancelled: "dibatalkan",
    cancelQuestion:
        "Apakah Anda yakin ingin membatalkan pemesanan ini?",
    roomNotSpecified:
        "Kamar belum ditentukan",
};

const vietnamese: TranslationDictionary = {
    home: "Trang chủ",
    destinations: "Điểm đến",
    stays: "Chỗ ở",
    myBookings: "Đặt chỗ của tôi",
    admin: "Quản trị",
    findYourPerfectStay:
        "Tìm nơi lưu trú hoàn hảo",
    search: "Tìm kiếm",
    whereAreYouGoing: "Bạn đang đi đâu?",
    perNight: "đêm",
    rating: "Đánh giá",
    guests: "Khách",
    checkIn: "Nhận phòng",
    checkOut: "Trả phòng",
    property: "Chỗ ở:",
    room: "Phòng:",
    user: "Người dùng:",
    total: "Tổng:",
    status: "Trạng thái:",
    viewProperty: "Xem chỗ ở",
    cancelBooking: "Hủy đặt chỗ",
    loading: "Đang tải đặt chỗ...",
    noBookings:
        "Bạn chưa có đặt chỗ nào.",
    confirmed: "đã xác nhận",
    cancelled: "đã hủy",
    cancelQuestion:
        "Bạn có chắc chắn muốn hủy đặt chỗ này không?",
    roomNotSpecified:
        "Chưa chỉ định phòng",
};

const korean: TranslationDictionary = {
    home: "홈",
    destinations: "여행지",
    stays: "숙소",
    myBookings: "내 예약",
    admin: "관리",
    findYourPerfectStay:
        "완벽한 숙소를 찾아보세요",
    search: "검색",
    whereAreYouGoing: "어디로 가시나요?",
    perNight: "박",
    rating: "평점",
    guests: "게스트",
    checkIn: "체크인",
    checkOut: "체크아웃",
    property: "숙소:",
    room: "객실:",
    user: "사용자:",
    total: "총액:",
    status: "상태:",
    viewProperty: "숙소 보기",
    cancelBooking: "예약 취소",
    loading: "예약을 불러오는 중...",
    noBookings:
        "아직 예약이 없습니다.",
    confirmed: "확정됨",
    cancelled: "취소됨",
    cancelQuestion:
        "이 예약을 취소하시겠습니까?",
    roomNotSpecified:
        "객실이 지정되지 않았습니다",
};

const japanese: TranslationDictionary = {
    home: "ホーム",
    destinations: "目的地",
    stays: "宿泊施設",
    myBookings: "予約一覧",
    admin: "管理",
    findYourPerfectStay:
        "ぴったりの宿泊先を見つけよう",
    search: "検索",
    whereAreYouGoing: "どこへ行きますか？",
    perNight: "泊",
    rating: "評価",
    guests: "ゲスト",
    checkIn: "チェックイン",
    checkOut: "チェックアウト",
    property: "宿泊施設:",
    room: "部屋:",
    user: "ユーザー:",
    total: "合計:",
    status: "ステータス:",
    viewProperty: "宿泊施設を見る",
    cancelBooking: "予約をキャンセル",
    loading: "予約を読み込んでいます...",
    noBookings:
        "まだ予約はありません。",
    confirmed: "確定済み",
    cancelled: "キャンセル済み",
    cancelQuestion:
        "この予約をキャンセルしてもよろしいですか？",
    roomNotSpecified:
        "部屋が指定されていません",
};

const chinese: TranslationDictionary = {
    home: "首页",
    destinations: "目的地",
    stays: "住宿",
    myBookings: "我的预订",
    admin: "管理",
    findYourPerfectStay:
        "找到最适合您的住宿",
    search: "搜索",
    whereAreYouGoing: "您要去哪里？",
    perNight: "晚",
    rating: "评分",
    guests: "客人",
    checkIn: "入住",
    checkOut: "退房",
    property: "住宿:",
    room: "房间:",
    user: "用户:",
    total: "总计:",
    status: "状态:",
    viewProperty: "查看住宿",
    cancelBooking: "取消预订",
    loading: "正在加载预订...",
    noBookings:
        "您还没有任何预订。",
    confirmed: "已确认",
    cancelled: "已取消",
    cancelQuestion:
        "您确定要取消此预订吗？",
    roomNotSpecified:
        "未指定房间",
};

const traditionalChinese: TranslationDictionary = {
    home: "首頁",
    destinations: "目的地",
    stays: "住宿",
    myBookings: "我的預訂",
    admin: "管理",
    findYourPerfectStay:
        "找到最適合您的住宿",
    search: "搜尋",
    whereAreYouGoing: "您要去哪裡？",
    perNight: "晚",
    rating: "評分",
    guests: "房客",
    checkIn: "入住",
    checkOut: "退房",
    property: "住宿:",
    room: "房間:",
    user: "使用者:",
    total: "總計:",
    status: "狀態:",
    viewProperty: "查看住宿",
    cancelBooking: "取消預訂",
    loading: "正在載入預訂...",
    noBookings:
        "您目前沒有任何預訂。",
    confirmed: "已確認",
    cancelled: "已取消",
    cancelQuestion:
        "您確定要取消此預訂嗎？",
    roomNotSpecified:
        "未指定房間",
};

const catalan: TranslationDictionary = {
    home: "Inici",
    destinations: "Destinacions",
    stays: "Allotjaments",
    myBookings: "Les meves reserves",
    admin: "Administració",
    findYourPerfectStay:
        "Troba l'estada perfecta",
    search: "Cerca",
    whereAreYouGoing: "On vas?",
    perNight: "nit",
    rating: "Valoració",
    guests: "Hostes",
    checkIn: "Entrada",
    checkOut: "Sortida",
    property: "Allotjament:",
    room: "Habitació:",
    user: "Usuari:",
    total: "Total:",
    status: "Estat:",
    viewProperty: "Veure allotjament",
    cancelBooking: "Cancel·lar reserva",
    loading: "Carregant reserves...",
    noBookings:
        "Encara no tens cap reserva.",
    confirmed: "confirmada",
    cancelled: "cancel·lada",
    cancelQuestion:
        "Estàs segur que vols cancel·lar aquesta reserva?",
    roomNotSpecified:
        "Habitació no especificada",
};

const estonian: TranslationDictionary = {
    home: "Avaleht",
    destinations: "Sihtkohad",
    stays: "Majutused",
    myBookings: "Minu broneeringud",
    admin: "Haldus",
    findYourPerfectStay:
        "Leia endale ideaalne majutus",
    search: "Otsi",
    whereAreYouGoing: "Kuhu te lähete?",
    perNight: "öö",
    rating: "Hinnang",
    guests: "Külalised",
    checkIn: "Sisseregistreerimine",
    checkOut: "Väljaregistreerimine",
    property: "Majutus:",
    room: "Tuba:",
    user: "Kasutaja:",
    total: "Kokku:",
    status: "Olek:",
    viewProperty: "Vaata majutust",
    cancelBooking: "Tühista broneering",
    loading: "Broneeringute laadimine...",
    noBookings:
        "Sul pole veel broneeringuid.",
    confirmed: "kinnitatud",
    cancelled: "tühistatud",
    cancelQuestion:
        "Kas olete kindel, et soovite selle broneeringu tühistada?",
    roomNotSpecified:
        "Tuba pole määratud",
};

const latvian: TranslationDictionary = {
    home: "Sākums",
    destinations: "Galamērķi",
    stays: "Naktsmītnes",
    myBookings: "Manas rezervācijas",
    admin: "Administrēšana",
    findYourPerfectStay:
        "Atrodi sev ideālu naktsmītni",
    search: "Meklēt",
    whereAreYouGoing: "Kur jūs dodaties?",
    perNight: "nakts",
    rating: "Vērtējums",
    guests: "Viesi",
    checkIn: "Ierašanās",
    checkOut: "Izrakstīšanās",
    property: "Naktsmītne:",
    room: "Numurs:",
    user: "Lietotājs:",
    total: "Kopā:",
    status: "Statuss:",
    viewProperty: "Skatīt naktsmītni",
    cancelBooking: "Atcelt rezervāciju",
    loading: "Ielādē rezervācijas...",
    noBookings:
        "Jums vēl nav rezervāciju.",
    confirmed: "apstiprināta",
    cancelled: "atcelta",
    cancelQuestion:
        "Vai tiešām vēlaties atcelt šo rezervāciju?",
    roomNotSpecified:
        "Numurs nav norādīts",
};

const lithuanian: TranslationDictionary = {
    home: "Pagrindinis",
    destinations: "Kelionės kryptys",
    stays: "Apgyvendinimas",
    myBookings: "Mano rezervacijos",
    admin: "Administravimas",
    findYourPerfectStay:
        "Raskite tobulą vietą apsistoti",
    search: "Ieškoti",
    whereAreYouGoing: "Kur vykstate?",
    perNight: "naktis",
    rating: "Įvertinimas",
    guests: "Svečiai",
    checkIn: "Atvykimas",
    checkOut: "Išvykimas",
    property: "Apgyvendinimo vieta:",
    room: "Kambarys:",
    user: "Naudotojas:",
    total: "Iš viso:",
    status: "Būsena:",
    viewProperty: "Peržiūrėti apgyvendinimą",
    cancelBooking: "Atšaukti rezervaciją",
    loading: "Įkeliamos rezervacijos...",
    noBookings:
        "Dar neturite jokių rezervacijų.",
    confirmed: "patvirtinta",
    cancelled: "atšaukta",
    cancelQuestion:
        "Ar tikrai norite atšaukti šią rezervaciją?",
    roomNotSpecified:
        "Kambarys nenurodytas",
};

const translations: Record<
    string,
    TranslationDictionary
> = {
    English: english,
    Română: romanian,
    Русский: russian,
    Українська: ukrainian,
    Français: french,
    Español: spanish,
    Deutsch: german,
    Italiano: italian,
    Português: portuguese,
    Nederlands: dutch,
    Norsk: norwegian,
    Svenska: swedish,
    Dansk: danish,
    Suomi: finnish,
    Polski: polish,
    Čeština: czech,
    Slovenčina: slovak,
    Magyar: hungarian,
    Български: bulgarian,
    Hrvatski: croatian,
    Slovenščina: slovenian,
    Srpski: serbian,
    Bosanski: bosnian,
    Ελληνικά: greek,
    Türkçe: turkish,
    العربية: arabic,
    עברית: hebrew,
    हिन्दी: hindi,
    ไทย: thai,
    "Bahasa Indonesia": indonesian,
    "Tiếng Việt": vietnamese,
    한국어: korean,
    日本語: japanese,
    中文: chinese,
    繁體中文: traditionalChinese,
    Català: catalan,
    Eesti: estonian,
    Latviešu: latvian,
    Lietuvių: lithuanian,
};

export function getTranslation(
    language: string,
    key: TranslationKey
): string {
    const languageName =
        language.split("|")[0];

    const dictionary =
        translations[languageName] ??
        translations.English;

    return (
        dictionary[key] ??
        translations.English[key]
    );
}