export type Airport = {
    id: string;
    city: string;
    name: string;
    code: string;
    searchTerms: string[];
};

export const airports: Airport[] = [
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

    // Lisbon
    {
        id: "lisbon-lis",
        city: "Lisbon",
        name: "Lisbon Airport",
        code: "LIS",
        searchTerms: [
            "Lisbon Airport",
            "Humberto Delgado",
            "LIS",
            "Lisbon airport",
        ],
    },

    // Munich
    {
        id: "munich-muc",
        city: "Munich",
        name: "Munich Airport",
        code: "MUC",
        searchTerms: [
            "Munich Airport",
            "Franz Josef Strauss",
            "MUC",
            "Munich airport",
        ],
    },

    // Paris
    {
        id: "paris-cdg",
        city: "Paris",
        name: "Paris Charles de Gaulle Airport",
        code: "CDG",
        searchTerms: [
            "Charles de Gaulle",
            "Roissy",
            "CDG",
            "Paris airport",
        ],
    },
    {
        id: "paris-ory",
        city: "Paris",
        name: "Paris Orly Airport",
        code: "ORY",
        searchTerms: [
            "Orly",
            "ORY",
            "Paris airport",
        ],
    },
    {
        id: "paris-bva",
        city: "Paris",
        name: "Paris Beauvais Airport",
        code: "BVA",
        searchTerms: [
            "Beauvais",
            "BVA",
            "Paris airport",
        ],
    },
    {
        id: "paris-lbg",
        city: "Paris",
        name: "Paris Le Bourget Airport",
        code: "LBG",
        searchTerms: [
            "Le Bourget",
            "LBG",
            "Paris airport",
        ],
    },

    // Rome
    {
        id: "rome-fco",
        city: "Rome",
        name: "Rome Fiumicino Airport",
        code: "FCO",
        searchTerms: [
            "Fiumicino",
            "Leonardo da Vinci",
            "FCO",
            "Rome airport",
        ],
    },
    {
        id: "rome-cia",
        city: "Rome",
        name: "Rome Ciampino Airport",
        code: "CIA",
        searchTerms: [
            "Ciampino",
            "G.B. Pastine",
            "CIA",
            "Rome airport",
        ],
    },
];

export function getAirportsByCity(city: string): Airport[] {
    return airports.filter(
        (airport) =>
            airport.city.toLowerCase() === city.toLowerCase()
    );
}