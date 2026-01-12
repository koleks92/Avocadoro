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
    const settingsButton = () => $(".dashboard_bottom_div .custom_button");
    const removeAccountButton = () => $(".settings_main_div .custom_button");
    const removeAccountButton2 = () =>
        $(".settings_confirm_div .button_logo_dashboard");

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

    describe("Create new account, delete account", () => {
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
        it("Delete created account", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await emailInput().setValue("test2@mail.com");
            await passwordInput().setValue("Password123456");
            await loginButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await settingsButton().click();
            await removeAccountButton().click();
            await removeAccountButton2().click();
            await expect(loginButton()).toBeDisplayed();
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

describe("Dashboard Flow", () => {
    const emailInput = () => $('input[placeholder="Type email"]');
    const passwordInput = () => $('input[placeholder="Type password"]');
    const loginButton = () => $("button=Log in");

    const dashboardTitle = () => $(".dashboard_title_span");
    const logoutButton = () => $(".button_logo_dashboard");
    const settingsButton = () => $(".dashboard_bottom_div .custom_button");
    const addButton = () => $(".add_button");
    const goBackButton = () => $(".go_back_button");

    const addNewSessionSpan = () => $(".add_group_title_span");
    const settingsTitleSpan = () => $("span=Settings");

    describe("Dashboard View", async () => {
        it("Should show dashboard with all buttons", async () => {
            await (browser as any).refresh();
            await expect(loginButton()).toBeDisplayed();
            await emailInput().setValue("test@mail.com");
            await passwordInput().setValue("Password123456");
            await loginButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(logoutButton()).toBeDisplayed();
            await expect(settingsButton()).toBeDisplayed();
            await expect(addButton()).toBeDisplayed();
        });
    });

    describe("Dashboard buttons", async () => {
        it("Should show add new button and open add new session view", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(addButton()).toBeDisplayed();
            await addButton().click();
            await expect(addNewSessionSpan()).toBeDisplayed();
            await expect(goBackButton()).toBeDisplayed();
            await goBackButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
        });
        it("Should show settings button and open settings view", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(settingsButton()).toBeDisplayed();
            await settingsButton().click();
            await expect(settingsTitleSpan()).toBeDisplayed();
            await expect(goBackButton()).toBeDisplayed();
            await goBackButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
        });
    });
});

describe("Session group flow", () => {
    const dashboardTitle = () => $(".dashboard_title_span");
    const addButton = () => $(".add_button");
    const addSessionButton = () => $("button=Add");
    const deleteBackButton = () =>
        $(".delete_button_confirm_div .go_back_button");
    const addGroupBackButton = () =>
        $(".add_group_back_button_div .go_back_button");
    const groupBackButton = () => $(".group_back_button_div .go_back_button");
    const editButton = () => $(".edit_button");
    const deleteButton = () => $(".delete_button");
    const deleteButtonConfirm = () =>
        $(".delete_button_confirm_div .delete_button_confirm");
    const updateButton = () => $("button=Update");

    const addNewSessionSpan = () => $(".add_group_title_span");
    const testGroupSpan = () => $(".session_group_title=TestGroup");
    const testGroupSpan2 = () => $(".session_group_title=TestGroup2");
    const testGroupSpan3 = () => $(".session_group_title=TestGroup3");
    const tenMinSpan = () => $("div=10min");
    const twentyMinSpan = () => $("div=20min");

    const deleteSpan = () => $(".delete_span_text");

    const missingNameSpan = () => $("span=Missing avocadoro name");
    const existingNameSpan = () =>
        $("span=You already have a group with that name.");

    const nameInput = () => $(".name_input input");

    const focusFive = () => $(".focus_timer").$("button=5");
    const breakTen = () => $(".break_timer").$("button=10");
    const focusTen = () => $(".focus_timer").$("button=10");
    const breakTwenty = () => $(".break_timer").$("button=20");

    describe("Adding new session group", async () => {
        it("Should add new session group and show it on dashboard", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(addButton()).toBeDisplayed();
            await addButton().click();
            await expect(addNewSessionSpan()).toBeDisplayed();
            await expect(nameInput()).toBeDisplayed();
            await nameInput().setValue("TestGroup");
            await expect(focusFive()).toBeDisplayed();
            await focusFive().click();
            await expect(breakTen()).toBeDisplayed();
            await breakTen().click();
            await expect(addSessionButton()).toBeDisplayed();
            await addSessionButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan()).toBeDisplayed();
        });

        it("Should add new session group with defaulut timers and show it on dashboard", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(addButton()).toBeDisplayed();
            await addButton().click();
            await expect(addNewSessionSpan()).toBeDisplayed();
            await expect(nameInput()).toBeDisplayed();
            await nameInput().setValue("TestGroup2");
            await expect(focusFive()).toBeDisplayed();
            await expect(breakTen()).toBeDisplayed();
            await expect(addSessionButton()).toBeDisplayed();
            await addSessionButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan()).toBeDisplayed();
        });

        it("Should show warning span, if missing name", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(addButton()).toBeDisplayed();
            await addButton().click();
            await expect(addNewSessionSpan()).toBeDisplayed();
            await expect(nameInput()).toBeDisplayed();
            await expect(focusFive()).toBeDisplayed();
            await focusFive().click();
            await expect(breakTen()).toBeDisplayed();
            await breakTen().click();
            await expect(addSessionButton()).toBeDisplayed();
            await addSessionButton().click();
            await expect(missingNameSpan()).toBeDisplayed();
            await addGroupBackButton().click();
        });

        it("Should shouw a warning if that name already exists", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(addButton()).toBeDisplayed();
            await addButton().click();
            await expect(addNewSessionSpan()).toBeDisplayed();
            await expect(nameInput()).toBeDisplayed();
            await nameInput().setValue("TestGroup");
            await expect(focusFive()).toBeDisplayed();
            await expect(breakTen()).toBeDisplayed();
            await expect(addSessionButton()).toBeDisplayed();
            await addSessionButton().click();
            await expect(existingNameSpan()).toBeDisplayed();
            await addGroupBackButton().click();
        });
    });

    describe("Editing and removing group sessions", () => {
        it("Should remove group session", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan()).toBeDisplayed();
            await expect(testGroupSpan2()).toBeDisplayed();
            await testGroupSpan().click();
            await expect(editButton()).toBeDisplayed();
            await editButton().click();
            await expect(deleteButton()).toBeDisplayed();
            await deleteButton().click();
            await expect(deleteSpan()).toBeDisplayed();
            await deleteButtonConfirm().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan()).not.toBeDisplayed();
            await expect(testGroupSpan2()).toBeDisplayed();
        });

        it("Should show remove warning message, without removing group session", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan2()).toBeDisplayed();
            await testGroupSpan2().click();
            await expect(editButton()).toBeDisplayed();
            await editButton().click();
            await expect(deleteButton()).toBeDisplayed();
            await deleteButton().click();
            await expect(deleteSpan()).toBeDisplayed();
            await deleteBackButton().click();
            await addGroupBackButton().click();
            await groupBackButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan2()).toBeDisplayed();
        });

        it("Should edit name, focus and break time", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan2()).toBeDisplayed();
            await testGroupSpan2().click();
            await expect(editButton()).toBeDisplayed();
            await editButton().click();
            await nameInput().setValue("TestGroup3");
            await focusTen().click();
            await breakTwenty().click();
            await updateButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan3()).toBeDisplayed();
            await expect(tenMinSpan()).toBeDisplayed();
            await expect(twentyMinSpan()).toBeDisplayed();
        });

        it("Should remove group session 3", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan3()).toBeDisplayed();
            await testGroupSpan3().click();
            await expect(editButton()).toBeDisplayed();
            await editButton().click();
            await expect(deleteButton()).toBeDisplayed();
            await deleteButton().click();
            await expect(deleteSpan()).toBeDisplayed();
            await deleteButtonConfirm().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan3()).not.toBeDisplayed();
        });
    });
});

