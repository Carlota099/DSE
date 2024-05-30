const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("myapp Contract", function () {
    let MyApp;
    let myApp;
    let owner;
    let addr1;
    let addr2;

    const addr1PrivateKey = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"; // Clave privada de addr1
    const addr2PrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // Clave privada de addr2

    beforeEach(async function () {
        MyApp = await ethers.getContractFactory("myapp");
        [owner, _] = await ethers.getSigners();
        myApp = await MyApp.deploy();
        await myApp.waitForDeployment();

        //test addresses provided by hardhat
        addr1 = new ethers.Wallet(addr1PrivateKey, ethers.provider);
        addr2 = new ethers.Wallet(addr2PrivateKey, ethers.provider);
    });

    it("Should deploy and set the right owner", async function () {
        expect(await myApp.owner()).to.equal(owner.address);
    });

    it("Should allow sending tips and retrieve them", async function () {
        const tipMessage = "Great service!";
        const tipName = "Alice";

        const tx = await myApp.connect(addr1).sendTip(tipName, tipMessage, { value: ethers.parseEther("1") });
        await tx.wait();

        const tips = await myApp.getTips();
        expect(tips.length).to.equal(1);
        expect(tips[0].name).to.equal(tipName);
        expect(tips[0].message).to.equal(tipMessage);
        expect(tips[0].from).to.equal(addr1.address);

        console.log(`Transaction Hash: ${tx.hash}, From: ${addr1.address}, To: ${owner.address}, Value: 1 ETH`);
    });

    it("Should revert if tip amount is zero", async function () {
        await expect(myApp.connect(addr1).sendTip("Alice", "Nice service", { value: 0 })).to.be.revertedWith("please, introduce a valid value");
    });

    it("Should emit NewTip event", async function () {
        const tipMessage = "Great service!";
        const tipName = "Alice";

        const tx = await myApp.connect(addr1).sendTip(tipName, tipMessage, { value: ethers.parseEther("1") });
        const receipt = await tx.wait();
        const block = await ethers.provider.getBlock(receipt.blockNumber);

        await expect(tx)
            .to.emit(myApp, "NewTip")
            .withArgs(tipName, tipMessage, block.timestamp, addr1.address);

        console.log(`Transaction Hash: ${tx.hash}, From: ${addr1.address}, To: ${owner.address}, Value: 1 ETH`);
    });

    it("Should transfer Ether to owner", async function () {
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
        const tx = await myApp.connect(addr1).sendTip("Alice", "Great service!", { value: ethers.parseEther("1") });
        await tx.wait();
        const finalOwnerBalance = await ethers.provider.getBalance(owner.address);

        expect(finalOwnerBalance).to.equal(initialOwnerBalance + (ethers.parseEther("1")));

        //console.log(`Transaction Hash: ${tx.hash}, From: ${addr1.address}, Value: 1 ETH`);
    });

    it("Should store the tip correctly", async function () {
        const tipMessage = "Great service!";
        const tipName = "Alice";
        const tx = await myApp.connect(addr1).sendTip(tipName, tipMessage, { value: ethers.parseEther("1") });
        const receipt = await tx.wait();
        const block = await ethers.provider.getBlock(receipt.blockNumber);

        const tips = await myApp.getTips();
        expect(tips.length).to.equal(1);
        expect(tips[0].name).to.equal(tipName);
        expect(tips[0].message).to.equal(tipMessage);
        expect(tips[0].from).to.equal(addr1.address);
        expect(tips[0].timestamp).to.equal(block.timestamp);

        console.log(`Transaction Hash: ${tx.hash}, From: ${addr1.address}, To: ${owner.address}, Value: 1 ETH`);
    });

    it("Should handle tips from multiple addresses", async function () {
        const tx1 = await myApp.connect(addr1).sendTip("Alice", "First tip", { value: ethers.parseEther("0.5") });
        await tx1.wait();
        const tx2 = await myApp.connect(addr2).sendTip("Bob", "Second tip", { value: ethers.parseEther("1") });
        await tx2.wait();

        const tips = await myApp.getTips();
        expect(tips.length).to.equal(2);
        expect(tips[0].name).to.equal("Alice");
        expect(tips[1].name).to.equal("Bob");

        console.log(`Transaction Hash: ${tx1.hash}, From: ${addr1.address}, To: ${owner.address}, Value: 0.5 ETH`);
        console.log(`Transaction Hash: ${tx2.hash}, From: ${addr2.address}, To: ${owner.address}, Value: 1 ETH`);
    });

    it("Should update owner's balance correctly after multiple tips", async function () {
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

        const tx1 = await myApp.connect(addr1).sendTip("Alice", "First tip", { value: ethers.parseEther("0.5") });
        await tx1.wait();
        const tx2 = await myApp.connect(addr2).sendTip("Bob", "Second tip", { value: ethers.parseEther("1") });
        await tx2.wait();

        const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
        const totalTips = ethers.parseEther("1.5");
        expect(finalOwnerBalance).to.equal(initialOwnerBalance+(totalTips));

        console.log(`Transaction Hash: ${tx1.hash}, From: ${addr1.address}, To: ${owner.address}, Value: 0.5 ETH`);
        console.log(`Transaction Hash: ${tx2.hash}, From: ${addr2.address}, To: ${owner.address}, Value: 1 ETH`);
    });
});

