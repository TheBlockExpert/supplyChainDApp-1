var SupplyChain = artifacts.require('SupplyChain');

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1;
    var upc = 1;
    const ownerID = accounts[0];
    const growerID = accounts[1];

    const growerFarmName = "Granazzi";
    const growerFarmInformation = "Valpolicella";
    const growerFarmLatitude = "45.491084";
    const growerFarmLongitude = "10.770316";

    const producerFarmName = "Valpolinazzi";
    const producerFarmInformation = "Valpolicella";
    const producerFarmLatitude = "45.486297";
    const producerFarmLongitude = "10.774519";

    var productID = sku + upc;
    const productNotes = "Award winning Wine";

    const productPrice = web3.utils.toWei("1", "ether");

    var grapeState = 0;
    var wineState = 0;

    const wholesalerID = accounts[3];
    const retailerID = accounts[4];
    const consumerID = accounts[5];

    const emptyAddress = '0x00000000000000000000000000000000000000';

    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: accounts[0] ", accounts[0]);
    console.log("Grower: accounts[1] ", accounts[1]);
    console.log("Producer: accounts[2] ", accounts[2]);
    console.log("Wholesaler: accounts[3] ", accounts[3]);
    console.log("Retailer: accounts[4] ", accounts[3]);
    console.log("Consumer: accounts[5] ", accounts[4]);

    // 1st Test
    it("Testing smart contract function harvestGrape() that allows a grower to harvest grapes", async() => {
        const supplyChain = await SupplyChain.deployed();

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Watch the emitted event Harvested()
        var event = supplyChain.Harvested()
        await event.watch((err, res) => {
            eventEmitted = true;
        });

        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.harvestGrape(upc,
            originFarmerID,
            originFarmName,
            originFarmInformation,
            originFarmLatitude,
            originFarmLongitude,
            productNotes
        );

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        assert.equal(true, false, 'Incomplete test');
    })

    // 2nd Test
    it("Testing smart contract function addGrapesForSale() that allows a grower to sell grapes", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 3rd
    it("Testing smart contract function buyGrapes() that allows a producer to buy grapes", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 4th
    it("Testing smart contract function shipGrapes() that allows a grower to ship grapes", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 5th
    it("Testing smart contract function receiveGrapes() that allows a producer to receive grapes", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 6th
    it("Testing smart contract function produceWine() that allows a producer to produce wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 7th
    it("Testing smart contract function packWine() that allows a producer to pack wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 8th
    it("Testing smart contract function addWineForSale() that allows a producer to sell wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 9th
    it("Testing smart contract function buyWine() that allows a wholesaler to buy wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 10th
    it("Testing smart contract function shipWine() that allows a producer to ship wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 11th
    it("Testing smart contract function receiveWine() that allows a retailer to receive wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 12th
    it("Testing smart contract function purchaseWine() that allows a consumer to purchase wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });
});