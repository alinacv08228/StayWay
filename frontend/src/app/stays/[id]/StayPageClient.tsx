"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ReviewSection from "../../../components/ReviewSection";
import DynamicRoomList from "../../../components/DynamicRoomList";
import PhotoGallery from "../../../components/PhotoGallery";

import { getProperties } from "../../../services/propertyService";
import { getRoomsByPropertyId } from "../../../services/roomService";
import { getDestinations } from "../../../services/destinationService";

import {
    Property,
    Room,
    Destination,
} from "../../../types/types";

import { useSettings } from "../../../context/SettingsContext";

import {
    getLocalizedCountryName,
    getLocalizedCityName,
    getLocalizedRoomFeature,
} from "../../../data/translations";


type StayPageClientProps = {
    id: string;
};


type StayPageTranslation = {
    loading: string;
    notFound: string;
    backHome: string;
    backToDestination: string;
    excellent: string;
    staywayStay: string;
    aboutProperty: string;
    noDescription: string;
    noDescriptionText: string;
    facilitiesPolicies: string;
    facilitiesDescription: string;
    noFacilities: string;
    noFacilitiesText: string;
    chooseRoom: string;
    chooseRoomDescription: string;
};


const stayPageTranslations: Record<
    string,
    StayPageTranslation
> = {

    English: {
        loading: "Loading stay...",
        notFound: "Stay not found",
        backHome: "Back to home",
        backToDestination: "Back to destination",
        excellent: "Excellent",
        staywayStay: "STAYWAY STAY",
        aboutProperty: "About this property",
        noDescription: "No property description",
        noDescriptionText:
            "The administrator has not added a description for this property yet.",
        facilitiesPolicies: "Facilities & policies",
        facilitiesDescription:
            "These are the facilities and policies selected by the property administrator.",
        noFacilities: "No facilities listed",
        noFacilitiesText:
            "The property has not added any room facilities yet.",
        chooseRoom: "Choose your room",
        chooseRoomDescription:
            "Select a room and see its exact description, capacity, size, bed type, facilities and policies.",
    },

    "Română": {
        loading: "Se încarcă unitatea de cazare...",
        notFound: "Unitatea de cazare nu a fost găsită",
        backHome: "Înapoi la pagina principală",
        backToDestination: "Înapoi la destinație",
        excellent: "Excelent",
        staywayStay: "CAZARE STAYWAY",
        aboutProperty: "Despre această proprietate",
        noDescription: "Nu există descriere",
        noDescriptionText:
            "Administratorul nu a adăugat încă o descriere pentru această proprietate.",
        facilitiesPolicies: "Facilități și politici",
        facilitiesDescription:
            "Acestea sunt facilitățile și politicile selectate de administratorul proprietății.",
        noFacilities: "Nu sunt listate facilități",
        noFacilitiesText:
            "Proprietatea nu a adăugat încă facilități pentru camere.",
        chooseRoom: "Alege camera",
        chooseRoomDescription:
            "Selectează o cameră și vezi descrierea exactă, capacitatea, suprafața, tipul patului, facilitățile și politicile acesteia.",
    },

    "Русский": {
        loading: "Загрузка объекта размещения...",
        notFound: "Объект размещения не найден",
        backHome: "Вернуться на главную",
        backToDestination: "Вернуться к направлению",
        excellent: "Отлично",
        staywayStay: "ПРОЖИВАНИЕ STAYWAY",
        aboutProperty: "Об этом объекте",
        noDescription: "Нет описания объекта",
        noDescriptionText:
            "Администратор ещё не добавил описание этого объекта.",
        facilitiesPolicies: "Удобства и правила",
        facilitiesDescription:
            "Это удобства и правила, выбранные администратором объекта.",
        noFacilities: "Удобства не указаны",
        noFacilitiesText:
            "Для этого объекта пока не добавлены удобства номеров.",
        chooseRoom: "Выберите номер",
        chooseRoomDescription:
            "Выберите номер и ознакомьтесь с его описанием, вместимостью, размером, типом кровати, удобствами и правилами.",
    },

    "Українська": {
        loading: "Завантаження помешкання...",
        notFound: "Помешкання не знайдено",
        backHome: "Повернутися на головну",
        backToDestination: "Повернутися до напрямку",
        excellent: "Відмінно",
        staywayStay: "ПОМЕШКАННЯ STAYWAY",
        aboutProperty: "Про це помешкання",
        noDescription: "Немає опису помешкання",
        noDescriptionText:
            "Адміністратор ще не додав опис цього помешкання.",
        facilitiesPolicies: "Зручності та правила",
        facilitiesDescription:
            "Це зручності та правила, вибрані адміністратором помешкання.",
        noFacilities: "Зручності не вказані",
        noFacilitiesText:
            "Для цього помешкання ще не додано зручності номерів.",
        chooseRoom: "Оберіть номер",
        chooseRoomDescription:
            "Оберіть номер і перегляньте його опис, місткість, площу, тип ліжка, зручності та правила.",
    },

    "Français": {
        loading: "Chargement de l'hébergement...",
        notFound: "Hébergement introuvable",
        backHome: "Retour à l'accueil",
        backToDestination: "Retour à la destination",
        excellent: "Excellent",
        staywayStay: "HÉBERGEMENT STAYWAY",
        aboutProperty: "À propos de cet hébergement",
        noDescription: "Aucune description",
        noDescriptionText:
            "L'administrateur n'a pas encore ajouté de description pour cet hébergement.",
        facilitiesPolicies: "Équipements et conditions",
        facilitiesDescription:
            "Voici les équipements et conditions sélectionnés par l'administrateur.",
        noFacilities: "Aucun équipement indiqué",
        noFacilitiesText:
            "Aucun équipement de chambre n'a encore été ajouté.",
        chooseRoom: "Choisissez votre chambre",
        chooseRoomDescription:
            "Sélectionnez une chambre et consultez sa description, sa capacité, sa superficie, son type de lit, ses équipements et ses conditions.",
    },

    "Español": {
        loading: "Cargando alojamiento...",
        notFound: "Alojamiento no encontrado",
        backHome: "Volver al inicio",
        backToDestination: "Volver al destino",
        excellent: "Excelente",
        staywayStay: "ALOJAMIENTO STAYWAY",
        aboutProperty: "Sobre este alojamiento",
        noDescription: "No hay descripción",
        noDescriptionText:
            "El administrador todavía no ha añadido una descripción para este alojamiento.",
        facilitiesPolicies: "Instalaciones y condiciones",
        facilitiesDescription:
            "Estas son las instalaciones y condiciones seleccionadas por el administrador.",
        noFacilities: "No hay instalaciones",
        noFacilitiesText:
            "El alojamiento todavía no ha añadido instalaciones para las habitaciones.",
        chooseRoom: "Elige tu habitación",
        chooseRoomDescription:
            "Selecciona una habitación y consulta su descripción, capacidad, tamaño, tipo de cama, instalaciones y condiciones.",
    },

    "Deutsch": {
        loading: "Unterkunft wird geladen...",
        notFound: "Unterkunft nicht gefunden",
        backHome: "Zurück zur Startseite",
        backToDestination: "Zurück zum Reiseziel",
        excellent: "Ausgezeichnet",
        staywayStay: "STAYWAY UNTERKUNFT",
        aboutProperty: "Über diese Unterkunft",
        noDescription: "Keine Beschreibung vorhanden",
        noDescriptionText:
            "Der Administrator hat noch keine Beschreibung für diese Unterkunft hinzugefügt.",
        facilitiesPolicies: "Ausstattung und Richtlinien",
        facilitiesDescription:
            "Dies sind die vom Unterkunftsadministrator ausgewählten Ausstattungen und Richtlinien.",
        noFacilities: "Keine Ausstattung angegeben",
        noFacilitiesText:
            "Für diese Unterkunft wurden noch keine Zimmerausstattungen hinzugefügt.",
        chooseRoom: "Zimmer auswählen",
        chooseRoomDescription:
            "Wählen Sie ein Zimmer aus und sehen Sie sich die genaue Beschreibung, Kapazität, Größe, Bettenart, Ausstattung und Richtlinien an.",
    },

    "Italiano": {
        loading: "Caricamento struttura...",
        notFound: "Struttura non trovata",
        backHome: "Torna alla home",
        backToDestination: "Torna alla destinazione",
        excellent: "Eccellente",
        staywayStay: "STRUTTURA STAYWAY",
        aboutProperty: "Informazioni sulla struttura",
        noDescription: "Nessuna descrizione",
        noDescriptionText:
            "L'amministratore non ha ancora aggiunto una descrizione per questa struttura.",
        facilitiesPolicies: "Servizi e condizioni",
        facilitiesDescription:
            "Questi sono i servizi e le condizioni selezionati dall'amministratore della struttura.",
        noFacilities: "Nessun servizio indicato",
        noFacilitiesText:
            "Non sono ancora stati aggiunti servizi per le camere.",
        chooseRoom: "Scegli la tua camera",
        chooseRoomDescription:
            "Seleziona una camera e consulta la descrizione, la capacità, le dimensioni, il tipo di letto, i servizi e le condizioni.",
    },

    "Português": {
        loading: "A carregar alojamento...",
        notFound: "Alojamento não encontrado",
        backHome: "Voltar à página inicial",
        backToDestination: "Voltar ao destino",
        excellent: "Excelente",
        staywayStay: "ALOJAMENTO STAYWAY",
        aboutProperty: "Sobre este alojamento",
        noDescription: "Sem descrição",
        noDescriptionText:
            "O administrador ainda não adicionou uma descrição para este alojamento.",
        facilitiesPolicies: "Comodidades e políticas",
        facilitiesDescription:
            "Estas são as comodidades e políticas selecionadas pelo administrador.",
        noFacilities: "Nenhuma comodidade indicada",
        noFacilitiesText:
            "Ainda não foram adicionadas comodidades aos quartos.",
        chooseRoom: "Escolha o seu quarto",
        chooseRoomDescription:
            "Selecione um quarto e consulte a descrição, capacidade, tamanho, tipo de cama, comodidades e políticas.",
    },

    "Nederlands": {
        loading: "Accommodatie laden...",
        notFound: "Accommodatie niet gevonden",
        backHome: "Terug naar home",
        backToDestination: "Terug naar bestemming",
        excellent: "Uitstekend",
        staywayStay: "STAYWAY ACCOMMODATIE",
        aboutProperty: "Over deze accommodatie",
        noDescription: "Geen beschrijving",
        noDescriptionText:
            "De beheerder heeft nog geen beschrijving voor deze accommodatie toegevoegd.",
        facilitiesPolicies: "Voorzieningen en voorwaarden",
        facilitiesDescription:
            "Dit zijn de voorzieningen en voorwaarden die door de beheerder zijn geselecteerd.",
        noFacilities: "Geen voorzieningen vermeld",
        noFacilitiesText:
            "Er zijn nog geen kamervoorzieningen toegevoegd.",
        chooseRoom: "Kies je kamer",
        chooseRoomDescription:
            "Selecteer een kamer en bekijk de exacte beschrijving, capaciteit, grootte, bedtype, voorzieningen en voorwaarden.",
    },

    "Polski": {
        loading: "Ładowanie obiektu...",
        notFound: "Nie znaleziono obiektu",
        backHome: "Wróć do strony głównej",
        backToDestination: "Wróć do kierunku",
        excellent: "Doskonały",
        staywayStay: "OBIEKT STAYWAY",
        aboutProperty: "O tym obiekcie",
        noDescription: "Brak opisu obiektu",
        noDescriptionText:
            "Administrator nie dodał jeszcze opisu tego obiektu.",
        facilitiesPolicies: "Udogodnienia i zasady",
        facilitiesDescription:
            "Są to udogodnienia i zasady wybrane przez administratora obiektu.",
        noFacilities: "Brak udogodnień",
        noFacilitiesText:
            "Nie dodano jeszcze żadnych udogodnień pokoi.",
        chooseRoom: "Wybierz pokój",
        chooseRoomDescription:
            "Wybierz pokój i zobacz jego dokładny opis, pojemność, rozmiar, rodzaj łóżka, udogodnienia i zasady.",
    },

    "Čeština": {
        loading: "Načítání ubytování...",
        notFound: "Ubytování nebylo nalezeno",
        backHome: "Zpět na hlavní stránku",
        backToDestination: "Zpět do destinace",
        excellent: "Vynikající",
        staywayStay: "UBYTOVÁNÍ STAYWAY",
        aboutProperty: "O tomto ubytování",
        noDescription: "Ubytování nemá popis",
        noDescriptionText:
            "Správce zatím nepřidal popis tohoto ubytování.",
        facilitiesPolicies: "Vybavení a pravidla",
        facilitiesDescription:
            "Toto je vybavení a pravidla vybraná správcem ubytování.",
        noFacilities: "Vybavení není uvedeno",
        noFacilitiesText:
            "Pro toto ubytování zatím nebylo přidáno žádné vybavení pokojů.",
        chooseRoom: "Vyberte si pokoj",
        chooseRoomDescription:
            "Vyberte pokoj a zobrazte jeho přesný popis, kapacitu, velikost, typ postele, vybavení a pravidla.",
    },

    "Ελληνικά": {
        loading: "Φόρτωση καταλύματος...",
        notFound: "Το κατάλυμα δεν βρέθηκε",
        backHome: "Επιστροφή στην αρχική",
        backToDestination: "Επιστροφή στον προορισμό",
        excellent: "Εξαιρετικό",
        staywayStay: "ΚΑΤΑΛΥΜΑ STAYWAY",
        aboutProperty: "Σχετικά με αυτό το κατάλυμα",
        noDescription: "Δεν υπάρχει περιγραφή",
        noDescriptionText:
            "Ο διαχειριστής δεν έχει προσθέσει ακόμη περιγραφή για αυτό το κατάλυμα.",
        facilitiesPolicies: "Παροχές και πολιτικές",
        facilitiesDescription:
            "Αυτές είναι οι παροχές και οι πολιτικές που επέλεξε ο διαχειριστής.",
        noFacilities: "Δεν αναφέρονται παροχές",
        noFacilitiesText:
            "Δεν έχουν προστεθεί ακόμη παροχές δωματίων.",
        chooseRoom: "Επιλέξτε το δωμάτιό σας",
        chooseRoomDescription:
            "Επιλέξτε ένα δωμάτιο και δείτε την ακριβή περιγραφή, χωρητικότητα, μέγεθος, τύπο κρεβατιού, παροχές και πολιτικές.",
    },

    "Български": {
        loading: "Зареждане на мястото за настаняване...",
        notFound: "Мястото за настаняване не е намерено",
        backHome: "Обратно към началната страница",
        backToDestination: "Обратно към дестинацията",
        excellent: "Отлично",
        staywayStay: "НАСТАНЯВАНЕ STAYWAY",
        aboutProperty: "За този обект",
        noDescription: "Няма описание",
        noDescriptionText:
            "Администраторът все още не е добавил описание за този обект.",
        facilitiesPolicies: "Удобства и правила",
        facilitiesDescription:
            "Това са удобствата и правилата, избрани от администратора.",
        noFacilities: "Няма посочени удобства",
        noFacilitiesText:
            "Все още не са добавени удобства за стаите.",
        chooseRoom: "Изберете стая",
        chooseRoomDescription:
            "Изберете стая и вижте точното ѝ описание, капацитет, размер, тип легло, удобства и правила.",
    },

    "Türkçe": {
        loading: "Konaklama yükleniyor...",
        notFound: "Konaklama bulunamadı",
        backHome: "Ana sayfaya dön",
        backToDestination: "Destinasyona dön",
        excellent: "Mükemmel",
        staywayStay: "STAYWAY KONAKLAMA",
        aboutProperty: "Bu konaklama hakkında",
        noDescription: "Konaklama açıklaması yok",
        noDescriptionText:
            "Yönetici henüz bu konaklama için bir açıklama eklemedi.",
        facilitiesPolicies: "Olanaklar ve kurallar",
        facilitiesDescription:
            "Bunlar tesis yöneticisi tarafından seçilen olanaklar ve kurallardır.",
        noFacilities: "Olanak belirtilmemiş",
        noFacilitiesText:
            "Henüz oda olanakları eklenmemiş.",
        chooseRoom: "Odanızı seçin",
        chooseRoomDescription:
            "Bir oda seçin ve açıklamasını, kapasitesini, boyutunu, yatak tipini, olanaklarını ve kurallarını görün.",
    },

    "العربية": {
        loading: "جارٍ تحميل مكان الإقامة...",
        notFound: "لم يتم العثور على مكان الإقامة",
        backHome: "العودة إلى الصفحة الرئيسية",
        backToDestination: "العودة إلى الوجهة",
        excellent: "ممتاز",
        staywayStay: "إقامة STAYWAY",
        aboutProperty: "حول مكان الإقامة",
        noDescription: "لا يوجد وصف",
        noDescriptionText:
            "لم يضف المسؤول وصفًا لمكان الإقامة هذا بعد.",
        facilitiesPolicies: "المرافق والسياسات",
        facilitiesDescription:
            "هذه هي المرافق والسياسات التي اختارها مسؤول مكان الإقامة.",
        noFacilities: "لا توجد مرافق مدرجة",
        noFacilitiesText:
            "لم تتم إضافة مرافق للغرف بعد.",
        chooseRoom: "اختر غرفتك",
        chooseRoomDescription:
            "اختر غرفة واطلع على وصفها وسعتها ومساحتها ونوع السرير والمرافق والسياسات.",
    },

    "עברית": {
        loading: "טוען מקום אירוח...",
        notFound: "מקום האירוח לא נמצא",
        backHome: "חזרה לדף הבית",
        backToDestination: "חזרה ליעד",
        excellent: "מצוין",
        staywayStay: "אירוח STAYWAY",
        aboutProperty: "על מקום האירוח",
        noDescription: "אין תיאור",
        noDescriptionText:
            "המנהל עדיין לא הוסיף תיאור למקום האירוח הזה.",
        facilitiesPolicies: "מתקנים ומדיניות",
        facilitiesDescription:
            "אלה המתקנים והמדיניות שנבחרו על ידי מנהל מקום האירוח.",
        noFacilities: "לא צוינו מתקנים",
        noFacilitiesText:
            "עדיין לא נוספו מתקנים לחדרים.",
        chooseRoom: "בחרו את החדר שלכם",
        chooseRoomDescription:
            "בחרו חדר וצפו בתיאור המדויק, בקיבולת, בגודל, בסוג המיטה, במתקנים ובמדיניות.",
    },

    "हिन्दी": {
        loading: "आवास लोड हो रहा है...",
        notFound: "आवास नहीं मिला",
        backHome: "होम पर वापस जाएँ",
        backToDestination: "गंतव्य पर वापस जाएँ",
        excellent: "उत्कृष्ट",
        staywayStay: "STAYWAY आवास",
        aboutProperty: "इस आवास के बारे में",
        noDescription: "कोई विवरण नहीं",
        noDescriptionText:
            "व्यवस्थापक ने अभी तक इस आवास का विवरण नहीं जोड़ा है।",
        facilitiesPolicies: "सुविधाएँ और नीतियाँ",
        facilitiesDescription:
            "ये आवास व्यवस्थापक द्वारा चुनी गई सुविधाएँ और नीतियाँ हैं।",
        noFacilities: "कोई सुविधाएँ सूचीबद्ध नहीं हैं",
        noFacilitiesText:
            "अभी तक कमरों की कोई सुविधाएँ नहीं जोड़ी गई हैं।",
        chooseRoom: "अपना कमरा चुनें",
        chooseRoomDescription:
            "एक कमरा चुनें और उसका विवरण, क्षमता, आकार, बिस्तर का प्रकार, सुविधाएँ और नीतियाँ देखें।",
    },

    "ไทย": {
        loading: "กำลังโหลดที่พัก...",
        notFound: "ไม่พบที่พัก",
        backHome: "กลับหน้าหลัก",
        backToDestination: "กลับไปยังจุดหมาย",
        excellent: "ยอดเยี่ยม",
        staywayStay: "ที่พัก STAYWAY",
        aboutProperty: "เกี่ยวกับที่พักนี้",
        noDescription: "ไม่มีคำอธิบาย",
        noDescriptionText:
            "ผู้ดูแลยังไม่ได้เพิ่มคำอธิบายสำหรับที่พักนี้",
        facilitiesPolicies: "สิ่งอำนวยความสะดวกและนโยบาย",
        facilitiesDescription:
            "นี่คือสิ่งอำนวยความสะดวกและนโยบายที่ผู้ดูแลที่พักเลือกไว้",
        noFacilities: "ไม่มีสิ่งอำนวยความสะดวก",
        noFacilitiesText:
            "ยังไม่มีการเพิ่มสิ่งอำนวยความสะดวกของห้องพัก",
        chooseRoom: "เลือกห้องของคุณ",
        chooseRoomDescription:
            "เลือกห้องและดูรายละเอียด ความจุ ขนาด ประเภทเตียง สิ่งอำนวยความสะดวก และนโยบาย",
    },

    "Bahasa Indonesia": {
        loading: "Memuat akomodasi...",
        notFound: "Akomodasi tidak ditemukan",
        backHome: "Kembali ke beranda",
        backToDestination: "Kembali ke destinasi",
        excellent: "Luar biasa",
        staywayStay: "AKOMODASI STAYWAY",
        aboutProperty: "Tentang akomodasi ini",
        noDescription: "Tidak ada deskripsi",
        noDescriptionText:
            "Administrator belum menambahkan deskripsi untuk akomodasi ini.",
        facilitiesPolicies: "Fasilitas & kebijakan",
        facilitiesDescription:
            "Ini adalah fasilitas dan kebijakan yang dipilih oleh administrator akomodasi.",
        noFacilities: "Tidak ada fasilitas",
        noFacilitiesText:
            "Belum ada fasilitas kamar yang ditambahkan.",
        chooseRoom: "Pilih kamar Anda",
        chooseRoomDescription:
            "Pilih kamar dan lihat deskripsi, kapasitas, ukuran, tipe tempat tidur, fasilitas, dan kebijakannya.",
    },

    "Tiếng Việt": {
        loading: "Đang tải chỗ nghỉ...",
        notFound: "Không tìm thấy chỗ nghỉ",
        backHome: "Quay lại trang chủ",
        backToDestination: "Quay lại điểm đến",
        excellent: "Xuất sắc",
        staywayStay: "CHỖ NGHỈ STAYWAY",
        aboutProperty: "Về chỗ nghỉ này",
        noDescription: "Chưa có mô tả",
        noDescriptionText:
            "Quản trị viên chưa thêm mô tả cho chỗ nghỉ này.",
        facilitiesPolicies: "Tiện nghi & chính sách",
        facilitiesDescription:
            "Đây là các tiện nghi và chính sách được quản trị viên chỗ nghỉ lựa chọn.",
        noFacilities: "Chưa có tiện nghi",
        noFacilitiesText:
            "Chưa có tiện nghi phòng nào được thêm.",
        chooseRoom: "Chọn phòng của bạn",
        chooseRoomDescription:
            "Chọn một phòng để xem mô tả chính xác, sức chứa, diện tích, loại giường, tiện nghi và chính sách.",
    },

    "한국어": {
        loading: "숙소를 불러오는 중...",
        notFound: "숙소를 찾을 수 없습니다",
        backHome: "홈으로 돌아가기",
        backToDestination: "목적지로 돌아가기",
        excellent: "최고예요",
        staywayStay: "STAYWAY 숙소",
        aboutProperty: "숙소 소개",
        noDescription: "숙소 설명이 없습니다",
        noDescriptionText:
            "관리자가 아직 이 숙소에 대한 설명을 추가하지 않았습니다.",
        facilitiesPolicies: "편의시설 및 정책",
        facilitiesDescription:
            "숙소 관리자가 선택한 편의시설과 정책입니다.",
        noFacilities: "등록된 편의시설이 없습니다",
        noFacilitiesText:
            "아직 객실 편의시설이 추가되지 않았습니다.",
        chooseRoom: "객실 선택",
        chooseRoomDescription:
            "객실을 선택하고 정확한 설명, 수용 인원, 크기, 침대 유형, 편의시설 및 정책을 확인하세요.",
    },

    "日本語": {
        loading: "宿泊施設を読み込んでいます...",
        notFound: "宿泊施設が見つかりません",
        backHome: "ホームに戻る",
        backToDestination: "目的地に戻る",
        excellent: "最高",
        staywayStay: "STAYWAY 宿泊施設",
        aboutProperty: "この宿泊施設について",
        noDescription: "宿泊施設の説明はありません",
        noDescriptionText:
            "管理者はまだこの宿泊施設の説明を追加していません。",
        facilitiesPolicies: "設備とポリシー",
        facilitiesDescription:
            "宿泊施設の管理者が選択した設備とポリシーです。",
        noFacilities: "設備はありません",
        noFacilitiesText:
            "まだ客室の設備が追加されていません。",
        chooseRoom: "お部屋を選択",
        chooseRoomDescription:
            "お部屋を選択して、詳細な説明、定員、広さ、ベッドタイプ、設備、ポリシーをご確認ください。",
    },

    "中文": {
        loading: "正在加载住宿...",
        notFound: "未找到住宿",
        backHome: "返回首页",
        backToDestination: "返回目的地",
        excellent: "非常好",
        staywayStay: "STAYWAY 住宿",
        aboutProperty: "关于此住宿",
        noDescription: "暂无住宿描述",
        noDescriptionText:
            "管理员尚未为此住宿添加描述。",
        facilitiesPolicies: "设施与政策",
        facilitiesDescription:
            "以下是住宿管理员选择的设施和政策。",
        noFacilities: "暂无设施",
        noFacilitiesText:
            "尚未添加客房设施。",
        chooseRoom: "选择您的房间",
        chooseRoomDescription:
            "选择房间并查看详细描述、入住人数、面积、床型、设施和政策。",
    },

    "繁體中文": {
        loading: "正在載入住宿...",
        notFound: "找不到住宿",
        backHome: "返回首頁",
        backToDestination: "返回目的地",
        excellent: "非常好",
        staywayStay: "STAYWAY 住宿",
        aboutProperty: "關於此住宿",
        noDescription: "沒有住宿描述",
        noDescriptionText:
            "管理員尚未為此住宿新增描述。",
        facilitiesPolicies: "設施與政策",
        facilitiesDescription:
            "以下是住宿管理員選擇的設施與政策。",
        noFacilities: "沒有列出的設施",
        noFacilitiesText:
            "尚未新增客房設施。",
        chooseRoom: "選擇您的房間",
        chooseRoomDescription:
            "選擇房間並查看詳細描述、入住人數、大小、床型、設施和政策。",
    },

    "Català": {
        loading: "Carregant allotjament...",
        notFound: "Allotjament no trobat",
        backHome: "Torna a l'inici",
        backToDestination: "Torna a la destinació",
        excellent: "Excel·lent",
        staywayStay: "ALLOTJAMENT STAYWAY",
        aboutProperty: "Sobre aquest allotjament",
        noDescription: "No hi ha descripció",
        noDescriptionText:
            "L'administrador encara no ha afegit una descripció per a aquest allotjament.",
        facilitiesPolicies: "Instal·lacions i polítiques",
        facilitiesDescription:
            "Aquestes són les instal·lacions i polítiques seleccionades per l'administrador.",
        noFacilities: "No hi ha instal·lacions",
        noFacilitiesText:
            "Encara no s'han afegit instal·lacions a les habitacions.",
        chooseRoom: "Tria la teva habitació",
        chooseRoomDescription:
            "Selecciona una habitació i consulta'n la descripció, capacitat, mida, tipus de llit, instal·lacions i polítiques.",
    },

    "Eesti": {
        loading: "Majutuse laadimine...",
        notFound: "Majutust ei leitud",
        backHome: "Tagasi avalehele",
        backToDestination: "Tagasi sihtkohta",
        excellent: "Suurepärane",
        staywayStay: "STAYWAY MAJUTUS",
        aboutProperty: "Selle majutuse kohta",
        noDescription: "Majutuse kirjeldus puudub",
        noDescriptionText:
            "Administraator ei ole veel sellele majutusele kirjeldust lisanud.",
        facilitiesPolicies: "Mugavused ja reeglid",
        facilitiesDescription:
            "Need on majutuse administraatori valitud mugavused ja reeglid.",
        noFacilities: "Mugavusi pole loetletud",
        noFacilitiesText:
            "Tubade mugavusi pole veel lisatud.",
        chooseRoom: "Vali tuba",
        chooseRoomDescription:
            "Vali tuba ja vaata selle täpset kirjeldust, mahutavust, suurust, vooditüüpi, mugavusi ja reegleid.",
    },

    "Latviešu": {
        loading: "Notiek naktsmītnes ielāde...",
        notFound: "Naktsmītne nav atrasta",
        backHome: "Atpakaļ uz sākumlapu",
        backToDestination: "Atpakaļ uz galamērķi",
        excellent: "Lieliski",
        staywayStay: "STAYWAY NAKTSMĪTNE",
        aboutProperty: "Par šo naktsmītni",
        noDescription: "Nav naktsmītnes apraksta",
        noDescriptionText:
            "Administrators vēl nav pievienojis šīs naktsmītnes aprakstu.",
        facilitiesPolicies: "Ērtības un noteikumi",
        facilitiesDescription:
            "Šīs ir naktsmītnes administratora izvēlētās ērtības un noteikumi.",
        noFacilities: "Ērtības nav norādītas",
        noFacilitiesText:
            "Numuru ērtības vēl nav pievienotas.",
        chooseRoom: "Izvēlieties numuru",
        chooseRoomDescription:
            "Izvēlieties numuru un skatiet tā aprakstu, ietilpību, izmēru, gultas veidu, ērtības un noteikumus.",
    },

    "Lietuvių": {
        loading: "Kraunama apgyvendinimo vieta...",
        notFound: "Apgyvendinimo vieta nerasta",
        backHome: "Grįžti į pagrindinį",
        backToDestination: "Grįžti į paskirties vietą",
        excellent: "Puiku",
        staywayStay: "STAYWAY APGYVENDINIMO VIETA",
        aboutProperty: "Apie šią apgyvendinimo vietą",
        noDescription: "Aprašymo nėra",
        noDescriptionText:
            "Administratorius dar nepridėjo šios apgyvendinimo vietos aprašymo.",
        facilitiesPolicies: "Patogumai ir taisyklės",
        facilitiesDescription:
            "Tai administratoriaus pasirinkti patogumai ir taisyklės.",
        noFacilities: "Patogumai nenurodyti",
        noFacilitiesText:
            "Kambarių patogumai dar nepridėti.",
        chooseRoom: "Pasirinkite kambarį",
        chooseRoomDescription:
            "Pasirinkite kambarį ir peržiūrėkite tikslų jo aprašymą, talpą, dydį, lovos tipą, patogumus ir taisykles.",
    },
};


