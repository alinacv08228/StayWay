"use client";

import { useEffect, useMemo, useState } from "react";

import { useUser } from "../context/UserContext";
import { useSettings } from "../context/SettingsContext";

import {
    createReview,
    deleteReview,
    getAverageRating,
    getReviewsByPropertyId,
} from "../services/reviewService";

import { Review } from "../types/types";

type ReviewSectionProps = {
    propertyId: number;
    propertyRating: number;
};

type ReviewTranslations = {
    guestReviews: string;
    seeWhatGuestsThink: string;
    excellent: string;
    review: string;
    reviews: string;
    noReviewsYet: string;
    firstGuest: string;
    verifiedGuest: string;
    guestReview: string;
    deleting: string;
    delete: string;
    writeReview: string;
    shareExperience: string;
    yourRating: string;
    selectRating: string;
    yourReview: string;
    placeholder: string;
    publishReview: string;
    publishing: string;
    loggedInRequired: string;
    onlyUsers: string;
    selectRatingError: string;
    writeReviewError: string;
    minCharacters: string;
    addedSuccessfully: string;
    addError: string;
    deleteOwnError: string;
    deletedSuccessfully: string;
    deleteError: string;
    deleteQuestion: string;
    ratingExcellent: string;
    ratingVeryGood: string;
    ratingGood: string;
    ratingBetter: string;
    ratingPoor: string;
    star: string;
};

const reviewTranslations: Record<
    string,
    ReviewTranslations
