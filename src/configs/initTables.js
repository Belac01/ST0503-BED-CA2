const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}

bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

    const SQLSTATEMENT = `

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
      
      


      `;

    pool.query(SQLSTATEMENT, callback);  
  }
});  