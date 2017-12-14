if(process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://AlanT:jabon@ds029436.mlab.com:29436/jabon-prod'
    }
}
else {
    module.exports = {
        mongoURI: 'mongodb://localhost/jabon-dev'
    }
}