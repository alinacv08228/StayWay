"use client";

import Link from "next/link";
import { useSettings } from "../context/SettingsContext";

type ErrorPageProps = {
    code: "401" | "403" | "404" | "500";
    title: string;
    message: string;
};

type ErrorTranslation = {
    titles: {
        "401": string;
        "403": string;
        "404": string;
        "500": string;
    };
    messages: {
        "401": string;
        "403": string;
        "404": string;
        "500": string;
    };
    backHome: string;
    logIn: string;
};

const errorTranslations: Record<string, ErrorTranslation> = {
    English: {
        titles: { "401": "Unauthorized", "403": "Access denied", "404": "Page not found", "500": "Something went wrong" },
        messages: {
            "401": "You need to log in to access this page.",
            "403": "You do not have permission to access this page.",
            "404": "The page you are looking for does not exist.",
            "500": "An unexpected error occurred. Please try again later.",
        },
        backHome: "Back to home", logIn: "Log in",
    },
    "Română": {
        titles: { "401": "Acces neautorizat", "403": "Acces interzis", "404": "Pagina nu a fost găsită", "500": "Ceva nu a funcționat corect" },
        messages: {
            "401": "Trebuie să te autentifici pentru a accesa această pagină.",
            "403": "Nu ai permisiunea de a accesa această pagină.",
            "404": "Pagina pe care o cauți nu există.",
            "500": "A apărut o eroare neașteptată. Te rugăm să încerci din nou mai târziu.",
        },
        backHome: "Înapoi la pagina principală", logIn: "Autentificare",
    },
    "Русский": {
        titles: { "401": "Неавторизованный доступ", "403": "Доступ запрещён", "404": "Страница не найдена", "500": "Что-то пошло не так" },
        messages: {
            "401": "Вам необходимо войти в систему, чтобы получить доступ к этой странице.",
            "403": "У вас нет разрешения на доступ к этой странице.",
            "404": "Страница, которую вы ищете, не существует.",
            "500": "Произошла непредвиденная ошибка. Попробуйте ещё раз позже.",
        },
        backHome: "Вернуться на главную", logIn: "Войти",
    },
    "Українська": {
        titles: { "401": "Несанкціонований доступ", "403": "Доступ заборонено", "404": "Сторінку не знайдено", "500": "Щось пішло не так" },
        messages: {
            "401": "Щоб отримати доступ до цієї сторінки, потрібно увійти в систему.",
            "403": "У вас немає дозволу на доступ до цієї сторінки.",
            "404": "Сторінка, яку ви шукаєте, не існує.",
            "500": "Сталася неочікувана помилка. Спробуйте ще раз пізніше.",
        },
        backHome: "Повернутися на головну", logIn: "Увійти",
    },
    "Français": {
        titles: { "401": "Non autorisé", "403": "Accès refusé", "404": "Page introuvable", "500": "Une erreur s'est produite" },
        messages: {
            "401": "Vous devez vous connecter pour accéder à cette page.",
            "403": "Vous n'avez pas l'autorisation d'accéder à cette page.",
            "404": "La page que vous recherchez n'existe pas.",
            "500": "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
        },
        backHome: "Retour à l'accueil", logIn: "Se connecter",
    },
    "Español": {
        titles: { "401": "No autorizado", "403": "Acceso denegado", "404": "Página no encontrada", "500": "Algo salió mal" },
        messages: {
            "401": "Debes iniciar sesión para acceder a esta página.",
            "403": "No tienes permiso para acceder a esta página.",
            "404": "La página que buscas no existe.",
            "500": "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde.",
        },
        backHome: "Volver al inicio", logIn: "Iniciar sesión",
    },
    "Deutsch": {
        titles: { "401": "Nicht autorisiert", "403": "Zugriff verweigert", "404": "Seite nicht gefunden", "500": "Etwas ist schiefgelaufen" },
        messages: {
            "401": "Sie müssen sich anmelden, um auf diese Seite zuzugreifen.",
            "403": "Sie haben keine Berechtigung, auf diese Seite zuzugreifen.",
            "404": "Die gesuchte Seite existiert nicht.",
            "500": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        },
        backHome: "Zurück zur Startseite", logIn: "Anmelden",
    },
    "Italiano": {
        titles: { "401": "Non autorizzato", "403": "Accesso negato", "404": "Pagina non trovata", "500": "Qualcosa è andato storto" },
        messages: {
            "401": "Devi accedere per visualizzare questa pagina.",
            "403": "Non hai il permesso di accedere a questa pagina.",
            "404": "La pagina che cerchi non esiste.",
            "500": "Si è verificato un errore imprevisto. Riprova più tardi.",
        },
        backHome: "Torna alla home", logIn: "Accedi",
    },
    "Português": {
        titles: { "401": "Não autorizado", "403": "Acesso negado", "404": "Página não encontrada", "500": "Algo correu mal" },
        messages: {
            "401": "Precisa de iniciar sessão para aceder a esta página.",
            "403": "Não tem permissão para aceder a esta página.",
            "404": "A página que procura não existe.",
            "500": "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        },
        backHome: "Voltar à página inicial", logIn: "Iniciar sessão",
    },
    "Nederlands": {
        titles: { "401": "Niet geautoriseerd", "403": "Toegang geweigerd", "404": "Pagina niet gevonden", "500": "Er is iets misgegaan" },
        messages: {
            "401": "Je moet inloggen om toegang te krijgen tot deze pagina.",
            "403": "Je hebt geen toestemming om deze pagina te openen.",
            "404": "De pagina die je zoekt bestaat niet.",
            "500": "Er is een onverwachte fout opgetreden. Probeer het later opnieuw.",
        },
        backHome: "Terug naar home", logIn: "Inloggen",
    },
    "Norsk": {
        titles: { "401": "Uautorisert", "403": "Tilgang nektet", "404": "Siden ble ikke funnet", "500": "Noe gikk galt" },
        messages: {
            "401": "Du må logge inn for å få tilgang til denne siden.",
            "403": "Du har ikke tillatelse til å få tilgang til denne siden.",
            "404": "Siden du leter etter finnes ikke.",
            "500": "Det oppstod en uventet feil. Prøv igjen senere.",
        },
        backHome: "Tilbake til forsiden", logIn: "Logg inn",
    },
    "Svenska": {
        titles: { "401": "Obehörig", "403": "Åtkomst nekad", "404": "Sidan hittades inte", "500": "Något gick fel" },
        messages: {
            "401": "Du måste logga in för att få tillgång till den här sidan.",
            "403": "Du har inte behörighet att komma åt den här sidan.",
            "404": "Sidan du letar efter finns inte.",
            "500": "Ett oväntat fel inträffade. Försök igen senare.",
        },
        backHome: "Tillbaka till startsidan", logIn: "Logga in",
    },
    "Dansk": {
        titles: { "401": "Uautoriseret", "403": "Adgang nægtet", "404": "Siden blev ikke fundet", "500": "Noget gik galt" },
        messages: {
            "401": "Du skal logge ind for at få adgang til denne side.",
            "403": "Du har ikke tilladelse til at få adgang til denne side.",
            "404": "Siden, du leder efter, findes ikke.",
            "500": "Der opstod en uventet fejl. Prøv igen senere.",
        },
        backHome: "Tilbage til forsiden", logIn: "Log ind",
    },
    "Suomi": {
        titles: { "401": "Ei valtuutettu", "403": "Pääsy evätty", "404": "Sivua ei löytynyt", "500": "Jokin meni pieleen" },
        messages: {
            "401": "Sinun on kirjauduttava sisään päästäksesi tälle sivulle.",
            "403": "Sinulla ei ole oikeutta käyttää tätä sivua.",
            "404": "Etsimääsi sivua ei ole olemassa.",
            "500": "Tapahtui odottamaton virhe. Yritä myöhemmin uudelleen.",
        },
        backHome: "Takaisin etusivulle", logIn: "Kirjaudu sisään",
    },
    "Polski": {
        titles: { "401": "Brak autoryzacji", "403": "Dostęp zabroniony", "404": "Nie znaleziono strony", "500": "Coś poszło nie tak" },
        messages: {
            "401": "Musisz się zalogować, aby uzyskać dostęp do tej strony.",
            "403": "Nie masz uprawnień do tej strony.",
            "404": "Strona, której szukasz, nie istnieje.",
            "500": "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.",
        },
        backHome: "Wróć do strony głównej", logIn: "Zaloguj się",
    },
    "Čeština": {
        titles: { "401": "Neautorizovaný přístup", "403": "Přístup odepřen", "404": "Stránka nebyla nalezena", "500": "Něco se pokazilo" },
        messages: {
            "401": "Pro přístup na tuto stránku se musíte přihlásit.",
            "403": "Nemáte oprávnění k přístupu na tuto stránku.",
            "404": "Stránka, kterou hledáte, neexistuje.",
            "500": "Došlo k neočekávané chybě. Zkuste to prosím později.",
        },
        backHome: "Zpět na hlavní stránku", logIn: "Přihlásit se",
    },
    "Slovenčina": {
        titles: { "401": "Neautorizovaný prístup", "403": "Prístup zamietnutý", "404": "Stránka sa nenašla", "500": "Niečo sa pokazilo" },
        messages: {
            "401": "Na prístup k tejto stránke sa musíte prihlásiť.",
            "403": "Nemáte povolenie na prístup k tejto stránke.",
            "404": "Stránka, ktorú hľadáte, neexistuje.",
            "500": "Vyskytla sa neočakávaná chyba. Skúste to znova neskôr.",
        },
        backHome: "Späť na hlavnú stránku", logIn: "Prihlásiť sa",
    },
    "Magyar": {
        titles: { "401": "Nincs jogosultság", "403": "Hozzáférés megtagadva", "404": "Az oldal nem található", "500": "Valami hiba történt" },
        messages: {
            "401": "Az oldal eléréséhez be kell jelentkeznie.",
            "403": "Nincs jogosultsága az oldal eléréséhez.",
            "404": "A keresett oldal nem létezik.",
            "500": "Váratlan hiba történt. Kérjük, próbálja meg később újra.",
        },
        backHome: "Vissza a kezdőlapra", logIn: "Bejelentkezés",
    },
    "Български": {
        titles: { "401": "Неоторизиран достъп", "403": "Достъпът е отказан", "404": "Страницата не е намерена", "500": "Нещо се обърка" },
        messages: {
            "401": "Трябва да влезете в профила си, за да получите достъп до тази страница.",
            "403": "Нямате разрешение за достъп до тази страница.",
            "404": "Страницата, която търсите, не съществува.",
            "500": "Възникна неочаквана грешка. Опитайте отново по-късно.",
        },
        backHome: "Обратно към началната страница", logIn: "Вход",
    },
    "Hrvatski": {
        titles: { "401": "Neovlašten pristup", "403": "Pristup odbijen", "404": "Stranica nije pronađena", "500": "Nešto nije u redu" },
        messages: {
            "401": "Morate se prijaviti kako biste pristupili ovoj stranici.",
            "403": "Nemate dopuštenje za pristup ovoj stranici.",
            "404": "Stranica koju tražite ne postoji.",
            "500": "Dogodila se neočekivana pogreška. Pokušajte ponovno kasnije.",
        },
        backHome: "Natrag na početnu", logIn: "Prijava",
    },
    "Slovenščina": {
        titles: { "401": "Neavtoriziran dostop", "403": "Dostop zavrnjen", "404": "Stranice ni mogoče najti", "500": "Nekaj je šlo narobe" },
        messages: {
            "401": "Za dostop do te strani se morate prijaviti.",
            "403": "Nimate dovoljenja za dostop do te strani.",
            "404": "Stranica, ki jo iščete, ne obstaja.",
            "500": "Prišlo je do nepričakovane napake. Poskusite znova pozneje.",
        },
        backHome: "Nazaj na domačo stran", logIn: "Prijava",
    },
    "Srpski": {
        titles: { "401": "Neovlašćen pristup", "403": "Pristup odbijen", "404": "Stranica nije pronađena", "500": "Nešto nije u redu" },
        messages: {
            "401": "Morate se prijaviti da biste pristupili ovoj stranici.",
            "403": "Nemate dozvolu za pristup ovoj stranici.",
            "404": "Stranica koju tražite ne postoji.",
            "500": "Došlo je do neočekivane greške. Pokušajte ponovo kasnije.",
        },
        backHome: "Nazad na početnu", logIn: "Prijavi se",
    },
    "Bosanski": {
        titles: { "401": "Neovlašten pristup", "403": "Pristup odbijen", "404": "Stranica nije pronađena", "500": "Nešto nije u redu" },
        messages: {
            "401": "Morate se prijaviti da biste pristupili ovoj stranici.",
            "403": "Nemate dozvolu za pristup ovoj stranici.",
            "404": "Stranica koju tražite ne postoji.",
            "500": "Došlo je do neočekivane greške. Pokušajte ponovo kasnije.",
        },
        backHome: "Nazad na početnu", logIn: "Prijava",
    },
    "Ελληνικά": {
        titles: { "401": "Μη εξουσιοδοτημένη πρόσβαση", "403": "Η πρόσβαση απορρίφθηκε", "404": "Η σελίδα δεν βρέθηκε", "500": "Κάτι πήγε στραβά" },
        messages: {
            "401": "Πρέπει να συνδεθείτε για να αποκτήσετε πρόσβαση σε αυτήν τη σελίδα.",
            "403": "Δεν έχετε άδεια πρόσβασης σε αυτήν τη σελίδα.",
            "404": "Η σελίδα που αναζητάτε δεν υπάρχει.",
            "500": "Παρουσιάστηκε ένα απρόσμενο σφάλμα. Δοκιμάστε ξανά αργότερα.",
        },
        backHome: "Επιστροφή στην αρχική", logIn: "Σύνδεση",
    },
    "Türkçe": {
        titles: { "401": "Yetkisiz erişim", "403": "Erişim reddedildi", "404": "Sayfa bulunamadı", "500": "Bir şeyler yanlış gitti" },
        messages: {
            "401": "Bu sayfaya erişmek için giriş yapmanız gerekir.",
            "403": "Bu sayfaya erişim izniniz yok.",
            "404": "Aradığınız sayfa mevcut değil.",
            "500": "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        },
        backHome: "Ana sayfaya dön", logIn: "Giriş yap",
    },
    "العربية": {
        titles: { "401": "غير مصرح", "403": "الوصول مرفوض", "404": "الصفحة غير موجودة", "500": "حدث خطأ ما" },
        messages: {
            "401": "يجب تسجيل الدخول للوصول إلى هذه الصفحة.",
            "403": "ليس لديك إذن للوصول إلى هذه الصفحة.",
            "404": "الصفحة التي تبحث عنها غير موجودة.",
            "500": "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.",
        },
        backHome: "العودة إلى الصفحة الرئيسية", logIn: "تسجيل الدخول",
    },
    "עברית": {
        titles: { "401": "אין הרשאה", "403": "הגישה נדחתה", "404": "הדף לא נמצא", "500": "משהו השתבש" },
        messages: {
            "401": "יש להתחבר כדי לגשת לדף זה.",
            "403": "אין לך הרשאה לגשת לדף זה.",
            "404": "הדף שחיפשת אינו קיים.",
            "500": "אירעה שגיאה בלתי צפויה. נסו שוב מאוחר יותר.",
        },
        backHome: "חזרה לדף הבית", logIn: "התחברות",
    },
    "हिन्दी": {
        titles: { "401": "अनधिकृत", "403": "पहुंच अस्वीकृत", "404": "पृष्ठ नहीं मिला", "500": "कुछ गलत हो गया" },
        messages: {
            "401": "इस पृष्ठ तक पहुँचने के लिए आपको लॉग इन करना होगा।",
            "403": "आपको इस पृष्ठ तक पहुँचने की अनुमति नहीं है।",
            "404": "आप जिस पृष्ठ को खोज रहे हैं वह मौजूद नहीं है।",
            "500": "एक अप्रत्याशित त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।",
        },
        backHome: "होम पर वापस जाएँ", logIn: "लॉग इन",
    },
    "ไทย": {
        titles: { "401": "ไม่ได้รับอนุญาต", "403": "ปฏิเสธการเข้าถึง", "404": "ไม่พบหน้า", "500": "เกิดข้อผิดพลาด" },
        messages: {
            "401": "คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้านี้",
            "403": "คุณไม่มีสิทธิ์เข้าถึงหน้านี้",
            "404": "ไม่พบหน้าที่คุณกำลังค้นหา",
            "500": "เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้งในภายหลัง",
        },
        backHome: "กลับหน้าหลัก", logIn: "เข้าสู่ระบบ",
    },
    "Bahasa Indonesia": {
        titles: { "401": "Tidak Diizinkan", "403": "Akses ditolak", "404": "Halaman tidak ditemukan", "500": "Terjadi kesalahan" },
        messages: {
            "401": "Anda harus masuk untuk mengakses halaman ini.",
            "403": "Anda tidak memiliki izin untuk mengakses halaman ini.",
            "404": "Halaman yang Anda cari tidak ada.",
            "500": "Terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.",
        },
        backHome: "Kembali ke beranda", logIn: "Masuk",
    },
    "Tiếng Việt": {
        titles: { "401": "Không được phép", "403": "Từ chối truy cập", "404": "Không tìm thấy trang", "500": "Đã xảy ra lỗi" },
        messages: {
            "401": "Bạn cần đăng nhập để truy cập trang này.",
            "403": "Bạn không có quyền truy cập trang này.",
            "404": "Trang bạn đang tìm kiếm không tồn tại.",
            "500": "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
        },
        backHome: "Quay lại trang chủ", logIn: "Đăng nhập",
    },
    "한국어": {
        titles: { "401": "권한 없음", "403": "접근이 거부되었습니다", "404": "페이지를 찾을 수 없습니다", "500": "문제가 발생했습니다" },
        messages: {
            "401": "이 페이지에 접근하려면 로그인해야 합니다.",
            "403": "이 페이지에 접근할 권한이 없습니다.",
            "404": "찾으시는 페이지가 존재하지 않습니다.",
            "500": "예기치 않은 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
        },
        backHome: "홈으로 돌아가기", logIn: "로그인",
    },
    "日本語": {
        titles: { "401": "認証が必要です", "403": "アクセスが拒否されました", "404": "ページが見つかりません", "500": "問題が発生しました" },
        messages: {
            "401": "このページにアクセスするにはログインしてください。",
            "403": "このページにアクセスする権限がありません。",
            "404": "お探しのページは存在しません。",
            "500": "予期しないエラーが発生しました。後でもう一度お試しください。",
        },
        backHome: "ホームに戻る", logIn: "ログイン",
    },
    "中文": {
        titles: { "401": "未经授权", "403": "拒绝访问", "404": "未找到页面", "500": "出现问题" },
        messages: {
            "401": "您需要登录才能访问此页面。",
            "403": "您没有权限访问此页面。",
            "404": "您查找的页面不存在。",
            "500": "发生了意外错误。请稍后再试。",
        },
        backHome: "返回首页", logIn: "登录",
    },
    "繁體中文": {
        titles: { "401": "未經授權", "403": "拒絕存取", "404": "找不到頁面", "500": "發生錯誤" },
        messages: {
            "401": "您需要登入才能存取此頁面。",
            "403": "您沒有權限存取此頁面。",
            "404": "您尋找的頁面不存在。",
            "500": "發生未預期的錯誤。請稍後再試。",
        },
        backHome: "返回首頁", logIn: "登入",
    },
    "Català": {
        titles: { "401": "No autoritzat", "403": "Accés denegat", "404": "Pàgina no trobada", "500": "Alguna cosa ha anat malament" },
        messages: {
            "401": "Has d'iniciar sessió per accedir a aquesta pàgina.",
            "403": "No tens permís per accedir a aquesta pàgina.",
            "404": "La pàgina que busques no existeix.",
            "500": "S'ha produït un error inesperat. Torna-ho a provar més tard.",
        },
        backHome: "Torna a l'inici", logIn: "Inicia sessió",
    },
    "Eesti": {
        titles: { "401": "Volitamata", "403": "Juurdepääs keelatud", "404": "Lehte ei leitud", "500": "Midagi läks valesti" },
        messages: {
            "401": "Sellele lehele pääsemiseks peate sisse logima.",
            "403": "Teil pole sellele lehele juurdepääsuõigust.",
            "404": "Otsitavat lehte ei ole olemas.",
            "500": "Tekkis ootamatu viga. Proovige hiljem uuesti.",
        },
        backHome: "Tagasi avalehele", logIn: "Logi sisse",
    },
    "Latviešu": {
        titles: { "401": "Neatļauta piekļuve", "403": "Piekļuve liegta", "404": "Lapa nav atrasta", "500": "Kaut kas nogāja greizi" },
        messages: {
            "401": "Lai piekļūtu šai lapai, jums ir jāpiesakās.",
            "403": "Jums nav atļaujas piekļūt šai lapai.",
            "404": "Meklētā lapa nepastāv.",
            "500": "Radās neparedzēta kļūda. Lūdzu, mēģiniet vēlreiz vēlāk.",
        },
        backHome: "Atpakaļ uz sākumlapu", logIn: "Pieteikties",
    },
    "Lietuvių": {
        titles: { "401": "Neleistina prieiga", "403": "Prieiga uždrausta", "404": "Puslapis nerastas", "500": "Kažkas nutiko" },
        messages: {
            "401": "Norėdami pasiekti šį puslapį, turite prisijungti.",
            "403": "Neturite leidimo pasiekti šį puslapį.",
            "404": "Ieškomas puslapis neegzistuoja.",
            "500": "Įvyko netikėta klaida. Bandykite dar kartą vėliau.",
        },
        backHome: "Grįžti į pagrindinį", logIn: "Prisijungti",
    },
};

export default function ErrorPage({
                                      code,
                                      title,
                                      message,
                                  }: ErrorPageProps) {
    const { language } = useSettings();

    const text =
        errorTranslations[language.split("|")[0]] ??
        errorTranslations.English;

    return (
        <main className="error-page error-page-ready">
            <section className="error-section">
                <div className="error-card">

                    <div className="error-icon">
                        ✦
                    </div>

                    <p className="error-code">
                        ERROR {code}
                    </p>

                    <h1>
                        {text.titles[code]}
                    </h1>

                    <p className="error-message">
                        {text.messages[code]}
                    </p>

                    <div className="error-actions">
                        <Link
                            href="/"
                            className="error-home-button"
                        >
                            {text.backHome}
                        </Link>

                        {code === "401" && (
                            <Link
                                href="/login"
                                className="error-secondary-button"
                            >
                                {text.logIn}
                            </Link>
                        )}
                    </div>

                </div>
            </section>
        </main>
    );
}