export default function StayPageClient({
                                           id,
                                       }: StayPageClientProps) {

    const { language } = useSettings();

    const languageName =
        language.split("|")[0];

    const text =
        stayPageTranslations[languageName] ??
        stayPageTranslations.English;


    const [property, setProperty] =
        useState<Property | null>(null);

    const [propertyRooms, setPropertyRooms] =
        useState<Room[]>([]);

    const [destination, setDestination] =
        useState<Destination | null>(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        let mounted = true;


        const loadStay = () => {

            const propertyId =
                Number(id);

            const savedProperties =
                getProperties();

            const savedDestinations =
                getDestinations();


            const foundProperty =
                savedProperties.find(
                    (item) =>
                        item.id === propertyId
                );


            if (!mounted) {
                return;
            }


            if (!foundProperty) {

                setProperty(null);
                setPropertyRooms([]);
                setDestination(null);
                setLoading(false);

                return;
            }


            const savedRooms =
                getRoomsByPropertyId(
                    foundProperty.id
                );


            setProperty(
                foundProperty
            );

            setPropertyRooms(
                savedRooms
            );

            setDestination(
                savedDestinations.find(
                    (item) =>
                        item.id ===
                        foundProperty.destinationId
                ) ?? null
            );

            setLoading(false);
        };


        loadStay();


        return () => {
            mounted = false;
        };

    }, [id]);


    const selectedFacilities =
        useMemo(() => {

            const facilities =
                propertyRooms.flatMap(
                    (room) =>
                        room.features ?? []
                );


            return Array.from(
                new Set(facilities)
            );

        }, [propertyRooms]);


    const hasFreeCancellation =
        propertyRooms.some(
            (room) =>
                room.freeCancellation !== false
        );


    const hasNoPrepayment =
        propertyRooms.some(
            (room) =>
                room.noPrepayment !== false
        );


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


    if (!property) {

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
        destination
            ? getLocalizedCityName(
                destination.name,
                language
            )
            : "";


    const localizedCountry =
        destination
            ? getLocalizedCountryName(
                destination.country,
                language
            )
            : "";


    return (
        <main className="stay-details-page">

            {/* HEADER */}

            <section className="stay-details-header">

                <div className="container">

                    <Link
                        href={`/destinations/${property.destinationId}`}
                        className="back-link"
                    >
                        ← {text.backToDestination}
                    </Link>


                    <div className="stay-title-row">

                        <div>

                            <span className="section-eyebrow">
                                {text.staywayStay}
                            </span>


                            <h1>
                                {property.name}
                            </h1>


                            <p className="stay-location">

                                📍 {property.address}

                                {destination
                                    ? ` · ${localizedCity}, ${localizedCountry}`
                                    : ""}

                            </p>

                        </div>


                        <div className="stay-rating-large">

                            <strong>
                                ★ {property.rating}
                            </strong>

                            <span>
                                {text.excellent}
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* GALLERY */}

            <section className="stay-gallery-section">

                <div className="container">

                    <PhotoGallery
                        hotelName={
                            property.name
                        }
                        photos={[
                            property.image,
                            ...propertyRooms.map(
                                (room) =>
                                    room.image
                            ),
                        ]}
                    />

                </div>

            </section>


            {/* MAIN CONTENT */}

            <section className="stay-main-section">

                <div className="container">

                    <div className="stay-main-content">


                        {/* ABOUT */}

                        <div className="stay-info-block">

                            <h2>
                                {text.aboutProperty}
                            </h2>


                            {property.description?.trim() ? (

                                property.description
                                    .split(/\n\s*\n/)
                                    .map(
                                        (
                                            paragraph,
                                            index
                                        ) => (

                                            <p
                                                key={index}
                                                className="property-description-text"
                                            >
                                                {paragraph.trim()}
                                            </p>

                                        )
                                    )

                            ) : (

                                <div className="home-empty-state">

                                    <h3>
                                        {text.noDescription}
                                    </h3>

                                    <p>
                                        {text.noDescriptionText}
                                    </p>

                                </div>

                            )}

                        </div>


                        {/* FACILITIES */}

                        <div className="stay-info-block">

                            <div className="rooms-heading">

                                <div>

                                    <h2>
                                        {text.facilitiesPolicies}
                                    </h2>

                                    <p>
                                        {text.facilitiesDescription}
                                    </p>

                                </div>

                            </div>


                            {selectedFacilities.length === 0 &&
                            !hasFreeCancellation &&
                            !hasNoPrepayment ? (

                                <div className="home-empty-state">

                                    <h3>
                                        {text.noFacilities}
                                    </h3>

                                    <p>
                                        {text.noFacilitiesText}
                                    </p>

                                </div>

                            ) : (

                                <div className="selected-facilities-list">

                                    {selectedFacilities.map(
                                        (facility) => (

                                            <div
                                                className="selected-facility"
                                                key={facility}
                                            >

                                                <span>
                                                    ✓
                                                </span>

                                                <strong>
                                                    {getLocalizedRoomFeature(
                                                        facility,
                                                        language
                                                    )}
                                                </strong>

                                            </div>

                                        )
                                    )}


                                    {hasFreeCancellation && (

                                        <div className="selected-facility">

                                            <span>
                                                ✓
                                            </span>

                                            <strong>
                                                {text.facilitiesPolicies === "Facilități și politici"
                                                    ? "Anulare gratuită"
                                                    : text.facilitiesPolicies === "Удобства и правила"
                                                        ? "Бесплатная отмена"
                                                        : text.facilitiesPolicies === "Comodidades e políticas"
                                                            ? "Cancelamento gratuito"
                                                            : text.facilitiesPolicies === "Installations et politiques"
                                                                ? "Annulation gratuite"
                                                                : text.facilitiesPolicies === "Instalaciones y condiciones"
                                                                    ? "Cancelación gratuita"
                                                                    : text.facilitiesPolicies === "Ausstattung und Richtlinien"
                                                                        ? "Kostenlose Stornierung"
                                                                        : text.facilitiesPolicies === "Servizi e condizioni"
                                                                            ? "Cancellazione gratuita"
                                                                            : text.facilitiesPolicies === "Voorzieningen en voorwaarden"
                                                                                ? "Gratis annuleren"
                                                                                : text.facilitiesPolicies === "Udogodnienia i zasady"
                                                                                    ? "Bezpłatne anulowanie"
                                                                                    : text.facilitiesPolicies === "Vybavení a pravidla"
                                                                                        ? "Bezplatné zrušení"
                                                                                        : text.facilitiesPolicies === "Παροχές και πολιτικές"
                                                                                            ? "Δωρεάν ακύρωση"
                                                                                            : text.facilitiesPolicies === "Удобства и правила"
                                                                                                ? "Безплатна отмяна"
                                                                                                : text.facilitiesPolicies === "Olanaklar ve kurallar"
                                                                                                    ? "Ücretsiz iptal"
                                                                                                    : "Free cancellation"}
                                            </strong>

                                        </div>

                                    )}


                                    {hasNoPrepayment && (

                                        <div className="selected-facility">

                                            <span>
                                                ✓
                                            </span>

                                            <strong>
                                                {text.facilitiesPolicies === "Facilități și politici"
                                                    ? "Fără plată în avans"
                                                    : text.facilitiesPolicies === "Удобства и правила"
                                                        ? "Без предоплаты"
                                                        : text.facilitiesPolicies === "Comodidades e políticas"
                                                            ? "Sem pré-pagamento"
                                                            : text.facilitiesPolicies === "Installations et politiques"
                                                                ? "Pas de prépaiement"
                                                                : text.facilitiesPolicies === "Instalaciones y condiciones"
                                                                    ? "Sin pago por adelantado"
                                                                    : text.facilitiesPolicies === "Ausstattung und Richtlinien"
                                                                        ? "Keine Vorauszahlung"
                                                                        : text.facilitiesPolicies === "Servizi e condizioni"
                                                                            ? "Nessun pagamento anticipato"
                                                                            : text.facilitiesPolicies === "Voorzieningen en voorwaarden"
                                                                                ? "Geen vooruitbetaling"
                                                                                : text.facilitiesPolicies === "Udogodnienia i zasady"
                                                                                    ? "Brak przedpłaty"
                                                                                    : text.facilitiesPolicies === "Vybavení a pravidla"
                                                                                        ? "Bez zálohy"
                                                                                        : text.facilitiesPolicies === "Παροχές και πολιτικές"
                                                                                            ? "Χωρίς προπληρωμή"
                                                                                            : text.facilitiesPolicies === "Удобства и правила"
                                                                                                ? "Без предварително плащане"
                                                                                                : text.facilitiesPolicies === "Olanaklar ve kurallar"
                                                                                                    ? "Ön ödeme gerekmez"
                                                                                                    : "No prepayment needed"}
                                            </strong>

                                        </div>

                                    )}

                                </div>

                            )}

                        </div>


                        {/* ROOMS */}

                        <div
                            className="stay-info-block"
                            id="rooms"
                        >

                            <div className="rooms-heading">

                                <div>

                                    <h2>
                                        {text.chooseRoom}
                                    </h2>

                                    <p>
                                        {text.chooseRoomDescription}
                                    </p>

                                </div>

                            </div>


                            <DynamicRoomList
                                propertyId={
                                    property.id
                                }
                                initialRooms={
                                    propertyRooms
                                }
                            />

                        </div>


                        {/* REVIEWS */}

                        <div className="stay-info-block">

                            <ReviewSection
                                propertyId={
                                    property.id
                                }
                                propertyRating={
                                    property.rating
                                }
                            />

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

