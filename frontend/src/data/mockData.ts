import {
    Booking,
    Country,
    Destination,
    Property,
    Review,
    Room,
    User,
} from "../types/types";

export const users: User[] = [
    {
        id: 1,
        name: "Alina",
        email: "alina@example.com",
        role: "user",
    },
    {
        id: 2,
        name: "Admin",
        email: "admin@stayway.com",
        role: "admin",
    },
];

export const countries: Country[] = [
    {
        id: 1,
        name: "France",
        image: "/Paris.jpg",
    },
    {
        id: 2,
        name: "Italy",
        image: "/Rome.jpg",
    },
    {
        id: 3,
        name: "Spain",
        image: "/Barcelona.jpg",
    },
];

export const destinations: Destination[] = [
    {
        id: 1,
        name: "Paris",
        country: "France",
        image: "/Paris.jpg",
        countryImage: "/Paris.jpg",
    },
    {
        id: 2,
        name: "Rome",
        country: "Italy",
        image: "/Rome.jpg",
        countryImage: "/Rome.jpg",
    },
    {
        id: 3,
        name: "Barcelona",
        country: "Spain",
        image: "/Barcelona.jpg",
        countryImage: "/Barcelona.jpg",
    },
];


export const properties: Property[] = [
    // ==================================================
    // PARIS
    // ==================================================

    {
        id: 1,
        name: "Hôtel Balzac",
        destinationId: 1,
        address: "6 Rue Balzac, 75008 Paris, France",
        rating: 4.5,
        pricePerNight: 280,
        image: "/Hotel-Balzac-1.jpg",
    },

    {
        id: 2,
        name: "Hyatt Paris Madeleine",
        destinationId: 1,
        address: "24 Boulevard Malesherbes, 75008 Paris, France",
        rating: 4.5,
        pricePerNight: 320,
        image: "/Madeleine-1.jpg",
    },

    {
        id: 3,
        name: "Pullman Paris Tour Eiffel",
        destinationId: 1,
        address: "18 Avenue de Suffren, 75015 Paris, France",
        rating: 4.5,
        pricePerNight: 350,
        image: "/Tour-Eiffel-1.jpg",
    },

    // ==================================================
    // ROME
    // ==================================================

    {
        id: 4,
        name: "Hotel Artemide",
        destinationId: 2,
        address: "Via Nazionale 22, 00184 Rome, Italy",
        rating: 4.8,
        pricePerNight: 180,
        image: "/Artemide-1.jpg",
    },

    {
        id: 5,
        name: "Rome Marriott Grand Hotel Flora",
        destinationId: 2,
        address: "Via Vittorio Veneto 191, 00187 Rome, Italy",
        rating: 4.6,
        pricePerNight: 260,
        image: "/Flora-1.jpg",
    },

    {
        id: 6,
        name: "Palazzo Manfredi",
        destinationId: 2,
        address: "Via Labicana 125, 00184 Rome, Italy",
        rating: 4.7,
        pricePerNight: 390,
        image: "/Manfredi-1.jpg",
    },

    // ==================================================
    // BARCELONA
    // ==================================================

    {
        id: 7,
        name: "Hotel Arts Barcelona",
        destinationId: 3,
        address: "Marina 19-21, 08005 Barcelona, Spain",
        rating: 4.7,
        pricePerNight: 420,
        image: "/Arts-Barcelona-1.jpg",
    },

    {
        id: 8,
        name: "W Barcelona",
        destinationId: 3,
        address: "Plaça Rosa dels Vents 1, 08039 Barcelona, Spain",
        rating: 4.5,
        pricePerNight: 380,
        image: "/W-Barcelona-1.jpg",
    },

    {
        id: 9,
        name: "Majestic Hotel & Spa Barcelona",
        destinationId: 3,
        address: "Passeig de Gràcia 68, 08007 Barcelona, Spain",
        rating: 4.6,
        pricePerNight: 340,
        image: "/Majestic-1.jpg",
    },
];

