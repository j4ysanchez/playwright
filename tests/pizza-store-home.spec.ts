import { test, expect } from '@playwright/test';

test ('should load the pizza store homepage', async ({page}) => {

    // navigate to the pizza store
    await page.goto('http://localhost:5173');

    // Verify the page title contains Pizza
    await expect(page).toHaveTitle(/pizza/i);

    await expect (page.getByRole('banner')).toBeVisible();
});



