#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${ASRRO_SCREENSHOT_BASE_URL:-http://localhost:3000}"
OUTPUT_DIR="${ASRRO_SCREENSHOT_OUTPUT_DIR:-screenshots/pages}"
PUBLIC_SESSION="asrro-capture-public"
DASHBOARD_SESSION="asrro-capture-dashboard"

mkdir -p "$OUTPUT_DIR"

public_routes=(
  "01-public-home|/"
  "02-public-about|/about"
  "03-public-alumni|/alumni"
  "04-public-committee|/committee"
  "05-public-contact|/contact"
  "06-public-gallery|/gallery"
  "07-public-membership|/membership"
  "08-public-publications|/publications"
  "09-public-search|/search"
  "10-public-projects-index|/projects"
  "11-project-agribot-terrain-rover|/projects/agribot-terrain-rover"
  "12-project-bengalsat-ground-station|/projects/bengalsat-ground-station"
  "13-project-cyclone-vision|/projects/cyclone-vision"
  "14-project-firefly-swarm|/projects/firefly-swarm"
  "15-project-riverwatch|/projects/riverwatch"
  "16-project-braille-cell|/projects/braille-cell"
  "17-public-events-index|/events"
  "18-event-national-rover-challenge|/events/national-rover-challenge-2026"
  "19-event-satellite-data-bootcamp|/events/satellite-data-bootcamp"
  "20-event-frontier-talk|/events/frontier-talk-autonomous-systems"
  "21-event-embedded-systems-sprint|/events/embedded-systems-sprint"
  "22-event-robotics-for-resilience|/events/robotics-for-resilience"
  "23-public-news-index|/news"
  "24-news-rover-registration|/news/rover-challenge-registration"
  "25-news-riverwatch-pilot|/news/riverwatch-pilot"
  "26-news-research-partnership|/news/new-research-partnership"
  "27-news-alumni-field-notes|/news/alumni-field-notes-riyad"
  "28-auth-login|/login"
  "42-not-found|/this-route-does-not-exist"
)

dashboard_routes=(
  "29-dashboard-overview|/dashboard"
  "30-dashboard-profile|/dashboard/profile"
  "31-dashboard-membership|/dashboard/membership"
  "32-dashboard-events|/dashboard/events"
  "33-dashboard-notifications|/dashboard/notifications"
  "34-dashboard-members|/dashboard/members"
  "35-dashboard-event-management|/dashboard/event-management"
  "36-dashboard-committee|/dashboard/committee"
  "37-dashboard-finance|/dashboard/finance"
  "38-dashboard-projects|/dashboard/projects"
  "39-dashboard-content|/dashboard/content"
  "40-dashboard-reports|/dashboard/reports"
  "41-dashboard-settings|/dashboard/settings"
)

capture_routes() {
  local session="$1"
  shift
  local entries=("$@")

  for entry in "${entries[@]}"; do
    local name="${entry%%|*}"
    local route="${entry#*|}"
    agent-browser --session "$session" open "${BASE_URL}${route}" >/dev/null
    agent-browser --session "$session" wait --load domcontentloaded >/dev/null
    agent-browser --session "$session" wait 1200 >/dev/null
    agent-browser --session "$session" screenshot \
      "${OUTPUT_DIR}/${name}-light-desktop.png" >/dev/null
    echo "Captured ${route}"
  done
}

agent-browser --session "$PUBLIC_SESSION" open "$BASE_URL" >/dev/null
agent-browser --session "$PUBLIC_SESSION" set viewport 1440 1000 >/dev/null
agent-browser --session "$PUBLIC_SESSION" eval \
  'localStorage.setItem("theme", "light")' >/dev/null
capture_routes "$PUBLIC_SESSION" "${public_routes[@]}"

agent-browser --session "$PUBLIC_SESSION" open "$BASE_URL" >/dev/null
agent-browser --session "$PUBLIC_SESSION" eval \
  'localStorage.setItem("theme", "dark")' >/dev/null
agent-browser --session "$PUBLIC_SESSION" open "$BASE_URL" >/dev/null
agent-browser --session "$PUBLIC_SESSION" wait --load domcontentloaded >/dev/null
agent-browser --session "$PUBLIC_SESSION" wait 1200 >/dev/null
agent-browser --session "$PUBLIC_SESSION" screenshot \
  "${OUTPUT_DIR}/01-public-home-dark-desktop.png" >/dev/null