describe("Timer flow", () => {
    const dashboardTitle = () => $(".dashboard_title_span");
    const addButton = () => $(".add_button");
    const addSessionButton = () => $("button=Add");
    const editButton = () => $(".edit_button");
    const deleteButton = () => $(".delete_button");
    const deleteButtonConfirm = () =>
        $(".delete_button_confirm_div .delete_button_confirm");
    const startButton = () => $(".button_start");
    const stopButton = () => $(".button_stop");
    const restartButton = () => $(".timer_button_restart");
    const openTimerButton = () => $(".group_result_div .open_timer_button");
    const closeTimerButton = () => $(".group_timer_div .close_timer_button");
    const goBackButton = () => $(".go_back_button");

    const addNewSessionSpan = () => $(".add_group_title_span");
    const testGroupSpan = () => $(".session_group_title=TestGroup");
    const nameSpan = () => $(".dashboard_title_span=TestGroup");
    const focusTitleSpan = () => $(".timer_title_span=Focus");
    const breakTitleSpan = () => $(".timer_title_span=Break");
    const fiveMinTimer = () => $(".timer_time_span=05:00");
    const quoteSpan = () => $(".quote_printer_root");
    const deleteSpan = () => $(".delete_span_text");
    const totalTimeSpan = () => $(".group_second_div_title");
    const fiveMinTotalSpan = () => $("span=00h 05m");
    const stopTimerSpan = () => $("span=Reset the timer first");
    const resetTimerSpan = () => $("span=Double click for reset");

    const nameInput = () => $(".name_input input");

    const avocadoroImages = () => $$(".avocadoro_print_image");

    const focusFive = () => $(".focus_timer").$("button=5");

    describe("Test timer 5 min to switch to break", () => {
        it("Should add new group session with 5 min focus and 5 min break", async () => {
            await (browser as any).refresh();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(addButton()).toBeDisplayed();
            await addButton().click();
            await expect(addNewSessionSpan()).toBeDisplayed();
            await expect(nameInput()).toBeDisplayed();
            await nameInput().setValue("TestGroup");
            await expect(focusFive()).toBeDisplayed();
            await focusFive().click();
            await expect(addSessionButton()).toBeDisplayed();
            await addSessionButton().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan()).toBeDisplayed();
        });

        it("Should open new group session and show the Focus, timer and buttons", async () => {
            await (browser as any).refresh();
            await expect(testGroupSpan()).toBeDisplayed();
            await testGroupSpan().click();
            await expect(nameSpan()).toBeDisplayed();
            await expect(focusTitleSpan()).toBeDisplayed();
            await expect(fiveMinTimer()).toBeDisplayed();
            await expect(quoteSpan()).toBeDisplayed();
            await expect(startButton()).toBeDisplayed();
            await expect(stopButton()).toBeDisplayed();
            await expect(restartButton()).toBeDisplayed();
        });

        it("Should start the timer and after 5 minutes switch to break", async () => {
            await expect(startButton()).toBeDisplayed();
            await startButton().click();
            await expect(focusTitleSpan()).toBeDisplayed();
            await (browser as any).execute(() => {
                (window as any).skipForward(0, 2);
            });
            await (browser as any).pause(3000);
            await expect(breakTitleSpan()).toBeDisplayed();

            await (browser as any).execute(() => {
                (window as any).skipForward(0, 2);
            });
            await (browser as any).pause(3000);
            await expect(focusTitleSpan()).toBeDisplayed();
            await (browser as any).pause(3000);

            await restartButton().doubleClick();
        });

        it("Should show one avocadoro image added", async () => {
            await closeTimerButton().click();
            await expect(focusTitleSpan()).not.toBeDisplayed();
            await expect(breakTitleSpan()).not.toBeDisplayed();
            await expect(totalTimeSpan()).toBeDisplayed();
            await expect(avocadoroImages()).toBeElementsArrayOfSize(3);
            await expect(fiveMinTotalSpan()).toBeDisplayed();
            await openTimerButton().click();
            await expect(focusTitleSpan()).toBeDisplayed();
            await goBackButton().click();
            await (browser as any).pause(1000);
        });

        it("Should not allow to go back when timer is on", async () => {
            await expect(dashboardTitle()).toBeDisplayed();
            await testGroupSpan().click();
            await startButton().click();
            await (browser as any).pause(1000);
            await goBackButton().click();
            await (browser as any).pause(1000);
            await expect(stopTimerSpan()).toBeDisplayed();
            await (browser as any).pause(1000);
            await restartButton().doubleClick();
            await (browser as any).pause(1000);
            await expect(stopTimerSpan()).not.toBeDisplayed();
        });

        it("Should not allow to edit when timer is on", async () => {
            await startButton().click();
            await (browser as any).pause(1000);
            await editButton().click();
            await (browser as any).pause(1000);
            await expect(stopTimerSpan()).toBeDisplayed();
            await (browser as any).pause(1000);
            await restartButton().doubleClick();
            await (browser as any).pause(1000);
            await expect(stopTimerSpan()).not.toBeDisplayed();
        });

        it("Should not allow to go back when timer is paused", async () => {
            await startButton().click();
            await (browser as any).pause(3000);
            await stopButton().click();
            await (browser as any).pause(1000);
            await goBackButton().click();
            await (browser as any).pause(1000);
            await expect(stopTimerSpan()).toBeDisplayed();
            await (browser as any).pause(1000);
            await restartButton().doubleClick();
            await (browser as any).pause(1000);
            await expect(stopTimerSpan()).not.toBeDisplayed();
        });

        it("Should not allow to edit when timer is paused", async () => {
            await startButton().click();
            await (browser as any).pause(3000);
            await stopButton().click();
            await (browser as any).pause(1000);
            await editButton().click();
            await (browser as any).pause(1000);
            await expect(stopTimerSpan()).toBeDisplayed();
            await (browser as any).pause(1000);
            await restartButton().doubleClick();
            await (browser as any).pause(1000);
            await expect(stopTimerSpan()).not.toBeDisplayed();
        });

        it("Should not allow to reset with one click", async () => {
            await startButton().click();
            await (browser as any).pause(1000);
            await restartButton().click();
            await (browser as any).pause(1000);
            await expect(resetTimerSpan()).toBeDisplayed();
            await (browser as any).pause(1000);
            await restartButton().doubleClick();
            await goBackButton().click();
        });

        it("Should remove group session", async () => {
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan()).toBeDisplayed();
            await testGroupSpan().click();
            await expect(editButton()).toBeDisplayed();
            await editButton().click();
            await expect(deleteButton()).toBeDisplayed();
            await deleteButton().click();
            await expect(deleteSpan()).toBeDisplayed();
            await deleteButtonConfirm().click();
            await expect(dashboardTitle()).toBeDisplayed();
            await expect(testGroupSpan()).not.toBeDisplayed();
        });
    });
});