> = {
    English: {
        guestReviews: "Guest reviews",
        seeWhatGuestsThink:
            "See what other guests think about this property.",
        excellent: "Excellent",
        review: "review",
        reviews: "reviews",
        noReviewsYet: "No reviews yet",
        firstGuest:
            "Be the first guest to share your experience.",
        verifiedGuest: "Verified guest",
        guestReview: "Guest review",
        deleting: "Deleting...",
        delete: "🗑️ Delete",
        writeReview: "✍️ Write a review",
        shareExperience:
            "Share your experience with other travellers.",
        yourRating: "Your rating",
        selectRating: "Select rating",
        yourReview: "Your review",
        placeholder:
            "Tell other travellers about your stay...",
        publishReview: "Publish review ⭐",
        publishing: "Publishing...",
        loggedInRequired:
            "You must be logged in to leave a review.",
        onlyUsers: "Only users can leave reviews.",
        selectRatingError: "Please select a rating.",
        writeReviewError: "Please write a review.",
        minCharacters:
            "Your review must contain at least 10 characters.",
        addedSuccessfully:
            "Your review has been added successfully! ⭐",
        addError:
            "Something went wrong while adding your review.",
        deleteOwnError:
            "You can only delete your own review.",
        deletedSuccessfully:
            "Your review has been deleted.",
        deleteError:
            "Something went wrong while deleting the review.",
        deleteQuestion:
            "Are you sure you want to delete your review?",
        ratingExcellent: "Excellent! ⭐",
        ratingVeryGood: "Very good! 😊",
        ratingGood: "Good 👍",
        ratingBetter: "Could be better.",
        ratingPoor: "Poor.",
        star: "star",
    },

    "Română": {
        guestReviews: "Recenzii ale oaspeților",
        seeWhatGuestsThink:
            "Vezi ce părere au alți oaspeți despre această proprietate.",
        excellent: "Excelent",
        review: "recenzie",
        reviews: "recenzii",
        noReviewsYet: "Nu există încă recenzii",
        firstGuest:
            "Fii primul oaspete care își împărtășește experiența.",
        verifiedGuest: "Oaspete verificat",
        guestReview: "Recenzie a unui oaspete",
        deleting: "Se șterge...",
        delete: "🗑️ Șterge",
        writeReview: "✍️ Lasă o recenzie",
        shareExperience:
            "Împărtășește experiența ta cu alți călători.",
        yourRating: "Evaluarea ta",
        selectRating: "Selectează evaluarea",
        yourReview: "Recenzia ta",
        placeholder:
            "Spune-le altor călători despre șederea ta...",
        publishReview: "Publică recenzia ⭐",
        publishing: "Se publică...",
        loggedInRequired:
            "Trebuie să fii autentificat pentru a lăsa o recenzie.",
        onlyUsers: "Doar utilizatorii pot lăsa recenzii.",
        selectRatingError: "Te rugăm să selectezi o evaluare.",
        writeReviewError: "Te rugăm să scrii o recenzie.",
        minCharacters:
            "Recenzia trebuie să conțină cel puțin 10 caractere.",
        addedSuccessfully:
            "Recenzia ta a fost adăugată cu succes! ⭐",
        addError:
            "A apărut o eroare la adăugarea recenziei.",
        deleteOwnError:
            "Poți șterge doar propria recenzie.",
        deletedSuccessfully:
            "Recenzia ta a fost ștearsă.",
        deleteError:
            "A apărut o eroare la ștergerea recenziei.",
        deleteQuestion:
            "Sigur vrei să ștergi recenzia?",
        ratingExcellent: "Excelent! ⭐",
        ratingVeryGood: "Foarte bine! 😊",
        ratingGood: "Bine 👍",
        ratingBetter: "Se poate mai bine.",
        ratingPoor: "Slab.",
        star: "stea",
    },

    "Русский": {
        guestReviews: "Отзывы гостей",
        seeWhatGuestsThink:
            "Посмотрите, что другие гости думают об этом объекте.",
        excellent: "Отлично",
        review: "отзыв",
        reviews: "отзывов",
        noReviewsYet: "Отзывов пока нет",
        firstGuest:
            "Будьте первым гостем, который поделится своим опытом.",
        verifiedGuest: "Проверенный гость",
        guestReview: "Отзыв гостя",
        deleting: "Удаление...",
        delete: "🗑️ Удалить",
        writeReview: "✍️ Оставить отзыв",
        shareExperience:
            "Поделитесь своим опытом с другими путешественниками.",
        yourRating: "Ваша оценка",
        selectRating: "Выберите оценку",
        yourReview: "Ваш отзыв",
        placeholder:
            "Расскажите другим путешественникам о вашем пребывании...",
        publishReview: "Опубликовать отзыв ⭐",
        publishing: "Публикация...",
        loggedInRequired:
            "Войдите в аккаунт, чтобы оставить отзыв.",
        onlyUsers: "Только пользователи могут оставлять отзывы.",
        selectRatingError: "Пожалуйста, выберите оценку.",
        writeReviewError: "Пожалуйста, напишите отзыв.",
        minCharacters:
            "Ваш отзыв должен содержать не менее 10 символов.",
        addedSuccessfully:
            "Ваш отзыв успешно добавлен! ⭐",
        addError:
            "Произошла ошибка при добавлении отзыва.",
        deleteOwnError:
            "Вы можете удалить только свой отзыв.",
        deletedSuccessfully:
            "Ваш отзыв был удалён.",
        deleteError:
            "Произошла ошибка при удалении отзыва.",
        deleteQuestion:
            "Вы уверены, что хотите удалить свой отзыв?",
        ratingExcellent: "Отлично! ⭐",
        ratingVeryGood: "Очень хорошо! 😊",
        ratingGood: "Хорошо 👍",
        ratingBetter: "Могло быть лучше.",
        ratingPoor: "Плохо.",
        star: "звезда",
    },

    "Українська": {
        guestReviews: "Відгуки гостей",
        seeWhatGuestsThink:
            "Дізнайтеся, що інші гості думають про це помешкання.",
        excellent: "Відмінно",
        review: "відгук",
        reviews: "відгуків",
        noReviewsYet: "Відгуків ще немає",
        firstGuest:
            "Будьте першим гостем, який поділиться своїм досвідом.",
        verifiedGuest: "Перевірений гість",
        guestReview: "Відгук гостя",
        deleting: "Видалення...",
        delete: "🗑️ Видалити",
        writeReview: "✍️ Залишити відгук",
        shareExperience:
            "Поділіться своїм досвідом з іншими мандрівниками.",
        yourRating: "Ваша оцінка",
        selectRating: "Оберіть оцінку",
        yourReview: "Ваш відгук",
        placeholder:
            "Розкажіть іншим мандрівникам про ваше перебування...",
        publishReview: "Опублікувати відгук ⭐",
        publishing: "Публікація...",
        loggedInRequired:
            "Увійдіть в акаунт, щоб залишити відгук.",
        onlyUsers: "Лише користувачі можуть залишати відгуки.",
        selectRatingError: "Будь ласка, оберіть оцінку.",
        writeReviewError: "Будь ласка, напишіть відгук.",
        minCharacters:
            "Ваш відгук має містити щонайменше 10 символів.",
        addedSuccessfully:
            "Ваш відгук успішно додано! ⭐",
        addError:
            "Сталася помилка під час додавання відгуку.",
        deleteOwnError:
            "Ви можете видалити лише власний відгук.",
        deletedSuccessfully:
            "Ваш відгук видалено.",
        deleteError:
            "Сталася помилка під час видалення відгуку.",
        deleteQuestion:
            "Ви впевнені, що хочете видалити свій відгук?",
        ratingExcellent: "Відмінно! ⭐",
        ratingVeryGood: "Дуже добре! 😊",
        ratingGood: "Добре 👍",
        ratingBetter: "Могло бути краще.",
        ratingPoor: "Погано.",
        star: "зірка",
    },

    "Français": {
        guestReviews: "Avis des voyageurs",
        seeWhatGuestsThink:
            "Découvrez ce que les autres voyageurs pensent de cet hébergement.",
        excellent: "Excellent",
        review: "avis",
        reviews: "avis",
        noReviewsYet: "Aucun avis pour le moment",
        firstGuest:
            "Soyez le premier voyageur à partager votre expérience.",
        verifiedGuest: "Voyageur vérifié",
        guestReview: "Avis d'un voyageur",
        deleting: "Suppression...",
        delete: "🗑️ Supprimer",
        writeReview: "✍️ Écrire un avis",
        shareExperience:
            "Partagez votre expérience avec d'autres voyageurs.",
        yourRating: "Votre note",
        selectRating: "Sélectionnez une note",
        yourReview: "Votre avis",
        placeholder:
            "Parlez aux autres voyageurs de votre séjour...",
        publishReview: "Publier l'avis ⭐",
        publishing: "Publication...",
        loggedInRequired:
            "Vous devez être connecté pour laisser un avis.",
        onlyUsers:
            "Seuls les utilisateurs peuvent laisser des avis.",
        selectRatingError: "Veuillez sélectionner une note.",
        writeReviewError: "Veuillez écrire un avis.",
        minCharacters:
            "Votre avis doit contenir au moins 10 caractères.",
        addedSuccessfully:
            "Votre avis a été ajouté avec succès ! ⭐",
        addError:
            "Une erreur s'est produite lors de l'ajout de votre avis.",
        deleteOwnError:
            "Vous ne pouvez supprimer que votre propre avis.",
        deletedSuccessfully:
            "Votre avis a été supprimé.",
        deleteError:
            "Une erreur s'est produite lors de la suppression de l'avis.",
        deleteQuestion:
            "Voulez-vous vraiment supprimer votre avis ?",
        ratingExcellent: "Excellent ! ⭐",
        ratingVeryGood: "Très bien ! 😊",
        ratingGood: "Bien 👍",
        ratingBetter: "Peut mieux faire.",
        ratingPoor: "Mauvais.",
        star: "étoile",
    },

    "Español": {
        guestReviews: "Opiniones de los huéspedes",
        seeWhatGuestsThink:
            "Descubre qué opinan otros huéspedes sobre este alojamiento.",
        excellent: "Excelente",
        review: "opinión",
        reviews: "opiniones",
        noReviewsYet: "Aún no hay opiniones",
        firstGuest:
            "Sé el primer huésped en compartir tu experiencia.",
        verifiedGuest: "Huésped verificado",
        guestReview: "Opinión de un huésped",
        deleting: "Eliminando...",
        delete: "🗑️ Eliminar",
        writeReview: "✍️ Escribir una opinión",
        shareExperience:
            "Comparte tu experiencia con otros viajeros.",
        yourRating: "Tu valoración",
        selectRating: "Selecciona una valoración",
        yourReview: "Tu opinión",
        placeholder:
            "Cuéntales a otros viajeros cómo fue tu estancia...",
        publishReview: "Publicar opinión ⭐",
        publishing: "Publicando...",
        loggedInRequired:
            "Debes iniciar sesión para dejar una opinión.",
        onlyUsers:
            "Solo los usuarios pueden dejar opiniones.",
        selectRatingError:
            "Selecciona una valoración.",
        writeReviewError:
            "Escribe una opinión.",
        minCharacters:
            "Tu opinión debe contener al menos 10 caracteres.",
        addedSuccessfully:
            "¡Tu opinión se ha añadido correctamente! ⭐",
        addError:
            "Se produjo un error al añadir tu opinión.",
        deleteOwnError:
            "Solo puedes eliminar tu propia opinión.",
        deletedSuccessfully:
            "Tu opinión ha sido eliminada.",
        deleteError:
            "Se produjo un error al eliminar la opinión.",
        deleteQuestion:
            "¿Seguro que quieres eliminar tu opinión?",
        ratingExcellent: "¡Excelente! ⭐",
        ratingVeryGood: "¡Muy bien! 😊",
        ratingGood: "Bien 👍",
        ratingBetter: "Podría ser mejor.",
        ratingPoor: "Mala.",
        star: "estrella",
    },

    "Deutsch": {
        guestReviews: "Gästebewertungen",
        seeWhatGuestsThink:
            "Sehen Sie, was andere Gäste über diese Unterkunft denken.",
        excellent: "Ausgezeichnet",
        review: "Bewertung",
        reviews: "Bewertungen",
        noReviewsYet: "Noch keine Bewertungen",
        firstGuest:
            "Seien Sie der erste Gast, der seine Erfahrung teilt.",
        verifiedGuest: "Verifizierter Gast",
        guestReview: "Gästebewertung",
        deleting: "Wird gelöscht...",
        delete: "🗑️ Löschen",
        writeReview: "✍️ Bewertung schreiben",
        shareExperience:
            "Teilen Sie Ihre Erfahrung mit anderen Reisenden.",
        yourRating: "Ihre Bewertung",
        selectRating: "Bewertung auswählen",
        yourReview: "Ihre Bewertung",
        placeholder:
            "Erzählen Sie anderen Reisenden von Ihrem Aufenthalt...",
        publishReview: "Bewertung veröffentlichen ⭐",
        publishing: "Wird veröffentlicht...",
        loggedInRequired:
            "Sie müssen angemeldet sein, um eine Bewertung abzugeben.",
        onlyUsers:
            "Nur Benutzer können Bewertungen abgeben.",
        selectRatingError:
            "Bitte wählen Sie eine Bewertung aus.",
        writeReviewError:
            "Bitte schreiben Sie eine Bewertung.",
        minCharacters:
            "Ihre Bewertung muss mindestens 10 Zeichen enthalten.",
        addedSuccessfully:
            "Ihre Bewertung wurde erfolgreich hinzugefügt! ⭐",
        addError:
            "Beim Hinzufügen Ihrer Bewertung ist ein Fehler aufgetreten.",
        deleteOwnError:
            "Sie können nur Ihre eigene Bewertung löschen.",
        deletedSuccessfully:
            "Ihre Bewertung wurde gelöscht.",
        deleteError:
            "Beim Löschen der Bewertung ist ein Fehler aufgetreten.",
        deleteQuestion:
            "Möchten Sie Ihre Bewertung wirklich löschen?",
        ratingExcellent: "Ausgezeichnet! ⭐",
        ratingVeryGood: "Sehr gut! 😊",
        ratingGood: "Gut 👍",
        ratingBetter: "Könnte besser sein.",
        ratingPoor: "Schlecht.",
        star: "Stern",
    },

    "Italiano": {
        guestReviews: "Recensioni degli ospiti",
        seeWhatGuestsThink:
            "Scopri cosa pensano gli altri ospiti di questa struttura.",
        excellent: "Eccellente",
        review: "recensione",
        reviews: "recensioni",
        noReviewsYet: "Nessuna recensione",
        firstGuest:
            "Sii il primo ospite a condividere la tua esperienza.",
        verifiedGuest: "Ospite verificato",
        guestReview: "Recensione dell'ospite",
        deleting: "Eliminazione...",
        delete: "🗑️ Elimina",
        writeReview: "✍️ Scrivi una recensione",
        shareExperience:
            "Condividi la tua esperienza con altri viaggiatori.",
        yourRating: "La tua valutazione",
        selectRating: "Seleziona una valutazione",
        yourReview: "La tua recensione",
        placeholder:
            "Racconta agli altri viaggiatori del tuo soggiorno...",
        publishReview: "Pubblica recensione ⭐",
        publishing: "Pubblicazione...",
        loggedInRequired:
            "Devi effettuare l'accesso per lasciare una recensione.",
        onlyUsers:
            "Solo gli utenti possono lasciare recensioni.",
        selectRatingError:
            "Seleziona una valutazione.",
        writeReviewError:
            "Scrivi una recensione.",
        minCharacters:
            "La recensione deve contenere almeno 10 caratteri.",
        addedSuccessfully:
            "La tua recensione è stata aggiunta con successo! ⭐",
        addError:
            "Si è verificato un errore durante l'aggiunta della recensione.",
        deleteOwnError:
            "Puoi eliminare solo la tua recensione.",
        deletedSuccessfully:
            "La tua recensione è stata eliminata.",
        deleteError:
            "Si è verificato un errore durante l'eliminazione della recensione.",
        deleteQuestion:
            "Sei sicuro di voler eliminare la tua recensione?",
        ratingExcellent: "Eccellente! ⭐",
        ratingVeryGood: "Molto bene! 😊",
        ratingGood: "Buono 👍",
        ratingBetter: "Potrebbe essere migliore.",
        ratingPoor: "Scarso.",
        star: "stella",
    },

    "Português": {
        guestReviews: "Avaliações dos hóspedes",
        seeWhatGuestsThink:
            "Veja o que outros hóspedes pensam sobre este alojamento.",
        excellent: "Excelente",
        review: "avaliação",
        reviews: "avaliações",
        noReviewsYet: "Ainda não há avaliações",
        firstGuest:
            "Seja o primeiro hóspede a partilhar a sua experiência.",
        verifiedGuest: "Hóspede verificado",
        guestReview: "Avaliação de hóspede",
        deleting: "A eliminar...",
        delete: "🗑️ Eliminar",
        writeReview: "✍️ Escrever uma avaliação",
        shareExperience:
            "Partilhe a sua experiência com outros viajantes.",
        yourRating: "A sua avaliação",
        selectRating: "Selecione uma avaliação",
        yourReview: "A sua avaliação",
        placeholder:
            "Conte a outros viajantes como foi a sua estadia...",
        publishReview: "Publicar avaliação ⭐",
        publishing: "A publicar...",
        loggedInRequired:
            "Tem de iniciar sessão para deixar uma avaliação.",
        onlyUsers:
            "Apenas utilizadores podem deixar avaliações.",
        selectRatingError:
            "Selecione uma avaliação.",
        writeReviewError:
            "Escreva uma avaliação.",
        minCharacters:
            "A avaliação deve conter pelo menos 10 caracteres.",
        addedSuccessfully:
            "A sua avaliação foi adicionada com sucesso! ⭐",
        addError:
            "Ocorreu um erro ao adicionar a avaliação.",
        deleteOwnError:
            "Só pode eliminar a sua própria avaliação.",
        deletedSuccessfully:
            "A sua avaliação foi eliminada.",
        deleteError:
            "Ocorreu um erro ao eliminar a avaliação.",
        deleteQuestion:
            "Tem a certeza de que pretende eliminar a sua avaliação?",
        ratingExcellent: "Excelente! ⭐",
        ratingVeryGood: "Muito bom! 😊",
        ratingGood: "Bom 👍",
        ratingBetter: "Pode ser melhor.",
        ratingPoor: "Fraco.",
        star: "estrela",
    },

    "Nederlands": {
        guestReviews: "Beoordelingen van gasten",
        seeWhatGuestsThink:
            "Bekijk wat andere gasten van deze accommodatie vinden.",
        excellent: "Uitstekend",
        review: "beoordeling",
        reviews: "beoordelingen",
        noReviewsYet: "Nog geen beoordelingen",
        firstGuest:
            "Wees de eerste gast die je ervaring deelt.",
        verifiedGuest: "Geverifieerde gast",
        guestReview: "Beoordeling van gast",
        deleting: "Verwijderen...",
        delete: "🗑️ Verwijderen",
        writeReview: "✍️ Een beoordeling schrijven",
        shareExperience:
            "Deel je ervaring met andere reizigers.",
        yourRating: "Jouw beoordeling",
        selectRating: "Selecteer een beoordeling",
        yourReview: "Jouw beoordeling",
        placeholder:
            "Vertel andere reizigers over je verblijf...",
        publishReview: "Beoordeling publiceren ⭐",
        publishing: "Publiceren...",
        loggedInRequired:
            "Je moet ingelogd zijn om een beoordeling achter te laten.",
        onlyUsers:
            "Alleen gebruikers kunnen beoordelingen achterlaten.",
        selectRatingError:
            "Selecteer een beoordeling.",
        writeReviewError:
            "Schrijf een beoordeling.",
        minCharacters:
            "Je beoordeling moet minstens 10 tekens bevatten.",
        addedSuccessfully:
            "Je beoordeling is succesvol toegevoegd! ⭐",
        addError:
            "Er is een fout opgetreden bij het toevoegen van je beoordeling.",
        deleteOwnError:
            "Je kunt alleen je eigen beoordeling verwijderen.",
        deletedSuccessfully:
            "Je beoordeling is verwijderd.",
        deleteError:
            "Er is een fout opgetreden bij het verwijderen van de beoordeling.",
        deleteQuestion:
            "Weet je zeker dat je je beoordeling wilt verwijderen?",
        ratingExcellent: "Uitstekend! ⭐",
        ratingVeryGood: "Heel goed! 😊",
        ratingGood: "Goed 👍",
        ratingBetter: "Kan beter.",
        ratingPoor: "Slecht.",
        star: "ster",
    },

    "Norsk": {
        guestReviews: "Gjesteanmeldelser",
        seeWhatGuestsThink:
            "Se hva andre gjester synes om dette overnattingsstedet.",
        excellent: "Utmerket",
        review: "anmeldelse",
        reviews: "anmeldelser",
        noReviewsYet: "Ingen anmeldelser ennå",
        firstGuest:
            "Bli den første gjesten som deler opplevelsen din.",
        verifiedGuest: "Bekreftet gjest",
        guestReview: "Gjesteanmeldelse",
        deleting: "Sletter...",
        delete: "🗑️ Slett",
        writeReview: "✍️ Skriv en anmeldelse",
        shareExperience:
            "Del opplevelsen din med andre reisende.",
        yourRating: "Din vurdering",
        selectRating: "Velg vurdering",
        yourReview: "Din anmeldelse",
        placeholder:
            "Fortell andre reisende om oppholdet ditt...",
        publishReview: "Publiser anmeldelse ⭐",
        publishing: "Publiserer...",
        loggedInRequired:
            "Du må være logget inn for å legge igjen en anmeldelse.",
        onlyUsers:
            "Bare brukere kan legge igjen anmeldelser.",
        selectRatingError: "Velg en vurdering.",
        writeReviewError: "Skriv en anmeldelse.",
        minCharacters:
            "Anmeldelsen må inneholde minst 10 tegn.",
        addedSuccessfully:
            "Anmeldelsen din er lagt til! ⭐",
        addError:
            "Noe gikk galt da anmeldelsen skulle legges til.",
        deleteOwnError:
            "Du kan bare slette din egen anmeldelse.",
        deletedSuccessfully:
            "Anmeldelsen din er slettet.",
        deleteError:
            "Noe gikk galt da anmeldelsen skulle slettes.",
        deleteQuestion:
            "Er du sikker på at du vil slette anmeldelsen din?",
        ratingExcellent: "Utmerket! ⭐",
        ratingVeryGood: "Veldig bra! 😊",
        ratingGood: "Bra 👍",
        ratingBetter: "Kunne vært bedre.",
        ratingPoor: "Dårlig.",
        star: "stjerne",
    },

    "Svenska": {
        guestReviews: "Gästrecensioner",
        seeWhatGuestsThink:
            "Se vad andra gäster tycker om detta boende.",
        excellent: "Utmärkt",
        review: "recension",
        reviews: "recensioner",
        noReviewsYet: "Inga recensioner ännu",
        firstGuest:
            "Bli den första gästen att dela din upplevelse.",
        verifiedGuest: "Verifierad gäst",
        guestReview: "Gästrecension",
        deleting: "Tar bort...",
        delete: "🗑️ Ta bort",
        writeReview: "✍️ Skriv en recension",
        shareExperience:
            "Dela din upplevelse med andra resenärer.",
        yourRating: "Ditt betyg",
        selectRating: "Välj betyg",
        yourReview: "Din recension",
        placeholder:
            "Berätta för andra resenärer om din vistelse...",
        publishReview: "Publicera recension ⭐",
        publishing: "Publicerar...",
        loggedInRequired:
            "Du måste vara inloggad för att lämna en recension.",
        onlyUsers:
            "Endast användare kan lämna recensioner.",
        selectRatingError: "Välj ett betyg.",
        writeReviewError: "Skriv en recension.",
        minCharacters:
            "Din recension måste innehålla minst 10 tecken.",
        addedSuccessfully:
            "Din recension har lagts till! ⭐",
        addError:
            "Något gick fel när recensionen skulle läggas till.",
        deleteOwnError:
            "Du kan bara ta bort din egen recension.",
        deletedSuccessfully:
            "Din recension har tagits bort.",
        deleteError:
            "Något gick fel när recensionen skulle tas bort.",
        deleteQuestion:
            "Är du säker på att du vill ta bort din recension?",
        ratingExcellent: "Utmärkt! ⭐",
        ratingVeryGood: "Mycket bra! 😊",
        ratingGood: "Bra 👍",
        ratingBetter: "Kan vara bättre.",
        ratingPoor: "Dåligt.",
        star: "stjärna",
    },

    "Dansk": {
        guestReviews: "Gæsteanmeldelser",
        seeWhatGuestsThink:
            "Se hvad andre gæster synes om dette overnatningssted.",
        excellent: "Fremragende",
        review: "anmeldelse",
        reviews: "anmeldelser",
        noReviewsYet: "Ingen anmeldelser endnu",
        firstGuest:
            "Vær den første gæst til at dele din oplevelse.",
        verifiedGuest: "Bekræftet gæst",
        guestReview: "Gæsteanmeldelse",
        deleting: "Sletter...",
        delete: "🗑️ Slet",
        writeReview: "✍️ Skriv en anmeldelse",
        shareExperience:
            "Del din oplevelse med andre rejsende.",
        yourRating: "Din vurdering",
        selectRating: "Vælg vurdering",
        yourReview: "Din anmeldelse",
        placeholder:
            "Fortæl andre rejsende om dit ophold...",
        publishReview: "Udgiv anmeldelse ⭐",
        publishing: "Udgiver...",
        loggedInRequired:
            "Du skal være logget ind for at skrive en anmeldelse.",
        onlyUsers:
            "Kun brugere kan skrive anmeldelser.",
        selectRatingError: "Vælg en vurdering.",
        writeReviewError: "Skriv en anmeldelse.",
        minCharacters:
            "Din anmeldelse skal indeholde mindst 10 tegn.",
        addedSuccessfully:
            "Din anmeldelse er blevet tilføjet! ⭐",
        addError:
            "Der opstod en fejl under tilføjelsen af anmeldelsen.",
        deleteOwnError:
            "Du kan kun slette din egen anmeldelse.",
        deletedSuccessfully:
            "Din anmeldelse er blevet slettet.",
        deleteError:
            "Der opstod en fejl under sletningen af anmeldelsen.",
        deleteQuestion:
            "Er du sikker på, at du vil slette din anmeldelse?",
        ratingExcellent: "Fremragende! ⭐",
        ratingVeryGood: "Meget godt! 😊",
        ratingGood: "Godt 👍",
        ratingBetter: "Kunne være bedre.",
        ratingPoor: "Dårligt.",
        star: "stjerne",
    },

    "Suomi": {
        guestReviews: "Vieraiden arvostelut",
        seeWhatGuestsThink:
            "Katso, mitä muut vieraat ajattelevat tästä majoituksesta.",
        excellent: "Erinomainen",
        review: "arvostelu",
        reviews: "arvostelua",
        noReviewsYet: "Ei vielä arvosteluja",
        firstGuest:
            "Ole ensimmäinen vieras, joka jakaa kokemuksensa.",
        verifiedGuest: "Vahvistettu vieras",
        guestReview: "Vieraan arvostelu",
        deleting: "Poistetaan...",
        delete: "🗑️ Poista",
        writeReview: "✍️ Kirjoita arvostelu",
        shareExperience:
            "Jaa kokemuksesi muiden matkailijoiden kanssa.",
        yourRating: "Arviosi",
        selectRating: "Valitse arvio",
        yourReview: "Arvostelusi",
        placeholder:
            "Kerro muille matkailijoille majoittumisestasi...",
        publishReview: "Julkaise arvostelu ⭐",
        publishing: "Julkaistaan...",
        loggedInRequired:
            "Sinun on oltava kirjautuneena kirjoittaaksesi arvostelun.",
        onlyUsers:
            "Vain käyttäjät voivat kirjoittaa arvosteluja.",
        selectRatingError: "Valitse arvio.",
        writeReviewError: "Kirjoita arvostelu.",
        minCharacters:
            "Arvostelun tulee sisältää vähintään 10 merkkiä.",
        addedSuccessfully:
            "Arvostelusi lisättiin onnistuneesti! ⭐",
        addError:
            "Arvostelun lisäämisessä tapahtui virhe.",
        deleteOwnError:
            "Voit poistaa vain oman arvostelusi.",
        deletedSuccessfully:
            "Arvostelusi on poistettu.",
        deleteError:
            "Arvostelun poistamisessa tapahtui virhe.",
        deleteQuestion:
            "Haluatko varmasti poistaa arvostelusi?",
        ratingExcellent: "Erinomainen! ⭐",
        ratingVeryGood: "Erittäin hyvä! 😊",
        ratingGood: "Hyvä 👍",
        ratingBetter: "Voisi olla parempi.",
        ratingPoor: "Huono.",
        star: "tähti",
    },

    "Polski": {
        guestReviews: "Opinie gości",
        seeWhatGuestsThink:
            "Zobacz, co inni goście sądzą o tym obiekcie.",
        excellent: "Doskonały",
        review: "opinia",
        reviews: "opinie",
        noReviewsYet: "Brak opinii",
        firstGuest:
            "Bądź pierwszym gościem, który podzieli się swoim doświadczeniem.",
        verifiedGuest: "Zweryfikowany gość",
        guestReview: "Opinia gościa",
        deleting: "Usuwanie...",
        delete: "🗑️ Usuń",
        writeReview: "✍️ Napisz opinię",
        shareExperience:
            "Podziel się swoim doświadczeniem z innymi podróżnymi.",
        yourRating: "Twoja ocena",
        selectRating: "Wybierz ocenę",
        yourReview: "Twoja opinia",
        placeholder:
            "Opowiedz innym podróżnym o swoim pobycie...",
        publishReview: "Opublikuj opinię ⭐",
        publishing: "Publikowanie...",
        loggedInRequired:
            "Musisz być zalogowany, aby dodać opinię.",
        onlyUsers:
            "Tylko użytkownicy mogą dodawać opinie.",
        selectRatingError: "Wybierz ocenę.",
        writeReviewError: "Napisz opinię.",
        minCharacters:
            "Opinia musi zawierać co najmniej 10 znaków.",
        addedSuccessfully:
            "Twoja opinia została pomyślnie dodana! ⭐",
        addError:
            "Wystąpił błąd podczas dodawania opinii.",
        deleteOwnError:
            "Możesz usunąć tylko własną opinię.",
        deletedSuccessfully:
            "Twoja opinia została usunięta.",
        deleteError:
            "Wystąpił błąd podczas usuwania opinii.",
        deleteQuestion:
            "Czy na pewno chcesz usunąć swoją opinię?",
        ratingExcellent: "Doskonały! ⭐",
        ratingVeryGood: "Bardzo dobrze! 😊",
        ratingGood: "Dobrze 👍",
        ratingBetter: "Mogło być lepiej.",
        ratingPoor: "Słabo.",
        star: "gwiazdka",
    },

    "Čeština": {
        guestReviews: "Hodnocení hostů",
        seeWhatGuestsThink:
            "Podívejte se, co si o tomto ubytování myslí ostatní hosté.",
        excellent: "Vynikající",
        review: "recenze",
        reviews: "recenzí",
        noReviewsYet: "Zatím žádné recenze",
        firstGuest:
            "Buďte prvním hostem, který se podělí o své zkušenosti.",
        verifiedGuest: "Ověřený host",
        guestReview: "Recenze hosta",
        deleting: "Mazání...",
        delete: "🗑️ Smazat",
        writeReview: "✍️ Napsat recenzi",
        shareExperience:
            "Podělte se o své zkušenosti s ostatními cestovateli.",
        yourRating: "Vaše hodnocení",
        selectRating: "Vyberte hodnocení",
        yourReview: "Vaše recenze",
        placeholder:
            "Řekněte ostatním cestovatelům o svém pobytu...",
        publishReview: "Publikovat recenzi ⭐",
        publishing: "Publikování...",
        loggedInRequired:
            "Pro přidání recenze musíte být přihlášeni.",
        onlyUsers:
            "Recenze mohou přidávat pouze uživatelé.",
        selectRatingError:
            "Vyberte hodnocení.",
        writeReviewError:
            "Napište recenzi.",
        minCharacters:
            "Recenze musí obsahovat alespoň 10 znaků.",
        addedSuccessfully:
            "Vaše recenze byla úspěšně přidána! ⭐",
        addError:
            "Při přidávání recenze došlo k chybě.",
        deleteOwnError:
            "Můžete smazat pouze svou vlastní recenzi.",
        deletedSuccessfully:
            "Vaše recenze byla smazána.",
        deleteError:
            "Při mazání recenze došlo k chybě.",
        deleteQuestion:
            "Opravdu chcete svou recenzi smazat?",
        ratingExcellent: "Vynikající! ⭐",
        ratingVeryGood: "Velmi dobré! 😊",
        ratingGood: "Dobré 👍",
        ratingBetter: "Mohlo by to být lepší.",
        ratingPoor: "Špatné.",
        star: "hvězda",
    },

    "Slovenčina": {
        guestReviews: "Recenzie hostí",
        seeWhatGuestsThink:
            "Pozrite si, čo si o tomto ubytovaní myslia ostatní hostia.",
        excellent: "Vynikajúce",
        review: "recenzia",
        reviews: "recenzie",
        noReviewsYet: "Zatiaľ žiadne recenzie",
        firstGuest:
            "Buďte prvým hosťom, ktorý sa podelí o svoje skúsenosti.",
        verifiedGuest: "Overený hosť",
        guestReview: "Recenzia hosťa",
        deleting: "Odstraňuje sa...",
        delete: "🗑️ Odstrániť",
        writeReview: "✍️ Napísať recenziu",
        shareExperience:
            "Podeľte sa o svoje skúsenosti s ostatnými cestovateľmi.",
        yourRating: "Vaše hodnotenie",
        selectRating: "Vyberte hodnotenie",
        yourReview: "Vaša recenzia",
        placeholder:
            "Povedzte ostatným cestovateľom o svojom pobyte...",
        publishReview: "Zverejniť recenziu ⭐",
        publishing: "Zverejňuje sa...",
        loggedInRequired:
            "Na pridanie recenzie musíte byť prihlásení.",
        onlyUsers:
            "Recenzie môžu pridávať iba používatelia.",
        selectRatingError:
            "Vyberte hodnotenie.",
        writeReviewError:
            "Napíšte recenziu.",
        minCharacters:
            "Recenzia musí obsahovať aspoň 10 znakov.",
        addedSuccessfully:
            "Vaša recenzia bola úspešne pridaná! ⭐",
        addError:
            "Pri pridávaní recenzie sa vyskytla chyba.",
        deleteOwnError:
            "Môžete odstrániť iba svoju vlastnú recenziu.",
        deletedSuccessfully:
            "Vaša recenzia bola odstránená.",
        deleteError:
            "Pri odstraňovaní recenzie sa vyskytla chyba.",
        deleteQuestion:
            "Naozaj chcete odstrániť svoju recenziu?",
        ratingExcellent: "Vynikajúce! ⭐",
        ratingVeryGood: "Veľmi dobré! 😊",
        ratingGood: "Dobré 👍",
        ratingBetter: "Mohlo by to byť lepšie.",
        ratingPoor: "Zlé.",
        star: "hviezdička",
    },

    "Magyar": {
        guestReviews: "Vendégértékelések",
        seeWhatGuestsThink:
            "Nézd meg, mit gondolnak más vendégek erről a szálláshelyről.",
        excellent: "Kiváló",
        review: "értékelés",
        reviews: "értékelés",
        noReviewsYet: "Még nincsenek értékelések",
        firstGuest:
            "Légy az első vendég, aki megosztja tapasztalatát.",
        verifiedGuest: "Ellenőrzött vendég",
        guestReview: "Vendégértékelés",
        deleting: "Törlés...",
        delete: "🗑️ Törlés",
        writeReview: "✍️ Értékelés írása",
        shareExperience:
            "Oszd meg tapasztalataidat más utazókkal.",
        yourRating: "Értékelésed",
        selectRating: "Válassz értékelést",
        yourReview: "Értékelésed",
        placeholder:
            "Mesélj más utazóknak a tartózkodásodról...",
        publishReview: "Értékelés közzététele ⭐",
        publishing: "Közzététel...",
        loggedInRequired:
            "Be kell jelentkezned értékelés írásához.",
        onlyUsers:
            "Csak felhasználók írhatnak értékelést.",
        selectRatingError:
            "Válassz értékelést.",
        writeReviewError:
            "Írj értékelést.",
        minCharacters:
            "Az értékelésnek legalább 10 karakterből kell állnia.",
        addedSuccessfully:
            "Az értékelésed sikeresen hozzáadtuk! ⭐",
        addError:
            "Hiba történt az értékelés hozzáadásakor.",
        deleteOwnError:
            "Csak a saját értékelésedet törölheted.",
        deletedSuccessfully:
            "Az értékelésed törölve.",
        deleteError:
            "Hiba történt az értékelés törlésekor.",
        deleteQuestion:
            "Biztosan törölni szeretnéd az értékelésedet?",
        ratingExcellent: "Kiváló! ⭐",
        ratingVeryGood: "Nagyon jó! 😊",
        ratingGood: "Jó 👍",
        ratingBetter: "Lehetne jobb.",
        ratingPoor: "Gyenge.",
        star: "csillag",
    },

    "Български": {
        guestReviews: "Отзиви от гости",
        seeWhatGuestsThink:
            "Вижте какво мислят другите гости за този обект.",
        excellent: "Отлично",
        review: "отзив",
        reviews: "отзива",
        noReviewsYet: "Все още няма отзиви",
        firstGuest:
            "Бъдете първият гост, който ще сподели своя опит.",
        verifiedGuest: "Потвърден гост",
        guestReview: "Отзив от гост",
        deleting: "Изтриване...",
        delete: "🗑️ Изтриване",
        writeReview: "✍️ Напишете отзив",
        shareExperience:
            "Споделете своя опит с други пътешественици.",
        yourRating: "Вашата оценка",
        selectRating: "Изберете оценка",
        yourReview: "Вашият отзив",
        placeholder:
            "Разкажете на други пътешественици за престоя си...",
        publishReview: "Публикуване на отзива ⭐",
        publishing: "Публикуване...",
        loggedInRequired:
            "Трябва да сте влезли в профила си, за да оставите отзив.",
        onlyUsers:
            "Само потребители могат да оставят отзиви.",
        selectRatingError:
            "Моля, изберете оценка.",
        writeReviewError:
            "Моля, напишете отзив.",
        minCharacters:
            "Отзивът трябва да съдържа поне 10 знака.",
        addedSuccessfully:
            "Вашият отзив беше добавен успешно! ⭐",
        addError:
            "Възникна грешка при добавянето на отзива.",
        deleteOwnError:
            "Можете да изтриете само собствения си отзив.",
        deletedSuccessfully:
            "Вашият отзив беше изтрит.",
        deleteError:
            "Възникна грешка при изтриването на отзива.",
        deleteQuestion:
            "Сигурни ли сте, че искате да изтриете отзива си?",
        ratingExcellent: "Отлично! ⭐",
        ratingVeryGood: "Много добре! 😊",
        ratingGood: "Добре 👍",
        ratingBetter: "Може и по-добре.",
        ratingPoor: "Лошо.",
        star: "звезда",
    },

    "Hrvatski": {
        guestReviews: "Recenzije gostiju",
        seeWhatGuestsThink:
            "Pogledajte što drugi gosti misle o ovom objektu.",
        excellent: "Izvrsno",
        review: "recenzija",
        reviews: "recenzija",
        noReviewsYet: "Još nema recenzija",
        firstGuest:
            "Budite prvi gost koji će podijeliti svoje iskustvo.",
        verifiedGuest: "Potvrđeni gost",
        guestReview: "Recenzija gosta",
        deleting: "Brisanje...",
        delete: "🗑️ Obriši",
        writeReview: "✍️ Napišite recenziju",
        shareExperience:
            "Podijelite svoje iskustvo s drugim putnicima.",
        yourRating: "Vaša ocjena",
        selectRating: "Odaberite ocjenu",
        yourReview: "Vaša recenzija",
        placeholder:
            "Recite drugim putnicima nešto o svom boravku...",
        publishReview: "Objavi recenziju ⭐",
        publishing: "Objavljivanje...",
        loggedInRequired:
            "Morate biti prijavljeni da biste ostavili recenziju.",
        onlyUsers:
            "Samo korisnici mogu ostavljati recenzije.",
        selectRatingError:
            "Odaberite ocjenu.",
        writeReviewError:
            "Napišite recenziju.",
        minCharacters:
            "Recenzija mora sadržavati najmanje 10 znakova.",
        addedSuccessfully:
            "Vaša recenzija je uspješno dodana! ⭐",
        addError:
            "Došlo je do pogreške pri dodavanju recenzije.",
        deleteOwnError:
            "Možete izbrisati samo vlastitu recenziju.",
        deletedSuccessfully:
            "Vaša recenzija je izbrisana.",
        deleteError:
            "Došlo je do pogreške pri brisanju recenzije.",
        deleteQuestion:
            "Jeste li sigurni da želite izbrisati svoju recenziju?",
        ratingExcellent: "Izvrsno! ⭐",
        ratingVeryGood: "Vrlo dobro! 😊",
        ratingGood: "Dobro 👍",
        ratingBetter: "Može biti bolje.",
        ratingPoor: "Loše.",
        star: "zvjezdica",
    },

    "Slovenščina": {
        guestReviews: "Mnenja gostov",
        seeWhatGuestsThink:
            "Preverite, kaj drugi gostje menijo o tej nastanitvi.",
        excellent: "Odlično",
        review: "mnenje",
        reviews: "mnenj",
        noReviewsYet: "Še ni mnenj",
        firstGuest:
            "Bodite prvi gost, ki bo delil svojo izkušnjo.",
        verifiedGuest: "Preverjen gost",
        guestReview: "Mnenje gosta",
        deleting: "Brisanje...",
        delete: "🗑️ Izbriši",
        writeReview: "✍️ Napišite mnenje",
        shareExperience:
            "Delite svojo izkušnjo z drugimi popotniki.",
        yourRating: "Vaša ocena",
        selectRating: "Izberite oceno",
        yourReview: "Vaše mnenje",
        placeholder:
            "Povejte drugim popotnikom o svojem bivanju...",
        publishReview: "Objavi mnenje ⭐",
        publishing: "Objavljanje...",
        loggedInRequired:
            "Za oddajo mnenja morate biti prijavljeni.",
        onlyUsers:
            "Mnenja lahko oddajajo samo uporabniki.",
        selectRatingError:
            "Izberite oceno.",
        writeReviewError:
            "Napišite mnenje.",
        minCharacters:
            "Mnenje mora vsebovati vsaj 10 znakov.",
        addedSuccessfully:
            "Vaše mnenje je bilo uspešno dodano! ⭐",
        addError:
            "Pri dodajanju mnenja je prišlo do napake.",
        deleteOwnError:
            "Izbrišete lahko samo svoje mnenje.",
        deletedSuccessfully:
            "Vaše mnenje je bilo izbrisano.",
        deleteError:
            "Pri brisanju mnenja je prišlo do napake.",
        deleteQuestion:
            "Ali ste prepričani, da želite izbrisati svoje mnenje?",
        ratingExcellent: "Odlično! ⭐",
        ratingVeryGood: "Zelo dobro! 😊",
        ratingGood: "Dobro 👍",
        ratingBetter: "Lahko bi bilo bolje.",
        ratingPoor: "Slabo.",
        star: "zvezdica",
    },

    "Srpski": {
        guestReviews: "Recenzije gostiju",
        seeWhatGuestsThink:
            "Pogledajte šta drugi gosti misle o ovom objektu.",
        excellent: "Odlično",
        review: "recenzija",
        reviews: "recenzija",
        noReviewsYet: "Još nema recenzija",
        firstGuest:
            "Budite prvi gost koji će podeliti svoje iskustvo.",
        verifiedGuest: "Verifikovani gost",
        guestReview: "Recenzija gosta",
        deleting: "Brisanje...",
        delete: "🗑️ Obriši",
        writeReview: "✍️ Napišite recenziju",
        shareExperience:
            "Podelite svoje iskustvo sa drugim putnicima.",
        yourRating: "Vaša ocena",
        selectRating: "Izaberite ocenu",
        yourReview: "Vaša recenzija",
        placeholder:
            "Recite drugim putnicima nešto o svom boravku...",
        publishReview: "Objavi recenziju ⭐",
        publishing: "Objavljivanje...",
        loggedInRequired:
            "Morate biti prijavljeni da biste ostavili recenziju.",
        onlyUsers:
            "Samo korisnici mogu ostavljati recenzije.",
        selectRatingError:
            "Izaberite ocenu.",
        writeReviewError:
            "Napišite recenziju.",
        minCharacters:
            "Recenzija mora imati najmanje 10 karaktera.",
        addedSuccessfully:
            "Vaša recenzija je uspešno dodata! ⭐",
        addError:
            "Došlo je do greške pri dodavanju recenzije.",
        deleteOwnError:
            "Možete obrisati samo svoju recenziju.",
        deletedSuccessfully:
            "Vaša recenzija je obrisana.",
        deleteError:
            "Došlo je do greške pri brisanju recenzije.",
        deleteQuestion:
            "Da li ste sigurni da želite da obrišete svoju recenziju?",
        ratingExcellent: "Odlično! ⭐",
        ratingVeryGood: "Veoma dobro! 😊",
        ratingGood: "Dobro 👍",
        ratingBetter: "Može bolje.",
        ratingPoor: "Loše.",
        star: "zvezdica",
    },

    "Bosanski": {
        guestReviews: "Recenzije gostiju",
        seeWhatGuestsThink:
            "Pogledajte šta drugi gosti misle o ovom objektu.",
        excellent: "Odlično",
        review: "recenzija",
        reviews: "recenzija",
        noReviewsYet: "Još nema recenzija",
        firstGuest:
            "Budite prvi gost koji će podijeliti svoje iskustvo.",
        verifiedGuest: "Potvrđeni gost",
        guestReview: "Recenzija gosta",
        deleting: "Brisanje...",
        delete: "🗑️ Obriši",
        writeReview: "✍️ Napišite recenziju",
        shareExperience:
            "Podijelite svoje iskustvo s drugim putnicima.",
        yourRating: "Vaša ocjena",
        selectRating: "Odaberite ocjenu",
        yourReview: "Vaša recenzija",
        placeholder:
            "Recite drugim putnicima nešto o svom boravku...",
        publishReview: "Objavi recenziju ⭐",
        publishing: "Objavljivanje...",
        loggedInRequired:
            "Morate biti prijavljeni da biste ostavili recenziju.",
        onlyUsers:
            "Samo korisnici mogu ostavljati recenzije.",
        selectRatingError:
            "Odaberite ocjenu.",
        writeReviewError:
            "Napišite recenziju.",
        minCharacters:
            "Recenzija mora sadržavati najmanje 10 znakova.",
        addedSuccessfully:
            "Vaša recenzija je uspješno dodana! ⭐",
        addError:
            "Došlo je do greške pri dodavanju recenzije.",
        deleteOwnError:
            "Možete obrisati samo svoju recenziju.",
        deletedSuccessfully:
            "Vaša recenzija je obrisana.",
        deleteError:
            "Došlo je do greške pri brisanju recenzije.",
        deleteQuestion:
            "Jeste li sigurni da želite obrisati svoju recenziju?",
        ratingExcellent: "Odlično! ⭐",
        ratingVeryGood: "Vrlo dobro! 😊",
        ratingGood: "Dobro 👍",
        ratingBetter: "Može bolje.",
        ratingPoor: "Loše.",
        star: "zvjezdica",
    },

    "Ελληνικά": {
        guestReviews: "Κριτικές επισκεπτών",
        seeWhatGuestsThink:
            "Δείτε τι πιστεύουν οι άλλοι επισκέπτες για αυτό το κατάλυμα.",
        excellent: "Εξαιρετικό",
        review: "κριτική",
        reviews: "κριτικές",
        noReviewsYet: "Δεν υπάρχουν ακόμη κριτικές",
        firstGuest:
            "Γίνετε ο πρώτος επισκέπτης που θα μοιραστεί την εμπειρία του.",
        verifiedGuest: "Επαληθευμένος επισκέπτης",
        guestReview: "Κριτική επισκέπτη",
        deleting: "Διαγραφή...",
        delete: "🗑️ Διαγραφή",
        writeReview: "✍️ Γράψτε μια κριτική",
        shareExperience:
            "Μοιραστείτε την εμπειρία σας με άλλους ταξιδιώτες.",
        yourRating: "Η βαθμολογία σας",
        selectRating: "Επιλέξτε βαθμολογία",
        yourReview: "Η κριτική σας",
        placeholder:
            "Πείτε στους άλλους ταξιδιώτες για τη διαμονή σας...",
        publishReview: "Δημοσίευση κριτικής ⭐",
        publishing: "Δημοσίευση...",
        loggedInRequired:
            "Πρέπει να συνδεθείτε για να αφήσετε κριτική.",
        onlyUsers:
            "Μόνο οι χρήστες μπορούν να αφήσουν κριτικές.",
        selectRatingError:
            "Επιλέξτε βαθμολογία.",
        writeReviewError:
            "Γράψτε μια κριτική.",
        minCharacters:
            "Η κριτική πρέπει να περιέχει τουλάχιστον 10 χαρακτήρες.",
        addedSuccessfully:
            "Η κριτική σας προστέθηκε με επιτυχία! ⭐",
        addError:
            "Παρουσιάστηκε σφάλμα κατά την προσθήκη της κριτικής.",
        deleteOwnError:
            "Μπορείτε να διαγράψετε μόνο τη δική σας κριτική.",
        deletedSuccessfully:
            "Η κριτική σας διαγράφηκε.",
        deleteError:
            "Παρουσιάστηκε σφάλμα κατά τη διαγραφή της κριτικής.",
        deleteQuestion:
            "Είστε σίγουροι ότι θέλετε να διαγράψετε την κριτική σας;",
        ratingExcellent: "Εξαιρετικό! ⭐",
        ratingVeryGood: "Πολύ καλά! 😊",
        ratingGood: "Καλό 👍",
        ratingBetter: "Θα μπορούσε να είναι καλύτερο.",
        ratingPoor: "Κακό.",
        star: "αστέρι",
    },

    "Türkçe": {
        guestReviews: "Misafir yorumları",
        seeWhatGuestsThink:
            "Diğer misafirlerin bu tesis hakkında ne düşündüğünü görün.",
        excellent: "Mükemmel",
        review: "yorum",
        reviews: "yorum",
        noReviewsYet: "Henüz yorum yok",
        firstGuest:
            "Deneyimini paylaşan ilk misafir sen ol.",
        verifiedGuest: "Doğrulanmış misafir",
        guestReview: "Misafir yorumu",
        deleting: "Siliniyor...",
        delete: "🗑️ Sil",
        writeReview: "✍️ Yorum yaz",
        shareExperience:
            "Deneyiminizi diğer gezginlerle paylaşın.",
        yourRating: "Puanınız",
        selectRating: "Puan seçin",
        yourReview: "Yorumunuz",
        placeholder:
            "Diğer gezginlere konaklamanız hakkında bilgi verin...",
        publishReview: "Yorumu yayınla ⭐",
        publishing: "Yayınlanıyor...",
        loggedInRequired:
            "Yorum bırakmak için giriş yapmalısınız.",
        onlyUsers:
            "Yalnızca kullanıcılar yorum bırakabilir.",
        selectRatingError:
            "Lütfen bir puan seçin.",
        writeReviewError:
            "Lütfen bir yorum yazın.",
        minCharacters:
            "Yorumunuz en az 10 karakter içermelidir.",
        addedSuccessfully:
            "Yorumunuz başarıyla eklendi! ⭐",
        addError:
            "Yorum eklenirken bir hata oluştu.",
        deleteOwnError:
            "Yalnızca kendi yorumunuzu silebilirsiniz.",
        deletedSuccessfully:
            "Yorumunuz silindi.",
        deleteError:
            "Yorum silinirken bir hata oluştu.",
        deleteQuestion:
            "Yorumunuzu silmek istediğinizden emin misiniz?",
        ratingExcellent: "Mükemmel! ⭐",
        ratingVeryGood: "Çok iyi! 😊",
        ratingGood: "İyi 👍",
        ratingBetter: "Daha iyi olabilirdi.",
        ratingPoor: "Kötü.",
        star: "yıldız",
    },

    "العربية": {
        guestReviews: "تقييمات الضيوف",
        seeWhatGuestsThink:
            "اطلع على آراء الضيوف الآخرين حول مكان الإقامة هذا.",
        excellent: "ممتاز",
        review: "مراجعة",
        reviews: "مراجعات",
        noReviewsYet: "لا توجد مراجعات بعد",
        firstGuest:
            "كن أول ضيف يشارك تجربته.",
        verifiedGuest: "ضيف موثّق",
        guestReview: "مراجعة ضيف",
        deleting: "جارٍ الحذف...",
        delete: "🗑️ حذف",
        writeReview: "✍️ اكتب مراجعة",
        shareExperience:
            "شارك تجربتك مع المسافرين الآخرين.",
        yourRating: "تقييمك",
        selectRating: "اختر تقييمًا",
        yourReview: "مراجعتك",
        placeholder:
            "أخبر المسافرين الآخرين عن إقامتك...",
        publishReview: "نشر المراجعة ⭐",
        publishing: "جارٍ النشر...",
        loggedInRequired:
            "يجب تسجيل الدخول لترك مراجعة.",
        onlyUsers:
            "يمكن للمستخدمين فقط ترك المراجعات.",
        selectRatingError:
            "يرجى اختيار تقييم.",
        writeReviewError:
            "يرجى كتابة مراجعة.",
        minCharacters:
            "يجب أن تحتوي المراجعة على 10 أحرف على الأقل.",
        addedSuccessfully:
            "تمت إضافة مراجعتك بنجاح! ⭐",
        addError:
            "حدث خطأ أثناء إضافة المراجعة.",
        deleteOwnError:
            "يمكنك حذف مراجعتك فقط.",
        deletedSuccessfully:
            "تم حذف مراجعتك.",
        deleteError:
            "حدث خطأ أثناء حذف المراجعة.",
        deleteQuestion:
            "هل أنت متأكد أنك تريد حذف مراجعتك؟",
        ratingExcellent: "ممتاز! ⭐",
        ratingVeryGood: "جيد جدًا! 😊",
        ratingGood: "جيد 👍",
        ratingBetter: "يمكن أن يكون أفضل.",
        ratingPoor: "ضعيف.",
        star: "نجمة",
    },

    "עברית": {
        guestReviews: "ביקורות אורחים",
        seeWhatGuestsThink:
            "ראו מה אורחים אחרים חושבים על מקום האירוח הזה.",
        excellent: "מצוין",
        review: "ביקורת",
        reviews: "ביקורות",
        noReviewsYet: "אין עדיין ביקורות",
        firstGuest:
            "היו האורחים הראשונים לשתף את החוויה שלכם.",
        verifiedGuest: "אורח מאומת",
        guestReview: "ביקורת אורח",
        deleting: "מוחק...",
        delete: "🗑️ מחיקה",
        writeReview: "✍️ כתיבת ביקורת",
        shareExperience:
            "שתפו את החוויה שלכם עם מטיילים אחרים.",
        yourRating: "הדירוג שלך",
        selectRating: "בחרו דירוג",
        yourReview: "הביקורת שלך",
        placeholder:
            "ספרו למטיילים אחרים על השהייה שלכם...",
        publishReview: "פרסום ביקורת ⭐",
        publishing: "מפרסם...",
        loggedInRequired:
            "יש להתחבר כדי להשאיר ביקורת.",
        onlyUsers:
            "רק משתמשים יכולים להשאיר ביקורות.",
        selectRatingError:
            "בחרו דירוג.",
        writeReviewError:
            "כתבו ביקורת.",
        minCharacters:
            "הביקורת חייבת להכיל לפחות 10 תווים.",
        addedSuccessfully:
            "הביקורת שלך נוספה בהצלחה! ⭐",
        addError:
            "אירעה שגיאה בעת הוספת הביקורת.",
        deleteOwnError:
            "ניתן למחוק רק את הביקורת שלך.",
        deletedSuccessfully:
            "הביקורת שלך נמחקה.",
        deleteError:
            "אירעה שגיאה בעת מחיקת הביקורת.",
        deleteQuestion:
            "האם אתם בטוחים שברצונכם למחוק את הביקורת?",
        ratingExcellent: "מצוין! ⭐",
        ratingVeryGood: "טוב מאוד! 😊",
        ratingGood: "טוב 👍",
        ratingBetter: "יכול להיות טוב יותר.",
        ratingPoor: "גרוע.",
        star: "כוכב",
    },

    "हिन्दी": {
        guestReviews: "मेहमानों की समीक्षाएँ",
        seeWhatGuestsThink:
            "देखें कि अन्य मेहमान इस आवास के बारे में क्या सोचते हैं।",
        excellent: "उत्कृष्ट",
        review: "समीक्षा",
        reviews: "समीक्षाएँ",
        noReviewsYet: "अभी कोई समीक्षा नहीं है",
        firstGuest:
            "अपना अनुभव साझा करने वाले पहले मेहमान बनें।",
        verifiedGuest: "सत्यापित मेहमान",
        guestReview: "मेहमान की समीक्षा",
        deleting: "हटाया जा रहा है...",
        delete: "🗑️ हटाएँ",
        writeReview: "✍️ समीक्षा लिखें",
        shareExperience:
            "अपना अनुभव अन्य यात्रियों के साथ साझा करें।",
        yourRating: "आपकी रेटिंग",
        selectRating: "रेटिंग चुनें",
        yourReview: "आपकी समीक्षा",
        placeholder:
            "अन्य यात्रियों को अपने ठहरने के बारे में बताएँ...",
        publishReview: "समीक्षा प्रकाशित करें ⭐",
        publishing: "प्रकाशित हो रही है...",
        loggedInRequired:
            "समीक्षा लिखने के लिए आपको लॉग इन करना होगा।",
        onlyUsers:
            "केवल उपयोगकर्ता समीक्षाएँ लिख सकते हैं।",
        selectRatingError:
            "कृपया रेटिंग चुनें।",
        writeReviewError:
            "कृपया समीक्षा लिखें।",
        minCharacters:
            "आपकी समीक्षा में कम से कम 10 अक्षर होने चाहिए।",
        addedSuccessfully:
            "आपकी समीक्षा सफलतापूर्वक जोड़ दी गई! ⭐",
        addError:
            "समीक्षा जोड़ते समय कुछ गलत हुआ।",
        deleteOwnError:
            "आप केवल अपनी समीक्षा हटा सकते हैं।",
        deletedSuccessfully:
            "आपकी समीक्षा हटा दी गई है।",
        deleteError:
            "समीक्षा हटाते समय कुछ गलत हुआ।",
        deleteQuestion:
            "क्या आप वाकई अपनी समीक्षा हटाना चाहते हैं?",
        ratingExcellent: "उत्कृष्ट! ⭐",
        ratingVeryGood: "बहुत अच्छा! 😊",
        ratingGood: "अच्छा 👍",
        ratingBetter: "और बेहतर हो सकता था।",
        ratingPoor: "खराब।",
        star: "सितारा",
    },

    "ไทย": {
        guestReviews: "รีวิวจากผู้เข้าพัก",
        seeWhatGuestsThink:
            "ดูว่าผู้เข้าพักคนอื่นคิดอย่างไรเกี่ยวกับที่พักนี้",
        excellent: "ยอดเยี่ยม",
        review: "รีวิว",
        reviews: "รีวิว",
        noReviewsYet: "ยังไม่มีรีวิว",
        firstGuest:
            "เป็นผู้เข้าพักคนแรกที่แบ่งปันประสบการณ์ของคุณ",
        verifiedGuest: "ผู้เข้าพักที่ยืนยันแล้ว",
        guestReview: "รีวิวจากผู้เข้าพัก",
        deleting: "กำลังลบ...",
        delete: "🗑️ ลบ",
        writeReview: "✍️ เขียนรีวิว",
        shareExperience:
            "แบ่งปันประสบการณ์ของคุณกับนักเดินทางคนอื่น",
        yourRating: "คะแนนของคุณ",
        selectRating: "เลือกคะแนน",
        yourReview: "รีวิวของคุณ",
        placeholder:
            "บอกนักเดินทางคนอื่นเกี่ยวกับการเข้าพักของคุณ...",
        publishReview: "เผยแพร่รีวิว ⭐",
        publishing: "กำลังเผยแพร่...",
        loggedInRequired:
            "คุณต้องเข้าสู่ระบบเพื่อเขียนรีวิว",
        onlyUsers:
            "เฉพาะผู้ใช้เท่านั้นที่สามารถเขียนรีวิวได้",
        selectRatingError:
            "กรุณาเลือกคะแนน",
        writeReviewError:
            "กรุณาเขียนรีวิว",
        minCharacters:
            "รีวิวของคุณต้องมีอย่างน้อย 10 ตัวอักษร",
        addedSuccessfully:
            "เพิ่มรีวิวของคุณเรียบร้อยแล้ว! ⭐",
        addError:
            "เกิดข้อผิดพลาดขณะเพิ่มรีวิว",
        deleteOwnError:
            "คุณสามารถลบได้เฉพาะรีวิวของคุณเอง",
        deletedSuccessfully:
            "ลบรีวิวของคุณแล้ว",
        deleteError:
            "เกิดข้อผิดพลาดขณะลบรีวิว",
        deleteQuestion:
            "คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวของคุณ?",
        ratingExcellent: "ยอดเยี่ยม! ⭐",
        ratingVeryGood: "ดีมาก! 😊",
        ratingGood: "ดี 👍",
        ratingBetter: "น่าจะดีกว่านี้",
        ratingPoor: "แย่",
        star: "ดาว",
    },

    "Bahasa Indonesia": {
        guestReviews: "Ulasan tamu",
        seeWhatGuestsThink:
            "Lihat pendapat tamu lain tentang akomodasi ini.",
        excellent: "Luar biasa",
        review: "ulasan",
        reviews: "ulasan",
        noReviewsYet: "Belum ada ulasan",
        firstGuest:
            "Jadilah tamu pertama yang membagikan pengalaman Anda.",
        verifiedGuest: "Tamu terverifikasi",
        guestReview: "Ulasan tamu",
        deleting: "Menghapus...",
        delete: "🗑️ Hapus",
        writeReview: "✍️ Tulis ulasan",
        shareExperience:
            "Bagikan pengalaman Anda dengan wisatawan lain.",
        yourRating: "Penilaian Anda",
        selectRating: "Pilih penilaian",
        yourReview: "Ulasan Anda",
        placeholder:
            "Ceritakan pengalaman menginap Anda kepada wisatawan lain...",
        publishReview: "Publikasikan ulasan ⭐",
        publishing: "Mempublikasikan...",
        loggedInRequired:
            "Anda harus masuk untuk memberikan ulasan.",
        onlyUsers:
            "Hanya pengguna yang dapat memberikan ulasan.",
        selectRatingError:
            "Silakan pilih penilaian.",
        writeReviewError:
            "Silakan tulis ulasan.",
        minCharacters:
            "Ulasan harus berisi setidaknya 10 karakter.",
        addedSuccessfully:
            "Ulasan Anda berhasil ditambahkan! ⭐",
        addError:
            "Terjadi kesalahan saat menambahkan ulasan.",
        deleteOwnError:
            "Anda hanya dapat menghapus ulasan Anda sendiri.",
        deletedSuccessfully:
            "Ulasan Anda telah dihapus.",
        deleteError:
            "Terjadi kesalahan saat menghapus ulasan.",
        deleteQuestion:
            "Apakah Anda yakin ingin menghapus ulasan Anda?",
        ratingExcellent: "Luar biasa! ⭐",
        ratingVeryGood: "Sangat bagus! 😊",
        ratingGood: "Bagus 👍",
        ratingBetter: "Bisa lebih baik.",
        ratingPoor: "Buruk.",
        star: "bintang",
    },

    "Tiếng Việt": {
        guestReviews: "Đánh giá của khách",
        seeWhatGuestsThink:
            "Xem những khách khác nghĩ gì về chỗ nghỉ này.",
        excellent: "Xuất sắc",
        review: "đánh giá",
        reviews: "đánh giá",
        noReviewsYet: "Chưa có đánh giá",
        firstGuest:
            "Hãy là vị khách đầu tiên chia sẻ trải nghiệm của bạn.",
        verifiedGuest: "Khách đã xác minh",
        guestReview: "Đánh giá của khách",
        deleting: "Đang xóa...",
        delete: "🗑️ Xóa",
        writeReview: "✍️ Viết đánh giá",
        shareExperience:
            "Chia sẻ trải nghiệm của bạn với những du khách khác.",
        yourRating: "Đánh giá của bạn",
        selectRating: "Chọn đánh giá",
        yourReview: "Đánh giá của bạn",
        placeholder:
            "Hãy kể cho những du khách khác về kỳ nghỉ của bạn...",
        publishReview: "Đăng đánh giá ⭐",
        publishing: "Đang đăng...",
        loggedInRequired:
            "Bạn phải đăng nhập để viết đánh giá.",
        onlyUsers:
            "Chỉ người dùng mới có thể viết đánh giá.",
        selectRatingError:
            "Vui lòng chọn đánh giá.",
        writeReviewError:
            "Vui lòng viết đánh giá.",
        minCharacters:
            "Đánh giá phải có ít nhất 10 ký tự.",
        addedSuccessfully:
            "Đánh giá của bạn đã được thêm thành công! ⭐",
        addError:
            "Đã xảy ra lỗi khi thêm đánh giá.",
        deleteOwnError:
            "Bạn chỉ có thể xóa đánh giá của chính mình.",
        deletedSuccessfully:
            "Đánh giá của bạn đã được xóa.",
        deleteError:
            "Đã xảy ra lỗi khi xóa đánh giá.",
        deleteQuestion:
            "Bạn có chắc chắn muốn xóa đánh giá của mình không?",
        ratingExcellent: "Xuất sắc! ⭐",
        ratingVeryGood: "Rất tốt! 😊",
        ratingGood: "Tốt 👍",
        ratingBetter: "Có thể tốt hơn.",
        ratingPoor: "Kém.",
        star: "sao",
    },

    "한국어": {
        guestReviews: "게스트 리뷰",
        seeWhatGuestsThink:
            "다른 게스트들이 이 숙소에 대해 어떻게 생각하는지 확인하세요.",
        excellent: "최고예요",
        review: "리뷰",
        reviews: "리뷰",
        noReviewsYet: "아직 리뷰가 없습니다",
        firstGuest:
            "첫 번째로 숙박 경험을 공유해 보세요.",
        verifiedGuest: "인증된 게스트",
        guestReview: "게스트 리뷰",
        deleting: "삭제 중...",
        delete: "🗑️ 삭제",
        writeReview: "✍️ 리뷰 작성",
        shareExperience:
            "다른 여행자들과 숙박 경험을 공유하세요.",
        yourRating: "평점",
        selectRating: "평점을 선택하세요",
        yourReview: "리뷰",
        placeholder:
            "다른 여행자들에게 숙박 경험을 알려주세요...",
        publishReview: "리뷰 게시 ⭐",
        publishing: "게시 중...",
        loggedInRequired:
            "리뷰를 작성하려면 로그인해야 합니다.",
        onlyUsers:
            "사용자만 리뷰를 작성할 수 있습니다.",
        selectRatingError:
            "평점을 선택하세요.",
        writeReviewError:
            "리뷰를 작성하세요.",
        minCharacters:
            "리뷰는 최소 10자 이상이어야 합니다.",
        addedSuccessfully:
            "리뷰가 성공적으로 추가되었습니다! ⭐",
        addError:
            "리뷰를 추가하는 중 문제가 발생했습니다.",
        deleteOwnError:
            "자신의 리뷰만 삭제할 수 있습니다.",
        deletedSuccessfully:
            "리뷰가 삭제되었습니다.",
        deleteError:
            "리뷰를 삭제하는 중 문제가 발생했습니다.",
        deleteQuestion:
            "정말 리뷰를 삭제하시겠습니까?",
        ratingExcellent: "최고예요! ⭐",
        ratingVeryGood: "아주 좋아요! 😊",
        ratingGood: "좋아요 👍",
        ratingBetter: "조금 더 좋을 수 있어요.",
        ratingPoor: "별로예요.",
        star: "별",
    },

    "日本語": {
        guestReviews: "ゲストのレビュー",
        seeWhatGuestsThink:
            "他のゲストがこの宿泊施設についてどう感じているかをご覧ください。",
        excellent: "最高",
        review: "レビュー",
        reviews: "レビュー",
        noReviewsYet: "まだレビューはありません",
        firstGuest:
            "最初のゲストとして体験を共有しましょう。",
        verifiedGuest: "認証済みゲスト",
        guestReview: "ゲストレビュー",
        deleting: "削除中...",
        delete: "🗑️ 削除",
        writeReview: "✍️ レビューを書く",
        shareExperience:
            "他の旅行者と滞在の体験を共有しましょう。",
        yourRating: "評価",
        selectRating: "評価を選択",
        yourReview: "レビュー",
        placeholder:
            "他の旅行者に滞在について伝えましょう...",
        publishReview: "レビューを投稿 ⭐",
        publishing: "投稿中...",
        loggedInRequired:
            "レビューを書くにはログインが必要です。",
        onlyUsers:
            "レビューを投稿できるのはユーザーのみです。",
        selectRatingError:
            "評価を選択してください。",
        writeReviewError:
            "レビューを書いてください。",
        minCharacters:
            "レビューは10文字以上で入力してください。",
        addedSuccessfully:
            "レビューが正常に追加されました！ ⭐",
        addError:
            "レビューの追加中にエラーが発生しました。",
        deleteOwnError:
            "自分のレビューのみ削除できます。",
        deletedSuccessfully:
            "レビューを削除しました。",
        deleteError:
            "レビューの削除中にエラーが発生しました。",
        deleteQuestion:
            "レビューを削除してもよろしいですか？",
        ratingExcellent: "最高です！ ⭐",
        ratingVeryGood: "とても良い！ 😊",
        ratingGood: "良い 👍",
        ratingBetter: "もう少し改善できます。",
        ratingPoor: "悪い。",
        star: "星",
    },

    "中文": {
        guestReviews: "住客评价",
        seeWhatGuestsThink:
            "看看其他住客对这家住宿的评价。",
        excellent: "非常好",
        review: "条评价",
        reviews: "条评价",
        noReviewsYet: "暂无评价",
        firstGuest:
            "成为第一位分享入住体验的住客。",
        verifiedGuest: "已验证住客",
        guestReview: "住客评价",
        deleting: "正在删除...",
        delete: "🗑️ 删除",
        writeReview: "✍️ 写评价",
        shareExperience:
            "与其他旅行者分享您的入住体验。",
        yourRating: "您的评分",
        selectRating: "选择评分",
        yourReview: "您的评价",
        placeholder:
            "告诉其他旅行者您的入住体验...",
        publishReview: "发布评价 ⭐",
        publishing: "正在发布...",
        loggedInRequired:
            "您必须登录后才能发表评论。",
        onlyUsers:
            "只有用户可以发表评论。",
        selectRatingError:
            "请选择评分。",
        writeReviewError:
            "请输入评价。",
        minCharacters:
            "评价至少需要10个字符。",
        addedSuccessfully:
            "您的评价已成功添加！ ⭐",
        addError:
            "添加评价时出现问题。",
        deleteOwnError:
            "您只能删除自己的评价。",
        deletedSuccessfully:
            "您的评价已删除。",
        deleteError:
            "删除评价时出现问题。",
        deleteQuestion:
            "确定要删除您的评价吗？",
        ratingExcellent: "非常好！ ⭐",
        ratingVeryGood: "很好！ 😊",
        ratingGood: "不错 👍",
        ratingBetter: "还可以更好。",
        ratingPoor: "较差。",
        star: "星",
    },

    "繁體中文": {
        guestReviews: "住客評價",
        seeWhatGuestsThink:
            "看看其他住客對這間住宿的評價。",
        excellent: "非常好",
        review: "則評價",
        reviews: "則評價",
        noReviewsYet: "尚無評價",
        firstGuest:
            "成為第一位分享住宿體驗的住客。",
        verifiedGuest: "已驗證住客",
        guestReview: "住客評價",
        deleting: "正在刪除...",
        delete: "🗑️ 刪除",
        writeReview: "✍️ 撰寫評價",
        shareExperience:
            "與其他旅客分享您的住宿體驗。",
        yourRating: "您的評分",
        selectRating: "選擇評分",
        yourReview: "您的評價",
        placeholder:
            "告訴其他旅客您的住宿體驗...",
        publishReview: "發布評價 ⭐",
        publishing: "正在發布...",
        loggedInRequired:
            "您必須登入後才能留下評價。",
        onlyUsers:
            "只有使用者可以留下評價。",
        selectRatingError:
            "請選擇評分。",
        writeReviewError:
            "請輸入評價。",
        minCharacters:
            "評價至少需要10個字元。",
        addedSuccessfully:
            "您的評價已成功新增！ ⭐",
        addError:
            "新增評價時發生問題。",
        deleteOwnError:
            "您只能刪除自己的評價。",
        deletedSuccessfully:
            "您的評價已刪除。",
        deleteError:
            "刪除評價時發生問題。",
        deleteQuestion:
            "確定要刪除您的評價嗎？",
        ratingExcellent: "非常好！ ⭐",
        ratingVeryGood: "很好！ 😊",
        ratingGood: "不錯 👍",
        ratingBetter: "可以更好。",
        ratingPoor: "較差。",
        star: "星",
    },

    "Català": {
        guestReviews: "Opinions dels hostes",
        seeWhatGuestsThink:
            "Mira què opinen altres hostes d'aquest allotjament.",
        excellent: "Excel·lent",
        review: "opinió",
        reviews: "opinions",
        noReviewsYet: "Encara no hi ha opinions",
        firstGuest:
            "Sigues el primer hoste a compartir la teva experiència.",
        verifiedGuest: "Hoste verificat",
        guestReview: "Opinió d'un hoste",
        deleting: "Eliminant...",
        delete: "🗑️ Elimina",
        writeReview: "✍️ Escriu una opinió",
        shareExperience:
            "Comparteix la teva experiència amb altres viatgers.",
        yourRating: "La teva puntuació",
        selectRating: "Selecciona una puntuació",
        yourReview: "La teva opinió",
        placeholder:
            "Explica als altres viatgers com ha estat la teva estada...",
        publishReview: "Publica l'opinió ⭐",
        publishing: "Publicant...",
        loggedInRequired:
            "Has d'iniciar sessió per deixar una opinió.",
        onlyUsers:
            "Només els usuaris poden deixar opinions.",
        selectRatingError:
            "Selecciona una puntuació.",
        writeReviewError:
            "Escriu una opinió.",
        minCharacters:
            "L'opinió ha de tenir almenys 10 caràcters.",
        addedSuccessfully:
            "La teva opinió s'ha afegit correctament! ⭐",
        addError:
            "S'ha produït un error en afegir l'opinió.",
        deleteOwnError:
            "Només pots eliminar la teva pròpia opinió.",
        deletedSuccessfully:
            "La teva opinió s'ha eliminat.",
        deleteError:
            "S'ha produït un error en eliminar l'opinió.",
        deleteQuestion:
            "Segur que vols eliminar la teva opinió?",
        ratingExcellent: "Excel·lent! ⭐",
        ratingVeryGood: "Molt bé! 😊",
        ratingGood: "Bé 👍",
        ratingBetter: "Podria ser millor.",
        ratingPoor: "Dolent.",
        star: "estrella",
    },

    "Eesti": {
        guestReviews: "Külaliste arvustused",
        seeWhatGuestsThink:
            "Vaata, mida teised külalised sellest majutusest arvavad.",
        excellent: "Suurepärane",
        review: "arvustus",
        reviews: "arvustust",
        noReviewsYet: "Arvustusi veel pole",
        firstGuest:
            "Ole esimene külaline, kes oma kogemust jagab.",
        verifiedGuest: "Kinnitatud külaline",
        guestReview: "Külalise arvustus",
        deleting: "Kustutamine...",
        delete: "🗑️ Kustuta",
        writeReview: "✍️ Kirjuta arvustus",
        shareExperience:
            "Jaga oma kogemust teiste reisijatega.",
        yourRating: "Sinu hinnang",
        selectRating: "Vali hinnang",
        yourReview: "Sinu arvustus",
        placeholder:
            "Räägi teistele reisijatele oma peatumisest...",
        publishReview: "Avalda arvustus ⭐",
        publishing: "Avaldamine...",
        loggedInRequired:
            "Arvustuse jätmiseks pead sisse logima.",
        onlyUsers:
            "Arvustusi saavad jätta ainult kasutajad.",
        selectRatingError:
            "Vali hinnang.",
        writeReviewError:
            "Kirjuta arvustus.",
        minCharacters:
            "Arvustus peab sisaldama vähemalt 10 tähemärki.",
        addedSuccessfully:
            "Sinu arvustus lisati edukalt! ⭐",
        addError:
            "Arvustuse lisamisel tekkis viga.",
        deleteOwnError:
            "Sa saad kustutada ainult enda arvustuse.",
        deletedSuccessfully:
            "Sinu arvustus on kustutatud.",
        deleteError:
            "Arvustuse kustutamisel tekkis viga.",
        deleteQuestion:
            "Kas oled kindel, et soovid oma arvustuse kustutada?",
        ratingExcellent: "Suurepärane! ⭐",
        ratingVeryGood: "Väga hea! 😊",
        ratingGood: "Hea 👍",
        ratingBetter: "Võiks olla parem.",
        ratingPoor: "Halb.",
        star: "tärn",
    },

    "Latviešu": {
        guestReviews: "Viesu atsauksmes",
        seeWhatGuestsThink:
            "Uzziniet, ko citi viesi domā par šo naktsmītni.",
        excellent: "Lieliski",
        review: "atsauksme",
        reviews: "atsauksmes",
        noReviewsYet: "Vēl nav atsauksmju",
        firstGuest:
            "Esiet pirmais viesis, kas dalās savā pieredzē.",
        verifiedGuest: "Verificēts viesis",
        guestReview: "Viesa atsauksme",
        deleting: "Dzēšana...",
        delete: "🗑️ Dzēst",
        writeReview: "✍️ Rakstīt atsauksmi",
        shareExperience:
            "Dalieties savā pieredzē ar citiem ceļotājiem.",
        yourRating: "Jūsu vērtējums",
        selectRating: "Izvēlieties vērtējumu",
        yourReview: "Jūsu atsauksme",
        placeholder:
            "Pastāstiet citiem ceļotājiem par savu uzturēšanos...",
        publishReview: "Publicēt atsauksmi ⭐",
        publishing: "Publicēšana...",
        loggedInRequired:
            "Lai atstātu atsauksmi, jums jāpiesakās.",
        onlyUsers:
            "Atsauksmes var atstāt tikai lietotāji.",
        selectRatingError:
            "Lūdzu, izvēlieties vērtējumu.",
        writeReviewError:
            "Lūdzu, uzrakstiet atsauksmi.",
        minCharacters:
            "Atsauksmei jāsatur vismaz 10 rakstzīmes.",
        addedSuccessfully:
            "Jūsu atsauksme tika veiksmīgi pievienota! ⭐",
        addError:
            "Pievienojot atsauksmi, radās kļūda.",
        deleteOwnError:
            "Varat dzēst tikai savu atsauksmi.",
        deletedSuccessfully:
            "Jūsu atsauksme ir izdzēsta.",
        deleteError:
            "Dzēšot atsauksmi, radās kļūda.",
        deleteQuestion:
            "Vai tiešām vēlaties dzēst savu atsauksmi?",
        ratingExcellent: "Lieliski! ⭐",
        ratingVeryGood: "Ļoti labi! 😊",
        ratingGood: "Labi 👍",
        ratingBetter: "Varētu būt labāk.",
        ratingPoor: "Slikti.",
        star: "zvaigzne",
    },

    "Lietuvių": {
        guestReviews: "Svečių atsiliepimai",
        seeWhatGuestsThink:
            "Sužinokite, ką kiti svečiai mano apie šią apgyvendinimo vietą.",
        excellent: "Puiku",
        review: "atsiliepimas",
        reviews: "atsiliepimai",
        noReviewsYet: "Atsiliepimų dar nėra",
        firstGuest:
            "Būkite pirmasis svečias, pasidalijęs savo patirtimi.",
        verifiedGuest: "Patvirtintas svečias",
        guestReview: "Svečių atsiliepimas",
        deleting: "Trinama...",
        delete: "🗑️ Ištrinti",
        writeReview: "✍️ Parašyti atsiliepimą",
        shareExperience:
            "Pasidalykite savo patirtimi su kitais keliautojais.",
        yourRating: "Jūsų įvertinimas",
        selectRating: "Pasirinkite įvertinimą",
        yourReview: "Jūsų atsiliepimas",
        placeholder:
            "Papasakokite kitiems keliautojams apie savo viešnagę...",
        publishReview: "Paskelbti atsiliepimą ⭐",
        publishing: "Skelbiama...",
        loggedInRequired:
            "Norėdami palikti atsiliepimą turite prisijungti.",
        onlyUsers:
            "Atsiliepimus gali palikti tik naudotojai.",
        selectRatingError:
            "Pasirinkite įvertinimą.",
        writeReviewError:
            "Parašykite atsiliepimą.",
        minCharacters:
            "Atsiliepimą turi sudaryti bent 10 simbolių.",
        addedSuccessfully:
            "Jūsų atsiliepimas sėkmingai pridėtas! ⭐",
        addError:
            "Pridedant atsiliepimą įvyko klaida.",
        deleteOwnError:
            "Galite ištrinti tik savo atsiliepimą.",
        deletedSuccessfully:
            "Jūsų atsiliepimas ištrintas.",
        deleteError:
            "Trinant atsiliepimą įvyko klaida.",
        deleteQuestion:
            "Ar tikrai norite ištrinti savo atsiliepimą?",
        ratingExcellent: "Puiku! ⭐",
        ratingVeryGood: "Labai gerai! 😊",
        ratingGood: "Gerai 👍",
        ratingBetter: "Galėtų būti geriau.",
        ratingPoor: "Blogai.",
        star: "žvaigždutė",
    },
};

