const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token contract", function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("Token");
    const [owner, addr1, addr2] = await ethers.getSigners();
    
    // 修复：移除 .deployed() 调用
    const hardhatToken = await Token.deploy();
    
    return { Token, hardhatToken, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct token name and symbol", async function () {
      const { hardhatToken } = await loadFixture(deployTokenFixture);
      expect(await hardhatToken.name()).to.equal("My Hardhat Token");
      expect(await hardhatToken.symbol()).to.equal("MBT");
    });

    it("Should have correct total supply", async function () {
      const { hardhatToken } = await loadFixture(deployTokenFixture);
      expect(await hardhatToken.totalSupply()).to.equal(1000000);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);
      
      // 验证初始余额
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(1000000);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
      
      // 转账测试
      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);
      
      // 验证转账后余额
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(999950);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // 尝试从零余额账户转账
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // 验证余额未变化
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should handle multiple transfers correctly", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
      
      // 第一次转账
      await hardhatToken.transfer(addr1.address, 100);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);
      
      // 第二次转账（从 addr1 到 addr2）
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
    });
  });
});