const express = require("express");
const signupData = require('./dbconn');
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const app = express();
const methodOverride = require('method-override');
const auth = require('./auht');


const staticPath = path.join(__dirname, "../public");
// console.log(staticPath);
app.use(express.static(staticPath));


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.use(methodOverride('_method'))

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
});

app.get('/user', auth, function (req, res) {
    signupData.find({}, function (err, users) {

        res.render('index', {
            usersList: users
        })
    })
});

app.get("/delete", async (req, res) => {
    console.log(req.query.id);
    try {
        const result = await signupData.findByIdAndDelete(req.query.id)
        if (!req.query.id) {
            return res.status(404).send('Not Found')
        } else {
            console.log(result);
        }
        res.redirect('/user')
    } catch (error) {
        console.log(error);
    }

});


app.post('/signup', async (req, res) => {
    // console.log(req.body);

    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password == confirmPassword) {
            const xyz = new signupData({
                name: req.body.name,
                username: req.body.username,
                birthday: req.body.birthday,
                gender: req.body.gender,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            })
            const token = await xyz.generateToken()
            // console.log(token);
            res.cookie('signupCookies', token)
            const abc = await xyz.save();
            console.log(abc)
            // res.sendFile(path.join(__dirname, "../public/index.html"));
            res.send(abc);
        } else {
            res.send("Password not match")
        }
    } catch (error) {
        console.log(error)
    }

})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});


app.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const pass = await signupData.findOne({
        username
    })
    const token = await pass.generateToken()
    // console.log(token);
    res.cookie('loginCookies', token)
    if (!pass) {
        res.send('User not found').status(404);
    } else {

        console.log(pass)

        if (pass.password === password) {
            signupData.find({}, (err, found) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(found)
                    // res.redirect('/user')
                    // console.log(found)
                }
            })
        } else {
            res.send("Invalid Credentials")
        }
    }
})

app.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token;
        });
        console.log(req.user.tokens)
        //  all logout -----===>>>
        req.user.tokens = []
        res.clearCookie()
        // res.clearCookie("loginCookies");
        console.log("Logout Successfully..!!");
        await req.user.save();
        res.status(200).redirect("/");
    } catch (error) {
        res.status(501).send(error);
    }
})


app.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const newdata = await signupData.findById({_id: id})
        // console.log(newdata);
        if (newdata) {
            res.render('edit', {users: newdata})
        } else {
            res.redirect('/user')
        }
    } catch (error) {
        console.log(error);
    }
});


// update ======>>>>>>

app.post('/edit/:id', async (req, res) => {
    try {
        const id = req.body.users_id;
        const name = req.body.name;
        const username = req.body.username;
        const email = req.body.email;
        const phone = req.body.phone;
        const updatedData = await signupData.findByIdAndUpdate({_id: id}, {$set: {name, username, email, phone}})
        console.log(updatedData);
        res.redirect('/user')
    } catch (error) {
        console.log(error);
    }
})

app.get('/profile/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const newdata = await signupData.findById({_id: id})
        // console.log(newdata);
        if (newdata) {
            res.render('profile', {users: newdata})
        } else {
            res.redirect('/user')
        }
    } catch (error) {
        console.log(error);
    }
})


app.listen(3002, () => {
    console.log("listening at port 3002");
});
