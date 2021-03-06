App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    grapeID: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    //
    grapeOwnerID: "0x0000000000000000000000000000000000000000",
    growerID: "0x0000000000000000000000000000000000000000",
    growerName: null,
    growerInformation: null,
    growerLatitude: null,
    growerLongitude: null,
    grapePrice: 0,
    grapeVariety: null,
    grapeState: null,

    // Wine
    itemPrice: 0,
    producerID: "0x0000000000000000000000000000000000000000",
    wholesalerID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",
    wineOwnerID: "0x0000000000000000000000000000000000000000",
    producerName: null,
    producerInformation: null,
    producerLatitude: null,
    producerLongitude: null,
    itemState: null,
    itemInformation: null,
    itemID: null,
    grapesIDs: [],

    grapeStates: [
        "Harvested",  // 0
        "ForSale",    // 1
        "Sold",       // 2
        "Shipped",    // 3
        "Received"    // 4
    ],
    wineStates: [
        "Produced",  // 0
        "Packed",    // 1
        "ForSale",   // 2
        "Sold",      // 3
        "Shipped",   // 4
        "Received",  // 5
        "Purchased"   // 6
    ],

    castGrapesIDs: function(arrIDs) {
        const castArr = arrIDs.toString().split(',').map((x) => {
            return parseInt(x);
        });
        return castArr;
    },

    resetGrapeForm: function() {
        $("#grapeID").val("");
        $("#grapeOwnerID").val("");
        $("#growerID").val("");
        $("#growerName").val("");
        $("#growerInformation").val("");
        $("#growerLatitute").val("");
        $("#growerLongitude").val("");
        $("#grapeVariety").val("");
        $("#grapePrice").val("");
        $("#grapeState").val("");
        App.setFieldReadOnly();
    },

    resetWineForm: function () {
        $("#itemSKU").val("");
        $("#itemUPC").val("");
        $("#itemOwnerID").val("");
        $("#producerID").val("");
        $("#producerName").val("");
        $("#producerInformation").val("");
        $("#producerLatitute").val("");
        $("#producerLongitude").val("");
        $("#itemInformation").val("");
        $("#itemPrice").val("");
        $("#itemID").val("");
        $("#itemState").val("");
        $("#wholesalerID").val("");
        $("#retailerID").val("");
        $("#consumerID").val("");
        $("#grapesIDs").val("");
        App.setFieldReadOnly();
    },

    setFieldReadOnly: function () {
        // GRAPES
        ["Harvested"].indexOf($("#grapeState").val()) > -1 ?
            $("#grapePrice").prop('readonly', false) : $("#grapePrice").prop('readonly', true);
        if ($("#grapeState").val() === "") {
            $("#growerName").prop('readonly', false);
            $("#growerLatitute").prop('readonly', false);
            $("#growerLongitude").prop('readonly', false);
            $("#grapeVariety").prop('readonly', false);
            $("#growerInformation").prop('readonly', false);
        }else{
            $("#growerName").prop('readonly', true);
            $("#growerLatitute").prop('readonly', true);
            $("#growerLongitude").prop('readonly', true);
            $("#grapeVariety").prop('readonly', true);
            $("#growerInformation").prop('readonly', true);
        }
        // WINE
        ["", "Produced", "ForSale", "Received", "Purchased", "Sold"]
                .indexOf($("#itemState").val()) > -1 ?
            $("#itemPrice").prop('readonly', true)
        : $("#itemPrice").prop('readonly', false);

        if ($("#itemState").val() === "") {
            $("#producerName").prop('readonly', false);
            $("#producerLatitute").prop('readonly', false);
            $("#producerLongitude").prop('readonly', false);
            $("#producerInformation").prop('readonly', false);
            $("#itemInformation").prop('readonly', false);
            $("#grapesIDs").prop('readonly', false);
        }else{
            $("#producerName").prop('readonly', true);
            $("#producerLatitute").prop('readonly', true);
            $("#producerLongitude").prop('readonly', true);
            $("#producerInformation").prop('readonly', true);
            $("#itemInformation").prop('readonly', true);
            $("#grapesIDs").prop('readonly', true);
        }
    },

    clearAccountFormID: function() {
        $("#addressID").val("");
    },

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {

        // ROLES
        App.addressID = $("#addressID").val();
        App.roleType = $("#roleType").val();

        // GRAPES
        App.grapeID = $("#grapeID").val();
        App.grapeOwnerID = $("#grapeOwnerID").val();
        App.growerID = $("#growerID").val();
        App.growerName = $("#growerName").val();
        App.growerInformation = $("#growerInformation").val();
        App.growerLatitude = $("#growerLatitute").val();
        App.growerLongitude = $("#growerLongitude").val();
        App.grapeVariety = $("#grapeVariety").val();
        App.grapePrice = $("#grapePrice").val();

        // Wines
        App.sku = $("#itemSKU").val();
        App.upc = $("#itemUPC").val();
        App.itemOwnerID = $("#itemOwnerID").val();
        App.producerID = $("#producerID").val();
        App.producerName = $("#producerName").val();
        App.producerInformation = $("#producerInformation").val();
        App.producerLatitude = $("#producerLatitute").val();
        App.producerLongitude = $("#producerLongitude").val();
        App.itemInformation = $("#itemInformation").val();
        App.itemPrice = $("#itemPrice").val();
        App.itemID = $("#itemID").val();
        App.itemState = $("#itemState").val();
        App.wholesalerID = $("#wholesalerID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();
        App.grapesIDs = $("#grapesIDs").val();

        console.log(
            App.sku,
            App.upc,
            App.grapeOwnerID,
            App.growerID,
            App.growerName,
            App.growerInformation,
            App.growerLatitude,
            App.growerLongitude,
            App.grapePrice,
            App.grapeVariety,
            App.grapeState,
            // Wine
            App.itemPrice,
            App.producerID,
            App.wholesalerID,
            App.retailerID,
            App.consumerID,
            App.wineOwnerID,
            App.producerName,
            App.producerInformation,
            App.producerLatitude,
            App.producerLongitude,
            App.itemState,
            App.itemInformation,
            App.itemID,
            App.wineGrapesIDs,
        );
        App.setFieldReadOnly();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';

        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            App.fetchEvents();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();
        App.getMetaskAccountID();
        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.addRole(event);
                break;
            case 2:
                return await App.renounceRole(event);
                break;
            case 3:
                return await App.fetchGrape(event);
                break;
            case 4:
                return await App.harvestGrapes(event);
                break;
            case 5:
                return await App.addGrapeForSale(event);
                break;
            case 6:
                return await App.buyGrapes(event);
                break;
            case 7:
                return await App.shipGrapes(event);
                break;
            case 8:
                return await App.receiveGrapes(event);
                break;
            case 9:
                App.resetGrapeForm();
                break;
            case 10:
                return await App.fetchWine(event);
                break;
            case 11:
                return await App.produceWine(event);
                break;
            case 12:
                return await App.packWine(event);
                break;
            case 13:
                return await App.addWineForSale(event);
                break;
            case 14:
                return await App.buyWine(event);
                break;
            case 15:
                return await App.shipWine(event);
                break;
            case 16:
                return await App.receiveWine(event);
                break;
            case 17:
                return await App.purchaseWine(event);
                break;
            case 18:
                App.resetWineForm();
                break;
        }
    },

    addRole: function(event) {
        event.preventDefault();
        App.readForm();
        if (!App.addressID || App.roleType === "") {
            alert("Insert a valid address and select a role type.")
        }else {
            App.contracts.SupplyChain.deployed().then(async function(instance) {
                switch(App.roleType) {
                    case "GROWER":
                        return await instance.addGrower(App.addressID);
                        break;
                    case "PRODUCER":
                        return await instance.addProducer(App.addressID);
                        break;
                    case "WHOLESALER":
                        return await instance.addWholesaler(App.addressID);
                        break;
                    case "RETAILER":
                        return await instance.addRetailer(App.addressID);
                        break;
                    case "CONSUMER":
                        return await instance.addConsumer(App.addressID);
                        break;
                    default:
                        // should not get there but
                        throw Error("You need to select a role type");
                        break;
                }
            }).then((result) => {
                App.clearAccountFormID();
                console.log(result);
            }).catch(function(err) {
                console.log(err.message);
            });
        }

    },

    renounceRole: function(event) {
        event.preventDefault();
        App.readForm();
        if (App.roleType === "") {
            alert("Select a role type.")
        }else {
            var goAhead = confirm("You are about to renounce to your role." +
                "This might affect your ability to interact with this app.");
            if (goAhead) {
                App.contracts.SupplyChain.deployed().then(async function(instance) {
                    switch(App.roleType) {
                        case "GROWER":
                            return await instance.renounceGrower(App.getMetaskAccountID());
                            break;
                        case "PRODUCER":
                            return await instance.renounceProducer(App.getMetaskAccountID());
                            break;
                        case "WHOLESALER":
                            return await instance.renounceWholesaler(App.getMetaskAccountID());
                            break;
                        case "RETAILER":
                            return await instance.renounceRetailer(App.getMetaskAccountID());
                            break;
                        case "CONSUMER":
                            return await instance.renounceConsumer(App.getMetaskAccountID());
                            break;
                        default:
                            // should not get there but
                            throw Error("You need to select a role type");
                            break;
                    }
                }).then((result) => {
                    console.log(result);
                }).catch(function(err) {
                    console.log(err.message);
                });
            }
        }
    },

    fetchGrape: function(event) {
        event.preventDefault();
        App.readForm();
        if (!parseInt(App.grapeID)) {
            alert("Please insert a grape ID");
        } else {
            App.contracts.SupplyChain.deployed().then(async (instance) => {

                const result = await instance.fetchGrape(App.grapeID);
                if (result[0] == 0) {
                    alert("Unknown grape ID");
                } else {
                    $('#grapeID').val(result[0]);
                    $('#grapeOwnerID').val(result[1]);
                    $('#growerID').val(result[2]);
                    $('#growerName').val(result[3]);
                    $('#growerInformation').val(result[4]);
                    $('#growerLatitute').val(result[5]);
                    $('#growerLongitude').val(result[6]);
                    $('#grapePrice').val(web3.fromWei(result[7].toString(), "ether"));
                    $('#grapeState').val(App.grapeStates[result[8]]);
                    $('#grapeVariety').val(result[9]);
                    App.setFieldReadOnly();
                }
                console.log(result);

            }).catch(function(err) {
                console.log(err.message);
            });
        }
    },

    // GRAPES
    harvestGrapes: function(event) {
        event.preventDefault();
        App.readForm();
        if (
            !App.growerName || !App.growerLatitude || !App.growerLongitude
            || !App.growerInformation || !App.grapeVariety
        ) {
            alert("Make sure to provide a grower name, latitude, longitude, information and " +
                "a grape variety.")
        } else {
            var goAhead = confirm("You are about to harvest some grapes. Please confirm " +
                "the information are correct.");
            if (goAhead) {
                App.contracts.SupplyChain.deployed().then(async function(instance) {
                    const result = await instance.harvestGrapes(
                        App.growerName,
                        App.growerInformation,
                        App.growerLatitude,
                        App.growerLongitude,
                        App.grapeVariety
                    );
                    console.log('harvestGrapes', result);
                }).catch(function(err) {
                    console.log(err.message);
                });
            }
        }
    },

    addGrapeForSale: function(event) {
        event.preventDefault();
        App.readForm();
        if (App.grapePrice <= 0) {
            alert("Please enter a valid price in ETHER!");
        }else{
            var goAhead = confirm("Are you sure the given price is correct?");
            if (goAhead) {
                App.contracts.SupplyChain.deployed().then(async function(instance) {
                    const _grapePrice = await web3.toWei(App.grapePrice, "ether");
                    const result = await instance.addGrapesForSale(App.grapeID, _grapePrice);
                    console.log('addGrapesForSale',result);
                }).catch(function(err) {
                    console.log(err.message);
                });
            }
        }
    },

    buyGrapes: function(event) {
        event.preventDefault();
        App.readForm();
        var goAhead = confirm(`Are you sure you want to buy these grapes for ${App.grapePrice} ETH?`);
        if (goAhead) {
            App.contracts.SupplyChain.deployed().then(async function(instance) {
                const value = await web3.toWei(App.grapePrice, "ether");
                const result = await instance.buyGrapes(App.grapeID,
                    {from: App.getMetaskAccountID(), value: value}
                );
                console.log('buyGrapes', result);
            }).catch(function(err) {
                console.log(err.message);
            });
        }
    },

    shipGrapes: function(event) {
        event.preventDefault();
        App.readForm();
        App.contracts.SupplyChain.deployed().then(async function(instance) {
            const result = instance.shipGrapes(App.grapeID);
            console.log(result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveGrapes: function(event) {
        event.preventDefault();
        App.readForm();
        App.contracts.SupplyChain.deployed().then(async function(instance) {
            const result =  instance.receiveGrapes(App.grapeID);
            console.log('shipGrapes',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchWine: function(event) {
        event.preventDefault();
        App.readForm();
        if (!parseInt(App.upc)) {
            alert(`Please insert an UPC code`);
        } else {
            App.contracts.SupplyChain.deployed().then(async (instance) => {
                const result = await instance.fetchWineOne(App.upc);
                const res = await  instance.fetchWineTwo(App.upc);
                if (result[0] == 0) {
                    alert("Unknown UPC");
                } else {
                    $('#itemSKU').val(result[0]);
                    $('#itemUPC').val(result[1]);
                    $('#itemOwnerID').val(result[2]);
                    $('#producerID').val(result[3]);
                    $('#itemPrice').val(web3.fromWei(result[4], "ether"));
                    $('#itemState').val(App.wineStates[result[5]]);
                    $('#wholesalerID').val(result[6]);
                    $('#retailerID').val(result[7]);
                    $('#consumerID').val(result[8]);
                }
                console.log(result);
                if (res[0] == 0) {
                    console.log("Unknown UPC in fetchWineTwo");
                } else {
                    $('#producerName').val(res[1]);
                    $('#producerInformation').val(res[2]);
                    $('#producerLatitute').val(res[3]);
                    $('#producerLongitude').val(res[4]);
                    $('#itemID').val(res[5]);
                    $('#itemInformation').val(res[6]);
                    $('#itemPrice').val(web3.fromWei(res[7], "ether"));
                    $('#grapesIDs').val(res[8].toString());
                }
                console.log(res);
                // set the readonly fields
                App.setFieldReadOnly();
            }).catch(function(err) {
                console.log(err.message);
            });
        }
    },

    produceWine: function(event) {
        event.preventDefault();
        App.readForm();
        if (
            !App.producerName || !App.producerLatitude || !App.producerLongitude
            || !App.itemInformation || !App.grapesIDs || !App.producerInformation
        ) {
            alert("Make sure to provide a producer name, latitude, longitude, information and " +
                "at least the ID of one grape you own and an item description.")
        } else {
            var goAhead = confirm("You are about to produce some awesome wine. Please confirm " +
                "the information are correct.")
            if (goAhead) {
                App.contracts.SupplyChain.deployed().then(async function(instance) {
                    const arrIds = App.castGrapesIDs(App.grapesIDs);
                    const result = await instance.produceWine(
                        App.producerName,
                        App.producerInformation,
                        App.producerLatitude,
                        App.producerLongitude,
                        App.itemInformation,
                        arrIds
                    );
                    console.log('produceWine',result);
                }).catch(function(err) {
                    console.log(err.message);
                });
            }
        }
    },

    packWine: function(event) {
        event.preventDefault();
        App.readForm();
        App.contracts.SupplyChain.deployed().then(async function(instance) {
            const result = await instance.packWine(App.upc);
            console.log('packWine',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addWineForSale: function(event) {
        event.preventDefault();
        App.readForm();
        if (App.itemPrice <= 0) {
            alert("Please enter a valid price in ETHER!");
        }else {
            var goAhead = confirm("Are you sure the given price is correct?");
            if (goAhead) {
                App.contracts.SupplyChain.deployed().then(async function (instance) {
                    const _price = web3.toWei(App.itemPrice, "ether");
                    const result = await instance.addWineForSale(App.upc, _price);
                    console.log('addWineForSale', result);
                }).catch(function (err) {
                    console.log(err.message);
                });
            }
        }
    },

    buyWine: function(event) {
        event.preventDefault();
        App.readForm();
        var goAhead = confirm(`Are you sure you want to buy the wine for ${App.itemPrice} ETH?`);
        if (goAhead) {
            App.contracts.SupplyChain.deployed().then(async function(instance) {
                const _value = web3.toWei(App.itemPrice, "ether");
                const result = await instance.buyWine(
                    App.upc, {from: App.getMetaskAccountID(), value: _value});
                console.log('buyWine',result);
            }).catch(function(err) {
                console.log(err.message);
            });
        }
    },

    shipWine: function(event) {
        event.preventDefault();
        App.readForm();
        App.contracts.SupplyChain.deployed().then(async function(instance) {
            const result = await instance.shipWine(App.upc);
            console.log('shipWine',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveWine: function(event) {
        event.preventDefault();
        App.readForm();
        const goAhead = confirm(`Did you update the item price for retail?`);
        if (goAhead) {
            App.contracts.SupplyChain.deployed().then(async function (instance) {
                const _price = web3.toWei(App.itemPrice, "ether");
                const res = await  instance.receiveWine(App.upc, _price);
                console.log('receiveWine', result);
            }).catch(function (err) {
                console.log(err.message);
            });
        }
    },

    purchaseWine: function(event) {
        event.preventDefault();
        App.readForm();
        const goAhead = confirm(`Are you sure you want to purchase the wine for ${App.itemPrice} ETH?`);
        if (goAhead) {
            App.contracts.SupplyChain.deployed().then(async function(instance) {
                const _price = web3.toWei(App.itemPrice, "ether");
                const result = await instance.purchaseWine(App.upc,
                    {from: App.getMetaskAccountID(), value: _price});
                console.log('purchaseWine',result);
            }).catch(function(err) {
                console.log(err.message);
            });
        }
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                    App.contracts.SupplyChain.currentProvider,
                    arguments
                );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
            var events = instance.allEvents(function(err, log){
                console.log(log.args[0]);
                try {
                    const _grapeID = log.args.grapeId;
                    if(_grapeID) {
                        $("#grapeID").val(_grapeID);
                        $("#grapeFetch").click();
                    }
                }catch(err){
                    console.log(err);
                }
                try {
                    const _upc = log.args.upc;
                    if(_upc) {
                        $("#itemUPC").val(_upc);
                        $("#wineFetch").click();
                    }
                }catch(err){
                    console.log(err);
                }
                if (!err) {
                    $("#allEvents").show();
                    $("#ftc-events").prepend('<li>> <b>' + new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit', second:'2-digit'}) + '</b>: ' + log.event + ' - ' + log.transactionHash + '</li>');
                }
            });
        }).catch(function(err) {
            console.log(err.message);
        });
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});