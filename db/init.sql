CREATE TABLE `users` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255) UNIQUE,
	`chat_id` VARCHAR(255) NOT NULL UNIQUE,
	`ref_code` VARCHAR(255) NOT NULL UNIQUE,
	`ref_by` VARCHAR(255),
	`premium` BOOLEAN DEFAULT FALSE,
	`quota` INT DEFAULT 0,
	PRIMARY KEY (`id`)
);

CREATE TABLE `redirections` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`owner` INT NOT NULL,
	`source` VARCHAR(255) NOT NULL,
	`destination` VARCHAR(255) NOT NULL,
	`active` BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (`id`)
);

CREATE TABLE `filters` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`red_id` INT NOT NULL,
	`params` VARCHAR(255),
	`name` VARCHAR(255) NOT NULL,
	`state` BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (`id`)
);

ALTER TABLE `users` ADD CONSTRAINT `users_fk0` FOREIGN KEY (`ref_by`) REFERENCES `users`(`ref_code`) ON DELETE CASCADE;

ALTER TABLE `redirections` ADD CONSTRAINT `redirections_fk0` FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON DELETE CASCADE;

ALTER TABLE `filters` ADD CONSTRAINT `filters_fk0` FOREIGN KEY (`red_id`) REFERENCES `redirections`(`id`) ON DELETE CASCADE;
