import { browser, expect, $ } from "@wdio/globals";

describe("Authentication Flow", () => {
    // --- Selectors ---
    const emailInput = () => $('input[placeholder="Type email"]');
    const passwordInput = () => $('input[placeholder="Type password"]');
    const confirmPasswordInput = () =>
        $('input[placeholder="Confirm password"]');
    const loginButton = () => $("button=Log in");
    const signUpSubmitButton = () => $("button=Sign Up");
    const goToSignUpButton = () => $("button*=have an account yet");
    const backButton = () =>
        $(".login_logo_div > div:first-child .button_logo");
    const logoutButton = () => $(".button_logo_dashboard");
    const dashboardTitle = () => $(".dashboard_title_span");

    const passwordWarning = () =>
        $("span=Password must be ≥ 10 chars and include a number");
    const emailWarning = () => $("span=Invalid email");
    const generalWarning = () => $("span=Invalid email or password");
    const signUpWarning = () => $("span=User already registered");
    const passwordsWarning = () => $("span=Typed passwords are not the same");

    describe("Login View", () => {
        it("Should show the Sign In screen by default", async () => {
            await expect(loginButton()).toBeDisplayed();
            await expect(emailInput()).toBeDisplayed();
            await expect(passwordInput()).toBeDisplayed();
            await expect(goToSignUpButton()).toBeDisplayed();
        });

        it("Should show the sign up view and go back to sign in view", async () => {
            await goToSignUpButton().click();
            await expect(confirmPasswordInput()).toBeDisplayed();
            await expect(signUpSubmitButton()).toBeDisplayed();
            await backButton().click();
            await expect(loginButton()).toBeDisplayed();
        });
    });

    describe("Create new account", () => {
        it("Create new account, move to dashboard and logout", async () => {
            await expect(loginButton()).toBeDisplayed();
            await goToSignUpButton().click();
            await emailInput().setValue("test2@mail.com");
            await passwordInput().setValue("Password123456");
            await confirmPasswordInput().setValue("Password123456");
            await signUpSubmitButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await logoutButton().click();
            await expect(loginButton()).toBeDisplayed();
        });
        it("Create new account, but user already exists", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await goToSignUpButton().click();
            await emailInput().setValue("test@mail.com");
            await passwordInput().setValue("Password123456");
            await confirmPasswordInput().setValue("Password123456");
            await signUpSubmitButton().click();
            await expect(signUpWarning()).toBeDisplayed();
        });
        it("Create new account, but passwords do not match", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await goToSignUpButton().click();
            await emailInput().setValue("test@mail.com");
            await passwordInput().setValue("Password123456");
            await confirmPasswordInput().setValue("Password12345");
            await signUpSubmitButton().click();
            await expect(passwordsWarning()).toBeDisplayed();
        });
    });

    describe("Login to Dashboard", () => {
        it("Login, move to dashboard and logout", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await emailInput().setValue("test@mail.com");
            await passwordInput().setValue("Password123456");
            await loginButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await logoutButton().click();
            await expect(loginButton()).toBeDisplayed();
        });
        it("Wrong password or email", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await emailInput().setValue("test@mail.com");
            await passwordInput().setValue("Password1234567");
            await loginButton().click();
            await expect(generalWarning()).toBeDisplayed();
        });
    });

    describe("Missing or inccorect values", () => {
        it("Missing email and password", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await loginButton().click();
            await expect(emailWarning()).toBeDisplayed();
            await expect(passwordWarning()).toBeDisplayed();
        });
        it("Missing email", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await emailInput().setValue("");
            await passwordInput().setValue("Password123456");
            await loginButton().click();
            await expect(emailWarning()).toBeDisplayed();
            await expect(passwordWarning()).not.toBeDisplayed();
        });
        it("Missing password", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await emailInput().setValue("test@mail.com");
            await passwordInput().setValue("");
            await loginButton().click();
            await expect(passwordWarning()).toBeDisplayed();
            await expect(emailWarning()).not.toBeDisplayed();
        });
        it("Password too short", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await emailInput().setValue("test@mail.com");
            await passwordInput().setValue("Pass1234");
            await loginButton().click();
            await expect(passwordWarning()).toBeDisplayed();
            await expect(emailWarning()).not.toBeDisplayed();
        });
        it("Password missing numbers", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await emailInput().setValue("test@mail.com");
            await passwordInput().setValue("PasswordPassword");
            await loginButton().click();
            await expect(passwordWarning()).toBeDisplayed();
            await expect(emailWarning()).not.toBeDisplayed();
        });
    });
});
