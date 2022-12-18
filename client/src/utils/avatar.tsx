import { List } from '@mui/icons-material'


type WhoseAvatar = 'master' | 'service'

export const getAvatarProps = (url: string, name: string, whose: WhoseAvatar) => {
    if (url) {
        return {
            src: `${process.env.REACT_APP_API_URL}avatars/${whose}s/${url}`,
            alt: name
        }
    } else {
        if (whose === 'master') {
            return {
                children: name.split(' ').length > 1
                    ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
                    : `${name.split(' ')[0][0]}`
            }
        } else {
            return {
                children: <List />
            }
        }
    }
}