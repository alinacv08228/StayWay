"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import PropertyCard from "../../components/PropertyCard";

import { useSettings } from "../../context/SettingsContext";

import {
    getTranslation,
    getLocalizedCountryName,
    getLocalizedCityName,
} from "../../data/translations";

import {
    getFilterTranslation,
} from "../../data/filterTranslations";

import { currencyInfo } from "../../data/currency";

import {
    properties as mockProperties,
} from "../../data/mockData";

import {
    getProperties,
    getPropertiesFromApi,
} from "../../services/propertyService";

import {
    getDestinations,
} from "../../services/destinationService";

import { Property } from "../../types/types";

type StaysPageTextKey =
    | "errorTitle"
    | "errorDescription"
    | "tryAgain"
    | "searchResultsFor"
    | "resultOne"
    | "resultMany"
    | "noStaysFound"
    | "tryChangingFilters";

const staysPageTranslations: Record<string, Record<StaysPageTextKey, string>> = {
    "English": {
        errorTitle: "Something went wrong",
        errorDescription: "We could not load the available stays.",
        tryAgain: "Try again",
        searchResultsFor: "Search results for:",
        resultOne: "{count} stay found",
        resultMany: "{count} stays found",
        noStaysFound: "No stays found",
        tryChangingFilters: "Try changing your filters.",
    },
    "Română": {
        errorTitle: "Ceva nu a mers bine",
        errorDescription: "Nu am putut încărca cazările disponibile.",
        tryAgain: "Încearcă din nou",
        searchResultsFor: "Rezultate pentru:",
        resultOne: "{count} cazare găsită",
        resultMany: "{count} cazări găsite",
        noStaysFound: "Nu au fost găsite cazări",
        tryChangingFilters: "Încearcă să modifici filtrele.",
    },
    "Русский": {
        errorTitle: "Что-то пошло не так",
        errorDescription: "Не удалось загрузить доступные варианты проживания.",
        tryAgain: "Попробовать снова",
        searchResultsFor: "Результаты поиска для:",
        resultOne: "Найден {count} вариант проживания",
        resultMany: "Найдено вариантов проживания: {count}",
        noStaysFound: "Варианты проживания не найдены",
        tryChangingFilters: "Попробуйте изменить фильтры.",
    },
    "Українська": {
        errorTitle: "Щось пішло не так",
        errorDescription: "Не вдалося завантажити доступні варіанти проживання.",
        tryAgain: "Спробувати ще раз",
        searchResultsFor: "Результати пошуку для:",
        resultOne: "Знайдено {count} варіант проживання",
        resultMany: "Знайдено варіантів проживання: {count}",
        noStaysFound: "Варіанти проживання не знайдено",
        tryChangingFilters: "Спробуйте змінити фільтри.",
    },
    "Français": {
        errorTitle: "Une erreur s'est produite",
        errorDescription: "Nous n'avons pas pu charger les hébergements disponibles.",
        tryAgain: "Réessayer",
        searchResultsFor: "Résultats de recherche pour :",
        resultOne: "{count} hébergement trouvé",
        resultMany: "{count} hébergements trouvés",
        noStaysFound: "Aucun hébergement trouvé",
        tryChangingFilters: "Essayez de modifier vos filtres.",
    },
    "Español": {
        errorTitle: "Algo salió mal",
        errorDescription: "No pudimos cargar los alojamientos disponibles.",
        tryAgain: "Intentar de nuevo",
        searchResultsFor: "Resultados de búsqueda para:",
        resultOne: "{count} alojamiento encontrado",
        resultMany: "{count} alojamientos encontrados",
        noStaysFound: "No se encontraron alojamientos",
        tryChangingFilters: "Prueba a cambiar los filtros.",
    },
    "Deutsch": {
        errorTitle: "Etwas ist schiefgelaufen",
        errorDescription: "Die verfügbaren Unterkünfte konnten nicht geladen werden.",
        tryAgain: "Erneut versuchen",
        searchResultsFor: "Suchergebnisse für:",
        resultOne: "{count} Unterkunft gefunden",
        resultMany: "{count} Unterkünfte gefunden",
        noStaysFound: "Keine Unterkünfte gefunden",
        tryChangingFilters: "Versuche, deine Filter zu ändern.",
    },
    "Italiano": {
        errorTitle: "Qualcosa è andato storto",
        errorDescription: "Non è stato possibile caricare gli alloggi disponibili.",
        tryAgain: "Riprova",
        searchResultsFor: "Risultati di ricerca per:",
        resultOne: "{count} alloggio trovato",
        resultMany: "{count} alloggi trovati",
        noStaysFound: "Nessun alloggio trovato",
        tryChangingFilters: "Prova a modificare i filtri.",
    },
    "Português": {
        errorTitle: "Algo correu mal",
        errorDescription: "Não foi possível carregar os alojamentos disponíveis.",
        tryAgain: "Tentar novamente",
        searchResultsFor: "Resultados da pesquisa para:",
        resultOne: "{count} alojamento encontrado",
        resultMany: "{count} alojamentos encontrados",
        noStaysFound: "Nenhum alojamento encontrado",
        tryChangingFilters: "Tente alterar os filtros.",
    },
    "Nederlands": {
        errorTitle: "Er is iets misgegaan",
        errorDescription: "We konden de beschikbare accommodaties niet laden.",
        tryAgain: "Opnieuw proberen",
        searchResultsFor: "Zoekresultaten voor:",
        resultOne: "{count} accommodatie gevonden",
        resultMany: "{count} accommodaties gevonden",
        noStaysFound: "Geen accommodaties gevonden",
        tryChangingFilters: "Probeer je filters aan te passen.",
    },
    "Norsk": {
        errorTitle: "Noe gikk galt",
        errorDescription: "Vi kunne ikke laste inn de tilgjengelige overnattingsstedene.",
        tryAgain: "Prøv igjen",
        searchResultsFor: "Søkeresultater for:",
        resultOne: "{count} overnattingssted funnet",
        resultMany: "{count} overnattingssteder funnet",
        noStaysFound: "Ingen overnattingssteder funnet",
        tryChangingFilters: "Prøv å endre filtrene.",
    },
    "Svenska": {
        errorTitle: "Något gick fel",
        errorDescription: "Vi kunde inte läsa in de tillgängliga boendena.",
        tryAgain: "Försök igen",
        searchResultsFor: "Sökresultat för:",
        resultOne: "{count} boende hittades",
        resultMany: "{count} boenden hittades",
        noStaysFound: "Inga boenden hittades",
        tryChangingFilters: "Prova att ändra filtren.",
    },
    "Dansk": {
        errorTitle: "Noget gik galt",
        errorDescription: "Vi kunne ikke indlæse de tilgængelige overnatningssteder.",
        tryAgain: "Prøv igen",
        searchResultsFor: "Søgeresultater for:",
        resultOne: "{count} overnatningssted fundet",
        resultMany: "{count} overnatningssteder fundet",
        noStaysFound: "Ingen overnatningssteder fundet",
        tryChangingFilters: "Prøv at ændre filtrene.",
    },
    "Suomi": {
        errorTitle: "Jokin meni pieleen",
        errorDescription: "Saatavilla olevia majoituksia ei voitu ladata.",
        tryAgain: "Yritä uudelleen",
        searchResultsFor: "Hakutulokset haulle:",
        resultOne: "{count} majoitus löytyi",
        resultMany: "{count} majoitusta löytyi",
        noStaysFound: "Majoituksia ei löytynyt",
        tryChangingFilters: "Kokeile muuttaa suodattimia.",
    },
    "Polski": {
        errorTitle: "Coś poszło nie tak",
        errorDescription: "Nie udało się wczytać dostępnych obiektów.",
        tryAgain: "Spróbuj ponownie",
        searchResultsFor: "Wyniki wyszukiwania dla:",
        resultOne: "Znaleziono {count} obiekt",
        resultMany: "Znaleziono obiektów: {count}",
        noStaysFound: "Nie znaleziono obiektów",
        tryChangingFilters: "Spróbuj zmienić filtry.",
    },
    "Čeština": {
        errorTitle: "Něco se pokazilo",
        errorDescription: "Dostupná ubytování se nepodařilo načíst.",
        tryAgain: "Zkusit znovu",
        searchResultsFor: "Výsledky hledání pro:",
        resultOne: "Nalezeno {count} ubytování",
        resultMany: "Nalezeno ubytování: {count}",
        noStaysFound: "Nebyla nalezena žádná ubytování",
        tryChangingFilters: "Zkuste změnit filtry.",
    },
    "Slovenčina": {
        errorTitle: "Niečo sa pokazilo",
        errorDescription: "Dostupné ubytovania sa nepodarilo načítať.",
        tryAgain: "Skúsiť znova",
        searchResultsFor: "Výsledky vyhľadávania pre:",
        resultOne: "Nájdené {count} ubytovanie",
        resultMany: "Nájdených ubytovaní: {count}",
        noStaysFound: "Nenašli sa žiadne ubytovania",
        tryChangingFilters: "Skúste zmeniť filtre.",
    },
    "Magyar": {
        errorTitle: "Hiba történt",
        errorDescription: "Nem sikerült betölteni az elérhető szállásokat.",
        tryAgain: "Próbáld újra",
        searchResultsFor: "Keresési eredmények ehhez:",
        resultOne: "{count} szállás található",
        resultMany: "{count} szállás található",
        noStaysFound: "Nem található szállás",
        tryChangingFilters: "Próbáld módosítani a szűrőket.",
    },
    "Български": {
        errorTitle: "Нещо се обърка",
        errorDescription: "Не успяхме да заредим наличните места за настаняване.",
        tryAgain: "Опитайте отново",
        searchResultsFor: "Резултати от търсенето за:",
        resultOne: "Намерено е {count} място за настаняване",
        resultMany: "Намерени места за настаняване: {count}",
        noStaysFound: "Не са намерени места за настаняване",
        tryChangingFilters: "Опитайте да промените филтрите.",
    },
    "Hrvatski": {
        errorTitle: "Nešto je pošlo po zlu",
        errorDescription: "Nismo mogli učitati dostupne smještaje.",
        tryAgain: "Pokušaj ponovno",
        searchResultsFor: "Rezultati pretraživanja za:",
        resultOne: "Pronađen je {count} smještaj",
        resultMany: "Pronađeno smještaja: {count}",
        noStaysFound: "Nije pronađen nijedan smještaj",
        tryChangingFilters: "Pokušajte promijeniti filtre.",
    },
    "Slovenščina": {
        errorTitle: "Nekaj je šlo narobe",
        errorDescription: "Razpoložljivih nastanitev ni bilo mogoče naložiti.",
        tryAgain: "Poskusi znova",
        searchResultsFor: "Rezultati iskanja za:",
        resultOne: "Najdena {count} nastanitev",
        resultMany: "Najdenih nastanitev: {count}",
        noStaysFound: "Nastanitev ni bilo mogoče najti",
        tryChangingFilters: "Poskusite spremeniti filtre.",
    },
    "Srpski": {
        errorTitle: "Nešto je pošlo naopako",
        errorDescription: "Nismo mogli da učitamo dostupne smeštaje.",
        tryAgain: "Pokušaj ponovo",
        searchResultsFor: "Rezultati pretrage za:",
        resultOne: "Pronađen je {count} smeštaj",
        resultMany: "Pronađeno smeštaja: {count}",
        noStaysFound: "Nije pronađen nijedan smeštaj",
        tryChangingFilters: "Pokušajte da promenite filtere.",
    },
    "Bosanski": {
        errorTitle: "Nešto je pošlo po zlu",
        errorDescription: "Nismo mogli učitati dostupne smještaje.",
        tryAgain: "Pokušaj ponovo",
        searchResultsFor: "Rezultati pretrage za:",
        resultOne: "Pronađen je {count} smještaj",
        resultMany: "Pronađeno smještaja: {count}",
        noStaysFound: "Nije pronađen nijedan smještaj",
        tryChangingFilters: "Pokušajte promijeniti filtere.",
    },
    "Ελληνικά": {
        errorTitle: "Κάτι πήγε στραβά",
        errorDescription: "Δεν ήταν δυνατή η φόρτωση των διαθέσιμων καταλυμάτων.",
        tryAgain: "Δοκιμάστε ξανά",
        searchResultsFor: "Αποτελέσματα αναζήτησης για:",
        resultOne: "Βρέθηκε {count} κατάλυμα",
        resultMany: "Βρέθηκαν {count} καταλύματα",
        noStaysFound: "Δεν βρέθηκαν καταλύματα",
        tryChangingFilters: "Δοκιμάστε να αλλάξετε τα φίλτρα.",
    },
    "Türkçe": {
        errorTitle: "Bir şeyler yanlış gitti",
        errorDescription: "Mevcut konaklama yerleri yüklenemedi.",
        tryAgain: "Tekrar dene",
        searchResultsFor: "Arama sonuçları:",
        resultOne: "{count} konaklama yeri bulundu",
        resultMany: "{count} konaklama yeri bulundu",
        noStaysFound: "Konaklama yeri bulunamadı",
        tryChangingFilters: "Filtreleri değiştirmeyi deneyin.",
    },
    "العربية": {
        errorTitle: "حدث خطأ ما",
        errorDescription: "تعذر تحميل أماكن الإقامة المتاحة.",
        tryAgain: "حاول مرة أخرى",
        searchResultsFor: "نتائج البحث عن:",
        resultOne: "تم العثور على مكان إقامة واحد",
        resultMany: "تم العثور على {count} أماكن إقامة",
        noStaysFound: "لم يتم العثور على أماكن إقامة",
        tryChangingFilters: "جرّب تغيير عوامل التصفية.",
    },
    "עברית": {
        errorTitle: "משהו השתבש",
        errorDescription: "לא הצלחנו לטעון את מקומות האירוח הזמינים.",
        tryAgain: "נסה שוב",
        searchResultsFor: "תוצאות חיפוש עבור:",
        resultOne: "נמצא מקום אירוח אחד",
        resultMany: "נמצאו {count} מקומות אירוח",
        noStaysFound: "לא נמצאו מקומות אירוח",
        tryChangingFilters: "נסה לשנות את המסננים.",
    },
    "हिन्दी": {
        errorTitle: "कुछ गलत हो गया",
        errorDescription: "हम उपलब्ध ठहरने के स्थान लोड नहीं कर सके।",
        tryAgain: "फिर से कोशिश करें",
        searchResultsFor: "इसके लिए खोज परिणाम:",
        resultOne: "{count} ठहरने का स्थान मिला",
        resultMany: "{count} ठहरने के स्थान मिले",
        noStaysFound: "कोई ठहरने का स्थान नहीं मिला",
        tryChangingFilters: "फ़िल्टर बदलकर देखें।",
    },
    "ไทย": {
        errorTitle: "เกิดข้อผิดพลาด",
        errorDescription: "ไม่สามารถโหลดที่พักที่มีอยู่ได้",
        tryAgain: "ลองอีกครั้ง",
        searchResultsFor: "ผลการค้นหาสำหรับ:",
        resultOne: "พบที่พัก {count} แห่ง",
        resultMany: "พบที่พัก {count} แห่ง",
        noStaysFound: "ไม่พบที่พัก",
        tryChangingFilters: "ลองเปลี่ยนตัวกรองของคุณ",
    },
    "Bahasa Indonesia": {
        errorTitle: "Terjadi kesalahan",
        errorDescription: "Kami tidak dapat memuat akomodasi yang tersedia.",
        tryAgain: "Coba lagi",
        searchResultsFor: "Hasil pencarian untuk:",
        resultOne: "{count} akomodasi ditemukan",
        resultMany: "{count} akomodasi ditemukan",
        noStaysFound: "Tidak ada akomodasi yang ditemukan",
        tryChangingFilters: "Coba ubah filter Anda.",
    },
    "Tiếng Việt": {
        errorTitle: "Đã xảy ra lỗi",
        errorDescription: "Không thể tải các chỗ nghỉ hiện có.",
        tryAgain: "Thử lại",
        searchResultsFor: "Kết quả tìm kiếm cho:",
        resultOne: "Tìm thấy {count} chỗ nghỉ",
        resultMany: "Tìm thấy {count} chỗ nghỉ",
        noStaysFound: "Không tìm thấy chỗ nghỉ",
        tryChangingFilters: "Hãy thử thay đổi bộ lọc.",
    },
    "한국어": {
        errorTitle: "문제가 발생했습니다",
        errorDescription: "이용 가능한 숙소를 불러올 수 없습니다.",
        tryAgain: "다시 시도",
        searchResultsFor: "검색 결과:",
        resultOne: "숙소 {count}개를 찾았습니다",
        resultMany: "숙소 {count}개를 찾았습니다",
        noStaysFound: "숙소를 찾을 수 없습니다",
        tryChangingFilters: "필터를 변경해 보세요.",
    },
    "日本語": {
        errorTitle: "問題が発生しました",
        errorDescription: "利用可能な宿泊施設を読み込めませんでした。",
        tryAgain: "もう一度試す",
        searchResultsFor: "検索結果:",
        resultOne: "宿泊施設が{count}件見つかりました",
        resultMany: "宿泊施設が{count}件見つかりました",
        noStaysFound: "宿泊施設が見つかりません",
        tryChangingFilters: "フィルターを変更してみてください。",
    },
    "中文": {
        errorTitle: "出现了问题",
        errorDescription: "无法加载可用住宿。",
        tryAgain: "重试",
        searchResultsFor: "搜索结果：",
        resultOne: "找到 {count} 个住宿",
        resultMany: "找到 {count} 个住宿",
        noStaysFound: "未找到住宿",
        tryChangingFilters: "请尝试更改筛选条件。",
    },
    "繁體中文": {
        errorTitle: "發生問題",
        errorDescription: "無法載入可用住宿。",
        tryAgain: "再試一次",
        searchResultsFor: "搜尋結果：",
        resultOne: "找到 {count} 個住宿",
        resultMany: "找到 {count} 個住宿",
        noStaysFound: "找不到住宿",
        tryChangingFilters: "請嘗試變更篩選條件。",
    },
    "Català": {
        errorTitle: "Alguna cosa ha anat malament",
        errorDescription: "No hem pogut carregar els allotjaments disponibles.",
        tryAgain: "Torna-ho a provar",
        searchResultsFor: "Resultats de cerca per a:",
        resultOne: "S'ha trobat {count} allotjament",
        resultMany: "S'han trobat {count} allotjaments",
        noStaysFound: "No s'han trobat allotjaments",
        tryChangingFilters: "Prova de canviar els filtres.",
    },
    "Eesti": {
        errorTitle: "Midagi läks valesti",
        errorDescription: "Saadaolevaid majutuskohti ei õnnestunud laadida.",
        tryAgain: "Proovi uuesti",
        searchResultsFor: "Otsingutulemused päringule:",
        resultOne: "Leiti {count} majutuskoht",
        resultMany: "Leiti {count} majutuskohta",
        noStaysFound: "Majutuskohti ei leitud",
        tryChangingFilters: "Proovi filtreid muuta.",
    },
    "Latviešu": {
        errorTitle: "Radās kļūda",
        errorDescription: "Neizdevās ielādēt pieejamās naktsmītnes.",
        tryAgain: "Mēģināt vēlreiz",
        searchResultsFor: "Meklēšanas rezultāti:",
        resultOne: "Atrasta {count} naktsmītne",
        resultMany: "Atrastas {count} naktsmītnes",
        noStaysFound: "Naktsmītnes nav atrastas",
        tryChangingFilters: "Mēģiniet mainīt filtrus.",
    },
    "Lietuvių": {
        errorTitle: "Kažkas nepavyko",
        errorDescription: "Nepavyko įkelti galimų apgyvendinimo vietų.",
        tryAgain: "Bandyti dar kartą",
        searchResultsFor: "Paieškos rezultatai:",
        resultOne: "Rasta {count} apgyvendinimo vieta",
        resultMany: "Rasta apgyvendinimo vietų: {count}",
        noStaysFound: "Apgyvendinimo vietų nerasta",
        tryChangingFilters: "Pabandykite pakeisti filtrus.",
    },
};

