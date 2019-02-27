# Supply Chain DApp
DApp supply chain that lets you track wine authenticity on the Ethereum blockchain.<hr />
![DApp screenshot](src/img/wineDApp.jpg?raw=true "Wine Supply Chain DApp")
## Setup project:
__Notes:__ The project has been tested with __Truffle v5.0.4__, __Solidity 0.5.0__ and __npm v10.15.1__
1. Clone the repository
2. Run command __npm install__ to install the project dependencies.
3. Start Ganache
4. __truffle compile --all__
4. __truffle --network ganache migrate --reset__
3. __npm run dev__ to run the application

## Contract on Rinkeby

| Contract address on Rinkeby test network                           | 
|--------------------------------------------------------------------|
| *******************************************                        |



## UML:
__IMPORTANT NOTE__: __Activity__, __sequence__ and __state__ diagrams have been updated.
Consumer __buyWine__ has been renamed __purchaseWine__ to remove ambiguity with retailer __buyWine__.

---
##### Activity diagram
![Activity diagram](UML/ACTIVITY.png?raw=true "Activity")

---
##### Sequence diagram
![Sequence diagram](UML/SEQUENCE.png?raw=true "Sequence")

---
##### State diagram
![State diagram](UML/STATE.png?raw=true "State")

---
##### Class diagram
![Class diagram](UML/CLASS.png?raw=true "Class")

## Credits
##### Wine supply chain
The basic concept fo the supply chain is trying to map the Wine Supply Chain Traceability GS1 Application Guideline:
* https://www.gs1us.org/DesktopModules/Bring2mind/DMX/Download.aspx?Command=Core_Download&EntryId=660&language=en-US&PortalId=0&TabId=134
##### Theme
*https://startbootstrap.com/themes/agency/
##### Images
* https://pixabay.com/en/wine-glass-white-grapes-drinks-1761613/