export const rooms: Room[] = [
    // ==================================================
    // HÔTEL BALZAC - PARIS
    // ==================================================

    {
        id: 1,
        propertyId: 1,
        name: "Boudoir Room",
        description:
            "Elegant Parisian room with refined interiors and a classic atmosphere.",
        guests: 2,
        size: "18–20 m²",
        bed: "Queen bed or twin beds",
        pricePerNight: 280,
        image: "/Balzac-2.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Private bathroom",
            "Minibar",
            "Nespresso coffee maker",
        ],
    },

    {
        id: 2,
        propertyId: 1,
        name: "Superior Room",
        description:
            "Elegant room with views of Rue Balzac, Lord Byron or the courtyard.",
        guests: 2,
        size: "21–25 m²",
        bed: "Queen bed or twin beds",
        pricePerNight: 320,
        image: "/Balzac-3.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Marble bathroom",
            "Minibar",
            "Nespresso coffee maker",
            "Bluetooth speaker",
        ],
    },

    {
        id: 3,
        propertyId: 1,
        name: "Deluxe Room",
        description:
            "Spacious room with elegant Parisian interiors and additional comfort.",
        guests: 2,
        size: "26–30 m²",
        bed: "King bed or twin beds",
        pricePerNight: 370,
        image: "/Balzac-5.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Marble bathroom",
            "Minibar",
            "Nespresso coffee maker",
            "Partial Eiffel Tower view",
        ],
    },

    {
        id: 37,
        propertyId: 1,
        name: "Junior Suite",
        description:
            "Spacious suite combining a comfortable bedroom with additional living space.",
        guests: 3,
        size: "32–40 m²",
        bed: "King bed or twin beds + sofa bed",
        pricePerNight: 430,
        image: "/Balzac-6.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Marble bathroom",
            "Living area",
            "Minibar",
            "Nespresso coffee maker",
        ],
    },

    {
        id: 38,
        propertyId: 1,
        name: "Suite",
        description:
            "Large Parisian suite with a generous living area and refined interiors.",
        guests: 3,
        size: "42 m²",
        bed: "King bed or twin beds + sofa bed",
        pricePerNight: 520,
        image: "/Balzac-4.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Living area",
            "Marble bathroom",
            "Minibar",
            "Nespresso coffee maker",
        ],
    },

    {
        id: 39,
        propertyId: 1,
        name: "Eiffel Tower View Suite",
        description:
            "Elegant suite offering views towards the Eiffel Tower.",
        guests: 3,
        size: "Approx. 42 m²",
        bed: "King bed or twin beds + sofa bed",
        pricePerNight: 620,
        image: "/Balzac-7.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Eiffel Tower view",
            "Living area",
            "Minibar",
            "Nespresso coffee maker",
        ],
    },

    {
        id: 40,
        propertyId: 1,
        name: "Terrace Suite",
        description:
            "Premium suite with a private terrace and elegant Parisian atmosphere.",
        guests: 3,
        size: "Approx. 42 m²",
        bed: "King bed or twin beds + sofa bed",
        pricePerNight: 680,
        image: "/Balzac-8.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Private terrace",
            "Living area",
            "Minibar",
            "Nespresso coffee maker",
        ],
    },

    {
        id: 41,
        propertyId: 1,
        name: "Paris Sky Suite",
        description:
            "The hotel's exclusive top-level suite with exceptional Paris views.",
        guests: 4,
        size: "Approx. 60 m²",
        bed: "King bed + additional beds",
        pricePerNight: 850,
        image: "/Balzac-9.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Panoramic Paris view",
            "Living area",
            "Minibar",
            "Nespresso coffee maker",
        ],
    },

