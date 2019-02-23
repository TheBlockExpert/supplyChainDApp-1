pragma solidity = 0.5.0;
import "../wineaccesscontrol/ConsumerRole.sol";
import "../wineaccesscontrol/GrowerRole.sol";
import "../wineaccesscontrol/ProducerRole.sol";
import "../wineaccesscontrol/RetailerRole.sol";
import "../wineaccesscontrol/WholesalerRole.sol";
import "../winecore/Ownable.sol";


contract SupplyChain is
    GrowerRole,
    ProducerRole,
    WholeSalerRole,
    RetailerRole,
    ConsumerRole
{

    // Define 'owner'
    address payable owner;

    // Define a variable called 'upc' for Universal Product Code (UPC)
    uint  upc;

    // Define a variable called 'sku' for Stock Keeping Unit (SKU)
    uint  sku;

    // Define a variable called 'grapeID' for indentifying grapes.
    // The Wine Supply Chain Traceability GS1 Application Guideline
    // does not recommend the use of GTIN (Global Trade Item Number)
    // for the grapes as it is not yet a branded product
    // but we still need a way to uniquely identify the grapes.
    uint  grapeID;

    // Define a public mapping 'grapes' that maps the grapeID to a wine.
    mapping (uint => Grape) grapes;

    // Define a public mapping 'items' that maps the UPC to a wine.
    mapping (uint => Wine) items;

    // Define a public mapping 'itemsHistory' that maps the UPC to an array of TxHash,
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping (uint => string[]) itemsHistory;

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

    //TODO: set default states for grapes and items

    // Define a struct for grapes
    struct Grape {
        uint grapeId; // unique ID of grapes
        address payable ownerID;  // Metamask-Ethereum address of the current owner as the product moves through different stages
        address payable growerID; // Metamask-Ethereum address of the Grower
        string  growerName; // Grower Name
        string  growerInformation;  // Grower Information
        string  growerLatitude; // Grower plot Latitude
        string  growerLongitude;  // Grower plot Longitude
        uint    grapePrice; // Product Price
        GrapeState   grapeState;  // Grape State as represented in the enum above
        string  grapeVariety; // grape variety
        bool exist;
    }

    // Define a struct 'Item' with the following fields:
    struct Wine {
        uint    sku;  // Stock Keeping Unit (SKU)
        uint    upc; // Universal Product Code (UPC), generated by the Producer, goes on the package, can be verified by the Consumer
        address payable ownerID;  // Metamask-Ethereum address of the current owner as the product moves through different stages
        address payable producerID; // Metamask-Ethereum address of the Producer
        string  producerName; // Producer Name
        string  producerInformation;  // Producer Information
        string  producerLatitude; // Producer Latitude
        string  producerLongitude;  // Producer Longitude
        uint    productID;  // Product ID potentially a combination of upc + sku
        string  productNotes; // Product Notes
        uint    productPrice; // Product Price
        uint[] grapesIDs; // Array of grapes IDs
        WineState   wineState;  // Product State as represented in the enum above
        address payable wholesalerID;  // Metamask-Ethereum address of the Wholesaler
        address payable retailerID; // Metamask-Ethereum address of the Retailer
        address payable consumerID; // Metamask-Ethereum address of the Consumer
        bool exist; // use to see entry already exists in mapping
    }

    // Define events for grapes
    event GrapeHarvested(uint grapeId);
    event GrapeForSale(uint grapeId);
    event GrapeSold(uint grapeId);
    event GrapeShipped(uint grapeId);
    event GrapeReceived(uint grapeId);
    // Define events for wine
    event WineProduced(uint upc);
    event WinePacked(uint upc);
    event WineForSale(uint upc);
    event WineSold(uint upc);
    event WineShipped(uint upc);
    event WineReceived(uint upc);
    event WinePurchased(uint upc);

    // Define a modifer that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address);
        _;
    }

    // Define a modifier that checks if the paid amount is sufficient to cover the price
    modifier paidEnough(uint _price) {
        require(msg.value >= _price,
            "Unsufficient fund");
        _;
    }

    modifier checkGrapeValue(uint _grapeID) {
        _;
        uint _price = grapes[_grapeID].grapePrice;
        uint amountToReturn = msg.value - _price;
        msg.sender.transfer(amountToReturn);
    }

    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValue(uint _upc) {
        _;
        uint _price = items[_upc].productPrice;
        uint amountToReturn = msg.value - _price;
        items[_upc].ownerID.transfer(amountToReturn);
    }

    // Define a modifier that check if grape already exists.
    modifier grapeAlreadyExists(uint _grapeID) {
        Grape memory _grape = grapes[_grapeID];
        require(!_grape.exist, "Grape ID already exists.");
        _;
    }

    // Define a modifier that checks if an grapes.grapeState of a grapeID is Harvested
    modifier grapeHarvested(uint _grapeId) {
        require(grapes[_grapeId].grapeState == GrapeState.Harvested,
            "Grape is not yet harvested");
        _;
    }

    // Define a modifier that checks if an item.grapeState of a upc is ForSale
    modifier grapeForSale(uint _grapeId) {
        require(grapes[_grapeId].grapeState == GrapeState.ForSale,
            "Grape is not for sale");
        _;
    }

    // Define a modifier that checks if an item.grapeState of a upc is Sold
    modifier grapeSold(uint _grapeId) {
        require(grapes[_grapeId].grapeState == GrapeState.Sold,
            "Grape is not sold");
        _;
    }

    // Define a modifier that checks if an item.grapeState of a upc is Shipped
    modifier grapeShipped(uint _grapeId) {
        require(grapes[_grapeId].grapeState == GrapeState.Shipped,
            "Grape is not shipped");
        _;
    }

    // Define a modifier that checks if an grape.grapeState of a grapeID is Received
    modifier grapeReceived(uint _grapeId) {
        require(grapes[_grapeId].grapeState == GrapeState.Received,
        "The grapes have not been received yet");
        _;
    }

    // Define a modifier that check if grape already exists in items.
    modifier wineAlreadyExists(uint _upc) {
        Wine memory _wine = items[_upc];
        require(!_wine.exist, "Wine upc already exists.");
        _;
    }

    // Define a modifier that check if the producer owns the grapes used for making wine
    modifier wineProducerHasAndOwnsGrapes(uint[] memory _grapesID) {
        for (uint i=0; i<_grapesID.length; i++) {
            uint _grapeID = _grapesID[i];
            require(grapes[_grapeID].ownerID == msg.sender,
                "Producer does not own the grapes for making this wine");
            require(grapes[_grapeID].grapeState == GrapeState.Received,
                "Producer did not yet received all the grapes needed for this wine.");
        }
        _;
    }

    // Define a modifier that checks if an item.wineState of a upc is Produced
    modifier wineProduced(uint _upc) {
        require(items[_upc].wineState == WineState.Produced,
            "Wine is not yet produced");
        _;
    }

    // Define a modifier that checks if an item.wineState of a upc is Packed
    modifier winePacked(uint _upc) {
        require(items[_upc].wineState == WineState.Packed,
            "Wine is not yet packed");
        _;
    }

    // Define a modifier that checks if an item.wineState of a upc is ForSale
    modifier wineForSale(uint _upc) {
        require(items[_upc].wineState == WineState.ForSale,
            "Wine is not for sale");
        _;
    }

    // Define a modifier that checks if an item.wineState of a upc is Sold
    modifier wineSold(uint _upc) {
        require(items[_upc].wineState == WineState.Sold,
            "Wine is not sold");
        _;
    }

    // Define a modifier that checks if an item.wineState of a upc is Shipped
    modifier wineShipped(uint _upc) {
        require(items[_upc].wineState == WineState.Shipped,
            "Wine is not shipped");
        _;
    }

    // Define a modifier that checks if an item.wineState of a upc is Shipped
    modifier wineReceived(uint _upc) {
        require(items[_upc].wineState == WineState.Received,
            "Wine is not received");
        _;
    }

    // Define a modifier that checks if an item.wineState of a upc is Purchased
    modifier winePurchased(uint _upc) {
        require(items[_upc].wineState == WineState.Purchased,
            "Wine is not purchased");
        _;
    }

    // In the constructor set 'owner' to the address that instantiated the contract
    // and set 'sku' to 1
    // and set 'upc' to 1
    // grapeID to 1
    // the identifier are simplified here
    // as we should also use the client company prefix for generating UPC
    constructor() public payable {
        owner = msg.sender;
        sku = 1;
        upc = 1; // for simpicity we'll use this
        // GS1 guidelines said that UPC
        // applies to branded products only
        // so we use a simple ID
        grapeID = 1;
    }

    // Define a function 'kill' if required
    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }

    /////////////////////////
    /// GRAPES OPERATIONS ///
    /////////////////////////

    // Define a function 'harvestGrape' that allows a grower to mark grapes 'Harvested'
    function harvestGrapes(
        string memory _growerName,
        string memory _growerInformation,
        string memory _growerLatitude,
        string memory _growerLongitude,
        string memory _grapeVariery)
    public
    onlyGrower
    grapeAlreadyExists(grapeID)
    {
        // Add the new grapes
        uint _grapeID = grapeID;
        grapes[_grapeID] = Grape(
            grapeID,
            msg.sender,
            msg.sender,
            _growerName,
            _growerInformation,
            _growerLatitude,
            _growerLongitude,
            0,
            GrapeState.Harvested,
            _grapeVariery,
            true
        );
        // Increment grapeID
        grapeID = grapeID + 1;
        // Emit the appropriate event
        emit GrapeHarvested(_grapeID);
    }

    // Let a grower that owns havested grapes to put them for sale
    function addGrapesForSale(uint _grapeID, uint _grapePrice)
    public
    onlyGrower
    verifyCaller(grapes[_grapeID].ownerID)
    {
        Grape storage grape = grapes[_grapeID];
        grape.grapeState = GrapeState.ForSale;
        grape.grapePrice = _grapePrice;
        emit GrapeForSale(_grapeID);
    }

    function buyGrapes(uint _grapeID, uint _grapePrice)
    public
    payable
    onlyProducer
    grapeForSale(_grapeID)
    paidEnough(_grapePrice)
    checkGrapeValue(_grapeID)
    {
        Grape storage grape = grapes[_grapeID];
        require(_grapePrice == grape.grapePrice);
        grape.grapeState = GrapeState.Sold;
        grape.ownerID = msg.sender;
        grape.growerID.transfer(_grapePrice);
        emit GrapeSold(_grapeID);
    }

    function shipGrapes(uint _grapeID)
    public
    onlyGrower
    grapeSold(_grapeID)
    verifyCaller(grapes[_grapeID].growerID)
    {
        Grape storage grape = grapes[_grapeID];
        grape.grapeState = GrapeState.Shipped;
        emit GrapeShipped(_grapeID);
    }

    function receiveGrapes(uint _grapeID)
    public
    onlyProducer
    grapeShipped(_grapeID)
    verifyCaller(grapes[_grapeID].ownerID)
    {
        Grape storage grape = grapes[_grapeID];
        grape.grapeState = GrapeState.Received;
        emit GrapeReceived(_grapeID);
    }

    function fetchGrape(uint _grapeID) public view returns (
        uint grapeGrapeID,
        address payable ownerID,
        address payable growerID,
        string memory growerName,
        string memory growerInformation,
        string memory growerLatitude,
        string memory growerLongitude,
        uint grapePrice,
        GrapeState grapeState,
        string memory grapeVariety
    ) {
        Grape memory grape = grapes[_grapeID];
        grapeGrapeID = grape.grapeId;
        ownerID = grape.ownerID;
        growerID = grape.growerID;
        growerName = grape.growerName;
        growerInformation = grape.growerInformation;
        growerLatitude = grape.growerLatitude;
        growerLongitude = grape.growerLongitude;
        grapePrice = grape.grapePrice;
        grapeState = grape.grapeState;
        grapeVariety = grape.grapeVariety;
    }


    ///////////////////////
    /// WINE OPERATIONS ///
    //////////////////////

    function produceWine(
        string memory _producerName,
        string memory _producerInformation,
        string memory _producerLatitude,
        string memory _producerLongitude,
        string memory _productNotes,
        uint[] memory _grapesIDs,
        WineState _wineState
    )
    public
    onlyProducer
    wineProducerHasAndOwnsGrapes(_grapesIDs)
    wineAlreadyExists(upc)
    {
        uint _productID = sku + upc;
        uint _upc = upc;
        items[_upc] = Wine(
            sku,
            upc,
            msg.sender,
            msg.sender,
            _producerName,
            _producerInformation,
            _producerLatitude,
            _producerLongitude,
            _productID,
            _productNotes,
            0,
            _grapesIDs,
            _wineState,
            address(0),
            address(0),
            address(0),
            true
        );
        upc = upc + 1;
        sku = sku + 1;
        emit WineProduced(_upc);
    }

    function packWine(uint _upc)
    public
    onlyProducer
    wineProduced(_upc)
    verifyCaller(items[_upc].ownerID)
    {
        Wine storage wine = items[_upc];
        require(msg.sender == wine.producerID);
        wine.wineState = WineState.Packed;
        emit WinePacked(wine.upc);
    }


    function addWineForSale(uint _upc)
    public
    onlyProducer
    winePacked(_upc)
    verifyCaller(items[_upc].ownerID)
    {
        Wine storage wine = items[_upc];
        require(msg.sender == wine.producerID);
        wine.wineState = WineState.ForSale;
        emit WineForSale(wine.upc);
    }

    function buyWine(uint _upc)
    public
    onlyRetailer
    wineForSale(_upc)
    {
        Wine storage wine = items[_upc];
        wine.retailerID = msg.sender;
        wine.wineState = WineState.Sold;
        wine.ownerID = msg.sender;
        emit WineSold(_upc);
    }

    function shipWine(uint _upc)
    public
    onlyProducer
    wineSold(_upc)
    verifyCaller(items[_upc].producerID)
    {
        Wine storage wine = items[_upc];
        wine.wineState = WineState.Shipped;
        emit WineShipped(_upc);
    }

    function receiveWine(uint _upc)
    public
    onlyRetailer
    wineShipped(_upc)
    verifyCaller(items[_upc].ownerID)
    {
        Wine storage wine = items[_upc];
        wine.wineState = WineState.Received;
        emit WineReceived(_upc);
    }

    function purchaseWine(uint _upc)
    public
    onlyConsumer
    wineReceived(_upc)
    {
        Wine storage wine = items[_upc];
        wine.wineState = WineState.Purchased;
        wine.ownerID = msg.sender;
        emit WinePurchased(_upc);
    }

    // fetchWine - 3 functions - stack too deep compilation error
    function fetchWineOne(uint _upc) public view returns (
        uint wineSku,
        uint wineUpc,
        address payable ownerID,
        address payable producerID,
        uint productPrice,
        WineState wineState,
        address wholesalerID,
        address retailerID,
        address consumerID
    ) {
        Wine memory wine = items[_upc];
        wineSku = wine.sku;
        wineUpc = wine.upc;
        ownerID = wine.ownerID;
        producerID = wine.producerID;
        productPrice = wine.productPrice;
        wineState = wine.wineState;
        wholesalerID = wine.wholesalerID;
        retailerID = wine.retailerID;
        consumerID = wine.consumerID;
    }

    // fetchWineTwo
    function fetchWineTwo(uint _upc) public view returns (
        uint wineSku,
        uint wineUpc,
        string memory producerName,
        string memory producerInformation,
        string memory producerLatitude,
        string memory producerLongitude,
        uint productID,
        string memory productNotes,
        uint productPrice
    ) {
        Wine memory wine = items[_upc];
        wineSku = wine.sku;
        wineUpc = wine.upc;
        producerName = wine.producerName;
        producerInformation = wine.producerInformation;
        producerLatitude = wine.producerLatitude;
        producerLongitude = wine.producerLongitude;
        productID = wine.productID;
        productNotes = wine.productNotes;
        productPrice = wine.productPrice;
    }

    function fetchWineGrapes(uint _upc) public view returns (uint[] memory grapesIDs) {
        Wine memory wine = items[_upc];
        grapesIDs = wine.grapesIDs;
    }
}
