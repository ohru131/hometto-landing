<#
.SYNOPSIS
  Create a GitHub Actions workflow to build client and deploy to gh-pages using peaceiris/actions-gh-pages, then commit & push.

.PARAMETER RepoPath
  Path to repo root (default: current directory)

.PARAMETER Branch
  Branch to push workflow to (default: main)

.PARAMETER Remote
  Git remote (default: origin)

.PARAMETER CommitMessage
  Commit message

.PARAMETER AddGhPages
  If set, patch client/package.json to add gh-pages deploy scripts/devDependency.

#>

param(
  [string]$RepoPath = ".",
  [string]$Branch = "main",
  [string]$Remote = "origin",
  [string]$CommitMessage = "Add GH Actions workflow: build client and deploy to gh-pages",
  [switch]$AddGhPages
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Info($m){ Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Write-Warn($m){ Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Write-Err($m){ Write-Host "[ERROR] $m" -ForegroundColor Red }

$repoFullPath = Resolve-Path -Path $RepoPath
Set-Location $repoFullPath

# Verify git
try { & git rev-parse --is-inside-work-tree >$null } catch {
  Write-Err "Not a git repository: $repoFullPath"; exit 1
}

$gitStatus = & git status --porcelain
if ($gitStatus) {
  Write-Warn "Uncommitted changes exist. It's recommended to commit or stash them first."
  Write-Host $gitStatus
  $ok = Read-Host "Continue anyway? (y/N)"
  if ($ok.ToLower() -ne "y") { Write-Host "Cancelled."; exit 0 }
}

# Ensure workflow dir
$workflowDir = Join-Path $repoFullPath ".github\workflows"
if (-not (Test-Path $workflowDir)) { New-Item -ItemType Directory -Path $workflowDir -Force | Out-Null; Write-Info "Created $workflowDir" }

$workflowFile = Join-Path $workflowDir "deploy-gh-pages.yml"
if (Test-Path $workflowFile) {
  $bak = "$workflowFile.bak.$((Get-Date).ToString('yyyyMMddHHmmss'))"
  Copy-Item $workflowFile $bak -Force
  Write-Warn "Existing workflow backed up to $bak"
}

$workflowContent = @"
name: Build and Deploy to GitHub Pages (gh-pages)

on:
  push:
    branches: [ "main" ]
  workflow_dispatch: {}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

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

      - name: Deploy to gh-pages branch
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: `${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./client/dist
          publish_branch: gh-pages
"@

Set-Content -Path $workflowFile -Value $workflowContent -Encoding utf8
Write-Info "Wrote workflow to $workflowFile"

# Optionally patch client/package.json
$clientPkg = Join-Path $repoFullPath "client\package.json"
if ($AddGhPages) {
  if (Test-Path $clientPkg) {
    try {
      $jsonText = Get-Content $clientPkg -Raw
      $pkg = $jsonText | ConvertFrom-Json

      if (-not $pkg.scripts) { $pkg | Add-Member -NotePropertyName scripts -NotePropertyValue @{} }
      if (-not $pkg.scripts.build) { Write-Warn "client/package.json に build スクリプトがありません。確認してください。" }

      if (-not $pkg.homepage) {
        $user = (& git config user.name) -replace ' ',''
        if (-not $user) { $user = "USERNAME" }
        $pkg.homepage = "https://$user.github.io/hometto-landing"
        Write-Info "Added homepage: $pkg.homepage"
      }

      if (-not $pkg.scripts.predeploy) { $pkg.scripts.predeploy = "npm run build" }
      if (-not $pkg.scripts.deploy) { $pkg.scripts.deploy = "gh-pages -d dist" }

      if (-not $pkg.devDependencies) { $pkg | Add-Member -NotePropertyName devDependencies -NotePropertyValue @{} }
      if (-not $pkg.devDependencies.'gh-pages') { $pkg.devDependencies.'gh-pages' = "^5.0.0"; Write-Info "Added devDependency gh-pages ^5.0.0" }

      $pkgJson = $pkg | ConvertTo-Json -Depth 10
      Set-Content -Path $clientPkg -Value $pkgJson -Encoding utf8
      Write-Info "Updated client/package.json"
    } catch {
      Write-Err "Failed to patch client/package.json: $_"; exit 1
    }
  } else {
    Write-Warn "client/package.json not found; -AddGhPages skipped."
  }
}

# Git add/commit/push
try { & git add -A; & git commit -m $CommitMessage; Write-Info "Committed: $CommitMessage" } catch {
  Write-Warn "No commit created (maybe no changes or identical commit exists)."
}

try { & git push $Remote $Branch; Write-Info "Pushed to $Remote/$Branch" } catch {
  Write-Err "Push failed: $_"; exit 1
}

Write-Host "Done. GitHub Actions will run the workflow on push; build & deploy to gh-pages should start within a few minutes." -ForegroundColor Green