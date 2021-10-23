const express = require('express')
const app = express()
const config = require('./config/key');
const {User} = require("./model/User");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))


app.get('/',(req,res) => res.send('히히히 자바'))

app.post('/api/users/register', (req,res) => {
    // 회원가입에 필요한 정보들을 client에서 가져오면 해당정보들은 DB에 넣어준다.
    const user = new User(req.body)

    // 모델에 세이브하기전 암호화를 먼저 시켜줘야한다 (모델에 userSchma.pre('save') 를 쓰면 save하기전에 뭔가를 해라 라고 지시함 )

    user.save((err,userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req,res) => {
    
    // 요청된 이메일을 데이터베이스에서 있는지 찾아본다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없당"
            })       
        }


        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.

        user.comparePassword(req.body.password, (err, isMatch ) => {
            if(!isMatch)
            return res.json({ loginSuccess: false, message: "비밀번호틀림~"  })
        
            user.makeToken((err , user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디에 ???? 쿠키? 로컬스토리지 ? 어디가 가장안전한가에 대한건 논란이있당 .
                res.cookie("x_auth", user.token) 
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
           })
        })
    })
})

// Router로 나중에 정리를함   <- express 에서 제공함


app.get('/api/users/auth', auth ,(req,res) => {
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 authentication이 true라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})


app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" }
        , (err, user) => {
            if(err) return res.json({ success: false , err});
            return res.status(200).send({
                success: true
            })
        })
})

app.get('/api/hello', (req, res) => {
    
    res.send("안녕하세요 적당히 바람이 시원해 너무 기분이 좋아요 ~ 유후")
})

const port = 5000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
