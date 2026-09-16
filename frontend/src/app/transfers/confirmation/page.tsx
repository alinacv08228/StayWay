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
            "Your transfer has been confirmed. We hope you have a comfortable journey.",
        backToTransfers: "Back to transfers",
    },

    Română: {
        eyebrow: "TRANSFERURI STAYWAY",
        booked: "Transfer rezervat",
        successfully: "cu succes.",
        description:
            "Transferul tău a fost confirmat. Îți dorim o călătorie confortabilă.",
        backToTransfers: "Înapoi la transferuri",
    },

    Русский: {
        eyebrow: "ТРАНСФЕРЫ STAYWAY",
        booked: "Трансфер забронирован",
        successfully: "успешно.",
        description:
            "Ваш трансфер подтвержден. Желаем вам комфортной поездки.",
        backToTransfers: "Назад к трансферам",
    },

    Українська: {
        eyebrow: "ТРАНСФЕРИ STAYWAY",
        booked: "Трансфер заброньовано",
        successfully: "успішно.",
        description:
            "Ваш трансфер підтверджено. Бажаємо вам комфортної подорожі.",
        backToTransfers: "Назад до трансферів",
    },

    Français: {
        eyebrow: "TRANSFERTS STAYWAY",
        booked: "Transfert réservé",
        successfully: "avec succès.",
        description:
            "Votre transfert a été confirmé. Nous vous souhaitons un voyage confortable.",
        backToTransfers: "Retour aux transferts",
    },

    Español: {
        eyebrow: "TRASLADOS STAYWAY",
        booked: "Traslado reservado",
        successfully: "correctamente.",
        description:
            "Tu traslado ha sido confirmado. Esperamos que disfrutes de un viaje cómodo.",
        backToTransfers: "Volver a traslados",
    },

    Deutsch: {
        eyebrow: "STAYWAY TRANSFERS",
        booked: "Transfer gebucht",
        successfully: "erfolgreich.",
        description:
            "Ihr Transfer wurde bestätigt. Wir wünschen Ihnen eine angenehme Fahrt.",
        backToTransfers: "Zurück zu Transfers",
    },

    Italiano: {
        eyebrow: "TRASFERIMENTI STAYWAY",
        booked: "Trasferimento prenotato",
        successfully: "con successo.",
        description:
            "Il tuo trasferimento è stato confermato. Ti auguriamo un viaggio confortevole.",
        backToTransfers: "Torna ai trasferimenti",
    },

    Português: {
        eyebrow: "TRANSFERES STAYWAY",
        booked: "Transfer reservado",
        successfully: "com sucesso.",
        description:
            "O seu transfer foi confirmado. Desejamos-lhe uma viagem confortável.",
        backToTransfers: "Voltar aos transferes",
    },

    Nederlands: {
        eyebrow: "STAYWAY TRANSFERS",
        booked: "Transfer geboekt",
        successfully: "met succes.",
        description:
            "Je transfer is bevestigd. We wensen je een comfortabele reis.",
        backToTransfers: "Terug naar transfers",
    },

    Norsk: {
        eyebrow: "STAYWAY-TRANSPORT",
        booked: "Transport bestilt",
        successfully: "vellykket.",
        description:
            "Transporten din er bekreftet. Vi ønsker deg en komfortabel reise.",
        backToTransfers: "Tilbake til transport",
    },

    Svenska: {
        eyebrow: "STAYWAY-TRANSFER",
        booked: "Transfer bokad",
        successfully: "framgångsrikt.",
        description:
            "Din transfer har bekräftats. Vi önskar dig en bekväm resa.",
        backToTransfers: "Tillbaka till transfer",
    },

    Dansk: {
        eyebrow: "STAYWAY-TRANSFER",
        booked: "Transfer booket",
        successfully: "med succes.",
        description:
            "Din transfer er bekræftet. Vi ønsker dig en behagelig rejse.",
        backToTransfers: "Tilbage til transfer",
    },

    Suomi: {
        eyebrow: "STAYWAY-KULJETUKSET",
        booked: "Kuljetus varattu",
        successfully: "onnistuneesti.",
        description:
            "Kuljetuksesi on vahvistettu. Toivotamme sinulle mukavaa matkaa.",
        backToTransfers: "Takaisin kuljetuksiin",
    },

    Polski: {
        eyebrow: "TRANSFER STAYWAY",
        booked: "Transfer zarezerwowany",
        successfully: "pomyślnie.",
        description:
            "Twój transfer został potwierdzony. Życzymy komfortowej podróży.",
        backToTransfers: "Wróć do transferów",
    },

    Čeština: {
        eyebrow: "TRANSFER STAYWAY",
        booked: "Transfer rezervován",
        successfully: "úspěšně.",
        description:
            "Váš transfer byl potvrzen. Přejeme vám pohodlnou cestu.",
        backToTransfers: "Zpět k transferům",
    },

    Slovenčina: {
        eyebrow: "TRANSFER STAYWAY",
        booked: "Transfer rezervovaný",
        successfully: "úspešne.",
        description:
            "Váš transfer bol potvrdený. Prajeme vám pohodlnú cestu.",
        backToTransfers: "Späť na transfery",
    },

    Magyar: {
        eyebrow: "STAYWAY TRANSZFER",
        booked: "Transzfer lefoglalva",
        successfully: "sikeresen.",
        description:
            "A transzferét megerősítettük. Kellemes utazást kívánunk.",
        backToTransfers: "Vissza a transzferekhez",
    },

    Български: {
        eyebrow: "STAYWAY ТРАНСФЕРИ",
        booked: "Трансферът е резервиран",
        successfully: "успешно.",
        description:
            "Вашият трансфер е потвърден. Пожелаваме ви комфортно пътуване.",
        backToTransfers: "Назад към трансферите",
    },

    Hrvatski: {
        eyebrow: "STAYWAY TRANSFERI",
        booked: "Transfer rezerviran",
        successfully: "uspješno.",
        description:
            "Vaš transfer je potvrđen. Želimo vam ugodno putovanje.",
        backToTransfers: "Natrag na transfere",
    },

    Slovenščina: {
        eyebrow: "STAYWAY PREVOZI",
        booked: "Prevoz rezerviran",
        successfully: "uspešno.",
        description:
            "Vaš prevoz je potrjen. Želimo vam udobno potovanje.",
        backToTransfers: "Nazaj na prevoze",
    },

    Srpski: {
        eyebrow: "STAYWAY TRANSFERI",
        booked: "Transfer rezervisan",
        successfully: "uspešno.",
        description:
            "Vaš transfer je potvrđen. Želimo vam udobno putovanje.",
        backToTransfers: "Nazad na transfere",
    },

    Bosanski: {
        eyebrow: "STAYWAY TRANSFERI",
        booked: "Transfer rezervisan",
        successfully: "uspješno.",
        description:
            "Vaš transfer je potvrđen. Želimo vam ugodno putovanje.",
        backToTransfers: "Nazad na transfere",
    },

    Ελληνικά: {
        eyebrow: "ΜΕΤΑΦΟΡΕΣ STAYWAY",
        booked: "Η μεταφορά κρατήθηκε",
        successfully: "με επιτυχία.",
        description:
            "Η μεταφορά σας επιβεβαιώθηκε. Σας ευχόμαστε ένα άνετο ταξίδι.",
        backToTransfers: "Πίσω στις μεταφορές",
    },

    Türkçe: {
        eyebrow: "STAYWAY TRANSFERLERİ",
        booked: "Transfer rezervasyonu",
        successfully: "başarıyla tamamlandı.",
        description:
            "Transferiniz onaylandı. Size konforlu bir yolculuk dileriz.",
        backToTransfers: "Transferlere dön",
    },

    العربية: {
        eyebrow: "تنقلات STAYWAY",
        booked: "تم حجز خدمة النقل",
        successfully: "بنجاح.",
        description:
            "تم تأكيد خدمة النقل الخاصة بك. نتمنى لك رحلة مريحة.",
        backToTransfers: "العودة إلى خدمات النقل",
    },

    עברית: {
        eyebrow: "הסעות STAYWAY",
        booked: "ההסעה הוזמנה",
        successfully: "בהצלחה.",
        description:
            "ההסעה שלך אושרה. אנו מאחלים לך נסיעה נוחה.",
        backToTransfers: "חזרה להסעות",
    },

    हिन्दी: {
        eyebrow: "STAYWAY ट्रांसफ़र",
        booked: "ट्रांसफ़र बुक हुआ",
        successfully: "सफलतापूर्वक।",
        description:
            "आपका ट्रांसफ़र पुष्टि हो गया है। हम आपके आरामदायक सफ़र की कामना करते हैं।",
        backToTransfers: "ट्रांसफ़र पर वापस जाएँ",
    },

    ไทย: {
        eyebrow: "บริการรับส่ง STAYWAY",
        booked: "จองบริการรับส่ง",
        successfully: "สำเร็จแล้ว",
        description:
            "ยืนยันบริการรับส่งของคุณแล้ว ขอให้คุณเดินทางอย่างสะดวกสบาย",
        backToTransfers: "กลับไปที่บริการรับส่ง",
    },

    "Bahasa Indonesia": {
        eyebrow: "TRANSFER STAYWAY",
        booked: "Transfer berhasil dipesan",
        successfully: "dengan sukses.",
        description:
            "Transfer Anda telah dikonfirmasi. Semoga perjalanan Anda nyaman.",
        backToTransfers: "Kembali ke transfer",
    },

    "Tiếng Việt": {
        eyebrow: "DỊCH VỤ ĐƯA ĐÓN STAYWAY",
        booked: "Đã đặt xe đưa đón",
        successfully: "thành công.",
        description:
            "Dịch vụ đưa đón của bạn đã được xác nhận. Chúc bạn có một hành trình thoải mái.",
        backToTransfers: "Quay lại dịch vụ đưa đón",
    },

    한국어: {
        eyebrow: "STAYWAY 픽업 서비스",
        booked: "픽업 서비스 예약이",
        successfully: "완료되었습니다.",
        description:
            "픽업 서비스가 확정되었습니다. 편안한 여행 되시기 바랍니다.",
        backToTransfers: "픽업 서비스로 돌아가기",
    },

    日本語: {
        eyebrow: "STAYWAY 送迎サービス",
        booked: "送迎予約が",
        successfully: "完了しました。",
        description:
            "送迎サービスが確定しました。快適なご移動をお楽しみください。",
        backToTransfers: "送迎サービスに戻る",
    },

    中文: {
        eyebrow: "STAYWAY 接送服务",
        booked: "接送服务预订",
        successfully: "成功。",
        description:
            "您的接送服务已确认。祝您旅途舒适。",
        backToTransfers: "返回接送服务",
    },

    繁體中文: {
        eyebrow: "STAYWAY 接送服務",
        booked: "接送服務預訂",
        successfully: "成功。",
        description:
            "您的接送服務已確認。祝您旅途舒適。",
        backToTransfers: "返回接送服務",
    },

    Català: {
        eyebrow: "TRASLLATS STAYWAY",
        booked: "Trasllat reservat",
        successfully: "correctament.",
        description:
            "El teu trasllat ha estat confirmat. Et desitgem un viatge còmode.",
        backToTransfers: "Torna als trasllats",
    },

    Eesti: {
        eyebrow: "STAYWAY TRANSFEERID",
        booked: "Transfeer broneeritud",
        successfully: "edukalt.",
        description:
            "Teie transfeer on kinnitatud. Soovime teile mugavat reisi.",
        backToTransfers: "Tagasi transfeeride juurde",
    },

    Latviešu: {
        eyebrow: "STAYWAY TRANSFĒRI",
        booked: "Transfērs rezervēts",
        successfully: "veiksmīgi.",
        description:
            "Jūsu transfērs ir apstiprināts. Novēlam jums ērtu ceļojumu.",
        backToTransfers: "Atpakaļ uz transfēriem",
    },

    Lietuvių: {
        eyebrow: "STAYWAY PERVEŽIMAI",
        booked: "Pervežimas užsakytas",
        successfully: "sėkmingai.",
        description:
            "Jūsų pervežimas patvirtintas. Linkime patogios kelionės.",
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
