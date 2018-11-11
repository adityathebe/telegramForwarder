CREATE TABLE `users` (
	`chat_id` VARCHAR(255),
	`username` VARCHAR(255) UNIQUE,
	`ref_code` VARCHAR(255) NOT NULL UNIQUE,
	`ref_by` VARCHAR(255),
	`premium` BOOLEAN DEFAULT FALSE,
	`quota` INT DEFAULT 0,
	PRIMARY KEY (`chat_id`)
);

CREATE TABLE `redirections` (
	`id` INT AUTO_INCREMENT,
	`owner` INT NOT NULL,
	`source` VARCHAR(255) NOT NULL,
	`destination` VARCHAR(255) NOT NULL,
	`source_title` VARCHAR(255) NOT NULL,
	`destination_title` VARCHAR(255) NOT NULL,
	`active` BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (`id`)
);

CREATE TABLE `filters` (
	`id` INT,
	`audio` BOOLEAN DEFAULT FALSE,
	`video` BOOLEAN DEFAULT FALSE,
	`photo` BOOLEAN DEFAULT FALSE,
	`sticker` BOOLEAN DEFAULT FALSE,
	`document` BOOLEAN DEFAULT FALSE,
	`geo` BOOLEAN DEFAULT FALSE,
	`contact` BOOLEAN DEFAULT FALSE,
	`contain` VARCHAR(255),
	`notcontain` VARCHAR(255),
	PRIMARY KEY (`id`)
);

ALTER TABLE `users` ADD CONSTRAINT `users_fk0` FOREIGN KEY (`ref_by`) REFERENCES `users`(`ref_code`) ON DELETE CASCADE;

ALTER TABLE `redirections` ADD CONSTRAINT `redirections_fk0` FOREIGN KEY (`owner`) REFERENCES `users`(`chat_id`) ON DELETE CASCADE;

ALTER TABLE `filters` ADD CONSTRAINT `filters_fk0` FOREIGN KEY (`id`) REFERENCES `redirections`(`id`) ON DELETE CASCADE;
