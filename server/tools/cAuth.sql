/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 0,
  PRIMARY KEY (`category_id`),
  KEY `category_id` (`category_id`) USING BTREE,
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `cSessionInfo` (`open_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类';

DROP TABLE IF EXISTS `links`;
CREATE TABLE `links` (
 `link_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `category_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
 `image` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/images/default',
 `title` varchar(100) COLLATE utf8mb4_unicode_ci,
 `abstract` varchar(100) COLLATE utf8mb4_unicode_ci,
 `sharecount` int COLLATE utf8mb4_unicode_ci DEFAULT 0,
 PRIMARY KEY (`link_id`),
 KEY `link_id` (`link_id`) USING BTREE,
 CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='链接';


DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
 `tag_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `link_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 PRIMARY KEY (`tag_id`),
 KEY `tag_id` (`tag_id`) USING BTREE,
 CONSTRAINT `fk_tag_link` FOREIGN KEY (`link_id`) REFERENCES `links` (`link_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签';


DROP TABLE IF EXISTS `contents`;
CREATE TABLE `contents` (
 `link_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `type` varchar(100) COLLATE utf8mb4_unicode_ci,
 `value` varchar(1024) COLLATE utf8mb4_unicode_ci,
 CONSTRAINT `fk_content_link` FOREIGN KEY (`link_id`) REFERENCES `links` (`link_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容';

SET FOREIGN_KEY_CHECKS = 1;
