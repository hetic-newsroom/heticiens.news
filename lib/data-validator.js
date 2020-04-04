// Common regex & validators used accross the project

export const Name = /^([A-Z][^\d\s]*[a-z]*)( ([A-z][^\d\s]*[a-z]+)+)+$/;

export const Email = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,4}$/;

export const UnhashedPassword = /^\S{6,}$/;
