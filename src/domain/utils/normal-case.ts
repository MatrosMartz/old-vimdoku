export function normalCase(str: string) {
	return str[0].toUpperCase() + str.substring(1).replace(/[A-Z]/g, match => ' ' + match)
}
