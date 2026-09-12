
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "../../services/authService";
import { useUser } from "../../context/UserContext";
import { useSettings } from "../../context/SettingsContext";

type LoginTranslation = {
    welcome: string;
    continueText: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    emailRequired: string;
    passwordRequired: string;
    invalidCredentials: string;
    enterPassword: string;
    demoAccounts: string;
    user: string;
    admin: string;
};

const loginTranslations: Record<string, LoginTranslation> = {
    English: {
        welcome: "Welcome to StayWay", continueText: "Sign in to continue",
        email: "Email", password: "Password", signIn: "Sign in", signingIn: "Signing in...",
        emailRequired: "Email is required.", passwordRequired: "Password is required.",
        invalidCredentials: "Invalid email or password.", enterPassword: "Enter your password",
        demoAccounts: "Demo accounts", user: "User", admin: "Admin",
    },
    "Română": {
        welcome: "Bine ai venit la StayWay", continueText: "Autentifică-te pentru a continua",
        email: "E-mail", password: "Parolă", signIn: "Autentificare", signingIn: "Se autentifică...",
        emailRequired: "E-mailul este obligatoriu.", passwordRequired: "Parola este obligatorie.",
        invalidCredentials: "E-mail sau parolă incorectă.", enterPassword: "Introdu parola",
        demoAccounts: "Conturi demo", user: "Utilizator", admin: "Administrator",
    },
    "Русский": {
        welcome: "Добро пожаловать в StayWay", continueText: "Войдите, чтобы продолжить",
        email: "Электронная почта", password: "Пароль", signIn: "Войти", signingIn: "Вход...",
        emailRequired: "Введите адрес электронной почты.", passwordRequired: "Введите пароль.",
        invalidCredentials: "Неверный адрес электронной почты или пароль.", enterPassword: "Введите пароль",
        demoAccounts: "Демо-аккаунты", user: "Пользователь", admin: "Администратор",
    },
    "Українська": {
        welcome: "Ласкаво просимо до StayWay", continueText: "Увійдіть, щоб продовжити",
        email: "Електронна пошта", password: "Пароль", signIn: "Увійти", signingIn: "Вхід...",
        emailRequired: "Введіть електронну пошту.", passwordRequired: "Введіть пароль.",
        invalidCredentials: "Неправильна електронна пошта або пароль.", enterPassword: "Введіть пароль",
        demoAccounts: "Демо-акаунти", user: "Користувач", admin: "Адміністратор",
    },
    "Français": {
        welcome: "Bienvenue sur StayWay", continueText: "Connectez-vous pour continuer",
        email: "E-mail", password: "Mot de passe", signIn: "Se connecter", signingIn: "Connexion...",
        emailRequired: "L'e-mail est requis.", passwordRequired: "Le mot de passe est requis.",
        invalidCredentials: "E-mail ou mot de passe incorrect.", enterPassword: "Entrez votre mot de passe",
        demoAccounts: "Comptes de démonstration", user: "Utilisateur", admin: "Administrateur",
    },
    "Español": {
        welcome: "Bienvenido a StayWay", continueText: "Inicia sesión para continuar",
        email: "Correo electrónico", password: "Contraseña", signIn: "Iniciar sesión", signingIn: "Iniciando sesión...",
        emailRequired: "El correo electrónico es obligatorio.", passwordRequired: "La contraseña es obligatoria.",
        invalidCredentials: "Correo electrónico o contraseña incorrectos.", enterPassword: "Introduce tu contraseña",
        demoAccounts: "Cuentas de demostración", user: "Usuario", admin: "Administrador",
    },
    "Deutsch": {
        welcome: "Willkommen bei StayWay", continueText: "Melden Sie sich an, um fortzufahren",
        email: "E-Mail", password: "Passwort", signIn: "Anmelden", signingIn: "Anmeldung...",
        emailRequired: "E-Mail ist erforderlich.", passwordRequired: "Passwort ist erforderlich.",
        invalidCredentials: "Ungültige E-Mail-Adresse oder ungültiges Passwort.", enterPassword: "Passwort eingeben",
        demoAccounts: "Demo-Konten", user: "Benutzer", admin: "Administrator",
    },
    "Italiano": {
        welcome: "Benvenuto su StayWay", continueText: "Accedi per continuare",
        email: "E-mail", password: "Password", signIn: "Accedi", signingIn: "Accesso...",
        emailRequired: "L'e-mail è obbligatoria.", passwordRequired: "La password è obbligatoria.",
        invalidCredentials: "E-mail o password non validi.", enterPassword: "Inserisci la password",
        demoAccounts: "Account demo", user: "Utente", admin: "Amministratore",
    },
    "Português": {
        welcome: "Bem-vindo ao StayWay", continueText: "Inicie sessão para continuar",
        email: "E-mail", password: "Palavra-passe", signIn: "Iniciar sessão", signingIn: "A iniciar sessão...",
        emailRequired: "O e-mail é obrigatório.", passwordRequired: "A palavra-passe é obrigatória.",
        invalidCredentials: "E-mail ou palavra-passe inválidos.", enterPassword: "Introduza a sua palavra-passe",
        demoAccounts: "Contas de demonstração", user: "Utilizador", admin: "Administrador",
    },
    "Nederlands": {
        welcome: "Welkom bij StayWay", continueText: "Log in om door te gaan",
        email: "E-mail", password: "Wachtwoord", signIn: "Inloggen", signingIn: "Bezig met inloggen...",
        emailRequired: "E-mail is verplicht.", passwordRequired: "Wachtwoord is verplicht.",
        invalidCredentials: "Ongeldig e-mailadres of wachtwoord.", enterPassword: "Voer je wachtwoord in",
        demoAccounts: "Demo-accounts", user: "Gebruiker", admin: "Beheerder",
    },
    "Norsk": {
        welcome: "Velkommen til StayWay", continueText: "Logg inn for å fortsette",
        email: "E-post", password: "Passord", signIn: "Logg inn", signingIn: "Logger inn...",
        emailRequired: "E-post er påkrevd.", passwordRequired: "Passord er påkrevd.",
        invalidCredentials: "Ugyldig e-post eller passord.", enterPassword: "Skriv inn passordet ditt",
        demoAccounts: "Demokontoer", user: "Bruker", admin: "Administrator",
    },
    "Svenska": {
        welcome: "Välkommen till StayWay", continueText: "Logga in för att fortsätta",
        email: "E-post", password: "Lösenord", signIn: "Logga in", signingIn: "Loggar in...",
        emailRequired: "E-post krävs.", passwordRequired: "Lösenord krävs.",
        invalidCredentials: "Ogiltig e-postadress eller lösenord.", enterPassword: "Ange ditt lösenord",
        demoAccounts: "Demokonton", user: "Användare", admin: "Administratör",
    },
    "Dansk": {
        welcome: "Velkommen til StayWay", continueText: "Log ind for at fortsætte",
        email: "E-mail", password: "Adgangskode", signIn: "Log ind", signingIn: "Logger ind...",
        emailRequired: "E-mail er påkrævet.", passwordRequired: "Adgangskode er påkrævet.",
        invalidCredentials: "Ugyldig e-mail eller adgangskode.", enterPassword: "Indtast din adgangskode",
        demoAccounts: "Demokonti", user: "Bruger", admin: "Administrator",
    },
    "Suomi": {
        welcome: "Tervetuloa StayWayhin", continueText: "Kirjaudu sisään jatkaaksesi",
        email: "Sähköposti", password: "Salasana", signIn: "Kirjaudu sisään", signingIn: "Kirjaudutaan...",
        emailRequired: "Sähköposti vaaditaan.", passwordRequired: "Salasana vaaditaan.",
        invalidCredentials: "Virheellinen sähköposti tai salasana.", enterPassword: "Anna salasanasi",
        demoAccounts: "Demotilit", user: "Käyttäjä", admin: "Järjestelmänvalvoja",
    },
    "Polski": {
        welcome: "Witamy w StayWay", continueText: "Zaloguj się, aby kontynuować",
        email: "E-mail", password: "Hasło", signIn: "Zaloguj się", signingIn: "Logowanie...",
        emailRequired: "E-mail jest wymagany.", passwordRequired: "Hasło jest wymagane.",
        invalidCredentials: "Nieprawidłowy e-mail lub hasło.", enterPassword: "Wpisz hasło",
        demoAccounts: "Konta demonstracyjne", user: "Użytkownik", admin: "Administrator",
    },
    "Čeština": {
        welcome: "Vítejte ve StayWay", continueText: "Přihlaste se a pokračujte",
        email: "E-mail", password: "Heslo", signIn: "Přihlásit se", signingIn: "Přihlašování...",
        emailRequired: "E-mail je povinný.", passwordRequired: "Heslo je povinné.",
        invalidCredentials: "Neplatný e-mail nebo heslo.", enterPassword: "Zadejte heslo",
        demoAccounts: "Demo účty", user: "Uživatel", admin: "Administrátor",
    },
    "Slovenčina": {
        welcome: "Vitajte v StayWay", continueText: "Prihláste sa a pokračujte",
        email: "E-mail", password: "Heslo", signIn: "Prihlásiť sa", signingIn: "Prihlasovanie...",
        emailRequired: "E-mail je povinný.", passwordRequired: "Heslo je povinné.",
        invalidCredentials: "Neplatný e-mail alebo heslo.", enterPassword: "Zadajte heslo",
        demoAccounts: "Demo účty", user: "Používateľ", admin: "Administrátor",
    },
    "Magyar": {
        welcome: "Üdvözöljük a StayWayen", continueText: "Jelentkezzen be a folytatáshoz",
        email: "E-mail", password: "Jelszó", signIn: "Bejelentkezés", signingIn: "Bejelentkezés...",
        emailRequired: "Az e-mail megadása kötelező.", passwordRequired: "A jelszó megadása kötelező.",
        invalidCredentials: "Helytelen e-mail vagy jelszó.", enterPassword: "Adja meg a jelszavát",
        demoAccounts: "Demófiókok", user: "Felhasználó", admin: "Adminisztrátor",
    },
    "Български": {
        welcome: "Добре дошли в StayWay", continueText: "Влезте, за да продължите",
        email: "Имейл", password: "Парола", signIn: "Вход", signingIn: "Влизане...",
        emailRequired: "Имейлът е задължителен.", passwordRequired: "Паролата е задължителна.",
        invalidCredentials: "Невалиден имейл или парола.", enterPassword: "Въведете паролата си",
        demoAccounts: "Демо акаунти", user: "Потребител", admin: "Администратор",
    },
    "Hrvatski": {
        welcome: "Dobro došli u StayWay", continueText: "Prijavite se za nastavak",
        email: "E-mail", password: "Lozinka", signIn: "Prijava", signingIn: "Prijavljivanje...",
        emailRequired: "E-mail je obavezan.", passwordRequired: "Lozinka je obavezna.",
        invalidCredentials: "Neispravan e-mail ili lozinka.", enterPassword: "Unesite lozinku",
        demoAccounts: "Demo računi", user: "Korisnik", admin: "Administrator",
    },
    "Slovenščina": {
        welcome: "Dobrodošli v StayWay", continueText: "Prijavite se za nadaljevanje",
        email: "E-pošta", password: "Geslo", signIn: "Prijava", signingIn: "Prijavljanje...",
        emailRequired: "E-pošta je obvezna.", passwordRequired: "Geslo je obvezno.",
        invalidCredentials: "Napačen e-poštni naslov ali geslo.", enterPassword: "Vnesite geslo",
        demoAccounts: "Demo računi", user: "Uporabnik", admin: "Skrbnik",
    },
    "Srpski": {
        welcome: "Dobrodošli u StayWay", continueText: "Prijavite se da nastavite",
        email: "E-pošta", password: "Lozinka", signIn: "Prijavi se", signingIn: "Prijavljivanje...",
        emailRequired: "E-pošta je obavezna.", passwordRequired: "Lozinka je obavezna.",
        invalidCredentials: "Neispravna e-pošta ili lozinka.", enterPassword: "Unesite lozinku",
        demoAccounts: "Demo nalozi", user: "Korisnik", admin: "Administrator",
    },
    "Bosanski": {
        welcome: "Dobro došli u StayWay", continueText: "Prijavite se za nastavak",
        email: "E-pošta", password: "Lozinka", signIn: "Prijava", signingIn: "Prijavljivanje...",
        emailRequired: "E-pošta je obavezna.", passwordRequired: "Lozinka je obavezna.",
        invalidCredentials: "Neispravna e-pošta ili lozinka.", enterPassword: "Unesite lozinku",
        demoAccounts: "Demo nalozi", user: "Korisnik", admin: "Administrator",
    },
    "Ελληνικά": {
        welcome: "Καλώς ήρθατε στο StayWay", continueText: "Συνδεθείτε για να συνεχίσετε",
        email: "Email", password: "Κωδικός πρόσβασης", signIn: "Σύνδεση", signingIn: "Σύνδεση...",
        emailRequired: "Το email είναι υποχρεωτικό.", passwordRequired: "Ο κωδικός πρόσβασης είναι υποχρεωτικός.",
        invalidCredentials: "Μη έγκυρο email ή κωδικός πρόσβασης.", enterPassword: "Εισαγάγετε τον κωδικό πρόσβασής σας",
        demoAccounts: "Δοκιμαστικοί λογαριασμοί", user: "Χρήστης", admin: "Διαχειριστής",
    },
    "Türkçe": {
        welcome: "StayWay'e hoş geldiniz", continueText: "Devam etmek için giriş yapın",
        email: "E-posta", password: "Şifre", signIn: "Giriş yap", signingIn: "Giriş yapılıyor...",
        emailRequired: "E-posta gereklidir.", passwordRequired: "Şifre gereklidir.",
        invalidCredentials: "Geçersiz e-posta veya şifre.", enterPassword: "Şifrenizi girin",
        demoAccounts: "Demo hesapları", user: "Kullanıcı", admin: "Yönetici",
    },
    "العربية": {
        welcome: "مرحبًا بك في StayWay", continueText: "سجّل الدخول للمتابعة",
        email: "البريد الإلكتروني", password: "كلمة المرور", signIn: "تسجيل الدخول", signingIn: "جارٍ تسجيل الدخول...",
        emailRequired: "البريد الإلكتروني مطلوب.", passwordRequired: "كلمة المرور مطلوبة.",
        invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.", enterPassword: "أدخل كلمة المرور",
        demoAccounts: "حسابات تجريبية", user: "مستخدم", admin: "مسؤول",
    },
    "עברית": {
        welcome: "ברוכים הבאים ל-StayWay", continueText: "התחברו כדי להמשיך",
        email: "דוא״ל", password: "סיסמה", signIn: "התחברות", signingIn: "מתחבר...",
        emailRequired: "נדרש דוא״ל.", passwordRequired: "נדרשת סיסמה.",
        invalidCredentials: "דוא״ל או סיסמה שגויים.", enterPassword: "הזינו את הסיסמה",
        demoAccounts: "חשבונות הדגמה", user: "משתמש", admin: "מנהל",
    },
    "हिन्दी": {
        welcome: "StayWay में आपका स्वागत है", continueText: "जारी रखने के लिए लॉग इन करें",
        email: "ईमेल", password: "पासवर्ड", signIn: "लॉग इन", signingIn: "लॉग इन हो रहा है...",
        emailRequired: "ईमेल आवश्यक है।", passwordRequired: "पासवर्ड आवश्यक है।",
        invalidCredentials: "अमान्य ईमेल या पासवर्ड।", enterPassword: "अपना पासवर्ड दर्ज करें",
        demoAccounts: "डेमो खाते", user: "उपयोगकर्ता", admin: "व्यवस्थापक",
    },
    "ไทย": {
        welcome: "ยินดีต้อนรับสู่ StayWay", continueText: "เข้าสู่ระบบเพื่อดำเนินการต่อ",
        email: "อีเมล", password: "รหัสผ่าน", signIn: "เข้าสู่ระบบ", signingIn: "กำลังเข้าสู่ระบบ...",
        emailRequired: "กรุณาระบุอีเมล", passwordRequired: "กรุณาระบุรหัสผ่าน",
        invalidCredentials: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", enterPassword: "กรอกรหัสผ่าน",
        demoAccounts: "บัญชีทดลอง", user: "ผู้ใช้", admin: "ผู้ดูแลระบบ",
    },
    "Bahasa Indonesia": {
        welcome: "Selamat datang di StayWay", continueText: "Masuk untuk melanjutkan",
        email: "Email", password: "Kata sandi", signIn: "Masuk", signingIn: "Sedang masuk...",
        emailRequired: "Email wajib diisi.", passwordRequired: "Kata sandi wajib diisi.",
        invalidCredentials: "Email atau kata sandi tidak valid.", enterPassword: "Masukkan kata sandi Anda",
        demoAccounts: "Akun demo", user: "Pengguna", admin: "Administrator",
    },
    "Tiếng Việt": {
        welcome: "Chào mừng đến với StayWay", continueText: "Đăng nhập để tiếp tục",
        email: "Email", password: "Mật khẩu", signIn: "Đăng nhập", signingIn: "Đang đăng nhập...",
        emailRequired: "Email là bắt buộc.", passwordRequired: "Mật khẩu là bắt buộc.",
        invalidCredentials: "Email hoặc mật khẩu không hợp lệ.", enterPassword: "Nhập mật khẩu",
        demoAccounts: "Tài khoản demo", user: "Người dùng", admin: "Quản trị viên",
    },
    "한국어": {
        welcome: "StayWay에 오신 것을 환영합니다", continueText: "계속하려면 로그인하세요",
        email: "이메일", password: "비밀번호", signIn: "로그인", signingIn: "로그인 중...",
        emailRequired: "이메일을 입력해 주세요.", passwordRequired: "비밀번호를 입력해 주세요.",
        invalidCredentials: "이메일 또는 비밀번호가 올바르지 않습니다.", enterPassword: "비밀번호를 입력하세요",
        demoAccounts: "데모 계정", user: "사용자", admin: "관리자",
    },
    "日本語": {
        welcome: "StayWayへようこそ", continueText: "続行するにはログインしてください",
        email: "メールアドレス", password: "パスワード", signIn: "ログイン", signingIn: "ログイン中...",
        emailRequired: "メールアドレスは必須です。", passwordRequired: "パスワードは必須です。",
        invalidCredentials: "メールアドレスまたはパスワードが正しくありません。", enterPassword: "パスワードを入力してください",
        demoAccounts: "デモアカウント", user: "ユーザー", admin: "管理者",
    },
    "中文": {
        welcome: "欢迎来到 StayWay", continueText: "登录以继续",
        email: "电子邮箱", password: "密码", signIn: "登录", signingIn: "正在登录...",
        emailRequired: "请输入电子邮箱。", passwordRequired: "请输入密码。",
        invalidCredentials: "电子邮箱或密码无效。", enterPassword: "请输入密码",
        demoAccounts: "演示账户", user: "用户", admin: "管理员",
    },
    "繁體中文": {
        welcome: "歡迎來到 StayWay", continueText: "登入以繼續",
        email: "電子郵件", password: "密碼", signIn: "登入", signingIn: "正在登入...",
        emailRequired: "電子郵件為必填欄位。", passwordRequired: "密碼為必填欄位。",
        invalidCredentials: "電子郵件或密碼無效。", enterPassword: "輸入密碼",
        demoAccounts: "示範帳戶", user: "使用者", admin: "管理員",
    },
    "Català": {
        welcome: "Benvingut a StayWay", continueText: "Inicia sessió per continuar",
        email: "Correu electrònic", password: "Contrasenya", signIn: "Inicia sessió", signingIn: "Iniciant sessió...",
        emailRequired: "El correu electrònic és obligatori.", passwordRequired: "La contrasenya és obligatòria.",
        invalidCredentials: "Correu electrònic o contrasenya no vàlids.", enterPassword: "Introdueix la contrasenya",
        demoAccounts: "Comptes de demostració", user: "Usuari", admin: "Administrador",
    },
    "Eesti": {
        welcome: "Tere tulemast StayWay'sse", continueText: "Jätkamiseks logige sisse",
        email: "E-post", password: "Parool", signIn: "Logi sisse", signingIn: "Sisselogimine...",
        emailRequired: "E-post on kohustuslik.", passwordRequired: "Parool on kohustuslik.",
        invalidCredentials: "Vale e-post või parool.", enterPassword: "Sisestage parool",
        demoAccounts: "Demokontod", user: "Kasutaja", admin: "Administraator",
    },
    "Latviešu": {
        welcome: "Laipni lūdzam StayWay", continueText: "Piesakieties, lai turpinātu",
        email: "E-pasts", password: "Parole", signIn: "Pieteikties", signingIn: "Notiek pieteikšanās...",
        emailRequired: "E-pasts ir obligāts.", passwordRequired: "Parole ir obligāta.",
        invalidCredentials: "Nederīgs e-pasts vai parole.", enterPassword: "Ievadiet paroli",
        demoAccounts: "Demonstrācijas konti", user: "Lietotājs", admin: "Administrators",
    },
    "Lietuvių": {
        welcome: "Sveiki atvykę į StayWay", continueText: "Prisijunkite, kad tęstumėte",
        email: "El. paštas", password: "Slaptažodis", signIn: "Prisijungti", signingIn: "Jungiamasi...",
        emailRequired: "El. paštas yra privalomas.", passwordRequired: "Slaptažodis yra privalomas.",
        invalidCredentials: "Neteisingas el. paštas arba slaptažodis.", enterPassword: "Įveskite slaptažodį",
        demoAccounts: "Demonstracinės paskyros", user: "Naudotojas", admin: "Administratorius",
    },
};

