const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "ATsFNgV_7aFXU833uafFosWeYn8zk3GCv6z1MKqHdG7hK3__xpW4cmqlDCZKN4J8wkH9wmnRE0EF59Cq",
  client_secret: "EP8ByjGvu64BuKYD0NEZmIjN2rvBZDLCjfFllJhbqI_5J4wGlcn4GrCtmLOgXqkxtNC3_wnUh1h8HcE2",
});

module.exports = paypal;
