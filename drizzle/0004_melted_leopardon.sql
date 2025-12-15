ALTER TABLE `cooperations` ADD `blockchainTxHash` varchar(64);--> statement-breakpoint
ALTER TABLE `praises` ADD `blockchainTxHash` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `symbolPrivateKey` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `symbolPublicKey` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `symbolAddress` varchar(64);