"use client";

import { useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";

type LanguageCurrencyModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const languages = [
    ["English", "United States"],
    ["English", "United Kingdom"],
    ["English", "Australia"],
    ["English", "Canada"],
    ["English", "India"],
    ["English", "Ireland"],
    ["English", "New Zealand"],
    ["English", "Singapore"],
    ["English", "United Arab Emirates"],
    ["Română", "România"],
    ["Русский", "Россия"],
    ["Українська", "Україна"],
    ["Français", "France"],
    ["Français", "Canada"],
    ["Español", "España"],
    ["Español", "México"],
    ["Español", "Argentina"],
    ["Deutsch", "Deutschland"],
    ["Deutsch", "Österreich"],
    ["Deutsch", "Schweiz"],
    ["Italiano", "Italia"],
    ["Português", "Portugal"],
    ["Português", "Brasil"],
    ["Nederlands", "Nederland"],
    ["Norsk", "Norge"],
    ["Svenska", "Sverige"],
    ["Dansk", "Danmark"],
    ["Suomi", "Suomi"],
    ["Polski", "Polska"],
    ["Čeština", "Česká republika"],
    ["Slovenčina", "Slovensko"],
    ["Magyar", "Magyarország"],
    ["Български", "България"],
    ["Hrvatski", "Hrvatska"],
    ["Slovenščina", "Slovenija"],
    ["Srpski", "Srbija"],
    ["Bosanski", "Bosna i Hercegovina"],
    ["Ελληνικά", "Ελλάδα"],
    ["Türkçe", "Türkiye"],
    ["العربية", "العربية"],
    ["עברית", "ישראל"],
    ["हिन्दी", "भारत"],
    ["ไทย", "ประเทศไทย"],
    ["Bahasa Indonesia", "Indonesia"],
    ["Tiếng Việt", "Việt Nam"],
    ["한국어", "대한민국"],
    ["日本語", "日本"],
    ["中文", "中国"],
    ["繁體中文", "台灣"],
    ["Català", "Espanya"],
    ["Eesti", "Eesti"],
    ["Latviešu", "Latvija"],
    ["Lietuvių", "Lietuva"],
];

const currencies = [
    ["United States dollar", "USD — $"],
    ["Australian dollar", "AUD — $"],
    ["Brazilian real", "BRL — R$"],
    ["Bulgarian lev", "BGN — лв."],
    ["Canadian dollar", "CAD — $"],
    ["Chilean peso", "CLP — $"],
    ["Chinese yuan", "CNY — ¥"],
    ["Colombian peso", "COP — $"],
    ["Costa Rican colón", "CRC — ₡"],
    ["Czech koruna", "CZK — Kč"],
    ["Danish krone", "DKK — kr"],
    ["Egyptian pound", "EGP — E£"],
    ["Emirati dirham", "AED — د.إ"],
    ["Euro", "EUR — €"],
    ["Ghanaian cedi", "GHS — GH₵"],
    ["Hong Kong dollar", "HKD — $"],
    ["Hungarian forint", "HUF — Ft"],
    ["Indian rupee", "INR — ₹"],
    ["Indonesian rupiah", "IDR — Rp"],
    ["Israeli new shekel", "ILS — ₪"],
    ["Japanese yen", "JPY — ¥"],
    ["Kazakhstani tenge", "KZT — ₸"],
    ["Kenyan shilling", "KES — KSh"],
    ["Malaysian ringgit", "MYR — RM"],
    ["Mexican peso", "MXN — $"],
    ["Moroccan dirham", "MAD"],
    ["New Taiwan dollar", "TWD — $"],
    ["New Zealand dollar", "NZD — $"],
    ["Norwegian krone", "NOK — kr"],
    ["Peruvian sol", "PEN — S/"],
    ["Philippine peso", "PHP — ₱"],
    ["Polish zloty", "PLN — zł"],
    ["Pound sterling", "GBP — £"],
    ["Qatari riyal", "QAR — ر.ق"],
    ["Romanian leu", "RON — lei"],
    ["Russian ruble", "RUB — ₽"],
    ["Saudi Arabian riyal", "SAR — ﷼"],
    ["Singapore dollar", "SGD — $"],
    ["South African rand", "ZAR — R"],
    ["South Korean won", "KRW — ₩"],
    ["Swedish krona", "SEK — kr"],
    ["Swiss franc", "CHF"],
    ["Thai baht", "THB — ฿"],
    ["Turkish lira", "TRY — ₺"],
    ["Ugandan shilling", "UGX — USh"],
    ["Ukrainian hryvnia", "UAH — ₴"],
];

type ModalText = {
    languageTab: string;
    currencyTab: string;
    suggested: string;
    chooseLanguage: string;
    chooseCurrency: string;
    save: string;
    close: string;
};

const modalTranslations: Record<string, ModalText> = {
    English: {
        languageTab: "Language and region",
        currencyTab: "Currency",
        suggested: "Suggested languages and regions",
        chooseLanguage: "Choose a language and region",
        chooseCurrency: "Choose a currency",
        save: "Save",
        close: "Close",
    },
    Română: {
        languageTab: "Limbă și regiune",
        currencyTab: "Monedă",
        suggested: "Limbi și regiuni sugerate",
        chooseLanguage: "Alege limba și regiunea",
        chooseCurrency: "Alege moneda",
        save: "Salvează",
        close: "Închide",
    },
    Русский: {
        languageTab: "Язык и регион",
        currencyTab: "Валюта",
        suggested: "Рекомендуемые языки и регионы",
        chooseLanguage: "Выберите язык и регион",
        chooseCurrency: "Выберите валюту",
        save: "Сохранить",
        close: "Закрыть",
    },
    Українська: {
        languageTab: "Мова та регіон",
        currencyTab: "Валюта",
        suggested: "Рекомендовані мови та регіони",
        chooseLanguage: "Виберіть мову та регіон",
        chooseCurrency: "Виберіть валюту",
        save: "Зберегти",
        close: "Закрити",
    },
    Français: {
        languageTab: "Langue et région",
        currencyTab: "Devise",
        suggested: "Langues et régions suggérées",
        chooseLanguage: "Choisissez une langue et une région",
        chooseCurrency: "Choisissez une devise",
        save: "Enregistrer",
        close: "Fermer",
    },
    Español: {
        languageTab: "Idioma y región",
        currencyTab: "Moneda",
        suggested: "Idiomas y regiones sugeridos",
        chooseLanguage: "Elige un idioma y una región",
        chooseCurrency: "Elige una moneda",
        save: "Guardar",
        close: "Cerrar",
    },
    Deutsch: {
        languageTab: "Sprache und Region",
        currencyTab: "Währung",
        suggested: "Vorgeschlagene Sprachen und Regionen",
        chooseLanguage: "Sprache und Region auswählen",
        chooseCurrency: "Währung auswählen",
        save: "Speichern",
        close: "Schließen",
    },
    Italiano: {
        languageTab: "Lingua e regione",
        currencyTab: "Valuta",
        suggested: "Lingue e regioni suggerite",
        chooseLanguage: "Scegli una lingua e una regione",
        chooseCurrency: "Scegli una valuta",
        save: "Salva",
        close: "Chiudi",
    },
    Português: {
        languageTab: "Idioma e região",
        currencyTab: "Moeda",
        suggested: "Idiomas e regiões sugeridos",
        chooseLanguage: "Escolha um idioma e uma região",
        chooseCurrency: "Escolha uma moeda",
        save: "Guardar",
        close: "Fechar",
    },
    Nederlands: {
        languageTab: "Taal en regio",
        currencyTab: "Valuta",
        suggested: "Voorgestelde talen en regio's",
        chooseLanguage: "Kies een taal en regio",
        chooseCurrency: "Kies een valuta",
        save: "Opslaan",
        close: "Sluiten",
    },
    Norsk: {
        languageTab: "Språk og region",
        currencyTab: "Valuta",
        suggested: "Foreslåtte språk og regioner",
        chooseLanguage: "Velg språk og region",
        chooseCurrency: "Velg valuta",
        save: "Lagre",
        close: "Lukk",
    },
    Svenska: {
        languageTab: "Språk och region",
        currencyTab: "Valuta",
        suggested: "Föreslagna språk och regioner",
        chooseLanguage: "Välj språk och region",
        chooseCurrency: "Välj valuta",
        save: "Spara",
        close: "Stäng",
    },
    Dansk: {
        languageTab: "Sprog og region",
        currencyTab: "Valuta",
        suggested: "Foreslåede sprog og regioner",
        chooseLanguage: "Vælg sprog og region",
        chooseCurrency: "Vælg valuta",
        save: "Gem",
        close: "Luk",
    },
    Suomi: {
        languageTab: "Kieli ja alue",
        currencyTab: "Valuutta",
        suggested: "Suositellut kielet ja alueet",
        chooseLanguage: "Valitse kieli ja alue",
        chooseCurrency: "Valitse valuutta",
        save: "Tallenna",
        close: "Sulje",
    },
    Polski: {
        languageTab: "Język i region",
        currencyTab: "Waluta",
        suggested: "Sugerowane języki i regiony",
        chooseLanguage: "Wybierz język i region",
        chooseCurrency: "Wybierz walutę",
        save: "Zapisz",
        close: "Zamknij",
    },
    Čeština: {
        languageTab: "Jazyk a region",
        currencyTab: "Měna",
        suggested: "Doporučené jazyky a regiony",
        chooseLanguage: "Vyberte jazyk a region",
        chooseCurrency: "Vyberte měnu",
        save: "Uložit",
        close: "Zavřít",
    },
    Slovenčina: {
        languageTab: "Jazyk a región",
        currencyTab: "Mena",
        suggested: "Odporúčané jazyky a regióny",
        chooseLanguage: "Vyberte jazyk a región",
        chooseCurrency: "Vyberte menu",
        save: "Uložiť",
        close: "Zavrieť",
    },
    Magyar: {
        languageTab: "Nyelv és régió",
        currencyTab: "Pénznem",
        suggested: "Javasolt nyelvek és régiók",
        chooseLanguage: "Válasszon nyelvet és régiót",
        chooseCurrency: "Válasszon pénznemet",
        save: "Mentés",
        close: "Bezárás",
    },
    Български: {
        languageTab: "Език и регион",
        currencyTab: "Валута",
        suggested: "Предложени езици и региони",
        chooseLanguage: "Изберете език и регион",
        chooseCurrency: "Изберете валута",
        save: "Запази",
        close: "Затвори",
    },
    Hrvatski: {
        languageTab: "Jezik i regija",
        currencyTab: "Valuta",
        suggested: "Predloženi jezici i regije",
        chooseLanguage: "Odaberite jezik i regiju",
        chooseCurrency: "Odaberite valutu",
        save: "Spremi",
        close: "Zatvori",
    },
    Slovenščina: {
        languageTab: "Jezik in regija",
        currencyTab: "Valuta",
        suggested: "Predlagani jeziki in regije",
        chooseLanguage: "Izberite jezik in regijo",
        chooseCurrency: "Izberite valuto",
        save: "Shrani",
        close: "Zapri",
    },
    Srpski: {
        languageTab: "Jezik i region",
        currencyTab: "Valuta",
        suggested: "Predloženi jezici i regioni",
        chooseLanguage: "Izaberite jezik i region",
        chooseCurrency: "Izaberite valutu",
        save: "Sačuvaj",
        close: "Zatvori",
    },
    Bosanski: {
        languageTab: "Jezik i regija",
        currencyTab: "Valuta",
        suggested: "Predloženi jezici i regije",
        chooseLanguage: "Odaberite jezik i regiju",
        chooseCurrency: "Odaberite valutu",
        save: "Sačuvaj",
        close: "Zatvori",
    },
    Ελληνικά: {
        languageTab: "Γλώσσα και περιοχή",
        currencyTab: "Νόμισμα",
        suggested: "Προτεινόμενες γλώσσες και περιοχές",
        chooseLanguage: "Επιλέξτε γλώσσα και περιοχή",
        chooseCurrency: "Επιλέξτε νόμισμα",
        save: "Αποθήκευση",
        close: "Κλείσιμο",
    },
    Türkçe: {
        languageTab: "Dil ve bölge",
        currencyTab: "Para birimi",
        suggested: "Önerilen diller ve bölgeler",
        chooseLanguage: "Dil ve bölge seçin",
        chooseCurrency: "Para birimi seçin",
        save: "Kaydet",
        close: "Kapat",
    },
    العربية: {
        languageTab: "اللغة والمنطقة",
        currencyTab: "العملة",
        suggested: "اللغات والمناطق المقترحة",
        chooseLanguage: "اختر اللغة والمنطقة",
        chooseCurrency: "اختر العملة",
        save: "حفظ",
        close: "إغلاق",
    },
    עברית: {
        languageTab: "שפה ואזור",
        currencyTab: "מטבע",
        suggested: "שפות ואזורים מוצעים",
        chooseLanguage: "בחרו שפה ואזור",
        chooseCurrency: "בחרו מטבע",
        save: "שמירה",
        close: "סגירה",
    },
    हिन्दी: {
        languageTab: "भाषा और क्षेत्र",
        currencyTab: "मुद्रा",
        suggested: "सुझाई गई भाषाएँ और क्षेत्र",
        chooseLanguage: "भाषा और क्षेत्र चुनें",
        chooseCurrency: "मुद्रा चुनें",
        save: "सहेजें",
        close: "बंद करें",
    },
    ไทย: {
        languageTab: "ภาษาและภูมิภาค",
        currencyTab: "สกุลเงิน",
        suggested: "ภาษาและภูมิภาคที่แนะนำ",
        chooseLanguage: "เลือกภาษาและภูมิภาค",
        chooseCurrency: "เลือกสกุลเงิน",
        save: "บันทึก",
        close: "ปิด",
    },
    "Bahasa Indonesia": {
        languageTab: "Bahasa dan wilayah",
        currencyTab: "Mata uang",
        suggested: "Bahasa dan wilayah yang disarankan",
        chooseLanguage: "Pilih bahasa dan wilayah",
        chooseCurrency: "Pilih mata uang",
        save: "Simpan",
        close: "Tutup",
    },
    "Tiếng Việt": {
        languageTab: "Ngôn ngữ và khu vực",
        currencyTab: "Tiền tệ",
        suggested: "Ngôn ngữ và khu vực được đề xuất",
        chooseLanguage: "Chọn ngôn ngữ và khu vực",
        chooseCurrency: "Chọn loại tiền tệ",
        save: "Lưu",
        close: "Đóng",
    },
    "한국어": {
        languageTab: "언어 및 지역",
        currencyTab: "통화",
        suggested: "추천 언어 및 지역",
        chooseLanguage: "언어 및 지역 선택",
        chooseCurrency: "통화 선택",
        save: "저장",
        close: "닫기",
    },
    "日本語": {
        languageTab: "言語と地域",
        currencyTab: "通貨",
        suggested: "おすすめの言語と地域",
        chooseLanguage: "言語と地域を選択",
        chooseCurrency: "通貨を選択",
        save: "保存",
        close: "閉じる",
    },
    中文: {
        languageTab: "语言和地区",
        currencyTab: "货币",
        suggested: "推荐的语言和地区",
        chooseLanguage: "选择语言和地区",
        chooseCurrency: "选择货币",
        save: "保存",
        close: "关闭",
    },
    繁體中文: {
        languageTab: "語言與地區",
        currencyTab: "貨幣",
        suggested: "推薦的語言與地區",
        chooseLanguage: "選擇語言與地區",
        chooseCurrency: "選擇貨幣",
        save: "儲存",
        close: "關閉",
    },
    Català: {
        languageTab: "Idioma i regió",
        currencyTab: "Moneda",
        suggested: "Idiomes i regions suggerits",
        chooseLanguage: "Tria un idioma i una regió",
        chooseCurrency: "Tria una moneda",
        save: "Desa",
        close: "Tanca",
    },
    Eesti: {
        languageTab: "Keel ja piirkond",
        currencyTab: "Valuuta",
        suggested: "Soovitatud keeled ja piirkonnad",
        chooseLanguage: "Vali keel ja piirkond",
        chooseCurrency: "Vali valuuta",
        save: "Salvesta",
        close: "Sulge",
    },
    Latviešu: {
        languageTab: "Valoda un reģions",
        currencyTab: "Valūta",
        suggested: "Ieteiktās valodas un reģioni",
        chooseLanguage: "Izvēlieties valodu un reģionu",
        chooseCurrency: "Izvēlieties valūtu",
        save: "Saglabāt",
        close: "Aizvērt",
    },
    Lietuvių: {
        languageTab: "Kalba ir regionas",
        currencyTab: "Valiuta",
        suggested: "Siūlomos kalbos ir regionai",
        chooseLanguage: "Pasirinkite kalbą ir regioną",
        chooseCurrency: "Pasirinkite valiutą",
        save: "Išsaugoti",
        close: "Uždaryti",
    },
};

const fallbackModalText = modalTranslations.English;

export default function LanguageCurrencyModal({
                                                  isOpen,
                                                  onClose,
                                              }: LanguageCurrencyModalProps) {
    const {
        language,
        currency,
        setLanguage,
        setCurrency,
    } = useSettings();

    const [activeTab, setActiveTab] =
        useState<"language" | "currency">("language");

    const [selectedLanguage, setSelectedLanguage] =
        useState(language);

    const [selectedCurrency, setSelectedCurrency] =
        useState(currency);

    useEffect(() => {
        if (isOpen) {
            setSelectedLanguage(language);
            setSelectedCurrency(currency);
        }
    }, [isOpen, language, currency]);

    if (!isOpen) {
        return null;
    }

    const currentLanguage = language.split("|")[0];
    const t =
        modalTranslations[currentLanguage] ?? fallbackModalText;

    const handleSave = () => {
        setLanguage(selectedLanguage);
        setCurrency(selectedCurrency);
        onClose();
    };

    return (
        <div
            className="language-modal-overlay"
            onClick={onClose}
        >
            <div
                className="language-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {/* CLOSE */}
                <button
                    type="button"
                    className="language-modal-close"
                    onClick={onClose}
                    aria-label={t.close}
                >
                    ×
                </button>

                {/* TABS */}
                <div className="language-modal-tabs">
                    <button
                        type="button"
                        className={
                            activeTab === "language"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("language")
                        }
                    >
                        {t.languageTab}
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "currency"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("currency")
                        }
                    >
                        {t.currencyTab}
                    </button>
                </div>

                {/* LANGUAGE TAB */}
                {activeTab === "language" ? (
                    <div className="language-modal-content">
                        {/* SUGGESTED */}
                        <h2>{t.suggested}</h2>

                        <div className="suggested-languages">
                            {[
                                ["English", "United States"],
                                ["English", "United Kingdom"],
                                ["Русский", "Россия"],
                                ["Română", "România"],
                            ].map(
                                ([languageName, region]) => {
                                    const value =
                                        `${languageName}|${region}`;

                                    return (
                                        <button
                                            type="button"
                                            key={value}
                                            className={
                                                selectedLanguage ===
                                                value
                                                    ? "selected"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setSelectedLanguage(
                                                    value
                                                )
                                            }
                                        >
                                            <strong>
                                                {languageName}
                                            </strong>

                                            <span>
                                                {region}
                                            </span>
                                        </button>
                                    );
                                }
                            )}
                        </div>

                        {/* ALL LANGUAGES */}
                        <h2>{t.chooseLanguage}</h2>

                        <div className="language-grid">
                            {languages.map(
                                ([languageName, region]) => {
                                    const value =
                                        `${languageName}|${region}`;

                                    return (
                                        <button
                                            type="button"
                                            key={value}
                                            className={
                                                selectedLanguage ===
                                                value
                                                    ? "selected"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setSelectedLanguage(
                                                    value
                                                )
                                            }
                                        >
                                            <strong>
                                                {languageName}
                                            </strong>

                                            <span>
                                                {region}
                                            </span>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>
                ) : (
                    /* CURRENCY TAB */
                    <div className="language-modal-content">
                        <h2>{t.chooseCurrency}</h2>

                        <div className="currency-grid">
                            {currencies.map(
                                ([currencyName, code]) => (
                                    <button
                                        type="button"
                                        key={currencyName}
                                        className={
                                            selectedCurrency ===
                                            currencyName
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedCurrency(
                                                currencyName
                                            )
                                        }
                                    >
                                        <strong>
                                            {currencyName}
                                        </strong>

                                        <span>{code}</span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* SAVE */}
                <div className="language-modal-footer">
                    <button
                        type="button"
                        className="language-modal-save"
                        onClick={handleSave}
                        aria-label={t.save}
                    >
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
}