const defaultReviewTranslations =
    reviewTranslations.English;

export default function ReviewSection({
                                          propertyId,
                                          propertyRating,
                                      }: ReviewSectionProps) {

    const { currentUser } = useUser();
    const { language } = useSettings();

    const languageName =
        language.split("|")[0];

    const text =
        reviewTranslations[languageName] ??
        defaultReviewTranslations;


    const [propertyReviews, setPropertyReviews] =
        useState<Review[]>([]);

    const [selectedRating, setSelectedRating] =
        useState(0);

    const [comment, setComment] =
        useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState<number | null>(null);


    const loadReviews = () => {
        setPropertyReviews(
            getReviewsByPropertyId(propertyId)
        );
    };


    useEffect(() => {
        loadReviews();
    }, [propertyId]);


    const averageRating = useMemo(() => {

        const calculatedRating =
            getAverageRating(propertyId);

        if (calculatedRating > 0) {
            return calculatedRating;
        }

        return propertyRating;

    }, [
        propertyId,
        propertyRating,
        propertyReviews,
    ]);


    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!currentUser) {

            setError(
                text.loggedInRequired
            );

            return;
        }


        if (currentUser.role !== "user") {

            setError(
                text.onlyUsers
            );

            return;
        }


        if (selectedRating === 0) {

            setError(
                text.selectRatingError
            );

            return;
        }


        if (!comment.trim()) {

            setError(
                text.writeReviewError
            );

            return;
        }


        if (comment.trim().length < 10) {

            setError(
                text.minCharacters
            );

            return;
        }


        setSubmitting(true);


        try {

            createReview({
                propertyId,
                userId: currentUser.id,
                userName: currentUser.name,
                rating: selectedRating,
                comment: comment.trim(),
                isMock: false,
            });


            setComment("");
            setSelectedRating(0);

            loadReviews();


            setSuccess(
                text.addedSuccessfully
            );

        } catch {

            setError(
                text.addError
            );

        } finally {

            setSubmitting(false);

        }
    };


    const handleDelete = (
        reviewId: number
    ) => {

        if (!currentUser) {
            return;
        }

        if (currentUser.role !== "user") {
            return;
        }


        const confirmed =
            window.confirm(
                text.deleteQuestion
            );


        if (!confirmed) {
            return;
        }


        setDeletingId(reviewId);


        try {

            const deleted =
                deleteReview(
                    reviewId,
                    currentUser.id
                );


            if (!deleted) {

                setError(
                    text.deleteOwnError
                );

                return;
            }


            loadReviews();


            setSuccess(
                text.deletedSuccessfully
            );

        } catch {

            setError(
                text.deleteError
            );

        } finally {

            setDeletingId(null);
        }
    };


    const formatDate = (
        date?: string
    ) => {

        if (!date) {
            return "";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }


        const localeMap: Record<string, string> = {
            English: "en-GB",
            "Română": "ro-RO",
            "Русский": "ru-RU",
            "Українська": "uk-UA",
            "Français": "fr-FR",
            "Español": "es-ES",
            "Deutsch": "de-DE",
            "Italiano": "it-IT",
            "Português": "pt-PT",
            "Nederlands": "nl-NL",
            "Norsk": "nb-NO",
            "Svenska": "sv-SE",
            "Dansk": "da-DK",
            "Suomi": "fi-FI",
            "Polski": "pl-PL",
            "Čeština": "cs-CZ",
            "Slovenčina": "sk-SK",
            "Magyar": "hu-HU",
            "Български": "bg-BG",
            "Hrvatski": "hr-HR",
            "Slovenščina": "sl-SI",
            "Srpski": "sr-RS",
            "Bosanski": "bs-BA",
            "Ελληνικά": "el-GR",
            "Türkçe": "tr-TR",
            "العربية": "ar",
            "עברית": "he-IL",
            "हिन्दी": "hi-IN",
            "ไทย": "th-TH",
            "Bahasa Indonesia": "id-ID",
            "Tiếng Việt": "vi-VN",
            "한국어": "ko-KR",
            "日本語": "ja-JP",
            "中文": "zh-CN",
            "繁體中文": "zh-TW",
            "Català": "ca-ES",
            "Eesti": "et-EE",
            "Latviešu": "lv-LV",
            "Lietuvių": "lt-LT",
        };


        const locale =
            localeMap[languageName] ??
            "en-GB";


        return parsedDate.toLocaleDateString(
            locale,
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };


    return (
        <div className="review-section">

            {/* HEADER */}

            <div className="reviews-title">

                <div>

                    <h2>
                        {text.guestReviews}
                    </h2>

                    <p>
                        {text.seeWhatGuestsThink}
                    </p>

                </div>


                <div className="review-score">

                    <strong>
                        {averageRating.toFixed(1)}
                    </strong>

                    <span>
                        ★ {text.excellent}
                    </span>

                    <small>
                        {propertyReviews.length}{" "}
                        {propertyReviews.length === 1
                            ? text.review
                            : text.reviews}
                    </small>

                </div>

            </div>


            {/* MESSAGES */}

            {error && (
                <div className="review-message review-message-error">
                    ⚠️ {error}
                </div>
            )}


            {success && (
                <div className="review-message review-message-success">
                    ✓ {success}
                </div>
            )}


            {/* REVIEWS */}

            {propertyReviews.length === 0 ? (

                <div className="review-empty">

                    <div className="review-empty-icon">
                        💬
                    </div>

                    <h3>
                        {text.noReviewsYet}
                    </h3>

                    <p>
                        {text.firstGuest}
                    </p>

                </div>

            ) : (

                <div className="reviews-list">

                    {propertyReviews.map(
                        (review) => {

                            const isOwnReview =
                                currentUser?.role ===
                                "user" &&
                                !review.isMock &&
                                review.userId ===
                                currentUser.id;


                            return (
                                <article
                                    className="review-card"
                                    key={review.id}
                                >

                                    <div className="review-card-header">

                                        <div className="review-author">

                                            <div className="review-avatar">
                                                {review.userName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>

                                                <strong>
                                                    {
                                                        review.userName
                                                    }
                                                </strong>

                                                <span>
                                                    {review.isMock
                                                        ? text.verifiedGuest
                                                        : text.guestReview}
                                                </span>

                                            </div>

                                        </div>


                                        <div className="review-rating">

                                            {"★".repeat(
                                                Math.floor(
                                                    review.rating
                                                )
                                            )}

                                            {review.rating % 1 !==
                                                0 && (
                                                    <span>
                                                        ½
                                                    </span>
                                                )}

                                        </div>

                                    </div>


                                    <p className="review-comment">
                                        {review.comment}
                                    </p>


                                    <div className="review-card-footer">

                                        <span>
                                            {formatDate(
                                                review.createdAt
                                            )}
                                        </span>


                                        {isOwnReview && (

                                            <button
                                                type="button"
                                                className="review-delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        review.id
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    review.id
                                                }
                                            >

                                                {deletingId ===
                                                review.id
                                                    ? text.deleting
                                                    : text.delete}

                                            </button>

                                        )}

                                    </div>

                                </article>
                            );
                        }
                    )}

                </div>
            )}


            {/* WRITE REVIEW */}

            {currentUser?.role ===
                "user" && (

                    <div className="write-review">

                        <div className="write-review-header">

                            <div>

                                <h3>
                                    {text.writeReview}
                                </h3>

                                <p>
                                    {text.shareExperience}
                                </p>

                            </div>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="review-form"
                        >

                            <div className="rating-selector">

                                <label>
                                    {text.yourRating}
                                </label>


                                <div
                                    className="star-selector"
                                    aria-label={
                                        text.selectRating
                                    }
                                >

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (

                                            <button
                                                key={star}
                                                type="button"
                                                className={
                                                    star <=
                                                    selectedRating
                                                        ? "star-button selected"
                                                        : "star-button"
                                                }
                                                onClick={() =>
                                                    setSelectedRating(
                                                        star
                                                    )
                                                }
                                                aria-label={`${star} ${text.star}`}
                                            >
                                                ★
                                            </button>

                                        )
                                    )}

                                </div>


                                {selectedRating > 0 && (

                                    <span className="rating-hint">

                                        {selectedRating === 5
                                            ? text.ratingExcellent
                                            : selectedRating === 4
                                                ? text.ratingVeryGood
                                                : selectedRating === 3
                                                    ? text.ratingGood
                                                    : selectedRating === 2
                                                        ? text.ratingBetter
                                                        : text.ratingPoor}

                                    </span>

                                )}

                            </div>


                            <div className="review-input-group">

                                <label htmlFor="review-comment">
                                    {text.yourReview}
                                </label>


                                <textarea
                                    id="review-comment"
                                    value={comment}
                                    onChange={(event) =>
                                        setComment(
                                            event.target.value
                                        )
                                    }
                                    placeholder={
                                        text.placeholder
                                    }
                                    rows={5}
                                    maxLength={500}
                                />


                                <div className="review-character-count">
                                    {comment.length}/500
                                </div>

                            </div>


                            <button
                                type="submit"
                                className="review-submit-button"
                                disabled={submitting}
                            >

                                {submitting
                                    ? text.publishing
                                    : text.publishReview}

                            </button>

                        </form>

                    </div>

                )}

        </div>
    );
}