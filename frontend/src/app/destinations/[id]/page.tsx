"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import PropertyCard from "../../../components/PropertyCard";

import { getDestinations } from "../../../services/destinationService";
import { getProperties } from "../../../services/propertyService";

import {
    Destination,
    Property,
} from "../../../types/types";

import { useSettings } from "../../../context/SettingsContext";

import {
    getLocalizedCountryName,
    getLocalizedCityName,
} from "../../../data/translations";


type DestinationPageProps = {
    params: Promise<{
        id: string;
    }>;
};


const pageTranslations: Record<
    string,
    {
        loading: string;
        notFound: string;
        backHome: string;
        staysIn: string;
        noStays: string;
        noStaysDescription: string;
    }
> = {
    English: {
        loading: "Loading destination...",
        notFound: "Destination not found",
        backHome: "Back to home",
        staysIn: "Stays in",
        noStays: "No stays available",
        noStaysDescription:
            "There are currently no properties available in this destination.",
    },

    "Română": {
        loading: "Se încarcă destinația...",
        notFound: "Destinația nu a fost găsită",
        backHome: "Înapoi la pagina principală",
        staysIn: "Cazări în",
        noStays: "Nu există cazări disponibile",
        noStaysDescription:
            "În prezent nu există unități de cazare disponibile în această destinație.",
    },

    "Русский": {
        loading: "Загрузка направления...",
        notFound: "Направление не найдено",
        backHome: "Вернуться на главную",
        staysIn: "Варианты проживания в",
        noStays: "Нет доступных вариантов проживания",
        noStaysDescription:
            "В настоящее время в этом направлении нет доступных вариантов проживания.",
    },

    "Українська": {
        loading: "Завантаження напрямку...",
        notFound: "Напрямок не знайдено",
        backHome: "Повернутися на головну",
        staysIn: "Помешкання в",
        noStays: "Немає доступних помешкань",
        noStaysDescription:
            "Наразі в цьому напрямку немає доступних помешкань.",
    },

    "Français": {
        loading: "Chargement de la destination...",
        notFound: "Destination introuvable",
        backHome: "Retour à l'accueil",
        staysIn: "Hébergements à",
        noStays: "Aucun hébergement disponible",
        noStaysDescription:
            "Aucun hébergement n'est actuellement disponible dans cette destination.",
    },

    "Español": {
        loading: "Cargando destino...",
        notFound: "Destino no encontrado",
        backHome: "Volver al inicio",
        staysIn: "Alojamientos en",
        noStays: "No hay alojamientos disponibles",
        noStaysDescription:
            "Actualmente no hay alojamientos disponibles en este destino.",
    },

    "Deutsch": {
        loading: "Reiseziel wird geladen...",
        notFound: "Reiseziel nicht gefunden",
        backHome: "Zurück zur Startseite",
        staysIn: "Unterkünfte in",
        noStays: "Keine Unterkünfte verfügbar",
        noStaysDescription:
            "Derzeit sind in diesem Reiseziel keine Unterkünfte verfügbar.",
    },

    "Italiano": {
        loading: "Caricamento destinazione...",
        notFound: "Destinazione non trovata",
        backHome: "Torna alla home",
        staysIn: "Strutture a",
        noStays: "Nessuna struttura disponibile",
        noStaysDescription:
            "Al momento non ci sono strutture disponibili in questa destinazione.",
    },

    "Português": {
        loading: "A carregar destino...",
        notFound: "Destino não encontrado",
        backHome: "Voltar à página inicial",
        staysIn: "Alojamentos em",
        noStays: "Não existem alojamentos disponíveis",
        noStaysDescription:
            "Atualmente não existem alojamentos disponíveis neste destino.",
    },

    "Nederlands": {
        loading: "Bestemming laden...",
        notFound: "Bestemming niet gevonden",
        backHome: "Terug naar home",
        staysIn: "Accommodaties in",
        noStays: "Geen accommodaties beschikbaar",
        noStaysDescription:
            "Er zijn momenteel geen accommodaties beschikbaar op deze bestemming.",
    },

    "Polski": {
        loading: "Ładowanie kierunku...",
        notFound: "Nie znaleziono kierunku",
        backHome: "Wróć do strony głównej",
        staysIn: "Noclegi w",
        noStays: "Brak dostępnych noclegów",
        noStaysDescription:
            "Obecnie w tym kierunku nie ma dostępnych obiektów.",
    },

    "Čeština": {
        loading: "Načítání destinace...",
        notFound: "Destinace nebyla nalezena",
        backHome: "Zpět na hlavní stránku",
        staysIn: "Ubytování v",
        noStays: "Žádné dostupné ubytování",
        noStaysDescription:
            "V této destinaci momentálně není dostupné žádné ubytování.",
    },

    "Ελληνικά": {
        loading: "Φόρτωση προορισμού...",
        notFound: "Ο προορισμός δεν βρέθηκε",
        backHome: "Επιστροφή στην αρχική",
        staysIn: "Καταλύματα σε",
        noStays: "Δεν υπάρχουν διαθέσιμα καταλύματα",
        noStaysDescription:
            "Δεν υπάρχουν προς το παρόν διαθέσιμα καταλύματα σε αυτόν τον προορισμό.",
    },

    "Български": {
        loading: "Зареждане на дестинацията...",
        notFound: "Дестинацията не е намерена",
        backHome: "Обратно към началната страница",
        staysIn: "Настаняване в",
        noStays: "Няма налични места за настаняване",
        noStaysDescription:
            "В момента няма налични места за настаняване в тази дестинация.",
    },

    "Türkçe": {
        loading: "Destinasyon yükleniyor...",
        notFound: "Destinasyon bulunamadı",
        backHome: "Ana sayfaya dön",
        staysIn: "Konaklama yerleri:",
        noStays: "Kullanılabilir konaklama yok",
        noStaysDescription:
            "Bu destinasyonda şu anda kullanılabilir konaklama bulunmuyor.",
    },
};


