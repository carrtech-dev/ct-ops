export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/README.md"), meta: {"title":"Introduction"} }],
  ["/architecture/agent.html", { loader: () => import(/* webpackChunkName: "architecture_agent.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/architecture/agent.md"), meta: {"title":"Agent Architecture"} }],
  ["/architecture/deployment-profiles.html", { loader: () => import(/* webpackChunkName: "architecture_deployment-profiles.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/architecture/deployment-profiles.md"), meta: {"title":"Deployment Profiles"} }],
  ["/architecture/ingest.html", { loader: () => import(/* webpackChunkName: "architecture_ingest.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/architecture/ingest.md"), meta: {"title":"Ingest Service"} }],
  ["/architecture/overview.html", { loader: () => import(/* webpackChunkName: "architecture_overview.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/architecture/overview.md"), meta: {"title":"Architecture Overview"} }],
  ["/deployment/air-gap.html", { loader: () => import(/* webpackChunkName: "deployment_air-gap.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/deployment/air-gap.md"), meta: {"title":"Air-Gap Deployment"} }],
  ["/deployment/docker-compose.html", { loader: () => import(/* webpackChunkName: "deployment_docker-compose.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/deployment/docker-compose.md"), meta: {"title":"Docker Compose Deployment"} }],
  ["/features/alerts.html", { loader: () => import(/* webpackChunkName: "features_alerts.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/features/alerts.md"), meta: {"title":"Alerts"} }],
  ["/features/certificates.html", { loader: () => import(/* webpackChunkName: "features_certificates.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/features/certificates.md"), meta: {"title":"Certificate Management"} }],
  ["/features/host-groups.html", { loader: () => import(/* webpackChunkName: "features_host-groups.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/features/host-groups.md"), meta: {"title":"Host Groups"} }],
  ["/features/hosts.html", { loader: () => import(/* webpackChunkName: "features_hosts.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/features/hosts.md"), meta: {"title":"Hosts & Inventory"} }],
  ["/features/monitoring.html", { loader: () => import(/* webpackChunkName: "features_monitoring.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/features/monitoring.md"), meta: {"title":"Monitoring"} }],
  ["/features/notifications.html", { loader: () => import(/* webpackChunkName: "features_notifications.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/features/notifications.md"), meta: {"title":"Notifications"} }],
  ["/features/reports.html", { loader: () => import(/* webpackChunkName: "features_reports.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/features/reports.md"), meta: {"title":"Reports"} }],
  ["/features/service-accounts.html", { loader: () => import(/* webpackChunkName: "features_service-accounts.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/features/service-accounts.md"), meta: {"title":"Service Accounts & Identity"} }],
  ["/features/tasks.html", { loader: () => import(/* webpackChunkName: "features_tasks.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/features/tasks.md"), meta: {"title":"Tasks & Runbooks"} }],
  ["/features/terminal.html", { loader: () => import(/* webpackChunkName: "features_terminal.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/features/terminal.md"), meta: {"title":"Terminal"} }],
  ["/getting-started/configuration.html", { loader: () => import(/* webpackChunkName: "getting-started_configuration.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/getting-started/configuration.md"), meta: {"title":"Configuration"} }],
  ["/getting-started/installation.html", { loader: () => import(/* webpackChunkName: "getting-started_installation.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/getting-started/installation.md"), meta: {"title":"Installation"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Volumes/MacBookStorage-Dev/dev/operations/apps/docs/docs/.vuepress/.temp/pages/404.html.vue"), meta: {"title":""} }],
]);
