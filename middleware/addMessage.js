
module.exports = (req, res, next) => {
    // Define addMessage method on req
    req.addMessage = (type, message) => {
      if (!req.session.messages) {
        req.session.messages = [];
      }
      req.session.messages.push({ type, message });
    };
  
    // Expose messages to the views
    res.locals.messages = req.session.messages || [];
    
    // Clear messages after they are accessed
    req.session.messages = [];
    
    next();
  };
  