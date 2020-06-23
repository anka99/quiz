import { expect } from "chai";
import { ThenableWebDriver } from "mocha-webdriver";
import { Builder, By } from "selenium-webdriver";

const interval = 500;

describe("Quiz tests", () => {
  let driver: ThenableWebDriver;

  beforeEach(async () => {
    driver = new Builder().forBrowser("firefox").build();
  });

  afterEach(async () => {
    await driver.close();
    driver = undefined;
  });

  const fillQuiz = async () => {
    for (let i = 0; i < 5; i++) {
      await driver
        .findElement(By.xpath("/html/body/div/div[4]/input"))
        .sendKeys("4");
      await driver.sleep(interval);
      if (i < 4) {
        await driver.findElement(By.xpath('//*[@id="next"]')).click();
        await driver.sleep(interval);
      } else {
        await driver.findElement(By.xpath('//*[@id="finish"]')).click();
        await driver.sleep(interval);
      }
    }
  };

  const logIn = async () => {
    await driver
      .findElement(By.xpath("//html/body/form/input[1]"))
      .sendKeys("admin");
    await driver
      .findElement(By.xpath("/html/body/form/input[3]"))
      .sendKeys("admin");
    await driver.findElement(By.xpath("/html/body/form/button")).click();
  };

  it("should logout from all sessions after password was changed", async function () {
    this.timeout(40000);

    await driver.get("http://localhost:3000");

    // login
    await logIn();

    // saving and deleting cookies
    const cookie = await driver.manage().getCookie("connect.sid");

    await driver.manage().deleteAllCookies();

    await driver.get("http://localhost:3000");

    await logIn();

    await driver.findElement(By.xpath("/html/body/form[2]/input")).click();

    // change password
    await driver
      .findElement(By.xpath("/html/body/form/input[1]"))
      .sendKeys("admin");
    await driver
      .findElement(By.xpath("/html/body/form/input[3]"))
      .sendKeys("admin");
    await driver.findElement(By.xpath("/html/body/form/button")).click();

    await driver.manage().deleteAllCookies();

    await driver
      .manage()
      .addCookie({ name: "connect.sid", value: cookie.value });
    await driver.get("http://localhost:3000");

    const login = await driver.findElement(By.xpath("/html/body/div/h1"));

    expect(login).to.exist;
  });

  it("should NOT be able to do the same test twice", async function () {
    this.timeout(40000);

    await driver.get("http://localhost:3000");

    await logIn();

    await driver.sleep(interval);

    // start the quiz
    await driver
      .findElement(By.xpath("/html/body/div[2]/ul/li[2]/form/button"))
      .click();
    await driver.sleep(2 * interval);

    await fillQuiz();

    await driver.sleep(interval);

    await driver.get("http://localhost:3000");
    await driver.sleep(500);
    expect(
      await driver
        .findElement(By.xpath("/html/body/div[2]/ul/li[2]/form/button"))
        .getAttribute("disabled")
    ).to.be.equal("true");
  });

  it("times should be alike", async function () {
    this.timeout(40000);

    await driver.get("http://localhost:3000");

    await logIn();

    const timeStart = Date.now();
    await driver
      .findElement(By.xpath("/html/body/div[2]/ul/li[1]/form/button"))
      .click();

    await driver.sleep(interval * 2);

    await fillQuiz();

    // wait for history window
    await driver.sleep(interval);

    const text = await driver
      .findElement(By.xpath("/html/body/div[3]/table/tbody/tr[2]/td[2]"))
      .getText();

    const timeDiff = Date.now() - timeStart;

    const diff = Math.abs(Math.floor(timeDiff / 1000) - +text);

    // some tolerance for time differences
    expect(diff).to.be.lessThan(6);
  });
});
