"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { useUser } from "../../context/UserContext";

type HelpTranslation = {
    title: string;
    intro: string;
    faqTitle: string;
    questions: string[];
    answers: string[];
    contactTitle: string;
    contactIntro: string;
    success: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    namePlaceholder: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    send: string;
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    subjectRequired: string;
    messageRequired: string;
};

const helpTranslations: Record<string, HelpTranslation> = {
    English: {
        title: "Help & Support",
        intro: "Find answers to common questions or contact our support team.",
        faqTitle: "Frequently Asked Questions",
        questions: [
            "How can I cancel my booking?",
            "How can I change my booking dates?",
            "Can I change the number of guests?",
            "How can I change my currency?",
            "How can I change the language?",
        ],
        answers: [
            'Open "My Bookings", select your reservation and click "Cancel booking".',
            "You can contact StayWay support and provide your booking details and the new dates.",
            "Yes. Contact support before your check-in date and we will help you with your reservation.",
            "Click the language and currency button in the header and select your preferred currency.",
            "Open the language and currency menu in the header and choose your preferred language.",
        ],
        contactTitle: "Contact Support",
        contactIntro:
            "Can't find what you're looking for? Send us a message and our support team will help you.",
        success: "✓ Your message has been sent successfully!",
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
        namePlaceholder: "Your name",
        subjectPlaceholder: "How can we help?",
        messagePlaceholder: "Write your message...",
        send: "Send message",
        nameRequired: "Name is required.",
        emailRequired: "Email is required.",
        emailInvalid: "Please enter a valid email.",
        subjectRequired: "Subject is required.",
        messageRequired: "Message is required.",
    },

    "Română": {
        title: "Ajutor și asistență",
        intro:
            "Găsește răspunsuri la întrebările frecvente sau contactează echipa noastră de asistență.",
        faqTitle: "Întrebări frecvente",
        questions: [
            "Cum îmi pot anula rezervarea?",
            "Cum pot schimba datele rezervării?",
            "Pot schimba numărul de oaspeți?",
            "Cum pot schimba moneda?",
            "Cum pot schimba limba?",
        ],
        answers: [
            'Deschide „Rezervările mele”, selectează rezervarea și apasă „Anulează rezervarea”.',
            "Poți contacta echipa StayWay și să oferi detaliile rezervării și noile date.",
            "Da. Contactează asistența înainte de data sosirii și te vom ajuta cu rezervarea.",
            "Apasă butonul pentru limbă și monedă din antet și selectează moneda preferată.",
            "Deschide meniul pentru limbă și monedă din antet și alege limba preferată.",
        ],
        contactTitle: "Contactează asistența",
        contactIntro:
            "Nu ai găsit ceea ce cauți? Trimite-ne un mesaj, iar echipa noastră de asistență te va ajuta.",
        success: "✓ Mesajul tău a fost trimis cu succes!",
        name: "Nume",
        email: "Email",
        subject: "Subiect",
        message: "Mesaj",
        namePlaceholder: "Numele tău",
        subjectPlaceholder: "Cu ce te putem ajuta?",
        messagePlaceholder: "Scrie mesajul tău...",
        send: "Trimite mesajul",
        nameRequired: "Numele este obligatoriu.",
        emailRequired: "Emailul este obligatoriu.",
        emailInvalid: "Introdu o adresă de email validă.",
        subjectRequired: "Subiectul este obligatoriu.",
        messageRequired: "Mesajul este obligatoriu.",
    },

    "Русский": {
        title: "Помощь и поддержка",
        intro:
            "Найдите ответы на часто задаваемые вопросы или свяжитесь с нашей службой поддержки.",
        faqTitle: "Часто задаваемые вопросы",
        questions: [
            "Как отменить бронирование?",
            "Как изменить даты бронирования?",
            "Можно ли изменить количество гостей?",
            "Как изменить валюту?",
            "Как изменить язык?",
        ],
        answers: [
            'Откройте «Мои бронирования», выберите бронирование и нажмите «Отменить бронирование».',
            "Свяжитесь с поддержкой StayWay и сообщите данные бронирования и новые даты.",
            "Да. Свяжитесь с поддержкой до даты заезда, и мы поможем с бронированием.",
            "Нажмите кнопку языка и валюты в шапке и выберите нужную валюту.",
            "Откройте меню языка и валюты в шапке и выберите нужный язык.",
        ],
        contactTitle: "Связаться с поддержкой",
        contactIntro:
            "Не нашли нужную информацию? Отправьте нам сообщение, и наша служба поддержки поможет вам.",
        success: "✓ Ваше сообщение успешно отправлено!",
        name: "Имя",
        email: "Электронная почта",
        subject: "Тема",
        message: "Сообщение",
        namePlaceholder: "Ваше имя",
        subjectPlaceholder: "Чем мы можем помочь?",
        messagePlaceholder: "Напишите сообщение...",
        send: "Отправить сообщение",
        nameRequired: "Имя обязательно.",
        emailRequired: "Электронная почта обязательна.",
        emailInvalid: "Введите действительный адрес электронной почты.",
        subjectRequired: "Тема обязательна.",
        messageRequired: "Сообщение обязательно.",
    },

    "Українська": {
        title: "Допомога та підтримка",
        intro:
            "Знайдіть відповіді на поширені запитання або зв’яжіться з нашою службою підтримки.",
        faqTitle: "Поширені запитання",
        questions: [
            "Як скасувати бронювання?",
            "Як змінити дати бронювання?",
            "Чи можна змінити кількість гостей?",
            "Як змінити валюту?",
            "Як змінити мову?",
        ],
        answers: [
            'Відкрийте «Мої бронювання», виберіть бронювання та натисніть «Скасувати бронювання».',
            "Зв’яжіться з підтримкою StayWay та повідомте дані бронювання і нові дати.",
            "Так. Зверніться до підтримки до дати заїзду, і ми допоможемо.",
            "Натисніть кнопку мови та валюти в шапці й виберіть потрібну валюту.",
            "Відкрийте меню мови та валюти в шапці й виберіть потрібну мову.",
        ],
        contactTitle: "Зв’язатися з підтримкою",
        contactIntro:
            "Не знайшли потрібної інформації? Надішліть нам повідомлення, і наша команда допоможе вам.",
        success: "✓ Ваше повідомлення успішно надіслано!",
        name: "Ім’я",
        email: "Електронна пошта",
        subject: "Тема",
        message: "Повідомлення",
        namePlaceholder: "Ваше ім’я",
        subjectPlaceholder: "Як ми можемо допомогти?",
        messagePlaceholder: "Напишіть повідомлення...",
        send: "Надіслати повідомлення",
        nameRequired: "Ім’я обов’язкове.",
        emailRequired: "Електронна пошта обов’язкова.",
        emailInvalid: "Введіть дійсну адресу електронної пошти.",
        subjectRequired: "Тема обов’язкова.",
        messageRequired: "Повідомлення обов’язкове.",
    },

    "Français": {
        title: "Aide et assistance",
        intro:
            "Trouvez des réponses aux questions fréquentes ou contactez notre équipe d’assistance.",
        faqTitle: "Questions fréquentes",
        questions: [
            "Comment annuler ma réservation ?",
            "Comment modifier les dates de ma réservation ?",
            "Puis-je modifier le nombre de voyageurs ?",
            "Comment modifier ma devise ?",
            "Comment changer de langue ?",
        ],
        answers: [
            'Ouvrez « Mes réservations », sélectionnez votre réservation et cliquez sur « Annuler la réservation ».',
            "Contactez l’assistance StayWay et indiquez les détails de votre réservation ainsi que les nouvelles dates.",
            "Oui. Contactez l’assistance avant votre date d’arrivée et nous vous aiderons.",
            "Cliquez sur le bouton de langue et de devise dans l’en-tête et sélectionnez votre devise.",
            "Ouvrez le menu de langue et de devise dans l’en-tête et choisissez votre langue.",
        ],
        contactTitle: "Contacter l’assistance",
        contactIntro:
            "Vous ne trouvez pas ce que vous cherchez ? Envoyez-nous un message et notre équipe vous aidera.",
        success: "✓ Votre message a été envoyé avec succès !",
        name: "Nom",
        email: "E-mail",
        subject: "Objet",
        message: "Message",
        namePlaceholder: "Votre nom",
        subjectPlaceholder: "Comment pouvons-nous vous aider ?",
        messagePlaceholder: "Écrivez votre message...",
        send: "Envoyer le message",
        nameRequired: "Le nom est obligatoire.",
        emailRequired: "L’e-mail est obligatoire.",
        emailInvalid: "Veuillez saisir une adresse e-mail valide.",
        subjectRequired: "L’objet est obligatoire.",
        messageRequired: "Le message est obligatoire.",
    },

    "Español": {
        title: "Ayuda y soporte",
        intro:
            "Encuentra respuestas a preguntas frecuentes o contacta con nuestro equipo de soporte.",
        faqTitle: "Preguntas frecuentes",
        questions: [
            "¿Cómo puedo cancelar mi reserva?",
            "¿Cómo puedo cambiar las fechas de mi reserva?",
            "¿Puedo cambiar el número de huéspedes?",
            "¿Cómo puedo cambiar la moneda?",
            "¿Cómo puedo cambiar el idioma?",
        ],
        answers: [
            'Abre «Mis reservas», selecciona tu reserva y pulsa «Cancelar reserva».',
            "Contacta con el soporte de StayWay y proporciona los datos de tu reserva y las nuevas fechas.",
            "Sí. Contacta con soporte antes de la fecha de llegada y te ayudaremos con la reserva.",
            "Pulsa el botón de idioma y moneda del encabezado y selecciona tu moneda preferida.",
            "Abre el menú de idioma y moneda del encabezado y elige tu idioma preferido.",
        ],
        contactTitle: "Contactar con soporte",
        contactIntro:
            "¿No encuentras lo que buscas? Envíanos un mensaje y nuestro equipo de soporte te ayudará.",
        success: "✓ ¡Tu mensaje se ha enviado correctamente!",
        name: "Nombre",
        email: "Correo electrónico",
        subject: "Asunto",
        message: "Mensaje",
        namePlaceholder: "Tu nombre",
        subjectPlaceholder: "¿Cómo podemos ayudarte?",
        messagePlaceholder: "Escribe tu mensaje...",
        send: "Enviar mensaje",
        nameRequired: "El nombre es obligatorio.",
        emailRequired: "El correo electrónico es obligatorio.",
        emailInvalid: "Introduce un correo electrónico válido.",
        subjectRequired: "El asunto es obligatorio.",
        messageRequired: "El mensaje es obligatorio.",
    },

    Deutsch: {
        title: "Hilfe und Support",
        intro:
            "Finden Sie Antworten auf häufige Fragen oder kontaktieren Sie unser Support-Team.",
        faqTitle: "Häufig gestellte Fragen",
        questions: [
            "Wie kann ich meine Buchung stornieren?",
            "Wie kann ich die Buchungsdaten ändern?",
            "Kann ich die Anzahl der Gäste ändern?",
            "Wie kann ich meine Währung ändern?",
            "Wie kann ich die Sprache ändern?",
        ],
        answers: [
            'Öffnen Sie „Meine Buchungen“, wählen Sie Ihre Reservierung aus und klicken Sie auf „Buchung stornieren“.',
            "Kontaktieren Sie den StayWay-Support und teilen Sie Ihre Buchungsdaten und die neuen Daten mit.",
            "Ja. Kontaktieren Sie den Support vor Ihrem Anreisedatum und wir helfen Ihnen.",
            "Klicken Sie im Header auf die Schaltfläche für Sprache und Währung und wählen Sie Ihre Währung.",
            "Öffnen Sie das Sprach- und Währungsmenü im Header und wählen Sie Ihre Sprache.",
        ],
        contactTitle: "Support kontaktieren",
        contactIntro:
            "Sie finden nicht, was Sie suchen? Senden Sie uns eine Nachricht und unser Support-Team hilft Ihnen.",
        success: "✓ Ihre Nachricht wurde erfolgreich gesendet!",
        name: "Name",
        email: "E-Mail",
        subject: "Betreff",
        message: "Nachricht",
        namePlaceholder: "Ihr Name",
        subjectPlaceholder: "Wie können wir helfen?",
        messagePlaceholder: "Schreiben Sie Ihre Nachricht...",
        send: "Nachricht senden",
        nameRequired: "Name ist erforderlich.",
        emailRequired: "E-Mail ist erforderlich.",
        emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        subjectRequired: "Betreff ist erforderlich.",
        messageRequired: "Nachricht ist erforderlich.",
    },

    Italiano: {
        title: "Aiuto e assistenza",
        intro:
            "Trova risposte alle domande frequenti o contatta il nostro team di assistenza.",
        faqTitle: "Domande frequenti",
        questions: [
            "Come posso cancellare la mia prenotazione?",
            "Come posso modificare le date della prenotazione?",
            "Posso modificare il numero di ospiti?",
            "Come posso cambiare valuta?",
            "Come posso cambiare lingua?",
        ],
        answers: [
            'Apri «Le mie prenotazioni», seleziona la prenotazione e fai clic su «Annulla prenotazione».',
            "Contatta l’assistenza StayWay e fornisci i dettagli della prenotazione e le nuove date.",
            "Sì. Contatta l’assistenza prima della data di arrivo e ti aiuteremo.",
            "Fai clic sul pulsante lingua e valuta nell’intestazione e seleziona la valuta preferita.",
            "Apri il menu lingua e valuta nell’intestazione e scegli la lingua preferita.",
        ],
        contactTitle: "Contatta l’assistenza",
        contactIntro:
            "Non trovi quello che cerchi? Inviaci un messaggio e il nostro team ti aiuterà.",
        success: "✓ Il tuo messaggio è stato inviato con successo!",
        name: "Nome",
        email: "E-mail",
        subject: "Oggetto",
        message: "Messaggio",
        namePlaceholder: "Il tuo nome",
        subjectPlaceholder: "Come possiamo aiutarti?",
        messagePlaceholder: "Scrivi il tuo messaggio...",
        send: "Invia messaggio",
        nameRequired: "Il nome è obbligatorio.",
        emailRequired: "L’e-mail è obbligatoria.",
        emailInvalid: "Inserisci un indirizzo e-mail valido.",
        subjectRequired: "L’oggetto è obbligatorio.",
        messageRequired: "Il messaggio è obbligatorio.",
    },

    Português: {
        title: "Ajuda e suporte",
        intro:
            "Encontre respostas para perguntas frequentes ou contacte a nossa equipa de suporte.",
        faqTitle: "Perguntas frequentes",
        questions: [
            "Como posso cancelar a minha reserva?",
            "Como posso alterar as datas da reserva?",
            "Posso alterar o número de hóspedes?",
            "Como posso alterar a moeda?",
            "Como posso alterar o idioma?",
        ],
        answers: [
            'Abra «As minhas reservas», selecione a reserva e clique em «Cancelar reserva».',
            "Contacte o suporte StayWay e forneça os dados da reserva e as novas datas.",
            "Sim. Contacte o suporte antes da data de check-in e ajudaremos com a sua reserva.",
            "Clique no botão de idioma e moeda no cabeçalho e selecione a moeda pretendida.",
            "Abra o menu de idioma e moeda no cabeçalho e escolha o idioma pretendido.",
        ],
        contactTitle: "Contactar o suporte",
        contactIntro:
            "Não encontrou o que procura? Envie-nos uma mensagem e a nossa equipa de suporte irá ajudá-lo.",
        success: "✓ A sua mensagem foi enviada com sucesso!",
        name: "Nome",
        email: "E-mail",
        subject: "Assunto",
        message: "Mensagem",
        namePlaceholder: "O seu nome",
        subjectPlaceholder: "Como podemos ajudar?",
        messagePlaceholder: "Escreva a sua mensagem...",
        send: "Enviar mensagem",
        nameRequired: "O nome é obrigatório.",
        emailRequired: "O e-mail é obrigatório.",
        emailInvalid: "Introduza um endereço de e-mail válido.",
        subjectRequired: "O assunto é obrigatório.",
        messageRequired: "A mensagem é obrigatória.",
    },

    Nederlands: {
        title: "Hulp en ondersteuning",
        intro:
            "Vind antwoorden op veelgestelde vragen of neem contact op met ons supportteam.",
        faqTitle: "Veelgestelde vragen",
        questions: [
            "Hoe kan ik mijn boeking annuleren?",
            "Hoe kan ik de data van mijn boeking wijzigen?",
            "Kan ik het aantal gasten wijzigen?",
            "Hoe kan ik mijn valuta wijzigen?",
            "Hoe kan ik de taal wijzigen?",
        ],
        answers: [
            'Open „Mijn boekingen”, selecteer je reservering en klik op „Boeking annuleren”.',
            "Neem contact op met de StayWay-support en geef je boekingsgegevens en de nieuwe data door.",
            "Ja. Neem vóór de incheckdatum contact op met support en we helpen je.",
            "Klik in de header op de knop voor taal en valuta en selecteer je gewenste valuta.",
            "Open het menu voor taal en valuta in de header en kies je gewenste taal.",
        ],
        contactTitle: "Contact opnemen met support",
        contactIntro:
            "Kun je niet vinden wat je zoekt? Stuur ons een bericht en ons supportteam helpt je.",
        success: "✓ Je bericht is succesvol verzonden!",
        name: "Naam",
        email: "E-mail",
        subject: "Onderwerp",
        message: "Bericht",
        namePlaceholder: "Je naam",
        subjectPlaceholder: "Hoe kunnen we helpen?",
        messagePlaceholder: "Schrijf je bericht...",
        send: "Bericht verzenden",
        nameRequired: "Naam is verplicht.",
        emailRequired: "E-mail is verplicht.",
        emailInvalid: "Voer een geldig e-mailadres in.",
        subjectRequired: "Onderwerp is verplicht.",
        messageRequired: "Bericht is verplicht.",
    },

    Norsk: {
        title: "Hjelp og støtte",
        intro:
            "Finn svar på vanlige spørsmål eller kontakt kundestøtten vår.",
        faqTitle: "Vanlige spørsmål",
        questions: [
            "Hvordan kan jeg kansellere bookingen min?",
            "Hvordan kan jeg endre datoene for bookingen?",
            "Kan jeg endre antall gjester?",
            "Hvordan kan jeg endre valuta?",
            "Hvordan kan jeg endre språk?",
        ],
        answers: [
            'Åpne «Mine bestillinger», velg reservasjonen og trykk «Avbestill bestilling».',
            "Kontakt StayWay-support og oppgi bestillingsdetaljene og de nye datoene.",
            "Ja. Kontakt support før innsjekkingsdatoen, så hjelper vi deg.",
            "Trykk på språk- og valutaknappen i toppteksten og velg ønsket valuta.",
            "Åpne språk- og valutamenyen i toppteksten og velg ønsket språk.",
        ],
        contactTitle: "Kontakt support",
        contactIntro:
            "Finner du ikke det du leter etter? Send oss en melding, så hjelper supportteamet vårt deg.",
        success: "✓ Meldingen din er sendt!",
        name: "Navn",
        email: "E-post",
        subject: "Emne",
        message: "Melding",
        namePlaceholder: "Navnet ditt",
        subjectPlaceholder: "Hvordan kan vi hjelpe?",
        messagePlaceholder: "Skriv meldingen din...",
        send: "Send melding",
        nameRequired: "Navn er påkrevd.",
        emailRequired: "E-post er påkrevd.",
        emailInvalid: "Skriv inn en gyldig e-postadresse.",
        subjectRequired: "Emne er påkrevd.",
        messageRequired: "Melding er påkrevd.",
    },

    Svenska: {
        title: "Hjälp och support",
        intro:
            "Hitta svar på vanliga frågor eller kontakta vårt supportteam.",
        faqTitle: "Vanliga frågor",
        questions: [
            "Hur kan jag avboka min bokning?",
            "Hur kan jag ändra datumen för min bokning?",
            "Kan jag ändra antalet gäster?",
            "Hur ändrar jag valuta?",
            "Hur ändrar jag språk?",
        ],
        answers: [
            'Öppna ”Mina bokningar”, välj din reservation och klicka på ”Avboka bokning”.',
            "Kontakta StayWay-supporten och ange bokningsuppgifter och de nya datumen.",
            "Ja. Kontakta supporten före incheckningsdatumet så hjälper vi dig.",
            "Klicka på knappen för språk och valuta i sidhuvudet och välj önskad valuta.",
            "Öppna språk- och valutamenyn i sidhuvudet och välj önskat språk.",
        ],
        contactTitle: "Kontakta support",
        contactIntro:
            "Hittar du inte det du söker? Skicka ett meddelande så hjälper vårt supportteam dig.",
        success: "✓ Ditt meddelande har skickats!",
        name: "Namn",
        email: "E-post",
        subject: "Ämne",
        message: "Meddelande",
        namePlaceholder: "Ditt namn",
        subjectPlaceholder: "Hur kan vi hjälpa?",
        messagePlaceholder: "Skriv ditt meddelande...",
        send: "Skicka meddelande",
        nameRequired: "Namn krävs.",
        emailRequired: "E-post krävs.",
        emailInvalid: "Ange en giltig e-postadress.",
        subjectRequired: "Ämne krävs.",
        messageRequired: "Meddelande krävs.",
    },

    Dansk: {
        title: "Hjælp og support",
        intro:
            "Find svar på ofte stillede spørgsmål, eller kontakt vores supportteam.",
        faqTitle: "Ofte stillede spørgsmål",
        questions: [
            "Hvordan annullerer jeg min booking?",
            "Hvordan ændrer jeg datoerne for min booking?",
            "Kan jeg ændre antallet af gæster?",
            "Hvordan ændrer jeg valuta?",
            "Hvordan ændrer jeg sprog?",
        ],
        answers: [
            'Åbn ”Mine bookinger”, vælg din reservation, og klik på ”Annuller booking”.',
            "Kontakt StayWay-support, og oplys dine bookingoplysninger og de nye datoer.",
            "Ja. Kontakt support før din indtjekningsdato, så hjælper vi dig.",
            "Klik på knappen for sprog og valuta i sidehovedet, og vælg din foretrukne valuta.",
            "Åbn menuen for sprog og valuta i sidehovedet, og vælg dit foretrukne sprog.",
        ],
        contactTitle: "Kontakt support",
        contactIntro:
            "Kan du ikke finde det, du leder efter? Send os en besked, så hjælper vores supportteam dig.",
        success: "✓ Din besked er sendt!",
        name: "Navn",
        email: "E-mail",
        subject: "Emne",
        message: "Besked",
        namePlaceholder: "Dit navn",
        subjectPlaceholder: "Hvordan kan vi hjælpe?",
        messagePlaceholder: "Skriv din besked...",
        send: "Send besked",
        nameRequired: "Navn er påkrævet.",
        emailRequired: "E-mail er påkrævet.",
        emailInvalid: "Indtast en gyldig e-mailadresse.",
        subjectRequired: "Emne er påkrævet.",
        messageRequired: "Besked er påkrævet.",
    },

    Suomi: {
        title: "Ohje ja tuki",
        intro:
            "Löydä vastauksia usein kysyttyihin kysymyksiin tai ota yhteyttä tukitiimiimme.",
        faqTitle: "Usein kysytyt kysymykset",
        questions: [
            "Miten voin peruuttaa varaukseni?",
            "Miten voin muuttaa varaukseni päivämääriä?",
            "Voinko muuttaa vieraiden määrää?",
            "Miten voin vaihtaa valuuttaa?",
            "Miten voin vaihtaa kieltä?",
        ],
        answers: [
            'Avaa ”Omat varaukset”, valitse varauksesi ja napsauta ”Peruuta varaus”.',
            "Ota yhteyttä StayWay-tukeen ja anna varauksesi tiedot sekä uudet päivämäärät.",
            "Kyllä. Ota yhteyttä tukeen ennen sisäänkirjautumispäivää, niin autamme.",
            "Napsauta yläreunan kieli- ja valuuttapainiketta ja valitse haluamasi valuutta.",
            "Avaa yläreunan kieli- ja valuuttavalikko ja valitse haluamasi kieli.",
        ],
        contactTitle: "Ota yhteyttä tukeen",
        contactIntro:
            "Etkö löydä etsimääsi? Lähetä meille viesti, niin tukitiimimme auttaa.",
        success: "✓ Viestisi on lähetetty onnistuneesti!",
        name: "Nimi",
        email: "Sähköposti",
        subject: "Aihe",
        message: "Viesti",
        namePlaceholder: "Nimesi",
        subjectPlaceholder: "Miten voimme auttaa?",
        messagePlaceholder: "Kirjoita viestisi...",
        send: "Lähetä viesti",
        nameRequired: "Nimi vaaditaan.",
        emailRequired: "Sähköposti vaaditaan.",
        emailInvalid: "Anna kelvollinen sähköpostiosoite.",
        subjectRequired: "Aihe vaaditaan.",
        messageRequired: "Viesti vaaditaan.",
    },

    Polski: {
        title: "Pomoc i wsparcie",
        intro:
            "Znajdź odpowiedzi na często zadawane pytania lub skontaktuj się z naszym zespołem wsparcia.",
        faqTitle: "Najczęściej zadawane pytania",
        questions: [
            "Jak mogę anulować rezerwację?",
            "Jak mogę zmienić daty rezerwacji?",
            "Czy mogę zmienić liczbę gości?",
            "Jak mogę zmienić walutę?",
            "Jak mogę zmienić język?",
        ],
        answers: [
            'Otwórz „Moje rezerwacje”, wybierz rezerwację i kliknij „Anuluj rezerwację”.',
            "Skontaktuj się z pomocą StayWay i podaj dane rezerwacji oraz nowe daty.",
            "Tak. Skontaktuj się z pomocą przed datą zameldowania, a pomożemy Ci.",
            "Kliknij przycisk języka i waluty w nagłówku i wybierz preferowaną walutę.",
            "Otwórz menu języka i waluty w nagłówku i wybierz preferowany język.",
        ],
        contactTitle: "Skontaktuj się z pomocą",
        contactIntro:
            "Nie możesz znaleźć tego, czego szukasz? Wyślij nam wiadomość, a nasz zespół pomoże.",
        success: "✓ Twoja wiadomość została wysłana!",
        name: "Imię",
        email: "E-mail",
        subject: "Temat",
        message: "Wiadomość",
        namePlaceholder: "Twoje imię",
        subjectPlaceholder: "Jak możemy pomóc?",
        messagePlaceholder: "Napisz wiadomość...",
        send: "Wyślij wiadomość",
        nameRequired: "Imię jest wymagane.",
        emailRequired: "E-mail jest wymagany.",
        emailInvalid: "Wpisz prawidłowy adres e-mail.",
        subjectRequired: "Temat jest wymagany.",
        messageRequired: "Wiadomość jest wymagana.",
    },

    Čeština: {
        title: "Nápověda a podpora",
        intro:
            "Najděte odpovědi na časté otázky nebo kontaktujte náš tým podpory.",
        faqTitle: "Často kladené otázky",
        questions: [
            "Jak mohu zrušit rezervaci?",
            "Jak mohu změnit termín rezervace?",
            "Mohu změnit počet hostů?",
            "Jak mohu změnit měnu?",
            "Jak mohu změnit jazyk?",
        ],
        answers: [
            'Otevřete „Moje rezervace“, vyberte rezervaci a klikněte na „Zrušit rezervaci“.',
            "Kontaktujte podporu StayWay a uveďte údaje rezervace a nové termíny.",
            "Ano. Kontaktujte podporu před datem příjezdu a pomůžeme vám.",
            "Klikněte v záhlaví na tlačítko jazyka a měny a vyberte požadovanou měnu.",
            "Otevřete nabídku jazyka a měny v záhlaví a vyberte požadovaný jazyk.",
        ],
        contactTitle: "Kontaktovat podporu",
        contactIntro:
            "Nemůžete najít, co hledáte? Pošlete nám zprávu a náš tým podpory vám pomůže.",
        success: "✓ Vaše zpráva byla úspěšně odeslána!",
        name: "Jméno",
        email: "E-mail",
        subject: "Předmět",
        message: "Zpráva",
        namePlaceholder: "Vaše jméno",
        subjectPlaceholder: "Jak vám můžeme pomoci?",
        messagePlaceholder: "Napište zprávu...",
        send: "Odeslat zprávu",
        nameRequired: "Jméno je povinné.",
        emailRequired: "E-mail je povinný.",
        emailInvalid: "Zadejte platnou e-mailovou adresu.",
        subjectRequired: "Předmět je povinný.",
        messageRequired: "Zpráva je povinná.",
    },

    Slovenčina: {
        title: "Pomoc a podpora",
        intro:
            "Nájdite odpovede na časté otázky alebo kontaktujte náš tím podpory.",
        faqTitle: "Často kladené otázky",
        questions: [
            "Ako môžem zrušiť rezerváciu?",
            "Ako môžem zmeniť dátumy rezervácie?",
            "Môžem zmeniť počet hostí?",
            "Ako môžem zmeniť menu?",
            "Ako môžem zmeniť jazyk?",
        ],
        answers: [
            'Otvorte „Moje rezervácie“, vyberte rezerváciu a kliknite na „Zrušiť rezerváciu“.',
            "Kontaktujte podporu StayWay a uveďte údaje rezervácie a nové dátumy.",
            "Áno. Kontaktujte podporu pred dátumom príchodu a pomôžeme vám.",
            "Kliknite na tlačidlo jazyka a meny v hlavičke a vyberte požadovanú menu.",
            "Otvorte ponuku jazyka a meny v hlavičke a vyberte požadovaný jazyk.",
        ],
        contactTitle: "Kontaktovať podporu",
        contactIntro:
            "Nenašli ste, čo hľadáte? Pošlite nám správu a náš tím podpory vám pomôže.",
        success: "✓ Vaša správa bola úspešne odoslaná!",
        name: "Meno",
        email: "E-mail",
        subject: "Predmet",
        message: "Správa",
        namePlaceholder: "Vaše meno",
        subjectPlaceholder: "Ako vám môžeme pomôcť?",
        messagePlaceholder: "Napíšte správu...",
        send: "Odoslať správu",
        nameRequired: "Meno je povinné.",
        emailRequired: "E-mail je povinný.",
        emailInvalid: "Zadajte platnú e-mailovú adresu.",
        subjectRequired: "Predmet je povinný.",
        messageRequired: "Správa je povinná.",
    },

    Magyar: {
        title: "Súgó és támogatás",
        intro:
            "Találjon választ a gyakori kérdésekre, vagy lépjen kapcsolatba ügyfélszolgálatunkkal.",
        faqTitle: "Gyakran ismételt kérdések",
        questions: [
            "Hogyan mondhatom le a foglalásomat?",
            "Hogyan módosíthatom a foglalás dátumait?",
            "Módosíthatom a vendégek számát?",
            "Hogyan módosíthatom a pénznemet?",
            "Hogyan módosíthatom a nyelvet?",
        ],
        answers: [
            'Nyissa meg a „Foglalásaim” menüt, válassza ki a foglalást, majd kattintson a „Foglalás lemondása” gombra.',
            "Lépjen kapcsolatba a StayWay ügyfélszolgálatával, és adja meg a foglalás adatait és az új dátumokat.",
            "Igen. Érkezés előtt vegye fel a kapcsolatot az ügyfélszolgálattal.",
            "Kattintson a fejléc nyelv- és pénznemválasztó gombjára, majd válassza ki a kívánt pénznemet.",
            "Nyissa meg a fejléc nyelv- és pénznemmenüjét, és válassza ki a kívánt nyelvet.",
        ],
        contactTitle: "Kapcsolat az ügyfélszolgálattal",
        contactIntro:
            "Nem találja, amit keres? Küldjön nekünk üzenetet, és csapatunk segít.",
        success: "✓ Üzenetét sikeresen elküldtük!",
        name: "Név",
        email: "E-mail",
        subject: "Tárgy",
        message: "Üzenet",
        namePlaceholder: "Az Ön neve",
        subjectPlaceholder: "Hogyan segíthetünk?",
        messagePlaceholder: "Írja meg üzenetét...",
        send: "Üzenet küldése",
        nameRequired: "A név megadása kötelező.",
        emailRequired: "Az e-mail megadása kötelező.",
        emailInvalid: "Adjon meg érvényes e-mail-címet.",
        subjectRequired: "A tárgy megadása kötelező.",
        messageRequired: "Az üzenet megadása kötelező.",
    },

    "Български": {
        title: "Помощ и поддръжка",
        intro:
            "Намерете отговори на често задавани въпроси или се свържете с нашия екип за поддръжка.",
        faqTitle: "Често задавани въпроси",
        questions: [
            "Как мога да отменя резервацията си?",
            "Как мога да променя датите на резервацията?",
            "Мога ли да променя броя на гостите?",
            "Как мога да променя валутата?",
            "Как мога да променя езика?",
        ],
        answers: [
            'Отворете „Моите резервации“, изберете резервацията и натиснете „Отмяна на резервацията“.',
            "Свържете се с поддръжката на StayWay и предоставете данните за резервацията и новите дати.",
            "Да. Свържете се с поддръжката преди датата на настаняване.",
            "Натиснете бутона за език и валута в заглавката и изберете желаната валута.",
            "Отворете менюто за език и валута в заглавката и изберете желания език.",
        ],
        contactTitle: "Свържете се с поддръжката",
        contactIntro:
            "Не намирате това, което търсите? Изпратете ни съобщение и нашият екип ще ви помогне.",
        success: "✓ Вашето съобщение беше изпратено успешно!",
        name: "Име",
        email: "Имейл",
        subject: "Тема",
        message: "Съобщение",
        namePlaceholder: "Вашето име",
        subjectPlaceholder: "Как можем да помогнем?",
        messagePlaceholder: "Напишете съобщението си...",
        send: "Изпрати съобщение",
        nameRequired: "Името е задължително.",
        emailRequired: "Имейлът е задължителен.",
        emailInvalid: "Въведете валиден имейл адрес.",
        subjectRequired: "Темата е задължителна.",
        messageRequired: "Съобщението е задължително.",
    },

    Hrvatski: {
        title: "Pomoć i podrška",
        intro:
            "Pronađite odgovore na česta pitanja ili kontaktirajte naš tim za podršku.",
        faqTitle: "Često postavljana pitanja",
        questions: [
            "Kako mogu otkazati rezervaciju?",
            "Kako mogu promijeniti datume rezervacije?",
            "Mogu li promijeniti broj gostiju?",
            "Kako mogu promijeniti valutu?",
            "Kako mogu promijeniti jezik?",
        ],
        answers: [
            'Otvorite „Moje rezervacije“, odaberite rezervaciju i kliknite „Otkaži rezervaciju“.',
            "Kontaktirajte StayWay podršku i navedite podatke rezervacije i nove datume.",
            "Da. Kontaktirajte podršku prije datuma prijave i pomoći ćemo vam.",
            "Kliknite gumb za jezik i valutu u zaglavlju i odaberite željenu valutu.",
            "Otvorite izbornik jezika i valute u zaglavlju i odaberite željeni jezik.",
        ],
        contactTitle: "Kontaktirajte podršku",
        contactIntro:
            "Ne možete pronaći ono što tražite? Pošaljite nam poruku i naš tim će vam pomoći.",
        success: "✓ Vaša je poruka uspješno poslana!",
        name: "Ime",
        email: "E-pošta",
        subject: "Predmet",
        message: "Poruka",
        namePlaceholder: "Vaše ime",
        subjectPlaceholder: "Kako vam možemo pomoći?",
        messagePlaceholder: "Napišite poruku...",
        send: "Pošalji poruku",
        nameRequired: "Ime je obavezno.",
        emailRequired: "E-pošta je obavezna.",
        emailInvalid: "Unesite valjanu adresu e-pošte.",
        subjectRequired: "Predmet je obavezan.",
        messageRequired: "Poruka je obavezna.",
    },

    Slovenščina: {
        title: "Pomoč in podpora",
        intro:
            "Poiščite odgovore na pogosta vprašanja ali stopite v stik z našo podporo.",
        faqTitle: "Pogosta vprašanja",
        questions: [
            "Kako lahko prekličem rezervacijo?",
            "Kako lahko spremenim datume rezervacije?",
            "Ali lahko spremenim število gostov?",
            "Kako lahko spremenim valuto?",
            "Kako lahko spremenim jezik?",
        ],
        answers: [
            'Odprite »Moje rezervacije«, izberite rezervacijo in kliknite »Prekliči rezervacijo«.',
            "Obrnite se na podporo StayWay in navedite podatke o rezervaciji ter nove datume.",
            "Da. Pred datumom prijave se obrnite na podporo in pomagali vam bomo.",
            "Kliknite gumb za jezik in valuto v glavi ter izberite želeno valuto.",
            "Odprite meni za jezik in valuto v glavi ter izberite želeni jezik.",
        ],
        contactTitle: "Stik s podporo",
        contactIntro:
            "Ne najdete, kar iščete? Pošljite nam sporočilo in naša ekipa vam bo pomagala.",
        success: "✓ Vaše sporočilo je bilo uspešno poslano!",
        name: "Ime",
        email: "E-pošta",
        subject: "Zadeva",
        message: "Sporočilo",
        namePlaceholder: "Vaše ime",
        subjectPlaceholder: "Kako vam lahko pomagamo?",
        messagePlaceholder: "Napišite sporočilo...",
        send: "Pošlji sporočilo",
        nameRequired: "Ime je obvezno.",
        emailRequired: "E-pošta je obvezna.",
        emailInvalid: "Vnesite veljaven e-poštni naslov.",
        subjectRequired: "Zadeva je obvezna.",
        messageRequired: "Sporočilo je obvezno.",
    },

    Srpski: {
        title: "Pomoć i podrška",
        intro:
            "Pronađite odgovore na česta pitanja ili kontaktirajte naš tim za podršku.",
        faqTitle: "Često postavljana pitanja",
        questions: [
            "Kako mogu da otkažem rezervaciju?",
            "Kako mogu da promenim datume rezervacije?",
            "Mogu li da promenim broj gostiju?",
            "Kako mogu da promenim valutu?",
            "Kako mogu da promenim jezik?",
        ],
        answers: [
            'Otvorite „Moje rezervacije“, izaberite rezervaciju i kliknite „Otkaži rezervaciju“.',
            "Kontaktirajte StayWay podršku i navedite podatke rezervacije i nove datume.",
            "Da. Kontaktirajte podršku pre datuma prijave i pomoći ćemo vam.",
            "Kliknite na dugme za jezik i valutu u zaglavlju i izaberite željenu valutu.",
            "Otvorite meni za jezik i valutu u zaglavlju i izaberite željeni jezik.",
        ],
        contactTitle: "Kontaktirajte podršku",
        contactIntro:
            "Ne možete da pronađete ono što tražite? Pošaljite nam poruku i naš tim će vam pomoći.",
        success: "✓ Vaša poruka je uspešno poslata!",
        name: "Ime",
        email: "E-pošta",
        subject: "Naslov",
        message: "Poruka",
        namePlaceholder: "Vaše ime",
        subjectPlaceholder: "Kako možemo da pomognemo?",
        messagePlaceholder: "Napišite poruku...",
        send: "Pošalji poruku",
        nameRequired: "Ime je obavezno.",
        emailRequired: "E-pošta je obavezna.",
        emailInvalid: "Unesite važeću adresu e-pošte.",
        subjectRequired: "Naslov je obavezan.",
        messageRequired: "Poruka je obavezna.",
    },

    Bosanski: {
        title: "Pomoć i podrška",
        intro:
            "Pronađite odgovore na česta pitanja ili kontaktirajte naš tim za podršku.",
        faqTitle: "Često postavljana pitanja",
        questions: [
            "Kako mogu otkazati rezervaciju?",
            "Kako mogu promijeniti datume rezervacije?",
            "Mogu li promijeniti broj gostiju?",
            "Kako mogu promijeniti valutu?",
            "Kako mogu promijeniti jezik?",
        ],
        answers: [
            'Otvorite „Moje rezervacije“, odaberite rezervaciju i kliknite „Otkaži rezervaciju“.',
            "Kontaktirajte StayWay podršku i navedite podatke rezervacije i nove datume.",
            "Da. Kontaktirajte podršku prije datuma prijave i pomoći ćemo vam.",
            "Kliknite dugme za jezik i valutu u zaglavlju i odaberite željenu valutu.",
            "Otvorite meni za jezik i valutu u zaglavlju i odaberite željeni jezik.",
        ],
        contactTitle: "Kontaktirajte podršku",
        contactIntro:
            "Ne možete pronaći ono što tražite? Pošaljite nam poruku i naš tim će vam pomoći.",
        success: "✓ Vaša poruka je uspješno poslana!",
        name: "Ime",
        email: "E-mail",
        subject: "Naslov",
        message: "Poruka",
        namePlaceholder: "Vaše ime",
        subjectPlaceholder: "Kako vam možemo pomoći?",
        messagePlaceholder: "Napišite poruku...",
        send: "Pošalji poruku",
        nameRequired: "Ime je obavezno.",
        emailRequired: "E-mail je obavezan.",
        emailInvalid: "Unesite ispravnu e-mail adresu.",
        subjectRequired: "Naslov je obavezan.",
        messageRequired: "Poruka je obavezna.",
    },

    Ελληνικά: {
        title: "Βοήθεια και υποστήριξη",
        intro:
            "Βρείτε απαντήσεις σε συχνές ερωτήσεις ή επικοινωνήστε με την ομάδα υποστήριξής μας.",
        faqTitle: "Συχνές ερωτήσεις",
        questions: [
            "Πώς μπορώ να ακυρώσω την κράτησή μου;",
            "Πώς μπορώ να αλλάξω τις ημερομηνίες της κράτησής μου;",
            "Μπορώ να αλλάξω τον αριθμό των επισκεπτών;",
            "Πώς μπορώ να αλλάξω νόμισμα;",
            "Πώς μπορώ να αλλάξω γλώσσα;",
        ],
        answers: [
            'Ανοίξτε «Οι κρατήσεις μου», επιλέξτε την κράτηση και πατήστε «Ακύρωση κράτησης».',
            "Επικοινωνήστε με την υποστήριξη StayWay και δώστε τα στοιχεία της κράτησης και τις νέες ημερομηνίες.",
            "Ναι. Επικοινωνήστε με την υποστήριξη πριν από την ημερομηνία άφιξης.",
            "Πατήστε το κουμπί γλώσσας και νομίσματος στην κεφαλίδα και επιλέξτε το νόμισμά σας.",
            "Ανοίξτε το μενού γλώσσας και νομίσματος στην κεφαλίδα και επιλέξτε τη γλώσσα σας.",
        ],
        contactTitle: "Επικοινωνία με την υποστήριξη",
        contactIntro:
            "Δεν βρίσκετε αυτό που ψάχνετε; Στείλτε μας μήνυμα και η ομάδα υποστήριξης θα σας βοηθήσει.",
        success: "✓ Το μήνυμά σας στάλθηκε με επιτυχία!",
        name: "Όνομα",
        email: "Email",
        subject: "Θέμα",
        message: "Μήνυμα",
        namePlaceholder: "Το όνομά σας",
        subjectPlaceholder: "Πώς μπορούμε να βοηθήσουμε;",
        messagePlaceholder: "Γράψτε το μήνυμά σας...",
        send: "Αποστολή μηνύματος",
        nameRequired: "Το όνομα είναι υποχρεωτικό.",
        emailRequired: "Το email είναι υποχρεωτικό.",
        emailInvalid: "Εισαγάγετε έγκυρη διεύθυνση email.",
        subjectRequired: "Το θέμα είναι υποχρεωτικό.",
        messageRequired: "Το μήνυμα είναι υποχρεωτικό.",
    },

    Türkçe: {
        title: "Yardım ve destek",
        intro:
            "Sık sorulan soruların yanıtlarını bulun veya destek ekibimizle iletişime geçin.",
        faqTitle: "Sık Sorulan Sorular",
        questions: [
            "Rezervasyonumu nasıl iptal edebilirim?",
            "Rezervasyon tarihlerimi nasıl değiştirebilirim?",
            "Misafir sayısını değiştirebilir miyim?",
            "Para birimini nasıl değiştirebilirim?",
            "Dili nasıl değiştirebilirim?",
        ],
        answers: [
            '“Rezervasyonlarım”ı açın, rezervasyonunuzu seçin ve “Rezervasyonu iptal et” seçeneğine tıklayın.',
            "StayWay desteğiyle iletişime geçin ve rezervasyon bilgilerinizi ve yeni tarihleri paylaşın.",
            "Evet. Giriş tarihinizden önce destek ekibiyle iletişime geçin.",
            "Üst menüdeki dil ve para birimi düğmesine tıklayın ve tercih ettiğiniz para birimini seçin.",
            "Üst menüdeki dil ve para birimi menüsünü açın ve tercih ettiğiniz dili seçin.",
        ],
        contactTitle: "Destek ile iletişime geçin",
        contactIntro:
            "Aradığınızı bulamadınız mı? Bize mesaj gönderin, destek ekibimiz size yardımcı olsun.",
        success: "✓ Mesajınız başarıyla gönderildi!",
        name: "Ad",
        email: "E-posta",
        subject: "Konu",
        message: "Mesaj",
        namePlaceholder: "Adınız",
        subjectPlaceholder: "Size nasıl yardımcı olabiliriz?",
        messagePlaceholder: "Mesajınızı yazın...",
        send: "Mesaj gönder",
        nameRequired: "Ad gereklidir.",
        emailRequired: "E-posta gereklidir.",
        emailInvalid: "Geçerli bir e-posta adresi girin.",
        subjectRequired: "Konu gereklidir.",
        messageRequired: "Mesaj gereklidir.",
    },

    العربية: {
        title: "المساعدة والدعم",
        intro:
            "اعثر على إجابات للأسئلة الشائعة أو تواصل مع فريق الدعم لدينا.",
        faqTitle: "الأسئلة الشائعة",
        questions: [
            "كيف يمكنني إلغاء حجزي؟",
            "كيف يمكنني تغيير تواريخ الحجز؟",
            "هل يمكنني تغيير عدد الضيوف؟",
            "كيف يمكنني تغيير العملة؟",
            "كيف يمكنني تغيير اللغة؟",
        ],
        answers: [
            'افتح «حجوزاتي»، اختر الحجز ثم اضغط «إلغاء الحجز».',
            "تواصل مع دعم StayWay وقدم تفاصيل الحجز والتواريخ الجديدة.",
            "نعم. تواصل مع الدعم قبل تاريخ تسجيل الوصول وسنساعدك.",
            "اضغط على زر اللغة والعملة في الرأس واختر العملة المفضلة.",
            "افتح قائمة اللغة والعملة في الرأس واختر اللغة المفضلة.",
        ],
        contactTitle: "تواصل مع الدعم",
        contactIntro:
            "لم تجد ما تبحث عنه؟ أرسل لنا رسالة وسيساعدك فريق الدعم.",
        success: "✓ تم إرسال رسالتك بنجاح!",
        name: "الاسم",
        email: "البريد الإلكتروني",
        subject: "الموضوع",
        message: "الرسالة",
        namePlaceholder: "اسمك",
        subjectPlaceholder: "كيف يمكننا مساعدتك؟",
        messagePlaceholder: "اكتب رسالتك...",
        send: "إرسال الرسالة",
        nameRequired: "الاسم مطلوب.",
        emailRequired: "البريد الإلكتروني مطلوب.",
        emailInvalid: "يرجى إدخال بريد إلكتروني صالح.",
        subjectRequired: "الموضوع مطلوب.",
        messageRequired: "الرسالة مطلوبة.",
    },

    עברית: {
        title: "עזרה ותמיכה",
        intro:
            "מצאו תשובות לשאלות נפוצות או צרו קשר עם צוות התמיכה שלנו.",
        faqTitle: "שאלות נפוצות",
        questions: [
            "כיצד ניתן לבטל את ההזמנה שלי?",
            "כיצד ניתן לשנות את תאריכי ההזמנה?",
            "האם ניתן לשנות את מספר האורחים?",
            "כיצד ניתן לשנות מטבע?",
            "כיצד ניתן לשנות שפה?",
        ],
        answers: [
            'פתחו את «ההזמנות שלי», בחרו את ההזמנה ולחצו על «ביטול הזמנה».',
            "פנו לתמיכת StayWay וספקו את פרטי ההזמנה והתאריכים החדשים.",
            "כן. פנו לתמיכה לפני תאריך הצ'ק-אין ונעזור לכם.",
            "לחצו על כפתור השפה והמטבע בכותרת ובחרו את המטבע הרצוי.",
            "פתחו את תפריט השפה והמטבע בכותרת ובחרו את השפה הרצויה.",
        ],
        contactTitle: "יצירת קשר עם התמיכה",
        contactIntro:
            "לא מצאתם את מה שחיפשתם? שלחו לנו הודעה וצוות התמיכה שלנו יעזור לכם.",
        success: "✓ ההודעה שלכם נשלחה בהצלחה!",
        name: "שם",
        email: "דוא״ל",
        subject: "נושא",
        message: "הודעה",
        namePlaceholder: "השם שלכם",
        subjectPlaceholder: "כיצד נוכל לעזור?",
        messagePlaceholder: "כתבו את ההודעה שלכם...",
        send: "שליחת הודעה",
        nameRequired: "יש להזין שם.",
        emailRequired: "יש להזין דוא״ל.",
        emailInvalid: "יש להזין כתובת דוא״ל תקינה.",
        subjectRequired: "יש להזין נושא.",
        messageRequired: "יש להזין הודעה.",
    },

    हिन्दी: {
        title: "सहायता और समर्थन",
        intro:
            "सामान्य प्रश्नों के उत्तर पाएँ या हमारी सहायता टीम से संपर्क करें।",
        faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
        questions: [
            "मैं अपनी बुकिंग कैसे रद्द कर सकता हूँ?",
            "मैं अपनी बुकिंग की तारीखें कैसे बदल सकता हूँ?",
            "क्या मैं मेहमानों की संख्या बदल सकता हूँ?",
            "मैं मुद्रा कैसे बदल सकता हूँ?",
            "मैं भाषा कैसे बदल सकता हूँ?",
        ],
        answers: [
            '«मेरी बुकिंग» खोलें, अपनी बुकिंग चुनें और «बुकिंग रद्द करें» पर क्लिक करें।',
            "StayWay सहायता से संपर्क करें और बुकिंग विवरण व नई तारीखें दें।",
            "हाँ। चेक-इन की तारीख से पहले सहायता से संपर्क करें।",
            "हेडर में भाषा और मुद्रा बटन पर क्लिक करें और अपनी पसंदीदा मुद्रा चुनें।",
            "हेडर में भाषा और मुद्रा मेनू खोलें और अपनी पसंदीदा भाषा चुनें।",
        ],
        contactTitle: "सहायता से संपर्क करें",
        contactIntro:
            "जो आप खोज रहे हैं वह नहीं मिला? हमें संदेश भेजें और हमारी सहायता टीम आपकी मदद करेगी।",
        success: "✓ आपका संदेश सफलतापूर्वक भेज दिया गया है!",
        name: "नाम",
        email: "ईमेल",
        subject: "विषय",
        message: "संदेश",
        namePlaceholder: "आपका नाम",
        subjectPlaceholder: "हम आपकी कैसे मदद कर सकते हैं?",
        messagePlaceholder: "अपना संदेश लिखें...",
        send: "संदेश भेजें",
        nameRequired: "नाम आवश्यक है।",
        emailRequired: "ईमेल आवश्यक है।",
        emailInvalid: "कृपया मान्य ईमेल दर्ज करें।",
        subjectRequired: "विषय आवश्यक है।",
        messageRequired: "संदेश आवश्यक है।",
    },

    ไทย: {
        title: "ความช่วยเหลือและการสนับสนุน",
        intro:
            "ค้นหาคำตอบสำหรับคำถามที่พบบ่อยหรือติดต่อทีมสนับสนุนของเรา",
        faqTitle: "คำถามที่พบบ่อย",
        questions: [
            "ฉันจะยกเลิกการจองได้อย่างไร",
            "ฉันจะเปลี่ยนวันที่จองได้อย่างไร",
            "ฉันสามารถเปลี่ยนจำนวนผู้เข้าพักได้หรือไม่",
            "ฉันจะเปลี่ยนสกุลเงินได้อย่างไร",
            "ฉันจะเปลี่ยนภาษาได้อย่างไร",
        ],
        answers: [
            'เปิด «การจองของฉัน» เลือกการจอง แล้วคลิก «ยกเลิกการจอง»',
            "ติดต่อฝ่ายสนับสนุน StayWay และแจ้งรายละเอียดการจองและวันที่ใหม่",
            "ได้ ติดต่อฝ่ายสนับสนุนก่อนวันเช็กอิน แล้วเราจะช่วยคุณ",
            "คลิกปุ่มภาษาและสกุลเงินในส่วนหัว แล้วเลือกสกุลเงินที่ต้องการ",
            "เปิดเมนูภาษาและสกุลเงินในส่วนหัว แล้วเลือกภาษาที่ต้องการ",
        ],
        contactTitle: "ติดต่อฝ่ายสนับสนุน",
        contactIntro:
            "ไม่พบสิ่งที่ต้องการใช่ไหม ส่งข้อความหาเราแล้วทีมสนับสนุนจะช่วยคุณ",
        success: "✓ ส่งข้อความของคุณเรียบร้อยแล้ว!",
        name: "ชื่อ",
        email: "อีเมล",
        subject: "หัวข้อ",
        message: "ข้อความ",
        namePlaceholder: "ชื่อของคุณ",
        subjectPlaceholder: "เราช่วยอะไรคุณได้บ้าง?",
        messagePlaceholder: "เขียนข้อความของคุณ...",
        send: "ส่งข้อความ",
        nameRequired: "กรุณาระบุชื่อ",
        emailRequired: "กรุณาระบุอีเมล",
        emailInvalid: "กรุณากรอกอีเมลที่ถูกต้อง",
        subjectRequired: "กรุณาระบุหัวข้อ",
        messageRequired: "กรุณาระบุข้อความ",
    },

    "Bahasa Indonesia": {
        title: "Bantuan & Dukungan",
        intro:
            "Temukan jawaban atas pertanyaan umum atau hubungi tim dukungan kami.",
        faqTitle: "Pertanyaan yang Sering Diajukan",
        questions: [
            "Bagaimana cara membatalkan pemesanan?",
            "Bagaimana cara mengubah tanggal pemesanan?",
            "Bisakah saya mengubah jumlah tamu?",
            "Bagaimana cara mengubah mata uang?",
            "Bagaimana cara mengubah bahasa?",
        ],
        answers: [
            'Buka «Pemesanan Saya», pilih reservasi Anda, lalu klik «Batalkan pemesanan».',
            "Hubungi dukungan StayWay dan berikan detail pemesanan serta tanggal baru.",
            "Ya. Hubungi dukungan sebelum tanggal check-in dan kami akan membantu.",
            "Klik tombol bahasa dan mata uang di header lalu pilih mata uang yang diinginkan.",
            "Buka menu bahasa dan mata uang di header lalu pilih bahasa yang diinginkan.",
        ],
        contactTitle: "Hubungi Dukungan",
        contactIntro:
            "Tidak menemukan yang Anda cari? Kirim pesan kepada kami dan tim dukungan akan membantu.",
        success: "✓ Pesan Anda berhasil dikirim!",
        name: "Nama",
        email: "Email",
        subject: "Subjek",
        message: "Pesan",
        namePlaceholder: "Nama Anda",
        subjectPlaceholder: "Bagaimana kami dapat membantu?",
        messagePlaceholder: "Tulis pesan Anda...",
        send: "Kirim pesan",
        nameRequired: "Nama wajib diisi.",
        emailRequired: "Email wajib diisi.",
        emailInvalid: "Masukkan alamat email yang valid.",
        subjectRequired: "Subjek wajib diisi.",
        messageRequired: "Pesan wajib diisi.",
    },

    "Tiếng Việt": {
        title: "Trợ giúp & Hỗ trợ",
        intro:
            "Tìm câu trả lời cho các câu hỏi thường gặp hoặc liên hệ đội ngũ hỗ trợ của chúng tôi.",
        faqTitle: "Câu hỏi thường gặp",
        questions: [
            "Làm cách nào để hủy đặt phòng?",
            "Làm cách nào để thay đổi ngày đặt phòng?",
            "Tôi có thể thay đổi số lượng khách không?",
            "Làm cách nào để thay đổi tiền tệ?",
            "Làm cách nào để thay đổi ngôn ngữ?",
        ],
        answers: [
            'Mở «Đặt phòng của tôi», chọn đặt phòng và nhấp «Hủy đặt phòng».',
            "Liên hệ bộ phận hỗ trợ StayWay và cung cấp thông tin đặt phòng cùng ngày mới.",
            "Có. Hãy liên hệ hỗ trợ trước ngày nhận phòng và chúng tôi sẽ giúp bạn.",
            "Nhấp nút ngôn ngữ và tiền tệ ở phần đầu trang rồi chọn loại tiền bạn muốn.",
            "Mở menu ngôn ngữ và tiền tệ ở phần đầu trang rồi chọn ngôn ngữ bạn muốn.",
        ],
        contactTitle: "Liên hệ hỗ trợ",
        contactIntro:
            "Không tìm thấy điều bạn cần? Hãy gửi tin nhắn và đội ngũ hỗ trợ sẽ giúp bạn.",
        success: "✓ Tin nhắn của bạn đã được gửi thành công!",
        name: "Tên",
        email: "Email",
        subject: "Chủ đề",
        message: "Tin nhắn",
        namePlaceholder: "Tên của bạn",
        subjectPlaceholder: "Chúng tôi có thể giúp gì?",
        messagePlaceholder: "Viết tin nhắn...",
        send: "Gửi tin nhắn",
        nameRequired: "Vui lòng nhập tên.",
        emailRequired: "Vui lòng nhập email.",
        emailInvalid: "Vui lòng nhập địa chỉ email hợp lệ.",
        subjectRequired: "Vui lòng nhập chủ đề.",
        messageRequired: "Vui lòng nhập tin nhắn.",
    },

    한국어: {
        title: "도움말 및 지원",
        intro:
            "자주 묻는 질문에 대한 답변을 찾거나 지원팀에 문의하세요.",
        faqTitle: "자주 묻는 질문",
        questions: [
            "예약을 어떻게 취소할 수 있나요?",
            "예약 날짜를 어떻게 변경할 수 있나요?",
            "투숙객 수를 변경할 수 있나요?",
            "통화를 어떻게 변경할 수 있나요?",
            "언어를 어떻게 변경할 수 있나요?",
        ],
        answers: [
            '「내 예약」을 열고 예약을 선택한 다음 「예약 취소」를 클릭하세요.',
            "StayWay 지원팀에 연락하여 예약 정보와 새로운 날짜를 알려주세요.",
            "네. 체크인 날짜 전에 지원팀에 문의하시면 도와드리겠습니다.",
            "헤더의 언어 및 통화 버튼을 클릭하고 원하는 통화를 선택하세요.",
            "헤더의 언어 및 통화 메뉴를 열고 원하는 언어를 선택하세요.",
        ],
        contactTitle: "지원팀 문의",
        contactIntro:
            "찾으시는 내용이 없나요? 메시지를 보내주시면 지원팀이 도와드리겠습니다.",
        success: "✓ 메시지가 성공적으로 전송되었습니다!",
        name: "이름",
        email: "이메일",
        subject: "제목",
        message: "메시지",
        namePlaceholder: "이름",
        subjectPlaceholder: "무엇을 도와드릴까요?",
        messagePlaceholder: "메시지를 입력하세요...",
        send: "메시지 보내기",
        nameRequired: "이름을 입력해주세요.",
        emailRequired: "이메일을 입력해주세요.",
        emailInvalid: "유효한 이메일 주소를 입력해주세요.",
        subjectRequired: "제목을 입력해주세요.",
        messageRequired: "메시지를 입력해주세요.",
    },

    日本語: {
        title: "ヘルプとサポート",
        intro:
            "よくある質問への回答を確認するか、サポートチームにお問い合わせください。",
        faqTitle: "よくある質問",
        questions: [
            "予約をキャンセルするにはどうすればよいですか？",
            "予約の日付を変更するにはどうすればよいですか？",
            "宿泊人数を変更できますか？",
            "通貨を変更するにはどうすればよいですか？",
            "言語を変更するにはどうすればよいですか？",
        ],
        answers: [
            '「予約一覧」を開き、予約を選択して「予約をキャンセル」をクリックしてください。',
            "StayWayサポートに連絡し、予約情報と新しい日付をお知らせください。",
            "はい。チェックイン日より前にサポートへご連絡ください。",
            "ヘッダーの言語と通貨ボタンをクリックして、希望の通貨を選択してください。",
            "ヘッダーの言語と通貨メニューを開き、希望の言語を選択してください。",
        ],
        contactTitle: "サポートに問い合わせる",
        contactIntro:
            "お探しの情報が見つかりませんか？メッセージを送信していただければ、サポートチームがお手伝いします。",
        success: "✓ メッセージが正常に送信されました！",
        name: "名前",
        email: "メールアドレス",
        subject: "件名",
        message: "メッセージ",
        namePlaceholder: "お名前",
        subjectPlaceholder: "どのようなサポートが必要ですか？",
        messagePlaceholder: "メッセージを入力してください...",
        send: "メッセージを送信",
        nameRequired: "名前は必須です。",
        emailRequired: "メールアドレスは必須です。",
        emailInvalid: "有効なメールアドレスを入力してください。",
        subjectRequired: "件名は必須です。",
        messageRequired: "メッセージは必須です。",
    },

    中文: {
        title: "帮助与支持",
        intro: "查找常见问题的答案，或联系我们的支持团队。",
        faqTitle: "常见问题",
        questions: [
            "如何取消我的预订？",
            "如何更改预订日期？",
            "可以更改入住人数吗？",
            "如何更改货币？",
            "如何更改语言？",
        ],
        answers: [
            '打开“我的预订”，选择预订，然后点击“取消预订”。',
            "联系 StayWay 支持团队，并提供预订信息和新的日期。",
            "可以。请在入住日期前联系支持团队，我们会帮助您。",
            "点击页眉中的语言和货币按钮，然后选择所需货币。",
            "打开页眉中的语言和货币菜单，然后选择所需语言。",
        ],
        contactTitle: "联系支持",
        contactIntro:
            "没有找到您要的信息？给我们发送消息，我们的支持团队会帮助您。",
        success: "✓ 您的消息已成功发送！",
        name: "姓名",
        email: "电子邮箱",
        subject: "主题",
        message: "消息",
        namePlaceholder: "您的姓名",
        subjectPlaceholder: "我们可以如何帮助您？",
        messagePlaceholder: "请输入您的消息...",
        send: "发送消息",
        nameRequired: "姓名为必填项。",
        emailRequired: "电子邮箱为必填项。",
        emailInvalid: "请输入有效的电子邮箱地址。",
        subjectRequired: "主题为必填项。",
        messageRequired: "消息为必填项。",
    },

    "繁體中文": {
        title: "幫助與支援",
        intro: "尋找常見問題的答案，或聯絡我們的支援團隊。",
        faqTitle: "常見問題",
        questions: [
            "如何取消我的預訂？",
            "如何更改預訂日期？",
            "可以更改入住人數嗎？",
            "如何更改貨幣？",
            "如何更改語言？",
        ],
        answers: [
            '開啟「我的預訂」，選擇預訂，然後按一下「取消預訂」。',
            "聯絡 StayWay 支援團隊，並提供預訂資料和新日期。",
            "可以。請在入住日期前聯絡支援團隊，我們會協助您。",
            "按一下頁首的語言和貨幣按鈕，然後選擇所需貨幣。",
            "開啟頁首的語言和貨幣選單，然後選擇所需語言。",
        ],
        contactTitle: "聯絡支援",
        contactIntro:
            "找不到您需要的資訊？傳送訊息給我們，我們的支援團隊會協助您。",
        success: "✓ 您的消息已成功傳送！",
        name: "姓名",
        email: "電子郵件",
        subject: "主旨",
        message: "訊息",
        namePlaceholder: "您的姓名",
        subjectPlaceholder: "我們可以如何協助？",
        messagePlaceholder: "輸入您的訊息...",
        send: "傳送訊息",
        nameRequired: "姓名為必填項目。",
        emailRequired: "電子郵件為必填項目。",
        emailInvalid: "請輸入有效的電子郵件地址。",
        subjectRequired: "主旨為必填項目。",
        messageRequired: "訊息為必填項目。",
    },

    Català: {
        title: "Ajuda i suport",
        intro:
            "Troba respostes a preguntes freqüents o contacta amb el nostre equip de suport.",
        faqTitle: "Preguntes freqüents",
        questions: [
            "Com puc cancel·lar la meva reserva?",
            "Com puc canviar les dates de la reserva?",
            "Puc canviar el nombre d'hostes?",
            "Com puc canviar la moneda?",
            "Com puc canviar l'idioma?",
        ],
        answers: [
            'Obre «Les meves reserves», selecciona la reserva i fes clic a «Cancel·la la reserva».',
            "Contacta amb el suport de StayWay i proporciona les dades de la reserva i les noves dates.",
            "Sí. Contacta amb el suport abans de la data d'arribada i t'ajudarem.",
            "Fes clic al botó d'idioma i moneda de la capçalera i selecciona la moneda.",
            "Obre el menú d'idioma i moneda de la capçalera i tria l'idioma.",
        ],
        contactTitle: "Contacta amb el suport",
        contactIntro:
            "No trobes el que busques? Envia'ns un missatge i el nostre equip t'ajudarà.",
        success: "✓ El teu missatge s'ha enviat correctament!",
        name: "Nom",
        email: "Correu electrònic",
        subject: "Assumpte",
        message: "Missatge",
        namePlaceholder: "El teu nom",
        subjectPlaceholder: "Com et podem ajudar?",
        messagePlaceholder: "Escriu el teu missatge...",
        send: "Envia el missatge",
        nameRequired: "El nom és obligatori.",
        emailRequired: "El correu és obligatori.",
        emailInvalid: "Introdueix una adreça de correu vàlida.",
        subjectRequired: "L'assumpte és obligatori.",
        messageRequired: "El missatge és obligatori.",
    },

    Eesti: {
        title: "Abi ja tugi",
        intro:
            "Leia vastused korduma kippuvatele küsimustele või võta ühendust meie tugimeeskonnaga.",
        faqTitle: "Korduma kippuvad küsimused",
        questions: [
            "Kuidas saan oma broneeringu tühistada?",
            "Kuidas saan broneeringu kuupäevi muuta?",
            "Kas saan külaliste arvu muuta?",
            "Kuidas saan valuutat muuta?",
            "Kuidas saan keelt muuta?",
        ],
        answers: [
            'Ava „Minu broneeringud“, vali broneering ja klõpsa „Tühista broneering“.',
            "Võta ühendust StayWay toega ning esita broneeringu andmed ja uued kuupäevad.",
            "Jah. Võta enne saabumiskuupäeva toega ühendust ja aitame sind.",
            "Klõpsa päises keele ja valuuta nuppu ning vali soovitud valuuta.",
            "Ava päises keele ja valuuta menüü ning vali soovitud keel.",
        ],
        contactTitle: "Võta ühendust toega",
        contactIntro:
            "Ei leia otsitavat? Saada meile sõnum ja meie tugimeeskond aitab sind.",
        success: "✓ Sinu sõnum on edukalt saadetud!",
        name: "Nimi",
        email: "E-post",
        subject: "Teema",
        message: "Sõnum",
        namePlaceholder: "Sinu nimi",
        subjectPlaceholder: "Kuidas saame aidata?",
        messagePlaceholder: "Kirjuta oma sõnum...",
        send: "Saada sõnum",
        nameRequired: "Nimi on kohustuslik.",
        emailRequired: "E-post on kohustuslik.",
        emailInvalid: "Sisesta kehtiv e-posti aadress.",
        subjectRequired: "Teema on kohustuslik.",
        messageRequired: "Sõnum on kohustuslik.",
    },

    Latviešu: {
        title: "Palīdzība un atbalsts",
        intro:
            "Atrodiet atbildes uz biežākajiem jautājumiem vai sazinieties ar mūsu atbalsta komandu.",
        faqTitle: "Biežāk uzdotie jautājumi",
        questions: [
            "Kā atcelt rezervāciju?",
            "Kā mainīt rezervācijas datumus?",
            "Vai varu mainīt viesu skaitu?",
            "Kā mainīt valūtu?",
            "Kā mainīt valodu?",
        ],
        answers: [
            'Atveriet “Manas rezervācijas”, izvēlieties rezervāciju un noklikšķiniet uz “Atcelt rezervāciju”.',
            "Sazinieties ar StayWay atbalstu un norādiet rezervācijas informāciju un jaunos datumus.",
            "Jā. Sazinieties ar atbalstu pirms ierašanās datuma, un mēs palīdzēsim.",
            "Noklikšķiniet uz valodas un valūtas pogas galvenē un izvēlieties valūtu.",
            "Atveriet valodas un valūtas izvēlni galvenē un izvēlieties valodu.",
        ],
        contactTitle: "Sazinieties ar atbalstu",
        contactIntro:
            "Neatrodat meklēto? Nosūtiet mums ziņu, un mūsu atbalsta komanda palīdzēs.",
        success: "✓ Jūsu ziņa ir veiksmīgi nosūtīta!",
        name: "Vārds",
        email: "E-pasts",
        subject: "Temats",
        message: "Ziņa",
        namePlaceholder: "Jūsu vārds",
        subjectPlaceholder: "Kā mēs varam palīdzēt?",
        messagePlaceholder: "Uzrakstiet ziņu...",
        send: "Nosūtīt ziņu",
        nameRequired: "Vārds ir obligāts.",
        emailRequired: "E-pasts ir obligāts.",
        emailInvalid: "Ievadiet derīgu e-pasta adresi.",
        subjectRequired: "Temats ir obligāts.",
        messageRequired: "Ziņa ir obligāta.",
    },

    Lietuvių: {
        title: "Pagalba ir palaikymas",
        intro:
            "Raskite atsakymus į dažniausiai užduodamus klausimus arba susisiekite su mūsų palaikymo komanda.",
        faqTitle: "Dažniausiai užduodami klausimai",
        questions: [
            "Kaip galiu atšaukti užsakymą?",
            "Kaip galiu pakeisti užsakymo datas?",
            "Ar galiu pakeisti svečių skaičių?",
            "Kaip galiu pakeisti valiutą?",
            "Kaip galiu pakeisti kalbą?",
        ],
        answers: [
            'Atidarykite „Mano užsakymai“, pasirinkite rezervaciją ir spustelėkite „Atšaukti užsakymą“.',
            "Susisiekite su StayWay pagalbos komanda ir pateikite užsakymo informaciją bei naujas datas.",
            "Taip. Susisiekite su pagalbos komanda prieš atvykimo datą ir mes padėsime.",
            "Spustelėkite kalbos ir valiutos mygtuką antraštėje ir pasirinkite norimą valiutą.",
            "Atidarykite kalbos ir valiutos meniu antraštėje ir pasirinkite norimą kalbą.",
        ],
        contactTitle: "Susisiekti su palaikymo komanda",
        contactIntro:
            "Nerandate to, ko ieškote? Parašykite mums ir mūsų palaikymo komanda jums padės.",
        success: "✓ Jūsų žinutė sėkmingai išsiųsta!",
        name: "Vardas",
        email: "El. paštas",
        subject: "Tema",
        message: "Žinutė",
        namePlaceholder: "Jūsų vardas",
        subjectPlaceholder: "Kaip galime padėti?",
        messagePlaceholder: "Parašykite žinutę...",
        send: "Siųsti žinutę",
        nameRequired: "Vardas yra privalomas.",
        emailRequired: "El. paštas yra privalomas.",
        emailInvalid: "Įveskite galiojantį el. pašto adresą.",
        subjectRequired: "Tema yra privaloma.",
        messageRequired: "Žinutė yra privaloma.",
    },
};

