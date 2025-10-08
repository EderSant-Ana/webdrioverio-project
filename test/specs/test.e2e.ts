import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page'
import SecurePage from '../pageobjects/secure.page'

describe('Login application with invalid credentials', () => {
    it('should not login with invalid credentials', async () => {
        await LoginPage.open()

        await LoginPage.login('tomsmith', 'SuperSecretPassword!')
        await expect(SecurePage.errorMessage).toBeExisting()
        await expect(SecurePage.errorMessage)
            .toHaveText(expect.stringContaining('Invalid User Name or PassWord'))
        //await expect(SecurePage.errorMessage).toMatchElementSnapshot('flashAlert')
        await driver.pause(10000)
    })
})