// ==================================================
// HYATT PARIS MADELEINE
// ==================================================

    {
        id: 5,
        propertyId: 2,
        name: "1 Queen Bed",
        description:
            "Elegant room overlooking the hotel's interior courtyard.",
        guests: 2,
        size: "18–22 m²",
        bed: "Queen bed",
        pricePerNight: 320,
        image: "/Madeleine-2.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Marble bathroom",
            "Nespresso coffee maker",
            "Minibar",
            "Safe",
        ],
    },

    {
        id: 6,
        propertyId: 2,
        name: "1 Queen Deluxe",
        description:
            "Deluxe Parisian room with elegant interiors and additional space.",
        guests: 2,
        size: "20–23 m²",
        bed: "Queen bed",
        pricePerNight: 360,
        image: "/Madeleine-3.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Marble bathroom",
            "Nespresso coffee maker",
            "Minibar",
            "Safe",
        ],
    },

    {
        id: 7,
        propertyId: 2,
        name: "1 King Bed Deluxe With View",
        description:
            "Deluxe room with views over Paris.",
        guests: 2,
        size: "25–27 m²",
        bed: "King bed",
        pricePerNight: 420,
        image: "/Madeleine-4.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "City view",
            "Marble bathroom",
            "Nespresso coffee maker",
            "Minibar",
        ],
    },

    {
        id: 8,
        propertyId: 2,
        name: "1 King Bed Premium",
        description:
            "Spacious premium room with refined Parisian design.",
        guests: 2,
        size: "28–36 m²",
        bed: "King bed",
        pricePerNight: 480,
        image: "/Madeleine-5.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Spacious room",
            "Marble bathroom",
            "Nespresso coffee maker",
            "Minibar",
        ],
    },

    {
        id: 42,
        propertyId: 2,
        name: "Junior Suite",
        description:
            "Spacious Parisian suite with additional living space.",
        guests: 3,
        size: "38–40 m²",
        bed: "King bed",
        pricePerNight: 550,
        image: "/Madeleine-6.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Living area",
            "Marble bathroom",
            "Nespresso coffee maker",
            "Minibar",
        ],
    },

    {
        id: 9,
        propertyId: 2,
        name: "Eiffel Tower Suite",
        description:
            "Luxury suite with views towards the Eiffel Tower.",
        guests: 2,
        size: "48 m²",
        bed: "King bed",
        pricePerNight: 700,
        image: "/Madeleine-7.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Eiffel Tower view",
            "Living area",
            "Marble bathroom",
            "Minibar",
        ],
    },

    {
        id: 43,
        propertyId: 2,
        name: "Parisian Suite",
        description:
            "Large luxury suite inspired by classic Parisian interiors.",
        guests: 2,
        size: "60 m²",
        bed: "King bed",
        pricePerNight: 780,
        image: "/Madeleine-8.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Living area",
            "Marble bathroom",
            "Nespresso coffee maker",
            "Minibar",
        ],
    },

    // ==================================================
    // PULLMAN PARIS TOUR EIFFEL
    // ==================================================

    {
        id: 10,
        propertyId: 3,
        name: "Classic Room",
        description:
            "Modern room with garden views and contemporary amenities.",
        guests: 2,
        size: "26 m²",
        bed: "King bed or twin beds",
        pricePerNight: 350,
        image: "/Tour-Eiffel-2.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "TV",
            "Private bathroom",
            "Garden view",
        ],
    },

    {
        id: 11,
        propertyId: 3,
        name: "Classic Room with Balcony",
        description:
            "Modern room with a private balcony and garden views.",
        guests: 3,
        size: "27 m²",
        bed: "King bed or twin beds",
        pricePerNight: 390,
        image: "/Tour-Eiffel-3.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Private balcony",
            "TV",
            "Garden view",
        ],
    },

    {
        id: 12,
        propertyId: 3,
        name: "Superior Room - Eiffel Tower View",
        description:
            "High-floor room with views of the Eiffel Tower.",
        guests: 2,
        size: "26 m²",
        bed: "King bed or twin beds",
        pricePerNight: 450,
        image: "/Tour-Eiffel-4.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Eiffel Tower view",
            "High floor",
            "TV",
            "Private bathroom",
        ],
    },

    {
        id: 13,
        propertyId: 3,
        name: "Deluxe Room - Eiffel Tower View",
        description:
            "Spacious room with balcony, sofa bed and Eiffel Tower views.",
        guests: 3,
        size: "32 m²",
        bed: "King bed or twin beds + sofa bed",
        pricePerNight: 520,
        image: "/Tour-Eiffel-5.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Private balcony",
            "Eiffel Tower view",
            "TV",
        ],
    },

    {
        id: 44,
        propertyId: 3,
        name: "Junior Family Suite",
        description:
            "Large family suite with a king bed and sofa bed.",
        guests: 4,
        size: "43 m²",
        bed: "King bed + sofa bed",
        pricePerNight: 620,
        image: "/Tour-Eiffel-6.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Living area",
            "Eiffel Tower view",
            "TV",
            "Private bathroom",
        ],
    },

    {
        id: 45,
        propertyId: 3,
        name: "Trocadero Suite",
        description:
            "Large suite with balcony and Eiffel Tower views.",
        guests: 4,
        size: "72 m²",
        bed: "King bed + sofa bed",
        pricePerNight: 850,
        image: "/Tour-Eiffel-7.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Private balcony",
            "Eiffel Tower view",
            "Living area",
            "TV",
        ],
    },

    {
        id: 46,
        propertyId: 3,
        name: "Penthouse Eiffel",
        description:
            "Exceptional top-floor suite with panoramic Eiffel Tower views.",
        guests: 4,
        size: "110 m²",
        bed: "King bed + sofa bed",
        pricePerNight: 1200,
        image: "/Tour-Eiffel-8.jpg",
        features: [
            "Free Wi-Fi",
            "Air conditioning",
            "Panoramic Eiffel Tower view",
            "Private balcony",
            "Living area",
            "TV",
        ],
    },

    // ==================================================
    // HOTEL ARTEMIDE - ROME
    // ==================================================

    {
        id: 14,
        propertyId: 4,
        name: "Basic",
        description:
            "Comfortable and practical room for exploring the center of Rome.",
        guests: 2,
        size: "13 m²",
        bed: "Double bed",
        pricePerNight: 180,
        image: "/Artemide-2.jpg",
        features: [
            "High-speed Wi-Fi",
            "Free minibar",
            "Kettle",
            "Smart TV",
            "Air conditioning",
            "Private bathroom",
        ],
    },

    {
        id: 15,
        propertyId: 4,
        name: "Comfort",
        description:
            "Warm and elegant room with complimentary minibar.",
        guests: 2,
        size: "15 m²",
        bed: "Double bed",
        pricePerNight: 210,
        image: "/Artemide-3.jpg",
        features: [
            "High-speed Wi-Fi",
            "Free minibar",
            "Kettle",
            "Smart TV",
            "Air conditioning",
            "Bathtub or shower",
        ],
    },

    {
        id: 16,
        propertyId: 4,
        name: "Deluxe",
        description:
            "Spacious room with premium bathroom amenities.",
        guests: 3,
        size: "20–22 m²",
        bed: "Double bed or twin beds",
        pricePerNight: 260,
        image: "/Artemide-4.jpg",
        features: [
            "High-speed Wi-Fi",
            "Free minibar",
            "Smart TV",
            "Air conditioning",
            "Walk-in shower",
            "Bathrobe and slippers",
        ],
    },

    {
        id: 17,
        propertyId: 4,
        name: "Junior Suite",
        description:
            "Mini-apartment style suite with separate bedroom and living room.",
        guests: 4,
        size: "26–29 m²",
        bed: "Double bed + sofa bed",
        pricePerNight: 330,
        image: "/Artemide-5.jpg",
        features: [
            "High-speed Wi-Fi",
            "Separate bedroom and living room",
            "Free premium minibar",
            "Nespresso coffee machine",
            "Smart TV",
            "Rain shower",
        ],
    },

    {
        id: 18,
        propertyId: 4,
        name: "Honeymoon Suite",
        description:
            "Romantic suite designed for a special stay in Rome.",
        guests: 2,
        size: "31 m²",
        bed: "Double bed",
        pricePerNight: 430,
        image: "/Artemide-6.jpg",
        features: [
            "High-speed Wi-Fi",
            "Premium minibar",
            "Smart TV",
            "Air conditioning",
            "Private bathroom",
            "Premium amenities",
        ],
    },

    // ==================================================
    // ROME MARRIOTT GRAND HOTEL FLORA
    // ==================================================

    {
        id: 19,
        propertyId: 5,
        name: "Deluxe Room",
        description:
            "Elegant guest room in the heart of Rome.",
        guests: 2,
        size: "Approx. 25 m²",
        bed: "King bed or double bed",
        pricePerNight: 260,
        image: "/Flora-2.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "TV",
            "Private bathroom",
            "Luxurious bedding",
        ],
    },

    {
        id: 20,
        propertyId: 5,
        name: "Superior Room",
        description:
            "Comfortable room with refined interiors.",
        guests: 2,
        size: "Approx. 25 m²",
        bed: "King bed or twin beds",
        pricePerNight: 290,
        image: "/Flora-3.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "TV",
            "Private bathroom",
            "Luxurious bedding",
        ],
    },

    {
        id: 21,
        propertyId: 5,
        name: "Superior Room - High Floor",
        description:
            "High-floor room with views over Via Veneto or Villa Borghese.",
        guests: 2,
        size: "Approx. 25 m²",
        bed: "King bed or twin beds",
        pricePerNight: 340,
        image: "/Flora-4.jpg",
        features: [
            "Free Internet",
            "Air conditioning",
            "High floor",
            "Via Veneto or Villa Borghese view",
            "42-inch TV",
        ],
    },

    {
        id: 47,
        propertyId: 5,
        name: "Suite",
        description:
            "Spacious suite with city views and separate living space.",
        guests: 3,
        size: "50 m²",
        bed: "King bed + sofa bed",
        pricePerNight: 480,
        image: "/Flora-5.jpg",
        features: [
            "Wi-Fi",
            "City view",
            "Living area",
            "Air conditioning",
            "TV",
            "Luxurious bedding",
        ],
    },

    {
        id: 48,
        propertyId: 5,
        name: "Presidential Suite",
        description:
            "Large luxury suite with elegant living space.",
        guests: 4,
        size: "60 m²",
        bed: "King bed + sofa bed",
        pricePerNight: 650,
        image: "/Flora-6.jpg",
        features: [
            "Wi-Fi",
            "City view",
            "Living area",
            "Air conditioning",
            "TV",
            "Luxurious bedding",
        ],
    },

    // ==================================================
    // PALAZZO MANFREDI - ROME
    // ==================================================

    {
        id: 23,
        propertyId: 6,
        name: "Classic Room",
        description:
            "Elegant accommodation close to the Colosseum and historic center.",
        guests: 2,
        size: "Approx. 20 m²",
        bed: "Double bed",
        pricePerNight: 390,
        image: "/Manfredi-2.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "TV",
            "Private bathroom",
            "Minibar",
        ],
    },

    {
        id: 24,
        propertyId: 6,
        name: "Deluxe Room",
        description:
            "Spacious room combining classic Roman style with modern comfort.",
        guests: 2,
        size: "Approx. 25 m²",
        bed: "King bed",
        pricePerNight: 470,
        image: "/Manfredi-3.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "TV",
            "Private bathroom",
            "Minibar",
            "City view",
        ],
    },

    {
        id: 25,
        propertyId: 6,
        name: "Colosseum View Suite",
        description:
            "Luxury suite with views towards the Colosseum.",
        guests: 3,
        size: "Approx. 40 m²",
        bed: "King bed + sofa bed",
        pricePerNight: 580,
        image: "/Manfredi-4.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "Colosseum view",
            "Living area",
            "TV",
            "Minibar",
        ],
    },

    {
        id: 49,
        propertyId: 6,
        name: "Luxury Suite",
        description:
            "Premium suite with elegant interiors and additional living space.",
        guests: 3,
        size: "Approx. 45 m²",
        bed: "King bed + sofa bed",
        pricePerNight: 680,
        image: "/Manfredi-5.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "Living area",
            "Historic view",
            "TV",
            "Minibar",
        ],
    },

    // ==================================================
    // HOTEL ARTS BARCELONA
    // ==================================================

    {
        id: 26,
        propertyId: 7,
        name: "Landscape King",
        description:
            "Elegant contemporary room with views over Barcelona.",
        guests: 2,
        size: "45 m²",
        bed: "King bed",
        pricePerNight: 420,
        image: "/Arts-Barcelona-2.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "City view",
            "TV",
            "Private bathroom",
        ],
    },

    {
        id: 27,
        propertyId: 7,
        name: "Scenic King",
        description:
            "Spacious room with panoramic city or sea views.",
        guests: 2,
        size: "45 m²",
        bed: "King bed",
        pricePerNight: 480,
        image: "/Arts-Barcelona-3.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "Panoramic view",
            "TV",
            "Private bathroom",
        ],
    },

    {
        id: 28,
        propertyId: 7,
        name: "Panorama King",
        description:
            "Premium room with panoramic views over Barcelona.",
        guests: 2,
        size: "45 m²",
        bed: "King bed",
        pricePerNight: 560,
        image: "/Arts-Barcelona-4.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "Panoramic city view",
            "TV",
            "Private bathroom",
        ],
    },

    {
        id: 50,
        propertyId: 7,
        name: "Seascape King",
        description:
            "Premium room overlooking the Mediterranean Sea.",
        guests: 2,
        size: "45 m²",
        bed: "King bed",
        pricePerNight: 620,
        image: "/Arts-Barcelona-5.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "Sea view",
            "Panoramic windows",
            "TV",
            "Private bathroom",
        ],
    },

    {
        id: 29,
        propertyId: 7,
        name: "Suite Skyline",
        description:
            "Luxury suite with generous living space and panoramic views.",
        guests: 3,
        size: "Approx. 80 m²",
        bed: "King bed",
        pricePerNight: 720,
        image: "/Arts-Barcelona-6.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "Panoramic view",
            "Living area",
            "TV",
            "Minibar",
        ],
    },

    // ==================================================
    // W BARCELONA
    // ==================================================

    {
        id: 30,
        propertyId: 8,
        name: "Wonderful Room",
        description:
            "Modern room with spectacular Barcelona or Mediterranean views.",
        guests: 2,
        size: "Approx. 40 m²",
        bed: "King bed",
        pricePerNight: 380,
        image: "/W-Barcelona-2.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "Sea or city view",
            "50-inch TV",
            "Bose sound system",
        ],
    },

    {
        id: 31,
        propertyId: 8,
        name: "Spectacular Room",
        description:
            "Bright room with contemporary design and impressive views.",
        guests: 2,
        size: "Approx. 40 m²",
        bed: "King bed",
        pricePerNight: 450,
        image: "/W-Barcelona-3.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "Sea view",
            "50-inch TV",
            "Bose sound system",
        ],
    },

    {
        id: 32,
        propertyId: 8,
        name: "Corner Suite",
        description:
            "Spacious corner suite with panoramic views and living area.",
        guests: 3,
        size: "Approx. 65 m²",
        bed: "King bed",
        pricePerNight: 620,
        image: "/W-Barcelona-4.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "Panoramic view",
            "Living area",
            "Bose sound system",
            "50-inch TV",
        ],
    },

    {
        id: 33,
        propertyId: 8,
        name: "Onada Terrace Suite",
        description:
            "Luxury suite with private terrace and Mediterranean views.",
        guests: 3,
        size: "98 m²",
        bed: "King bed",
        pricePerNight: 750,
        image: "/W-Barcelona-5.jpg",
        features: [
            "Wi-Fi",
            "Air conditioning",
            "Private terrace",
            "Sea view",
            "Living area",
            "Bose sound system",
        ],
    },

    // ==================================================
    // MAJESTIC HOTEL & SPA BARCELONA
    // ==================================================

    {
        id: 34,
        propertyId: 9,
        name: "Deluxe Room",
        description:
            "Elegant room with views over the Eixample courtyard or passage.",
        guests: 2,
        size: "20–25 m²",
        bed: "Queen bed or twin beds",
        pricePerNight: 340,
        image: "/Majestic-2.jpg",
        features: [
            "Free Wi-Fi",
            "Smart TV with Chromecast",
            "White marble bathroom",
            "Air conditioning",
            "Espresso coffee maker",
        ],
    },

    {
        id: 35,
        propertyId: 9,
        name: "Deluxe City View Room",
        description:
            "Elegant room overlooking Valencia Street and the Eixample district.",
        guests: 2,
        size: "20–25 m²",
        bed: "Queen bed or twin beds",
        pricePerNight: 380,
        image: "/Majestic-3.jpg",
        features: [
            "Free Wi-Fi",
            "Smart TV with Chromecast",
            "City view",
            "White marble bathroom",
            "Air conditioning",
        ],
    },

    {
        id: 51,
        propertyId: 9,
        name: "Privilege Room",
        description:
            "Spacious room with a work area and elegant marble bathroom.",
        guests: 2,
        size: "30–35 m²",
        bed: "King bed or twin beds",
        pricePerNight: 450,
        image: "/Majestic-4.jpg",
        features: [
            "Free Wi-Fi",
            "Smart TV with Chromecast",
            "Work area",
            "White marble bathroom",
            "Air conditioning",
            "Espresso coffee maker",
        ],
    },

    {
        id: 52,
        propertyId: 9,
        name: "One Bedroom Suite Passeig de Gracia",
        description:
            "Recently renovated suite with bedroom and separate living area overlooking Passeig de Gracia.",
        guests: 3,
        size: "40–45 m²",
        bed: "King bed or twin beds + sofa bed",
        pricePerNight: 560,
        image: "/Majestic-5.jpg",
        features: [
            "Free Wi-Fi",
            "Smart TV with Chromecast",
            "Living area",
            "Passeig de Gracia view",
            "White marble bathroom",
            "Air conditioning",
        ],
    },

    {
        id: 36,
        propertyId: 9,
        name: "Majestic Suite",
        description:
            "Luxury suite with two separate spaces and views of Passeig de Gracia and Casa Batlló.",
        guests: 4,
        size: "45–65 m²",
        bed: "King bed or twin beds + sofa bed",
        pricePerNight: 650,
        image: "/Majestic-6.jpg",
        features: [
            "Free Wi-Fi",
            "Smart TV with Chromecast",
            "Separate living area",
            "Panoramic view",
            "White marble bathroom",
            "Air conditioning",
        ],
    },

    {
        id: 53,
        propertyId: 9,
        name: "Penthouse Suite",
        description:
            "Exclusive penthouse with private terrace and panoramic Barcelona views.",
        guests: 2,
        size: "100 m²",
        bed: "King bed or twin beds",
        pricePerNight: 1000,
        image: "/Majestic-7.jpg",
        features: [
            "Free Wi-Fi",
            "Private terrace",
            "Panoramic view",
            "Solarium",
            "White marble bathroom",
            "Air conditioning",
        ],
    },
];

