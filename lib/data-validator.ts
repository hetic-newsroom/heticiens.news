// Common types, regex & validators used accross the project

export interface Token {
	token: string;
	created: number;
}

export interface Contributor {
	id: string;
	name: string;
	email: string;
	tokens: Token[];
}

export const Name = /^([A-Z][^\d\s]*[a-z]*)( ([A-z][^\d\s]*[a-z]+)+)+$/;

export const Email = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,4}$/;

export const UnhashedPassword = /^\S{6,}$/;

export const TokenRegex = /^\S{8,}\|\|\S{8,}$/;
