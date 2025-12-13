import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ja: {
    translation: {
      // Common
      "common.back": "もどる",
      "common.home": "トップへ戻る",
      "common.loading": "読み込み中...",
      "common.save": "保存",
      "common.cancel": "キャンセル",
      "common.delete": "削除",
      "common.edit": "編集",
      "common.create": "作成",
      
      // Header
      "header.about": "課題",
      "header.solution": "解決策",
      "header.features": "特徴",
      "header.future": "未来",
      "header.demo": "デモを見る",
      
      // Hero Section
      "hero.badge": "HACK+2026 Pitch",
      "hero.title1": "子ども同士が、",
      "hero.title2": "成長",
      "hero.title3": "と",
      "hero.title4": "協力",
      "hero.title5": "を記録する。",
      "hero.subtitle": "Hometto（ほめっと）は、ブロックチェーン技術を活用したWeb3学級アプリ。先生だけでなく、子ども同士が認め合う新しい学校の形をつくります。",
      "hero.cta.start": "はじめる",
      "hero.cta.learn": "もっと知る",
      
      // Role Selection
      "role.title": "あなたの役割を選んでください",
      "role.student": "生徒",
      "role.student.desc": "友達をほめたり、協力NFTを作成します",
      "role.teacher": "先生",
      "role.teacher.desc": "クラスの成長を見守り、データを確認します",
      "role.admin": "管理者",
      "role.admin.desc": "学校全体の統計とクラス管理を行います",
      
      // Demo Page
      "demo.title": "ほめトークンを送ろう",
      "demo.subtitle": "友達の良いところを見つけて、スタンプを送ろう！",
      "demo.myTokens": "あなたのトークン",
      "demo.selectFriend": "友達を選ぶ",
      "demo.selectStamp": "スタンプを選ぶ",
      "demo.stamp.help": "てつだい",
      "demo.stamp.idea": "アイデア",
      "demo.stamp.kind": "やさしさ",
      "demo.stamp.effort": "がんばり",
      "demo.send": "送る！",
      "demo.history": "最近のほめトークン",
      
      // Blockchain Info
      "blockchain.title": "ブロックチェーン記録",
      "blockchain.network": "Symbol",
      "blockchain.networkDesc": "高速・低コスト",
      "blockchain.totalTx": "総トランザクション数",
      "blockchain.status": "ネットワーク状態",
      "blockchain.statusActive": "稼働中",
      "blockchain.whyTitle": "なぜブロックチェーン？",
      "blockchain.whyDesc": "Homettoがブロックチェーンを使う理由",
      "blockchain.immutable": "改ざんできない記録",
      "blockchain.immutableDesc": "誰が・いつ・誰を評価したかが明確に残り、後から書き換えることができません",
      "blockchain.transparent": "透明性の確保",
      "blockchain.transparentDesc": "先生や学校が恣意的に評価を操作することを防ぎます",
      "blockchain.portable": "ポータビリティ",
      "blockchain.portableDesc": "将来的に、成長記録を他の学校や進学先に持ち運べます",
      "blockchain.lowCost": "低コスト運用",
      "blockchain.lowCostDesc": "Symbolブロックチェーンは手数料が安く、教育現場に最適です",
    }
  },
  en: {
    translation: {
      // Common
      "common.back": "Back",
      "common.home": "Home",
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.create": "Create",
      
      // Header
      "header.about": "Problem",
      "header.solution": "Solution",
      "header.features": "Features",
      "header.future": "Future",
      "header.demo": "View Demo",
      
      // Hero Section
      "hero.badge": "HACK+2026 Pitch",
      "hero.title1": "Students record",
      "hero.title2": "growth",
      "hero.title3": "and",
      "hero.title4": "cooperation",
      "hero.title5": "together.",
      "hero.subtitle": "Hometto is a Web3 classroom app powered by blockchain technology. It creates a new form of school where students recognize each other, not just teachers.",
      "hero.cta.start": "Get Started",
      "hero.cta.learn": "Learn More",
      
      // Role Selection
      "role.title": "Select Your Role",
      "role.student": "Student",
      "role.student.desc": "Praise friends and create cooperation NFTs",
      "role.teacher": "Teacher",
      "role.teacher.desc": "Monitor class growth and view data",
      "role.admin": "Administrator",
      "role.admin.desc": "Manage school-wide statistics and classes",
      
      // Demo Page
      "demo.title": "Send Praise Tokens",
      "demo.subtitle": "Find something good about your friends and send them a stamp!",
      "demo.myTokens": "Your Tokens",
      "demo.selectFriend": "Select a Friend",
      "demo.selectStamp": "Select a Stamp",
      "demo.stamp.help": "Helpful",
      "demo.stamp.idea": "Creative",
      "demo.stamp.kind": "Kind",
      "demo.stamp.effort": "Hardworking",
      "demo.send": "Send!",
      "demo.history": "Recent Praise Tokens",
      
      // Blockchain Info
      "blockchain.title": "Blockchain Records",
      "blockchain.network": "Symbol",
      "blockchain.networkDesc": "Fast & Low-cost",
      "blockchain.totalTx": "Total Transactions",
      "blockchain.status": "Network Status",
      "blockchain.statusActive": "Active",
      "blockchain.whyTitle": "Why Blockchain?",
      "blockchain.whyDesc": "Why Hometto uses blockchain technology",
      "blockchain.immutable": "Immutable Records",
      "blockchain.immutableDesc": "Clear records of who, when, and whom evaluated, cannot be altered later",
      "blockchain.transparent": "Transparency",
      "blockchain.transparentDesc": "Prevents arbitrary manipulation of evaluations by teachers or schools",
      "blockchain.portable": "Portability",
      "blockchain.portableDesc": "Growth records can be carried to other schools or future institutions",
      "blockchain.lowCost": "Low-cost Operation",
      "blockchain.lowCostDesc": "Symbol blockchain has low fees, ideal for educational settings",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
