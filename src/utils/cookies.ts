export const getCookie = (name: string) => {
    return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
}
export const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/; max-age=604800`; // expires in 7 days
}
export const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}