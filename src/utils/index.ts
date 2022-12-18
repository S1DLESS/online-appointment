export const getArrayChanges = (oldArray: string[], newArray: string[]) => {
    const arr = []
    for (const newArrEl of newArray) {
        if (!oldArray.includes(newArrEl)) {
            arr.push({ type: 'added', value: newArrEl })
        }
    }
    for (const oldArrEl of oldArray) {
        if (!newArray.includes(oldArrEl)) {
            arr.push({ type: 'removed', value: oldArrEl })
        }
    }
    return arr
}
