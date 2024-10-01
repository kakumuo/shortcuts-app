# A simple shortcut application

> Dependencies - Frontend
- React
- Typescript
- JOY MaterialUI

> Dependencies - Backend
- Typescript
- Express
- MongoDB
- Mongoose

> References
- Inspo: 

> To Run: 
1. `npm run start` To run frontend
2. `npm run start --prefix src_backend` To run backend
3. `mongosh mongodb://192.168.0.171:27017/ShortcutAppDB` To connect to mongo instance


> Todo: 
- ~~Add more shortcut, shortcutGroups and applications into the DB~~
- ~~Allow for keyboard sequences and alternate shortcut inputs~~
- ~~Allow for shortcuts to be added and removed through the UI ~~
    - ~~JSON Edit ~~ [removed]
    - ~~Key-Value Edit~~
- Create favorites section in sidebar
- Allow for main page color scheme to be changed from select color schemes
- Allow for main page themes to be changed from select themes
- General beautification 



> Things to keep in mind in the next iteration: 
- If the app is small, create mongoose db structure as a single record instead of multiple individual record; did not need to create a separate record for shortcut, shortcut group and application since the project navigation path would not allow for individual components to be retrieved without having to pass through application > shortcut group > shortcut
- Make use of React.createContext and React.useContext more often, especially in large component/page files. 