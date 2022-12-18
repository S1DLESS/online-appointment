import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { UploadedFile } from 'express-fileupload'


type FileType = 'formBackground' | 'master' | 'service'

class FileService {

    add(file: UploadedFile, type: FileType) {
        const fileNameWithExtension = uuidv4() + path.extname(file.name)
        if (type === 'formBackground') {
            file.mv(path.resolve(__dirname, '..', '..', 'static', 'formBackgrounds', fileNameWithExtension))
        }
        if (type === 'master') {
            file.mv(path.resolve(__dirname, '..', '..', 'static', 'avatars', 'masters', fileNameWithExtension))
        }
        if (type === 'service') {
            file.mv(path.resolve(__dirname, '..', '..', 'static', 'avatars', 'services', fileNameWithExtension))
        }
        return fileNameWithExtension
    }

    delete(fileNameWithExtension: string, type: FileType) {
        try {
            if (type === 'formBackground') {
                fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', 'formBackgrounds', fileNameWithExtension))
            }
            if (type === 'master') {
                fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', 'avatars', 'masters', fileNameWithExtension))
            }
            if (type === 'service') {
                fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', 'avatars', 'services', fileNameWithExtension))
            }
        } catch (e) {
            console.log('DeleteFileError: ', e)
        }
    }

}

export default new FileService()