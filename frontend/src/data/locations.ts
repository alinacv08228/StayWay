export interface AvailableLocation {
    country: string;
    cities: string[];
    countryImage: string;
}

export const availableLocations: AvailableLocation[] = [
    {
        country: "France",
        cities: ["Paris", "Nice", "Lyon"],
        countryImage: "/Paris.jpg",
    },
    {
        country: "Italy",
        cities: ["Rome", "Venice", "Milan"],
        countryImage: "/Rome.jpg",
    },
    {
        country: "Spain",
        cities: ["Barcelona", "Madrid", "Seville"],
        countryImage: "/Barcelona.jpg",
    },
    {
        country: "Portugal",
        cities: ["Lisbon", "Porto", "Faro"],
        countryImage: "/Portugal.jpg",
    },
    {
        country: "Greece",
        cities: ["Athens", "Santorini", "Mykonos"],
        countryImage: "/Greece.jpg",
    },
    {
        country: "Croatia",
        cities: ["Dubrovnik", "Split", "Zagreb"],
        countryImage: "/Croatia.jpg",
    },
    {
        country: "Turkey",
        cities: ["Istanbul", "Antalya", "Bodrum"],
        countryImage: "/Turkey.jpg",
    },
    {
        country: "Austria",
        cities: ["Vienna", "Salzburg", "Innsbruck"],
        countryImage: "/Austria.jpg",
    },
    {
        country: "Egypt",
        cities: ["Cairo", "Hurghada", "Sharm El Sheikh"],
        countryImage: "/Egypt.jpg",
    },
    {
        country: "Thailand",
        cities: ["Bangkok", "Phuket", "Krabi"],
        countryImage: "/Thailand.jpg",
    },
];
