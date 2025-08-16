import { expect } from "chai";
import { ethers } from "hardhat";
import { Zutchi, MockZIRCUIT } from "../typechain-types";
import { token } from "../typechain-types/@openzeppelin/contracts";

describe("Zutchi", function () {
  // We define a fixture to reuse the same setup in every test.
  let zutchi: Zutchi;
  let zircuitToken: MockZIRCUIT;
  let owner: any;
  let user1: any;
  let user2: any;
  let user3: any;
  let user4: any;

  before(async () => {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();
    
    // Deploy ZIRCUIT token first
    const MockZIRCUITFactory = await ethers.getContractFactory("MockZIRCUIT");
    zircuitToken = await MockZIRCUITFactory.deploy();
    await zircuitToken.waitForDeployment();
    
    // Deploy Zutchi with ZIRCUIT token address
    const zutchiFactory = await ethers.getContractFactory("Zutchi");
    zutchi = await zutchiFactory.deploy(zircuitToken.target);
    await zutchi.waitForDeployment();
    
    // Give users some ZIRCUIT tokens
    await zircuitToken.transfer(user1.address, 10000);
    await zircuitToken.transfer(user2.address, 10000);
    await zircuitToken.transfer(user3.address, 10000);
    await zircuitToken.transfer(user4.address, 10000);
 });


  describe("Deployment", function () {
    it("Should have the correct name and symbol", async function () {
      expect(await zutchi.name()).to.equal("Zutchi");
      expect(await zutchi.symbol()).to.equal("ZUTCHI");
    });

    it("Should set the deployer as owner", async function () {
      expect(await zutchi.owner()).to.equal(owner.address);
    });

    it("Should start with 0 total supply", async function () {
      expect(await zutchi.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint NFTs", async function () {
      await zutchi.connect(owner).mint();
      expect(await zutchi.ownerOf(1)).to.equal(owner.address);
      expect(await zutchi.totalSupply()).to.equal(1);
      expect(await zutchi.getCurrentTokenId()).to.equal(1);
    });

    it("Should increment token ID correctly", async function () {
      await zutchi.connect(user1).mint();
      expect(await zutchi.ownerOf(2)).to.equal(user1.address);
      expect(await zutchi.totalSupply()).to.equal(2);
      expect(await zutchi.getCurrentTokenId()).to.equal(2);
    });

    it("Should allow anyone to mint NFTs", async function () {
      await zutchi.connect(user2).mint();
      expect(await zutchi.totalSupply()).to.equal(3);
      expect(await zutchi.getCurrentTokenId()).to.equal(3);
    });

    it("Should allow unlimited minting", async function () {
      // Mint several more tokens to ensure no supply limit
      for (let i = 0; i < 5; i++) {
        await zutchi.mint();
      }
      expect(await zutchi.totalSupply()).to.equal(8); // 3 from previous tests + 5 new ones
    });

    it("Should set parameters correctly", async function () {
      await zutchi.connect(user1).mint();
      const block = await ethers.provider.getBlockNumber();

      const attr = await zutchi.getZutchiAttributes(9);
      expect(attr.bornAtBlock).to.equal(block);
      expect(attr.energy).to.equal(ethers.parseEther("100")); // 100e18
      expect(attr.health).to.equal(100);
      expect(attr.level).to.equal(1);
      expect(attr.isBusy).to.equal(false);
      expect(attr.freeAtBlock).to.equal(0);
    });
  });

  describe("Sleeping", function () {
    it("Should allow owner to put zutchi to sleep", async function () {
      await zutchi.connect(owner).putToSleep(1, 100);
      const attr = await zutchi.getZutchiAttributes(1);
      expect(attr.isBusy).to.equal(true);
    });

    it("Should not allow to put zutchi to sleep if it is busy", async function () {
      await zutchi.connect(user1).putToWork(2, 20);
      await expect(zutchi.connect(user1).putToSleep(2, 100)).to.be.revertedWith("isBusy");
    });

    it("Should only allow owner to put zutchi to sleep", async function () {
      await expect(zutchi.connect(user2).putToSleep(1, 100)).to.be.revertedWith("notOwner");
    });

    it("Should allow to put zutchi to sleep after it is not busy", async function () {
      for (let i = 0; i < 101; i++) {
        await ethers.provider.send("evm_mine", []);
      }
      await zutchi.connect(user2).putToSleep(3, 100);
      

      for (let i = 0; i < 101; i++) {
        await ethers.provider.send("evm_mine", []);
      }
            
      expect(await zutchi.connect(user2).putToSleep(3, 100)).not.to.be.reverted;
      const attr = await zutchi.getZutchiAttributes(3);
      expect(attr.isBusy).to.equal(true);
    });
  });

  describe("Working", function () {
    it("Should allow owner to put zutchi to work", async function () {
      await mineBlocks(120);
      await zutchi.connect(user1).putToWork(2, 10);
      const attr = await zutchi.getZutchiAttributes(2);
      expect(attr.isBusy).to.equal(true);
    });

    it("Should not allow to put zutchi to work if it is busy", async function () {
      await zutchi.connect(user3).mint();
      await zutchi.connect(user3).putToSleep(10, 100);
      await expect(zutchi.connect(user3).putToWork(10, 50)).to.be.revertedWith("isBusy");
    });

    it("Should only allow owner to put zutchi to work", async function () {
      await expect(zutchi.connect(user4).putToWork(1, 100)).to.be.revertedWith("notOwner");
    });

    it("Should allow to put zutchi to work after it is not busy", async function () {
      await mineBlocks(101);
      await zutchi.connect(user3).putToWork(10, 50);

      for (let i = 0; i < 101; i++) {
        await ethers.provider.send("evm_mine", []);
      }

      expect(await zutchi.connect(user3).putToWork(10, 50)).not.to.be.reverted;
      const attr = await zutchi.getZutchiAttributes(3);
      expect(attr.isBusy).to.equal(true);
    });
  });

  describe("Feeding", function () {
    it("Should allow owner to feed zutchi with ZIRCUIT tokens", async function () {
      await zutchi.connect(user1).mint();
      const tokenId = await zutchi.getCurrentTokenId();


      // Approve spending
      await zircuitToken.connect(user1).approve(zutchi.target, 10);
      
      // Feed the zutchi
      await zutchi.connect(user1).feed(tokenId, 10);
      
      const attr = await zutchi.getZutchiAttributes(tokenId);
      expect(attr.health).to.equal(100); // Capped at 100
      expect(attr.energy).to.equal(ethers.parseEther("100")); // 100 + 10 = 110e18
      expect(attr.nutrition).to.equal(60); // Base 50 + 10
    });
    
    it("Should not allow non-owner to feed zutchi", async function () {
      await expect(zutchi.connect(user2).feed(1, ethers.parseEther("10"))).to.be.revertedWith("notOwner");
    });
    
    it("Should not allow feeding busy zutchi", async function () {
      await zutchi.connect(user1).putToWork(11, 50);
      await expect(zutchi.connect(user1).feed(11, 1)).to.be.revertedWith("isBusy");
    });
  });

  describe("Nutrition Effects", function () {
    it("Should apply nutrition multiplier to work efficiency", async function () {
      await zutchi.connect(user4).mint();
      const tokenId = 12;
      await mineBlocks(101);

      await zutchi.connect(user4).putToWork(tokenId, 50);
      await zutchi.connect(user3).putToSleep(10, 30);

  
      await mineBlocks(101);
      
      // Feed to increase nutrition
      await zircuitToken.connect(user4).approve(zutchi.target, 10);
      await zutchi.connect(user4).feed(tokenId, 10); // High nutrition

      // Put to work
      await zutchi.connect(user3).putToWork(10, 20);
      await zutchi.connect(user4).putToWork(tokenId, 20);

      await mineBlocks(51);
      
      const attrHN = await zutchi.getZutchiAttributes(tokenId);
      const attrLN = await zutchi.getZutchiAttributes(10);
      // With high nutrition, energy loss should be reduced
      expect(attrHN.energy).to.be.gt(attrLN.energy);
    });

    it("Should apply nutrition multiplier to sleep efficiency", async function () {
      await zutchi.connect(user1).mint();
      await zutchi.connect(user2).mint();


      await zutchi.connect(user1).putToWork(13, 100);
      await zutchi.connect(user2).putToWork(14, 100);

      await mineBlocks(101);

      await zircuitToken.connect(user1).approve(zutchi.target, 50);
 

      await zutchi.connect(user1).feed(13, 30);

      // Put to sleep
      await zutchi.connect(user1).putToSleep(13, 20);
      await zutchi.connect(user2).putToSleep(14, 20);



      const A1 = await zutchi.getZutchiAttributes(13);
      const A2 = await zutchi.getZutchiAttributes(14);
      
      expect(A1.energy).to.be.gt(A2.energy);
    });
  });

  describe("Leveling", function () {
    it("Should start at level 1", async function () {
        await zutchi.connect(user1).mint();
        const attr = await zutchi.getZutchiAttributes(15);
        expect(attr.level).to.equal(1);
    })

    it("Sleeping should give half XP", async function () {
      await zutchi.connect(user1).putToSleep(15, 6);
      const attr = await zutchi.getZutchiAttributes(15);

      expect(attr.level).to.equal(2);
    })
  })

  describe("Social", function () {
    it("Should send a fren request", async function () {
      await zutchi.connect(owner).addFren(1, 2);
      const fren = await zutchi.getZutchiAttributes(2)
      expect(fren.potentialFrens[0]).to.equal(1);
    })

    it("Should display the fren request", async function () {
      const PF = await zutchi.connect(user1).getPotetionalFrens(2);
      expect(PF[0]).to.equal(1);
    })

    it("Should accept the fren request", async function () {
      const PF = await zutchi.connect(user1).getPotetionalFrens(2);
      const success = await zutchi.connect(user1).acceptFren(2, Number(PF[0]))
      const fren = await zutchi.getZutchiAttributes(1)
      expect(fren.frens[0]).to.equal(2);
    })

    it("Should display frens", async function () {
      const PF = await zutchi.connect(user1).getFrens(2);
      expect(PF[0]).to.equal(1)
    })

    it("Should decline the fren request", async function () {
      await zutchi.connect(user2).addFren(3, 4);

      const PF = await zutchi.connect(user2).getPotetionalFrens(4);
      const success = await zutchi.connect(user2).declineFren(2, Number(PF[0]))
      const fren = await zutchi.getZutchiAttributes(1)
      expect(fren.potentialFrens.length).to.equal(0);
      expect(fren.frens.length).to.equal(1);
    })
  })

  
  describe("Hunger", function () {
    it("Should not allow to work or sleep while starving", async function () {
      await mineBlocks(300001);
      await expect(zutchi.connect(user1).putToSleep(13, 100)).to.be.revertedWith("hungry")
    })
  })
  
  describe("Ownership", function () {
    it("Should allow owner to burn tokens", async function () {
      const initialSupply = await zutchi.totalSupply();
      await zutchi.burn(1);
      expect(await zutchi.totalSupply()).to.equal(initialSupply - 1n);
    });

    it("Owner can withdraw", async function () {
      await expect(zutchi.connect(owner).withdrawZRC()).not.to.be.reverted;
    })

    it("Only Owner can withdraw", async function() {
      await expect(zutchi.connect(user1).withdrawZRC()).to.be.revertedWith("notOwner");
    })
  });

  

  describe("Base URI", function () {
    it("Should allow owner to set base URI", async function () {
      const newBaseURI = "https://api.example.com/metadata/";
      await zutchi.setBaseURI(newBaseURI);
      // Note: _baseURI() is internal, so we can't test it directly
      // But we can verify the event was emitted
    });

    
  });
});

async function mineBlocks(n: number) {
  for (let i = 0; i < n; i++) {
    await ethers.provider.send("evm_mine", []);
  }
}
