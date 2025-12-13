# Hometto Project TODO

## データベース & バックエンド
- [x] データベースクエリヘルパー (server/db.ts)
- [x] tRPCルーター実装 (server/routers.ts)
  - [x] ユーザープロフィール管理API
  - [x] ほめトークン送信API
  - [x] 協力NFT作成・承認API
  - [x] アバターアイテムアンロックAPI
  - [x] 統計データ取得API

## フロントエンド連携
- [ ] 既存デモページのバックエンド連携
  - [ ] Demo.tsx (ほめトークン送信)
  - [ ] TeacherDashboard.tsx (統計データ表示)
  - [ ] CooperationDemo.tsx (協力NFT)
  - [ ] ParentDashboard.tsx (保護者向けデータ)
  - [ ] AvatarCustomizer.tsx (アイテムアンロック)

## PWA対応
- [x] Service Worker設定
- [x] manifest.json作成
- [x] オフライン対応
- [x] ホーム画面追加機能

## テスト
- [ ] Vitestテストケース作成
