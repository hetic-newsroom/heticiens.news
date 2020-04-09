// Common types, regex & validators used accross the project

export interface Token {
	token: string;
	created: number;
}

type sex = 'H' | 'F';
type socialNetwork = 'twitter' | 'facebook' | 'instagram' | 'website' | 'linkedin';
type socialLinks = Record<socialNetwork, string>;

export interface Contributor {
	id: string;
	name: string;
	email: string;
	password: string;
	tokens: Token[];
	moderator: boolean;
	sex: sex;
	bio: string;
	picture: string; // URL to s3 resource
	social: socialLinks;
	articles: string[]; // IDs of corresponding entries in Articles db
}

export interface Article {
	id: string;
	title: string;
	date: number; // UNIX timestamp
	category: string;
	author: string; // ID of corresponding Contributor
	visits: number;
	readTime: number; // Milliseconds
	content: string; // HTML content
}

export const Name = /^([A-Z][^\d\s]*[a-z]*)( ([A-z][^\d\s]*[a-z]+)+)+$/;

export const Email = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,4}$/;

export const UnhashedPassword = /^\S{6,}$/;

export const TokenRegex = /^\S{8,}\|\|\S{8,}$/;
