pragma solidity = 0.5.0;

contract SupplyChain {

    // Define 'owner'
    address owner;

    // Define a variable called 'upc' for Universal Product Code (UPC)
    uint  upc;

    // Define a variable called 'sku' for Stock Keeping Unit (SKU)
    uint  sku;

    // Define a public mapping 'wines' that maps the UPC to a wine.
    mapping (uint => Wine) wines;

    // Define a public mapping 'itemsHistory' that maps the UPC to an array of TxHash,
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping (uint => string[]) winesHistory;

    // Define enum 'GrapeState' with the following values:
    enum GrapeState
    {
        Harvested,  // 0
        ForSale,    // 1
        Sold,       // 2
        Shipped,    // 3
        Received    // 4
    }

    // Define enum 'WineState' with the following values:
    enum WineState
    {
        Produced,  // 0
        Packed,    // 1
        ForSale,   // 2
        Sold,      // 3
        Shipped,   // 4
        Received,  // 5
        Purchased   // 6
    }

    //TODO: set default states for wine and grapes

    // Define a struct 'Item' with the following fields:
    struct Wine {
        uint    sku;  // Stock Keeping Unit (SKU)
        uint    upc; // Universal Product Code (UPC), generated by the Producer, goes on the package, can be verified by the Consumer
        address ownerID;  // Metamask-Ethereum address of the current owner as the product moves through different stages

        address growerID; // Metamask-Ethereum address of the Grower
        string  growerName; // Grower Name
        string  growerInformation;  // Grower Information
        string  growerLatitude; // Grower plot Latitude
        string  growerLongitude;  // Grower plot Longitude

        address producerID; // Metamask-Ethereum address of the Producer
        string  producerName; // Producer Name
        string  producerInformation;  // Producer Information
        string  producerLatitude; // Producer Latitude
        string  producerLongitude;  // Producer Longitude

        uint    productID;  // Product ID potentially a combination of upc + sku
        string  productNotes; // Product Notes
        uint    productPrice; // Product Price

        GrapeState   grapeState;  // Grape State as represented in the enum above
        WineState   wineState;  // Product State as represented in the enum above

        address wholesalerID;  // Metamask-Ethereum address of the Wholesaler
        address retailerID; // Metamask-Ethereum address of the Retailer
        address consumerID; // Metamask-Ethereum address of the Consumer
    }


    constructor() public {

    }
}
