import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PaymentPage } from '../pages/payment.page';
import { PulpitPage } from '../pages/pulpit.page';
import { SideMenuComponent } from '../components/side-menu.component';

test.describe('Payments', () => {
  let paymentPage: PaymentPage;
  let sideMenu: SideMenuComponent;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const userLogin = loginData.userLogin;
    const userPassword = loginData.userPassword;
    sideMenu = new SideMenuComponent(page);
    paymentPage = new PaymentPage(page);

    await page.goto('/');
    await loginPage.login(userLogin, userPassword)
  });

  test('Simple payment', async ({ page }) => {
    // Arrange
    const puplitPage = new PulpitPage(page);
    const paymentPage = new PaymentPage(page);
    const receiver = 'Test reciver';
    const amount = '150';
    const account = '12 3456 7890 1234 5678 9012 3456';
    const title = 'Test title';
    const expectedMessage = `Przelew wykonany! ${amount},00PLN dla ${receiver}`;

    // Act
    await sideMenu.paymentTab.click()
    await paymentPage.transferRecivierInput.fill(`${receiver}`);
    await paymentPage.transferRecivierAccount.fill(`${account}`);
    await paymentPage.transferRecivierAmount.fill(`${amount}`);
    await paymentPage.transferRecivierTitle.fill(`${title}`);
    await paymentPage.transferRecivierExecuteButton.click();
    await puplitPage.pulpitCloseButton.click();

    // Assert
    await test.expect(puplitPage.pulpitInfoMessage).toHaveText(`${expectedMessage}`);
  });
});