function getStaysPageText(
    language: string,
    key: StaysPageTextKey
) {
    const selectedLanguage = language.split("|")[0];

    return (
        staysPageTranslations[selectedLanguage]?.[key] ??
        staysPageTranslations.English[key]
    );
}

function formatStaysPageText(
    language: string,
    key: StaysPageTextKey,
    count: number
) {
    return getStaysPageText(language, key).replace(
        "{count}",
        String(count)
    );
}

export default function StaysPage() {
    const { language, currency } = useSettings();

    const selectedCurrencyInfo =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    // =========================================
    // INITIAL DATA
    // =========================================

    const [allProperties, setAllProperties] =
        useState<Property[]>(mockProperties);

    const [availableDestinations, setAvailableDestinations] =
        useState(() => {
            try {
                return getDestinations();
            } catch {
                return [];
            }
        });

    const [isLoading, setIsLoading] =
        useState(false);

    const [hasError, setHasError] =
        useState(false);

    // =========================================
    // DESTINATION FROM URL
    // =========================================

    const [destinationName, setDestinationName] =
        useState<string | null>(null);

    useEffect(() => {
        try {
            const params = new URLSearchParams(
                window.location.search
            );

            setDestinationName(
                params.get("destination")
            );
        } catch {
            setDestinationName(null);
        }
    }, []);

    // =========================================
    // LOAD PROPERTIES FROM BACKEND
    // =========================================

    useEffect(() => {
        let mounted = true;

        const loadProperties = async () => {
            setIsLoading(true);

            try {
                const loadedProperties =
                    await getPropertiesFromApi();

                const loadedDestinations =
                    getDestinations();

                if (!mounted) {
                    return;
                }

                setAllProperties(
                    loadedProperties
                );

                setAvailableDestinations(
                    loadedDestinations
                );

                setHasError(false);
            } catch {
                if (!mounted) {
                    return;
                }

                /*
                 * Keep the last local copy as a fallback so the page
                 * remains usable if the API is temporarily unavailable.
                 */
                const fallbackProperties =
                    getProperties();

                setAllProperties(
                    fallbackProperties.length > 0
                        ? fallbackProperties
                        : mockProperties
                );

                setHasError(false);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadProperties();

        return () => {
            mounted = false;
        };
    }, []);

    // =========================================
    // DESTINATION ALIASES
    // =========================================

    const destinationAliases: Record<
        string,
        string
    > = {
        paris: "Paris",
        pariz: "Paris",
        париж: "Paris",

        rome: "Rome",
        roma: "Rome",
        рим: "Rome",

        barcelona: "Barcelona",
        барселона: "Barcelona",
    };

    const countryAliases: Record<
        string,
        string
    > = {
        france: "France",
        franța: "France",
        franta: "France",
        франция: "France",

        italy: "Italy",
        italia: "Italy",
        италия: "Italy",

        spain: "Spain",
        españa: "Spain",
        espana: "Spain",
        spania: "Spain",
        испания: "Spain",
    };

    const normalizedDestination =
        destinationName
            ?.trim()
            .toLowerCase();

    const destinationInEnglish =
        normalizedDestination
            ? destinationAliases[
                normalizedDestination
                ]
            : undefined;

    const countryInEnglish =
        normalizedDestination
            ? (
                availableDestinations.find(
                    (destination) =>
                        getLocalizedCountryName(
                            destination.country,
                            language
                        )
                            .trim()
                            .toLowerCase() ===
                        normalizedDestination
                )?.country ??
                countryAliases[
                    normalizedDestination
                    ]
            )
            : undefined;

    const selectedDestination =
        availableDestinations.find(
            (destination) =>
                destination.name
                    .trim()
                    .toLowerCase() ===
                (
                    destinationInEnglish ??
                    normalizedDestination ??
                    ""
                ).toLowerCase()
        );

    // =========================================
    // FILTER STATE
    // =========================================

    const [selectedCountry, setSelectedCountry] =
        useState("");

    const [selectedCity, setSelectedCity] =
        useState("");

    const [minPrice, setMinPrice] =
        useState("");

    const [maxPrice, setMaxPrice] =
        useState("");

    const [hotelSearch, setHotelSearch] =
        useState("");

    const [sortBy, setSortBy] =
        useState("default");

    // =========================================
    // INITIAL DESTINATION FILTER
    // =========================================

    useEffect(() => {
        if (selectedDestination) {
            setSelectedCountry(
                selectedDestination.country
            );

            setSelectedCity(
                selectedDestination.name
            );

            return;
        }

        if (!normalizedDestination) {
            return;
        }

        const matchingCountry =
            availableDestinations.find(
                (destination) =>
                    getLocalizedCountryName(
                        destination.country,
                        language
                    )
                        .trim()
                        .toLowerCase() ===
                    normalizedDestination
            );

        if (matchingCountry) {
            setSelectedCountry(
                matchingCountry.country
            );

            setSelectedCity("");
        }
    }, [
        selectedDestination,
        normalizedDestination,
        availableDestinations,
        language,
    ]);

    // =========================================
    // VISIBLE DESTINATIONS
    // =========================================

    const visibleDestinations =
        useMemo(() => {
            return availableDestinations.filter(
                (destination) =>
                    allProperties.some(
                        (property) =>
                            property.destinationId ===
                            destination.id
                    )
            );
        }, [
            availableDestinations,
            allProperties,
        ]);

    // =========================================
    // COUNTRIES
    // =========================================

    const countries =
        useMemo(() => {
            return Array.from(
                new Set(
                    visibleDestinations.map(
                        (destination) =>
                            destination.country
                    )
                )
            ).sort();
        }, [
            visibleDestinations,
        ]);

    // =========================================
    // CITIES
    // =========================================

    const availableCities =
        useMemo(() => {
            return visibleDestinations
                .filter(
                    (destination) =>
                        selectedCountry
                            ? destination.country ===
                            selectedCountry
                            : true
                )
                .map(
                    (destination) =>
                        destination.name
                )
                .sort();
        }, [
            visibleDestinations,
            selectedCountry,
        ]);

    // =========================================
    // FILTER + SORT
    // =========================================

    const filteredProperties =
        useMemo(() => {
            let result = [
                ...allProperties,
            ];

            // SearchBar destination
            if (selectedDestination) {
                result =
                    result.filter(
                        (property) =>
                            property.destinationId ===
                            selectedDestination.id
                    );
            }

            // Hotel name search
            if (hotelSearch.trim()) {
                const normalizedHotelSearch =
                    hotelSearch.trim().toLowerCase();

                result =
                    result.filter(
                        (property) =>
                            property.name
                                .toLowerCase()
                                .includes(
                                    normalizedHotelSearch
                                )
                    );
            }

            // Country
            if (selectedCountry) {
                const countryDestinationIds =
                    availableDestinations
                        .filter(
                            (destination) =>
                                destination.country ===
                                selectedCountry
                        )
                        .map(
                            (destination) =>
                                destination.id
                        );

                result =
                    result.filter(
                        (property) =>
                            countryDestinationIds.includes(
                                property.destinationId
                            )
                    );
            }

            // City
            if (selectedCity) {
                const cityDestination =
                    availableDestinations.find(
                        (destination) =>
                            destination.name ===
                            selectedCity
                    );

                if (cityDestination) {
                    result =
                        result.filter(
                            (property) =>
                                property.destinationId ===
                                cityDestination.id
                        );
                }
            }

            // Minimum price
            if (minPrice) {
                result =
                    result.filter(
                        (property) =>
                            property.pricePerNight >=
                            Number(minPrice) /
                            selectedCurrencyInfo.rate
                    );
            }

            // Maximum price
            if (maxPrice) {
                result =
                    result.filter(
                        (property) =>
                            property.pricePerNight <=
                            Number(maxPrice) /
                            selectedCurrencyInfo.rate
                    );
            }

            // Sort
            if (sortBy === "price-low") {
                result.sort(
                    (a, b) =>
                        a.pricePerNight -
                        b.pricePerNight
                );
            }

            if (sortBy === "price-high") {
                result.sort(
                    (a, b) =>
                        b.pricePerNight -
                        a.pricePerNight
                );
            }

            // Minimum stars
            if (sortBy === "stars-low") {
                result.sort(
                    (a, b) =>
                        a.stars -
                        b.stars
                );
            }

            // Maximum stars
            if (sortBy === "stars-high") {
                result.sort(
                    (a, b) =>
                        b.stars -
                        a.stars
                );
            }

            return result;
        }, [
            allProperties,
            availableDestinations,
            selectedDestination,
            selectedCountry,
            selectedCity,
            minPrice,
            maxPrice,
            hotelSearch,
            sortBy,
            selectedCurrencyInfo.rate,
        ]);

    // =========================================
    // RESET FILTERS
    // =========================================

    const handleResetFilters =
        useCallback(() => {
            setSelectedCountry("");
            setSelectedCity("");
            setMinPrice("");
            setMaxPrice("");
            setHotelSearch("");
            setSortBy("default");
        }, []);

    // =========================================
    // COUNTRY CHANGE
    // =========================================

    const handleCountryChange =
        useCallback(
            (value: string) => {
                setSelectedCountry(value);

                if (!value) {
                    setSelectedCity("");
                    return;
                }

                const firstCity =
                    availableDestinations.find(
                        (destination) =>
                            destination.country ===
                            value
                    )?.name ?? "";

                setSelectedCity(
                    firstCity
                );
            },
            [
                availableDestinations,
            ]
        );

    // =========================================
    // ERROR
    // =========================================

    if (hasError) {
        return (
            <main>
                <section className="section">
                    <div className="container">

                        <div className="no-stays stayway-load-in stayway-load-1">
                            <h2>
                                {getStaysPageText(
                                    language,
                                    "errorTitle"
                                )}
                            </h2>

                            <p>
                                {getStaysPageText(
                                    language,
                                    "errorDescription"
                                )}
                            </p>

                            <button
                                type="button"
                                className="reset-filters-button"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                {getStaysPageText(
                                    language,
                                    "tryAgain"
                                )}
                            </button>
                        </div>

                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section className="section">
                <div className="container">

                    {/* PAGE TITLE */}

                    <p className="admin-label stays-page-label stayway-load-in stayway-load-1">
                        STAYWAY
                    </p>

                    <h1
                        className="page-title stayway-load-in stayway-load-2"
                        style={{
                            fontSize: "42px",
                            lineHeight: 1.1,
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            margin: 0,
                        }}
                    >
                        {getTranslation(
                            language,
                            "findYourPerfectStay"
                        )}
                    </h1>

                    <p className="admin-description stayway-load-in stayway-load-3">
                        {getTranslation(
                            language,
                            "staysDescription"
                        )}
                    </p>

                    {destinationName && (
                        <p className="stays-search-result stayway-load-in stayway-load-4">
                            {getStaysPageText(
                                language,
                                "searchResultsFor"
                            )}{" "}
                            <strong>
                                {destinationName}
                            </strong>
                        </p>
                    )}

                    {/* FILTERS */}

                    <div className="stays-filters stayway-load-in stayway-load-5">

                        {/* HOTEL NAME SEARCH */}

                        <div className="filter-group">
                            <label htmlFor="hotel-search">
                                {getTranslation(
                                    language,
                                    "hotelName"
                                )}
                            </label>

                            <input
                                id="hotel-search"
                                type="text"
                                placeholder={getTranslation(
                                    language,
                                    "searchByHotelName"
                                )}
                                value={
                                    hotelSearch
                                }
                                onChange={(event) =>
                                    setHotelSearch(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        {/* COUNTRY */}

                        <div className="filter-group">
                            <label htmlFor="country">
                                {getFilterTranslation(
                                    language,
                                    "country"
                                )}
                            </label>

                            <select
                                id="country"
                                value={
                                    selectedCountry
                                }
                                onChange={(event) =>
                                    handleCountryChange(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    {getFilterTranslation(
                                        language,
                                        "country"
                                    )}
                                </option>

                                {countries.map(
                                    (country) => (
                                        <option
                                            key={
                                                country
                                            }
                                            value={
                                                country
                                            }
                                        >
                                            {getLocalizedCountryName(
                                                country,
                                                language
                                            )}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* CITY */}

                        <div className="filter-group">
                            <label htmlFor="city">
                                {getFilterTranslation(
                                    language,
                                    "city"
                                )}
                            </label>

                            <select
                                id="city"
                                value={
                                    selectedCity
                                }
                                onChange={(event) =>
                                    setSelectedCity(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    {getFilterTranslation(
                                        language,
                                        "city"
                                    )}
                                </option>

                                {availableCities.map(
                                    (city) => (
                                        <option
                                            key={
                                                city
                                            }
                                            value={
                                                city
                                            }
                                        >
                                            {getLocalizedCityName(
                                                city,
                                                language
                                            )}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* MIN PRICE */}

                        <div className="filter-group">
                            <label htmlFor="min-price">
                                {getFilterTranslation(
                                    language,
                                    "minimumPrice"
                                )}
                            </label>

                            <input
                                id="min-price"
                                type="number"
                                min="0"
                                placeholder={`${selectedCurrencyInfo.symbol}0`}
                                value={
                                    minPrice
                                }
                                onChange={(event) =>
                                    setMinPrice(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        {/* MAX PRICE */}

                        <div className="filter-group">
                            <label htmlFor="max-price">
                                {getFilterTranslation(
                                    language,
                                    "maximumPrice"
                                )}
                            </label>

                            <input
                                id="max-price"
                                type="number"
                                min="0"
                                placeholder={`${selectedCurrencyInfo.symbol}1000`}
                                value={
                                    maxPrice
                                }
                                onChange={(event) =>
                                    setMaxPrice(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        {/* SORT */}

                        <div className="filter-group">
                            <label htmlFor="sort">
                                {getFilterTranslation(
                                    language,
                                    "sortBy"
                                )}
                            </label>

                            <select
                                id="sort"
                                value={
                                    sortBy
                                }
                                onChange={(event) =>
                                    setSortBy(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="default">
                                    {getFilterTranslation(
                                        language,
                                        "recommended"
                                    )}
                                </option>

                                <option value="price-low">
                                    {getFilterTranslation(
                                        language,
                                        "priceLow"
                                    )}
                                </option>

                                <option value="price-high">
                                    {getFilterTranslation(
                                        language,
                                        "priceHigh"
                                    )}
                                </option>

                                <option value="stars-low">
                                    {getTranslation(
                                        language,
                                        "minimumStars"
                                    )}
                                </option>

                                <option value="stars-high">
                                    {getTranslation(
                                        language,
                                        "maximumStars"
                                    )}
                                </option>
                            </select>
                        </div>

                        {/* RESET */}

                        <button
                            type="button"
                            className="reset-filters-button"
                            onClick={
                                handleResetFilters
                            }
                        >
                            {getFilterTranslation(
                                language,
                                "resetFilters"
                            )}
                        </button>
                    </div>

                    {/* RESULTS */}

                    <p className="stays-results-count stayway-load-in stayway-load-6">
                        {formatStaysPageText(
                            language,
                            filteredProperties.length === 1
                                ? "resultOne"
                                : "resultMany",
                            filteredProperties.length
                        )}
                    </p>

                    {filteredProperties.length >
                    0 ? (
                        <div className="property-grid stayway-load-in stayway-load-7">

                            {filteredProperties.map(
                                (
                                    property
                                ) => (
                                    <div
                                        key={
                                            property.id
                                        }
                                    >
                                        <PropertyCard
                                            property={
                                                property
                                            }
                                        />
                                    </div>
                                )
                            )}

                        </div>
                    ) : (
                        <div className="no-stays stayway-load-in stayway-load-7">

                            <h2>
                                {getStaysPageText(
                                    language,
                                    "noStaysFound"
                                )}
                            </h2>

                            <p>
                                {getStaysPageText(
                                    language,
                                    "tryChangingFilters"
                                )}
                            </p>

                            <button
                                type="button"
                                className="reset-filters-button"
                                onClick={
                                    handleResetFilters
                                }
                            >
                                {getFilterTranslation(
                                    language,
                                    "resetFilters"
                                )}
                            </button>

                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