function getHelpText(language: string): HelpTranslation {
    return (
        helpTranslations[language.split("|")[0]] ??
        helpTranslations.English
    );
}

export default function HelpPage() {
    const { language } = useSettings();
    const { currentUser } = useUser();

    const text = getHelpText(language);

    const [openQuestion, setOpenQuestion] =
        useState<number | null>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        setName(
            currentUser.name ??
            currentUser.firstName ??
            ""
        );

        setEmail(currentUser.email ?? "");
    }, [currentUser]);

    const validateForm = () => {
        const newErrors = {
            name: "",
            email: "",
            subject: "",
            message: "",
        };

        if (!name.trim()) {
            newErrors.name = text.nameRequired;
        }

        if (!email.trim()) {
            newErrors.email = text.emailRequired;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = text.emailInvalid;
        }

        if (!subject.trim()) {
            newErrors.subject = text.subjectRequired;
        }

        if (!message.trim()) {
            newErrors.message = text.messageRequired;
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!currentUser) {
            window.location.href = "/401";
            return;
        }

        if (!validateForm()) {
            setSubmitted(false);
            return;
        }

        /*
         * Frontend simulation for now.
         *
         * Later, when the backend is created,
         * this section will send the message
         * to the backend and then to the
         * StayWay support email.
         */
        setSubmitted(true);

        setSubject("");
        setMessage("");

        setErrors({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    return (
        <main className="help-page">
            {/* =========================
                HERO
            ========================= */}
            <section className="help-hero">

                <div className="help-hero-content stayway-load-in stayway-load-1">
                    <div className="help-icon-wrapper">
                        <span className="help-icon">?</span>
                    </div>

                    <h1>{text.title}</h1>

                    <p>{text.intro}</p>
                </div>
            </section>

            {/* =========================
                CONTENT
            ========================= */}
            <section className="help-content">
                {/* =========================
                    FAQ
                ========================= */}
                <div className="help-section faq-section stayway-load-in stayway-load-2">
                    <div className="section-heading">
                        <span className="section-label">
                            FAQ
                        </span>

                        <h2>{text.faqTitle}</h2>
                    </div>

                    <div className="faq-list">
                        {text.questions.map(
                            (question, index) => {
                                const isOpen =
                                    openQuestion ===
                                    index;

                                return (
                                    <div
                                        className={`faq-item ${
    isOpen
        ? "faq-item-open"
        : ""
}`}
                                        key={question}
                                    >
                                        <button
                                            type="button"
                                            className="faq-question"
                                            onClick={() =>
                                                setOpenQuestion(
                                                    isOpen
                                                        ? null
                                                        : index
                                                )
                                            }
                                        >
                                            <span className="faq-question-text">
                                                {question}
                                            </span>

                                            <span
                                                className={`faq-arrow ${
    isOpen
        ? "faq-arrow-open"
        : ""
}`}
                                            >
                                                {isOpen
                                                    ? "−"
                                                    : "+"}
                                            </span>
                                        </button>

                                        <div
                                            className={`faq-answer-wrapper ${
    isOpen
        ? "faq-answer-wrapper-open"
        : ""
}`}
                                        >
                                            <div className="faq-answer">
                                                {
                                                    text
                                                        .answers[
                                                        index
                                                        ]
                                                }
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* =========================
                    CONTACT
                ========================= */}
                <div className="help-section contact-section stayway-load-in stayway-load-3">
                    <div className="section-heading contact-heading">
                        <span className="section-label">
                            SUPPORT
                        </span>

                        <h2>{text.contactTitle}</h2>

                        <p className="help-description">
                            {text.contactIntro}
                        </p>
                    </div>

                    {submitted && (
                        <div className="support-success">
                            <span className="success-icon">
                                ✓
                            </span>

                            <span>
                                {text.success}
                            </span>
                        </div>
                    )}

                    <div className="support-card">
                        {/* =========================
                            LEFT INFO PANEL
                        ========================= */}
                        <aside className="support-info">
                            <div className="support-info-glow" />

                            <div className="support-info-icon">
                                ✦
                            </div>

                            <h3>
                                {language.startsWith(
                                    "Română"
                                )
                                    ? "Suntem aici pentru tine"
                                    : language.startsWith(
                                        "Русский"
                                    )
                                        ? "Мы здесь, чтобы помочь"
                                        : language.startsWith(
                                            "Français"
                                        )
                                            ? "Nous sommes là pour vous"
                                            : language.startsWith(
                                                "Español"
                                            )
                                                ? "Estamos aquí para ayudarte"
                                                : language.startsWith(
                                                    "Deutsch"
                                                )
                                                    ? "Wir sind für Sie da"
                                                    : "We're here to help"}
                            </h3>

                            <p>
                                {language.startsWith(
                                    "Română"
                                )
                                    ? "Ai o întrebare sau ai nevoie de ajutor cu rezervarea? Scrie-ne direct."
                                    : language.startsWith(
                                        "Русский"
                                    )
                                        ? "Есть вопрос или нужна помощь с бронированием? Напишите нам."
                                        : language.startsWith(
                                            "Français"
                                        )
                                            ? "Une question ou besoin d'aide avec votre réservation ? Écrivez-nous."
                                            : language.startsWith(
                                                "Español"
                                            )
                                                ? "¿Tienes una pregunta o necesitas ayuda con tu reserva? Escríbenos."
                                                : language.startsWith(
                                                    "Deutsch"
                                                )
                                                    ? "Haben Sie eine Frage oder benötigen Sie Hilfe bei Ihrer Buchung? Schreiben Sie uns."
                                                    : "Have a question or need help with your booking? Send us a message directly."}
                            </p>

                            <div className="support-info-line">
                                <span className="info-dot" />
                                <span>
                                    {language.startsWith(
                                        "Română"
                                    )
                                        ? "Răspundem cât mai curând posibil"
                                        : language.startsWith(
                                            "Русский"
                                        )
                                            ? "Мы ответим как можно скорее"
                                            : language.startsWith(
                                                "Français"
                                            )
                                                ? "Nous vous répondrons rapidement"
                                                : language.startsWith(
                                                    "Español"
                                                )
                                                    ? "Te responderemos lo antes posible"
                                                    : language.startsWith(
                                                        "Deutsch"
                                                    )
                                                        ? "Wir antworten so schnell wie möglich"
                                                        : "We'll get back to you as soon as possible"}
                                </span>
                            </div>

                            <div className="support-info-line">
                                <span className="info-dot" />
                                <span>
                                    {language.startsWith(
                                        "Română"
                                    )
                                        ? "Asistență pentru rezervări"
                                        : language.startsWith(
                                            "Русский"
                                        )
                                            ? "Помощь с бронированиями"
                                            : language.startsWith(
                                                "Français"
                                            )
                                                ? "Assistance pour les réservations"
                                                : language.startsWith(
                                                    "Español"
                                                )
                                                    ? "Asistencia con reservas"
                                                    : language.startsWith(
                                                        "Deutsch"
                                                    )
                                                        ? "Unterstützung bei Buchungen"
                                                        : "Booking assistance"}
                                </span>
                            </div>

                            <div className="support-info-line">
                                <span className="info-dot" />
                                <span>
                                    {language.startsWith(
                                        "Română"
                                    )
                                        ? "Ajutor disponibil pentru utilizatorii conectați"
                                        : language.startsWith(
                                            "Русский"
                                        )
                                            ? "Помощь доступна авторизованным пользователям"
                                            : language.startsWith(
                                                "Français"
                                            )
                                                ? "Assistance disponible pour les utilisateurs connectés"
                                                : language.startsWith(
                                                    "Español"
                                                )
                                                    ? "Ayuda disponible para usuarios conectados"
                                                    : language.startsWith(
                                                        "Deutsch"
                                                    )
                                                        ? "Hilfe für angemeldete Benutzer verfügbar"
                                                        : "Support available for signed-in users"}
                                </span>
                            </div>
                        </aside>

                        {/* =========================
                            FORM
                        ========================= */}
                        <form
                            className="support-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="help-name">
                                        {text.name}
                                    </label>

                                    <input
                                        id="help-name"
                                        type="text"
                                        value={name}
                                        onChange={(
                                            event
                                        ) =>
                                            setName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder={
                                            text.namePlaceholder
                                        }
                                        className={
                                            errors.name
                                                ? "input-error"
                                                : ""
                                        }
                                    />

                                    {errors.name && (
                                        <span className="form-error">
                                            {
                                                errors.name
                                            }
                                        </span>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="help-email">
                                        {text.email}
                                    </label>

                                    <input
                                        id="help-email"
                                        type="email"
                                        value={email}
                                        onChange={(
                                            event
                                        ) =>
                                            setEmail(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="your@email.com"
                                        className={
                                            errors.email
                                                ? "input-error"
                                                : ""
                                        }
                                    />

                                    {errors.email && (
                                        <span className="form-error">
                                            {
                                                errors.email
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="help-subject">
                                    {text.subject}
                                </label>

                                <input
                                    id="help-subject"
                                    type="text"
                                    value={subject}
                                    onChange={(
                                        event
                                    ) =>
                                        setSubject(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder={
                                        text.subjectPlaceholder
                                    }
                                    className={
                                        errors.subject
                                            ? "input-error"
                                            : ""
                                    }
                                />

                                {errors.subject && (
                                    <span className="form-error">
                                        {
                                            errors.subject
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="help-message">
                                    {text.message}
                                </label>

                                <textarea
                                    id="help-message"
                                    value={message}
                                    onChange={(
                                        event
                                    ) =>
                                        setMessage(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder={
                                        text.messagePlaceholder
                                    }
                                    rows={6}
                                    className={
                                        errors.message
                                            ? "input-error"
                                            : ""
                                    }
                                />

                                {errors.message && (
                                    <span className="form-error">
                                        {
                                            errors.message
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="form-footer">
                                <button
                                    type="submit"
                                    className="support-button"
                                >
                                    <span>
                                        {text.send}
                                    </span>

                                    <span className="button-arrow">
                                        →
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <style jsx>{`
    .help-page {
    min-height: 100vh;
    background: #fff;
    color: #29253f;
    overflow: hidden;
}

.help-hero {
    position: relative;
    min-height: 210px;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    background:
        linear-gradient(
            135deg,
        #f7f3ff 0%,
        #f3efff 52%,
        #faf8ff 100%
);

    border-bottom:
    1px solid
    rgba(112, 85, 232, 0.08);
}

.help-hero-content {
    position: relative;
    z-index: 2;

    text-align: center;

    padding: 15px 24px 25px;

}

.help-icon-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 17px;
}

.help-icon {
    width: 54px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(
        135deg,
#7257e8,
#8468f5
);
    color: white;
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    box-shadow:
    0 12px 30px
    rgba(114, 87, 232, 0.25),
        inset 0 1px 0
    rgba(255, 255, 255, 0.25);
}

.help-hero h1 {
    margin: 0;
    font-size: clamp(
        34px,
        4vw,
        48px
);
    line-height: 1.1;
    letter-spacing: -1.5px;
    font-weight: 650;
    color: #29253f;
}

.help-hero p {
    max-width: 680px;
    margin: 17px auto 0;
    color: #716c80;
    font-size: 16px;
    line-height: 1.7;
}

.help-hero-decoration {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(1px);
}

.decoration-one {
    width: 230px;
    height: 230px;
    left: -90px;
    top: -100px;
    border: 1px solid
    rgba(116, 87, 232, 0.12);
    box-shadow:
    0 0 0 40px
    rgba(116, 87, 232, 0.025),
        0 0 0 80px
    rgba(116, 87, 232, 0.018);
}

.decoration-two {
    width: 190px;
    height: 190px;
    right: -65px;
    bottom: -95px;
    border: 1px solid
    rgba(116, 87, 232, 0.1);
}

.help-content {
    width: min(900px, calc(100% - 40px));
    margin: 0 auto;
    padding: 54px 0 76px;
}

.help-section {
}

.contact-section {
    margin-top: 68px;
}

.section-heading {
    margin-bottom: 24px;
}

.section-label {
    display: inline-flex;
    align-items: center;
    padding: 6px 11px;
    margin-bottom: 10px;
    border-radius: 999px;
    background: rgba(
        113,
        87,
        232,
        0.08
    );
    color: #7057e5;
    font-size: 11px;
    font-weight: 750;
    letter-spacing: 1.2px;
}

.section-heading h2 {
    margin: 0;
    font-size: 28px;
    line-height: 1.2;
    letter-spacing: -0.7px;
    font-weight: 650;
    color: #29253f;
}

.help-description {
    max-width: 720px;
    margin: 11px 0 0;
    color: #777184;
    font-size: 15px;
    line-height: 1.7;
}

.faq-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.faq-item {
    background: #ffffff;
    border: 1px solid
    rgba(110, 91, 171, 0.13);
    border-radius: 15px;
    overflow: hidden;
    box-shadow:
    0 5px 18px
    rgba(50, 40, 85, 0.035);
    transition:
        border-color 0.25s ease,
    box-shadow 0.25s ease,
        transform 0.25s ease;
}

.faq-item:hover {
    transform: translateY(-1px);
    border-color: rgba(
        113,
        87,
        232,
        0.22
    );
    box-shadow:
    0 9px 25px
    rgba(50, 40, 85, 0.07);
}

.faq-item-open {
    border-color: rgba(
        113,
        87,
        232,
        0.25
    );
    box-shadow:
    0 10px 28px
    rgba(50, 40, 85, 0.075);
}

.faq-question {
    width: 100%;
    min-height: 67px;
    padding: 0 19px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    border: 0;
    background: transparent;
    color: #302b45;
    cursor: pointer;
    text-align: left;
}

.faq-question-text {
    font-size: 15px;
    font-weight: 650;
    line-height: 1.45;
}

.faq-arrow {
    flex: 0 0 auto;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(
        112,
        87,
        232,
        0.07
    );
    color: #7057e5;
    font-size: 20px;
    font-weight: 500;
    transition:
        transform 0.25s ease,
        background 0.25s ease;
}

.faq-arrow-open {
    background: rgba(
        112,
        87,
        232,
        0.12
    );
    transform: rotate(180deg);
}

.faq-answer-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition:
        grid-template-rows 0.28s ease;
}

.faq-answer-wrapper-open {
    grid-template-rows: 1fr;
}

.faq-answer {
    min-height: 0;
    overflow: hidden;
    padding: 0 20px;
    color: #716c80;
    font-size: 14px;
    line-height: 1.7;
    transition:
        padding 0.28s ease;
}

.faq-answer-wrapper-open
    .faq-answer {
    padding: 0 20px 20px;
}

.contact-heading {
    margin-bottom: 25px;
}

.support-success {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 17px;
    padding: 13px 16px;
    border: 1px solid
    rgba(56, 150, 94, 0.2);
    border-radius: 12px;
    background: rgba(
        74,
        173,
        105,
        0.07
    );
    color: #287c49;
    font-size: 14px;
    font-weight: 600;
    animation: successAppear 0.35s
    ease both;
}

.success-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #3eaa69;
    color: white;
    font-size: 14px;
    font-weight: 700;
}

.support-card {
    display: grid;
    grid-template-columns: 0.82fr 1.45fr;
    min-height: 475px;
    overflow: hidden;
    border: 1px solid
    rgba(105, 88, 160, 0.13);
    border-radius: 20px;
    background: #ffffff;
    box-shadow:
    0 14px 40px
    rgba(48, 39, 79, 0.07);
}

.support-info {
    position: relative;
    overflow: hidden;
    padding: 38px 30px;
    background:
        radial-gradient(
            circle at 90% 10%,
        rgba(
            161,
            139,
            255,
            0.24
        ),
        transparent 35%
),
    linear-gradient(
        145deg,
#6550d8,
#765de7 55%,
#8069ed
);
    color: white;
}

.support-info-glow {
    position: absolute;
    width: 180px;
    height: 180px;
    right: -85px;
    bottom: -75px;
    border-radius: 50%;
    border: 1px solid
    rgba(255, 255, 255, 0.16);
    box-shadow:
    0 0 0 30px
    rgba(255, 255, 255, 0.035),
        0 0 0 60px
    rgba(255, 255, 255, 0.025);
}

.support-info-icon {
    position: relative;
    z-index: 1;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 27px;
    border: 1px solid
    rgba(255, 255, 255, 0.22);
    border-radius: 14px;
    background: rgba(
        255,
        255,
        255,
        0.12
    );
    backdrop-filter: blur(8px);
    font-size: 22px;
}

.support-info h3 {
    position: relative;
    z-index: 1;
    margin: 0;
    max-width: 280px;
    font-size: 24px;
    line-height: 1.25;
    letter-spacing: -0.5px;
    font-weight: 650;
}

.support-info > p {
    position: relative;
    z-index: 1;
    margin: 16px 0 29px;
    color: rgba(
        255,
        255,
        255,
        0.82
    );
    font-size: 14px;
    line-height: 1.7;
}

.support-info-line {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 14px;
    color: rgba(
        255,
        255,
        255,
        0.86
    );
    font-size: 12.5px;
    line-height: 1.5;
}

.info-dot {
    flex: 0 0 auto;
    width: 7px;
    height: 7px;
    margin-top: 6px;
    border-radius: 50%;
    background: rgba(
        255,
        255,
        255,
        0.8
    );
    box-shadow:
    0 0 0 4px
    rgba(
        255,
        255,
        255,
        0.08
    );
}

.support-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 38px 38px 34px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 17px;
}

.form-field {
    display: flex;
    flex-direction: column;
}

.form-field label {
    margin-bottom: 8px;
    color: #39334d;
    font-size: 12px;
    font-weight: 700;
}

.form-field input,
.form-field textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid
    #e1ddea;
    border-radius: 11px;
    outline: none;
    background: #fdfcff;
    color: #302b45;
    font-family: inherit;
    font-size: 14px;
    transition:
        border-color 0.2s ease,
    box-shadow 0.2s ease,
        background 0.2s ease;
}

.form-field input {
    height: 47px;
    padding: 0 14px;
}

.form-field textarea {
    min-height: 145px;
    resize: vertical;
    padding: 13px 14px;
    line-height: 1.55;
}

.form-field input::placeholder,
.form-field textarea::placeholder {
    color: #aaa5b5;
}

.form-field input:hover,
.form-field textarea:hover {
    border-color: #cbc2df;
    background: #ffffff;
}

.form-field input:focus,
.form-field textarea:focus {
    border-color: #765be9;
    background: #ffffff;
    box-shadow:
    0 0 0 4px
    rgba(
        118,
        91,
        233,
        0.09
    );
}

.form-field .input-error {
    border-color: #d85b70;
}

.form-field .input-error:focus {
    box-shadow:
    0 0 0 4px
    rgba(
        216,
        91,
        112,
        0.08
    );
}

.form-error {
    margin-top: 6px;
    color: #c34c62;
    font-size: 11px;
    font-weight: 550;
}

.form-footer {
    display: flex;
    justify-content: flex-start;
    margin-top: auto;
    padding-top: 2px;
}

.support-button {
    min-height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 13px;
    padding: 0 18px 0 20px;
    border: 0;
    border-radius: 11px;
    background: linear-gradient(
        135deg,
#7056e4,
#8065ee
);
    color: white;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    box-shadow:
    0 8px 18px
    rgba(112, 86, 228, 0.2);
    transition:
        transform 0.2s ease,
    box-shadow 0.2s ease,
        filter 0.2s ease;
}

.support-button:hover {
    transform: translateY(-2px);
    filter: brightness(1.03);
    box-shadow:
    0 11px 24px
    rgba(112, 86, 228, 0.27);
}

.support-button:active {
    transform: translateY(0);
}

.button-arrow {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(
        255,
        255,
        255,
        0.13
    );
    font-size: 15px;
    transition: transform 0.2s ease;
}

.support-button:hover
    .button-arrow {
    transform: translateX(2px);
}

@keyframes successAppear {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 800px) {
.help-content {
        width: min(
            100% - 28px,
            900px
    );
        padding-top: 40px;
    }

.support-card {
        grid-template-columns: 1fr;
    }

.support-info {
        padding: 30px 26px;
    }

.support-info h3 {
        max-width: none;
    }

.support-form {
        padding: 28px 24px;
    }
}

@media (max-width: 600px) {
.help-hero {
        min-height: 245px;
    }

.help-hero-content {
        padding: 38px 20px;
    }

.help-hero h1 {
        font-size: 34px;
    }

.help-hero p {
        font-size: 14px;
    }

.section-heading h2 {
        font-size: 25px;
    }

.form-row {
        grid-template-columns: 1fr;
    }

.faq-question {
        min-height: 62px;
        padding: 0 15px;
    }

.faq-question-text {
        font-size: 14px;
    }

.support-info {
        padding: 27px 22px;
    }

.support-form {
        padding: 24px 19px;
    }

.support-button {
        width: 100%;
    }
}
`}</style>
        </main>
    );
}