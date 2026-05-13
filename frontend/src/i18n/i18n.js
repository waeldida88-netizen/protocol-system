import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      translation: {
        app_name: "الإدارة العامة للمراسم والعلاقات العامة",
        login: "تسجيل الدخول",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        enter: "دخول",
        dashboard: "لوحة التحكم",
        leaders: "قيادات الوزارة",
        events: "الفاعليات",
        guests: "قائمة الحضور",
        seating: "جلوس المدعويين",
        invitations: "الدعوات",
        team: "الفريق",
        chat: "المحادثات",
        switch_lang: "English"
      }
    },
    en: {
      translation: {
        app_name: "General Administration of Protocol & Public Relations",
        login: "Login",
        email: "Email",
        password: "Password",
        enter: "Enter",
        dashboard: "Dashboard",
        leaders: "Ministry Leaders",
        events: "Events",
        guests: "Guest List",
        seating: "Seating Arrangement",
        invitations: "Invitations",
        team: "Team",
        chat: "Chat",
        switch_lang: "عربي"
      }
    }
  },
  lng: "ar",
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;