ALTER TABLE `cooperations` ADD `requiredApprovals` int DEFAULT 4 NOT NULL;--> statement-breakpoint
ALTER TABLE `cooperations` ADD `currentApprovals` int DEFAULT 0 NOT NULL;