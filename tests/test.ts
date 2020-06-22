import { expect } from "chai";
import { Builder, ThenableWebDriver, By } from "selenium-webdriver";

describe("very first test", () => {
  it("should pass", () => {
    expect(1).to.equal(1);
  });
});