export default function LoginPage() {
    const router = useRouter();

    const { setCurrentUser } = useUser();
    const { language } = useSettings();

    const text =
        loginTranslations[language.split("|")[0]] ??
        loginTranslations.English;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [isLoading, setIsLoading] =
        useState(false);

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError(text.emailRequired);
            return;
        }

        if (!password.trim()) {
            setError(text.passwordRequired);
            return;
        }

        setIsLoading(true);

        const user = login(
            email.trim(),
            password
        );

        if (!user) {
            setError(text.invalidCredentials);
            setIsLoading(false);
            return;
        }

        setCurrentUser(user);

        if (user.role === "admin") {
            router.push("/admin");
        } else {
            router.push("/");
        }
    };

    return (
        <main className="login-page">
            <div className="login-card">

                <div className="login-header stayway-load-in stayway-load-1">
                    <span className="login-logo">
                        ✦
                    </span>

                    <h1
                        style={{
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {text.welcome}
                    </h1>

                    <p>
                        {text.continueText}
                    </p>
                </div>

                <form
                    className="login-form stayway-load-in stayway-load-2"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="form-field">
                        <label htmlFor="login-email">
                            {text.email}
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="login-password">
                            {text.password}
                        </label>

                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder={text.enterPassword}
                        />
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? text.signingIn
                            : text.signIn}
                    </button>
                </form>

                <div className="login-demo stayway-load-in stayway-load-3">
                    <strong>
                        {text.demoAccounts}
                    </strong>

                    <p>
                        {text.user}: alina@example.com
                    </p>

                    <p>
                        {text.admin}: admin@stayway.com
                    </p>

                    <p>
                        {text.password}: 123456
                    </p>
                </div>

            </div>
        </main>
    );
}
