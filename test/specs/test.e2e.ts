import { browser, expect, $ } from "@wdio/globals";

describe("Avocadoro Authentication Flow", () => {
    // --- Selectors ---
    const emailInput = () => $('input[placeholder="Type email"]');
    const passwordInput = () => $('input[placeholder="Type password"]');
    const confirmPasswordInput = () =>
        $('input[placeholder="Confirm password"]');
    const loginButton = () => $("button=Log in");
    const signUpSubmitButton = () => $("button=Sign Up");
    const goToSignUpButton = () => $("button*=Don't have an account");
    const backButton = () => $(".button_logo"); // The one that sets signUpView(false)

    describe("Sign In View", () => {
        it("should show the Sign In screen by default", async () => {
            await expect(loginButton()).toBeDisplayed();
            await expect(emailInput()).toBeDisplayed();
            await expect(passwordInput()).toBeDisplayed();
        });
    });
});
