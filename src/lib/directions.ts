export type Direction = {
  key: string;
  title: string;
  blurb: string;
  cover: string;
  icon: string;
};

export const DIRECTIONS: Direction[] = [
  { key: "levels", title: "Рівні платформи", blurb: "Пакети доступу GaliantPro: від старту до повного доступу", cover: "/assets/course-covers/learning-books-1200x675.webp", icon: "/assets/svg/course_icons/learning-books.svg" },
  { key: "business", title: "Онлайн-бізнес", blurb: "Інтернет-магазин, дропшипінг, продажі в переписці", cover: "/assets/course-covers/online-business-1200x675.webp", icon: "/assets/svg/course_icons/online-business.svg" },
  { key: "smm", title: "SMM та маркетинг", blurb: "Просування в Instagram, таргет, воронки, сторітелінг", cover: "/assets/course-covers/smm-marketing-1200x675.webp", icon: "/assets/svg/course_icons/smm-marketing.svg" },
  { key: "design", title: "Дизайн та контент", blurb: "Візуал, Canva, упаковка профілю", cover: "/assets/course-covers/graphic-design-1200x675.webp", icon: "/assets/svg/course_icons/graphic-design.svg" },
  { key: "video", title: "Відеомонтаж", blurb: "Reels, монтаж у VN, відео для соцмереж", cover: "/assets/course-covers/video-editing-1200x675.webp", icon: "/assets/svg/course_icons/video-editing.svg" },
  { key: "ai", title: "AI та нейромережі", blurb: "Нейромережі для роботи, контенту та продажів", cover: "/assets/course-covers/ai-neural-networks-1200x675.webp", icon: "/assets/svg/course_icons/ai-neural-networks.svg" },
  { key: "web", title: "Сайти та автоматизація", blurb: "Сайт своїми руками, WayForPay, чат-боти, Telegram", cover: "/assets/course-covers/website-development-1200x675.webp", icon: "/assets/svg/course_icons/website-development.svg" },
  { key: "career", title: "Заробіток і розвиток", blurb: "Перші кроки онлайн, крипта, цілі та фінанси", cover: "/assets/course-covers/career-growth-1200x675.webp", icon: "/assets/svg/course_icons/career-growth.svg" },
];

export const directionByKey = (key: string) => DIRECTIONS.find((d) => d.key === key) ?? DIRECTIONS[0];
