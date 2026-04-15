export const SEARCH_INDEX = [
  {
    "title": "Introduction",
    "headers": [
      {
        "level": 2,
        "title": "What is Infrawatch?",
        "slug": "what-is-infrawatch",
        "link": "#what-is-infrawatch",
        "children": []
      },
      {
        "level": 2,
        "title": "Who is Infrawatch for?",
        "slug": "who-is-infrawatch-for",
        "link": "#who-is-infrawatch-for",
        "children": []
      },
      {
        "level": 2,
        "title": "Key Design Principles",
        "slug": "key-design-principles",
        "link": "#key-design-principles",
        "children": [
          {
            "level": 3,
            "title": "No External Dependencies",
            "slug": "no-external-dependencies",
            "link": "#no-external-dependencies",
            "children": []
          },
          {
            "level": 3,
            "title": "Open Agent",
            "slug": "open-agent",
            "link": "#open-agent",
            "children": []
          },
          {
            "level": 3,
            "title": "Offline-Capable Licensing",
            "slug": "offline-capable-licensing",
            "link": "#offline-capable-licensing",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Quick Links",
        "slug": "quick-links",
        "link": "#quick-links",
        "children": []
      }
    ],
    "path": "/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Agent Architecture",
    "headers": [
      {
        "level": 2,
        "title": "Overview",
        "slug": "overview",
        "link": "#overview",
        "children": []
      },
      {
        "level": 2,
        "title": "Registration Flow",
        "slug": "registration-flow",
        "link": "#registration-flow",
        "children": [
          {
            "level": 3,
            "title": "First run (no agent_state.json)",
            "slug": "first-run-no-agent-state-json",
            "link": "#first-run-no-agent-state-json",
            "children": []
          },
          {
            "level": 3,
            "title": "Restart (existing agent_state.json)",
            "slug": "restart-existing-agent-state-json",
            "link": "#restart-existing-agent-state-json",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Identity Model",
        "slug": "identity-model",
        "link": "#identity-model",
        "children": []
      },
      {
        "level": 2,
        "title": "Heartbeat Stream",
        "slug": "heartbeat-stream",
        "link": "#heartbeat-stream",
        "children": [
          {
            "level": 3,
            "title": "Reconnection",
            "slug": "reconnection",
            "link": "#reconnection",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Configuration",
        "slug": "configuration",
        "link": "#configuration",
        "children": [
          {
            "level": 3,
            "title": "Environment variable overrides",
            "slug": "environment-variable-overrides",
            "link": "#environment-variable-overrides",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Running as a systemd Service",
        "slug": "running-as-a-systemd-service",
        "link": "#running-as-a-systemd-service",
        "children": []
      },
      {
        "level": 2,
        "title": "Log Output",
        "slug": "log-output",
        "link": "#log-output",
        "children": []
      },
      {
        "level": 2,
        "title": "Software Inventory",
        "slug": "software-inventory",
        "link": "#software-inventory",
        "children": [
          {
            "level": 3,
            "title": "Collection sources",
            "slug": "collection-sources",
            "link": "#collection-sources",
            "children": []
          },
          {
            "level": 3,
            "title": "Scheduling",
            "slug": "scheduling",
            "link": "#scheduling",
            "children": []
          },
          {
            "level": 3,
            "title": "Package tracking",
            "slug": "package-tracking",
            "link": "#package-tracking",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Uninstalling an Agent",
        "slug": "uninstalling-an-agent",
        "link": "#uninstalling-an-agent",
        "children": [
          {
            "level": 3,
            "title": "Remote uninstall (recommended when agent is online)",
            "slug": "remote-uninstall-recommended-when-agent-is-online",
            "link": "#remote-uninstall-recommended-when-agent-is-online",
            "children": []
          },
          {
            "level": 3,
            "title": "Manual uninstall",
            "slug": "manual-uninstall",
            "link": "#manual-uninstall",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Self-Update",
        "slug": "self-update",
        "link": "#self-update",
        "children": []
      }
    ],
    "path": "/architecture/agent.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Deployment Profiles",
    "headers": [
      {
        "level": 2,
        "title": "Profile Comparison",
        "slug": "profile-comparison",
        "link": "#profile-comparison",
        "children": []
      },
      {
        "level": 2,
        "title": "Single Profile",
        "slug": "single-profile",
        "link": "#single-profile",
        "children": []
      },
      {
        "level": 2,
        "title": "Standard Profile",
        "slug": "standard-profile",
        "link": "#standard-profile",
        "children": []
      },
      {
        "level": 2,
        "title": "HA Profile",
        "slug": "ha-profile",
        "link": "#ha-profile",
        "children": []
      },
      {
        "level": 2,
        "title": "Queue Topic Reference",
        "slug": "queue-topic-reference",
        "link": "#queue-topic-reference",
        "children": []
      },
      {
        "level": 2,
        "title": "Switching Profiles",
        "slug": "switching-profiles",
        "link": "#switching-profiles",
        "children": []
      },
      {
        "level": 2,
        "title": "Air-Gap Deployment",
        "slug": "air-gap-deployment",
        "link": "#air-gap-deployment",
        "children": []
      }
    ],
    "path": "/architecture/deployment-profiles.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Ingest Service",
    "headers": [
      {
        "level": 2,
        "title": "Architecture",
        "slug": "architecture",
        "link": "#architecture",
        "children": []
      },
      {
        "level": 2,
        "title": "Responsibilities",
        "slug": "responsibilities",
        "link": "#responsibilities",
        "children": []
      },
      {
        "level": 2,
        "title": "Configuration",
        "slug": "configuration",
        "link": "#configuration",
        "children": []
      },
      {
        "level": 2,
        "title": "TLS",
        "slug": "tls",
        "link": "#tls",
        "children": []
      },
      {
        "level": 2,
        "title": "Ports",
        "slug": "ports",
        "link": "#ports",
        "children": []
      },
      {
        "level": 2,
        "title": "HTTP Endpoints",
        "slug": "http-endpoints",
        "link": "#http-endpoints",
        "children": [
          {
            "level": 3,
            "title": "GET /healthz",
            "slug": "get-healthz",
            "link": "#get-healthz",
            "children": []
          },
          {
            "level": 3,
            "title": "GET /.well-known/jwks.json",
            "slug": "get-well-known-jwks-json",
            "link": "#get-well-known-jwks-json",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "JWT Signing Key",
        "slug": "jwt-signing-key",
        "link": "#jwt-signing-key",
        "children": []
      },
      {
        "level": 2,
        "title": "Scaling",
        "slug": "scaling",
        "link": "#scaling",
        "children": []
      },
      {
        "level": 2,
        "title": "Building",
        "slug": "building",
        "link": "#building",
        "children": []
      }
    ],
    "path": "/architecture/ingest.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Architecture Overview",
    "headers": [
      {
        "level": 2,
        "title": "System Diagram",
        "slug": "system-diagram",
        "link": "#system-diagram",
        "children": []
      },
      {
        "level": 2,
        "title": "Components",
        "slug": "components",
        "link": "#components",
        "children": [
          {
            "level": 3,
            "title": "Go Agent",
            "slug": "go-agent",
            "link": "#go-agent",
            "children": []
          },
          {
            "level": 3,
            "title": "Ingest Service",
            "slug": "ingest-service",
            "link": "#ingest-service",
            "children": []
          },
          {
            "level": 3,
            "title": "Queue",
            "slug": "queue",
            "link": "#queue",
            "children": []
          },
          {
            "level": 3,
            "title": "Consumers",
            "slug": "consumers",
            "link": "#consumers",
            "children": []
          },
          {
            "level": 3,
            "title": "Web Application",
            "slug": "web-application",
            "link": "#web-application",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Data Flow",
        "slug": "data-flow",
        "link": "#data-flow",
        "children": [
          {
            "level": 3,
            "title": "Agent registration",
            "slug": "agent-registration",
            "link": "#agent-registration",
            "children": []
          },
          {
            "level": 3,
            "title": "Alert evaluation",
            "slug": "alert-evaluation",
            "link": "#alert-evaluation",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Database",
        "slug": "database",
        "link": "#database",
        "children": []
      },
      {
        "level": 2,
        "title": "Authentication",
        "slug": "authentication",
        "link": "#authentication",
        "children": []
      },
      {
        "level": 2,
        "title": "Further Reading",
        "slug": "further-reading",
        "link": "#further-reading",
        "children": []
      }
    ],
    "path": "/architecture/overview.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Air-Gap Deployment",
    "headers": [
      {
        "level": 2,
        "title": "What \"Air-Gapped\" Means Here",
        "slug": "what-air-gapped-means-here",
        "link": "#what-air-gapped-means-here",
        "children": []
      },
      {
        "level": 2,
        "title": "Bundling the Images",
        "slug": "bundling-the-images",
        "link": "#bundling-the-images",
        "children": []
      },
      {
        "level": 2,
        "title": "Transferring the Bundle",
        "slug": "transferring-the-bundle",
        "link": "#transferring-the-bundle",
        "children": []
      },
      {
        "level": 2,
        "title": "Loading Images on the Target Server",
        "slug": "loading-images-on-the-target-server",
        "link": "#loading-images-on-the-target-server",
        "children": []
      },
      {
        "level": 2,
        "title": "Starting the Stack",
        "slug": "starting-the-stack",
        "link": "#starting-the-stack",
        "children": []
      },
      {
        "level": 2,
        "title": "Agent Distribution",
        "slug": "agent-distribution",
        "link": "#agent-distribution",
        "children": []
      },
      {
        "level": 2,
        "title": "Updates",
        "slug": "updates",
        "link": "#updates",
        "children": []
      },
      {
        "level": 2,
        "title": "Licence Validation",
        "slug": "licence-validation",
        "link": "#licence-validation",
        "children": []
      }
    ],
    "path": "/deployment/air-gap.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Docker Compose Deployment",
    "headers": [
      {
        "level": 2,
        "title": "Prerequisites",
        "slug": "prerequisites",
        "link": "#prerequisites",
        "children": []
      },
      {
        "level": 2,
        "title": "Quick Deploy (GHCR images)",
        "slug": "quick-deploy-ghcr-images",
        "link": "#quick-deploy-ghcr-images",
        "children": []
      },
      {
        "level": 2,
        "title": "Manual Deploy",
        "slug": "manual-deploy",
        "link": "#manual-deploy",
        "children": [
          {
            "level": 3,
            "title": "1. Create a directory and download the compose file",
            "slug": "_1-create-a-directory-and-download-the-compose-file",
            "link": "#_1-create-a-directory-and-download-the-compose-file",
            "children": []
          },
          {
            "level": 3,
            "title": "2. Create the environment file",
            "slug": "_2-create-the-environment-file",
            "link": "#_2-create-the-environment-file",
            "children": []
          },
          {
            "level": 3,
            "title": "3. Generate TLS certificates for the ingest service",
            "slug": "_3-generate-tls-certificates-for-the-ingest-service",
            "link": "#_3-generate-tls-certificates-for-the-ingest-service",
            "children": []
          },
          {
            "level": 3,
            "title": "4. Start the stack",
            "slug": "_4-start-the-stack",
            "link": "#_4-start-the-stack",
            "children": []
          },
          {
            "level": 3,
            "title": "5. Watch startup logs",
            "slug": "_5-watch-startup-logs",
            "link": "#_5-watch-startup-logs",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Services",
        "slug": "services",
        "link": "#services",
        "children": []
      },
      {
        "level": 2,
        "title": "Updating",
        "slug": "updating",
        "link": "#updating",
        "children": []
      },
      {
        "level": 2,
        "title": "Backups",
        "slug": "backups",
        "link": "#backups",
        "children": []
      },
      {
        "level": 2,
        "title": "Stopping",
        "slug": "stopping",
        "link": "#stopping",
        "children": []
      },
      {
        "level": 2,
        "title": "Reverse Proxy",
        "slug": "reverse-proxy",
        "link": "#reverse-proxy",
        "children": []
      }
    ],
    "path": "/deployment/docker-compose.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Alerts",
    "headers": [
      {
        "level": 2,
        "title": "Alert Rule Concepts",
        "slug": "alert-rule-concepts",
        "link": "#alert-rule-concepts",
        "children": [
          {
            "level": 3,
            "title": "Rule",
            "slug": "rule",
            "link": "#rule",
            "children": []
          },
          {
            "level": 3,
            "title": "Alert instance",
            "slug": "alert-instance",
            "link": "#alert-instance",
            "children": []
          },
          {
            "level": 3,
            "title": "Notification",
            "slug": "notification",
            "link": "#notification",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Creating Alert Rules",
        "slug": "creating-alert-rules",
        "link": "#creating-alert-rules",
        "children": []
      },
      {
        "level": 2,
        "title": "Silencing",
        "slug": "silencing",
        "link": "#silencing",
        "children": []
      },
      {
        "level": 2,
        "title": "Alert History",
        "slug": "alert-history",
        "link": "#alert-history",
        "children": []
      },
      {
        "level": 2,
        "title": "Notification Routing",
        "slug": "notification-routing",
        "link": "#notification-routing",
        "children": []
      }
    ],
    "path": "/features/alerts.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Certificate Management",
    "headers": [
      {
        "level": 2,
        "title": "Discovery",
        "slug": "discovery",
        "link": "#discovery",
        "children": []
      },
      {
        "level": 2,
        "title": "Certificate Inventory",
        "slug": "certificate-inventory",
        "link": "#certificate-inventory",
        "children": []
      },
      {
        "level": 2,
        "title": "Certificate Detail",
        "slug": "certificate-detail",
        "link": "#certificate-detail",
        "children": []
      },
      {
        "level": 2,
        "title": "Expiry Alerts",
        "slug": "expiry-alerts",
        "link": "#expiry-alerts",
        "children": []
      },
      {
        "level": 2,
        "title": "Certificate Events",
        "slug": "certificate-events",
        "link": "#certificate-events",
        "children": []
      }
    ],
    "path": "/features/certificates.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Host Groups",
    "headers": [
      {
        "level": 2,
        "title": "Creating a Group",
        "slug": "creating-a-group",
        "link": "#creating-a-group",
        "children": []
      },
      {
        "level": 2,
        "title": "Using Groups",
        "slug": "using-groups",
        "link": "#using-groups",
        "children": [
          {
            "level": 3,
            "title": "Scoped alert rules",
            "slug": "scoped-alert-rules",
            "link": "#scoped-alert-rules",
            "children": []
          },
          {
            "level": 3,
            "title": "Bulk operations",
            "slug": "bulk-operations",
            "link": "#bulk-operations",
            "children": []
          },
          {
            "level": 3,
            "title": "RBAC resource scoping",
            "slug": "rbac-resource-scoping",
            "link": "#rbac-resource-scoping",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Group Membership",
        "slug": "group-membership",
        "link": "#group-membership",
        "children": []
      },
      {
        "level": 2,
        "title": "Comparing Hosts",
        "slug": "comparing-hosts",
        "link": "#comparing-hosts",
        "children": []
      }
    ],
    "path": "/features/host-groups.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Hosts & Inventory",
    "headers": [
      {
        "level": 2,
        "title": "Host Status",
        "slug": "host-status",
        "link": "#host-status",
        "children": []
      },
      {
        "level": 2,
        "title": "Host List",
        "slug": "host-list",
        "link": "#host-list",
        "children": []
      },
      {
        "level": 2,
        "title": "Pending Approval",
        "slug": "pending-approval",
        "link": "#pending-approval",
        "children": []
      },
      {
        "level": 2,
        "title": "Host Detail Page",
        "slug": "host-detail-page",
        "link": "#host-detail-page",
        "children": [
          {
            "level": 3,
            "title": "Overview tab",
            "slug": "overview-tab",
            "link": "#overview-tab",
            "children": []
          },
          {
            "level": 3,
            "title": "Metrics tab",
            "slug": "metrics-tab",
            "link": "#metrics-tab",
            "children": []
          },
          {
            "level": 3,
            "title": "Checks tab",
            "slug": "checks-tab",
            "link": "#checks-tab",
            "children": []
          },
          {
            "level": 3,
            "title": "Certificates tab",
            "slug": "certificates-tab",
            "link": "#certificates-tab",
            "children": []
          },
          {
            "level": 3,
            "title": "Users tab",
            "slug": "users-tab",
            "link": "#users-tab",
            "children": []
          },
          {
            "level": 3,
            "title": "Inventory tab",
            "slug": "inventory-tab",
            "link": "#inventory-tab",
            "children": []
          },
          {
            "level": 3,
            "title": "Terminal tab",
            "slug": "terminal-tab",
            "link": "#terminal-tab",
            "children": []
          },
          {
            "level": 3,
            "title": "Services tab",
            "slug": "services-tab",
            "link": "#services-tab",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Filtering and Search",
        "slug": "filtering-and-search",
        "link": "#filtering-and-search",
        "children": []
      },
      {
        "level": 2,
        "title": "Host Groups",
        "slug": "host-groups",
        "link": "#host-groups",
        "children": []
      },
      {
        "level": 2,
        "title": "Deleting a Host",
        "slug": "deleting-a-host",
        "link": "#deleting-a-host",
        "children": []
      }
    ],
    "path": "/features/hosts.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Monitoring",
    "headers": [
      {
        "level": 2,
        "title": "Metrics Collection",
        "slug": "metrics-collection",
        "link": "#metrics-collection",
        "children": []
      },
      {
        "level": 2,
        "title": "Metric Charts",
        "slug": "metric-charts",
        "link": "#metric-charts",
        "children": []
      },
      {
        "level": 2,
        "title": "Health Checks",
        "slug": "health-checks",
        "link": "#health-checks",
        "children": [
          {
            "level": 3,
            "title": "Check types",
            "slug": "check-types",
            "link": "#check-types",
            "children": []
          },
          {
            "level": 3,
            "title": "Configuring checks",
            "slug": "configuring-checks",
            "link": "#configuring-checks",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "TimescaleDB Storage",
        "slug": "timescaledb-storage",
        "link": "#timescaledb-storage",
        "children": []
      },
      {
        "level": 2,
        "title": "Alerting on Metrics",
        "slug": "alerting-on-metrics",
        "link": "#alerting-on-metrics",
        "children": []
      }
    ],
    "path": "/features/monitoring.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Notifications",
    "headers": [
      {
        "level": 2,
        "title": "Notification Channels",
        "slug": "notification-channels",
        "link": "#notification-channels",
        "children": [
          {
            "level": 3,
            "title": "In-app (notification bell)",
            "slug": "in-app-notification-bell",
            "link": "#in-app-notification-bell",
            "children": []
          },
          {
            "level": 3,
            "title": "Slack",
            "slug": "slack",
            "link": "#slack",
            "children": []
          },
          {
            "level": 3,
            "title": "Email (SMTP)",
            "slug": "email-smtp",
            "link": "#email-smtp",
            "children": []
          },
          {
            "level": 3,
            "title": "Webhook",
            "slug": "webhook",
            "link": "#webhook",
            "children": []
          },
          {
            "level": 3,
            "title": "Telegram",
            "slug": "telegram",
            "link": "#telegram",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Managing Notifications",
        "slug": "managing-notifications",
        "link": "#managing-notifications",
        "children": [
          {
            "level": 3,
            "title": "Marking as read / unread",
            "slug": "marking-as-read-unread",
            "link": "#marking-as-read-unread",
            "children": []
          },
          {
            "level": 3,
            "title": "Bulk actions",
            "slug": "bulk-actions",
            "link": "#bulk-actions",
            "children": []
          },
          {
            "level": 3,
            "title": "Notification charts",
            "slug": "notification-charts",
            "link": "#notification-charts",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Notification Retention",
        "slug": "notification-retention",
        "link": "#notification-retention",
        "children": []
      }
    ],
    "path": "/features/notifications.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Reports",
    "headers": [
      {
        "level": 2,
        "title": "Software Inventory",
        "slug": "software-inventory",
        "link": "#software-inventory",
        "children": [
          {
            "level": 3,
            "title": "Package detail view",
            "slug": "package-detail-view",
            "link": "#package-detail-view",
            "children": []
          },
          {
            "level": 3,
            "title": "Filtering",
            "slug": "filtering",
            "link": "#filtering",
            "children": []
          },
          {
            "level": 3,
            "title": "Saved filters",
            "slug": "saved-filters",
            "link": "#saved-filters",
            "children": []
          },
          {
            "level": 3,
            "title": "Comparing hosts",
            "slug": "comparing-hosts",
            "link": "#comparing-hosts",
            "children": []
          },
          {
            "level": 3,
            "title": "Identifying outdated software",
            "slug": "identifying-outdated-software",
            "link": "#identifying-outdated-software",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Exporting Reports",
        "slug": "exporting-reports",
        "link": "#exporting-reports",
        "children": [
          {
            "level": 3,
            "title": "CSV Export",
            "slug": "csv-export",
            "link": "#csv-export",
            "children": []
          },
          {
            "level": 3,
            "title": "PDF Export",
            "slug": "pdf-export",
            "link": "#pdf-export",
            "children": []
          },
          {
            "level": 3,
            "title": "Rate limiting",
            "slug": "rate-limiting",
            "link": "#rate-limiting",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "OS and Version Charts",
        "slug": "os-and-version-charts",
        "link": "#os-and-version-charts",
        "children": []
      },
      {
        "level": 2,
        "title": "Software Inventory Settings",
        "slug": "software-inventory-settings",
        "link": "#software-inventory-settings",
        "children": []
      },
      {
        "level": 2,
        "title": "Upcoming Reports",
        "slug": "upcoming-reports",
        "link": "#upcoming-reports",
        "children": []
      }
    ],
    "path": "/features/reports.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Service Accounts & Identity",
    "headers": [
      {
        "level": 2,
        "title": "LDAP / Active Directory Integration",
        "slug": "ldap-active-directory-integration",
        "link": "#ldap-active-directory-integration",
        "children": [
          {
            "level": 3,
            "title": "Setup",
            "slug": "setup",
            "link": "#setup",
            "children": []
          },
          {
            "level": 3,
            "title": "Sync",
            "slug": "sync",
            "link": "#sync",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Per-Host User Inventory",
        "slug": "per-host-user-inventory",
        "link": "#per-host-user-inventory",
        "children": []
      },
      {
        "level": 2,
        "title": "Account Detail",
        "slug": "account-detail",
        "link": "#account-detail",
        "children": []
      },
      {
        "level": 2,
        "title": "SSH Keys",
        "slug": "ssh-keys",
        "link": "#ssh-keys",
        "children": []
      },
      {
        "level": 2,
        "title": "Planned Features",
        "slug": "planned-features",
        "link": "#planned-features",
        "children": []
      }
    ],
    "path": "/features/service-accounts.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Tasks & Runbooks",
    "headers": [
      {
        "level": 2,
        "title": "Custom Scripts",
        "slug": "custom-scripts",
        "link": "#custom-scripts",
        "children": [
          {
            "level": 3,
            "title": "Creating a script",
            "slug": "creating-a-script",
            "link": "#creating-a-script",
            "children": []
          },
          {
            "level": 3,
            "title": "Running a script",
            "slug": "running-a-script",
            "link": "#running-a-script",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Task Runs",
        "slug": "task-runs",
        "link": "#task-runs",
        "children": []
      },
      {
        "level": 2,
        "title": "Runbooks",
        "slug": "runbooks",
        "link": "#runbooks",
        "children": [
          {
            "level": 3,
            "title": "Creating a runbook",
            "slug": "creating-a-runbook",
            "link": "#creating-a-runbook",
            "children": []
          },
          {
            "level": 3,
            "title": "Running a runbook",
            "slug": "running-a-runbook",
            "link": "#running-a-runbook",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Patch Management",
        "slug": "patch-management",
        "link": "#patch-management",
        "children": []
      }
    ],
    "path": "/features/tasks.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Terminal",
    "headers": [
      {
        "level": 2,
        "title": "How It Works",
        "slug": "how-it-works",
        "link": "#how-it-works",
        "children": []
      },
      {
        "level": 2,
        "title": "Opening a Terminal",
        "slug": "opening-a-terminal",
        "link": "#opening-a-terminal",
        "children": []
      },
      {
        "level": 2,
        "title": "Terminal Panel",
        "slug": "terminal-panel",
        "link": "#terminal-panel",
        "children": [
          {
            "level": 3,
            "title": "Tabs",
            "slug": "tabs",
            "link": "#tabs",
            "children": []
          },
          {
            "level": 3,
            "title": "Tab persistence",
            "slug": "tab-persistence",
            "link": "#tab-persistence",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Shell Detection",
        "slug": "shell-detection",
        "link": "#shell-detection",
        "children": []
      },
      {
        "level": 2,
        "title": "Security Considerations",
        "slug": "security-considerations",
        "link": "#security-considerations",
        "children": []
      },
      {
        "level": 2,
        "title": "Authentication",
        "slug": "authentication",
        "link": "#authentication",
        "children": []
      }
    ],
    "path": "/features/terminal.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Configuration",
    "headers": [
      {
        "level": 2,
        "title": "Web Application",
        "slug": "web-application",
        "link": "#web-application",
        "children": [
          {
            "level": 3,
            "title": "Example .env.local (development)",
            "slug": "example-env-local-development",
            "link": "#example-env-local-development",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Ingest Service",
        "slug": "ingest-service",
        "link": "#ingest-service",
        "children": []
      },
      {
        "level": 2,
        "title": "Agent",
        "slug": "agent",
        "link": "#agent",
        "children": [
          {
            "level": 3,
            "title": "Environment variable overrides",
            "slug": "environment-variable-overrides",
            "link": "#environment-variable-overrides",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Ports Summary",
        "slug": "ports-summary",
        "link": "#ports-summary",
        "children": []
      }
    ],
    "path": "/getting-started/configuration.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Installation",
    "headers": [
      {
        "level": 2,
        "title": "Prerequisites",
        "slug": "prerequisites",
        "link": "#prerequisites",
        "children": []
      },
      {
        "level": 2,
        "title": "Option A — Pre-built images from GHCR",
        "slug": "option-a-—-pre-built-images-from-ghcr",
        "link": "#option-a-—-pre-built-images-from-ghcr",
        "children": []
      },
      {
        "level": 2,
        "title": "Option B — Build from source",
        "slug": "option-b-—-build-from-source",
        "link": "#option-b-—-build-from-source",
        "children": [
          {
            "level": 3,
            "title": "1. Clone the repository",
            "slug": "_1-clone-the-repository",
            "link": "#_1-clone-the-repository",
            "children": []
          },
          {
            "level": 3,
            "title": "2. Generate dev TLS certificates",
            "slug": "_2-generate-dev-tls-certificates",
            "link": "#_2-generate-dev-tls-certificates",
            "children": []
          },
          {
            "level": 3,
            "title": "3. Configure environment variables",
            "slug": "_3-configure-environment-variables",
            "link": "#_3-configure-environment-variables",
            "children": []
          },
          {
            "level": 3,
            "title": "4. Start the stack",
            "slug": "_4-start-the-stack",
            "link": "#_4-start-the-stack",
            "children": []
          },
          {
            "level": 3,
            "title": "5. Run database migrations",
            "slug": "_5-run-database-migrations",
            "link": "#_5-run-database-migrations",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Create your account",
        "slug": "create-your-account",
        "link": "#create-your-account",
        "children": []
      },
      {
        "level": 2,
        "title": "Create an enrolment token",
        "slug": "create-an-enrolment-token",
        "link": "#create-an-enrolment-token",
        "children": []
      },
      {
        "level": 2,
        "title": "Build and run the agent",
        "slug": "build-and-run-the-agent",
        "link": "#build-and-run-the-agent",
        "children": []
      },
      {
        "level": 2,
        "title": "Verify in the UI",
        "slug": "verify-in-the-ui",
        "link": "#verify-in-the-ui",
        "children": []
      },
      {
        "level": 2,
        "title": "Stopping",
        "slug": "stopping",
        "link": "#stopping",
        "children": []
      },
      {
        "level": 2,
        "title": "Troubleshooting",
        "slug": "troubleshooting",
        "link": "#troubleshooting",
        "children": []
      }
    ],
    "path": "/getting-started/installation.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/404.html",
    "pathLocale": "/",
    "extraFields": []
  }
]
