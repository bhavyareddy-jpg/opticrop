CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fieldId` int NOT NULL,
	`alertType` enum('low_soil_moisture','high_soil_moisture','low_nitrogen','low_phosphorus','low_potassium','disease_risk','pest_risk','upcoming_harvest','weather_alert','recommendation') NOT NULL,
	`priority` enum('low','medium','high','critical') DEFAULT 'medium',
	`message` text NOT NULL,
	`actionable` boolean DEFAULT true,
	`dismissed` boolean DEFAULT false,
	`dismissedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `calendar_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fieldId` int NOT NULL,
	`eventType` enum('planting','irrigation','fertilization','pesticide_application','harvest','other') NOT NULL,
	`eventDate` datetime NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`completed` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `calendar_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fieldId` int,
	`role` enum('user','assistant') NOT NULL,
	`message` text NOT NULL,
	`context` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `farms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`location` varchar(255),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`totalArea` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `farms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`farmId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`cropType` varchar(100) NOT NULL,
	`area` decimal(10,2) NOT NULL,
	`plantingDate` datetime,
	`expectedHarvestDate` datetime,
	`growthStage` enum('preparation','germination','vegetative','flowering','fruiting','maturation','harvest_ready') DEFAULT 'preparation',
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`status` enum('active','fallow','harvested') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`farmId` int NOT NULL,
	`fieldId` int,
	`reportType` enum('field_summary','farm_summary','soil_analysis','yield_analysis','resource_usage') NOT NULL,
	`reportData` json NOT NULL,
	`generatedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resource_recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fieldId` int NOT NULL,
	`recommendationDate` datetime NOT NULL,
	`fertilizerType` varchar(100),
	`fertilizerQuantity` decimal(10,2),
	`waterRequirement` decimal(10,2),
	`pesticides` json,
	`rationale` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `resource_recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `soil_analysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fieldId` int NOT NULL,
	`recordDate` datetime NOT NULL,
	`pH` decimal(3,2),
	`nitrogen` decimal(8,2),
	`phosphorus` decimal(8,2),
	`potassium` decimal(8,2),
	`moisture` decimal(5,2),
	`organicMatter` decimal(5,2),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `soil_analysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weather_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fieldId` int NOT NULL,
	`recordDate` datetime NOT NULL,
	`temperature` decimal(5,2),
	`minTemperature` decimal(5,2),
	`maxTemperature` decimal(5,2),
	`humidity` decimal(5,2),
	`rainfall` decimal(8,2),
	`windSpeed` decimal(5,2),
	`condition` varchar(100),
	`isForecast` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weather_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `yield_predictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fieldId` int NOT NULL,
	`predictionDate` datetime NOT NULL,
	`estimatedYield` decimal(10,2),
	`actualYield` decimal(10,2),
	`confidence` decimal(3,2),
	`factors` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `yield_predictions_id` PRIMARY KEY(`id`)
);