export const reviews: Review[] = [
    // ==================================================
    // HÔTEL BALZAC - PARIS
    // ==================================================

    {
        id: 1,
        propertyId: 1,
        userId: 101,
        userName: "Sophie",
        rating: 5,
        comment:
            "Beautiful hotel with elegant Parisian interiors. The room was comfortable, clean and very well maintained.",
        createdAt: "2026-08-18",
        isMock: true,
    },
    {
        id: 2,
        propertyId: 1,
        userId: 102,
        userName: "Daniel",
        rating: 4.5,
        comment:
            "A lovely stay in Paris. The location was excellent and the staff were very welcoming and helpful.",
        createdAt: "2026-08-27",
        isMock: true,
    },
    {
        id: 3,
        propertyId: 1,
        userId: 103,
        userName: "Emma",
        rating: 5,
        comment:
            "The room was beautiful and the atmosphere was wonderful. I would definitely stay here again.",
        createdAt: "2026-09-02",
        isMock: true,
    },

    // ==================================================
    // HYATT PARIS MADELEINE
    // ==================================================

    {
        id: 4,
        propertyId: 2,
        userId: 104,
        userName: "Olivia",
        rating: 5,
        comment:
            "Fantastic hotel in a great part of Paris. The room was spacious, elegant and extremely comfortable.",
        createdAt: "2026-08-11",
        isMock: true,
    },
    {
        id: 5,
        propertyId: 2,
        userId: 105,
        userName: "James",
        rating: 4.5,
        comment:
            "Very pleasant experience. The hotel has a beautiful atmosphere and the service was excellent.",
        createdAt: "2026-08-23",
        isMock: true,
    },
    {
        id: 6,
        propertyId: 2,
        userId: 106,
        userName: "Charlotte",
        rating: 5,
        comment:
            "Wonderful stay from beginning to end. The room was clean, quiet and beautifully decorated.",
        createdAt: "2026-09-01",
        isMock: true,
    },

    // ==================================================
    // PULLMAN PARIS TOUR EIFFEL
    // ==================================================

    {
        id: 7,
        propertyId: 3,
        userId: 107,
        userName: "Lucas",
        rating: 5,
        comment:
            "Amazing location and beautiful views of Paris. The room was modern, clean and very comfortable.",
        createdAt: "2026-08-15",
        isMock: true,
    },
    {
        id: 8,
        propertyId: 3,
        userId: 108,
        userName: "Amelia",
        rating: 4.5,
        comment:
            "Excellent hotel for a trip to Paris. The Eiffel Tower view was absolutely beautiful.",
        createdAt: "2026-08-29",
        isMock: true,
    },
    {
        id: 9,
        propertyId: 3,
        userId: 109,
        userName: "William",
        rating: 5,
        comment:
            "One of the best stays I have had in Paris. Great room, great location and excellent service.",
        createdAt: "2026-09-03",
        isMock: true,
    },

    // ==================================================
    // HOTEL ARTEMIDE - ROME
    // ==================================================

    {
        id: 10,
        propertyId: 4,
        userId: 110,
        userName: "Sophie",
        rating: 5,
        comment:
            "Excellent location and very comfortable room. Perfect for exploring Rome.",
        createdAt: "2026-08-12",
        isMock: true,
    },
    {
        id: 11,
        propertyId: 4,
        userId: 111,
        userName: "Daniel",
        rating: 4.5,
        comment:
            "Beautiful hotel with friendly staff and excellent service. Everything was clean and comfortable.",
        createdAt: "2026-08-24",
        isMock: true,
    },
    {
        id: 12,
        propertyId: 4,
        userId: 112,
        userName: "Emma",
        rating: 4.5,
        comment:
            "Very clean and comfortable. Great location in the center of Rome and easy to reach many attractions.",
        createdAt: "2026-09-01",
        isMock: true,
    },

    // ==================================================
    // ROME MARRIOTT GRAND HOTEL FLORA
    // ==================================================

    {
        id: 13,
        propertyId: 5,
        userId: 113,
        userName: "Michael",
        rating: 5,
        comment:
            "Beautiful hotel with a fantastic location. The room was elegant, spacious and very comfortable.",
        createdAt: "2026-08-09",
        isMock: true,
    },
    {
        id: 14,
        propertyId: 5,
        userId: 114,
        userName: "Isabella",
        rating: 4.5,
        comment:
            "A wonderful experience in Rome. The staff were kind and the hotel had a very relaxing atmosphere.",
        createdAt: "2026-08-21",
        isMock: true,
    },
    {
        id: 15,
        propertyId: 5,
        userId: 115,
        userName: "Thomas",
        rating: 5,
        comment:
            "The room was excellent and the service was professional. I really enjoyed my stay here.",
        createdAt: "2026-08-30",
        isMock: true,
    },

    // ==================================================
    // PALAZZO MANFREDI - ROME
    // ==================================================

    {
        id: 16,
        propertyId: 6,
        userId: 116,
        userName: "Alice",
        rating: 5,
        comment:
            "Fantastic location close to the Colosseum. The room was beautiful and the whole experience was excellent.",
        createdAt: "2026-08-14",
        isMock: true,
    },
    {
        id: 17,
        propertyId: 6,
        userId: 117,
        userName: "George",
        rating: 4.5,
        comment:
            "Very elegant hotel with excellent service. The views and location made our stay really special.",
        createdAt: "2026-08-26",
        isMock: true,
    },
    {
        id: 18,
        propertyId: 6,
        userId: 118,
        userName: "Sophia",
        rating: 5,
        comment:
            "A wonderful hotel for a romantic trip to Rome. Everything was clean, comfortable and beautifully presented.",
        createdAt: "2026-09-02",
        isMock: true,
    },

    // ==================================================
    // HOTEL ARTS BARCELONA
    // ==================================================

    {
        id: 19,
        propertyId: 7,
        userId: 119,
        userName: "Liam",
        rating: 5,
        comment:
            "Amazing hotel with spectacular views of Barcelona and the sea. The room was excellent.",
        createdAt: "2026-08-10",
        isMock: true,
    },
    {
        id: 20,
        propertyId: 7,
        userId: 120,
        userName: "Mia",
        rating: 4.5,
        comment:
            "Beautiful modern hotel with fantastic views. The staff were friendly and very professional.",
        createdAt: "2026-08-22",
        isMock: true,
    },
    {
        id: 21,
        propertyId: 7,
        userId: 121,
        userName: "Noah",
        rating: 5,
        comment:
            "One of my favorite stays in Barcelona. Spacious room, beautiful views and excellent service.",
        createdAt: "2026-09-04",
        isMock: true,
    },

    // ==================================================
    // W BARCELONA
    // ==================================================

    {
        id: 22,
        propertyId: 8,
        userId: 122,
        userName: "Emily",
        rating: 5,
        comment:
            "Fantastic hotel right by the sea. The room was stylish, comfortable and had an incredible view.",
        createdAt: "2026-08-13",
        isMock: true,
    },
    {
        id: 23,
        propertyId: 8,
        userId: 123,
        userName: "Oliver",
        rating: 4.5,
        comment:
            "Great atmosphere and amazing views. The hotel was clean and the service was excellent.",
        createdAt: "2026-08-25",
        isMock: true,
    },
    {
        id: 24,
        propertyId: 8,
        userId: 124,
        userName: "Ella",
        rating: 5,
        comment:
            "Absolutely loved our stay. The room was beautiful and the Mediterranean view was unforgettable.",
        createdAt: "2026-09-03",
        isMock: true,
    },

    // ==================================================
    // MAJESTIC HOTEL & SPA BARCELONA
    // ==================================================

    {
        id: 25,
        propertyId: 9,
        userId: 125,
        userName: "Benjamin",
        rating: 5,
        comment:
            "Excellent hotel in a perfect Barcelona location. The room was elegant and very comfortable.",
        createdAt: "2026-08-08",
        isMock: true,
    },
    {
        id: 26,
        propertyId: 9,
        userId: 126,
        userName: "Grace",
        rating: 4.5,
        comment:
            "Beautiful property with wonderful service. The room was spacious and very clean.",
        createdAt: "2026-08-20",
        isMock: true,
    },
    {
        id: 27,
        propertyId: 9,
        userId: 127,
        userName: "Henry",
        rating: 5,
        comment:
            "A fantastic experience in Barcelona. Great location, beautiful room and excellent facilities.",
        createdAt: "2026-08-31",
        isMock: true,
    },
];

export const bookings: Booking[] = [
    {
        id: 1,
        userId: 1,
        propertyId: 4,
        roomId: 14,
        checkIn: "2026-09-10",
        checkOut: "2026-09-14",
        guests: 2,
        totalPrice: 720,
        status: "confirmed",
    },
];