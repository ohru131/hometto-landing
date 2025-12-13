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
- [x] 既存デモページのバックエンド連携
  - [x] Demo.tsx (ほめトークン送信)
  - [x] TeacherDashboard.tsx (統計データ表示)
  - [x] CooperationDemo.tsx (協力NFT)
  - [x] ParentDashboard.tsx (保護者向けデータ)
  - [x] AvatarCustomizer.tsx (アイテムアンロック)

## PWA対応
- [x] Service Worker設定
- [x] manifest.json作成
- [x] オフライン対応
- [x] ホーム画面追加機能

## テスト
- [ ] Vitestテストケース作成

## 追加機能
- [x] リアルタイム通知機能
  - [x] ブラウザ通知権限の取得
  - [x] トークン受信時の通知表示
  - [x] 協力NFT承認時の通知表示
- [ ] Symbolブロックチェーン連携（将来実装予定）
  - [ ] Symbol SDK統合
  - [ ] ウォレット接続機能
  - [ ] トークンのオンチェーン記録
  - [ ] NFTのオンチェーン発行
- [x] 管理者ダッシュボード
  - [x] 学校全体の統計データ表示
  - [x] クラス別データの比較
  - [x] 管理者権限の設定

## 認証機能の強化
- [x] ロール管理システム
  - [x] データベースにroleフィールド追加
  - [x] ロール別アクセス制御
  - [x] ロール選択UI
    - [x] ロール選択ページの作成
    - [x] 初回ログイン時のリダイレクト
    - [x] ロールに応じたダッシュボード遷移
- [x] 学校・クラス管理
  - [x] 学校テーブルの追加
  - [x] クラステーブルの追加
  - [x] ユーザーとクラスの紐付け

## エクスポート機能
- [x] PDF出力
  - [x] 成長記録レポートのPDF生成
  - [x] トークン履歴のPDF出力
- [x] CSV出力
  - [x] ユーザーデータのCSV出力
  - [x] トークン履歴のCSV出力

## クラス管理画面
- [x] 学校作成画面
- [x] クラス作成画面
- [x] 生徒・先生の割り当て画面
- [x] 管理者専用ダッシュボード

## Symbolブロックチェーン連携基盤
- [x] ブロックチェーン記録の設計
- [x] トランザクション履歴の表示UI
- [x] ブロックチェーン情報ページ

## 多言語対応
- [x] i18n設定とライブラリ導入
- [x] 日本語・英語の翻訳ファイル作成
- [x] 言語切り替えUI
- [ ] 全ページの多言語対応

## プッシュ通知の強化
- [x] Service Workerのプッシュ通知対応
- [x] バックグラウンド通知の実装
- [x] 通知購読の管理

## Symbol SDK連携（将来実装予定）
- [ ] Symbol SDK v3の公式ドキュメントを参照した実装
- [ ] テストネット接続設定
- [ ] トークン送信のオンチェーン記録
- [ ] NFT発行のオンチェーン記録

### 全ページの翻訳適用（詳細）
- [ ] Demo.tsx
- [ ] RoleSelection.tsx
- [ ] BlockchainInfo.tsx
- [ ] TeacherDashboard.tsx
- [ ] ParentDashboard.tsx
- [ ] CooperationDemo.tsx
- [ ] AvatarCustomizer.tsx
- [ ] ClassManagement.tsx
- [ ] AdminDashboard.tsx
- [ ] NotificationSettings.tsx
