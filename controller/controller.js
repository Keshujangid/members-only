const bcrypt = require('bcryptjs')
const query = require('../db/query');
const pool = require('../db/pool');
require('dotenv').config();

async function home(req, res) {
  const messages = await query.getAllMessages();
  res.render('index', { user: req.user, messages: messages });
}

function getLogin(req, res) {
  res.render('log-in', { message: null });
}

function postLogin(req, res) {
  const messages = req.flash('error'); // Get messages with the type 'error'
  console.log('here', messages);

  if (messages.length > 0) {
    const message = messages[0]; // Get the first message
    res.render('log-in', { message: message });
  } else {
    // User successfully logged in, redirect or render a different page
    res.redirect('/');
  }
}

function getSignUp(req, res) {
  res.render('sign-up', { formData: '' });
}

async function postSignUp(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await query.storeUser(req.body, hashedPassword)

    res.redirect('/');

  } catch (error) {
    console.log(error)
  }
}

function showMessageForm(req, res) {
  res.render('messageForm', { formData: req.body });
}

function messageHandler(req, res) {
  try {
    const messageObj = {
      title: req.body.title,
      body: req.body.body,
      username: req.user.username
    }
    query.addMessage(messageObj)
    console.log(req.body);
    console.log('Message added successfully');
    res.redirect('/');

  } catch (error) {
    res.locals.errors = error.array();
    res.redirect('/addMessage', { fromData: req.body });
  }

}


function addMember(req, res) {
  res.render('memberForm');
}

async function postAddMember(req, res) {
  try {
    console.log(req.body);
    if (req.body.secretKey === process.env.SECRET_KEY) {
      console.log(req.user.id);
      await query.updateMembership(req.user.id);
      console.log('You are a member');
    }
    else {
      console.log('You are not a member');
    }
    res.redirect('/');

  } catch (error) {
    res.locals.errors = error.array();
    res.render('memberForm');
  }
}

function getAdmin(req, res) {
  res.render('admin');
}

function postAdmin(req, res) {
  if (req.body.admin === process.env.ADMIN_KEY) {
    console.log('You are an admin');
    query.updateAdminStatus(req.user.id);
    res.redirect('/');
    return;
  } else {
    console.log('You are not an admin');
    res.redirect('/');

  }
}

function deleteMessage(req, res) {
  console.log(req.params.id);
  query.deleteMessage(req.params.id);
  res.redirect('/');
}

module.exports = {
  home,
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
  showMessageForm,
  messageHandler,
  addMember,
  postAddMember,
  getAdmin,
  postAdmin,
  deleteMessage
}