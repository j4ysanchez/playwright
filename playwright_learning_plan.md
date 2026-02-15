# Playwright Progressive Learning Plan - Pizza Paradise Edition

A hands-on learning path using the **Pizza Paradise** app as your test subject. Each lesson includes specific, actionable steps to apply concepts directly to the pizza store.

---

## **Phase 1: Foundation (Week 1-2)**

### **Lesson 1: Setup & First Test**

**Learning Objectives:**
- Install and configure Playwright
- Understand project structure
- Write your first navigation test
- Run tests in different modes

**Hands-On Steps:**

1. **Install Playwright** (from the root `/playwright` directory):
   ```bash
   npm init playwright@latest
   ```
   - Select TypeScript or JavaScript (recommend TypeScript)
   - Choose `tests` as your test folder
   - Add GitHub Actions workflow: No (we'll do this later)

2. **Start the Pizza Store app** (in a separate terminal):
   ```bash
   cd pizza-store
   npm start
   ```
   - Frontend runs on http://localhost:5173
   - Backend API runs on http://localhost:3001

3. **Create your first test** - `tests/pizza-store-home.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test('should load the pizza store homepage', async ({ page }) => {
     // Navigate to the pizza store
     await page.goto('http://localhost:5173');

     // Verify the page title contains "Pizza"
     await expect(page).toHaveTitle(/Pizza/);

     // Verify the header is visible
     await expect(page.getByRole('banner')).toBeVisible();
   });
   ```

4. **Run your test**:
   ```bash
   npx playwright test
   ```

5. **Run in headed mode** (see the browser):
   ```bash
   npx playwright test --headed
   ```

6. **View the HTML report**:
   ```bash
   npx playwright show-report
   ```

**Success Criteria:**
✅ Playwright is installed
✅ Pizza store runs on localhost:5173
✅ First test passes
✅ You've seen the test run in headed mode
✅ You've viewed the HTML report

---

### **Lesson 2: Core Concepts**

**Learning Objectives:**
- Master locator strategies
- Perform basic interactions
- Understand auto-waiting
- Write assertions

**Hands-On Steps:**

1. **Create a test for the pizza menu** - `tests/pizza-menu.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Pizza Menu', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('http://localhost:5173');
     });

     test('should display all 8 pizzas', async ({ page }) => {
       // Locator by role - finds all pizza cards
       const pizzaCards = page.getByRole('article');
       await expect(pizzaCards).toHaveCount(8);
     });

     test('should show Margherita pizza with correct price', async ({ page }) => {
       // Locator by text
       const margherita = page.getByText('Margherita');
       await expect(margherita).toBeVisible();

       // Chaining locators - find price within the card
       const pizzaCard = page.getByRole('article').filter({ hasText: 'Margherita' });
       await expect(pizzaCard).toContainText('$10.00');
     });

     test('should click customize button on Pepperoni pizza', async ({ page }) => {
       // Find Pepperoni card and click its button
       const pepperoniCard = page.getByRole('article').filter({ hasText: 'Pepperoni' });
       const customizeButton = pepperoniCard.getByRole('button', { name: /customize/i });

       // Click interaction - Playwright auto-waits for the button to be ready
       await customizeButton.click();

       // Verify customizer modal/page appears
       await expect(page.getByRole('heading', { name: /customize.*pepperoni/i })).toBeVisible();
     });
   });
   ```

2. **Experiment with different locator strategies**:
   ```typescript
   test('locator strategy examples', async ({ page }) => {
     await page.goto('http://localhost:5173');

     // By role (BEST - accessibility-focused)
     await page.getByRole('button', { name: 'Customize & Add to Cart' }).first();

     // By text
     await page.getByText('Pizza Paradise');

     // By placeholder (for form inputs)
     await page.getByPlaceholder('Enter your name');

     // By test ID (add data-testid to elements if needed)
     await page.getByTestId('pizza-card-margherita');

     // CSS selector (use sparingly)
     await page.locator('.pizza-card');

     // XPath (last resort)
     await page.locator('//div[@class="pizza-card"]');
   });
   ```

3. **Practice assertions**:
   ```typescript
   test('assertion examples', async ({ page }) => {
     await page.goto('http://localhost:5173');

     // Visibility
     await expect(page.getByRole('heading', { name: 'Pizza Paradise' })).toBeVisible();

     // Text content
     await expect(page.getByRole('article').first()).toContainText('$');

     // Count
     await expect(page.getByRole('button', { name: /customize/i })).toHaveCount(8);

     // Attribute
     const firstImage = page.getByRole('img').first();
     await expect(firstImage).toHaveAttribute('alt', /pizza/i);
   });
   ```

**Success Criteria:**
✅ You can find elements using `getByRole`, `getByText`, and filters
✅ You understand auto-waiting (no need for `sleep` or manual waits)
✅ Tests verify pizza menu displays correctly
✅ You can chain locators to find nested elements

---

### **Lesson 3: Test Structure & Organization**

**Learning Objectives:**
- Use `describe` blocks for grouping
- Implement setup/teardown hooks
- Write readable test descriptions
- Follow test isolation principles

**Hands-On Steps:**

1. **Create an organized test suite** - `tests/cart-functionality.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Shopping Cart Functionality', () => {
     // Runs before EACH test in this describe block
     test.beforeEach(async ({ page }) => {
       await page.goto('http://localhost:5173');
     });

     test.describe('Adding Items to Cart', () => {
       test('should add Margherita pizza to cart with default settings', async ({ page }) => {
         // Find and click customize on Margherita
         const margheritaCard = page.getByRole('article').filter({ hasText: 'Margherita' });
         await margheritaCard.getByRole('button', { name: /customize/i }).click();

         // Click Add to Cart (default Medium size, quantity 1)
         await page.getByRole('button', { name: /add to cart/i }).click();

         // Verify cart icon shows 1 item
         const cartBadge = page.getByTestId('cart-count').or(page.getByText('1').first());
         await expect(cartBadge).toBeVisible();
       });

       test('should add pizza with custom size', async ({ page }) => {
         const hawaiianCard = page.getByRole('article').filter({ hasText: 'Hawaiian' });
         await hawaiianCard.getByRole('button', { name: /customize/i }).click();

         // Select Large size
         await page.getByRole('radio', { name: /large/i }).click();
         await page.getByRole('button', { name: /add to cart/i }).click();

         await expect(page.getByTestId('cart-count').or(page.locator('text=1'))).toBeVisible();
       });
     });

     test.describe('Cart Page', () => {
       // Setup: Add an item before each test
       test.beforeEach(async ({ page }) => {
         const pizzaCard = page.getByRole('article').first();
         await pizzaCard.getByRole('button', { name: /customize/i }).click();
         await page.getByRole('button', { name: /add to cart/i }).click();
       });

       test('should navigate to cart page', async ({ page }) => {
         // Click cart icon/button
         await page.getByRole('link', { name: /cart/i }).click();

         // Verify URL
         await expect(page).toHaveURL(/\/cart/);

         // Verify cart page heading
         await expect(page.getByRole('heading', { name: /shopping cart/i })).toBeVisible();
       });

       test('should display cart item details', async ({ page }) => {
         await page.getByRole('link', { name: /cart/i }).click();

         // Verify item is listed
         const cartItems = page.getByRole('listitem').or(page.locator('[class*="cart-item"]'));
         await expect(cartItems.first()).toBeVisible();
       });
     });
   });
   ```

2. **Understand test isolation** - Each test should be independent:
   ```typescript
   // GOOD: Each test starts fresh
   test('test 1', async ({ page }) => {
     await page.goto('http://localhost:5173');
     // test actions...
   });

   test('test 2', async ({ page }) => {
     await page.goto('http://localhost:5173');
     // test actions - doesn't depend on test 1
   });

   // BAD: Don't do this
   let sharedState;
   test('test 1', async ({ page }) => {
     sharedState = 'something'; // Don't share state between tests
   });
   ```

**Success Criteria:**
✅ Tests are organized in logical `describe` blocks
✅ Common setup is in `beforeEach` hooks
✅ Test descriptions clearly explain what's being tested
✅ Each test can run independently

---

## **Phase 2: Intermediate Skills (Week 3-4)**

### **Lesson 4: Advanced Locators**

**Learning Objectives:**
- Chain and filter locators effectively
- Work with lists of elements
- Handle dynamic content
- Apply locator best practices

**Hands-On Steps:**

1. **Create advanced locator tests** - `tests/advanced-locators.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Advanced Locator Techniques', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('http://localhost:5173');
     });

     test('should filter pizzas by name', async ({ page }) => {
       // Get all pizza cards
       const allPizzas = page.getByRole('article');

       // Filter to only vegetarian pizza
       const vegetarianPizza = allPizzas.filter({ hasText: 'Vegetarian' });
       await expect(vegetarianPizza).toHaveCount(1);

       // Chain to find button within filtered card
       await expect(vegetarianPizza.getByRole('button', { name: /customize/i })).toBeVisible();
     });

     test('should work with multiple pizza cards', async ({ page }) => {
       const pizzaCards = page.getByRole('article');

       // Get count
       const count = await pizzaCards.count();
       expect(count).toBe(8);

       // Iterate through all cards
       for (let i = 0; i < count; i++) {
         const card = pizzaCards.nth(i);
         await expect(card).toBeVisible();

         // Each card should have a price
         await expect(card.locator('text=/\\$\\d+/')).toBeVisible();
       }
     });

     test('should use nth, first, and last selectors', async ({ page }) => {
       const pizzas = page.getByRole('article');

       // First pizza (Margherita)
       await expect(pizzas.first()).toContainText('Margherita');

       // Third pizza (index 2)
       await expect(pizzas.nth(2)).toBeVisible();

       // Last pizza (Mediterranean)
       await expect(pizzas.last()).toContainText('Mediterranean');
     });

     test('should customize pizza with extra toppings', async ({ page }) => {
       // Click customize on first pizza
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();

       // Find all topping checkboxes
       const toppings = page.getByRole('checkbox').filter({ hasText: /extra/i });

       // Select first 2 toppings
       await toppings.nth(0).check();
       await toppings.nth(1).check();

       // Verify they're checked
       await expect(toppings.nth(0)).toBeChecked();
       await expect(toppings.nth(1)).toBeChecked();
     });

     test('should use has and hasNot filters', async ({ page }) => {
       // Find pizza card that has "Meat Lovers" text
       const meatLovers = page.getByRole('article').filter({
         has: page.getByText('Meat Lovers')
       });
       await expect(meatLovers).toHaveCount(1);

       // Find all cards that DON'T have "Sold Out" text
       const availablePizzas = page.getByRole('article').filter({
         hasNot: page.getByText('Sold Out')
       });
       await expect(availablePizzas).toHaveCount(8); // All should be available
     });
   });
   ```

**Success Criteria:**
✅ You can filter elements by text content
✅ You can iterate through lists of elements
✅ You can use `nth()`, `first()`, `last()` effectively
✅ You understand when to chain vs filter locators

---

### **Lesson 5: Page Object Model (POM)**

**Learning Objectives:**
- Understand why POM improves test maintenance
- Create reusable page classes
- Organize selectors and actions
- Build a scalable test structure

**Hands-On Steps:**

1. **Create a pages directory**: `tests/pages/`

2. **Create HomePage class** - `tests/pages/HomePage.ts`:
   ```typescript
   import { Page, Locator } from '@playwright/test';

   export class HomePage {
     readonly page: Page;
     readonly heading: Locator;
     readonly pizzaCards: Locator;
     readonly cartLink: Locator;

     constructor(page: Page) {
       this.page = page;
       this.heading = page.getByRole('heading', { name: /pizza paradise/i });
       this.pizzaCards = page.getByRole('article');
       this.cartLink = page.getByRole('link', { name: /cart/i });
     }

     async goto() {
       await this.page.goto('http://localhost:5173');
     }

     async getPizzaCardByName(pizzaName: string) {
       return this.pizzaCards.filter({ hasText: pizzaName });
     }

     async clickCustomizeOnPizza(pizzaName: string) {
       const card = await this.getPizzaCardByName(pizzaName);
       await card.getByRole('button', { name: /customize/i }).click();
     }

     async goToCart() {
       await this.cartLink.click();
     }

     async getPizzaCount() {
       return await this.pizzaCards.count();
     }
   }
   ```

3. **Create PizzaCustomizerPage class** - `tests/pages/PizzaCustomizerPage.ts`:
   ```typescript
   import { Page, Locator } from '@playwright/test';

   export class PizzaCustomizerPage {
     readonly page: Page;
     readonly heading: Locator;
     readonly sizeSmall: Locator;
     readonly sizeMedium: Locator;
     readonly sizeLarge: Locator;
     readonly sizeXL: Locator;
     readonly quantityInput: Locator;
     readonly addToCartButton: Locator;

     constructor(page: Page) {
       this.page = page;
       this.heading = page.getByRole('heading', { name: /customize/i });
       this.sizeSmall = page.getByRole('radio', { name: /small/i });
       this.sizeMedium = page.getByRole('radio', { name: /medium/i });
       this.sizeLarge = page.getByRole('radio', { name: /large/i });
       this.sizeXL = page.getByRole('radio', { name: /extra large/i });
       this.quantityInput = page.getByRole('spinbutton', { name: /quantity/i });
       this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
     }

     async selectSize(size: 'small' | 'medium' | 'large' | 'xl') {
       const sizeMap = {
         small: this.sizeSmall,
         medium: this.sizeMedium,
         large: this.sizeLarge,
         xl: this.sizeXL
       };
       await sizeMap[size].check();
     }

     async setQuantity(quantity: number) {
       await this.quantityInput.fill(quantity.toString());
     }

     async addExtraTopping(toppingName: string) {
       const topping = this.page.getByRole('checkbox', { name: new RegExp(toppingName, 'i') });
       await topping.check();
     }

     async addToCart() {
       await this.addToCartButton.click();
     }

     async customizeAndAdd(options: {
       size?: 'small' | 'medium' | 'large' | 'xl',
       quantity?: number,
       toppings?: string[]
     }) {
       if (options.size) {
         await this.selectSize(options.size);
       }
       if (options.quantity) {
         await this.setQuantity(options.quantity);
       }
       if (options.toppings) {
         for (const topping of options.toppings) {
           await this.addExtraTopping(topping);
         }
       }
       await this.addToCart();
     }
   }
   ```

4. **Create CartPage class** - `tests/pages/CartPage.ts`:
   ```typescript
   import { Page, Locator } from '@playwright/test';

   export class CartPage {
     readonly page: Page;
     readonly heading: Locator;
     readonly cartItems: Locator;
     readonly subtotalText: Locator;
     readonly checkoutButton: Locator;
     readonly emptyCartMessage: Locator;

     constructor(page: Page) {
       this.page = page;
       this.heading = page.getByRole('heading', { name: /shopping cart/i });
       this.cartItems = page.locator('[class*="cart-item"]').or(page.getByRole('listitem'));
       this.subtotalText = page.getByText(/subtotal/i);
       this.checkoutButton = page.getByRole('button', { name: /proceed to checkout/i });
       this.emptyCartMessage = page.getByText(/your cart is empty/i);
     }

     async goto() {
       await this.page.goto('http://localhost:5173/cart');
     }

     async getItemCount() {
       return await this.cartItems.count();
     }

     async removeItem(index: number) {
       const removeButton = this.cartItems.nth(index).getByRole('button', { name: /remove/i });
       await removeButton.click();
     }

     async proceedToCheckout() {
       await this.checkoutButton.click();
     }
   }
   ```

5. **Use POM in tests** - `tests/with-pom/pizza-ordering.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';
   import { HomePage } from '../pages/HomePage';
   import { PizzaCustomizerPage } from '../pages/PizzaCustomizerPage';
   import { CartPage } from '../pages/CartPage';

   test.describe('Pizza Ordering with POM', () => {
     test('should order a large Margherita with extra toppings', async ({ page }) => {
       const homePage = new HomePage(page);
       const customizerPage = new PizzaCustomizerPage(page);
       const cartPage = new CartPage(page);

       // Navigate to home
       await homePage.goto();
       await expect(homePage.heading).toBeVisible();

       // Select and customize Margherita
       await homePage.clickCustomizeOnPizza('Margherita');
       await expect(customizerPage.heading).toBeVisible();

       // Customize the pizza
       await customizerPage.customizeAndAdd({
         size: 'large',
         quantity: 2,
         toppings: ['Mushrooms', 'Olives']
       });

       // Go to cart
       await homePage.goToCart();
       await expect(cartPage.heading).toBeVisible();

       // Verify item in cart
       expect(await cartPage.getItemCount()).toBeGreaterThan(0);
     });

     test('should add multiple pizzas to cart', async ({ page }) => {
       const homePage = new HomePage(page);
       const customizerPage = new PizzaCustomizerPage(page);
       const cartPage = new CartPage(page);

       await homePage.goto();

       // Add first pizza
       await homePage.clickCustomizeOnPizza('Pepperoni');
       await customizerPage.customizeAndAdd({ size: 'medium' });

       // Go back to home (assuming customizer has back button or we navigate)
       await homePage.goto();

       // Add second pizza
       await homePage.clickCustomizeOnPizza('Hawaiian');
       await customizerPage.customizeAndAdd({ size: 'large', quantity: 1 });

       // Check cart
       await homePage.goToCart();
       expect(await cartPage.getItemCount()).toBe(2);
     });
   });
   ```

**Success Criteria:**
✅ You've created at least 3 page object classes
✅ Locators are defined once in page objects
✅ Tests are cleaner and more readable
✅ You understand how POM makes maintenance easier

---

### **Lesson 6: Handling Common Scenarios**

**Learning Objectives:**
- Work with forms and inputs
- Handle radio buttons, checkboxes, and selects
- Test navigation between pages
- Handle modals and dialogs

**Hands-On Steps:**

1. **Create form tests** - `tests/checkout-form.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';
   import { HomePage } from './pages/HomePage';
   import { PizzaCustomizerPage } from './pages/PizzaCustomizerPage';
   import { CartPage } from './pages/CartPage';

   test.describe('Checkout Form', () => {
     test.beforeEach(async ({ page }) => {
       // Setup: Add an item to cart
       const homePage = new HomePage(page);
       const customizerPage = new PizzaCustomizerPage(page);
       const cartPage = new CartPage(page);

       await homePage.goto();
       await homePage.clickCustomizeOnPizza('Margherita');
       await customizerPage.addToCart();
       await homePage.goToCart();
       await cartPage.proceedToCheckout();
     });

     test('should fill out customer information form', async ({ page }) => {
       // Wait for checkout page
       await expect(page.getByRole('heading', { name: /checkout/i })).toBeVisible();

       // Fill text inputs
       await page.getByLabel(/name/i).fill('John Doe');
       await page.getByLabel(/email/i).fill('john@example.com');
       await page.getByLabel(/phone/i).fill('555-1234');

       // Fill address fields
       await page.getByLabel(/address/i).fill('123 Main St');
       await page.getByLabel(/city/i).fill('San Francisco');
       await page.getByLabel(/zip/i).fill('94102');

       // Select state (if dropdown exists)
       // await page.getByLabel(/state/i).selectOption('CA');

       // Submit form
       await page.getByRole('button', { name: /place order/i }).click();

       // Verify navigation to confirmation
       await expect(page).toHaveURL(/\/confirmation/);
     });

     test('should show validation errors for empty fields', async ({ page }) => {
       // Try to submit without filling form
       await page.getByRole('button', { name: /place order/i }).click();

       // Verify error messages appear
       await expect(page.getByText(/name is required/i)).toBeVisible();
       await expect(page.getByText(/email is required/i)).toBeVisible();
     });

     test('should validate email format', async ({ page }) => {
       await page.getByLabel(/email/i).fill('invalid-email');
       await page.getByRole('button', { name: /place order/i }).click();

       await expect(page.getByText(/valid email/i)).toBeVisible();
     });
   });
   ```

2. **Test radio buttons and checkboxes** - `tests/customizer-inputs.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Pizza Customizer Inputs', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('http://localhost:5173');
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
     });

     test('should select different pizza sizes', async ({ page }) => {
       // Radio buttons - only one can be selected
       await page.getByRole('radio', { name: /small/i }).check();
       await expect(page.getByRole('radio', { name: /small/i })).toBeChecked();
       await expect(page.getByRole('radio', { name: /medium/i })).not.toBeChecked();

       await page.getByRole('radio', { name: /large/i }).check();
       await expect(page.getByRole('radio', { name: /large/i })).toBeChecked();
       await expect(page.getByRole('radio', { name: /small/i })).not.toBeChecked();
     });

     test('should select multiple toppings', async ({ page }) => {
       // Checkboxes - multiple can be selected
       const mushrooms = page.getByRole('checkbox', { name: /mushroom/i });
       const olives = page.getByRole('checkbox', { name: /olive/i });

       await mushrooms.check();
       await olives.check();

       await expect(mushrooms).toBeChecked();
       await expect(olives).toBeChecked();

       // Uncheck one
       await mushrooms.uncheck();
       await expect(mushrooms).not.toBeChecked();
       await expect(olives).toBeChecked();
     });

     test('should increment quantity', async ({ page }) => {
       const quantityInput = page.getByRole('spinbutton', { name: /quantity/i });

       // Check initial value
       await expect(quantityInput).toHaveValue('1');

       // Increment using +/- buttons
       await page.getByRole('button', { name: '+' }).click();
       await expect(quantityInput).toHaveValue('2');

       await page.getByRole('button', { name: '+' }).click();
       await expect(quantityInput).toHaveValue('3');

       await page.getByRole('button', { name: '-' }).click();
       await expect(quantityInput).toHaveValue('2');
     });
   });
   ```

3. **Test navigation** - `tests/navigation.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('App Navigation', () => {
     test('should navigate between all pages', async ({ page }) => {
       // Home page
       await page.goto('http://localhost:5173');
       await expect(page).toHaveURL('http://localhost:5173/');

       // Navigate to cart
       await page.getByRole('link', { name: /cart/i }).click();
       await expect(page).toHaveURL(/\/cart/);
       await expect(page.getByRole('heading', { name: /shopping cart/i })).toBeVisible();

       // Navigate back to home
       await page.getByRole('link', { name: /pizza paradise/i }).or(page.getByRole('link', { name: /home/i })).click();
       await expect(page).toHaveURL('http://localhost:5173/');

       // Add item and go to checkout
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();
       await page.getByRole('link', { name: /cart/i }).click();
       await page.getByRole('button', { name: /checkout/i }).click();
       await expect(page).toHaveURL(/\/checkout/);
     });

     test('should use browser back/forward', async ({ page }) => {
       await page.goto('http://localhost:5173');
       await page.getByRole('link', { name: /cart/i }).click();

       // Go back
       await page.goBack();
       await expect(page).toHaveURL('http://localhost:5173/');

       // Go forward
       await page.goForward();
       await expect(page).toHaveURL(/\/cart/);
     });
   });
   ```

**Success Criteria:**
✅ You can fill and submit forms
✅ You can work with radio buttons and checkboxes
✅ You can test input validation
✅ You understand page navigation patterns

---

## **Phase 3: Advanced Testing (Week 5-6)**

### **Lesson 7: API Testing**

**Learning Objectives:**
- Use APIRequestContext for API calls
- Combine UI and API tests
- Set up test data via API
- Verify backend responses

**Hands-On Steps:**

1. **Create API tests** - `tests/api/orders-api.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Orders API', () => {
     let apiContext;

     test.beforeAll(async ({ playwright }) => {
       apiContext = await playwright.request.newContext({
         baseURL: 'http://localhost:3001',
       });
     });

     test.afterAll(async () => {
       await apiContext.dispose();
     });

     test('should create an order via API', async () => {
       const orderData = {
         customer: {
           name: 'John Doe',
           email: 'john@example.com',
           phone: '555-1234',
           address: '123 Main St',
           city: 'San Francisco',
           zipCode: '94102'
         },
         items: [
           {
             name: 'Margherita',
             size: 'Medium',
             quantity: 2,
             price: 10.00,
             toppings: ['Mushrooms']
           }
         ],
         subtotal: 20.00,
         tax: 1.60,
         deliveryFee: 3.99,
         total: 25.59
       };

       const response = await apiContext.post('/api/orders', {
         data: orderData
       });

       expect(response.ok()).toBeTruthy();
       expect(response.status()).toBe(201);

       const responseBody = await response.json();
       expect(responseBody).toHaveProperty('orderId');
       expect(responseBody).toHaveProperty('message');
       expect(responseBody.order.customer.name).toBe('John Doe');
     });

     test('should retrieve all orders', async () => {
       const response = await apiContext.get('/api/orders');

       expect(response.ok()).toBeTruthy();
       const orders = await response.json();
       expect(Array.isArray(orders)).toBeTruthy();
     });

     test('should retrieve specific order by ID', async () => {
       // First create an order
       const createResponse = await apiContext.post('/api/orders', {
         data: {
           customer: { name: 'Test User', email: 'test@test.com', phone: '555-0000', address: '1 Test St', city: 'Test City', zipCode: '12345' },
           items: [{ name: 'Pepperoni', size: 'Large', quantity: 1, price: 12.00 }],
           subtotal: 12.00,
           tax: 0.96,
           deliveryFee: 3.99,
           total: 16.95
         }
       });

       const { orderId } = await createResponse.json();

       // Retrieve the order
       const getResponse = await apiContext.get(`/api/orders/${orderId}`);
       expect(getResponse.ok()).toBeTruthy();

       const order = await getResponse.json();
       expect(order.orderId).toBe(orderId);
       expect(order.customer.name).toBe('Test User');
     });
   });
   ```

2. **Combine UI and API** - `tests/hybrid/ui-api-workflow.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Hybrid UI + API Testing', () => {
     let apiContext;

     test.beforeAll(async ({ playwright }) => {
       apiContext = await playwright.request.newContext({
         baseURL: 'http://localhost:3001',
       });
     });

     test.afterAll(async () => {
       await apiContext.dispose();
     });

     test('should place order via UI and verify via API', async ({ page }) => {
       // UI: Add pizza to cart
       await page.goto('http://localhost:5173');
       await page.getByRole('article').filter({ hasText: 'Margherita' }).getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();

       // UI: Go to checkout
       await page.getByRole('link', { name: /cart/i }).click();
       await page.getByRole('button', { name: /checkout/i }).click();

       // UI: Fill form and submit
       await page.getByLabel(/name/i).fill('API Test User');
       await page.getByLabel(/email/i).fill('apitest@example.com');
       await page.getByLabel(/phone/i).fill('555-9999');
       await page.getByLabel(/address/i).fill('456 API Lane');
       await page.getByLabel(/city/i).fill('Test City');
       await page.getByLabel(/zip/i).fill('99999');
       await page.getByRole('button', { name: /place order/i }).click();

       // UI: Get order ID from confirmation page
       await expect(page).toHaveURL(/\/confirmation/);
       const orderIdText = await page.getByText(/order.*#/i).textContent();
       const orderId = orderIdText.match(/[A-Za-z0-9_-]+$/)[0];

       // API: Verify order was created
       const response = await apiContext.get(`/api/orders/${orderId}`);
       expect(response.ok()).toBeTruthy();

       const order = await response.json();
       expect(order.customer.email).toBe('apitest@example.com');
       expect(order.items).toHaveLength(1);
       expect(order.items[0].name).toBe('Margherita');
     });

     test('should create order via API and verify in UI', async ({ page }) => {
       // API: Create order
       const response = await apiContext.post('/api/orders', {
         data: {
           customer: { name: 'UI Verify User', email: 'uiverify@test.com', phone: '555-1111', address: '789 Test Ave', city: 'API City', zipCode: '11111' },
           items: [{ name: 'Hawaiian', size: 'Large', quantity: 1, price: 12.00 }],
           subtotal: 12.00,
           tax: 0.96,
           deliveryFee: 3.99,
           total: 16.95
         }
       });

       const { orderId } = await response.json();

       // UI: Navigate to confirmation page directly
       await page.goto(`http://localhost:5173/confirmation?orderId=${orderId}`);

       // Verify order details displayed
       await expect(page.getByText(orderId)).toBeVisible();
       await expect(page.getByText('UI Verify User')).toBeVisible();
       await expect(page.getByText('Hawaiian')).toBeVisible();
     });
   });
   ```

**Success Criteria:**
✅ You can make API calls using APIRequestContext
✅ You can verify backend responses
✅ You can combine UI and API in tests
✅ You understand when to use API for test setup

---

### **Lesson 8: Network Control**

**Learning Objectives:**
- Intercept and mock network requests
- Modify API responses
- Test error scenarios
- Block external resources

**Hands-On Steps:**

1. **Create network mocking tests** - `tests/network/api-mocking.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Network Mocking', () => {
     test('should mock order creation API', async ({ page }) => {
       // Mock the POST /api/orders endpoint
       await page.route('**/api/orders', async (route) => {
         await route.fulfill({
           status: 201,
           contentType: 'application/json',
           body: JSON.stringify({
             orderId: 'MOCK-ORDER-12345',
             message: 'Order created successfully',
             order: {
               customer: { name: 'Mocked User' },
               total: 99.99
             }
           })
         });
       });

       // Complete order flow
       await page.goto('http://localhost:5173');
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();
       await page.getByRole('link', { name: /cart/i }).click();
       await page.getByRole('button', { name: /checkout/i }).click();

       await page.getByLabel(/name/i).fill('Test User');
       await page.getByLabel(/email/i).fill('test@test.com');
       await page.getByLabel(/phone/i).fill('555-0000');
       await page.getByLabel(/address/i).fill('123 Test St');
       await page.getByLabel(/city/i).fill('Test City');
       await page.getByLabel(/zip/i).fill('12345');

       await page.getByRole('button', { name: /place order/i }).click();

       // Verify mocked order ID appears
       await expect(page.getByText('MOCK-ORDER-12345')).toBeVisible();
     });

     test('should handle API error gracefully', async ({ page }) => {
       // Mock API to return error
       await page.route('**/api/orders', async (route) => {
         await route.fulfill({
           status: 500,
           contentType: 'application/json',
           body: JSON.stringify({ error: 'Server error' })
         });
       });

       // Try to complete order
       await page.goto('http://localhost:5173');
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();
       await page.getByRole('link', { name: /cart/i }).click();
       await page.getByRole('button', { name: /checkout/i }).click();

       await page.getByLabel(/name/i).fill('Error Test');
       await page.getByLabel(/email/i).fill('error@test.com');
       await page.getByLabel(/phone/i).fill('555-0000');
       await page.getByLabel(/address/i).fill('123 Test');
       await page.getByLabel(/city/i).fill('Test');
       await page.getByLabel(/zip/i).fill('12345');

       await page.getByRole('button', { name: /place order/i }).click();

       // Verify error message is shown
       await expect(page.getByText(/error|failed/i)).toBeVisible();
     });

     test('should modify API response', async ({ page }) => {
       await page.route('**/api/orders', async (route) => {
         // Get original response
         const response = await route.fetch();
         const body = await response.json();

         // Modify the response
         body.total = 0.01; // Make it 1 cent for testing

         await route.fulfill({
           response,
           body: JSON.stringify(body)
         });
       });

       // Place order and verify modified total
       await page.goto('http://localhost:5173');
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();
       await page.getByRole('link', { name: /cart/i }).click();
       await page.getByRole('button', { name: /checkout/i }).click();

       await page.getByLabel(/name/i).fill('Modified Test');
       await page.getByLabel(/email/i).fill('mod@test.com');
       await page.getByLabel(/phone/i).fill('555-0000');
       await page.getByLabel(/address/i).fill('123 Test');
       await page.getByLabel(/city/i).fill('Test');
       await page.getByLabel(/zip/i).fill('12345');

       await page.getByRole('button', { name: /place order/i }).click();

       await expect(page.getByText(/\$0\.01/)).toBeVisible();
     });

     test('should block external resources', async ({ page }) => {
       // Block all image requests to speed up test
       await page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());

       await page.goto('http://localhost:5173');

       // Page should still load even without images
       await expect(page.getByRole('heading', { name: /pizza paradise/i })).toBeVisible();
     });
   });
   ```

2. **Test offline scenarios** - `tests/network/offline.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Offline Scenarios', () => {
     test('should handle offline mode', async ({ page, context }) => {
       await page.goto('http://localhost:5173');

       // Add item to cart while online
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();

       // Go offline
       await context.setOffline(true);

       // Try to checkout
       await page.getByRole('link', { name: /cart/i }).click();
       await page.getByRole('button', { name: /checkout/i }).click();

       await page.getByLabel(/name/i).fill('Offline Test');
       await page.getByLabel(/email/i).fill('offline@test.com');
       await page.getByLabel(/phone/i).fill('555-0000');
       await page.getByLabel(/address/i).fill('123 Test');
       await page.getByLabel(/city/i).fill('Test');
       await page.getByLabel(/zip/i).fill('12345');

       await page.getByRole('button', { name: /place order/i }).click();

       // Should show network error
       await expect(page.getByText(/network|offline|connection/i)).toBeVisible();

       // Go back online
       await context.setOffline(false);
     });
   });
   ```

**Success Criteria:**
✅ You can mock API responses
✅ You can test error scenarios
✅ You can modify responses in transit
✅ You can simulate offline mode

---

### **Lesson 9: Authentication & State**

**Learning Objectives:**
- Reuse authentication state
- Handle different user sessions
- Manage cookies and local storage
- Speed up tests by avoiding repeated logins

**Hands-On Steps:**

1. **Setup authentication state** - `tests/auth/auth.setup.ts`:
   ```typescript
   import { test as setup } from '@playwright/test';

   const authFile = 'tests/.auth/user.json';

   setup('authenticate user', async ({ page }) => {
     // If your app had login, you'd do it here
     // For pizza store, we'll save cart state
     await page.goto('http://localhost:5173');

     // Add items to cart
     await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
     await page.getByRole('button', { name: /add to cart/i }).click();

     // Save storage state (includes localStorage, cookies)
     await page.context().storageState({ path: authFile });
   });
   ```

2. **Use saved state in tests** - `tests/auth/with-cart-state.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   // Use the saved storage state
   test.use({ storageState: 'tests/.auth/user.json' });

   test.describe('Tests with Pre-filled Cart', () => {
     test('should start with item in cart', async ({ page }) => {
       await page.goto('http://localhost:5173/cart');

       // Cart should already have an item
       const cartItems = page.locator('[class*="cart-item"]');
       expect(await cartItems.count()).toBeGreaterThan(0);
     });
   });
   ```

3. **Work with local storage** - `tests/storage/local-storage.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Local Storage Management', () => {
     test('should persist cart in local storage', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // Add item to cart
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();

       // Check local storage
       const cartData = await page.evaluate(() => {
         return localStorage.getItem('cart');
       });

       expect(cartData).not.toBeNull();
       const cart = JSON.parse(cartData);
       expect(cart.length).toBeGreaterThan(0);
     });

     test('should restore cart from local storage on page reload', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // Add item
       await page.getByRole('article').filter({ hasText: 'Margherita' }).getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();

       // Reload page
       await page.reload();

       // Cart should still have item
       await page.getByRole('link', { name: /cart/i }).click();
       const cartItems = page.locator('[class*="cart-item"]');
       expect(await cartItems.count()).toBeGreaterThan(0);
       await expect(page.getByText('Margherita')).toBeVisible();
     });

     test('should clear cart from local storage', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // Clear local storage
       await page.evaluate(() => {
         localStorage.clear();
       });

       // Navigate to cart
       await page.goto('http://localhost:5173/cart');

       // Should show empty cart
       await expect(page.getByText(/empty/i)).toBeVisible();
     });
   });
   ```

**Success Criteria:**
✅ You can save and reuse storage state
✅ You can work with localStorage
✅ You understand how to avoid repeated setups
✅ Tests run faster with state reuse

---

## **Phase 4: Professional Features (Week 7-8)**

### **Lesson 10: Advanced Configuration**

**Learning Objectives:**
- Configure playwright.config.ts
- Set up multiple projects (browsers/environments)
- Configure timeouts and retries
- Create custom base URLs

**Hands-On Steps:**

1. **Update playwright.config.ts**:
   ```typescript
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './tests',

     // Run tests in parallel
     fullyParallel: true,

     // Fail the build on CI if you accidentally left test.only
     forbidOnly: !!process.env.CI,

     // Retry on CI only
     retries: process.env.CI ? 2 : 0,

     // Opt out of parallel tests on CI
     workers: process.env.CI ? 1 : undefined,

     // Reporter to use
     reporter: [
       ['html'],
       ['list'],
       ['json', { outputFile: 'test-results.json' }]
     ],

     use: {
       // Base URL for all tests
       baseURL: 'http://localhost:5173',

       // Collect trace when retrying the failed test
       trace: 'on-first-retry',

       // Screenshot on failure
       screenshot: 'only-on-failure',

       // Video on failure
       video: 'retain-on-failure',
     },

     // Configure projects for multiple browsers
     projects: [
       {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] },
       },
       {
         name: 'firefox',
         use: { ...devices['Desktop Firefox'] },
       },
       {
         name: 'webkit',
         use: { ...devices['Desktop Safari'] },
       },
       {
         name: 'mobile-chrome',
         use: { ...devices['Pixel 5'] },
       },
       {
         name: 'mobile-safari',
         use: { ...devices['iPhone 13'] },
       },
       // Setup project for auth
       {
         name: 'setup',
         testMatch: /.*\.setup\.ts/,
       },
       // Tests that depend on setup
       {
         name: 'logged-in-chromium',
         use: {
           ...devices['Desktop Chrome'],
           storageState: 'tests/.auth/user.json',
         },
         dependencies: ['setup'],
       },
     ],

     // Run local dev server before starting tests
     webServer: {
       command: 'cd pizza-store && npm start',
       url: 'http://localhost:5173',
       reuseExistingServer: !process.env.CI,
       timeout: 120000,
     },
   });
   ```

2. **Create environment-specific configs** - `playwright.prod.config.ts`:
   ```typescript
   import { defineConfig } from '@playwright/test';
   import baseConfig from './playwright.config';

   export default defineConfig({
     ...baseConfig,
     use: {
       ...baseConfig.use,
       baseURL: 'https://pizza-paradise-prod.com',
     },
     // Don't start local server for prod
     webServer: undefined,
   });
   ```

3. **Run specific projects**:
   ```bash
   # Run only in Chromium
   npx playwright test --project=chromium

   # Run only mobile tests
   npx playwright test --project=mobile-chrome --project=mobile-safari

   # Run specific test file in all browsers
   npx playwright test tests/pizza-menu.spec.ts
   ```

**Success Criteria:**
✅ You have a comprehensive playwright.config.ts
✅ Tests run in multiple browsers
✅ Web server starts automatically
✅ You understand project configurations

---

### **Lesson 11: Debugging & Development**

**Learning Objectives:**
- Use Playwright Inspector effectively
- Generate tests with Codegen
- Analyze traces
- Debug failing tests

**Hands-On Steps:**

1. **Use Playwright Inspector**:
   ```bash
   # Run test in debug mode
   npx playwright test tests/pizza-menu.spec.ts --debug

   # Debug specific test
   npx playwright test tests/pizza-menu.spec.ts:10 --debug
   ```

2. **Generate tests with Codegen**:
   ```bash
   # Start codegen
   npx playwright codegen http://localhost:5173

   # Record a test:
   # 1. Click through pizza ordering flow
   # 2. Add items to cart
   # 3. Go to checkout
   # 4. Fill form
   # 5. Copy generated code
   ```

3. **Use trace viewer** - Update a test to always capture trace:
   ```typescript
   test('order pizza with trace', async ({ page }) => {
     // Start tracing
     await page.context().tracing.start({ screenshots: true, snapshots: true });

     await page.goto('http://localhost:5173');
     await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
     await page.getByRole('button', { name: /add to cart/i }).click();

     // Stop tracing and save
     await page.context().tracing.stop({ path: 'trace.zip' });
   });
   ```

   Then view trace:
   ```bash
   npx playwright show-trace trace.zip
   ```

4. **Add debugging helpers to tests**:
   ```typescript
   import { test, expect } from '@playwright/test';

   test('debug helpers example', async ({ page }) => {
     await page.goto('http://localhost:5173');

     // Pause execution (opens inspector)
     // await page.pause();

     // Take screenshot for debugging
     await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

     // Log page content
     const content = await page.content();
     console.log('Page HTML:', content);

     // Log specific element
     const pizzaCount = await page.getByRole('article').count();
     console.log('Number of pizzas:', pizzaCount);

     // Wait for specific time (avoid in real tests, use for debugging only)
     // await page.waitForTimeout(3000);

     // Wait for network to be idle
     await page.waitForLoadState('networkidle');
   });
   ```

**Success Criteria:**
✅ You can debug tests with Inspector
✅ You've generated a test with Codegen
✅ You can analyze traces
✅ You know how to troubleshoot failing tests

---

### **Lesson 12: Visual Testing**

**Learning Objectives:**
- Take and compare screenshots
- Implement visual regression testing
- Handle acceptable visual differences
- Test across browsers

**Hands-On Steps:**

1. **Create visual tests** - `tests/visual/screenshots.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Visual Regression Tests', () => {
     test('homepage should match screenshot', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // Wait for all images to load
       await page.waitForLoadState('networkidle');

       // Take screenshot and compare
       await expect(page).toHaveScreenshot('homepage.png', {
         fullPage: true,
       });
     });

     test('pizza customizer should match screenshot', async ({ page }) => {
       await page.goto('http://localhost:5173');
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
       await page.waitForLoadState('networkidle');

       await expect(page).toHaveScreenshot('customizer.png');
     });

     test('shopping cart should match screenshot', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // Add item
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();

       // Go to cart
       await page.goto('http://localhost:5173/cart');
       await page.waitForLoadState('networkidle');

       await expect(page).toHaveScreenshot('cart-with-item.png');
     });

     test('individual pizza card should match', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // Screenshot just the first pizza card
       const pizzaCard = page.getByRole('article').first();
       await expect(pizzaCard).toHaveScreenshot('margherita-card.png');
     });

     test('mobile view should match screenshot', async ({ page }) => {
       // Set mobile viewport
       await page.setViewportSize({ width: 375, height: 667 });
       await page.goto('http://localhost:5173');
       await page.waitForLoadState('networkidle');

       await expect(page).toHaveScreenshot('homepage-mobile.png', {
         fullPage: true,
       });
     });
   });
   ```

2. **Update screenshots**:
   ```bash
   # Generate initial baseline screenshots
   npx playwright test --update-snapshots

   # Update specific test screenshots
   npx playwright test visual/screenshots.spec.ts --update-snapshots
   ```

3. **Configure visual comparison tolerance** - in `playwright.config.ts`:
   ```typescript
   export default defineConfig({
     expect: {
       toHaveScreenshot: {
         // Maximum number of pixels that can differ
         maxDiffPixels: 100,

         // OR use threshold (0 to 1)
         // threshold: 0.2,
       },
     },
   });
   ```

4. **Test cross-browser visual consistency**:
   ```bash
   # Run visual tests in all browsers
   npx playwright test visual/ --project=chromium --project=firefox --project=webkit
   ```

**Success Criteria:**
✅ You can capture baseline screenshots
✅ Tests fail when UI changes unexpectedly
✅ You can update baselines intentionally
✅ You understand visual diff tolerance

---

## **Phase 5: Expert Level (Week 9-10)**

### **Lesson 13: Performance & Optimization**

**Learning Objectives:**
- Configure parallel execution
- Use test sharding for CI
- Create custom fixtures
- Optimize test runtime

**Hands-On Steps:**

1. **Create custom fixtures** - `tests/fixtures/pizza-fixtures.ts`:
   ```typescript
   import { test as base } from '@playwright/test';
   import { HomePage } from '../pages/HomePage';
   import { PizzaCustomizerPage } from '../pages/PizzaCustomizerPage';
   import { CartPage } from '../pages/CartPage';

   type PizzaFixtures = {
     homePage: HomePage;
     customizerPage: PizzaCustomizerPage;
     cartPage: CartPage;
     cartWithItems: void; // Auto-setup cart with items
   };

   export const test = base.extend<PizzaFixtures>({
     // Page object fixtures
     homePage: async ({ page }, use) => {
       const homePage = new HomePage(page);
       await homePage.goto();
       await use(homePage);
     },

     customizerPage: async ({ page }, use) => {
       await use(new PizzaCustomizerPage(page));
     },

     cartPage: async ({ page }, use) => {
       await use(new CartPage(page));
     },

     // Setup fixture - adds items to cart automatically
     cartWithItems: async ({ homePage, customizerPage }, use) => {
       await homePage.clickCustomizeOnPizza('Margherita');
       await customizerPage.addToCart();
       await use();
     },
   });

   export { expect } from '@playwright/test';
   ```

2. **Use custom fixtures in tests** - `tests/with-fixtures/cart-tests.spec.ts`:
   ```typescript
   import { test, expect } from '../fixtures/pizza-fixtures';

   test.describe('Cart Tests with Fixtures', () => {
     test('should have items in cart', async ({ homePage, cartPage, cartWithItems }) => {
       // cartWithItems fixture already added item to cart
       await homePage.goToCart();
       expect(await cartPage.getItemCount()).toBeGreaterThan(0);
     });

     test('should checkout with pre-filled cart', async ({ page, cartWithItems, cartPage }) => {
       await cartPage.goto();
       await cartPage.proceedToCheckout();
       await expect(page).toHaveURL(/checkout/);
     });
   });
   ```

3. **Configure test sharding** for CI:
   ```bash
   # Run 1st shard of 3
   npx playwright test --shard=1/3

   # Run 2nd shard of 3
   npx playwright test --shard=2/3

   # Run 3rd shard of 3
   npx playwright test --shard=3/3
   ```

4. **Optimize test performance**:
   ```typescript
   import { test, expect } from '@playwright/test';

   // Run tests in this file serially (not parallel)
   test.describe.configure({ mode: 'serial' });

   test.describe('Performance Optimizations', () => {
     // Share page between tests (only use when tests don't modify state)
     let sharedPage;

     test.beforeAll(async ({ browser }) => {
       sharedPage = await browser.newPage();
       await sharedPage.goto('http://localhost:5173');
     });

     test.afterAll(async () => {
       await sharedPage.close();
     });

     test('fast test 1', async () => {
       // Uses sharedPage - no navigation overhead
       await expect(sharedPage.getByRole('heading')).toBeVisible();
     });

     test('fast test 2', async () => {
       const count = await sharedPage.getByRole('article').count();
       expect(count).toBe(8);
     });
   });
   ```

**Success Criteria:**
✅ You've created custom fixtures
✅ You understand test sharding
✅ Tests run in parallel efficiently
✅ You know when to optimize vs keep tests isolated

---

### **Lesson 14: Advanced Patterns**

**Learning Objectives:**
- Test mobile responsiveness
- Perform accessibility testing
- Handle different viewports
- Record test videos

**Hands-On Steps:**

1. **Mobile responsive testing** - `tests/mobile/responsive.spec.ts`:
   ```typescript
   import { test, expect, devices } from '@playwright/test';

   test.describe('Mobile Responsiveness', () => {
     test.use({ ...devices['iPhone 13'] });

     test('should display mobile menu', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // Mobile menu should be visible
       const menuButton = page.getByRole('button', { name: /menu/i });
       if (await menuButton.isVisible()) {
         await menuButton.click();
         await expect(page.getByRole('navigation')).toBeVisible();
       }
     });

     test('pizza cards should stack on mobile', async ({ page }) => {
       await page.goto('http://localhost:5173');

       const firstCard = page.getByRole('article').first();
       const box = await firstCard.boundingBox();

       // On mobile, cards should take full width (or close to it)
       const viewportWidth = page.viewportSize().width;
       expect(box.width).toBeGreaterThan(viewportWidth * 0.8);
     });
   });

   test.describe('Tablet View', () => {
     test.use({ ...devices['iPad Pro'] });

     test('should show 2 columns on tablet', async ({ page }) => {
       await page.goto('http://localhost:5173');

       const cards = page.getByRole('article');
       const firstBox = await cards.first().boundingBox();
       const secondBox = await cards.nth(1).boundingBox();

       // Cards should be side by side
       expect(firstBox.y).toBeCloseTo(secondBox.y, 0);
     });
   });
   ```

2. **Accessibility testing** - `tests/a11y/accessibility.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';
   import AxeBuilder from '@axe-core/playwright'; // npm install -D @axe-core/playwright

   test.describe('Accessibility Tests', () => {
     test('homepage should not have accessibility violations', async ({ page }) => {
       await page.goto('http://localhost:5173');

       const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

       expect(accessibilityScanResults.violations).toEqual([]);
     });

     test('pizza customizer should be keyboard accessible', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // Tab to first customize button
       await page.keyboard.press('Tab');
       await page.keyboard.press('Tab'); // Adjust based on number of tabs needed

       // Press Enter to activate
       await page.keyboard.press('Enter');

       // Should open customizer
       await expect(page.getByRole('heading', { name: /customize/i })).toBeVisible();

       // Should be able to navigate size options with keyboard
       await page.keyboard.press('Tab'); // Tab to size options
       await page.keyboard.press('Space'); // Select size

       // Tab to Add to Cart button and activate
       await page.keyboard.press('Tab');
       await page.keyboard.press('Tab');
       await page.keyboard.press('Enter');
     });

     test('should have proper heading hierarchy', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // Check for h1
       const h1 = page.getByRole('heading', { level: 1 });
       await expect(h1).toHaveCount(1);

       // All headings should have accessible names
       const allHeadings = page.getByRole('heading');
       const count = await allHeadings.count();

       for (let i = 0; i < count; i++) {
         const text = await allHeadings.nth(i).textContent();
         expect(text.trim()).not.toBe('');
       }
     });

     test('images should have alt text', async ({ page }) => {
       await page.goto('http://localhost:5173');

       const images = page.getByRole('img');
       const count = await images.count();

       for (let i = 0; i < count; i++) {
         await expect(images.nth(i)).toHaveAttribute('alt', /.+/);
       }
     });

     test('form inputs should have labels', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // Add item and go to checkout
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();
       await page.getByRole('link', { name: /cart/i }).click();
       await page.getByRole('button', { name: /checkout/i }).click();

       // All inputs should have associated labels
       const nameInput = page.getByLabel(/name/i);
       const emailInput = page.getByLabel(/email/i);
       const phoneInput = page.getByLabel(/phone/i);

       await expect(nameInput).toBeVisible();
       await expect(emailInput).toBeVisible();
       await expect(phoneInput).toBeVisible();
     });
   });
   ```

3. **Record videos** - Already configured in `playwright.config.ts`:
   ```typescript
   use: {
     video: 'retain-on-failure', // or 'on', 'off', 'on-first-retry'
   }
   ```

   Videos are automatically saved to `test-results/` folder after failed tests.

**Success Criteria:**
✅ Tests work on mobile devices
✅ You can check for accessibility violations
✅ You understand keyboard navigation testing
✅ Videos are recorded for debugging

---

### **Lesson 15: Production Practices**

**Learning Objectives:**
- Handle flaky tests
- Implement smart retry strategies
- Create comprehensive reports
- Set up CI/CD pipeline

**Hands-On Steps:**

1. **Handle flaky tests** - `tests/production/flaky-handling.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Flaky Test Management', () => {
     // Retry this specific test more times
     test('potentially flaky API test', async ({ page }) => {
       test.slow(); // Mark as slow, triples timeout

       await page.goto('http://localhost:5173');
       await page.getByRole('article').first().getByRole('button', { name: /customize/i }).click();
       await page.getByRole('button', { name: /add to cart/i }).click();
       await page.getByRole('link', { name: /cart/i }).click();
       await page.getByRole('button', { name: /checkout/i }).click();

       await page.getByLabel(/name/i).fill('Flaky Test');
       await page.getByLabel(/email/i).fill('flaky@test.com');
       await page.getByLabel(/phone/i).fill('555-0000');
       await page.getByLabel(/address/i).fill('123 Test');
       await page.getByLabel(/city/i).fill('Test');
       await page.getByLabel(/zip/i).fill('12345');

       await page.getByRole('button', { name: /place order/i }).click();

       // Wait for network to settle (reduces flakiness)
       await page.waitForLoadState('networkidle');

       await expect(page).toHaveURL(/confirmation/);
     });

     test('wait for element properly', async ({ page }) => {
       await page.goto('http://localhost:5173');

       // BAD: Hard-coded wait
       // await page.waitForTimeout(3000);

       // GOOD: Wait for specific condition
       await page.waitForLoadState('domcontentloaded');

       // GOOD: Auto-waiting with locator
       await expect(page.getByRole('heading')).toBeVisible();

       // GOOD: Wait for specific element
       await page.getByRole('article').first().waitFor({ state: 'visible' });
     });
   });
   ```

2. **Create custom reporter** - `tests/reporters/custom-reporter.ts`:
   ```typescript
   import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

   class CustomReporter implements Reporter {
     onTestEnd(test: TestCase, result: TestResult) {
       console.log(`Test: ${test.title}`);
       console.log(`Status: ${result.status}`);
       console.log(`Duration: ${result.duration}ms`);

       if (result.status === 'failed') {
         console.log(`Error: ${result.error?.message}`);
       }
     }

     onEnd() {
       console.log('All tests completed!');
     }
   }

   export default CustomReporter;
   ```

   Add to `playwright.config.ts`:
   ```typescript
   reporter: [
     ['./tests/reporters/custom-reporter.ts'],
     ['html'],
   ]
   ```

3. **Set up GitHub Actions** - `.github/workflows/playwright.yml`:
   ```yaml
   name: Playwright Tests

   on:
     push:
       branches: [ main, master ]
     pull_request:
       branches: [ main, master ]

   jobs:
     test:
       timeout-minutes: 60
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v4

       - uses: actions/setup-node@v4
         with:
           node-version: 18

       - name: Install dependencies
         run: npm ci

       - name: Install Playwright Browsers
         run: npx playwright install --with-deps

       - name: Start pizza store
         run: |
           cd pizza-store
           npm ci
           npm start &
           sleep 10

       - name: Run Playwright tests
         run: npx playwright test

       - uses: actions/upload-artifact@v4
         if: always()
         with:
           name: playwright-report
           path: playwright-report/
           retention-days: 30
   ```

4. **Test data management** - `tests/helpers/test-data.ts`:
   ```typescript
   export class TestDataBuilder {
     static randomEmail() {
       return `test${Date.now()}@example.com`;
     }

     static randomPhone() {
       return `555-${Math.floor(1000 + Math.random() * 9000)}`;
     }

     static validCustomer() {
       return {
         name: 'Test Customer',
         email: this.randomEmail(),
         phone: this.randomPhone(),
         address: '123 Test Street',
         city: 'Test City',
         zipCode: '12345'
       };
     }

     static pizzaOrder(pizzaName: string, size: string = 'Medium', quantity: number = 1) {
       return {
         name: pizzaName,
         size,
         quantity,
         toppings: []
       };
     }
   }
   ```

   Use in tests:
   ```typescript
   import { test } from '@playwright/test';
   import { TestDataBuilder } from './helpers/test-data';

   test('create order with test data', async ({ page }) => {
     const customer = TestDataBuilder.validCustomer();

     // Use customer data in form...
     await page.getByLabel(/name/i).fill(customer.name);
     await page.getByLabel(/email/i).fill(customer.email);
     // etc...
   });
   ```

**Success Criteria:**
✅ You can identify and fix flaky tests
✅ You have CI/CD pipeline set up
✅ Tests generate comprehensive reports
✅ You use proper test data strategies

---

## **Completion Checklist**

Mark off as you complete each phase:

- [ ] **Phase 1**: Foundation - Setup, core concepts, test structure
- [ ] **Phase 2**: Intermediate - Advanced locators, POM, common scenarios
- [ ] **Phase 3**: Advanced - API testing, network mocking, state management
- [ ] **Phase 4**: Professional - Configuration, debugging, visual testing
- [ ] **Phase 5**: Expert - Performance, advanced patterns, production practices

---

## **Next Steps After Completion**

1. **Build a complete test suite** for the entire pizza-store app
2. **Integrate with CI/CD** - Set up GitHub Actions or similar
3. **Add test coverage metrics** - Track what's tested
4. **Implement visual regression** - Catch UI bugs automatically
5. **Create documentation** - Document your test patterns for the team
6. **Explore Playwright AI** - Look into AI-powered test generation
7. **Join the community** - Discord, GitHub discussions, Stack Overflow

---

## **Resources**

- 📚 [Official Playwright Docs](https://playwright.dev)
- 🎥 [Playwright YouTube Channel](https://www.youtube.com/@Playwrightdev)
- 💬 [Playwright Discord](https://aka.ms/playwright/discord)
- 🐙 [Playwright GitHub](https://github.com/microsoft/playwright)
- 📖 [Best Practices Guide](https://playwright.dev/docs/best-practices)

---

**You're now ready to become a Playwright expert!** 🎭🍕

Start with Lesson 1 and work your way through. Each lesson builds on the previous one, using the pizza-store app as your hands-on learning environment.

Good luck! 🚀