agent-browser --session "$PUBLIC_SESSION" open "${BASE_URL}/login" >/dev/null
agent-browser --session "$PUBLIC_SESSION" wait 1200 >/dev/null
agent-browser --session "$PUBLIC_SESSION" screenshot \
  "${OUTPUT_DIR}/28-auth-login-dark-desktop.png" >/dev/null

agent-browser --session "$PUBLIC_SESSION" set viewport 390 844 >/dev/null
agent-browser --session "$PUBLIC_SESSION" eval \
  'localStorage.setItem("theme", "light")' >/dev/null
agent-browser --session "$PUBLIC_SESSION" open "$BASE_URL" >/dev/null
agent-browser --session "$PUBLIC_SESSION" wait 1200 >/dev/null
agent-browser --session "$PUBLIC_SESSION" screenshot \
  "${OUTPUT_DIR}/01-public-home-light-mobile.png" >/dev/null
agent-browser --session "$PUBLIC_SESSION" open "${BASE_URL}/login" >/dev/null
agent-browser --session "$PUBLIC_SESSION" wait 1200 >/dev/null
agent-browser --session "$PUBLIC_SESSION" screenshot \
  "${OUTPUT_DIR}/28-auth-login-light-mobile.png" >/dev/null

if [[ -z "${ASRRO_SCREENSHOT_EMAIL:-}" || -z "${ASRRO_SCREENSHOT_PASSWORD:-}" ]]; then
  echo "Public screenshots complete. Set ASRRO_SCREENSHOT_EMAIL and ASRRO_SCREENSHOT_PASSWORD to capture dashboard routes."
  agent-browser --session "$PUBLIC_SESSION" close >/dev/null
  exit 0
fi

agent-browser --session "$DASHBOARD_SESSION" open "${BASE_URL}/login" >/dev/null
agent-browser --session "$DASHBOARD_SESSION" set viewport 1440 1000 >/dev/null
agent-browser --session "$DASHBOARD_SESSION" eval \
  'localStorage.setItem("theme", "light")' >/dev/null
agent-browser --session "$DASHBOARD_SESSION" open "${BASE_URL}/login" >/dev/null
agent-browser --session "$DASHBOARD_SESSION" find label "Email address" fill \
  "$ASRRO_SCREENSHOT_EMAIL" >/dev/null
agent-browser --session "$DASHBOARD_SESSION" find label "Password" fill \
  "$ASRRO_SCREENSHOT_PASSWORD" >/dev/null
agent-browser --session "$DASHBOARD_SESSION" find role button click \
  --name "Enter mission portal" >/dev/null
agent-browser --session "$DASHBOARD_SESSION" wait --text "Overview" >/dev/null

capture_routes "$DASHBOARD_SESSION" "${dashboard_routes[@]}"

agent-browser --session "$DASHBOARD_SESSION" eval \
  'localStorage.setItem("theme", "dark")' >/dev/null
agent-browser --session "$DASHBOARD_SESSION" open "${BASE_URL}/dashboard" >/dev/null
agent-browser --session "$DASHBOARD_SESSION" wait 1200 >/dev/null
agent-browser --session "$DASHBOARD_SESSION" screenshot \
  "${OUTPUT_DIR}/29-dashboard-overview-dark-desktop.png" >/dev/null

agent-browser --session "$DASHBOARD_SESSION" set viewport 390 844 >/dev/null
agent-browser --session "$DASHBOARD_SESSION" eval \
  'localStorage.setItem("theme", "light")' >/dev/null
agent-browser --session "$DASHBOARD_SESSION" open "${BASE_URL}/dashboard" >/dev/null
agent-browser --session "$DASHBOARD_SESSION" wait 1200 >/dev/null
agent-browser --session "$DASHBOARD_SESSION" screenshot \
  "${OUTPUT_DIR}/29-dashboard-overview-light-mobile.png" >/dev/null

agent-browser --session "$PUBLIC_SESSION" close >/dev/null
agent-browser --session "$DASHBOARD_SESSION" close >/dev/null
echo "Screenshots saved to ${OUTPUT_DIR}"
