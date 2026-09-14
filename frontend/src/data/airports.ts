export type Airport = {
    id: string;
    city: string;
    name: string;
    code: string;
    searchTerms: string[];
};

export const airports: Airport[] = [
    // =========================================================
    // FRANCE
    // =========================================================

    // Paris
    {
        id: "paris-cdg",
        city: "Paris",
        name: "Paris Charles de Gaulle Airport",
        code: "CDG",
        searchTerms: ["Charles de Gaulle", "Roissy", "CDG", "Paris airport"],
    },
    {
        id: "paris-ory",
        city: "Paris",
        name: "Paris Orly Airport",
        code: "ORY",
        searchTerms: ["Orly", "ORY", "Paris airport"],
    },
    {
        id: "paris-bva",
        city: "Paris",
        name: "Paris Beauvais Airport",
        code: "BVA",
        searchTerms: ["Beauvais", "BVA", "Paris airport"],
    },
    {
        id: "paris-lbg",
        city: "Paris",
        name: "Paris Le Bourget Airport",
        code: "LBG",
        searchTerms: ["Le Bourget", "LBG", "Paris airport"],
    },

    // Nice
    {
        id: "nice-nce",
        city: "Nice",
        name: "Nice Côte d'Azur Airport",
        code: "NCE",
        searchTerms: ["Nice Airport", "Côte d'Azur", "NCE", "Nice airport"],
    },

    // Lyon
    {
        id: "lyon-lys",
        city: "Lyon",
        name: "Lyon-Saint Exupéry Airport",
        code: "LYS",
        searchTerms: ["Lyon Saint Exupery", "Saint Exupéry", "LYS", "Lyon airport"],
    },
    {
        id: "lyon-lyn",
        city: "Lyon",
        name: "Lyon-Bron Airport",
        code: "LYN",
        searchTerms: ["Lyon Bron", "Bron Airport", "LYN", "Lyon airport"],
    },

    // Marseille
    {
        id: "marseille-mrs",
        city: "Marseille",
        name: "Marseille Provence Airport",
        code: "MRS",
        searchTerms: ["Marseille Provence", "MRS", "Marseille airport"],
    },

    // =========================================================
    // ITALY
    // =========================================================

    // Rome
    {
        id: "rome-fco",
        city: "Rome",
        name: "Rome Fiumicino Airport",
        code: "FCO",
        searchTerms: ["Fiumicino", "Leonardo da Vinci", "FCO", "Rome airport"],
    },
    {
        id: "rome-cia",
        city: "Rome",
        name: "Rome Ciampino Airport",
        code: "CIA",
        searchTerms: ["Ciampino", "G.B. Pastine", "CIA", "Rome airport"],
    },

    // Milan
    {
        id: "milan-mxp",
        city: "Milan",
        name: "Milan Malpensa Airport",
        code: "MXP",
        searchTerms: ["Malpensa", "MXP", "Milan airport"],
    },
    {
        id: "milan-lin",
        city: "Milan",
        name: "Milan Linate Airport",
        code: "LIN",
        searchTerms: ["Linate", "LIN", "Milan airport"],
    },
    {
        id: "milan-bgy",
        city: "Milan",
        name: "Milan Bergamo Airport",
        code: "BGY",
        searchTerms: ["Bergamo", "Orio al Serio", "BGY", "Milan airport"],
    },

    // Venice
    {
        id: "venice-vce",
        city: "Venice",
        name: "Venice Marco Polo Airport",
        code: "VCE",
        searchTerms: ["Marco Polo", "VCE", "Venice airport"],
    },
    {
        id: "venice-tsf",
        city: "Venice",
        name: "Treviso Airport",
        code: "TSF",
        searchTerms: ["Treviso", "TSF", "Venice Treviso", "Venice airport"],
    },

    // Florence
    {
        id: "florence-flr",
        city: "Florence",
        name: "Florence Airport",
        code: "FLR",
        searchTerms: ["Florence Airport", "Peretola", "Amerigo Vespucci", "FLR"],
    },
    {
        id: "florence-psa",
        city: "Florence",
        name: "Pisa International Airport",
        code: "PSA",
        searchTerms: ["Pisa Airport", "Galileo Galilei", "PSA", "Florence airport"],
    },

    // =========================================================
    // SPAIN
    // =========================================================

    // Madrid
    {
        id: "madrid-mad",
        city: "Madrid",
        name: "Adolfo Suárez Madrid-Barajas Airport",
        code: "MAD",
        searchTerms: ["Madrid Barajas", "Barajas", "MAD", "Madrid airport"],
    },

    // Barcelona
    {
        id: "barcelona-bcn",
        city: "Barcelona",
        name: "Barcelona-El Prat Airport",
        code: "BCN",
        searchTerms: [
            "Barcelona-El Prat",
            "El Prat",
            "Josep Tarradellas",
            "BCN",
            "Barcelona airport",
        ],
    },

    // Valencia
    {
        id: "valencia-vlc",
        city: "Valencia",
        name: "Valencia Airport",
        code: "VLC",
        searchTerms: ["Valencia Airport", "Manises", "VLC", "Valencia airport"],
    },

    // Seville
    {
        id: "seville-svq",
        city: "Seville",
        name: "Seville Airport",
        code: "SVQ",
        searchTerms: ["Seville Airport", "Sevilla Airport", "San Pablo", "SVQ"],
    },

    // =========================================================
    // GERMANY
    // =========================================================

    // Berlin
    {
        id: "berlin-ber",
        city: "Berlin",
        name: "Berlin Brandenburg Airport",
        code: "BER",
        searchTerms: ["Berlin Brandenburg", "Brandenburg", "BER", "Berlin airport"],
    },

    // Munich
    {
        id: "munich-muc",
        city: "Munich",
        name: "Munich Airport",
        code: "MUC",
        searchTerms: ["Munich Airport", "Franz Josef Strauss", "MUC", "Munich airport"],
    },

    // Hamburg
    {
        id: "hamburg-ham",
        city: "Hamburg",
        name: "Hamburg Airport",
        code: "HAM",
        searchTerms: ["Hamburg Airport", "Helmut Schmidt", "HAM", "Hamburg airport"],
    },

    // Frankfurt
    {
        id: "frankfurt-fra",
        city: "Frankfurt",
        name: "Frankfurt Airport",
        code: "FRA",
        searchTerms: ["Frankfurt Airport", "FRA", "Frankfurt airport"],
    },
    {
        id: "frankfurt-hhn",
        city: "Frankfurt",
        name: "Frankfurt-Hahn Airport",
        code: "HHN",
        searchTerms: ["Frankfurt Hahn", "Hahn Airport", "HHN", "Frankfurt airport"],
    },

    // =========================================================
    // UNITED KINGDOM
    // =========================================================

    // London
    {
        id: "london-lhr",
        city: "London",
        name: "London Heathrow Airport",
        code: "LHR",
        searchTerms: ["London Heathrow", "Heathrow", "LHR", "London airport"],
    },
    {
        id: "london-lgw",
        city: "London",
        name: "London Gatwick Airport",
        code: "LGW",
        searchTerms: ["London Gatwick", "Gatwick", "LGW", "London airport"],
    },
    {
        id: "london-stn",
        city: "London",
        name: "London Stansted Airport",
        code: "STN",
        searchTerms: ["London Stansted", "Stansted", "STN", "London airport"],
    },
    {
        id: "london-ltn",
        city: "London",
        name: "London Luton Airport",
        code: "LTN",
        searchTerms: ["London Luton", "Luton", "LTN", "London airport"],
    },
    {
        id: "london-lcy",
        city: "London",
        name: "London City Airport",
        code: "LCY",
        searchTerms: ["London City Airport", "London City", "LCY", "London airport"],
    },
    {
        id: "london-sen",
        city: "London",
        name: "London Southend Airport",
        code: "SEN",
        searchTerms: ["London Southend", "Southend", "SEN", "London airport"],
    },

    // Edinburgh
    {
        id: "edinburgh-edi",
        city: "Edinburgh",
        name: "Edinburgh Airport",
        code: "EDI",
        searchTerms: ["Edinburgh Airport", "EDI", "Edinburgh airport"],
    },

    // Manchester
    {
        id: "manchester-man",
        city: "Manchester",
        name: "Manchester Airport",
        code: "MAN",
        searchTerms: ["Manchester Airport", "MAN", "Manchester airport"],
    },

    // Liverpool
    {
        id: "liverpool-lpl",
        city: "Liverpool",
        name: "Liverpool John Lennon Airport",
        code: "LPL",
        searchTerms: ["Liverpool Airport", "John Lennon Airport", "LPL", "Liverpool airport"],
    },

    // =========================================================
    // GREECE
    // =========================================================

    // Athens
    {
        id: "athens-ath",
        city: "Athens",
        name: "Athens International Airport",
        code: "ATH",
        searchTerms: [
            "Athens International",
            "Eleftherios Venizelos",
            "ATH",
            "Athens airport",
        ],
    },

    // Thessaloniki
    {
        id: "thessaloniki-skg",
        city: "Thessaloniki",
        name: "Thessaloniki Airport Macedonia",
        code: "SKG",
        searchTerms: ["Thessaloniki Airport", "Makedonia", "Macedonia", "SKG"],
    },

    // Santorini
    {
        id: "santorini-jtr",
        city: "Santorini",
        name: "Santorini International Airport",
        code: "JTR",
        searchTerms: ["Santorini Airport", "Thira Airport", "JTR", "Santorini airport"],
    },

    // Mykonos
    {
        id: "mykonos-jmk",
        city: "Mykonos",
        name: "Mykonos International Airport",
        code: "JMK",
        searchTerms: ["Mykonos Airport", "JMK", "Mykonos airport"],
    },

    // =========================================================
    // PORTUGAL
    // =========================================================

    // Lisbon
    {
        id: "lisbon-lis",
        city: "Lisbon",
        name: "Lisbon Airport",
        code: "LIS",
        searchTerms: ["Lisbon Airport", "Humberto Delgado", "LIS", "Lisbon airport"],
    },

    // Porto
    {
        id: "porto-opo",
        city: "Porto",
        name: "Francisco Sá Carneiro Airport",
        code: "OPO",
        searchTerms: ["Porto Airport", "Francisco Sa Carneiro", "OPO", "Porto airport"],
    },

    // Faro
    {
        id: "faro-fao",
        city: "Faro",
        name: "Faro Airport",
        code: "FAO",
        searchTerms: ["Faro Airport", "Algarve Airport", "FAO", "Faro airport"],
    },

    // Braga - nearest major airport
    {
        id: "braga-opo",
        city: "Braga",
        name: "Francisco Sá Carneiro Airport",
        code: "OPO",
        searchTerms: ["Braga airport", "Porto Airport", "Francisco Sa Carneiro", "OPO"],
    },

    // =========================================================
    // AUSTRIA
    // =========================================================

    // Vienna
    {
        id: "vienna-vie",
        city: "Vienna",
        name: "Vienna International Airport",
        code: "VIE",
        searchTerms: ["Vienna Airport", "Schwechat", "VIE", "Vienna airport"],
    },

    // Salzburg
    {
        id: "salzburg-szg",
        city: "Salzburg",
        name: "Salzburg Airport",
        code: "SZG",
        searchTerms: ["Salzburg Airport", "W. A. Mozart", "SZG", "Salzburg airport"],
    },

    // Innsbruck
    {
        id: "innsbruck-inn",
        city: "Innsbruck",
        name: "Innsbruck Airport",
        code: "INN",
        searchTerms: ["Innsbruck Airport", "Kranebitten", "INN", "Innsbruck airport"],
    },

    // Graz
    {
        id: "graz-grz",
        city: "Graz",
        name: "Graz Airport",
        code: "GRZ",
        searchTerms: ["Graz Airport", "GRZ", "Graz airport"],
    },

    // =========================================================
    // NETHERLANDS
    // =========================================================

    // Amsterdam
    {
        id: "amsterdam-ams",
        city: "Amsterdam",
        name: "Amsterdam Airport Schiphol",
        code: "AMS",
        searchTerms: ["Amsterdam Schiphol", "Schiphol", "AMS", "Amsterdam airport"],
    },

    // Rotterdam
    {
        id: "rotterdam-rtm",
        city: "Rotterdam",
        name: "Rotterdam The Hague Airport",
        code: "RTM",
        searchTerms: [
            "Rotterdam Airport",
            "Rotterdam The Hague",
            "RTM",
            "Rotterdam airport",
        ],
    },

    // The Hague
    {
        id: "the-hague-rtm",
        city: "The Hague",
        name: "Rotterdam The Hague Airport",
        code: "RTM",
        searchTerms: [
            "The Hague Airport",
            "Rotterdam The Hague",
            "RTM",
            "Den Haag airport",
        ],
    },
    {
        id: "the-hague-ams",
        city: "The Hague",
        name: "Amsterdam Airport Schiphol",
        code: "AMS",
        searchTerms: ["The Hague airport", "Schiphol", "AMS", "Amsterdam Airport"],
    },

    // Utrecht
    {
        id: "utrecht-ams",
        city: "Utrecht",
        name: "Amsterdam Airport Schiphol",
        code: "AMS",
        searchTerms: ["Utrecht airport", "Schiphol", "AMS", "Amsterdam Airport"],
    },

    // =========================================================
    // CZECHIA
    // =========================================================

    // Prague
    {
        id: "prague-prg",
        city: "Prague",
        name: "Václav Havel Airport Prague",
        code: "PRG",
        searchTerms: ["Prague Airport", "Vaclav Havel", "Ruzyne", "PRG"],
    },

    // Brno
    {
        id: "brno-brq",
        city: "Brno",
        name: "Brno-Tuřany Airport",
        code: "BRQ",
        searchTerms: ["Brno Airport", "Turany", "BRQ", "Brno airport"],
    },

    // Ostrava
    {
        id: "ostrava-osr",
        city: "Ostrava",
        name: "Leoš Janáček Airport Ostrava",
        code: "OSR",
        searchTerms: ["Ostrava Airport", "Leos Janacek", "Mosnov", "OSR"],
    },

    // Karlovy Vary
    {
        id: "karlovy-vary-klv",
        city: "Karlovy Vary",
        name: "Karlovy Vary Airport",
        code: "KLV",
        searchTerms: ["Karlovy Vary Airport", "Carlsbad Airport", "KLV"],
    },
];

export function getAirportsByCity(city: string): Airport[] {
    return airports.filter(
        (airport) =>
            airport.city.toLowerCase().trim() === city.toLowerCase().trim()
    );
}