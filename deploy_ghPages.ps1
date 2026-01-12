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
  If set, patch package.json to add gh-pages deploy scripts/devDependency.

#>

param(
  [string]$RepoPath = ".",
  [string]$Branch = "main",
  [string]$Remote = "origin",
  [string]$CommitMessage = "Fix GH Actions workflow: use root pnpm build and deploy dist/public",
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
name: Build and Deploy to GitHub Pages

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

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm run build

      - name: Create 404 fallback for SPA
        run: |
          if [ -f dist/public/index.html ]; then
            cp dist/public/index.html dist/public/404.html || true
          fi

      - name: Deploy to gh-pages branch
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: `${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
          publish_branch: gh-pages
"@

Set-Content -Path $workflowFile -Value $workflowContent -Encoding utf8
Write-Info "Wrote workflow to $workflowFile"

# Optionally patch package.json
$pkgFile = Join-Path $repoFullPath "package.json"
if ($AddGhPages) {
  if (Test-Path $pkgFile) {
    try {
      Set-StrictMode -Off
      $jsonText = Get-Content $pkgFile -Raw
      $pkg = $jsonText | ConvertFrom-Json

      if (-not $pkg.scripts) { $pkg | Add-Member -NotePropertyName scripts -NotePropertyValue @{} }
      
      if (-not $pkg.homepage) {
        $user = (& git config user.name) -replace ' ',''
        if (-not $user) { $user = "USERNAME" }
        $pkg | Add-Member -NotePropertyName homepage -NotePropertyValue "https://$user.github.io/hometto-landing"
        Write-Info "Added homepage: $pkg.homepage"
      }

      if (-not $pkg.scripts.predeploy) { $pkg.scripts | Add-Member -NotePropertyName predeploy -NotePropertyValue "npm run build" }
      if (-not $pkg.scripts.deploy) { $pkg.scripts | Add-Member -NotePropertyName deploy -NotePropertyValue "gh-pages -d dist/public" }

      if (-not $pkg.devDependencies) { $pkg | Add-Member -NotePropertyName devDependencies -NotePropertyValue @{} }
      if (-not $pkg.devDependencies.'gh-pages') { $pkg.devDependencies | Add-Member -NotePropertyName "gh-pages" -NotePropertyValue "^6.0.0"; Write-Info "Added devDependency gh-pages ^6.0.0" }

      $pkgJson = $pkg | ConvertTo-Json -Depth 10
      Set-Content -Path $pkgFile -Value $pkgJson -Encoding utf8
      Write-Info "Updated package.json"
      Set-StrictMode -Version Latest
    } catch {
      Write-Err "Failed to patch package.json: $_"; exit 1
    }
  } else {
    Write-Warn "package.json not found; -AddGhPages skipped."
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