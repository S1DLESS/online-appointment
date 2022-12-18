import nodemailer, { Transporter } from 'nodemailer'
import { getFormattedDate, getFormattedTime } from '../utils/date.js'


class MailService {
    transporter: Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href='${link}'>${link}</a>
                </div>
            `
        })
    }

    async sendResetPasswordMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Изменение пароля на ' + process.env.API_URL,
            text: '',
            html: `
                <div>
                    <h1>Для изменения пароля перейдите по ссылке</h1>
                    <a href='${link}'>${link}</a>
                </div>
            `
        })
    }

    async sendConfirmMail(to: string, branchTitle: string, date: number) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: branchTitle,
            text: '',
            html: `
                <div>
                    <h1>Вы записаны ${getFormattedDate(date)} в ${getFormattedTime(date)}</h1>
                </div>
            `
        })
    }
}

export default new MailService()