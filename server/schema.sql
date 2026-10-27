-- Import into the existing database using Hostinger phpMyAdmin.
CREATE TABLE IF NOT EXISTS ticket_interests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  mobile VARCHAR(16) NOT NULL,
  purpose VARCHAR(32) NOT NULL DEFAULT 'ticket-launch',
  consent_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notification_status VARCHAR(16) NOT NULL DEFAULT 'pending',
  notified_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY unique_mobile_purpose (mobile, purpose)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
