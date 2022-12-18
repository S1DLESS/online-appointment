import { getAvatarProps } from "./avatar"
import { List } from '@mui/icons-material'


describe('getAvatarProps', () => {
    describe('url: empty', () => {
        test('name: empty, whose: master', () => {
            expect(getAvatarProps('', '', 'master')).toEqual({
                children: ''
            })
        })
        test('name: 1 word, whose: master', () => {
            expect(getAvatarProps('', 'qwe', 'master')).toEqual({
                children: 'q'
            })
        })
        test('name: 2 word, whose: master', () => {
            expect(getAvatarProps('', 'qwe asd', 'master')).toEqual({
                children: 'qa'
            })
        })
        test('name: 3 word, whose: master', () => {
            expect(getAvatarProps('', 'qwe asd zxc', 'master')).toEqual({
                children: 'qaz'
            })
        })
        test('name: empty, whose: service', () => {
            expect(getAvatarProps('', '', 'service')).toEqual({
                children: <List />
            })
        })
        test('name: 1 word, whose: service', () => {
            expect(getAvatarProps('', 'qwe', 'service')).toEqual({
                children: <List />
            })
        })
        test('name: 2 word, whose: service', () => {
            expect(getAvatarProps('', 'qwe asd', 'service')).toEqual({
                children: <List />
            })
        })
        test('name: 3 word, whose: service', () => {
            expect(getAvatarProps('', 'qwe asd zxc', 'service')).toEqual({
                children: <List />
            })
        })
    })
    describe('url: exist', () => {
        test('name: empty, whose: master', () => {
            expect(getAvatarProps('someUrl', '', 'master')).toEqual({
                src: `${process.env.REACT_APP_API_URL}avatars/masters/someUrl`,
                alt: ''
            })
        })
        test('name: 1 word, whose: master', () => {
            expect(getAvatarProps('someUrl', 'qwe', 'master')).toEqual({
                src: `${process.env.REACT_APP_API_URL}avatars/masters/someUrl`,
                alt: 'qwe'
            })
        })
        test('name: 2 word, whose: master', () => {
            expect(getAvatarProps('someUrl', 'qwe asd', 'master')).toEqual({
                src: `${process.env.REACT_APP_API_URL}avatars/masters/someUrl`,
                alt: 'qwe asd'
            })
        })
        test('name: 3 word, whose: master', () => {
            expect(getAvatarProps('someUrl', 'qwe asd zxc', 'master')).toEqual({
                src: `${process.env.REACT_APP_API_URL}avatars/masters/someUrl`,
                alt: 'qwe asd zxc'
            })
        })
        test('name: empty, whose: service', () => {
            expect(getAvatarProps('someUrl', '', 'service')).toEqual({
                src: `${process.env.REACT_APP_API_URL}avatars/services/someUrl`,
                alt: ''
            })
        })
        test('name: 1 word, whose: service', () => {
            expect(getAvatarProps('someUrl', 'qwe', 'service')).toEqual({
                src: `${process.env.REACT_APP_API_URL}avatars/services/someUrl`,
                alt: 'qwe'
            })
        })
        test('name: 2 word, whose: service', () => {
            expect(getAvatarProps('someUrl', 'qwe asd', 'service')).toEqual({
                src: `${process.env.REACT_APP_API_URL}avatars/services/someUrl`,
                alt: 'qwe asd'
            })
        })
        test('name: 3 word, whose: service', () => {
            expect(getAvatarProps('someUrl', 'qwe asd zxc', 'service')).toEqual({
                src: `${process.env.REACT_APP_API_URL}avatars/services/someUrl`,
                alt: 'qwe asd zxc'
            })
        })
    })
})