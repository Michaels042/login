const express = require("express");
const app = express();

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();

// console.log(salt);
// const password = "viral password";
// const hash = bcrypt.hashSync(password, salt);

// console.log(hash);

const port = 4000;

app.use(express.json({ limit: "5kb" }));
app.use(express.urlencoded({ extended: false }));

const DB = {
  users: [],
  admins: [],
};

function displayHome(req, res) {
  res.status(202).send(`App running on localhost 4000`);
}
// ..............................................................................
function getUser(req, res) {
  res.status(202).json({ status: "success", data: DB.users });
}
function createUser(req, res) {
  const newUser = req.body;

  //checks if user already exists before creating new user
  const userIndex = DB.users.findIndex((user) => user.email === newUser.email);

  if (userIndex > -1) {
    res
      .status(409)
      .json({ status: "unsuccessful", message: "User already exists" });
    // res.status(400).json({
    //   success: false,
    //   message: "User already exists",
    // });
  } else {
    const password = newUser.password;
    const passwordHash = bcrypt.hashSync(password, salt);

    newUser.password = passwordHash;
    DB.users.push(newUser);
    res.status(201).json({
      status: "successful",
      message: "User created successfully",
    });
  }
}
// .....................................................................................................................................

function getAdmin(req, res) {
  res.status(202).json({ status: "success", data: DB.admins });
}

function createAdmin(req, res) {
  const admin = req.body;
  //logic for creating new Admin
  DB.admins.push(admin);
  res
    .status(201)
    .json({ status: "success", message: "Admin created successfully" });
}

//...........................................................................................................................................

let userLogin = (req, res) => {
  let { email, password } = req.body;
  if (email == "" || password == "") {
    res.status(401).json({
      status: "unsuccessful",
      message: "Please input email or password",
    });
  } else {
    let userExist = DB.users.filter((user) => user.email === email);
    if (userExist.length == 0) {
      res
        .status(404)
        .json({ status: "unsuccessful", message: "Incorrect Email/Password" });
    } else {
      if (bcrypt.compareSync(password, userExist[0].password)) {
        res
          .status(200)
          .json({ status: "success", message: "User loggedin successfully" });
      } else {
        res
          .status(404)
          .json({
            status: "unsuccessful",
            message: "Incorrect Email/Password",
          });
      }
    }
  }
};

// app.post("/auth/signup", createUser);
app.post("/auth/login", userLogin);

//.................................................................................................................................................
//displays the base route
app.get("/", displayHome);

//gets all users
app.get("/users", getUser);

app.post("/users", createUser);

//gets all admins
app.get("/admins", getAdmin);

app.post("/admins", createAdmin);

//starts the server
app.listen(port, () => {
  console.log(`I am listening on port ${port}`);
});
