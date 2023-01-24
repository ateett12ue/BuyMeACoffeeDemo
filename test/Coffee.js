const { expect, assert } = require("chai");
const hre = require("hardhat");
describe("BuyCoffee", function () {
  let contract;
  let user;
  before(async () => {
    const testContract = await ethers.getContractFactory("BuyMeACoffee");
    contract = await testContract.deploy();
    user = (await ethers.getSigners())[1];
  });

  it("should allow user to buy coffee", async () => {
    const _name = "radheSham";
    const _msg = "good going";
    const value = ethers.utils.parseEther("1");
    const initalBalance = await user.getBalance();
  
    const txn = await contract.connect(user).buyCoffee(_name, _msg, { value });
    await txn.wait();

    const finalBalance = await user.getBalance();
    
    const memo = await contract.userMemos(user.address);
    // await memo.wait();

    expect(memo.name).to.equal(_name);
    expect(memo.message).to.equal(_msg);
  });

  it("should allow User to withdraw money", async () => {
    const owner = (await ethers.getSigners())[0];
    const initalbalance = await owner.getBalance();
    const txn = await contract.withDrawCoffeeMoney();
    await txn.wait();
    const finalbalance = await owner.getBalance();
  });

  it("should not allow other user to withdraw money", async () => {
    const newUser =( await ethers.getSigner())[2];
    try {
      await contract.withDrawCoffeeMoney({ from: newUser });
      assert(false, "Expected revert not received");
    } catch (error) {
      expect(error.message).to.include("revert");
    }
  });
});
