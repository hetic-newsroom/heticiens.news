// Common types, regex & validators used accross the project

export interface Token {
	token: string;
	created: number;
}

type sex = 'H' | 'F';
type socialNetwork = 'twitter' | 'facebook' | 'instagram' | 'website' | 'linkedin';
type socialLinks = Record<socialNetwork, string>;
type booleanNumber = 0 | 1;

export interface Contributor {
	id: string;
	name: string;
	email: string;
	password: string;
	tokens: Token[];
	moderator: booleanNumber;
	sex: sex;
	bio: string;
	picture: string; // URL to s3 resource
	social: socialLinks;
	articles: string[]; // IDs of corresponding entries in Articles db
	drafts: string[]; // IDs of drafted articles
}

type articleStatus = 'published' | 'waiting' | 'refused' | 'draft';

export interface Article {
	id: string;
	title: string;
	date: number; // UNIX timestamp
	category: string;
	authors: string[] | Array<Partial<Contributor>>; // ID of corresponding Contributor
	readTime: number; // Milliseconds
	image: string; // URL
	intro: string;
	content: string; // HTML content
	status: articleStatus;
}

type newsletterRegistrantStatus = 'unconfirmed' | 'confirmed';

export interface NewsletterRegistration {
	id: string;
	email: string;
	status: newsletterRegistrantStatus;
	validationToken: string;
}

export const Name = /^([A-Z][^\d\s]*[a-z]*)( ([A-z][^\d\s]*[a-z]+)+)+$/;

export const Email = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,4}$/;

export const UnhashedPassword = /^\S{6,}$/;

export const TokenRegex = /^\S{4,}\|\|\S{8,}$/;
