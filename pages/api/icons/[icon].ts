import {NextApiRequest, NextApiResponse} from 'next';

const icons = {
	email: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="email"><rect width="24" height="24" opacity="0"/><path fill="__FILL__" d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-.67 2L12 10.75 5.67 6zM19 18H5a1 1 0 0 1-1-1V7.25l7.4 5.55a1 1 0 0 0 .6.2 1 1 0 0 0 .6-.2L20 7.25V17a1 1 0 0 1-1 1z"/></g></g></svg>',
	at: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="at"><rect width="24" height="24" opacity="0"/><path fill="__FILL__" d="M13 2a10 10 0 0 0-5 19.1 10.15 10.15 0 0 0 4 .9 10 10 0 0 0 6.08-2.06 1 1 0 0 0 .19-1.4 1 1 0 0 0-1.41-.19A8 8 0 1 1 12.77 4 8.17 8.17 0 0 1 20 12.22v.68a1.71 1.71 0 0 1-1.78 1.7 1.82 1.82 0 0 1-1.62-1.88V8.4a1 1 0 0 0-1-1 1 1 0 0 0-1 .87 5 5 0 0 0-3.44-1.36A5.09 5.09 0 1 0 15.31 15a3.6 3.6 0 0 0 5.55.61A3.67 3.67 0 0 0 22 12.9v-.68A10.2 10.2 0 0 0 13 2zm-1.82 13.09A3.09 3.09 0 1 1 14.27 12a3.1 3.1 0 0 1-3.09 3.09z"/></g></g></svg>',
	hash: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="hash"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path fill="__FILL__" d="M20 14h-4.3l.73-4H20a1 1 0 0 0 0-2h-3.21l.69-3.81A1 1 0 0 0 16.64 3a1 1 0 0 0-1.22.82L14.67 8h-3.88l.69-3.81A1 1 0 0 0 10.64 3a1 1 0 0 0-1.22.82L8.67 8H4a1 1 0 0 0 0 2h4.3l-.73 4H4a1 1 0 0 0 0 2h3.21l-.69 3.81A1 1 0 0 0 7.36 21a1 1 0 0 0 1.22-.82L9.33 16h3.88l-.69 3.81a1 1 0 0 0 .84 1.19 1 1 0 0 0 1.22-.82l.75-4.18H20a1 1 0 0 0 0-2zM9.7 14l.73-4h3.87l-.73 4z"/></g></g></svg>',
	person: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="person"><rect width="24" height="24" opacity="0"/><path fill="__FILL__" d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"/><path fill="__FILL__" d="M12 13a7 7 0 0 0-7 7 1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 0 0-7-7z"/></g></g></svg>',
	search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="search"><rect width="24" height="24" opacity="0"/><path fill="__FILL__" d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"/></g></g></svg>',
	questionMark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="question-mark"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path fill="__FILL__" d="M17 9A5 5 0 0 0 7 9a1 1 0 0 0 2 0 3 3 0 1 1 3 3 1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-1.1A5 5 0 0 0 17 9z"/><circle fill="__FILL__" cx="12" cy="19" r="1"/></g></g></svg>'
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
	const icon = req.query.icon;
	const fill = req.query.fill || '000';

	if (!(icon in icons)) {
		res.status(404);
		res.end();
		return;
	}

	res.status(200);
	res.setHeader('Content-type', 'image/svg+xml');
	res.setHeader('Cache-control', 'public, max-age=172800, must-revalidate');
	const coloredIcon = icons[icon as string].replace(/__FILL__/g, `#${fill as string}`);
	res.end(coloredIcon);
};
