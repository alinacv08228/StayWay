"use client";

import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

type ConfirmationTranslation = {
    eyebrow: string;
    booked: string;
    successfully: string;
    description: string;
    backToTransfers: string;
};

const confirmationTranslations: Record<string, ConfirmationTranslation> = {
    English: {
        eyebrow: "STAYWAY TRANSFERS",
        booked: "Transfer booked",
        successfully: "successfully.",
        description:
            "Your transfer booking has been received and is awaiting StayWay confirmation.",
        backToTransfers: "Back to transfers",
    },

    Română: {
        eyebrow: "TRANSFERURI STAYWAY",
        booked: "Transfer rezervat",
        successfully: "cu succes.",
        description:
            "Rezervarea transferului tău a fost înregistrată și așteaptă confirmarea StayWay.",
        backToTransfers: "Înapoi la transferuri",
    },

    Русский: {
        eyebrow: "ТРАНСФЕРЫ STAYWAY",
        booked: "Трансфер забронирован",
        successfully: "успешно.",
        description:
            "Ваша заявка на трансфер зарегистрирована и ожидает подтверждения StayWay.",
        backToTransfers: "Назад к трансферам",
    },

    Українська: {
        eyebrow: "ТРАНСФЕРИ STAYWAY",
        booked: "Трансфер заброньовано",
        successfully: "успішно.",
        description:
            "Ваше бронювання трансферу зареєстровано та очікує підтвердження StayWay.",
        backToTransfers: "Назад до трансферів",
    },

    Français: {
        eyebrow: "TRANSFERTS STAYWAY",
        booked: "Transfert réservé",
        successfully: "avec succès.",
        description:
            "Votre réservation de transfert a bien été enregistrée et attend la confirmation de StayWay.",
        backToTransfers: "Retour aux transferts",
    },

    Español: {
        eyebrow: "TRASLADOS STAYWAY",
        booked: "Traslado reservado",
        successfully: "correctamente.",
        description:
            "Tu reserva de traslado ha sido registrada y está pendiente de confirmación por StayWay.",
        backToTransfers: "Volver a traslados",
    },

    Deutsch: {
        eyebrow: "STAYWAY TRANSFERS",
        booked: "Transfer gebucht",
        successfully: "erfolgreich.",
        description:
            "Ihre Transferbuchung wurde erfasst und wartet auf die Bestätigung durch StayWay.",
        backToTransfers: "Zurück zu Transfers",
    },

    Italiano: {
        eyebrow: "TRASFERIMENTI STAYWAY",
        booked: "Trasferimento prenotato",
        successfully: "con successo.",
        description:
            "La tua prenotazione del trasferimento è stata registrata ed è in attesa di conferma da StayWay.",
        backToTransfers: "Torna ai trasferimenti",
    },

    Português: {
        eyebrow: "TRANSFERES STAYWAY",
        booked: "Transfer reservado",
        successfully: "com sucesso.",
        description:
            "A sua reserva de transfer foi registada e aguarda confirmação da StayWay.",
        backToTransfers: "Voltar aos transferes",
    },

    Nederlands: {
        eyebrow: "STAYWAY TRANSFERS",
        booked: "Transfer geboekt",
        successfully: "met succes.",
        description:
            "Je transferboeking is ontvangen en wacht op bevestiging van StayWay.",
        backToTransfers: "Terug naar transfers",
    },

    Norsk: {
        eyebrow: "STAYWAY-TRANSPORT",
        booked: "Transport bestilt",
        successfully: "vellykket.",
        description:
            "Transportbestillingen din er registrert og venter på bekreftelse fra StayWay.",
        backToTransfers: "Tilbake til transport",
    },

    Svenska: {
        eyebrow: "STAYWAY-TRANSFER",
        booked: "Transfer bokad",
        successfully: "framgångsrikt.",
        description:
            "Din transferbokning har registrerats och väntar på bekräftelse från StayWay.",
        backToTransfers: "Tillbaka till transfer",
    },

    Dansk: {
        eyebrow: "STAYWAY-TRANSFER",
        booked: "Transfer booket",
        successfully: "med succes.",
        description:
            "Din transferbooking er registreret og afventer bekræftelse fra StayWay.",
        backToTransfers: "Tilbage til transfer",
    },

    Suomi: {
        eyebrow: "STAYWAY-KULJETUKSET",
        booked: "Kuljetus varattu",
        successfully: "onnistuneesti.",
        description:
            "Kuljetusvarauksesi on vastaanotettu ja odottaa StayWayn vahvistusta.",
        backToTransfers: "Takaisin kuljetuksiin",
    },

    Polski: {
        eyebrow: "TRANSFER STAYWAY",
        booked: "Transfer zarezerwowany",
        successfully: "pomyślnie.",
        description:
            "Twoja rezerwacja transferu została zarejestrowana i oczekuje na potwierdzenie StayWay.",
        backToTransfers: "Wróć do transferów",
    },

    Čeština: {
        eyebrow: "TRANSFER STAYWAY",
        booked: "Transfer rezervován",
        successfully: "úspěšně.",
        description:
            "Vaše rezervace transferu byla přijata a čeká na potvrzení StayWay.",
        backToTransfers: "Zpět k transferům",
    },

    Slovenčina: {
        eyebrow: "TRANSFER STAYWAY",
        booked: "Transfer rezervovaný",
        successfully: "úspešne.",
        description:
            "Vaša rezervácia transferu bola prijatá a čaká na potvrdenie StayWay.",
        backToTransfers: "Späť na transfery",
    },

    Magyar: {
        eyebrow: "STAYWAY TRANSZFER",
        booked: "Transzfer lefoglalva",
        successfully: "sikeresen.",
        description:
            "A transzferfoglalását rögzítettük, és a StayWay visszaigazolására vár.",
        backToTransfers: "Vissza a transzferekhez",
    },

    Български: {
        eyebrow: "STAYWAY ТРАНСФЕРИ",
        booked: "Трансферът е резервиран",
        successfully: "успешно.",
        description:
            "Вашата резервация за трансфер е регистрирана и очаква потвърждение от StayWay.",
        backToTransfers: "Назад към трансферите",
    },

    Hrvatski: {
        eyebrow: "STAYWAY TRANSFERI",
        booked: "Transfer rezerviran",
        successfully: "uspješno.",
        description:
            "Vaša rezervacija transfera je evidentirana i čeka potvrdu StayWaya.",
        backToTransfers: "Natrag na transfere",
    },

    Slovenščina: {
        eyebrow: "STAYWAY PREVOZI",
        booked: "Prevoz rezerviran",
        successfully: "uspešno.",
        description:
            "Vaša rezervacija prevoza je zabeležena in čaka na potrditev StayWay.",
        backToTransfers: "Nazaj na prevoze",
    },

    Srpski: {
        eyebrow: "STAYWAY TRANSFERI",
        booked: "Transfer rezervisan",
        successfully: "uspešno.",
        description:
            "Vaša rezervacija transfera je zabeležena i čeka potvrdu StayWay-a.",
        backToTransfers: "Nazad na transfere",
    },

    Bosanski: {
        eyebrow: "STAYWAY TRANSFERI",
        booked: "Transfer rezervisan",
        successfully: "uspješno.",
        description:
            "Vaša rezervacija transfera je evidentirana i čeka potvrdu StayWaya.",
        backToTransfers: "Nazad na transfere",
    },

    Ελληνικά: {
        eyebrow: "ΜΕΤΑΦΟΡΕΣ STAYWAY",
        booked: "Η μεταφορά κρατήθηκε",
        successfully: "με επιτυχία.",
        description:
            "Η κράτηση της μεταφοράς σας καταχωρήθηκε και αναμένει επιβεβαίωση από το StayWay.",
        backToTransfers: "Πίσω στις μεταφορές",
    },

    Türkçe: {
        eyebrow: "STAYWAY TRANSFERLERİ",
        booked: "Transfer rezervasyonu",
        successfully: "başarıyla tamamlandı.",
        description:
            "Transfer rezervasyonunuz alındı ve StayWay onayı bekleniyor.",
        backToTransfers: "Transferlere dön",
    },

    العربية: {
        eyebrow: "تنقلات STAYWAY",
        booked: "تم حجز خدمة النقل",
        successfully: "بنجاح.",
        description:
            "تم تسجيل حجز خدمة النقل الخاصة بك وهو بانتظار تأكيد StayWay.",
        backToTransfers: "العودة إلى خدمات النقل",
    },

    עברית: {
        eyebrow: "הסעות STAYWAY",
        booked: "ההסעה הוזמנה",
        successfully: "בהצלחה.",
        description:
            "הזמנת ההסעה שלך התקבלה וממתינה לאישור StayWay.",
        backToTransfers: "חזרה להסעות",
    },

    हिन्दी: {
        eyebrow: "STAYWAY ट्रांसफ़र",
        booked: "ट्रांसफ़र बुक हुआ",
        successfully: "सफलतापूर्वक।",
        description:
            "आपकी ट्रांसफ़र बुकिंग दर्ज हो गई है और StayWay की पुष्टि की प्रतीक्षा कर रही है।",
        backToTransfers: "ट्रांसफ़र पर वापस जाएँ",
    },

    ไทย: {
        eyebrow: "บริการรับส่ง STAYWAY",
        booked: "จองบริการรับส่ง",
        successfully: "สำเร็จแล้ว",
        description:
            "ได้รับการจองบริการรับส่งของคุณแล้ว และกำลังรอการยืนยันจาก StayWay",
        backToTransfers: "กลับไปที่บริการรับส่ง",
    },

    "Bahasa Indonesia": {
        eyebrow: "TRANSFER STAYWAY",
        booked: "Transfer berhasil dipesan",
        successfully: "dengan sukses.",
        description:
            "Pemesanan transfer Anda telah diterima dan sedang menunggu konfirmasi dari StayWay.",
        backToTransfers: "Kembali ke transfer",
    },

    "Tiếng Việt": {
        eyebrow: "DỊCH VỤ ĐƯA ĐÓN STAYWAY",
        booked: "Đã đặt xe đưa đón",
        successfully: "thành công.",
        description:
            "Đặt chỗ đưa đón của bạn đã được ghi nhận và đang chờ StayWay xác nhận.",
        backToTransfers: "Quay lại dịch vụ đưa đón",
    },

    한국어: {
        eyebrow: "STAYWAY 픽업 서비스",
        booked: "픽업 서비스 예약이",
        successfully: "완료되었습니다.",
        description:
            "픽업 서비스 예약이 접수되었으며 StayWay의 확인을 기다리고 있습니다.",
        backToTransfers: "픽업 서비스로 돌아가기",
    },

    日本語: {
        eyebrow: "STAYWAY 送迎サービス",
        booked: "送迎予約が",
        successfully: "完了しました。",
        description:
            "送迎予約を受け付けました。現在StayWayの確認待ちです。",
        backToTransfers: "送迎サービスに戻る",
    },

    中文: {
        eyebrow: "STAYWAY 接送服务",
        booked: "接送服务预订",
        successfully: "成功。",
        description:
            "您的接送服务预订已提交，目前正在等待 StayWay 确认。",
        backToTransfers: "返回接送服务",
    },

    繁體中文: {
        eyebrow: "STAYWAY 接送服務",
        booked: "接送服務預訂",
        successfully: "成功。",
        description:
            "您的接送服務預訂已提交，目前正在等待 StayWay 確認。",
        backToTransfers: "返回接送服務",
    },

    Català: {
        eyebrow: "TRASLLATS STAYWAY",
        booked: "Trasllat reservat",
        successfully: "correctament.",
        description:
            "La teva reserva de trasllat s'ha registrat i està pendent de confirmació de StayWay.",
        backToTransfers: "Torna als trasllats",
    },

    Eesti: {
        eyebrow: "STAYWAY TRANSFEERID",
        booked: "Transfeer broneeritud",
        successfully: "edukalt.",
        description:
            "Teie transfeeribroneering on registreeritud ja ootab StayWay kinnitust.",
        backToTransfers: "Tagasi transfeeride juurde",
    },

    Latviešu: {
        eyebrow: "STAYWAY TRANSFĒRI",
        booked: "Transfērs rezervēts",
        successfully: "veiksmīgi.",
        description:
            "Jūsu transfēra rezervācija ir reģistrēta un gaida StayWay apstiprinājumu.",
        backToTransfers: "Atpakaļ uz transfēriem",
    },

    Lietuvių: {
        eyebrow: "STAYWAY PERVEŽIMAI",
        booked: "Pervežimas užsakytas",
        successfully: "sėkmingai.",
        description:
            "Jūsų pervežimo rezervacija užregistruota ir laukia StayWay patvirtinimo.",
        backToTransfers: "Grįžti į pervežimus",
    },
};

