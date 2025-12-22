import { browser, expect, $ } from '@wdio/globals'

describe('Electron Testing', () => {
    it('should print application title and verify the email label', async () => {
        const emailLabel = await $('.login_label'); 
        await expect(emailLabel).toBeDisplayed();
        await expect(emailLabel).toHaveText("Enter your email");
    })
})