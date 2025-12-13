CREATE TABLE `cooperation_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cooperationId` int NOT NULL,
	`userId` int NOT NULL,
	`approved` int NOT NULL DEFAULT 0,
	`approvedAt` timestamp,
	CONSTRAINT `cooperation_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cooperations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cooperations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `praises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromUserId` int NOT NULL,
	`toUserId` int NOT NULL,
	`message` text,
	`stampType` varchar(50) NOT NULL,
	`tokenAmount` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `praises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `unlocked_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`itemId` varchar(50) NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unlocked_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `displayName` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarColor` varchar(20) DEFAULT 'blue';--> statement-breakpoint
ALTER TABLE `users` ADD `avatarAccessory` varchar(50) DEFAULT 'none';--> statement-breakpoint
ALTER TABLE `users` ADD `tokenBalance` int DEFAULT 0 NOT NULL;