export default function DestinationPage({
                                            params,
                                        }: DestinationPageProps) {

    const { language } = useSettings();

    const [destination, setDestination] =
        useState<Destination | null>(null);

    const [destinationProperties, setDestinationProperties] =
        useState<Property[]>([]);

    const [loading, setLoading] =
        useState(true);


    const languageName =
        language.split("|")[0];

    const text =
        pageTranslations[languageName] ??
        pageTranslations.English;


    useEffect(() => {

        let mounted = true;


        const loadDestination = async () => {

            const { id } = await params;

            const destinationId =
                Number(id);


            const savedDestinations =
                getDestinations();

            const savedProperties =
                getProperties();


            const foundDestination =
                savedDestinations.find(
                    (item) =>
                        item.id === destinationId
                );


            if (!mounted) {
                return;
            }


            if (!foundDestination) {

                setDestination(null);

                setDestinationProperties([]);

                setLoading(false);

                return;
            }


            setDestination(
                foundDestination
            );


            setDestinationProperties(
                savedProperties.filter(
                    (property) =>
                        property.destinationId ===
                        foundDestination.id
                )
            );


            setLoading(false);
        };


        loadDestination();


        return () => {
            mounted = false;
        };

    }, [params]);


    if (loading) {

        return (
            <main className="container">

                <div className="home-loading-state">

                    <p>
                        {text.loading}
                    </p>

                </div>

            </main>
        );
    }


    if (!destination) {

        return (
            <main className="container">

                <h1>
                    {text.notFound}
                </h1>

                <Link href="/">
                    {text.backHome}
                </Link>

            </main>
        );
    }


    const localizedCity =
        getLocalizedCityName(
            destination.name,
            language
        );


    const localizedCountry =
        getLocalizedCountryName(
            destination.country,
            language
        );


    return (
        <main>

            <section className="destination-hero">

                <div className="container">

                    <img
                        src={destination.image}
                        alt={localizedCity}
                    />


                    <div>

                        <h1>
                            {localizedCity}
                        </h1>

                        <p>
                            {localizedCountry}
                        </p>

                    </div>

                </div>

            </section>


            <section className="section">

                <div className="container">

                    <h2>
                        {text.staysIn}{" "}
                        {localizedCity}
                    </h2>


                    {destinationProperties.length === 0 ? (

                        <div className="home-empty-state">

                            <h3>
                                {text.noStays}
                            </h3>

                            <p>
                                {text.noStaysDescription}
                            </p>

                        </div>

                    ) : (

                        <div className="property-grid">

                            {destinationProperties.map(
                                (property) => (

                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                    />

                                )
                            )}

                        </div>

                    )}

                </div>

            </section>

        </main>
    );
}