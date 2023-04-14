const healthChecker = async (req, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: "I Am Working Bro!!!!",
      timeStamp: new Date().toLocaleDateString("en-us"),
    };
    try {
      res.status(200).send(healthcheck);
    } catch (error) {
      healthcheck.message = error;
      res.status(503).send();
    }
  };
  
  module.exports = { healthChecker };