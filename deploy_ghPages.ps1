<#
.SYNOPSIS
  Create GitHub Actions workflow to build client and deploy to GitHub Pages, commit and push.

.DESCRIPTION
  - Creates .github/workflows/deploy-pages.yml with a workflow that builds client (clientディレクトリ) and deploys client/dist to GitHub Pages.
  - Optionally patches client/package.json to add gh-pages scripts (when -AddGhPages is used).
  - Commits and pushes the changes to the specified branch.

.PARAMETER RepoPath
  Path to the repository root. Default: current directory.

.PARAMETER Branch
  Branch to commit/push to. Default: main.

.PARAMETER Remote
  Git remote name. Default: origin.

.PARAMETER CommitMessage
  Commit message to use.

.PARAMETER AddGhPages
  When specified, the script will add "homepage", "predeploy" and "deploy" scripts and gh-pages devDependency to client/package.json (if client/package.json exists).

.EXAMPLE
  .\deploy-gh-pages.ps1 -RepoPath "C:\dev\hometto-landing"

  .\deploy-gh-pages.ps1 -AddGhPages

#>

param(
  [string]$RepoPath = ".",
  [string]$Branch = "main",
  [string]$Remote = "origin",
  [string]$CommitMessage = "Add GH Actions workflow: build client and deploy to GitHub Pages",
  [switch]$AddGhPages
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Resolve full path
$repoFullPath = Resolve-Path -Path $RepoPath
Set-Location $repoFullPath

# Validate git repo
try {
  & git rev-parse --is-inside-work-tree 2>$null | Out-Null
} catch {
  Write-Err "このディレクトリは Git リポジトリではありません: $repoFullPath"
  exit 1
}

# Ensure working tree clean (soft check)
$gitStatus = & git status --porcelain
if ($gitStatus) {
  Write-Warn "作業ツリーに未コミットの変更があります。続行する前にコミット/スタッシュすることを推奨します。"
  Write-Host $gitStatus
  # proceed nevertheless after prompt
  $ok = Read-Host "続行しますか？ (y/N)"
  if ($ok.ToLower() -ne "y") {
    Write-Host "中止します。"
    exit 0
  }
}

# Prepare path and backup if exists
$workflowDir = Join-Path -Path $repoFullPath -ChildPath ".github\workflows"
$workflowFile = Join-Path -Path $workflowDir -ChildPath "deploy-pages.yml"

if (-not (Test-Path $workflowDir)) {
  New-Item -ItemType Directory -Path $workflowDir -Force | Out-Null
  Write-Info "作成: $workflowDir"
}

if (Test-Path $workflowFile) {
  $timestamp = (Get-Date).ToString("yyyyMMddHHmmss")
  $backup = "$workflowFile.bak.$timestamp"
  Copy-Item -Path $workflowFile -Destination $backup -Force
  Write-Warn "既存のワークフローファイルをバックアップしました: $backup"
}

$workflowContent = @"
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [ "main" ]
  workflow_dispatch: {}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
      contents: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies (client)
        working-directory: client
        run: npm ci

      - name: Build (client)
        working-directory: client
        run: npm run build

      - name: Create 404 fallback for SPA
        run: |
          if [ -f client/dist/index.html ]; then
            cp client/dist/index.html client/dist/404.html || true
          fi

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact for GitHub Pages
        uses: actions/upload-pages-artifact@v1
        with:
          path: client/dist

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v1
"@

# Write workflow file (UTF8)
Set-Content -Path $workflowFile -Value $workflowContent -Encoding utf8
Write-Info "ワークフローファイルを作成しました: $workflowFile"

# Optionally patch client/package.json for gh-pages
$clientPkg = Join-Path -Path $repoFullPath -ChildPath "client\package.json"
if ($AddGhPages) {
  if (Test-Path $clientPkg) {
    try {
      $jsonText = Get-Content -Path $clientPkg -Raw -ErrorAction Stop
      $pkg = $jsonText | ConvertFrom-Json -ErrorAction Stop

      if (-not $pkg.scripts) { $pkg | Add-Member -MemberType NoteProperty -Name scripts -Value @{} }
      # ensure build script exists
      if (-not $pkg.scripts.build) {
        Write-Warn "client/package.json に 'build' スクリプトが見つかりません。手動で確認してください。"
      } else {
        Write-Info "client/package.json の build スクリプトを確認しました。"
      }

      if (-not $pkg.homepage) {
        $pkg.homepage = "https://$((git config --get user.name) -replace ' ','').github.io/hometto-landing"
        Write-Info "homepage を追加しました: $pkg.homepage"
      }

      # add predeploy/deploy scripts
      if (-not $pkg.scripts.predeploy) { $pkg.scripts.predeploy = "npm run build" }
      if (-not $pkg.scripts.deploy) { $pkg.scripts.deploy = "gh-pages -d dist" }

      # add devDependency gh-pages
      if (-not $pkg.devDependencies) { $pkg | Add-Member -MemberType NoteProperty -Name devDependencies -Value @{} }
      if (-not $pkg.devDependencies.'gh-pages') {
        $pkg.devDependencies.'gh-pages' = "^5.0.0"
        Write-Info "devDependency 'gh-pages' を追加しました（バージョン ^5.0.0）"
      }

      # Write back formatted JSON
      $pkgJson = $pkg | ConvertTo-Json -Depth 10
      Set-Content -Path $clientPkg -Value $pkgJson -Encoding utf8
      Write-Info "client/package.json を更新しました: $clientPkg"
    } catch {
      Write-Err "client/package.json の読み書き中にエラーが発生しました: $_"
      exit 1
    }
  } else {
    Write-Warn "client/package.json が見つかりません。-AddGhPages を使うには client/package.json が必要です。"
  }
}

# Git add, commit, push
try {
  & git add -A
  & git commit -m $CommitMessage
  Write-Info "コミットしました: $CommitMessage"
} catch {
  Write-Warn "コミットが作成されませんでした。変更がないか、既に同じ内容がコミットされている可能性があります。"
}

# Push
try {
  & git push $Remote $Branch
  Write-Info "リモートに push しました: $Remote/$Branch"
} catch {
  Write-Err "push に失敗しました。認証やリモート設定を確認してください。エラー: $_"
  exit 1
}

Write-Host "完了しました。GitHub Actions がワークフローを実行して Pages にデプロイされます（push の反映まで数分かかります）。" -ForegroundColor Green