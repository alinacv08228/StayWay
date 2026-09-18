"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { register } from "../../services/authService";
import { useSettings } from "../../context/SettingsContext";

type SignupText = {
    title: string;
    subtitle: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    createAccount: string;
    creating: string;
    alreadyAccount: string;
    logIn: string;
    fillAll: string;
    passwordMismatch: string;
    emailExists: string;
    passwordLength: string;
};

const signupTranslations: Record<string, SignupText> = {
    English: {
        title: "Create your StayWay account",
        subtitle: "Sign up to continue",
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm password",
        createAccount: "Create account",
        creating: "Creating account...",
        alreadyAccount: "Already have an account?",
        logIn: "Log in",
        fillAll: "Please fill in all fields.",
        passwordMismatch: "Passwords do not match.",
        emailExists: "An account with this email already exists.",
        passwordLength: "Password must be at least 6 characters.",
    },
    "Română": {
        title: "Creează-ți contul StayWay",
        subtitle: "Înregistrează-te pentru a continua",
        firstName: "Prenume",
        lastName: "Nume",
        email: "E-mail",
        password: "Parolă",
        confirmPassword: "Confirmă parola",
        createAccount: "Creează cont",
        creating: "Se creează contul...",
        alreadyAccount: "Ai deja un cont?",
        logIn: "Autentificare",
        fillAll: "Completează toate câmpurile.",
        passwordMismatch: "Parolele nu coincid.",
        emailExists: "Există deja un cont cu acest e-mail.",
        passwordLength: "Parola trebuie să aibă cel puțin 6 caractere.",
    },
    "Русский": {
        title: "Создайте аккаунт StayWay",
        subtitle: "Зарегистрируйтесь, чтобы продолжить",
        firstName: "Имя",
        lastName: "Фамилия",
        email: "Электронная почта",
        password: "Пароль",
        confirmPassword: "Подтвердите пароль",
        createAccount: "Создать аккаунт",
        creating: "Создание аккаунта...",
        alreadyAccount: "Уже есть аккаунт?",
        logIn: "Войти",
        fillAll: "Заполните все поля.",
        passwordMismatch: "Пароли не совпадают.",
        emailExists: "Аккаунт с таким адресом уже существует.",
        passwordLength: "Пароль должен содержать не менее 6 символов.",
    },
    "Français": {
        title: "Créez votre compte StayWay",
        subtitle: "Inscrivez-vous pour continuer",
        firstName: "Prénom",
        lastName: "Nom",
        email: "E-mail",
        password: "Mot de passe",
        confirmPassword: "Confirmez le mot de passe",
        createAccount: "Créer un compte",
        creating: "Création du compte...",
        alreadyAccount: "Vous avez déjà un compte ?",
        logIn: "Connexion",
        fillAll: "Veuillez remplir tous les champs.",
        passwordMismatch: "Les mots de passe ne correspondent pas.",
        emailExists: "Un compte avec cet e-mail existe déjà.",
        passwordLength: "Le mot de passe doit contenir au moins 6 caractères.",
    },
    "Español": {
        title: "Crea tu cuenta de StayWay",
        subtitle: "Regístrate para continuar",
        firstName: "Nombre",
        lastName: "Apellido",
        email: "Correo electrónico",
        password: "Contraseña",
        confirmPassword: "Confirmar contraseña",
        createAccount: "Crear cuenta",
        creating: "Creando cuenta...",
        alreadyAccount: "¿Ya tienes una cuenta?",
        logIn: "Iniciar sesión",
        fillAll: "Completa todos los campos.",
        passwordMismatch: "Las contraseñas no coinciden.",
        emailExists: "Ya existe una cuenta con este correo.",
        passwordLength: "La contraseña debe tener al menos 6 caracteres.",
    },
    "Deutsch": {
        title: "Erstelle dein StayWay-Konto",
        subtitle: "Registriere dich, um fortzufahren",
        firstName: "Vorname",
        lastName: "Nachname",
        email: "E-Mail",
        password: "Passwort",
        confirmPassword: "Passwort bestätigen",
        createAccount: "Konto erstellen",
        creating: "Konto wird erstellt...",
        alreadyAccount: "Du hast bereits ein Konto?",
        logIn: "Anmelden",
        fillAll: "Bitte fülle alle Felder aus.",
        passwordMismatch: "Die Passwörter stimmen nicht überein.",
        emailExists: "Ein Konto mit dieser E-Mail existiert bereits.",
        passwordLength: "Das Passwort muss mindestens 6 Zeichen enthalten.",
    },
};

export default function SignupPage() {
    const router = useRouter();
    const { language } = useSettings();

    const text =
        signupTranslations[language.split("|")[0]] ??
        signupTranslations.English;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setError("");

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError(text.fillAll);
            return;
        }

        if (password.length < 6) {
            setError(text.passwordLength);
            return;
        }

        if (password !== confirmPassword) {
            setError(text.passwordMismatch);
            return;
        }

        setIsLoading(true);

        try {
            const user = await register(
                firstName.trim(),
                lastName.trim(),
                email.trim(),
                password
            );

            if (!user) {
                setError(text.emailExists);
                return;
            }

            router.push("/login");
        } catch {
            setError(text.emailExists);
        } finally {
            setIsLoading(false);
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
                        {text.title}
                    </h1>

                    <p>
                        {text.subtitle}
                    </p>
                </div>

                <form
                    className="login-form stayway-load-in stayway-load-2"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "12px",
                        }}
                    >
                        <div className="form-field">
                            <label htmlFor="signup-first-name">
                                {text.firstName}
                            </label>

                            <input
                                id="signup-first-name"
                                type="text"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(event.target.value)
                                }
                                placeholder={text.firstName}
                                autoComplete="given-name"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="signup-last-name">
                                {text.lastName}
                            </label>

                            <input
                                id="signup-last-name"
                                type="text"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(event.target.value)
                                }
                                placeholder={text.lastName}
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    <div className="form-field stayway-load-in stayway-load-3">
                        <label htmlFor="signup-email">
                            {text.email}
                        </label>

                        <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="your@email.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-field stayway-load-in stayway-load-4">
                        <label htmlFor="signup-password">
                            {text.password}
                        </label>

                        <input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder={text.password}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-field stayway-load-in stayway-load-5">
                        <label htmlFor="signup-confirm-password">
                            {text.confirmPassword}
                        </label>

                        <input
                            id="signup-confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            placeholder={text.confirmPassword}
                            autoComplete="new-password"
                        />
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button stayway-load-in stayway-load-6"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? text.creating
                            : text.createAccount}
                    </button>
                </form>

                <div className="login-demo stayway-load-in stayway-load-7">
                    <p
                        style={{
                            margin: 0,
                            textAlign: "center",
                        }}
                    >
                        {text.alreadyAccount}{" "}
                        <Link
                            href="/login"
                            style={{
                                color: "#6f4fe4",
                                fontWeight: 800,
                                textDecoration: "underline",
                            }}
                        >
                            {text.logIn}
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