function getConfirmationText(
    language: string,
    key: keyof ConfirmationTranslation
) {
    const languageName =
        language.split("|")[0]?.trim() || "English";

    const selected =
        confirmationTranslations[languageName] ??
        confirmationTranslations.English;

    return selected[key];
}

export default function TransferConfirmationPage() {
    const { language } = useSettings();

    const t = (
        key: keyof ConfirmationTranslation
    ) => getConfirmationText(language, key);

    return (
        <main className="transfer-confirmation-page">

            <section className="transfer-confirmation-content">
                <div className="transfers-container">

                    <div className="transfer-confirmation-card">

                        <div className="transfer-confirmation-icon stayway-load-in stayway-load-1">
                            ✓
                        </div>

                        <span className="transfers-eyebrow stayway-load-in stayway-load-2">
                            {t("eyebrow")}
                        </span>

                        <h1 className="stayway-load-in stayway-load-3">
                            {t("booked")}
                            <br />
                            <span>{t("successfully")}</span>
                        </h1>

                        <p className="stayway-load-in stayway-load-4">
                            {t("description")}
                        </p>

                        <Link
                            href="/transfers"
                            className="transfer-confirmation-button stayway-load-in stayway-load-5"
                        >
                            {t("backToTransfers")}
                        </Link>

                    </div>

                </div>
            </section>

            <style jsx global>{`
                /* =========================================================
                   TRANSFER CONFIRMATION — DARK MODE
                ========================================================= */

                html[data-theme="dark"] .transfer-confirmation-page {
                    background: #172338 !important;
                    color: #f5f8fc !important;
                }

                html[data-theme="dark"] .transfer-confirmation-content {
                    background: #172338 !important;
                }

                html[data-theme="dark"]
                .transfer-confirmation-content
                .transfers-container {
                    background: transparent !important;
                }

                /* Card principal */
                html[data-theme="dark"] .transfer-confirmation-card {
                    background: #0d1c2f !important;
                    border: 1px solid #304660 !important;

                    box-shadow:
                        0 24px 60px rgba(0, 0, 0, 0.22) !important;

                    color: #f5f8fc !important;
                }

                /* Icon ✓ */
                html[data-theme="dark"] .transfer-confirmation-icon {
                    background: linear-gradient(
                        135deg,
                        #7657ec,
                        #9277ff
                    ) !important;

                    color: #ffffff !important;

                    box-shadow:
                        0 12px 30px rgba(112, 82, 230, 0.28) !important;
                }

                /* STAYWAY TRANSFERS */
                html[data-theme="dark"]
                .transfer-confirmation-card
                .transfers-eyebrow {
                    color: #9b8cff !important;
                }

                /* Transfer booked */
                html[data-theme="dark"]
                .transfer-confirmation-card
                h1 {
                    color: #f7f9fc !important;
                }

                /* successfully */
                html[data-theme="dark"]
                .transfer-confirmation-card
                h1 span {
                    color: #9b8cff !important;
                }

                /* Description */
                html[data-theme="dark"]
                .transfer-confirmation-card
                p {
                    color: #aebed1 !important;
                }

                /* Button */
                html[data-theme="dark"]
                .transfer-confirmation-button {
                    background: #6d55e8 !important;
                    color: #ffffff !important;

                    box-shadow:
                        0 10px 24px rgba(109, 85, 232, 0.22) !important;
                }

                html[data-theme="dark"]
                .transfer-confirmation-button:hover {
                    background: #7b64ef !important;
                }
            `}</style>

        </main>
    );
}
