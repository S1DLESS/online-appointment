export const getPhoneFromMaskField = (maskField: string) => {
    const match = maskField.match(/[0-9]+/g)
    if (match) {
        match.shift()
        return match.join('')
    } else {
        return ''
    }
}