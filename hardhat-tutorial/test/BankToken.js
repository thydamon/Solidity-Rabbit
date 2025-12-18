const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("BankToken contract", function() {
    // 定义将在测试中使用的变量
    let Token, token, TokenBank, bank, owner, addr1, addr2;
    let tokenAddress, bankAddress;

    // `beforeEach` 会在每个测试用例(`it`)运行前执行
    beforeEach(async function() {
        // 1、获取合约工厂
        Token = await ethers.getContractFactory("BaseERC20");
        TokenBank = await ethers.getContractFactory("BankToken");

        // 2、获取测试账户
        [owner, addr1, addr2] = await ethers.getSigners();

        // 3、部署 Token 合约
        token = await Token.deploy();  // 发行 1000 个代币
        await token.waitForDeployment();
        tokenAddress = await token.getAddress();

        // 4、部署 BankToken 合约，并传入 Token 合约地址
        bank = await TokenBank.deploy();
        await bank.waitForDeployment();
        bankAddress = await bank.getAddress();

        // 给 addr1 发一些代币用于测试（否则 addr1 没有余额无法 transferFrom）
        await token.transfer(addr1.address, ethers.parseEther("200"));

        // 5、将部分代币转账到 BankToken 合约中，作为初始存款
        await token.transfer(bankAddress, ethers.parseEther("500"));  // 转账 500 个代币到银行合约
    })

    describe("Deposited", function() {
        it("Should correctly deposit tokens and update balances", async function() {
            const depositAmount = ethers.parseEther("100");

            // 步骤1：用户 addr1 授权 BankToken 合约可以花费其代币
            // 使用在 beforeEach 中缓存的地址变量，避免直接访问 contract.address（可能为 undefined）
            await token.connect(addr1).approve(bankAddress, depositAmount);

            // 步骤2：验证授权成功
            const allowance = await token.allowance(addr1.address, bankAddress);
            expect(allowance).to.equal(depositAmount);

            // 步骤3：用户 addr1 存款
            // 只断言事件被触发（不在 withArgs 中传入回调或未定义的属性），然后检查代币余额变化
            await expect(bank.connect(addr1).deposit(tokenAddress, depositAmount))
                .to.emit(bank, "Deposited");

            // 存款后：addr1 余额应减少，银行合约余额应增加
            expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("100")); // 200 - 100
            expect(await token.balanceOf(bankAddress)).to.equal(ethers.parseEther("600")); // 500 + 100
        })

        it("Should fail if deposit amount is zero", async function() {
            await token.connect(addr1).approve(bankAddress, ethers.parseEther("100"));

            // 尝试存款 0 个代币，应当失败
            await expect(
                bank.connect(addr1).deposit(tokenAddress, 0)
            ).to.be.revertedWith("Amount must be greater than zero");
        });

        it("Should fail if token address is zero", async function() {
            // ethers v6 doesn't expose `constants.AddressZero`; use `ethers.ZeroAddress` or fallback literal
            const zeroAddress = ethers.constants?.AddressZero ?? ethers.ZeroAddress ?? "0x0000000000000000000000000000000000000000";

            // 尝试使用零地址存款，应当失败
            await expect(
                bank.connect(addr1).deposit(zeroAddress, ethers.parseEther("100"))
            ).to.be.revertedWith("Invalid token address");
        });

    })


})