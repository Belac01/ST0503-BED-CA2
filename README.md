# Starter Repository for BED CA2 ASSIGNMENT

## Sections of the README
|Section|
|---|
|[Prerequisites or dependencies](https://github.com/ST0503-BED/bed-ca2-Belac01#prerequisites-or-dependencies)|
|[How to run](https://github.com/ST0503-BED/bed-ca2-Belac01#how-to-run)|
|[Folder structure](https://github.com/ST0503-BED/bed-ca2-Belac01#folder-structure)|
|[Dbdiagram](https://github.com/ST0503-BED/bed-ca2-Belac01#dbdiagram)|
|[Website details](https://github.com/ST0503-BED/bed-ca2-Belac01/tree/main#website-details)|
|[MYSQL tables](https://github.com/ST0503-BED/bed-ca2-Belac01#mysql-tables)|



## Prerequisites or dependencies
> [!WARNING]
> Before running the tests, ensure that the following prerequisites are installed:
> - Node.js
> - npm (Node Package Manager)

> [!WARNING]
>Before running the the tests, ensure that the following dependencies are installed:
> - dotenv
> - express
> - mysql2
> - nodemon
> - bcrypt
> - jsonwebtoken

> [!TIP]
> Under integrated terminal of the root directory run the code ```npm run dotenv express mysql2 nodemon bcrypt jsonwebtoken``` to install the required dependencies before continuing.

--- 

## How to run
1. To run the code, in integrated terminal use the code```npm run init_tables``` to first reset the tables.
2. Run the code ```npm run dev``` to start.
3. Go to your prefered web browser and enter the into the url localhost:3000

---

## Folder Structure

```
- bed-ca2-Belac01
    ├── node_modules
    ├── public
    |    ├── css
    |    ├── images
    |    └── js
    ├── src
    |    ├── configs
    |    |    └── initTables.js
    |    ├── controllers
    |    |    ├── guildController.js
    |    |    ├── messageController.js
    |    |    ├── shopController.js 
    |    |    ├── taskController.js 
    |    |    ├── taskProgressController.js 
    |    |    └── userController.js
    |    ├── middlewares
    |    |    ├── bcryptMiddleware.js
    |    |    ├── jwtMiddleware.js
    |    |    └── middleware.js
    |    ├── models
    |    |    ├── guildModel.js
    |    |    ├── messageModel.js
    |    |    ├── shopModel.js
    |    |    ├── taskModel.js
    |    |    ├── taskProgressModel.js
    |    |    └── userModel.js      
    |    ├── routes
    |    |    ├── guildRoutes.js
    |    |    ├── mainRoutes.js
    |    |    ├── messagingRoutes.js
    |    |    ├── shopRoutes.js
    |    |    ├── taskRoutes.js
    |    |    ├── taskProgressRoutes.js
    |    |    └── userRoutes.js
    |    ├── services
    |    |    └──db.js
    |    └── app.js
    ├── .env
    ├── .gitignore
    ├── index.js
    ├── package-lock.json
    ├── package.json
    └── README.md         
```
---

## Dbdiagram

![image](https://github.com/ST0503-BED/bed-ca1-Belac01/assets/148026391/f8bc23d3-992e-4490-9efb-12334d9f10d8)

---

## Website details

|Tabs|
|---|
|[Home](https://github.com/ST0503-BED/bed-ca2-Belac01#home)|
|[Users](https://github.com/ST0503-BED/bed-ca2-Belac01#users)|
|[Tasks](https://github.com/ST0503-BED/bed-ca2-Belac01#tasks)|
|[TaskProgress](https://github.com/ST0503-BED/bed-ca2-Belac01#taskprogress)|
|[Shop](https://github.com/ST0503-BED/bed-ca2-Belac01#shop)|
|[Inventory](https://github.com/ST0503-BED/bed-ca2-Belac01#inventory)|
|[Guild](https://github.com/ST0503-BED/bed-ca2-Belac01#inventory)|
|[Messaging Forum](https://github.com/ST0503-BED/bed-ca2-Belac01#messaging-forum)|
|[Profile](https://github.com/ST0503-BED/bed-ca2-Belac01#profile)|
|[Login](https://github.com/ST0503-BED/bed-ca2-Belac01#login)|
|[Register](https://github.com/ST0503-BED/bed-ca2-Belac01#register)|

---

### Home

---

This is the homepage where all users will start at. It contains basic information about the website and what you can do with the website. 

Features:
- Information about this website
    - Provides the purpose of the website and provides the link to the source code through extra information tab.
- How to get started
    - Provides information to the user on how to begin using the website with pictures showcasing some steps.
- What each tab does
  - Provides description of the purpose of each tab in the nav bar.
- Get to know me
  - Information of who created the website
- My mission
  - Some made up informatation on my aim for the website.        

Code:  
- Homepage design
  - HTML: index.html
  - CSS: color.css & style.css  

---

### Users

---

This is the Users tab which displays every user that has been created through registering.

Features:
- Displays all users to anyone visiting the website
  - Shows the username and time created for each user displayed.
  - Login not required to view all users.
- Displays specific user information
  - Clicking the button within each user card brings the user to the user specific information page for whichever user the button was clicked under.
  - Information such as User ID, Username, Email, Total Points, will only be displayed for the user of the user card.
  - Displays "You do not have the right to view another user information" if the user that clicked the button is not the same user for the card.
  - Login to the user you want to view information for is needed. 

Code:
- Ability to show all users
  - Route used: router.get('/', controller.readAllUser);
  - JS: showAllUsers.js
  - HTML: users.html  
- Ability to show specific user
  - Route used: router.get('/:id', jwtMiddleware.verifyToken, controller.readUserById);
  - JS: getSingleUserInfo.js
  - HTML: singleUserInfo.html

---

### Tasks

---

This is the task page which displays all avaliable tasks for the user to aim and complete. Creation of tasks and updating of tasks is not implemented as this is similar to quests in games. Users are not the ones adding or updating their own quests but quests are usually added or updated by developers through backend updates.

Features:
- Displays all tasks to anyone visiting the website
  - Shows the corresponing Task Image, Task ID, Description and Points given for each task displayed.
  - Login not required to view all tasks.

Code:
- Ability to show all tasks
  - Route used: router.get('/', controller.readAllTasks);
  - JS: showAllTasks.js
  - HTML: tasks.html  

---

### TaskProgress

---

This is the task progress page which displays all the tasks that the user has completed.

Features:
- Displays all tasks that the user has completed as task progress
  - Shows the corresponding Task Image, Task ID, Completion Date, Notes for each task completed.
  - Login is required to view task progress. Alert box will pop up to remind user to log in to view task progress.
- Allows for creation of a completed task
  - Clicking the button called "Create task progress" brings the user to a task progress creation page.
  - Information such as Task ID, Completion Date, Notes will be required to be filled in by the user while User ID will automatically be filled for the user.
  - Displays "The task ID is invalid" if the user tries to input an invalid task ID.
  - Login is required to create a task progress. Warning card with "Please log in" will pop up to remind user to login if user tries to create task progress.

Code:
- Ability to show all of the logged in user task progress
  - Route used: router.get('/users/:id', jwtMiddleware.verifyToken, controller.readTaskByUserId);
  - JS: showTaskProgress.js
  - HTML: showTaskProgress.html  
- Ability to create a new task progress
  - Route used: router.post('/', jwtMiddleware.verifyToken, controller.createNewTaskProgress);
  - JS: createTaskProgress.js
  - HTML: createTaskProgress.html

---

### Shop

---

This is the shop page which displays all the shop items that the user is able to purchase. Creation and updating of items in the shop is not implemented as this is similar to NPC shops in games. Users are not the ones adding or updating the shop tables but shop tables are usually added or updated by developers through backend updates. 

Features:
- Displays all shop items that can be purchased using Eco-coins
  - Shows the corresponding Shop Item Image, Item ID, Eco-coins required and Description for each shop item.
  - Login is not required to view the shop items.
- Allows for purchase of shop items using Eco-coins
  - Clicking the button called "Buy Item" brings the user to a confirm purchase page.
  - Information such as User ID, Item ID will be automatically be filled in for the user. The user just needs to press "Confirm Purchase" button to buy the item and add it to user inventory.
  - The amount of Eco-coins will automatically be deducted from the user upon successful purchase.
  - Displays "Successfully Purchased" upon successful purchase of the item with the "Go Back" button to continue shopping.
  - Displays "Insufficient balance to buy the item." if the user tries to purchase the item with insufficient Eco-coins.
  - Login is required to purchase item. Warning card with "Please log in" will pop up to remind user to login if user tries to purchase the item from the shop.

Code:
- Ability to show all of the shop items
  - Route used: router.get('/', controller.readAllShop);
  - JS: displayAllShop.js
  - HTML: displayAllShop.html  
- Ability to buy item from shop
  - Route used: router.post('/buy/:userId/:itemId', jwtMiddleware.verifyToken, controller.buyItem);
  - JS: buyShopItem.js
  - HTML: buyShopItem.html
- Successfully purchased page
  - HTML: successBuy.html

---

### Inventory

---

This is the inventory page which displays all the items that the user has purchased.

Features:
- Displays all items that the user has purchased
  - Shows the corresponding Item Image, Acquistion Date and Description for each inventory item.
  - Login is required to view the inventory items. Alert box will pop up to remind user to log in to view inventory.
- Allows for deletion of inventory items
  - Clicking the button called "Delete" allows the user delete the item from the inventory.

Code:
- Ability to show all of the inventory items
  - Route used: router.get('/', controller.readAllShop);
  - JS: displayAllShop.js
  - HTML: displayAllShop.html  
- Ability to buy item from shop
  - Route used: router.get('/:id/inventory', jwtMiddleware.verifyToken, controller.readUserInventory);
  - JS: displayUserInventory.js
  - HTML: displayUserInventory.html
- Ability to delete item from inventory
  - Route used: router.delete('/:id/inventory/:inventoryid', controller.deleteUserInventoryById);
  - JS: deleteUserInventoryItem.js
  - HTML: displayUserInventory.js

---

### Guilds

---

This is the guilds page which displays all the guilds that any user has created as a leader.

Features:
- Displays all guilds that have been created
  - Shows the corresponding Guild Name, Description, Creation Date and Leader Username for each guild created.
  - Login is not required to view the guilds.
- Ability to create a guild as a leader
  - Clicking the button called "Create guild" allows the user to create a new guild as a leader.
  - Information such as Guild Name and Description will be required to be filled in by the user while User ID will automatically be filled.
  - Displays "Successfully created guild" upon successful creation of a guild.
  - If a similar name is inputted, warning card with "A guild with this name already exists." will pop up.
  - If the user already owns a guild, or is a member of a existing guild, warning card with "You already have a guild." will pop up.
  - Login is required to create a guild. Warning card with "Please log in" will pop up to remind user to login if user tries to create a guild when not logged in.
- Ability to join a guild as a member
  - Clicking the button called "Join guild" allows the user to join an existing guild as a member.
  - Displays "Successfully joined the guild! Guild Name: xxx, Your Role: Member" as a warning card upon successful joining of a guild.
  - If the user already owns a guild, or is a member of a existing guild, warning card with "You are already in a guild." will pop up.
  - Login is required to create a guild. Warning card with "Please log in" will pop up to remind user to login if user tries to join a guild when not logged in.
- Ability to leave a guild as a member
  - Clicking the button called "Leave guild" allows the user to leave the current guild as a member.
  - Displays "Successfully left the guild!" as a warning card upon the successful leaving of a guild.
  - If the user is not part of any guild, warning card with "Not currently in a guild." will pop up.
  - If the user is a guild leader, warning card with "Leaders cannot leave the guild." will pop up.
  - Login is required to leave a guild. Warning card with "Please log in" will pop up to remind user to login if user tries to leave a guild when not logged in.
- Ability to disband a guild as a leader
  - Clicking the button called "Disband Guild" allows the user to disband the guild as a leader.
  - Displays "Successfully disbanded the guild! Refresh to see changes!" as a warning card upon the successful disbanding of a guild.
  - If the user is not a guild leader, warning card with "You are not the leader." will pop up.
  - Login is required to disband a guild. Warning card with "Please log in" will pop up to remind user to login if user tries to disband a guild when not logged in.
- Displays specific guild information
  - Clicking the button called "View Details" allows the user view more detailed and specific guild information such as Description, Creation Date, Leader ID, Leader Username, Members currently in the guild with their respective roles such as "Leader" or "Member"
- Login is not required to view a guild information.

Code:
- Ability to show all of the existing guilds
  - Route used: router.get('/', controller.readAllGuilds);
  - JS: showAllGuilds.js
  - HTML: showAllGuilds.html  
- Ability to create guild
  - Route used: router.post('/create/:userId', jwtMiddleware.verifyToken, controller.createGuild);
  - JS: createGuild.js
  - HTML: createGuild.html
- Ability to join a guild as a member
  - Route used: router.post('/join/:guildId/:userId', jwtMiddleware.verifyToken, controller.joinGuild);
  - JS: joinGuild.js
  - HTML: showAllGuilds.html
- Ability to leave a guild as a member
  - Route used: router.delete('/leave/:userId', jwtMiddleware.verifyToken, controller.leaveGuild);
  - JS: leaveGuild.js
  - HTML: showAllGuilds.html
- Ability to disband a guild as a leader
  - Route used: router.delete('/disband/:guildId/:userId', jwtMiddleware.verifyToken, controller.disbandGuild);
  - JS: disbandGuild.js
  - HTML: showAllGuilds.html        
- Ability to view more details of a single guild
  - Route used: router.get('/:guildid', controller.readGuildById);
  - JS: showSingleGuildInfo.js
  - HTML: showSingleGuildInfo.html
- Successful guild creation page
  - HTML: successGuildCreation.html 


---

### Messaging Forum

---

This is the messaging forum page which displays all the messages that users have posted and also allows for posting, editing and deletion of messages.

Features:
- Displays all messages posted by different users
  - Shows the Username, Message, Created at and updated at (if message was edited) for each message.
  - Login is not required to view all messages.
- Ability to post messages
  - Typing the message and clicking the button called "Send" allows the user post the message.
  - Login is required to post a message. Warning card with "Please log in" will pop up to remind user to login if user tries to post a message when not logged in.   
- Ability to edit the messages
  - Clicking the button called "Edit" allows the user edit the message.
  - Clicking the button called "Save" allows the user save the edited message.
  - The edit button will only appear for the messages the user has posted.
  - Editing the message will create a updated at time do tell the difference between orignal and edited messages.
- Allows for deleting of message  
  - Clicking the button called "Delete" allows the user edit the message.
  - The delete button will only appear for the messages the user has posted.

Code:
- Ability to show all messages
  - Route used: router.get('/', controller.readAllShop);
  - JS: showAllMessages.js
  - HTML: message.html  
- Ability to post messages
  - Route used: router.post('/', jwtMiddleware.verifyToken, controller.createMessage);
  - JS: createMessage.js
  - HTML: message.html
- Ability to edit messages
  - Route used: router.put('/:id', jwtMiddleware.verifyToken, controller.updateMessageById);
  - JS: editMessage.js
  - HTML: message.html
- Ability to delete messages
  - Route used: router.delete('/:id', jwtMiddleware.verifyToken, controller.deleteMessageById);
  - JS: deleteMessage.js
  - HTML: message.html  


---  

### Profile

---

This is the profile page for which displays all the information that is associated with the user logged in.

Features:
- Displays all information related to the user
  - Shows the User ID Username, Email, Created on, Total points, Wallet ID, Eco-coins, Guild Name and Inventory.
  - Login is required to view profile as the profile button to get to profile will replace the login button upon successful login.
- Ability to update user details
  - Clicking the button called "Update User Details here" brings the user to an update user details page to edit their user details.
  - User is able to update Username, Email and their password. There is a confirm password to prevent them from inputing the wrong password.
  - Successful update of details brings the user to a successful update details page.
  - If a username or email already exists, a warning card will appear with "Username or email already exists".
  - If the new password inputted do not match, a warning card will appear with "New passwords do not match".
  - Login is required as the button is located in the profile. 

Code:
- Ability to view user profile
  - Route used: router.get('/:id/profile', jwtMiddleware.verifyToken, controller.readUserProfile);
  - JS: getProfile.js
  - HTML: profile.html  
- Ability to update user details
  - Route used: router.put('/:id', jwtMiddleware.verifyToken, middleware.checkUserById, controller.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, controller.updateUserById);
  - JS: createMessage.js
  - HTML: updateUpdateUserDetail.html
- Successful user detail update page  
  - HTML: successUpdateUserDetail.html

---

### Login

---

This is the login page that allows the user to login.

Features:
- Allows the user to login to his registered account
  - User inputs his chosen username and password into the boxes.
  - Successful login brings the user to a successful login page.
  - If a username is incorrect, a warning card will appear with "User not found".
  - If a password is incorrect, a warning card will appear with "Wrong password".

Code:
- Ability to login
  - Route used: router.post("/login", controller.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
  - JS: getProfile.js
  - HTML: profile.html  
- Ability to update user details
  - Route used: router.put('/:id', jwtMiddleware.verifyToken, middleware.checkUserById, controller.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, controller.updateUserById);
  - JS: loginUser.js
  - HTML: login.html
- Successful login page
  - HTML: successLogin.html

---

### Register

---

This is the register page that allows the user to register.

Features:
- Allows the user to register for an account
  - User inputs his chosen username, password and email into the boxes.
  - Successful registration brings the user to a successful register page and auto login the user into his account.
  - If a username or email already exists, a warning card will appear with "Username or email already exists".
  - If a password inputted do not match, a warning card will appear with "Passwords do not match".

Code:
- Ability to login
  - Route used: router.post("/login", controller.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
  - JS: registerUser.js
  - HTML: register.html  
- Successful register page
  - HTML: successRegister.html

---

## MYSQL TABLES

```sql
DROP TABLE IF EXISTS GuildMember; 

      DROP TABLE IF EXISTS UserWallet;

      DROP TABLE IF EXISTS Shop;

      DROP TABLE IF EXISTS UserInventory;

      DROP TABLE IF EXISTS User;

      DROP TABLE IF EXISTS Task;

      DROP TABLE IF EXISTS TaskProgress;

      DROP TABLE IF EXISTS Guild;

      DROP TABLE IF EXISTS Messages;

      CREATE TABLE User (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username TEXT,
        password TEXT NOT NULL,
        email TEXT,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE Task (
        task_id INT PRIMARY KEY AUTO_INCREMENT,
        title TEXT,
        description TEXT,
        points INT
      );

      CREATE TABLE TaskProgress (
        progress_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        task_id INT NOT NULL,
        completion_date TIMESTAMP,
        notes TEXT
      );

      INSERT INTO Task (task_id, title, description, points) VALUES
      (1, 'Plant a Tree', 'Plant a tree in your neighbourhood or a designated green area.', '50'),
      (2, 'Use Public Transportation', 'Use public transportation or carpool instead of driving alone.', '30'),
      (3, 'Reduce Plastic Usage', 'Commit to using reusable bags and containers.', '40'),
      (4, 'Energy Conservation', 'Turn off lights and appliances when not in use.', '25'),
      (5, 'Composting', 'Start composting kitchen scraps to create natural fertilizer.', '35');


      CREATE TABLE UserWallet (
        wallet_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL UNIQUE,
        balance INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES User(user_id)
      );

      CREATE TABLE Shop (
        item_id INT PRIMARY KEY AUTO_INCREMENT,
        item_name TEXT,
        points_required INT,
        description TEXT
      );

      CREATE TABLE UserInventory (
        inventory_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        item_id INT,
        item_name TEXT,
        description TEXT,
        acquisition_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id)
      );

      CREATE TABLE Guild (
        guild_id INT PRIMARY KEY AUTO_INCREMENT,
        guild_name TEXT,
        leader_id INT NOT NULL,
        description TEXT,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE GuildMember (
        membership_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        guild_id INT NOT NULL,
        role TEXT,
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (guild_id) REFERENCES Guild(guild_id)
      );

      INSERT INTO Shop (item_id, item_name, points_required, description) VALUES
      (1, 'Tree Sapling', 20, 'A small sapling to plant in your area.'),
      (2, 'Reusable Water Bottle', 15, 'Help reduce plastic usage with a reusable water bottle.'),
      (3, 'LED Bulbs Pack', 30, 'Save energy by replacing old bulbs with energy-efficient LED bulbs.'),
      (4, 'Compost Bin', 25, 'A bin for composting kitchen scraps.'),
      (5, 'Public Transportation Pass', 40, 'Access to public transportation for a month.');  

      CREATE TABLE Messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        message_text TEXT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
```